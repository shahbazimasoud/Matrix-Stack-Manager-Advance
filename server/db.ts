/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import os from "os";
import path from "path";
import { exec, spawn } from "child_process";
import { Client } from "pg";
import { Client as SSHClient } from "ssh2";

export const SANDBOX_DIR = path.join(process.cwd(), "sandbox");

export interface ServerNodeConfig {
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  authType: 'password' | 'key';
  servicePort?: number;
  domain?: string;
  webPath?: string;
  
  // Specific configurations per node role
  dbHost?: string;
  dbPort?: number;
  dbName?: string;
  dbUser?: string;
  dbPass?: string;
  
  elementConfigPath?: string;
  webServerService?: string;
  
  homeserverYamlPath?: string;
  configPath?: string;
  homeserverLogPath?: string;
  apiPort?: number;
  adminUsername?: string;
  adminPassword?: string;
  adminAccessToken?: string;
}

export interface ConnectionProfile {
  id: string;
  name: string;
  deploymentMode?: 'standalone' | 'distributed'; // 'standalone' (All-in-one) or 'distributed' (Split multi-server)

  // Standalone / Primary Host (Synapse server in distributed mode)
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  authType: 'password' | 'key' | 'agent'; // Added 'agent' for Agent-based architecture
  
  // Multi-Node Distributed Server Configurations (when deploymentMode === 'distributed')
  synapseNode?: ServerNodeConfig;
  databaseNode?: ServerNodeConfig;
  elementNode?: ServerNodeConfig;

  // Agent-based fields
  status?: 'online' | 'offline' | 'pending';
  token?: string;
  apiKey?: string;
  lastSeen?: string;
  domain?: string;
  elementDomain?: string;
  hsDomain?: string;
  systemInfo?: any;
  services?: any[];
  description?: string;

  // Database configuration
  dbHost?: string;
  dbPort?: number;
  dbName?: string;
  dbUser?: string;
  dbPass?: string;
  
  // Config paths
  configPath?: string;
  homeserverYamlPath?: string;
  elementConfigPath?: string;
  homeserverLogPath?: string;

  // Admin credentials
  adminUsername?: string;
  adminPassword?: string;
  adminAccessToken?: string;
  apiPort?: number;
  apiBaseUrl?: string;
  apiAdminTokenOverride?: string;

  // Network Listener & Panel IP Sync
  addPanelIpToListener?: boolean;
  panelIp?: string;
  
  isActive: boolean;
}

export function getRealPath(targetPath: string): string {
  const relative = targetPath.startsWith("/") ? targetPath.slice(1) : targetPath;
  return path.join(SANDBOX_DIR, relative);
}

export function ensureDirExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function writeSandboxFile(filePath: string, content: string) {
  const realPath = getRealPath(filePath);
  ensureDirExists(realPath);
  fs.writeFileSync(realPath, content, "utf8");
}

export function readSandboxFile(filePath: string, defaultContent: string = ""): string {
  const realPath = getRealPath(filePath);
  if (!fs.existsSync(realPath)) {
    writeSandboxFile(filePath, defaultContent);
    return defaultContent;
  }
  return fs.readFileSync(realPath, "utf8");
}

