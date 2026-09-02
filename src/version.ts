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

export const PANEL_VERSION = "2.40.0";
export const PANEL_BUILD_DATE = "2026-09-02";
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
