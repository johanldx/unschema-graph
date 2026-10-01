import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { type AuditCliIo, runAuditCli } from '../src/core/auditCli.js';

function createIo(cwd: string) {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const io: AuditCliIo = {
    cwd,
    stdout: (message) => stdout.push(message),
    stderr: (message) => stderr.push(message),
  };
  return { io, stdout, stderr };
}

describe('audit CLI', () => {
  it('returns stable text and JSON output with CI exit codes', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'unschema-audit-cli-'));
    try {
      const dist = path.join(root, 'dist');
      fs.mkdirSync(dist);
      fs.writeFileSync(
        path.join(dist, 'index.html'),
        `<script type="application/ld+json">{
          "@context":"https://schema.org",
          "@graph":[
            {"@type":"Organization","@id":"#org","name":"Acme"},
            {"@type":"Organization","@id":"#org","name":"Acme","url":"/about"}
          ]
        }</script>`
      );

      const text = createIo(root);
      expect(runAuditCli(['audit', 'dist'], text.io)).toBe(0);
      expect(text.stdout.join('\n')).toContain('✓ 1 HTML files scanned');
      expect(text.stdout.join('\n')).toContain('WARN');
      expect(text.stderr).toHaveLength(0);

      const strict = createIo(root);
      expect(runAuditCli(['audit', 'dist', '--strict'], strict.io)).toBe(1);
      expect(strict.stderr.join('\n')).toContain('Duplicate @id declaration: #org');

      const json = createIo(root);
      expect(runAuditCli(['audit', 'dist', '--format', 'json'], json.io)).toBe(0);
      expect(JSON.parse(json.stdout[0])).toMatchObject({
        scannedFiles: 1,
        totalBlocks: 1,
        totalEntities: 2,
        strict: false,
        passed: true,
        exitCode: 0,
      });
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('fails on missing JSON-LD and returns 2 for invalid CLI usage', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'unschema-audit-empty-'));
    try {
      const dist = path.join(root, 'dist');
      fs.mkdirSync(dist);
      fs.writeFileSync(path.join(dist, 'index.html'), '<html><body>No schema</body></html>');

      const missing = createIo(root);
      expect(runAuditCli(['audit', 'dist'], missing.io)).toBe(1);
      expect(missing.stderr.join('\n')).toContain('No JSON-LD <script> tags found');

      const invalid = createIo(root);
      expect(runAuditCli(['audit', '--unknown'], invalid.io)).toBe(2);
      expect(invalid.stderr.join('\n')).toContain('Unknown option: --unknown');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
