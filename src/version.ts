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

export const PANEL_VERSION = "2.38.27";
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
    version: "2.38.27",
    date: "2026-08-27",
    title: "Repository Migration & Version History Truncation",
    changes: [
      "Target Repository Migration: Configured and pushed full production codebase to github.com/shahbazimasoud/Matrix-Stack-Manager.",
      "Version History Streamlining: Retained only the latest version release information in the version history per project specifications.",
      "Stability & Clean Build: Verified complete TypeScript compilation, health checks, and smooth Dev Server operation."
    ]
  }
];
