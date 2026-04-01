---
name: Plan file naming convention
description: Always use YYYY-MM-DD-descriptive-name.md for plan files, ignore system-generated random names
type: feedback
---

When plan mode suggests a random filename (e.g. `cheeky-napping-moler.md`), override it and write to the correct path using the `YYYY-MM-DD-descriptive-name.md` convention from the start.

**Why:** The user expects plan files to follow the documented convention in CLAUDE.md. Writing to the random name and then renaming is wasteful and error-prone.

**How to apply:** When the plan mode system message provides a plan file path, extract just the directory (`/.claude/plans/`) and construct the filename yourself using today's date and a descriptive slug.