export function initializeSandbox() {
  if (!fs.existsSync(SANDBOX_DIR)) {
    fs.mkdirSync(SANDBOX_DIR, { recursive: true });
  }

  // matrix-stack.conf
  readSandboxFile("/etc/matrix-stack.conf", [
    "HS_DOMAIN=matrix.company.local",
    "ELEMENT_DOMAIN=chat.company.local",
    "BASE_DOMAIN=company.local",
    "PUBLIC_IP=192.168.1.100",
    "LE_EMAIL=admin@company.local",
    "PG_DB=synapse",
    "PG_USER=synapse_user",
    "PG_PASS=a3f8b09d2e1c4f5a6b7c8d9e",
    "PG_HOST=localhost",
    "PG_PORT=5432",
    "SSL_MODE=selfsigned",
    "LIMIT_MB=50",
    "REGISTRATION_ENABLED=true",
    "MESSAGE_RETENTION_DAYS=0",
    "MEDIA_RETENTION_LOCAL_DAYS=0",
    "MEDIA_RETENTION_REMOTE_DAYS=0",
    "PRESENCE_ENABLED=true",
    "ROOM_CREATION_ALLOW=true",
    "DIRECTORY_SEARCH_ENABLED=true",
    "SMTP_HOST=smtp.company.local",
    "SMTP_PORT=587",
    "SMTP_USER=smtp_user",
    "SMTP_PASS=smtp_pass",
    "NOTIF_FROM=Matrix <noreply@company.local>",
    "APP_NAME=Matrix",
    "ELEMENT_CALL_URL=https://call.element.io",
    "INTEGRATIONS_UI_URL=https://scalar.vector.im",
    "INTEGRATIONS_REST_URL=https://scalar.vector.im/api",
    "TYPING_NOTIFS_ENABLED=true",
    "READ_RECEIPTS_ENABLED=true",
    "PROFILE_EDIT_NAME_ENABLED=true",
    "PROFILE_EDIT_AVATAR_ENABLED=true"
  ].join("\n"));

  // conf.d/ldap.yaml
  readSandboxFile("/etc/matrix-synapse/conf.d/ldap.yaml", "# ===========================\n# LDAP / Active Directory Module (Disabled)\n# ===========================\nmodules: []\n");
  readSandboxFile("/etc/matrix-synapse/conf.d/ldap.yaml", "# ===========================\n# LDAP / Active Directory Module (Disabled)\n# ===========================\nmodules: []\n");

  // homeserver.yaml
  readSandboxFile("/etc/matrix-synapse/homeserver.yaml", [
    "# Matrix Synapse Homeserver Configuration",
    "server_name: \"matrix.company.local\"",
    "public_baseurl: \"https://matrix.company.local/\"",
    "registration_shared_secret: \"99f8c0b2d3e4f5a6a7b8c9d0e1f2a3b4\"",
    "turn_shared_secret: \"a8b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4\"",
    "enable_registration: true",
    "enable_registration_without_verification: true",
    "max_upload_size: \"50M\"",
    "database:",
    "  name: \"psycopg2\"",
    "  args:",
    "    user: \"synapse_user\"",
    "    password: \"a3f8b09d2e1c4f5a6b7c8d9e\"",
    "    database: \"synapse\"",
    "    host: \"localhost\"",
    "    port: 5432",
    "    cp_min: 5",
    "    cp_max: 10",
    "turn_uris:",
    "  - \"turn:matrix.company.local:3478?transport=udp\"",
    "  - \"turns:matrix.company.local:5349?transport=tcp\"",
    "presence:",
    "  enabled: true",
    "rc_message:",
    "  per_second: 0.2",
    "  burst_count: 10",
    "rc_login:",
    "  address:",
    "    per_second: 0.17",
    "    burst_count: 5",
    "  failed_attempts:",
    "    per_second: 0.17",
    "    burst_count: 5",
    "modules: []"
  ].join("\n"));

  // Element Web config.json
  readSandboxFile("/var/www/element/config.json", JSON.stringify({
    "default_server_config": {
      "m.homeserver": {
        "base_url": "https://matrix.company.local",
        "server_name": "matrix.company.local"
      }
    },
    "disable_custom_urls": false,
    "disable_guests": true,
    "brand": "Element",
    "settingDefaults": {
      "features": {
        "feature_e2ee": false,
        "feature_video_rooms": "enable"
      },
      "sendTypingNotifications": true,
      "showTypingNotifications": true,
      "sendReadReceipts": true
    },
    "jitsi": {
      "preferredDomain": "meet.jit.si"
    }
  }, null, 2));

  // pgAdmin Servers configuration
  readSandboxFile("/etc/matrix-pgadmin/servers.json", JSON.stringify({
    "Servers": {
      "1": {
        "Name": "Matrix Synapse DB",
        "Group": "Servers",
        "Host": "localhost",
        "Port": 5432,
        "MaintenanceDB": "synapse",
        "Username": "synapse_user",
        "SSLMode": "prefer"
      }
    }
  }, null, 2));

  // Nginx Sites Config
  readSandboxFile("/etc/nginx/sites-available/matrix.conf", [
    "server {",
    "    listen 443 ssl http2;",
    "    server_name matrix.company.local;",
    "    ssl_certificate /etc/letsencrypt/live/matrix.company.local/fullchain.pem;",
    "    ssl_certificate_key /etc/letsencrypt/live/matrix.company.local/privkey.pem;",
    "    location / {",
    "        proxy_pass http://127.0.0.1:8008;",
    "    }",
    "}"
  ].join("\n"));

  // Seed DB panel_data.json
  readSandboxFile("/db/panel_data.json", JSON.stringify({
    users: [
      {
        id: "usr-1",
        username: "admin",
        email: "admin@company.local",
        passwordHash: "$2b$10$oX6HHsc3BDS.vH9aE/vzOek0uXuYFV22mSTl9OMk0QroZlkGqRIae",
        role: "Owner",
        isActive: true,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=admin"
      },
      {
        id: "usr-2",
        username: "masoud",
        email: "masoud.shahbazii@gmail.com",
        passwordHash: "$2b$10$QPE6t1v41RcL0A9LA5pGsu56Ti2he3s.k8AJWI8vOeJy.Or9iafBS",
        role: "Super Admin",
        isActive: true,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=masoud"
      },
      {
        id: "usr-3",
        username: "moderator",
        email: "mod@company.local",
        passwordHash: "$2b$10$TBrHPNVEOqZnBxTknN0MeO.6/DX864MJ8.2iFyuIV5M4Uw07Hackm",
        role: "Moderator",
        isActive: true,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=moderator"
      },
      {
        id: "usr-4",
        username: "viewer",
        email: "viewer@company.local",
        passwordHash: "$2b$10$kK4vi/4n6y0I3SLkVphmeuMbd3o7sY0TgSS8apm8SDXeI7U62Xwly",
        role: "Viewer",
        isActive: true,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=viewer"
      }
    ],
    matrixUsers: [
      { mxid: "@masoud:matrix.company.local", isAdmin: true, isDeactivated: false },
      { mxid: "@alice:matrix.company.local", isAdmin: false, isDeactivated: false },
      { mxid: "@bob:matrix.company.local", isAdmin: false, isDeactivated: false },
      { mxid: "@welcome:matrix.company.local", isAdmin: false, isDeactivated: true }
    ],
    auditLogs: [
      { id: "log-1", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), username: "system", action: "Server Booted", target: "Server", status: "success", details: "Matrix Stack Manager Web Panel initiated successfully." },
      { id: "log-2", timestamp: new Date(Date.now() - 3600000).toISOString(), username: "admin", action: "Configure LDAP", target: "LDAP Auth", status: "success", details: "Tested LDAP connection and saved changes." }
    ],
    backups: [],
    undoHistory: [
      { id: "undo-1", timestamp: new Date(Date.now() - 3600000).toISOString(), description: "Update LDAP Settings", files: ["/etc/matrix-synapse/conf.d/ldap.yaml", "/etc/matrix-synapse/homeserver.yaml"] }
    ],
    ldapConfig: {
      enabled: false,
      uri: "ldap://ldap.company.local:389",
      base: "ou=users,dc=company,dc=local",
      mode: "search",
      start_tls: false,
      bind_dn: "cn=svc-matrix,dc=company,dc=local",
      bind_password: "",
      active_directory: false,
      uid_attr: "sAMAccountName",
      mail_attr: "mail",
      name_attr: "cn"
    },
    workersConfig: {
      enabled: false,
      count: 2,
      federationSender: false,
      basePort: 8083
    }
  }, null, 2));

  // Logs seeding
  readSandboxFile("/var/log/matrix_stack_install.log", [
    "[2026-07-12 10:00:00] Starting Matrix Synapse Installer v3.0...",
    "[2026-07-12 10:00:05] [STEP 1/17] Updating repositories & installing prerequisites (apt)... success.",
    "[2026-07-12 10:01:25] [STEP 6/17] Setting up PostgreSQL database... success.",
    "[2026-07-12 10:02:35] INSTALLATION COMPLETE. Matrix Synapse & Element Web fully operational."
  ].join("\n"));

  readSandboxFile("/var/log/matrix-synapse/homeserver.log", [
    "2026-07-12 22:30:15,312 - synapse.app.homeserver - INFO - Synapse version 1.98.0 starting...",
    "2026-07-12 22:30:17,450 - synapse.app.homeserver - INFO - Database schema is up to date."
  ].join("\n"));
}

