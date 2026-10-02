import path from 'node:path';
import { type AuditDiagnostic, type AuditResult, auditHtmlDirectory } from './audit.js';

export interface AuditCliIo {
  cwd: string;
  stdout: (message: string) => void;
  stderr: (message: string) => void;
}

const HELP = `Usage:
  unschema-graph audit [directory] [--strict] [--format text|json]
  npx @unschema-graph/core audit [directory] [--strict] [--format text|json]

Options:
  --strict              Treat warnings as audit failures
  --format text|json    Select deterministic output format (default: text)
  -h, --help            Show this help message`;

function parseArgs(
  args: string[]
):
  | { help: true }
  | { help: false; targetDir: string; strict: boolean; format: 'text' | 'json' }
  | { error: string } {
  const remaining = [...args];
  if (remaining[0] === 'audit') remaining.shift();
  if (remaining.includes('--help') || remaining.includes('-h')) return { help: true };

  let targetDir = 'dist';
  let targetSet = false;
  let strict = false;
  let format: 'text' | 'json' = 'text';

  for (let index = 0; index < remaining.length; index++) {
    const arg = remaining[index];
    if (arg === '--strict') {
      strict = true;
    } else if (arg === '--format') {
      const value = remaining[++index];
      if (value !== 'text' && value !== 'json') {
        return { error: '--format must be "text" or "json".' };
      }
      format = value;
    } else if (arg.startsWith('-')) {
      return { error: `Unknown option: ${arg}` };
    } else if (targetSet) {
      return { error: `Unexpected argument: ${arg}` };
    } else {
      targetDir = arg;
      targetSet = true;
    }
  }

  return { help: false, targetDir, strict, format };
}

function formatDiagnostic(diagnostic: AuditDiagnostic): string {
  const heading = `${diagnostic.severity === 'error' ? 'ERROR' : 'WARN'} ${diagnostic.file}`;
  return `${heading}\n  ${diagnostic.message.replaceAll('\n', '\n  ')}`;
}

function formatText(result: AuditResult): string {
  const lines = [
    `✓ ${result.scannedFiles} HTML files scanned`,
    `✓ ${result.totalBlocks} JSON-LD blocks parsed`,
    `✓ ${result.resolvedLocalReferences} local graph references resolved`,
    `✓ ${result.totalEntities} Schema.org entities found`,
  ];

  for (const warning of result.warnings) lines.push('', formatDiagnostic(warning));
  for (const error of result.errors) lines.push('', formatDiagnostic(error));
  return lines.join('\n');
}

/** Runs the audit CLI without terminating the host process, returning a stable exit code. */
export function runAuditCli(
  args: string[],
  io: AuditCliIo = {
    cwd: process.cwd(),
    stdout: (message) => console.log(message),
    stderr: (message) => console.error(message),
  }
): number {
  const parsed = parseArgs(args);
  if ('error' in parsed) {
    io.stderr(`${parsed.error}\n\n${HELP}`);
    return 2;
  }
  if (parsed.help) {
    io.stdout(HELP);
    return 0;
  }

  const result = auditHtmlDirectory(path.resolve(io.cwd, parsed.targetDir));
  const passed = result.passed && (!parsed.strict || result.warnings.length === 0);
  const exitCode = passed ? 0 : 1;

  if (parsed.format === 'json') {
    io.stdout(JSON.stringify({ ...result, strict: parsed.strict, passed, exitCode }, null, 2));
  } else {
    const output = formatText(result);
    if (passed) io.stdout(output);
    else io.stderr(output);
  }

  return exitCode;
}
