#!/usr/bin/env node

import { runAuditCli } from '../dist/core/auditCli.js';

process.exitCode = runAuditCli(process.argv.slice(2));
