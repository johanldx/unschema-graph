# Changesets

Run `pnpm changeset` for every consumer-visible change. Choose the semantic version bump,
describe the change, and commit the generated Markdown file with the implementation.

Merging the automated version PR updates `package.json` and `CHANGELOG.md`. The release workflow
then verifies, publishes through npm Trusted Publishing, tags the commit, and creates a GitHub
release.
