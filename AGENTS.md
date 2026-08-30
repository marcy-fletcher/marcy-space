<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules

- English is the project's default language. Write all documentation in English.
- The product supports English and Russian from the start through i18n.
- All UI must support light and dark themes.
- Prefer shadcn components. Search its registry through the shadcn MCP first. If no suitable shadcn component exists, reuse a shared component. Create a custom component only when neither exists. Put reusable custom components in the shared layer.
- Keep shadcn components in their standard installation directory.
- Aim to keep code files within 500 lines. Review larger files and retain them only when their size has a strong cohesive reason.
- Prefer Feature-Sliced Design where practical. This is guidance, not a strict constraint.
- Always use the Ponytail and Caveman skills when available.
- End every agent-created commit message with `Co-authored-by: Codex <noreply@openai.com>`. Preserve existing trailers and add one blank line before the trailer block.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues using the `gh` CLI with elevated execution permissions; do not use the GitHub MCP. See `docs/agents/issue-tracker.md`.

### Triage labels

Triage uses the five default canonical labels. See `docs/agents/triage-labels.md`.

### Domain docs

Domain documentation uses the single-context layout. See `docs/agents/domain.md`.
