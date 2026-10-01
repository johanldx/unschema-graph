import fs from 'node:fs';
import path from 'node:path';
import { isSameDocumentReference, resolveReferenceId } from './referenceResolution.js';

export type AuditDiagnosticCode =
  | 'empty-script'
  | 'invalid-json'
  | 'invalid-root'
  | 'missing-context'
  | 'invalid-graph'
  | 'missing-type'
  | 'broken-reference'
  | 'duplicate-id'
  | 'duplicate-conflict'
  | 'no-html'
  | 'no-jsonld';

export interface AuditDiagnostic {
  code: AuditDiagnosticCode;
  severity: 'warning' | 'error';
  file: string;
  message: string;
  path?: string;
  id?: string;
}

export type AuditError = AuditDiagnostic;

export interface AuditResult {
  scannedFiles: number;
  totalBlocks: number;
  totalEntities: number;
  resolvedLocalReferences: number;
  errors: AuditError[];
  warnings: AuditDiagnostic[];
  passed: boolean;
}

export interface AuditContentResult {
  blocks: number;
  entities: number;
  resolvedLocalReferences: number;
  errors: AuditError[];
  warnings: AuditDiagnostic[];
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

function extractCanonicalUrl(html: string): string | undefined {
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];
  for (const tag of linkTags) {
    const rel = tag.match(/\brel\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const relValue = rel?.[1] ?? rel?.[2] ?? rel?.[3];
    if (!relValue?.toLowerCase().split(/\s+/).includes('canonical')) continue;

    const href = tag.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    return href?.[1] ?? href?.[2] ?? href?.[3];
  }
  return undefined;
}

function comparableId(id: string, documentUrl?: string): string {
  return documentUrl && isSameDocumentReference(id, documentUrl)
    ? resolveReferenceId(id, documentUrl)
    : id;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isRecord(value)) return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, canonicalize(value[key])])
  );
}

/**
 * Recursively retrieves all `.html` files within a directory.
 */
