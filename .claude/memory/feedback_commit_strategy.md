---
name: Commit strategy
description: When a plan specifies multiple commits, make each commit during implementation rather than batching all changes and splitting at the end
type: feedback
---

When a plan defines separate commits (e.g. "config first, then formatting, then fixes"), create each commit as you complete that phase — don't do all the work first and try to split commits retroactively.

**Why:** Splitting changes across files after the fact is error-prone and overly complicated, especially when multiple phases touch the same files (e.g. formatting + code fixes + responsive changes all in the same `.svelte` file). The user had to simplify from 4 planned commits to 2 because of this.

**How to apply:** After completing each phase of a plan that specifies separate commits, stage and commit before moving to the next phase. This keeps commits clean and avoids retroactive untangling.
