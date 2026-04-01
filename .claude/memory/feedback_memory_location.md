---
name: Memory location
description: Store memory files in the repo's .claude/memory/ directory, not the global project-scoped path
type: feedback
---

This project keeps its memory files in the repo at `.claude/memory/`, not in the global `~/.claude/projects/...` path. Always write memory files and MEMORY.md to the repo location.

**Why:** The user expects memory to live alongside the project code so it's versioned and visible.

**How to apply:** Use `/Users/omb/repos/omirobarcelo/lingua/.claude/memory/` as the memory directory.
