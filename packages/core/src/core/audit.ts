import fs from 'node:fs';
import path from 'node:path';

export interface AuditError {
  file: string;
  message: string;
}

export interface AuditResult {
  scannedFiles: number;
  totalBlocks: number;
  totalEntities: number;
  errors: AuditError[];
  passed: boolean;
}

function extractJsonLdBlocks(html: string): string[] {
  const blocks: string[] = [];
  const scriptRegex =
    /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match = scriptRegex.exec(html);
  while (match !== null) {
    blocks.push(match[1]);
    match = scriptRegex.exec(html);
  }
  return blocks;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Recursively retrieves all `.html` files within a directory.
 */
export function getHtmlFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Extracts and validates Schema.org JSON-LD scripts from HTML content.
 */
export function auditHtmlContent(
  html: string,
  filePath = 'index.html'
): {
  blocks: number;
  entities: number;
  errors: AuditError[];
} {
  const errors: AuditError[] = [];
  const rawBlocks = extractJsonLdBlocks(html);
  let blocks = 0;
  let entities = 0;

  for (const rawContent of rawBlocks) {
    blocks++;
    const trimmed = rawContent.trim();

    if (!trimmed) {
      errors.push({
        file: filePath,
        message: 'Empty application/ld+json script block found.',
      });
      continue;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch (err) {
      errors.push({
        file: filePath,
        message: `JSON syntax error: ${(err as Error).message}`,
      });
      continue;
    }

    if (!isRecord(parsed)) {
      errors.push({
        file: filePath,
        message: 'JSON-LD root must be an object.',
      });
      continue;
    }

    if (!parsed['@context']) {
      errors.push({
        file: filePath,
        message: 'Missing required "@context" property.',
      });
    }

    if (parsed['@graph']) {
      if (!Array.isArray(parsed['@graph'])) {
        errors.push({
          file: filePath,
          message: 'Property "@graph" must be an array.',
        });
      } else {
        entities += parsed['@graph'].length;
        parsed['@graph'].forEach((item: unknown, idx: number) => {
          if (!isRecord(item) || !item['@type']) {
            errors.push({
              file: filePath,
              message: `@graph entity at index ${idx} is missing "@type".`,
            });
          }
        });
      }
    } else if (parsed['@type']) {
      entities++;
    } else {
      errors.push({
        file: filePath,
        message: 'Root JSON-LD is missing "@type" or "@graph".',
      });
    }
  }

  return { blocks, entities, errors };
}

/**
 * Audits all HTML files in a build output directory for valid Schema.org JSON-LD blocks.
 *
 * @param outputDir - Path to static output folder (e.g. './dist').
 * @returns Comprehensive audit report with file counts, entity counts, and errors.
 */
export function auditHtmlDirectory(outputDir: string): AuditResult {
  const htmlFiles = getHtmlFiles(outputDir);
  const allErrors: AuditError[] = [];
  let totalBlocks = 0;
  let totalEntities = 0;

  if (htmlFiles.length === 0) {
    allErrors.push({
      file: outputDir,
      message: `No HTML files found in directory: "${outputDir}". Run "astro build" first.`,
    });
  }

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const relPath = path.relative(process.cwd(), file);
    const { blocks, entities, errors } = auditHtmlContent(content, relPath);
    totalBlocks += blocks;
    totalEntities += entities;
    allErrors.push(...errors);
  }

  return {
    scannedFiles: htmlFiles.length,
    totalBlocks,
    totalEntities,
    errors: allErrors,
    passed: allErrors.length === 0 && totalBlocks > 0,
  };
}
