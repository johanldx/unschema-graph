# Release setup

Before enabling automated releases:

1. Create or configure the `@unschema-graph` organization on npm.
2. In the npm settings for your packages, add a GitHub Actions trusted publisher for `johanldx/unschema-graph` and specify the workflow filename (e.g., `release.yml`).
3. In your GitHub repository settings:
   - Navigate to **Actions > General**.
   - Under **Workflow permissions**, enable "Read and write permissions" and check "Allow GitHub Actions to create and approve pull requests".
4. Protect the `main` branch and require the CI workflow (Vitest/Build) to pass before merging.

No long-lived npm token is required. The publish workflow uses GitHub OIDC and Node 24,
which satisfies the current npm Trusted Publishing runtime requirements. Provenance is
enabled in every package manifest and by the workflow; npm also generates it automatically
for public packages published through a trusted publisher.

## Release contract

1. Add a Changeset for every user-visible package change.
2. Merge only after CI, including `pnpm run verify` and `pnpm run test:published`, is green.
3. Merge the Changesets version PR to update package versions and changelogs together.
4. The publish workflow independently runs `pnpm run release:check` on the release commit before
   creating npm releases, package Git tags and GitHub Releases.
5. For `1.0.0`, the workflow additionally creates the aggregate `v1.0.0` Git tag and GitHub Release.

Before announcing a release, verify the npm pages expose provenance and that the generated
GitHub Releases point to the expected tags and changelog entries.

Run `pnpm run release:check` before publishing manually. It runs the same source, package,
example, and documentation verification as CI, then tests the packed npm consumers. Its audit
stage is strict: any warning or error blocks the release. The non-strict `pnpm run audit`
command remains available for local development.
