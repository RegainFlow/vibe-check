import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const githubUrlSchema = z.object({
  url: z.string().url(),
});

const GITHUB_REPO_PATTERN =
  /^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/?$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = githubUrlSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { valid: false, error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const { url } = parsed.data;
    const match = url.match(GITHUB_REPO_PATTERN);

    if (!match) {
      return NextResponse.json({
        valid: false,
        error: "URL must match https://github.com/:owner/:repo",
      });
    }

    const owner = match[2];
    const repo = match[3];

    // Optionally check if the repo is accessible
    let accessible = true;
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        method: "HEAD",
        headers: {
          "User-Agent": "vibecheck",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
      });
      accessible = response.ok;
    } catch {
      // If the check fails, we still consider the URL structurally valid
      accessible = false;
    }

    return NextResponse.json({
      valid: true,
      owner,
      repo,
      accessible,
    });
  } catch (error) {
    console.error("GitHub validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
