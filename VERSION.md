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

## Current Panel Version: **v2.51.0** (Released: 2026-09-03)

### Changelog History

#### **v2.51.0** - 2026-09-03
- **Synapse PostgreSQL SSLMode Hardening, Robust pg_hba Access & Startup Diagnostic Health Loop**:
  - **Synapse 502 Bad Gateway Prevention**: Explicitly injects `sslmode: disable` and TCP keepalive settings (`keepalives_idle: 10`, `interval: 10`, `count: 3`) into `homeserver.yaml` database arguments, resolving psycopg2 'SSL connection closed unexpectedly' and connection reset crashes.
  - **PostgreSQL Server Configuration**: Sets `ssl = off` and `listen_addresses = '*'` in `postgresql.conf` to avoid unexpected TLS resets during pooled Synapse queries.
  - **Bullet-proof pg_hba.conf Management**: Implemented automated Python-driven whitelist updater that handles IPv4, IPv6, CIDRs, private subnets, and hostnames with DNS resolution, while strictly enforcing `postgres:postgres` ownership and `640` permissions.
  - **Synapse Startup Health Verification**: Extended health check loop to 45s with detailed journalctl/homeserver.log capture and automated exit code failure reporting to prevent false success reporting when the API is not yet healthy.

#### **v2.50.0** - 2026-09-03
- **PostgreSQL Remote Authentication, Synapse Config Integrity & Multi-Lingual Architecture Polish**:
  - **Synapse 502 Bad Gateway Hardening**: Pre-validates direct PostgreSQL socket and psycopg2 authentication from Python prior to homeserver startup, generates standard `log.yaml`, removes conflicting `conf.d/` configuration files, auto-generates signing keys, and resets systemd failure rate limits.
  - **PostgreSQL Node Multi-Server Whitelisting**: Added full database ownership, schema permissions, and prioritized `pg_hba.conf` CIDR rules guaranteeing remote Synapse nodes can connect immediately without authentication rejection.
  - **Complete Component Localization**: Verified and ensured that the Configure Matrix Enterprise Stack modal and sub-components are 100% free of hardcoded Persian text, seamlessly using the panel's multi-lingual translation dictionary.
  - **Diagnostic Telemetry**: Added comprehensive failure inspection with `systemctl status`, `journalctl` unit logs, and homeserver log output if Synapse port 8008 fails to respond within 30 seconds.

#### **v2.49.0** - 2026-09-03
- **502 Bad Gateway Resolution for Synapse & Element Nodes, Full Multi-Lingual Wizard Localization**:
  - **Synapse 502 Bad Gateway Resolution**: Preseeds debconf for non-interactive installs, installs required `psycopg2-binary` and `pyyaml` into virtualenvs, applies python-based safe `homeserver.yaml` configuration with `0.0.0.0:8008` listeners, fixes `matrix-synapse` service permissions, and adds a health-check wait loop.
  - **Element Web 502 Bad Gateway Resolution**: Purges conflicting sites from `/etc/nginx/sites-enabled/` so residual Synapse proxy directives do not intercept Element requests, and serves the static Element client directly with `www-data` permissions.
  - **PostgreSQL Node Reliability**: Generates clean prioritized `pg_hba.conf` whitelist and restarts PostgreSQL immediately in Stage 1 so cross-node connection attempts during Stage 2 succeed seamlessly.
  - **Complete Multi-Lingual Cleanliness**: Removed all hardcoded Persian strings from `InstallWizardModal.tsx` ("Configure Matrix Enterprise Stack") ensuring pristine multi-language panel localization.

