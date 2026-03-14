import * as fs from "fs/promises";
import { extractZip } from "./zip";

const GITHUB_URL_PATTERN = /^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/;

/**
 * Parse a GitHub URL into owner and repo.
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const match = url.match(GITHUB_URL_PATTERN);
  if (!match) {
    throw new Error(
      `Invalid GitHub URL: ${url}. Expected https://github.com/owner/repo`
    );
  }
  return { owner: match[2], repo: match[3].replace(/\.git$/, "") };
}

/**
 * Download a GitHub repository as a ZIP archive and extract it.
 * Uses GitHub's zipball API — no git binary required.
 *
 * @param repoUrl - HTTPS GitHub URL (e.g., https://github.com/user/repo)
 * @param targetDir - Local directory to extract into
 */
export async function cloneRepo(
  repoUrl: string,
  targetDir: string
): Promise<string> {
  const { owner, repo } = parseGitHubUrl(repoUrl);

  const zipUrl = `https://api.github.com/repos/${owner}/${repo}/zipball`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "VibeCheck/1.0",
  };

  // Use GitHub token if available (higher rate limits)
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(zipUrl, { headers });

  if (!res.ok) {
    throw new Error(
      `Failed to download repository: ${res.status} ${res.statusText}. ` +
        `Make sure ${owner}/${repo} is a public repository.`
    );
  }

  const buffer = Buffer.from(await res.arrayBuffer());

  await fs.mkdir(targetDir, { recursive: true });
  await extractZip(buffer, targetDir);

  return targetDir;
}
