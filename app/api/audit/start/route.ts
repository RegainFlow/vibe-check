import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { inngest } from "@/lib/inngest/client";
import { PLANS } from "@/lib/constants";
import type { PlanType } from "@/lib/constants";

const startAuditSchema = z.object({
  repoUrl: z.string().url(),
  source: z.enum(["github", "zip"]),
}).refine(
  (data) => {
    if (data.source === "github") {
      return /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+/.test(data.repoUrl);
    }
    return true;
  },
  { message: "Invalid GitHub URL", path: ["repoUrl"] }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = startAuditSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { repoUrl, source } = parsed.data;

    // Get user (optional — anonymous audits allowed)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const admin = createAdminClient();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    let auditsUsedThisMonth = 0;

    // If authenticated, check usage limits
    if (user) {
      const { data: profile, error: profileError } = await admin
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: "Failed to fetch user profile" },
          { status: 500 }
        );
      }

      auditsUsedThisMonth = profile.audits_used_this_month;
      const userPlan = PLANS[profile.plan as PlanType];
      if (profile.audits_used_this_month >= userPlan.auditsPerMonth) {
        return NextResponse.json(
          { error: "Monthly audit limit reached. Upgrade your plan for more audits." },
          { status: 429 }
        );
      }
    } else {
      // Anonymous rate limit: 1 audit per IP
      const { count } = await admin
        .from("audits")
        .select("*", { count: "exact", head: true })
        .is("user_id", null)
        .eq("metadata->>ip", ip);

      if (count && count >= 1) {
        return NextResponse.json(
          { error: "Anonymous audit limit reached. Sign in for more audits." },
          { status: 429 }
        );
      }
    }

    // Create audit record
    const { data: audit, error: insertError } = await admin
      .from("audits")
      .insert({
        repo_url: repoUrl,
        user_id: user?.id ?? null,
        status: "pending",
        ...(user ? {} : { metadata: { ip } }),
      })
      .select("id")
      .single();

    if (insertError || !audit) {
      return NextResponse.json(
        { error: "Failed to create audit" },
        { status: 500 }
      );
    }

    // Increment usage counter for authenticated users
    if (user) {
      await admin
        .from("profiles")
        .update({ audits_used_this_month: auditsUsedThisMonth + 1 })
        .eq("id", user.id);
    }

    // Trigger Inngest event
    await inngest.send({
      name: "audit/started",
      data: {
        auditId: audit.id,
        repoUrl,
        source,
        userId: user?.id ?? null,
      },
    });

    return NextResponse.json({ auditId: audit.id }, { status: 201 });
  } catch (error) {
    console.error("Start audit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
