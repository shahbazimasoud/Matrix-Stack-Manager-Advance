# Raven Matrix Admin Panel - Versioning & Changelog

## ⚠️ MANDATORY RULE FOR AI AGENTS & DEVELOPERS

> **CRITICAL RULE:** Whenever you make ANY code modification, feature addition, bug fix, or UI change to this panel, you **MUST** update and increment the version number!

### How to Increment Version:
1. Open `src/version.ts`.
2. Update `PANEL_VERSION` according to semver:
   - **Patch / Minor Fix** (e.g., `v1.2.0` -> `v1.2.1`): Bug fixes, CSS/layout tweaks, small refactors.
   - **Minor Feature** (e.g., `v1.2.1` -> `v1.3.0`): New tabs, new settings, API additions.
   - **Major Release** (e.g., `v1.3.0` -> `v2.0.0`): Major breaking changes, complete UI redesigns.
3. Update `PANEL_BUILD_DATE` to current date (`YYYY-MM-DD`).
4. Add a new entry to `VERSION_HISTORY` array in `src/version.ts`.
5. Update `VERSION.md` with the new version and release notes.

---

## Current Panel Version: **v2.38.27** (Released: 2026-08-27)

### Changelog History

#### **v2.38.27** - 2026-08-27
- **Repository Migration & Version History Truncation**:
  - **Target Repository Migration**: Configured and pushed full production codebase to `github.com/shahbazimasoud/Matrix-Stack-Manager`.
  - **Version History Streamlining**: Retained only the latest version release information in the version history per project specifications.
  - **Stability & Clean Build**: Verified complete TypeScript compilation, health checks, and smooth Dev Server operation.
