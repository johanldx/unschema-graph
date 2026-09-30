---
title: Use the documentation with a coding agent
description: Give any coding agent focused, canonical Markdown context without loading the whole site.
---

The Markdown routes are plain documentation inputs, not instructions to trust an agent
blindly. They work with any tool that accepts URLs or pasted Markdown.

These routes are a context and portability feature. They are not required for Google Search or its
AI features, and their presence is not a visibility signal.

## Recommended workflow

1. Start with [`llms.txt`](/llms.txt) to identify the smallest relevant pages.
2. Give the agent the [implementation guide](/ai/implementation-guide.md).
3. Add one environment guide, one recipe, and only the builder references used.
4. Ask it to cite the public export and validation rule behind every implementation choice.
5. Run your own typecheck, build, tests, and audit before accepting changes.

Use `llms-full.txt` only when selective retrieval is unavailable. Focused pages reduce
context noise and make version conflicts easier to spot.

English is the canonical machine bundle. French `.md` routes are also generated for
every French documentation page, but they are not concatenated into `llms-full.txt`.
The “Copy page as Markdown” action always fetches the current locale’s route.

Do not paste secrets, private CMS payloads, customer data, or unpublished URLs into an
external agent. Replace them with representative fixtures.
