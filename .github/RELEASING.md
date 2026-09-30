# Release setup

Before enabling automated releases:

1. Create or configure the `@unschema-graph` organization on npm.
2. In the npm settings for your packages, add a GitHub Actions trusted publisher for `johanldx/unschema-graph` and specify the workflow filename (e.g., `release.yml`).
3. In your GitHub repository settings:
   - Navigate to **Actions > General**.
   - Under **Workflow permissions**, enable "Read and write permissions" and check "Allow GitHub Actions to create and approve pull requests".
4. Protect the `main` branch and require the CI workflow (Vitest/Build) to pass before merging.

No long-lived npm token is required. The publish workflow uses GitHub OIDC; npm generates package provenance automatically for public repositories.
