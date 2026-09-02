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

## Current Panel Version: **v2.40.1** (Released: 2026-09-02)

### Changelog History

#### **v2.40.1** - 2026-09-02
- **Compact Cluster Test Badges & Preserved Action Layout**:
  - **Optimized Test Feedback Badges**: Restructured cluster multi-node test results in connection cards into ultra-compact, proportional status chips without shifting action button sizes.
  - **Reliable Element Web Verification**: Broadened Element web directory and server verification to eliminate false-negative service status.
  - **Polished Connected & Status Indicators**: Added refined glowing pulse indicators and unified status chip styling across light and dark themes.

#### **v2.40.0** - 2026-09-02
- **Multi-Server DB Auto-Detection & Distributed Cluster Connection Diagnostics**:
  - **Distributed DB Parameter Auto-Detection**: `Detect DB Info` now intelligently routes SSH inspections across PostgreSQL DB and Synapse nodes in distributed clusters, prioritizing PostgreSQL node inspection and credential verification.
  - **Full Cluster Diagnostics & Service Validation**: `Test Connection` executes simultaneous SSH and service reachability checks across Synapse (Matrix API:8008), PostgreSQL (Port:5432), and Element Web (HTTP:80) nodes.
  - **Multi-Node Visual Feedback Cards**: Enhanced Connection Manager form and saved connection cards to display distinct online/offline status, SSH handshake results, and service health across each server in the cluster.
  - **Bilingual Topology & Diagnostics UI**: Fully translated Persian (فارسی) and English diagnostics messages, guidance, and cluster error reporting.

#### **v2.39.1** - 2026-09-02
- **Official Repository & Interactive Installer Migration to Matrix-Stack-Manager-Advance**:
  - **Repository URL Alignment**: Updated all installation (`curl setup-panel.sh`), uninstallation (`curl uninstall-panel.sh`), and `git clone` instructions in `README.md` and documentation to point to `Matrix-Stack-Manager-Advance`.
  - **Installer & Uninstaller Synchronization**: Configured `setup-panel.sh` and `uninstall-panel.sh` to directly pull from and reference `Matrix-Stack-Manager-Advance`.
  - **System Updater & GitHub Integration**: Updated live commit inspection, system update pipeline, and GitHub UI links across the entire frontend and backend.

#### **v2.39.0** - 2026-09-02
- **Distributed Multi-Server Architecture Support for Synapse, Database & Element**:
  - **Distributed Cluster Routing Engine**: Added `resolveNodeProfile` routing support across remote execution layers to dynamically target Synapse, PostgreSQL, and Element Web on discrete server nodes.
  - **Dedicated Multi-Node Credentials**: Added individual SSH host, port, username, and key/password configurations for Synapse, Database, and Element Web instances.
  - **Aggregated Multi-Node Telemetry**: Real-time dashboard telemetry now queries and aggregates CPU, Memory, Disk, and Ping latency across all active cluster nodes.
  - **Cluster Topology Visualizer**: Added live cluster status indicators and node health metrics in both Connection Manager and Dashboard overview.
  - **Parallel Multi-Node Connection Diagnostics**: Added full-cluster diagnostics to test SSH reachability, PostgreSQL authentication, and Matrix API accessibility across all nodes simultaneously.

#### **v2.38.32** - 2026-08-27
- **Enforced Session Termination & Login Redirection on System Update**:
  - **Session Security Hardening**: Active user authentication sessions are now immediately invalidated across local storage, cookies, and session storage upon panel update completion.
  - **Automatic Login Redirection**: Users are cleanly redirected to the login screen with a clear notification after system update execution.
  - **Real-time Multi-client Broadcast**: Server notifies all connected sessions via WebSocket when an update completes to ensure consistent state and immediate re-authentication.

#### **v2.38.31** - 2026-08-27
- **Official Repository Synchronization & 2-Step Interactive Update Flow**:
  - **Repository & Changelog Alignment**: Configured About Modal and System Update Suite to pull live GitHub commits and release notes directly from `github.com/shahbazimasoud/Matrix-Stack-Manager`.
  - **2-Step Update Pipeline**: Configured the update system to execute `uninstall-panel.sh` (with persistent data backup) followed by `setup-panel.sh` installer refresh.
  - **Interactive Terminal & Auto Update Options**: Added dual execution paths allowing 1-click automated update or interactive terminal console execution for password/confirmation prompts.
  - **Data Preservation**: Protected panel user credentials, bcrypt password hashes, and remote server connections in `/etc/matrix-manager-backup` during the uninstallation/setup cycle.

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