export function readDb(): any {
  let content = "{}";
  try {
    const realDbPath = path.join(process.cwd(), "db", "panel_data.json");
    if (fs.existsSync(realDbPath)) {
      content = fs.readFileSync(realDbPath, "utf8");
    } else {
      content = readSandboxFile("/db/panel_data.json", "{}");
    }
    if (!content || !content.trim()) {
      content = "{}";
    }
  } catch (err) {
    console.error("Failed to read panel_data.json, using default seed template:", err);
    content = "{}";
  }

  let data: any;
  try {
    data = JSON.parse(content);
  } catch (err) {
    console.error("Failed to parse panel_data.json JSON, resetting to empty state:", err);
    data = {};
  }
  
  let updated = false;

  if (!data.users || !Array.isArray(data.users)) {
    data.users = [
      {
        id: "usr-1",
        username: "admin",
        email: "admin@company.local",
        passwordHash: "$2b$10$oX6HHsc3BDS.vH9aE/vzOek0uXuYFV22mSTl9OMk0QroZlkGqRIae",
        role: "Owner",
        isActive: true,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=admin"
      },
      {
        id: "usr-2",
        username: "masoud",
        email: "masoud.shahbazii@gmail.com",
        passwordHash: "$2b$10$QPE6t1v41RcL0A9LA5pGsu56Ti2he3s.k8AJWI8vOeJy.Or9iafBS",
        role: "Super Admin",
        isActive: true,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=masoud"
      },
      {
        id: "usr-3",
        username: "moderator",
        email: "mod@company.local",
        passwordHash: "$2b$10$TBrHPNVEOqZnBxTknN0MeO.6/DX864MJ8.2iFyuIV5M4Uw07Hackm",
        role: "Moderator",
        isActive: true,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=moderator"
      },
      {
        id: "usr-4",
        username: "viewer",
        email: "viewer@company.local",
        passwordHash: "$2b$10$kK4vi/4n6y0I3SLkVphmeuMbd3o7sY0TgSS8apm8SDXeI7U62Xwly",
        role: "Viewer",
        isActive: true,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=viewer"
      }
    ];
    updated = true;
  }

  if (!data.matrixUsers || !Array.isArray(data.matrixUsers)) {
    data.matrixUsers = [
      { mxid: "@masoud:matrix.company.local", isAdmin: true, isDeactivated: false },
      { mxid: "@alice:matrix.company.local", isAdmin: false, isDeactivated: false },
      { mxid: "@bob:matrix.company.local", isAdmin: false, isDeactivated: false },
      { mxid: "@welcome:matrix.company.local", isAdmin: false, isDeactivated: true }
    ];
    updated = true;
  }

  if (!data.matrixRooms || !Array.isArray(data.matrixRooms)) {
    data.matrixRooms = [];
    updated = true;
  }
  
  if (!data.matrixMedia || !Array.isArray(data.matrixMedia)) {
    data.matrixMedia = [
      { id: "mxc://matrix.company.local/img9988ff", fileName: "corporate_logo.png", fileSize: 1542000, mimeType: "image/png", uploadedBy: "@masoud:matrix.company.local", uploadedAt: "2026-07-12T12:10:00.000Z", isCached: false }
    ];
    updated = true;
  }
  
  if (!data.registrationTokens || !Array.isArray(data.registrationTokens)) {
    data.registrationTokens = [
      { token: "ORG-STAFF-PROMO-2026", usesAllowed: 50, usesCount: 12, expiryTime: "2026-12-31T23:59:59.000Z", isActive: true }
    ];
    updated = true;
  }

  // Load connections backup from connections.json if it exists (which is untracked by git and survives git reset/pull)
  const backupPath = path.join(process.cwd(), "connections.json");
  if (fs.existsSync(backupPath)) {
    try {
      const backupRaw = fs.readFileSync(backupPath, "utf8");
      if (backupRaw && backupRaw.trim()) {
        const backupConnections = JSON.parse(backupRaw);
        if (Array.isArray(backupConnections) && backupConnections.length > 0) {
          data.connections = backupConnections;
        }
      }
    } catch (err) {
      console.error("Failed to read backup connections.json:", err);
    }
  }

  if (!data.connections || !Array.isArray(data.connections)) {
    data.connections = [
      {
        id: "local",
        name: "Local Server (This Machine)",
        host: "localhost",
        port: 22,
        username: "",
        authType: "key",
        isActive: true
      }
    ];
    updated = true;
  }

  if (!data.auditLogs || !Array.isArray(data.auditLogs)) {
    data.auditLogs = [
      { id: "log-1", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), username: "system", action: "Server Booted", target: "Server", status: "success", details: "Matrix Stack Manager Web Panel initiated successfully." },
      { id: "log-2", timestamp: new Date(Date.now() - 3600000).toISOString(), username: "admin", action: "Configure LDAP", target: "LDAP Auth", status: "success", details: "Tested LDAP connection and saved changes." }
    ];
    updated = true;
  }

  if (!data.backups || !Array.isArray(data.backups)) {
    data.backups = [];
    updated = true;
  }

  if (!data.eventReports || !Array.isArray(data.eventReports)) {
    data.eventReports = [];
    updated = true;
  }

  if (!data.undoHistory || !Array.isArray(data.undoHistory)) {
    data.undoHistory = [
      { id: "undo-1", timestamp: new Date(Date.now() - 3600000).toISOString(), description: "Update LDAP Settings", files: ["/etc/matrix-synapse/conf.d/ldap.yaml", "/etc/matrix-synapse/homeserver.yaml"] }
    ];
    updated = true;
  }

  if (!data.ldapConfig || typeof data.ldapConfig !== "object") {
    data.ldapConfig = {
      enabled: false,
      uri: "ldap://ldap.company.local:389",
      base: "ou=users,dc=company,dc=local",
      mode: "search",
      start_tls: false,
      bind_dn: "cn=svc-matrix,dc=company,dc=local",
      bind_password: "",
      active_directory: false,
      uid_attr: "sAMAccountName",
      mail_attr: "mail",
      name_attr: "cn"
    };
    updated = true;
  }

  if (!data.workersConfig || typeof data.workersConfig !== "object") {
    data.workersConfig = {
      enabled: false,
      count: 2,
      federationSender: false,
      basePort: 8083
    };
    updated = true;
  }

  if (updated) {
    try {
      writeSandboxFile("/db/panel_data.json", JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Failed to persist updated db schema state:", err);
    }
  }

  return data;
}

export function writeDb(data: any) {
  writeSandboxFile("/db/panel_data.json", JSON.stringify(data, null, 2));
  try {
    const realDbPath = path.join(process.cwd(), "db", "panel_data.json");
    ensureDirExists(realDbPath);
    fs.writeFileSync(realDbPath, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    // ignore
  }
  if (data && data.connections) {
    try {
      const connectionsFilePath = path.join(process.cwd(), "connections.json");
      fs.writeFileSync(connectionsFilePath, JSON.stringify(data.connections, null, 2), "utf8");
    } catch (err) {
      console.error("Failed to write backup connections.json:", err);
    }
  }
}

export function getActiveConnection(): ConnectionProfile {
  try {
    const db = readDb();
    if (!db.connections) {
      return {
        id: "local",
        name: "Local Server (This Machine)",
        host: "localhost",
        port: 22,
        username: "",
        authType: "key",
        isActive: true
      };
    }
    return db.connections.find((c: any) => c.isActive) || db.connections[0];
  } catch (e) {
    return {
      id: "local",
      name: "Local Server (This Machine)",
      host: "localhost",
      port: 22,
      username: "",
      authType: "key",
      isActive: true
    };
  }
}

interface CachedSSH {
  conn: SSHClient;
  isReady: boolean;
  lastUsed: number;
  connectPromise?: Promise<SSHClient>;
}

const sshPool = new Map<string, CachedSSH>();
let totalSSHConnectionsOpened = 0;
let activeSSHConnectionsCount = 0;

export function getSSHConnectionStats() {
  return {
    totalCreated: totalSSHConnectionsOpened,
    activeCount: activeSSHConnectionsCount,
    poolSize: sshPool.size,
    cachedKeys: Array.from(sshPool.keys())
  };
}

export function safelyCloseSSHClient(key: string, conn?: SSHClient | null, reason = 'cleanup'): void {
  const cached = sshPool.get(key);
  const targetConn = conn || cached?.conn;
  if (cached) {
    sshPool.delete(key);
  }
  if (targetConn) {
    try {
      targetConn.removeAllListeners();
      targetConn.end();
      // Enforce immediate termination if socket still lingering
      setTimeout(() => {
        try {
          (targetConn as any).destroy?.();
        } catch (_) {}
      }, 500);
    } catch (_) {}
    activeSSHConnectionsCount = Math.max(0, activeSSHConnectionsCount - 1);
    console.log(`[SSH Manager] Disconnected SSH session for [${key}] (${reason}). Active sessions: ${activeSSHConnectionsCount}`);
  }
}

export function clearSSHConnectionCache(target?: string): void {
  if (target) {
    for (const [key, cached] of Array.from(sshPool.entries())) {
      if (key.includes(target) || key.startsWith(`${target}_`)) {
        safelyCloseSSHClient(key, cached.conn, `target_clear:${target}`);
      }
    }
  } else {
    for (const [key, cached] of Array.from(sshPool.entries())) {
      safelyCloseSSHClient(key, cached.conn, 'pool_clear_all');
    }
    sshPool.clear();
  }
}

export function isLocalHostAddress(host?: string): boolean {
  if (!host) return true;
  const h = host.trim().toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '0.0.0.0' || h === '') {
    return true;
  }
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name] || []) {
        if (net.address && net.address.toLowerCase() === h) {
          return true;
        }
      }
    }
  } catch {}
  return false;
}

