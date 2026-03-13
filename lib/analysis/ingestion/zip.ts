import JSZip from "jszip";
import * as fs from "fs/promises";
import * as path from "path";
import { IGNORED_DIRS } from "@/lib/constants";

/**
 * Check if a zip entry path contains path traversal attempts.
 */
function hasPathTraversal(filePath: string): boolean {
  const normalized = path.normalize(filePath);
  return normalized.includes("..") || path.isAbsolute(normalized);
}

/**
 * Check if a path segment matches any ignored directory.
 */
function isInIgnoredDir(filePath: string): boolean {
  const segments = filePath.split(/[\\/]/);
  return segments.some((segment) => IGNORED_DIRS.includes(segment));
}

/**
 * Extract a ZIP buffer into a target directory.
 * Prevents path traversal attacks and skips ignored directories.
 *
 * @param buffer - ZIP file contents as a Buffer
 * @param targetDir - Local directory to extract into
 */
export async function extractZip(
  buffer: Buffer,
  targetDir: string
): Promise<void> {
  const zip = await JSZip.loadAsync(buffer);

  const entries = Object.entries(zip.files);

  for (const [relativePath, zipEntry] of entries) {
    // Skip directories (they'll be created when writing files)
    if (zipEntry.dir) continue;

    // Security: reject path traversal
    if (hasPathTraversal(relativePath)) {
      throw new Error(
        `Zip entry contains path traversal: ${relativePath}`
      );
    }

    // Skip files in ignored directories
    if (isInIgnoredDir(relativePath)) continue;

    // Strip leading directory if the zip has a single root folder
    // (common pattern from GitHub downloads: reponame-main/...)
    const outputRelativePath = relativePath;

    const outputPath = path.join(targetDir, outputRelativePath);

    // Ensure the output path is still within targetDir (defense in depth)
    const resolvedOutput = path.resolve(outputPath);
    const resolvedTarget = path.resolve(targetDir);
    if (!resolvedOutput.startsWith(resolvedTarget + path.sep) && resolvedOutput !== resolvedTarget) {
      throw new Error(
        `Zip extraction would write outside target directory: ${relativePath}`
      );
    }

    // Create parent directories
    const parentDir = path.dirname(outputPath);
    await fs.mkdir(parentDir, { recursive: true });

    // Write file
    const content = await zipEntry.async("nodebuffer");
    await fs.writeFile(outputPath, content);
  }
}
