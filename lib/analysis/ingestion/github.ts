import simpleGit from "simple-git";
import * as fs from "fs/promises";
import * as path from "path";

const GITHUB_URL_PATTERN = /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+(\.git)?$/;
const GENERIC_GIT_URL_PATTERN = /^https?:\/\/.+\/[\w.-]+\/[\w.-]+(\.git)?$/;

/**
 * Validate that a URL looks like a valid Git repository URL.
 */
function isValidRepoUrl(url: string): boolean {
  return GITHUB_URL_PATTERN.test(url) || GENERIC_GIT_URL_PATTERN.test(url);
}

/**
 * Clone a Git repository with shallow depth for fast analysis.
 * Removes the .git directory after clone to save space.
 *
 * @param repoUrl - HTTPS URL of the Git repository
 * @param targetDir - Local directory to clone into
 */
export async function cloneRepo(
  repoUrl: string,
  targetDir: string
): Promise<string> {
  if (!isValidRepoUrl(repoUrl)) {
    throw new Error(
      `Invalid repository URL: ${repoUrl}. Must be an HTTPS Git URL (e.g., https://github.com/user/repo)`
    );
  }

  const git = simpleGit();

  // Shallow clone for speed — we only need the latest code, not history
  await git.clone(repoUrl, targetDir, [
    "--depth",
    "1",
    "--single-branch",
  ]);

  // Remove .git directory to save space and avoid scanning it
  const gitDir = path.join(targetDir, ".git");
  try {
    await fs.rm(gitDir, { recursive: true, force: true });
  } catch {
    // Non-critical — the scanner will skip .git anyway
  }

  return targetDir;
}
