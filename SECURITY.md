# Security Policy

## Supported Versions

Only the latest active major and minor releases of `@unschema-graph` packages receive security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| 0.2.x   | :white_check_mark: |
| < 0.2   | :x:                |

## Reporting a Vulnerability

The `@unschema-graph` team takes security and the integrity of JSON-LD output seriously, especially regarding anti-XSS serialization guarantees when structured data is embedded into HTML `<script type="application/ld+json">` elements.

If you discover a security vulnerability or potential XSS injection vector, please **DO NOT** create a public GitHub issue.

Instead, please report it privately:

1. **GitHub Security Advisory (Preferred)**: Open a private advisory on the [unschema-graph Security Advisories page](https://github.com/johanldx/unschema-graph/security/advisories/new).
2. **Direct Security Contact**: Email Johan Ledoux at `johan.ledoux@rootage.fr` with the subject line `[SECURITY] unschema-graph`.

### What to include in your report:

- Type of vulnerability (e.g., HTML script injection, prototype pollution, unexpected serialization breakout).
- A minimal, reproducible code example or test payload.
- Affected package(s) and version(s).
- Impact assessment and suggested remediation if available.

### Response timeline:

- **Initial acknowledgment**: Within 48 hours.
- **Triage and preliminary assessment**: Within 5 business days.
- **Fix and disclosure schedule**: Coordinated release with a CVE and release advisory once a patch is ready.