#### **v2.48.0** - 2026-09-03
- **SSH Connection Pool Optimization, Nginx Default Purge & Element 403 Forbidden Fix**:
  - **SSH Connection Pooling & Socket Minimization**: Unified SSH pool cache key by `host:port:username` so all parallel and sequential tasks to the same node share a single multiplexed channel, eliminating excessive SSH sessions seen in `w` command output.
  - **Local Host Direct Execution**: When a node is identified as local, commands execute directly via child process streams without opening redundant SSH loopback connections.
  - **Aggressive Idle SSH Eviction**: Automatically closes unused SSH connections after 60 seconds of inactivity and flushes connection pools cleanly upon cluster deployment completion.
  - **Nginx Default Site Purge**: Automatically unlinks and removes `/etc/nginx/sites-enabled/default` on Synapse and Element nodes so custom Matrix virtual hosts serve traffic exclusively, resolving the "Welcome to nginx!" collision.
  - **Element Web 403 Forbidden Fix**: Enforces strict `www-data:www-data` ownership and `chmod 755` directory permissions on `/var/www/element`, incorporates fallback client index generation, and configures `default_server` blocks.

#### **v2.47.0** - 2026-09-03
- **SSH Handshake Resiliency, Localhost Detection & Distributed Install Recovery**:
  - **SSH Handshake Timeout Resolution**: Extended SSH client with full modern KEX (`curve25519`, `ecdh`, `diffie-hellman`), HMAC algorithms, banner consumption, and `keyboard-interactive` authentication to support Ubuntu 24.04 (Noble) servers and eliminate 60s timeout hangs.
  - **Local Interface Auto-Detection & Fallback**: Added intelligent detection of local network interfaces (`isLocalHostAddress`). If an SSH handshake times out or is blocked on a local node, the system automatically falls back to direct host execution.
  - **Distributed Credential Inheritance**: Automatically cascade parent or sibling SSH credentials (passwords, private keys) to distributed Synapse, PostgreSQL, and Element nodes when not explicitly configured.
  - **Install Wizard Local Server Helper**: Added 1-click 'Local Server' toggle for Synapse node in distributed install wizard for direct local host execution without SSH loopback requirements.

#### **v2.46.0** - 2026-09-03
- **Collapsible Server Status Cards, Light Theme Harmonization, & Single-Line Action Buttons**:
  - **Collapsible Server Profile Overview**: The Connected Server Profile now opens in a closed state by default with a compact overview strip of all 3 server nodes (endpoint, live status pills). Users can toggle to expand the full detailed card grid.
  - **Light Theme Harmonization**: Full visual compatibility with light theme mode, replacing dark-only contrast with clean light cards (`bg-white/95`), slate typography, and accessible status indicators across all modes.
  - **Single-Line Connection Action Buttons**: Adjusted the Export, Import, and Add Server/Cluster action buttons in Connection Manager into a strict single horizontal line (`flex-nowrap`, `shrink-0`) across all viewport widths.

#### **v2.45.0** - 2026-09-03
- **Dynamic Multi-Server Connection Status Cards & Compact Action Bar**:
  - **Dynamic Multi-Server Profile Banner**: Redesigned the Connected Server Profile header to dynamically display the connection name and individual status cards corresponding to each configured server (1, 2, or 3 servers).
  - **Per-Server Status & Diagnostics**: Each configured node card displays live WebSocket connectivity (Online, Checking, Disconnected), SSH endpoint host/port, service ports (8008, 5432, 80/443), and an independent 1-click test button.
  - **WebSocket Connection Flapping Elimination**: Unified telemetry and node diagnostics over a resilient WebSocket connection with 15s keepalive ping/pong heartbeat, removing race conditions and socket thrashing.
  - **Compact Server Connection Buttons**: Resized the top action buttons in Connection Manager (Export, Import, Add Server/Cluster) to a compact, inline flex-row layout.

#### **v2.44.0** - 2026-09-03
- **Multi-Server Distributed WebSocket Channels & Real-Time Node Diagnostics**:
  - **Multi-Channel Distributed WebSockets**: Implemented role-based WebSocket connections (`/ws?role=synapse`, `/ws?role=database`, `/ws?role=element`) with automated failover and independent reconnect lifecycles for multi-server clusters.
  - **Instant Per-Node Diagnostics**: Added live WebSocket diagnostic commands (`check_synapse_api`, `check_database`, `check_element`) measuring real-time latency, Matrix API versions, PostgreSQL stats, and web engine health.
  - **Config Forms Distributed WS Telemetry**: Added dedicated WebSocket status headers and on-demand check triggers inside Homeserver, Database, and Element Web configuration forms.
  - **Dashboard Cluster Node WS Badges**: Enhanced cluster node cards with live WebSocket status pills, latency metrics, and 1-click test actions directly on each server node.