function getSSHKey(config: ConnectionProfile): string {
  const host = (config.host || "127.0.0.1").trim().toLowerCase();
  const port = Number(config.port) || 22;
  const username = (config.username || "root").trim();
  return `${host}:${port}:${username}`;
}

async function getOrCreateSSHClient(config: ConnectionProfile): Promise<SSHClient> {
  const key = getSSHKey(config);
  const existing = sshPool.get(key);

  if (existing && existing.isReady && existing.conn) {
    existing.lastUsed = Date.now();
    return existing.conn;
  }

  if (existing && existing.connectPromise) {
    return existing.connectPromise;
  }

  const connectPromise = new Promise<SSHClient>((resolve, reject) => {
    const conn = new SSHClient();
    let isHandshakeDone = false;

    conn.on("ready", () => {
      isHandshakeDone = true;
      totalSSHConnectionsOpened++;
      activeSSHConnectionsCount++;
      sshPool.set(key, { conn, isReady: true, lastUsed: Date.now() });
      console.log(`[SSH Manager] Established NEW SSH connection to [${key}]. Active sessions: ${activeSSHConnectionsCount} (Total spawned: ${totalSSHConnectionsOpened})`);
      resolve(conn);
    });

    conn.on("keyboard-interactive", (_name, _instructions, _instructionsLang, prompts, finish) => {
      if (prompts && prompts.length > 0 && config.password) {
        finish(prompts.map(() => config.password || ''));
      } else {
        finish([]);
      }
    });

    conn.on("banner", (_msg) => {
      // Cleanly consume MOTD / banners
    });

    conn.on("error", (err: any) => {
      safelyCloseSSHClient(key, conn, `socket_error:${err?.message || err}`);
      if (!isHandshakeDone) {
        const msg = err?.message || String(err);
        if (msg.includes("Timed out while waiting for handshake") || msg.includes("timed out")) {
          reject(new Error(`Timed out while waiting for SSH handshake on ${config.host}:${config.port || 22} (30s limit). Please check host reachability, firewall on port ${config.port || 22}, and remote sshd responsiveness.`));
        } else {
          reject(err);
        }
      }
    });

    conn.on("close", () => {
      safelyCloseSSHClient(key, conn, 'remote_closed');
    });

    conn.on("end", () => {
      safelyCloseSSHClient(key, conn, 'remote_ended');
    });

    const connOpts: any = {
      host: config.host,
      port: Number(config.port) || 22,
      username: config.username || "root",
      readyTimeout: 30000,
      keepaliveInterval: 10000,
      keepaliveCountMax: 3,
      tryKeyboard: true,
      algorithms: {
        kex: [
          'curve25519-sha256',
          'curve25519-sha256@libssh.org',
          'ecdh-sha2-nistp256',
          'ecdh-sha2-nistp384',
          'ecdh-sha2-nistp521',
          'diffie-hellman-group-exchange-sha256',
          'diffie-hellman-group14-sha256',
          'diffie-hellman-group14-sha1',
          'diffie-hellman-group-exchange-sha1',
          'diffie-hellman-group1-sha1'
        ],
        serverHostKey: [
          'ssh-ed25519',
          'ecdsa-sha2-nistp256',
          'ecdsa-sha2-nistp384',
          'ecdsa-sha2-nistp521',
          'rsa-sha2-512',
          'rsa-sha2-256',
          'ssh-rsa'
        ],
        cipher: [
          'aes128-gcm',
          'aes128-gcm@openssh.com',
          'aes256-gcm',
          'aes256-gcm@openssh.com',
          'chacha20-poly1305@openssh.com',
          'aes128-ctr',
          'aes192-ctr',
          'aes256-ctr'
        ],
        hmac: [
          'hmac-sha2-256',
          'hmac-sha2-512',
          'hmac-sha1',
          'hmac-sha2-256-etm@openssh.com',
          'hmac-sha2-512-etm@openssh.com',
          'hmac-sha1-etm@openssh.com'
        ]
      }
    };

    if (config.password) {
      connOpts.password = config.password;
    }
    if (config.privateKey) {
      connOpts.privateKey = config.privateKey;
      if ((config as any).passphrase) {
        connOpts.passphrase = (config as any).passphrase;
      }
    }

    if (config.authType === "password" && config.password) {
      connOpts.password = config.password;
    } else if (config.authType === "key" && config.privateKey) {
      connOpts.privateKey = config.privateKey;
    }

    try {
      conn.connect(connOpts);
    } catch (e) {
      safelyCloseSSHClient(key, conn, 'connect_call_failed');
      reject(e);
    }
  });

  sshPool.set(key, { conn: null as any, isReady: false, lastUsed: Date.now(), connectPromise });

  try {
    const client = await connectPromise;
    return client;
  } catch (err) {
    safelyCloseSSHClient(key, null, 'connect_promise_rejected');
    throw err;
  }
}

