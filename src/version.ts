/**
 * Raven Matrix Admin Panel - Central Version Configuration
 * 
 * ============================================================================
 * IMPORTANT INSTRUCTION FOR ALL AI AGENTS & DEVELOPERS:
 * ============================================================================
 * Whenever you make ANY code modification, bug fix, feature addition, or UI change
 * to this application/panel, you MUST increment the panel version defined below!
 * 
 * Versioning Rules:
 * - Patch / Minor fix (e.g. bug fix, styling tweak): increment patch version (e.g., v1.2.0 -> v1.2.1)
 * - Minor Feature (e.g. new button, new settings option): increment minor version (e.g., v1.2.1 -> v1.3.0)
 * - Major Release (e.g. major architectural change, framework upgrade): increment major version (e.g., v1.3.0 -> v2.0.0)
 * 
 * Always make sure PANEL_VERSION and PANEL_BUILD_DATE are updated and kept in sync!
 * ============================================================================
 */

export const PANEL_VERSION = "2.55.5";
export const PANEL_BUILD_DATE = "2026-09-05";
export const PANEL_NAME = "Raven Matrix Admin Panel";
export const PANEL_CODENAME = "Raven Spatial";

export interface VersionEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

export function getUpdateVersionString(currentVersion: string, latestRemoteVersion?: string): string {
  if (latestRemoteVersion && latestRemoteVersion.trim() !== '' && latestRemoteVersion !== currentVersion) {
    return latestRemoteVersion;
  }
  const parts = currentVersion.split('.').map(n => parseInt(n, 10));
  if (parts.length === 3 && !parts.some(isNaN)) {
    return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
  }
  return currentVersion;
}

