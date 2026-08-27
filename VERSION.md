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

## Current Panel Version: **v2.38.30** (Released: 2026-08-27)

### Changelog History

#### **v2.38.30** - 2026-08-27
- **Comprehensive Bilingual Documentation & Feature Matrix in README.md**:
  - **Extensive Capabilities & Feature Matrix**: Documented all 8 functional pillars including real-time telemetry, service orchestration, remote agent cluster management, deep configuration forms, user & room administration, granular RBAC, web terminal, and spatial UI.
  - **Dual Language Sectioning**: Authored complete, structured, professional English documentation followed by the exact equivalent in Persian (فارسی).
  - **Repository & Branch Synchronization**: Pushed updated documentation and version manifest directly to the master branch.

#### **v2.38.29** - 2026-08-27
- **Documentation & Installer Links Alignment for Matrix-Stack-Manager**:
  - **Repository Documentation Synchronization**: Fully updated `README.md` installation commands, clone instructions, and service guides to target `github.com/shahbazimasoud/Matrix-Stack-Manager`.
  - **Installer & Uninstaller Alignment**: Configured `setup-panel.sh` and `uninstall-panel.sh` to download, clone, and proxy exclusively from the official `Matrix-Stack-Manager` repository.
  - **UI & Applet Metadata Update**: Updated all in-app GitHub repository references in About Modal, Application Header, and Raven Logo audio assets.