export function resolveNodeProfile(
  config: ConnectionProfile,
  targetNode?: 'synapse' | 'database' | 'element' | 'default' | ServerNodeConfig
): ConnectionProfile {
  if (!config) return config;
  if (typeof targetNode === 'object' && targetNode !== null) {
    return {
      ...config,
      id: `${config.id || "custom"}_custom_node`,
      host: targetNode.host,
      port: targetNode.port || 22,
      username: targetNode.username || 'root',
      password: targetNode.password,
      privateKey: targetNode.privateKey,
      authType: targetNode.authType || 'password',
      dbHost: targetNode.dbHost || config.dbHost,
      dbPort: targetNode.dbPort || config.dbPort,
      dbName: targetNode.dbName || config.dbName,
      dbUser: targetNode.dbUser || config.dbUser,
      dbPass: targetNode.dbPass || config.dbPass,
    };
  }

  if (config.deploymentMode === 'distributed') {
    if (targetNode === 'database' && config.databaseNode && config.databaseNode.host) {
      return {
        ...config,
        id: `${config.id}_db_node`,
        host: config.databaseNode.host,
        port: config.databaseNode.port || 22,
        username: config.databaseNode.username || 'root',
        password: config.databaseNode.password,
        privateKey: config.databaseNode.privateKey,
        authType: config.databaseNode.authType || 'password',
        dbHost: config.databaseNode.dbHost || '127.0.0.1',
        dbPort: config.databaseNode.dbPort || 5432,
        dbName: config.databaseNode.dbName || 'synapse',
        dbUser: config.databaseNode.dbUser || 'synapse_user',
        dbPass: config.databaseNode.dbPass !== undefined ? config.databaseNode.dbPass : config.dbPass,
      };
    }
    if (targetNode === 'element' && config.elementNode && config.elementNode.host) {
      return {
        ...config,
        id: `${config.id}_element_node`,
        host: config.elementNode.host,
        port: config.elementNode.port || 22,
        username: config.elementNode.username || 'root',
        password: config.elementNode.password,
        privateKey: config.elementNode.privateKey,
        authType: config.elementNode.authType || 'password',
        elementConfigPath: config.elementNode.elementConfigPath || config.elementConfigPath,
      };
    }
    if ((targetNode === 'synapse' || targetNode === 'default' || !targetNode) && config.synapseNode && config.synapseNode.host) {
      return {
        ...config,
        id: `${config.id}_synapse_node`,
        host: config.synapseNode.host,
        port: config.synapseNode.port || 22,
        username: config.synapseNode.username || 'root',
        password: config.synapseNode.password,
        privateKey: config.synapseNode.privateKey,
        authType: config.synapseNode.authType || 'password',
        adminUsername: config.synapseNode.adminUsername || config.adminUsername,
        adminPassword: config.synapseNode.adminPassword || config.adminPassword,
        adminAccessToken: config.synapseNode.adminAccessToken || config.adminAccessToken,
        homeserverYamlPath: config.synapseNode.homeserverYamlPath || config.homeserverYamlPath,
      };
    }
  }

  return config;
}

export async function executeSSHCommand(
  config: ConnectionProfile,
  cmd: string,
  targetNode?: 'synapse' | 'database' | 'element' | 'default' | ServerNodeConfig,
  timeoutMs: number = 45000
): Promise<string> {
  const targetConfig = resolveNodeProfile(config, targetNode);

  // If host is local machine, execute directly to avoid SSH socket overhead & w-command noise
  if (isLocalHostAddress(targetConfig.host)) {
    return new Promise((resolve, reject) => {
      exec(cmd, { maxBuffer: 1024 * 1024 * 20, timeout: timeoutMs }, (err, stdout, stderr) => {
        if (err) {
          const errMsg = (stderr || stdout || err.message).trim();
          return reject(new Error(errMsg || `Local command failed with exit code ${err.code}`));
        }
        resolve(stdout);
      });
    });
  }

  const attemptExecute = async (isRetry = false): Promise<string> => {
    let conn: SSHClient;
    const sshKey = getSSHKey(targetConfig);
    try {
      conn = await getOrCreateSSHClient(targetConfig);
    } catch (err: any) {
      if (!isRetry) {
        safelyCloseSSHClient(sshKey, null, 'retry_before_connect');
        conn = await getOrCreateSSHClient(targetConfig);
      } else {
        throw err;
      }
    }

    return new Promise((resolve, reject) => {
      let resolved = false;
      let timer: NodeJS.Timeout | null = null;

      if (timeoutMs > 0) {
        timer = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            safelyCloseSSHClient(sshKey, conn, `cmd_timeout_${timeoutMs}ms`);
            reject(new Error(`SSH command timed out after ${Math.round(timeoutMs / 1000)}s`));
          }
        }, timeoutMs);
      }

      conn.exec(cmd, async (err, stream) => {
        if (err) {
          if (timer) clearTimeout(timer);
          safelyCloseSSHClient(sshKey, conn, 'exec_dispatch_err');
          if (!isRetry) {
            try {
              const retryRes = await attemptExecute(true);
              return resolve(retryRes);
            } catch (retryErr) {
              return reject(retryErr);
            }
          }
          return reject(err);
        }
        let stdout = "";
        let stderr = "";

        stream.on("close", (code) => {
          if (timer) clearTimeout(timer);
          if (!resolved) {
            resolved = true;
            if (code !== 0 && code !== null) {
              const errMsg = (stderr || stdout || "").trim();
              reject(new Error(errMsg || `Command failed with exit code ${code}`));
            } else {
              resolve(stdout);
            }
          }
        }).on("data", (data: any) => {
          stdout += data.toString();
        }).stderr.on("data", (data: any) => {
          stderr += data.toString();
        });

        stream.on("error", (streamErr: any) => {
          if (timer) clearTimeout(timer);
          if (!resolved) {
            resolved = true;
            safelyCloseSSHClient(sshKey, conn, 'stream_error');
            reject(streamErr);
          }
        });
      });
    });
  };

  return attemptExecute(false);
}

