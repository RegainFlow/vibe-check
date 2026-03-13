import * as fs from "fs/promises";
import * as path from "path";
import ignore from "ignore";
import { IGNORED_DIRS, IGNORED_EXTENSIONS, MAX_FILE_SIZE } from "@/lib/constants";
import type { FileEntry } from "@/lib/analysis/types";

type Ignore = ReturnType<typeof ignore>;

/**
 * Check if a file is likely binary by looking for null bytes
 * in the first 8KB of content.
 */
function isBinaryContent(buffer: Buffer): boolean {
  const sampleSize = Math.min(buffer.length, 8192);
  for (let i = 0; i < sampleSize; i++) {
    if (buffer[i] === 0) return true;
  }
  return false;
}

/**
 * Load .gitignore patterns from the base path, if a .gitignore file exists.
 */
async function loadGitignore(basePath: string): Promise<Ignore> {
  const ig = ignore();

  try {
    const gitignorePath = path.join(basePath, ".gitignore");
    const content = await fs.readFile(gitignorePath, "utf-8");
    ig.add(content);
  } catch {
    // No .gitignore file — that's fine
  }

  // Always ignore these directories regardless of .gitignore
  ig.add(IGNORED_DIRS.map((dir) => `${dir}/`));

  return ig;
}

/**
 * Recursively walk a directory and collect file entries for analysis.
 * Respects .gitignore patterns, skips ignored dirs/extensions,
 * binary files, and files exceeding MAX_FILE_SIZE.
 * Caps total files returned at maxFiles.
 */
export async function scanFiles(
  basePath: string,
  maxFiles: number
): Promise<FileEntry[]> {
  const ig = await loadGitignore(basePath);
  const files: FileEntry[] = [];

  async function walk(dirPath: string): Promise<void> {
    if (files.length >= maxFiles) return;

    let entries;
    try {
      entries = await fs.readdir(dirPath, { withFileTypes: true });
    } catch {
      // Permission denied or other read error — skip this directory
      return;
    }

    for (const entry of entries) {
      if (files.length >= maxFiles) return;

      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(basePath, fullPath).replace(/\\/g, "/");

      // Check gitignore
      if (ig.ignores(relativePath)) continue;

      if (entry.isDirectory()) {
        // Skip explicitly ignored directories
        if (IGNORED_DIRS.includes(entry.name)) continue;
        await walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();

        // Skip ignored extensions
        if (IGNORED_EXTENSIONS.includes(ext)) continue;

        // Check file size
        try {
          const stat = await fs.stat(fullPath);
          if (stat.size > MAX_FILE_SIZE) continue;
          if (stat.size === 0) continue;
        } catch {
          continue;
        }

        // Read file and check if binary
        try {
          const buffer = await fs.readFile(fullPath);
          if (isBinaryContent(buffer)) continue;

          const content = buffer.toString("utf-8");
          const lineCount = content.split("\n").length;

          files.push({
            path: fullPath,
            relativePath,
            content,
            extension: ext,
            lineCount,
          });
        } catch {
          // Could not read file — skip
          continue;
        }
      }
    }
  }

  await walk(basePath);

  return files;
}
