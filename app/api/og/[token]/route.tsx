import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "edge";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data: audit } = await supabase
    .from("audits")
    .select("overall_score, scores, metadata, repo_url")
    .eq("share_token", token)
    .single();

  const score = audit?.overall_score ?? 0;
  const scores = audit?.scores as { grade?: string } | null;
  const grade = scores?.grade ?? "?";
  const metadata = audit?.metadata as { repoName?: string } | null;
  const repoName = metadata?.repoName ?? "Repository";

  const scoreColor = score >= 80 ? "#22C55E" : score >= 60 ? "#F59E0B" : "#EF4444";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0D17",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div style={{ fontSize: "32px", color: "#8B95A9" }}>
            VibeCheck Report
          </div>
          <div style={{ fontSize: "20px", color: "#F1F5F9" }}>{repoName}</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "200px",
              height: "200px",
              borderRadius: "100px",
              border: `8px solid ${scoreColor}`,
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: "64px",
                fontWeight: "bold",
                color: scoreColor,
              }}
            >
              {grade}
            </div>
            <div style={{ fontSize: "28px", color: "#F1F5F9" }}>
              {score}/100
            </div>
          </div>
          <div style={{ fontSize: "18px", color: "#7C3AED" }}>
            vibecheck.dev
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