export async function executeStreamingSSHCommand(
  config: ConnectionProfile,
  cmd: string,
  targetNode?: 'synapse' | 'database' | 'element' | 'default' | ServerNodeConfig,
  onData?: (data: string) => void,
  onErr?: (data: string) => void,
  timeoutMs: number = 90000
): Promise<number> {
  const targetConfig = resolveNodeProfile(config, targetNode);

  if (isLocalHostAddress(targetConfig.host)) {
    return new Promise((resolve, reject) => {
      const proc = spawn('bash', ['-c', cmd]);
      let timer: NodeJS.Timeout | null = null;
      if (timeoutMs > 0) {
        timer = setTimeout(() => {
          proc.kill('SIGKILL');
          reject(new Error(`Local streaming command timed out after ${Math.round(timeoutMs / 1000)}s`));
        }, timeoutMs);
      }
      proc.stdout?.on('data', d => { if (onData) onData(d.toString()); });
      proc.stderr?.on('data', d => { if (onErr) onErr(d.toString()); });
      proc.on('close', code => {
        if (timer) clearTimeout(timer);
        resolve(code || 0);
      });
      proc.on('error', err => {
        if (timer) clearTimeout(timer);
        reject(err);
      });
    });
  }

  const attemptExecute = async (isRetry = false): Promise<number> => {
    let conn: SSHClient;
    const sshKey = getSSHKey(targetConfig);
    try {
      conn = await getOrCreateSSHClient(targetConfig);
    } catch (err: any) {
      if (!isRetry) {
        safelyCloseSSHClient(sshKey, null, 'streaming_retry_connect');
        conn = await getOrCreateSSHClient(targetConfig);
      } else {
        throw err;
      }
    }

    return new Promise((resolve, reject) => {
      let resolved = false;
      let timer: NodeJS.Timeout | null = null;

      if (timeoutMs > 0) {
        timer = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            safelyCloseSSHClient(sshKey, conn, `streaming_timeout_${timeoutMs}ms`);
            reject(new Error(`Remote SSH command timed out after ${Math.round(timeoutMs / 1000)}s`));
          }
        }, timeoutMs);
      }

      conn.exec(cmd, (err, stream) => {
        if (err) {
          if (timer) clearTimeout(timer);
          safelyCloseSSHClient(sshKey, conn, 'streaming_exec_err');
          if (!isRetry) {
            return attemptExecute(true).then(resolve).catch(reject);
          }
          return reject(err);
        }

        stream.on('close', (code: number) => {
          if (timer) clearTimeout(timer);
          if (!resolved) {
            resolved = true;
            resolve(code || 0);
          }
        });

        stream.on('error', (streamErr: any) => {
          if (timer) clearTimeout(timer);
          if (!resolved) {
            resolved = true;
            safelyCloseSSHClient(sshKey, conn, 'streaming_stream_error');
            reject(streamErr);
          }
        });

        stream.on('data', (d: any) => {
          if (onData) onData(d.toString());
        });

        stream.stderr.on('data', (d: any) => {
          if (onErr) onErr(d.toString());
          else if (onData) onData(d.toString());
        });
      });
    });
  };

  return attemptExecute(false);
}

// Dedicated helper to upload local file to remote server via SFTP over SSH connection
export async function uploadSSHFile(
  config: ConnectionProfile,
  localFilePath: string,
  remoteFilePath: string,
  targetNode?: 'synapse' | 'database' | 'element' | 'default' | ServerNodeConfig
): Promise<void> {
  const targetConfig = resolveNodeProfile(config, targetNode);
  const attemptUpload = async (isRetry = false): Promise<void> => {
    let conn: SSHClient;
    const sshKey = getSSHKey(targetConfig);
    try {
      conn = await getOrCreateSSHClient(targetConfig);
    } catch (err: any) {
      if (!isRetry) {
        safelyCloseSSHClient(sshKey, null, 'sftp_connect_retry');
        conn = await getOrCreateSSHClient(targetConfig);
      } else {
        throw err;
      }
    }

    return new Promise((resolve, reject) => {
      conn.sftp((errSftp, sftp) => {
        if (errSftp) {
          safelyCloseSSHClient(sshKey, conn, 'sftp_session_err');
          if (!isRetry) {
            return attemptUpload(true).then(resolve).catch(reject);
          }
          return reject(errSftp);
        }

        sftp.fastPut(localFilePath, remoteFilePath, (errPut) => {
          if (errPut) {
            try {
              const fileBuf = fs.readFileSync(localFilePath);
              sftp.writeFile(remoteFilePath, fileBuf, { mode: 0o644 }, (errWrite) => {
                if (errWrite) {
                  safelyCloseSSHClient(sshKey, conn, 'sftp_write_err');
                  if (!isRetry) {
                    return attemptUpload(true).then(resolve).catch(reject);
                  }
                  return reject(errWrite);
                }
                resolve();
              });
            } catch (fsErr) {
              safelyCloseSSHClient(sshKey, conn, 'sftp_readfile_err');
              reject(fsErr);
            }
          } else {
            resolve();
          }
        });
      });
    });
  };

  return attemptUpload(false);
}

// Cleanup idle SSH connections every 15 seconds (evict if unused for > 30 seconds)
setInterval(() => {
  const now = Date.now();
  for (const [key, cached] of Array.from(sshPool.entries())) {
    if (cached.lastUsed && now - cached.lastUsed > 30 * 1000) {
      safelyCloseSSHClient(key, cached.conn, 'idle_timeout_30s');
    }
  }
}, 15 * 1000);


export function interpolateQueryParams(queryStr: string, params: any[]): string {
  if (!params || params.length === 0) return queryStr;
  
  let interpolated = queryStr;
  params.forEach((param, i) => {
    const placeholder = `$${i + 1}`;
    let formattedParam = "";
    if (typeof param === "string") {
      formattedParam = `'${param.replace(/'/g, "''")}'`;
    } else if (param === null || param === undefined) {
      formattedParam = "NULL";
    } else if (param instanceof Date) {
      formattedParam = `'${param.toISOString()}'`;
    } else {
      formattedParam = String(param);
    }
    interpolated = interpolated.split(placeholder).join(formattedParam);
  });
  return interpolated;
}

export function cleanAndParseJSON(text: string, defaultValue: any = null): any {
  if (!text) return defaultValue;
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    const startBrace = trimmed.indexOf('{');
    const startBracket = trimmed.indexOf('[');
    let startIdx = -1;
    let endIdx = -1;
    
    if (startBrace !== -1 && (startBracket === -1 || startBrace < startBracket)) {
      startIdx = startBrace;
      endIdx = trimmed.lastIndexOf('}');
    } else if (startBracket !== -1) {
      startIdx = startBracket;
      endIdx = trimmed.lastIndexOf(']');
    }
    
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const candidate = trimmed.substring(startIdx, endIdx + 1);
      try {
        return JSON.parse(candidate);
      } catch (err) {
        // ignore
      }
    }
  }
  return defaultValue;
}

const remoteDbConfigCache = new Map<string, { dbUser: string; dbPass: string; dbName: string; dbHost: string; dbPort: number }>();

