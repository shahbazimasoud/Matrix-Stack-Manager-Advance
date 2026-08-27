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

export const PANEL_VERSION = "2.38.31";
export const PANEL_BUILD_DATE = "2026-08-27";
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