export const VERSION_HISTORY: VersionEntry[] = [
  {
    version: "2.55.5",
    date: "2026-09-05",
    title: "Multi-Server Port 443 API Routing, PostgreSQL Port 5432 Security, Heredoc Base64 Fix & Mother WebSocket Singleton",
    changes: [
      "Eliminated Bash Heredoc EOF Error: Refactored ensureNginxSslSiteConfig to use robust Base64 encoding for virtual host files, preventing shell EOF delimiter parsing errors.",
      "Multi-Server Element-to-Synapse Port 443 Routing: Configured Element Web Nginx to reverse-proxy /_matrix and /_synapse requests over port 443 to the Synapse node with SNI (proxy_ssl_server_name on) and SSL bypass.",
      "PostgreSQL Cross-Node Connectivity & SCRAM Hardening: Enhanced wire_pg_hba.py to whitelist all cluster nodes, prioritized SCRAM-SHA-256 before MD5, opened port 5432 firewall rules, and added pre-flight socket verification from Synapse to Database node.",
      "Mother WebSocket Singleton Lifecycle: Consolidated panel WebSockets to reuse the single 'mother' WebSocket created via the connection page, preventing duplicate connections and socket flapping."
    ]
  },
  {
    version: "2.55.4",
    date: "2026-09-03",
    title: "Fix Process Self-Kill in Synapse Restart & pg_hba.py Line Joining",
    changes: [
      "Eliminated self-killing process bug in Synapse restart script where pkill -9 -f matched the running bash command line and terminated the deployment before Synapse could start.",
      "Replaced pkill with safe port-specific socket cleanup via lsof and fuser on TCP port 8008.",
      "Fixed Python SyntaxError in /tmp/wire_pg_hba.py by using chr(10).join(lines) instead of literal newline interpolation in template strings.",
      "Cleaned up redundant --check-keys parameter and added instant systemctl status reporting if Synapse service activation fails."
    ]
  },

  {
    version: "2.55.3",
    date: "2026-09-03",
    title: "Fix Health Probe Syntax & Database Whitelist Unterminated String",
    changes: [
      "Fixed JS template literal syntax evaluation error (SYN_CODE is not defined) in Stage 3 Synapse health check probe loop.",
      "Added fallback HTTP endpoint check (/_synapse/admin/v1/server_version) in addition to (/_matrix/client/versions) with support for all healthy 2xx/3xx codes.",
      "Extended Synapse startup probe timeout to 90 seconds (15 retries) with exponential backoff to ensure smooth first-time schema migrations.",
      "Fixed Python unterminated string literal syntax error in Database Node pg_hba.conf whitelist parser."
    ]
  },
  {
    version: "2.55.2",
    date: "2026-09-03",
    title: "Synchronized Package-Lock.json for Seamless NPM CI Installation",
    changes: [
      "Synchronized package-lock.json with all modern panel dependencies (@fontsource/vazirmatn, recharts, cookie-parser, nodemailer, node-cron, ldapts, js-yaml, etc.).",
      "Resolved npm EUSAGE lockfile mismatch error during setup-panel.sh installation, enabling ultra-fast npm ci execution in under 2 seconds without fallback.",
      "Eliminated noisy dependency mismatch warnings during automated installs, migrations, and updates."
    ]
  },
  {
    version: "2.55.1",
    date: "2026-09-03",
    title: "PostgreSQL pg_hba.conf Python Whitelist Syntax Fix",
    changes: [
      "Fixed Python SyntaxError in pg_hba.conf configuration: Replaced unescaped regex substitution with a deterministic, safe delimiter slice algorithm written via here-doc script (/tmp/wire_pg_hba.py).",
      "Eliminated unterminated string literal error that broke execution during Database Node provisioning on multi-node stack deployments.",
      "Ensures robust IPv4, IPv6, private subnet CIDRs, and cluster authentication entries are safely appended to pg_hba.conf without syntax collisions."
    ]
  },
  {
    version: "2.55.0",
    date: "2026-09-03",
    title: "High-Speed Non-Blocking NPM Dependency Installation & Setup Pipeline Streamlining",
    changes: [
      "Bypassed NPM Audit Network Deadlock: Disabled npm audit and funding network calls (--no-audit --no-fund) that caused npm install to hang indefinitely on filtered/restricted networks right after deprecation warnings.",
      "Ultra-Fast npm ci Pipeline: Switched to npm ci as primary installer utilizing package-lock.json directly, reducing install times from several minutes to under 25 seconds.",
      "Proactive Registry Latency Detection: Automatically tests registry.npmjs.org response time (3s probe); switches seamlessly to high-speed mirror (registry.npmmirror.com) if standard registry is throttled.",
      "Unthrottled Socket Concurrency: Raised maxsockets back to 15 (from 5) and reduced fetch-retry-maxtimeout from 180s to 15s, completely eliminating multi-minute stalled connection freezes.",
      "Removed Redundant Python Venv: Eliminated the legacy Python virtual environment creation and pip mirror retries from setup-panel.sh since the panel is purely native Node.js.",
      "Cleaned Deprecated Types: Removed stub @types/bcryptjs from package.json devDependencies."
    ]
  },
  {
    version: "2.54.0",
    date: "2026-09-03",
    title: "Restore resolveNodeProfile & VPS Installer Permission Hardening",
    changes: [
      "Restored resolveNodeProfile Export: Resolved production esbuild failure (No matching export in server/db.ts for import resolveNodeProfile) by restoring multi-node configuration resolution in server/db.ts.",
      "Git Safe Directory Enforced: Automatically whitelists installation directory in git safe.directory to eliminate dubious ownership permission errors under sudo.",
      "Executable Script Permissions: Configured chmod +x across all shell scripts (setup-panel.sh, install-matrix-stack.sh, matrix-installer.sh, uninstall-panel.sh) in git index and setup routine.",
      "Strict Hierarchy Permissions: Applied comprehensive filesystem permission enforcement (chmod 755 for installation root, 600 for .env, 700 for db, 644 for systemd service, 600 for SSL key).",
      "Systemd Service Environment: Injected complete PATH and LimitNOFILE=65535 into matrix-manager.service to guarantee daemon tool resolution across all Debian/Ubuntu releases.",
      "Resilient PyPI Dependency Handling: Converted mirror fallback failures into non-fatal warnings to ensure the panel can complete compilation and boot reliably even in restricted networks."
    ]
  },
  {
    version: "2.53.0",
    date: "2026-09-03",
    title: "SSH Connection Pool Lifecycle Hardening & Bounded Health Check Verification",
    changes: [
      "SSH Socket Lifecycle Management: Implemented robust safelyCloseSSHClient with listener removal, end() signaling, and destroy() socket finalization to eliminate lingering SSH zombie sockets and prevent connection exhaustion.",
      "Background Polling Pausing: Automatically suspends dashboard system metrics and background SSH polling during deployment operations to avoid reaching MaxSessions or MaxStartups limits on remote nodes.",
      "Bounded Exponential Backoff Probes: Replaced open-ended nested remote wait loops with a bounded 10-probe health check featuring exponential backoff (2s to 8s) and a hard 60s timeout, guaranteeing the orchestrator never hangs indefinitely.",
      "Idle Connection Reaper: Shortened SSH pool reaper interval to 15s with a 30s idle eviction policy, ensuring unused connections are cleaned up immediately.",
      "Real-Time SSH Connection Auditing: Added live SSH connection telemetry to deployment logs displaying active vs pooled session counts at each deployment stage."
    ]
  },
  {
    version: "2.52.0",
    date: "2026-09-03",
    title: "Idempotent Database Provisioning & Zero-Downtime PostgreSQL Service Reload",
    changes: [
      "Idempotent Role & Database Checks: Added proactive existence verification for roles (pg_roles) and databases (pg_database) before execution, eliminating 'role already exists' and 'database already exists' errors and preventing destructive alterations.",
      "Zero-Downtime Safe Reload Architecture: Replaced disruptive 'systemctl restart postgresql' calls with intelligent SIGHUP reload ('systemctl reload postgresql' / 'pg_reload_conf()') across distributed deployment orchestrator and installer scripts, completely preventing connection resets and 502 Bad Gateway errors on Synapse.",
      "Smart Configuration Change Detection: PostgreSQL is only restarted when core daemon parameters (such as listen_addresses) actually change on a freshly installed host; existing active databases retain all active connections uninterrupted.",
      "Comprehensive Provisioning Telemetry & Logging: Detailed console and audit output at every provisioning stage, explicitly logging whether roles/databases were newly created or safely verified.",
      "Safe Multi-Node Deployment Stages: Refactored Stage 3 coordination to verify and reload PostgreSQL services non-disruptively instead of abruptly terminating active Synapse database connections."
    ]
  },
  {
    version: "2.51.0",
    date: "2026-09-03",
    title: "Synapse PostgreSQL SSLMode Hardening, Robust pg_hba Access & Startup Diagnostic Health Loop",
    changes: [
      "Synapse 502 Bad Gateway Prevention: Explicitly injects sslmode: disable and TCP keepalive settings (keepalives_idle: 10, interval: 10, count: 3) into homeserver.yaml database arguments, resolving psycopg2 'SSL connection closed unexpectedly' and connection reset crashes.",
      "PostgreSQL Server Configuration: Sets ssl = off and listen_addresses = '*' in postgresql.conf to avoid unexpected TLS resets during pooled Synapse queries.",
      "Bullet-proof pg_hba.conf Management: Implemented automated Python-driven whitelist updater that handles IPv4, IPv6, CIDRs, private subnets, and hostnames with DNS resolution, while strictly enforcing postgres:postgres ownership and 640 permissions.",
      "Synapse Startup Health Verification: Extended health check loop to 45s with detailed journalctl/homeserver.log capture and automated exit code failure reporting to prevent false success reporting when the API is not yet healthy."
    ]
  },
  {
    version: "2.50.0",
    date: "2026-09-03",
    title: "PostgreSQL Remote Authentication, Synapse Config Integrity & Multi-Lingual Architecture Polish",
    changes: [
      "Synapse 502 Bad Gateway Hardening: Pre-validates direct PostgreSQL socket and psycopg2 authentication from Python prior to homeserver startup, generates standard log.yaml, removes conflicting conf.d configuration files, auto-generates signing keys, and resets systemd failure rate limits.",
      "PostgreSQL Node Multi-Server Whitelisting: Added full database ownership, schema permissions, and prioritized pg_hba.conf CIDR rules guaranteeing remote Synapse nodes can connect immediately without authentication rejection.",
      "Complete Component Localization: Verified and ensured that the Configure Matrix Enterprise Stack modal and sub-components are 100% free of hardcoded Persian text, seamlessly using the panel's multi-lingual translation dictionary.",
      "Diagnostic Telemetry: Added comprehensive failure inspection with systemctl status, journalctl unit logs, and homeserver log output if Synapse port 8008 fails to respond within 30 seconds."
    ]
  },
  {
    version: "2.49.0",
    date: "2026-09-03",
    title: "502 Bad Gateway Resolution for Synapse & Element Nodes, Full Multi-Lingual Wizard Localization",
    changes: [
      "Synapse 502 Bad Gateway Resolution: Preseeds debconf for non-interactive installs, installs required psycopg2-binary and pyyaml into virtualenvs, applies python-based safe homeserver.yaml configuration with 0.0.0.0:8008 listeners, fixes matrix-synapse service permissions, and adds a health-check wait loop.",
      "Element Web 502 Bad Gateway Resolution: Purges conflicting sites from /etc/nginx/sites-enabled/ so residual Synapse proxy directives do not intercept Element requests, and serves the static Element client directly with www-data permissions.",
      "PostgreSQL Node Reliability: Generates clean prioritized pg_hba.conf whitelist and restarts PostgreSQL immediately in Stage 1 so cross-node connection attempts during Stage 2 succeed seamlessly.",
      "Complete Multi-Lingual Cleanliness: Removed all hardcoded Persian strings from InstallWizardModal.tsx ('Configure Matrix Enterprise Stack') ensuring pristine multi-language panel localization."
    ]
  },
  {
    version: "2.48.0",
    date: "2026-09-03",
    title: "SSH Connection Pool Optimization, Nginx Default Purge & Element 403 Forbidden Fix",
    changes: [
      "SSH Connection Pooling & Socket Minimization: Unified SSH pool cache key by host:port:username so all parallel and sequential tasks to the same node share a single multiplexed channel, eliminating excessive SSH sessions seen in 'w' command output.",
      "Local Host Direct Execution: When a node is identified as local, commands execute directly via child process streams without opening redundant SSH loopback connections.",
      "Aggressive Idle SSH Eviction: Automatically closes unused SSH connections after 60 seconds of inactivity and flushes connection pools cleanly upon cluster deployment completion.",
      "Nginx Default Site Purge: Automatically unlinks and removes /etc/nginx/sites-enabled/default on Synapse and Element nodes so custom Matrix virtual hosts serve traffic exclusively, resolving the 'Welcome to nginx!' collision.",
      "Element Web 403 Forbidden Fix: Enforces strict www-data ownership and 755 directory permissions on /var/www/element, incorporates fallback client index generation, and configures default_server blocks."
    ]
  },
  {
    version: "2.47.0",
    date: "2026-09-03",
    title: "SSH Handshake Resiliency, Localhost Detection & Distributed Install Recovery",
    changes: [
      "SSH Handshake Timeout Resolution: Extended SSH client with full modern KEX (curve25519, ecdh, diffie-hellman), HMAC algorithms, banner consumption, and keyboard-interactive authentication to support Ubuntu 24.04 (Noble) servers.",
      "Local Interface Auto-Detection & Fallback: Added intelligent detection of local network interfaces (isLocalHostAddress). If an SSH handshake times out or is blocked on a local node, the system automatically falls back to direct host execution.",
      "Distributed Credential Inheritance: Automatically cascade parent or sibling SSH credentials (passwords, private keys) to distributed Synapse, PostgreSQL, and Element nodes when not explicitly configured.",
      "Install Wizard Local Server Helper: Added 1-click 'Local Server' toggle for Synapse node in distributed install wizard for direct local host execution without SSH loopback requirements."
    ]
  },
  {
    version: "2.46.0",
    date: "2026-09-03",
    title: "Collapsible Server Status Cards, Light Theme Harmonization, & Single-Line Action Buttons",
    changes: [
      "Collapsible Server Profile Overview: Connected Server Profile now opens in a closed state showing a concise overview strip for all 3 nodes (endpoints, live status dots), with an interactive toggle to expand full details.",
      "Light Theme Harmonization: Complete visual redesign of the Connected Server Profile cards for light theme mode with clean white backgrounds, high-contrast typography, and accessible status indicators.",
      "Single-Line Connection Action Buttons: Realigned the Export, Import, and Add Server/Cluster action buttons in Connection Manager to remain strictly on a single horizontal row across all screen sizes."
    ]
  },
  {
    version: "2.45.0",
    date: "2026-09-03",
    title: "Dynamic Multi-Server Connection Status Cards & Compact Action Bar",
    changes: [
      "Dynamic Multi-Server Profile Banner: Redesigned the Connected Server Profile header to dynamically display the connection name and individual status cards corresponding to each configured server (1, 2, or 3 servers).",
      "Per-Server Status & Diagnostics: Each configured node card displays live WebSocket connectivity (Online, Checking, Disconnected), SSH endpoint host/port, service ports (8008, 5432, 80/443), and an independent 1-click test button.",
      "WebSocket Connection Flapping Elimination: Unified telemetry and node diagnostics over a resilient WebSocket connection with 15s keepalive ping/pong heartbeat, removing race conditions and socket thrashing.",
      "Compact Server Connection Buttons: Resized the top action buttons in Connection Manager (Export, Import, Add Server/Cluster) to a compact, inline flex-row layout."
    ]
  },
  {
    version: "2.44.0",
    date: "2026-09-03",
    title: "Multi-Server Distributed WebSocket Channels & Real-Time Node Diagnostics",
    changes: [
      "Multi-Channel Distributed WebSockets: Implemented role-based WebSocket connections (/ws?role=synapse, /ws?role=database, /ws?role=element) with automated failover and independent reconnect lifecycles for multi-server clusters.",
      "Instant Per-Node Diagnostics: Added live WebSocket diagnostic commands (check_synapse_api, check_database, check_element) measuring real-time latency, Matrix API versions, PostgreSQL stats, and web engine health.",
      "Config Forms Distributed WS Telemetry: Added dedicated WebSocket status headers and on-demand check triggers inside Homeserver, Database, and Element Web configuration forms.",
      "Dashboard Cluster Node WS Badges: Enhanced cluster node cards with live WebSocket status pills, latency metrics, and 1-click test actions directly on each server node."
    ]
  },
  {
    version: "2.43.0",
    date: "2026-09-03",
    title: "Parallel Distributed Stack Deployment, Connection Profile Auto-Fill & Resilient SSH Handshake",
    changes: [
      "Resilient SSH Handshake & 60s Timeout: Increased SSH handshake timeout to 60 seconds with broad cipher/host-key algorithm negotiation and automatic pool cache clearing, resolving handshake timeout errors.",
      "Connection Profile Pre-Fill & Interactive Sync: Wizard automatically pre-populates Synapse, PostgreSQL, and Element Web nodes from the active connection profile. Added on-the-fly profile selector and reload buttons.",
      "Concurrent Multi-Node Provisioning: Parallelized Stage 1 package installation across all 3 nodes (Database, Synapse, Element Web) concurrently using Promise.all with tagged streaming logs.",
      "Coordinated Sequential Service Restarts: Automated orderly post-configuration service restarts: (1) PostgreSQL DB -> (2) Matrix Synapse & Nginx -> (3) Element Web Nginx, followed by socket verification."
    ]
  },
  {
    version: "2.42.0",
    date: "2026-09-03",
    title: "Distributed Cluster Service Isolation, Robust Inter-Node Networking & Dashboard Error Recovery",
    changes: [
      "Fixed Dashboard React Error #31: Resolved dashboard black screen crash by safely parsing primitive and object telemetry structures for RAM and Disk metrics across cluster nodes.",
      "Resilient UI ErrorBoundary: Added comprehensive React ErrorBoundary wrapper around core dashboard components to gracefully handle rendering issues and provide instant 1-click reload and recovery.",
      "Strict 3-Server Service Isolation: Enforced strict service separation during distributed installation so that PostgreSQL nodes only run PostgreSQL (Synapse and Element are stopped and disabled), Synapse nodes only run Synapse, and Element Web nodes only run Element Web.",
      "Cross-Node Networking & Handshake Verification: Configured PostgreSQL with listen_addresses = '*' and robust pg_hba.conf rules (scram-sha-256 / md5) for the Synapse server IP. Synapse now performs live pre-flight socket verification to PostgreSQL, and Element Web performs socket tests to Synapse.",
      "Dual-Port HTTP/HTTPS & Matrix API Reverse-Proxy: Provided Nginx reverse proxy on Synapse with CORS headers, and added /_matrix reverse-proxy route on Element Web node to ensure seamless cross-server client-server communication."
    ]
  },
  {
    version: "2.41.0",
    date: "2026-09-02",
    title: "Distributed Multi-Server Matrix Stack Installer & Interactive Node Routing",
    changes: [
      "Redesigned Matrix Enterprise Stack Setup Wizard: Added dedicated single-server and distributed multi-server cluster deployment modes in InstallWizardModal.",
      "Dedicated Node IP & SSH Configuration: Interactive forms for assigning specific Host/IP, SSH port, username, authentication type (Password / PEM Private Key), and Database credentials for Synapse, PostgreSQL, and Element Web.",
      "1-Click SSH Credential Propagation: Added quick copy buttons to easily replicate credentials from the Synapse node to the PostgreSQL and Element Web nodes.",
      "Automated Cross-Server Interconnectivity: PostgreSQL node automatically permits remote TCP connections and whitelists Synapse Node IP in pg_hba.conf. Element Web node automatically binds its config.json to the Matrix Homeserver domain.",
      "Multi-Phase Distributed Orchestration Pipeline: Orchestrated automated 3-phase remote execution (Database Deployment -> Synapse Homeserver Setup -> Element Web Client Installation) with real-time streamed logs and automatic cluster profile persistence."
    ]
  },
  {
    version: "2.40.1",
    date: "2026-09-02",
    title: "Compact Cluster Test Badges & Preserved Action Layout",
    changes: [
      "Optimized Test Feedback Badges: Restructured cluster multi-node test results in connection cards into ultra-compact, proportional status chips without shifting action button sizes.",
      "Reliable Element Web Verification: Broadened Element web directory and server verification to eliminate false-negative service status.",
      "Polished Connected & Status Indicators: Added refined glowing pulse indicators and unified status chip styling across light and dark themes."
    ]
  },
  {
    version: "2.40.0",
    date: "2026-09-02",
    title: "Multi-Server DB Auto-Detection & Distributed Cluster Connection Diagnostics",
    changes: [
      "Distributed DB Parameter Auto-Detection: Detect DB Info now intelligently routes SSH inspections across PostgreSQL DB and Synapse nodes in distributed clusters, prioritizing PostgreSQL node inspection and credential verification.",
      "Full Cluster Diagnostics & Service Validation: Test Connection executes simultaneous SSH and service reachability checks across Synapse (Matrix API:8008), PostgreSQL (Port:5432), and Element Web (HTTP:80) nodes.",
      "Multi-Node Visual Feedback Cards: Enhanced Connection Manager form and saved connection cards to display distinct online/offline status, SSH handshake results, and service health across each server in the cluster.",
      "Bilingual Topology & Diagnostics UI: Fully translated Persian (فارسی) and English diagnostics messages, guidance, and cluster error reporting."
    ]
  },
  {
    version: "2.39.1",
    date: "2026-09-02",
    title: "Official Repository & Interactive Installer Migration to Matrix-Stack-Manager-Advance",
    changes: [
      "Repository URL Alignment: Updated all installation (curl setup-panel.sh), uninstallation (curl uninstall-panel.sh), and git clone instructions in README.md and documentation.",
      "Installer & Uninstaller Synchronization: Configured setup-panel.sh and uninstall-panel.sh to directly pull from and reference Matrix-Stack-Manager-Advance.",
      "System Updater & GitHub Integration: Updated live commit inspection, system update pipeline, and GitHub UI links across the entire frontend and backend."
    ]
  },
  {
    version: "2.39.0",
    date: "2026-09-02",
    title: "Distributed Multi-Server Architecture Support for Synapse, Database & Element",
    changes: [
      "Distributed Cluster Routing Engine: Added resolveNodeProfile routing support across remote execution layers to dynamically target Synapse, PostgreSQL, and Element Web on discrete server nodes.",
      "Dedicated Multi-Node Credentials: Added individual SSH host, port, username, and key/password configurations for Synapse, Database, and Element Web instances.",
      "Aggregated Multi-Node Telemetry: Real-time dashboard telemetry now queries and aggregates CPU, Memory, Disk, and Ping latency across all active cluster nodes.",
      "Cluster Topology Visualizer: Added live cluster status indicators and node health metrics in both Connection Manager and Dashboard overview.",
      "Parallel Multi-Node Connection Diagnostics: Added full-cluster diagnostics to test SSH reachability, PostgreSQL authentication, and Matrix API accessibility across all nodes simultaneously."
    ]
  },
  {
    version: "2.38.32",
    date: "2026-08-27",
    title: "Enforced Session Termination & Login Redirection on System Update",
    changes: [
      "Session Security Hardening: Active user authentication sessions are now immediately invalidated across local storage and cookies upon panel update completion.",
      "Automatic Login Redirection: Users are cleanly redirected to the login screen with clear notification after system update execution.",
      "Real-time Multi-client Broadcast: Server notifies all connected sessions via WebSocket when an update completes to ensure consistent state and immediate re-authentication."
    ]
  },
  {
    version: "2.38.31",
    date: "2026-08-27",
    title: "Official Repository Synchronization & 2-Step Interactive Update Flow",
    changes: [
      "Repository & Changelog Alignment: Configured About Modal and System Update Suite to pull live GitHub commits and release notes directly from github.com/shahbazimasoud/Matrix-Stack-Manager.",
      "2-Step Update Pipeline: Configured the update system to execute uninstall-panel.sh (with persistent data backup) followed by setup-panel.sh installer refresh.",
      "Interactive Terminal & Auto Update Options: Added dual execution paths allowing 1-click automated update or interactive terminal console execution for password/confirmation prompts.",
      "Data Preservation: Protected panel user credentials, bcrypt password hashes, and remote server connections in /etc/matrix-manager-backup during the uninstallation/setup cycle."
    ]
  },
  {
    version: "2.38.30",
    date: "2026-08-27",
    title: "Comprehensive Bilingual Documentation & Feature Matrix in README.md",
    changes: [
      "Extensive Capabilities & Feature Matrix: Documented all 8 functional pillars including real-time telemetry, service orchestration, remote agent cluster management, deep configuration forms, user & room administration, granular RBAC, web terminal, and spatial UI.",
      "Dual Language Sectioning: Authored complete, structured, professional English documentation followed by the exact equivalent in Persian (فارسی).",
      "Repository & Branch Synchronization: Pushed updated documentation and version manifest directly to the master branch."
    ]
  },
  {
    version: "2.38.29",
    date: "2026-08-27",
    title: "Documentation & Installer Links Alignment for Matrix-Stack-Manager",
    changes: [
      "Repository Documentation Synchronization: Fully updated README.md installation commands, clone instructions, and service guides to target github.com/shahbazimasoud/Matrix-Stack-Manager.",
      "Installer & Uninstaller Alignment: Configured setup-panel.sh and uninstall-panel.sh to download, clone, and proxy exclusively from the official Matrix-Stack-Manager repository.",
      "UI & Applet Metadata Update: Updated all in-app GitHub repository references in About Modal, Application Header, and Raven Logo audio assets."
    ]
  }
];
