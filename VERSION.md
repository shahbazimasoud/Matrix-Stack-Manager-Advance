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

## Current Panel Version: **v2.38.28** (Released: 2026-08-27)

### Changelog History

#### **v2.38.28** - 2026-08-27
- **Production Stack Synchronization to Matrix-Stack-Manager**:
  - **Repository Synchronization**: Successfully pushed and initialized full production codebase to `github.com/shahbazimasoud/Matrix-Stack-Manager`.
  - **Streamlined Single-Version Manifest**: Retained exclusively the active latest release in the version log.
  - **Integrity Verification**: Full validation of server, UI modules, and compilation passes.