export async function queryRemotePostgres(config: ConnectionProfile, sqlQuery: string, params: any[] = []): Promise<any[]> {
  const targetConfig = resolveNodeProfile(config, 'database');
  const cacheKey = targetConfig.id || targetConfig.host || "default";
  const interpolatedSql = interpolateQueryParams(sqlQuery, params);
  const trimmedSql = interpolatedSql.trim();
  const isWriteQuery = /^\s*(insert|update|delete|create|drop|alter|truncate)\b/i.test(trimmedSql);
  
  let dbUser = targetConfig.dbUser;
  let dbPass = targetConfig.dbPass;
  let dbName = targetConfig.dbName;
  let dbHost = targetConfig.dbHost;
  let dbPort = targetConfig.dbPort;

  // Check in-memory cache first if DB credentials are not in config profile
  if ((!dbUser || !dbPass || !dbName) && remoteDbConfigCache.has(cacheKey)) {
    const cached = remoteDbConfigCache.get(cacheKey)!;
    dbUser = dbUser || cached.dbUser;
    dbPass = dbPass || cached.dbPass;
    dbName = dbName || cached.dbName;
    dbHost = dbHost || cached.dbHost;
    dbPort = dbPort || cached.dbPort;
  }

  // Dynamically load from /etc/matrix-stack.conf or homeserver.yaml if missing
  if (!dbUser || !dbPass || !dbName) {
    try {
      const sudoPrefix = targetConfig.username === "root" ? "" : "sudo ";
      const confRaw = await executeSSHCommand(targetConfig, `${sudoPrefix}cat /etc/matrix-stack.conf 2>/dev/null || true`);
      if (confRaw && confRaw.trim()) {
        const parsedConfig: any = {};
        confRaw.split("\n").forEach((line) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) return;
          const parts = trimmed.split("=");
          if (parts.length >= 2) {
            parsedConfig[parts[0].trim()] = parts.slice(1).join("=").trim();
          }
        });
        if (parsedConfig.PG_USER) dbUser = dbUser || parsedConfig.PG_USER;
        if (parsedConfig.PG_PASS) dbPass = dbPass || parsedConfig.PG_PASS;
        if (parsedConfig.PG_DB) dbName = dbName || parsedConfig.PG_DB;
        if (parsedConfig.PG_HOST) dbHost = dbHost || parsedConfig.PG_HOST;
        if (parsedConfig.PG_PORT) dbPort = dbPort || parseInt(parsedConfig.PG_PORT);
      }
    } catch (e) {
      console.warn("Failed to dynamically read remote matrix-stack.conf:", e);
    }

    if (!dbUser || !dbPass || !dbName) {
      try {
        const sudoPrefix = targetConfig.username === "root" ? "" : "sudo ";
        const homeserverRaw = await executeSSHCommand(targetConfig, `${sudoPrefix}cat /etc/matrix-synapse/homeserver.yaml 2>/dev/null || true`);
        if (homeserverRaw && homeserverRaw.trim()) {
          const dbUserMatch = homeserverRaw.match(/user:\s*["']?([^"'\s]+)["']?/);
          const dbPassMatch = homeserverRaw.match(/password:\s*["']?([^"'\s]+)["']?/);
          const dbNameMatch = homeserverRaw.match(/database:\s*["']?([^"'\s]+)["']?/);
          const dbHostMatch = homeserverRaw.match(/host:\s*["']?([^"'\s]+)["']?/);
          const dbPortMatch = homeserverRaw.match(/port:\s*(\d+)/);

          if (dbUserMatch) dbUser = dbUser || dbUserMatch[1];
          if (dbPassMatch) dbPass = dbPass || dbPassMatch[1];
          if (dbNameMatch) dbName = dbName || dbNameMatch[1];
          if (dbHostMatch) dbHost = dbHost || dbHostMatch[1];
          if (dbPortMatch) dbPort = dbPort || parseInt(dbPortMatch[1]);
        }
      } catch (e) {
        console.warn("Failed to dynamically read remote homeserver.yaml:", e);
      }
    }

    if (dbUser || dbPass || dbName) {
      remoteDbConfigCache.set(cacheKey, {
        dbUser: dbUser || "synapse_user",
        dbPass: dbPass || "",
        dbName: dbName || "synapse",
        dbHost: dbHost || "localhost",
        dbPort: dbPort || 5432
      });
    }
  }

  const hasExplicitPass = typeof targetConfig.dbPass === "string" && targetConfig.dbPass.length > 0;
  const hasExplicitUser = typeof targetConfig.dbUser === "string" && targetConfig.dbUser.trim().length > 0;

  dbUser = dbUser || "synapse_user";
  dbPass = dbPass || "";
  dbName = dbName || "synapse";
  dbHost = dbHost || "localhost";
  dbPort = dbPort || 5432;
  
  const escapedPass = dbPass.replace(/'/g, "'\\''");
  const escapedUser = dbUser.replace(/'/g, "'\\''");
  const escapedDb = dbName.replace(/'/g, "'\\''");
  const escapedHost = dbHost.replace(/'/g, "'\\''");

  const psqlFinderPrefix = `export PATH="/usr/lib/postgresql/17/bin:/usr/lib/postgresql/16/bin:/usr/lib/postgresql/15/bin:/usr/lib/postgresql/14/bin:/usr/lib/postgresql/13/bin:/usr/lib/postgresql/12/bin:/usr/local/bin:/usr/bin:/bin:$PATH"; PSQL_BIN=$(command -v psql 2>/dev/null || find /usr/lib/postgresql -name psql 2>/dev/null | sort -V | tail -n 1); if [ -z "$PSQL_BIN" ] || ! command -v "$PSQL_BIN" >/dev/null 2>&1; then if command -v apt-get >/dev/null 2>&1; then DEBIAN_FRONTEND=noninteractive apt-get update -qq >/dev/null 2>&1 && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq postgresql-client >/dev/null 2>&1 || true; PSQL_BIN=$(command -v psql 2>/dev/null || find /usr/lib/postgresql -name psql 2>/dev/null | sort -V | tail -n 1); fi; fi; [ -z "$PSQL_BIN" ] && PSQL_BIN="psql";`;

  const buildPsqlCommand = (sqlString: string) => {
    const b64Sql = Buffer.from(sqlString).toString("base64");
    const tryCmds: string[] = [];

    tryCmds.push(`PGPASSWORD='${escapedPass}' "$PSQL_BIN" -h '${escapedHost}' -p '${dbPort}' -U '${escapedUser}' -d '${escapedDb}' -t -A 2>&1`);
    if (escapedHost === "localhost" || escapedHost === "127.0.0.1") {
      tryCmds.push(`PGPASSWORD='${escapedPass}' "$PSQL_BIN" -h '127.0.0.1' -p '${dbPort}' -U '${escapedUser}' -d '${escapedDb}' -t -A 2>&1`);
    }

    if (!hasExplicitPass && !hasExplicitUser) {
      tryCmds.push(`sudo -u postgres "$PSQL_BIN" -d '${escapedDb}' -t -A 2>&1`);
      tryCmds.push(`sudo "$PSQL_BIN" -U '${escapedUser}' -d '${escapedDb}' -t -A 2>&1`);
    }

    const uniqueCmds = Array.from(new Set(tryCmds));
    const combinedPsql = uniqueCmds.map(c => `echo "$SQL" | ${c}`).join(" || ");
    return `${psqlFinderPrefix} SQL=$(echo '${b64Sql}' | base64 -d); ${combinedPsql}`;
  };

  const buildPythonFallback = (sqlString: string, isWrite: boolean) => {
    const b64 = Buffer.from(sqlString).toString("base64");
    return `python3 -c '
import sys, base64, json
raw_sql = base64.b64decode("${b64}").decode("utf-8")
try:
    import psycopg2
    conn = psycopg2.connect(host="${escapedHost}", port=${dbPort}, user="${escapedUser}", password="${escapedPass}", dbname="${escapedDb}", connect_timeout=5)
    cur = conn.cursor()
    cur.execute(raw_sql)
    if "${isWrite ? "1" : "0"}" == "1":
        conn.commit()
        print(json.dumps([{"success": True, "affectedRows": str(cur.rowcount)}]))
    else:
        cols = [d[0] for d in cur.description] if cur.description else []
        rows = cur.fetchall() if cur.description else []
        res = [dict(zip(cols, r)) for r in rows]
        print(json.dumps(res))
    conn.close()
except Exception as e:
    import socket
    s = socket.socket()
    s.settimeout(3)
    try:
        s.connect(("${escapedHost}", ${dbPort}))
        s.close()
        print(json.dumps([{"connected": True, "note": "PostgreSQL port 5432 is reachable via TCP", "fallback": True}]))
    except Exception as se:
        print("ERR: " + str(e) + " | " + str(se))
' 2>&1`;
  };

  if (isWriteQuery) {
    const combinedCmd = buildPsqlCommand(trimmedSql);

    try {
      let output = await executeSSHCommand(targetConfig, combinedCmd);
      if (output && (output.includes("command not found") || output.includes("psql: not found"))) {
        const pyCmd = buildPythonFallback(trimmedSql, true);
        output = await executeSSHCommand(targetConfig, pyCmd);
      }
      if (output !== undefined && !output.includes("psql: error") && !output.includes("FATAL:") && !output.includes("Command failed") && !output.includes("password authentication failed") && !output.includes("ERR:")) {
        return [{ success: true, affectedRows: output.trim() }];
      } else {
        const cleanErr = (output || "").trim();
        throw new Error(cleanErr || "PostgreSQL write query failed");
      }
    } catch (err: any) {
      console.error("Error executing remote postgres write query:", err);
      throw err || new Error("Failed to execute remote PostgreSQL write query");
    }
  } else {
    // Clean trailing semicolons inside the subquery to prevent postgres syntax errors
    const cleanSql = trimmedSql.replace(/;+$/, "");
    const wrappedQuery = `SELECT coalesce(json_agg(row_to_json(t)), '[]'::json) FROM (${cleanSql}) t;`;
    const combinedCmd = buildPsqlCommand(wrappedQuery);

    try {
      let jsonStr = await executeSSHCommand(targetConfig, combinedCmd);
      if (jsonStr && (jsonStr.includes("command not found") || jsonStr.includes("psql: not found"))) {
        const pyCmd = buildPythonFallback(cleanSql, false);
        jsonStr = await executeSSHCommand(targetConfig, pyCmd);
      }
      if (jsonStr !== undefined && !jsonStr.includes("psql: error") && !jsonStr.includes("FATAL:") && !jsonStr.includes("Command failed") && !jsonStr.includes("password authentication failed") && !jsonStr.includes("ERR:")) {
        const parsed = cleanAndParseJSON(jsonStr, null);
        if (parsed !== null) return parsed;
      }
      const cleanErr = (jsonStr || "").trim();
      throw new Error(cleanErr || "PostgreSQL read query failed");
    } catch (err: any) {
      console.error("Error executing remote postgres read query:", err);
      throw err || new Error("Failed to execute remote PostgreSQL read query");
    }
  }
}

export async function queryRemotePostgresMulti(config: ConnectionProfile, queries: { sql: string, params?: any[] }[]): Promise<any[][]> {
  const targetConfig = resolveNodeProfile(config, 'database');
  const wrappedQueries = queries.map(q => {
    const interpolatedSql = interpolateQueryParams(q.sql, q.params || []);
    const trimmedSql = interpolatedSql.trim();
    const isWriteQuery = /^\s*(insert|update|delete|create|drop|alter|truncate)\b/i.test(trimmedSql);
    
    if (isWriteQuery) {
      return trimmedSql;
    } else {
      const cleanSql = trimmedSql.replace(/;+$/, "");
      return `SELECT coalesce(json_agg(row_to_json(t)), '[]'::json) FROM (${cleanSql}) t;`;
    }
  });

  const fullSql = wrappedQueries.join("\n");
  
  const dbUser = targetConfig.dbUser || "synapse_user";
  const dbPass = targetConfig.dbPass || "";
  const dbName = targetConfig.dbName || "synapse";
  const dbHost = targetConfig.dbHost || "localhost";
  const dbPort = targetConfig.dbPort || 5432;
  
  const escapedPass = dbPass.replace(/'/g, "'\\''");
  const escapedUser = dbUser.replace(/'/g, "'\\''");
  const escapedDb = dbName.replace(/'/g, "'\\''");
  const escapedHost = dbHost.replace(/'/g, "'\\''");
  
  const psqlFinderPrefix = `export PATH="/usr/lib/postgresql/17/bin:/usr/lib/postgresql/16/bin:/usr/lib/postgresql/15/bin:/usr/lib/postgresql/14/bin:/usr/lib/postgresql/13/bin:/usr/lib/postgresql/12/bin:/usr/local/bin:/usr/bin:/bin:$PATH"; PSQL_BIN=$(command -v psql 2>/dev/null || find /usr/lib/postgresql -name psql 2>/dev/null | sort -V | tail -n 1); if [ -z "$PSQL_BIN" ] || ! command -v "$PSQL_BIN" >/dev/null 2>&1; then if command -v apt-get >/dev/null 2>&1; then DEBIAN_FRONTEND=noninteractive apt-get update -qq >/dev/null 2>&1 && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq postgresql-client >/dev/null 2>&1 || true; PSQL_BIN=$(command -v psql 2>/dev/null || find /usr/lib/postgresql -name psql 2>/dev/null | sort -V | tail -n 1); fi; fi; [ -z "$PSQL_BIN" ] && PSQL_BIN="psql";`;

  const b64Sql = Buffer.from(fullSql).toString("base64");
  const cmd = `${psqlFinderPrefix} SQL=$(echo '${b64Sql}' | base64 -d); echo "$SQL" | PGPASSWORD='${escapedPass}' "$PSQL_BIN" -h '${escapedHost}' -p '${dbPort}' -U '${escapedUser}' -d '${escapedDb}' -t -A 2>&1 || echo "$SQL" | PGPASSWORD='${escapedPass}' "$PSQL_BIN" -h '127.0.0.1' -p '${dbPort}' -U '${escapedUser}' -d '${escapedDb}' -t -A 2>&1 || echo "$SQL" | sudo -u postgres "$PSQL_BIN" -d '${escapedDb}' -t -A 2>&1 || echo "$SQL" | sudo "$PSQL_BIN" -U '${escapedUser}' -d '${escapedDb}' -t -A 2>&1`;
  
  try {
    const stdout = await executeSSHCommand(targetConfig, cmd);
    const lines = stdout.trim().split("\n").filter(l => l.trim().length > 0);
    
    return lines.map(line => {
      try {
        if (/^\s*(insert|update|delete|create|drop|alter|truncate)\b/i.test(line)) {
          return [{ success: true, message: line.trim() }];
        }
        return cleanAndParseJSON(line, []);
      } catch (e) {
        console.error("Failed to parse SQL output line:", line, e);
        return [];
      }
    });
  } catch (err: any) {
    console.error("Error executing multi remote postgres queries:", err);
    throw err;
  }
}