#### **v2.43.0** - 2026-09-03
- **Parallel Distributed Stack Deployment, Connection Profile Auto-Fill & Resilient SSH Handshake**:
  - **Resilient SSH Handshake & 60s Timeout**: Increased SSH handshake timeout to 60 seconds with broad cipher and server host key algorithm negotiation and automatic pool cache clearing, resolving remote handshake timeout failures.
  - **Connection Profile Pre-Fill & Interactive Sync in Setup Wizard**: Setup wizard automatically pre-populates Synapse, PostgreSQL, and Element Web SSH and database credentials directly from the active connection profile. Added interactive profile selector and reload buttons for instant syncing on the fly.
  - **Concurrent Multi-Node Provisioning Pipeline**: Redesigned the 3-server distributed installer to concurrently provision packages and base environments across Database, Synapse, and Element nodes simultaneously (`Promise.all`) with node-tagged streaming logs.
  - **Coordinated Sequential Service Restarts**: Automated orderly post-configuration service restarts: (1) PostgreSQL DB -> (2) Matrix Synapse & Nginx -> (3) Element Web Nginx, followed by socket verification.

#### **v2.42.0** - 2026-09-03
- **Distributed Cluster Service Isolation, Robust Inter-Node Networking & Dashboard Error Recovery**:
  - **Fixed Dashboard React Error #31**: Resolved dashboard black screen crash by safely parsing primitive and object telemetry structures for RAM and Disk metrics across cluster nodes.
  - **Resilient UI ErrorBoundary**: Added comprehensive React ErrorBoundary wrapper around core dashboard components to gracefully handle rendering issues and provide instant 1-click reload and recovery.
  - **Strict 3-Server Service Isolation**: Enforced strict service separation during distributed installation so that PostgreSQL nodes only run PostgreSQL (Synapse and Element are stopped and disabled), Synapse nodes only run Synapse, and Element Web nodes only run Element Web.
  - **Cross-Node Networking & Handshake Verification**: Configured PostgreSQL with `listen_addresses = '*'` and robust `pg_hba.conf` rules (`scram-sha-256` / `md5`) for the Synapse server IP. Synapse now performs live pre-flight socket verification to PostgreSQL, and Element Web performs socket tests to Synapse.
  - **Dual-Port HTTP/HTTPS & Matrix API Reverse-Proxy**: Provided Nginx reverse proxy on Synapse with CORS headers, and added `/_matrix` reverse-proxy route on Element Web node to ensure seamless cross-server client-server communication.

#### **v2.41.0** - 2026-09-02
- **Distributed Multi-Server Matrix Stack Installer & Interactive Node Routing**:
  - **Redesigned Matrix Enterprise Stack Setup Wizard**: Added dedicated single-server and distributed multi-server cluster deployment modes in `InstallWizardModal`.
  - **Dedicated Node IP & SSH Configuration**: Interactive forms for assigning specific Host/IP, SSH port, username, authentication type (Password / PEM Private Key), and Database credentials for Synapse, PostgreSQL, and Element Web.
  - **1-Click SSH Credential Propagation**: Added quick copy buttons to easily replicate credentials from the Synapse node to the PostgreSQL and Element Web nodes.
  - **Automated Cross-Server Interconnectivity**: PostgreSQL node automatically permits remote TCP connections and whitelists Synapse Node IP in `pg_hba.conf`. Element Web node automatically binds its `config.json` to the Matrix Homeserver domain.
  - **Multi-Phase Distributed Orchestration Pipeline**: Orchestrated automated 3-phase remote execution (Database Deployment -> Synapse Homeserver Setup -> Element Web Client Installation) with real-time streamed logs and automatic cluster profile persistence.

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