export function getHtmlFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const results: string[] = [];
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name));

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
export function auditHtmlContent(html: string, filePath = 'index.html'): AuditContentResult {
  const errors: AuditError[] = [];
  const warnings: AuditDiagnostic[] = [];
  const rawBlocks = extractJsonLdBlocks(html);
  const rootEntities: Record<string, unknown>[] = [];
  const documentUrl = extractCanonicalUrl(html);
  let blocks = 0;
  let entities = 0;

  for (const rawContent of rawBlocks) {
    blocks++;
    const trimmed = rawContent.trim();

    if (!trimmed) {
      errors.push({
        code: 'empty-script',
        severity: 'error',
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
        code: 'invalid-json',
        severity: 'error',
        file: filePath,
        message: `JSON syntax error: ${(err as Error).message}`,
      });
      continue;
    }

    if (!isRecord(parsed)) {
      errors.push({
        code: 'invalid-root',
        severity: 'error',
        file: filePath,
        message: 'JSON-LD root must be an object.',
      });
      continue;
    }

    if (!parsed['@context']) {
      errors.push({
        code: 'missing-context',
        severity: 'error',
        file: filePath,
        message: 'Missing required "@context" property.',
      });
    }

    if (parsed['@graph']) {
      if (!Array.isArray(parsed['@graph'])) {
        errors.push({
          code: 'invalid-graph',
          severity: 'error',
          file: filePath,
          message: 'Property "@graph" must be an array.',
        });
      } else {
        entities += parsed['@graph'].length;
        parsed['@graph'].forEach((item: unknown, idx: number) => {
          if (!isRecord(item) || !item['@type']) {
            errors.push({
              code: 'missing-type',
              severity: 'error',
              file: filePath,
              message: `@graph entity at index ${idx} is missing "@type".`,
            });
          } else {
            rootEntities.push(item);
          }
        });
      }
    } else if (parsed['@type']) {
      entities++;
      rootEntities.push(parsed);
    } else {
      errors.push({
        code: 'missing-type',
        severity: 'error',
        file: filePath,
        message: 'Root JSON-LD is missing "@type" or "@graph".',
      });
    }
  }

  const definitions = new Map<
    string,
    { node: Record<string, unknown>; path: string; file: string }
  >();
  const references: { id: string; path: string }[] = [];

  const walk = (value: unknown, currentPath: string): void => {
    if (Array.isArray(value)) {
      value.forEach((entry, index) => {
        walk(entry, `${currentPath}[${index}]`);
      });
      return;
    }
    if (!isRecord(value)) return;

    const id = typeof value['@id'] === 'string' ? value['@id'] : undefined;
    if (id) {
      const semanticKeys = Object.keys(value).filter(
        (key) => key !== '@id' && key !== '@context' && key !== '@type'
      );
      const idOnlyReference = semanticKeys.length === 0 && value['@type'] === undefined;
      if (idOnlyReference) {
        references.push({ id, path: currentPath });
      } else {
        const definitionId = comparableId(id, documentUrl);
        const previous = definitions.get(definitionId);
        if (previous) {
          const conflictingKeys = Object.keys(value)
            .filter((key) => key !== '@id' && key in previous.node)
            .filter(
              (key) =>
                JSON.stringify(canonicalize(previous.node[key])) !==
                JSON.stringify(canonicalize(value[key]))
            )
            .sort();

          if (conflictingKeys.length > 0) {
            errors.push({
              code: 'duplicate-conflict',
              severity: 'error',
              file: filePath,
              id,
              path: currentPath,
              message: `Conflicting duplicate @id: ${id} (${conflictingKeys.join(', ')})`,
            });
          } else {
            warnings.push({
              code: 'duplicate-id',
              severity: 'warning',
              file: filePath,
              id,
              path: currentPath,
              message: `Duplicate @id declaration: ${id}`,
            });
          }
        } else {
          definitions.set(definitionId, { node: value, path: currentPath, file: filePath });
        }
      }
    }

    for (const [key, child] of Object.entries(value)) {
      if (key === '@context' || key === '@id' || key === '@type') continue;
      walk(child, `${currentPath}.${key}`);
    }
  };

  for (const entity of rootEntities) {
    const rawType = entity['@type'];
    const entityType = Array.isArray(rawType) ? rawType[0] : rawType;
    walk(entity, typeof entityType === 'string' ? entityType : '(entity)');
  }

  let resolvedLocalReferences = 0;
  for (const reference of references) {
    if (!isSameDocumentReference(reference.id, documentUrl)) continue;
    if (definitions.has(comparableId(reference.id, documentUrl))) {
      resolvedLocalReferences++;
    } else {
      errors.push({
        code: 'broken-reference',
        severity: 'error',
        file: filePath,
        id: reference.id,
        path: reference.path,
        message: `Broken @id reference: ${reference.id}\nReferenced from: ${reference.path}`,
      });
    }
  }

  const byStableLocation = (left: AuditDiagnostic, right: AuditDiagnostic): number =>
    left.file.localeCompare(right.file) ||
    (left.path ?? '').localeCompare(right.path ?? '') ||
    left.code.localeCompare(right.code) ||
    left.message.localeCompare(right.message);

  errors.sort(byStableLocation);
  warnings.sort(byStableLocation);
  return { blocks, entities, resolvedLocalReferences, errors, warnings };
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
  const allWarnings: AuditDiagnostic[] = [];
  let totalBlocks = 0;
  let totalEntities = 0;
  let resolvedLocalReferences = 0;

  if (htmlFiles.length === 0) {
    allErrors.push({
      code: 'no-html',
      severity: 'error',
      file: outputDir,
      message: `No HTML files found in directory: "${outputDir}". Run "astro build" first.`,
    });
  }

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const relPath = path.relative(process.cwd(), file);
    const {
      blocks,
      entities,
      resolvedLocalReferences: resolved,
      errors,
      warnings,
    } = auditHtmlContent(content, relPath);
    totalBlocks += blocks;
    totalEntities += entities;
    resolvedLocalReferences += resolved;
    allErrors.push(...errors);
    allWarnings.push(...warnings);
  }

  if (htmlFiles.length > 0 && totalBlocks === 0) {
    allErrors.push({
      code: 'no-jsonld',
      severity: 'error',
      file: outputDir,
      message: `No JSON-LD <script> tags found in directory: "${outputDir}".`,
    });
  }

  const byStableLocation = (left: AuditDiagnostic, right: AuditDiagnostic): number =>
    left.file.localeCompare(right.file) ||
    (left.path ?? '').localeCompare(right.path ?? '') ||
    left.code.localeCompare(right.code) ||
    left.message.localeCompare(right.message);
  allErrors.sort(byStableLocation);
  allWarnings.sort(byStableLocation);

  return {
    scannedFiles: htmlFiles.length,
    totalBlocks,
    totalEntities,
    resolvedLocalReferences,
    errors: allErrors,
    warnings: allWarnings,
    passed: allErrors.length === 0 && totalBlocks > 0,
  };
}
