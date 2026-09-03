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

export const PANEL_VERSION = "2.46.0";
export const PANEL_BUILD_DATE = "2026-09-03";
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
