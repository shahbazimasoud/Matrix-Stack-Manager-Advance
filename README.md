<div align="center">

# 🦅 Raven — Matrix Stack Manager
### Enterprise-Grade Spatial Management Hub for Matrix Synapse, Element Web & Auxiliary Services

[![Matrix Synapse](https://img.shields.io/badge/Matrix-Synapse-0DBD8B?style=for-the-badge&logo=matrix&logoColor=white)](https://matrix.org)
[![Element Web](https://img.shields.io/badge/Element-Web-0DBD8B?style=for-the-badge&logo=element&logoColor=white)](https://element.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Linux Ready](https://img.shields.io/badge/Linux-Ubuntu%20%7C%20Debian-FCC624?style=for-the-badge&logo=linux&logoColor=black)](https://ubuntu.com)
[![Version](https://img.shields.io/badge/Version-v2.39.1-6366F1?style=for-the-badge)](VERSION.md)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue?style=for-the-badge)](LICENSE)

[English Documentation](#-english-documentation) • [راهنمای فارسی](#-راهنمای-فارسی-persian-documentation)

</div>

---

# 🇬🇧 English Documentation

## 🌟 Comprehensive Feature Matrix & Capabilities

The **Raven Matrix Stack Manager** is an all-in-one, enterprise-grade spatial control panel designed to configure, monitor, maintain, and scale Matrix homeservers (Synapse), client interfaces (Element Web), voice/video infrastructure (Coturn, LiveKit, Jitsi), and their underlying system dependencies across standalone or clustered nodes.

### 1. 🖥️ Real-Time System Telemetry & Hardware Monitoring
- **Live Hardware Stats**: Instant tracking of CPU load, RAM allocation (Used/Free/Total), Disk capacity, Network I/O throughput (In/Out), Disk IOPS, and I/O Latency.
- **Matrix Ecosystem Metrics**: Live active sessions counter, federated homeservers tally, 24-hour message volume, public/private room counts, and total media vault size.
- **Interactive Multi-Range Analytics**: Visual telemetry charts with 5 distinct display modes and selectable timeframes (1 Hour, 6 Hours, 24 Hours, 7 Days, 30 Days).
- **LVM Storage & Snapshot Telemetry**: Real-time inspection of Physical Volumes (PV), Volume Groups (VG), Logical Volumes (LV), and Thin/Thick Snapshot utilization with automated warning and critical threshold alerts.

### 2. ⚡ Linux Service Orchestration & Process Control
- **1-Click Service Management**: Direct control (Start, Stop, Restart, Reload) for critical daemons:
  - `matrix-synapse` (Matrix Homeserver Core)
  - `nginx` (Reverse Proxy & SSL Termination)
  - `postgresql` (Primary Database Engine)
  - `coturn` (TURN/STUN Relay for VoIP/Video)
  - `element-web` (Web Messaging Client)
- **Live WebSockets Stream**: Real-time journal logs tailing for instant debugging and diagnostics.

### 3. 🌐 Cluster & Remote Node Management (Python Agent)
- **Zero Inbound Open Ports**: Remote Matrix nodes communicate securely with the central panel via an outbound agent, keeping remote firewalls completely locked.
- **Automated Registration**: One-click agent install script generation with cryptographically signed registration tokens.
- **Heartbeat & Telemetry Daemon**: Continuous health checks and system telemetry polling every 30 seconds.
- **Local Sandbox Mode**: Built-in virtual fallback sandbox allowing configuration simulation and testing without modifying live production files.
- **Multi-Server Switching**: Seamlessly toggle between different registered server instances from a single unified panel interface.

### 4. ⚙️ Deep Configuration Hub (ConfigForms)
- **Homeserver & Database**: Base URLs, server name (`HS_DOMAIN`), Element URL (`ELEMENT_DOMAIN`), PostgreSQL connection credentials, and SSL mode selection (Let's Encrypt, Self-Signed, Custom Certs, or Plain).
- **Server Date, Time & Timezone Live Sync**: Real-time clock synchronization between the browser client and the remote host with instant timezone configuration and live tick simulation.
- **Network & Listener Engine**: Port bindings, local/public IP binding modes, rate limits, and reverse-proxy headers.
- **Server Notices & System Announcements**: Broadcast official administrative notices and emergency server alerts directly to all registered accounts.
- **LDAP / Active Directory Integration**: Full Active Directory directory search, TLS bind settings, custom attribute mapping (`uid`, `mail`, `name`), and live bind testing.
- **Synapse Workers Auto-Scaler**: Granular scaling of background Synapse worker processes and dedicated federation senders.
- **Retention & Data Policies**: Local/remote media retention days, message history limits, room creation policies, directory search toggles, and typing/read-receipt controls.
- **SMTP & Email Notifications**: Automated transactional emails, password reset flows, notification templates, and TLS/STARTTLS verification.
- **Element Client Customization**: Default homeserver presets, branding URLs, integrations UI/REST endpoints, and profile editing permissions.
- **VoIP & Video Calling Suite**: Integrated Coturn credentials, LiveKit integration, and custom Jitsi Meet domain bridges.
- **Security Hardening**:
  - **Org-Wide E2EE Lockdown**: Policy toggles to disable or enforce End-to-End Encryption network-wide.
  - **Bot & Abuse Prevention**: CAPTCHA integration supporting Google reCAPTCHA v2/v3 and Cloudflare Turnstile.
  - **API Control Hub & Diagnostics**: Matrix Admin API endpoints testbed, access token validation, and latency benchmarking.
  - **SSL/TLS Certificate Vault**: Automated Let's Encrypt certificate renewal and custom X.509 certificate/key installation.

### 5. 👥 Matrix User & Room Administration (KetesaAdmin)
- **User Lifecycle Management**: Create new MXIDs, reset passwords, promote/demote server administrators, deactivate accounts, lock profiles, shadowban abusive users, and perform GDPR-compliant account erasure.
- **Room Moderation**: Browse all public and private rooms, view joined member rosters with granular power levels (Creator, Admin, Moderator, Default), edit aliases, and purge malicious rooms.
- **Media Vault Browser**: Search and inspect stored media files (MIME types, uploaders, file sizes), quarantine abusive content, and delete orphan or expired media files.
- **Registration Tokens**: Generate invite tokens with custom expiry timestamps, maximum usage quotas, and instant revocation.
- **Abuse Reports & Moderation**: View submitted user flags, abuse reports, and enforce immediate moderator sanctions.

### 6. 🛡️ Role-Based Access Control (RBAC) & Governance
- **Predefined Roles**: Built-in `Owner`, `Admin`, `Moderator`, and `Viewer` profiles.
- **Custom Granular Permissions**: Define bespoke user roles with individual toggles across 15+ sub-modules (Users, Rooms, Media, Config, Terminal, Backups, Undo History, RBAC, Audit, Quick Tasks, and Sessions).
- **Security Audit Logs**: Tamper-evident logging of administrative actions, authentication attempts, IP addresses, and operational statuses.
- **Server Config & File Diff Audit**: Complete versioning of all server configuration changes with side-by-side diff tracking and 1-click historical rollback (Undo).
- **Session Panel & Inactivity Timeout**: Manage active browser sessions, configure automated inactivity logouts, and revoke compromised session tokens.

### 7. 💻 Interactive Web Console & Automation
- **Secure Web Terminal**: Interactive Linux shell emulator with ANSI color support, command history, and instant hotkey shortcuts.
- **Interactive Quick Cleanup**: One-click PostgreSQL VACUUM, cache flushing, orphan media pruning, and temp file purging.
- **Automated Backup & Restore Engine**: Create, download, and restore full-system archives (Config + Database + SSL certificates) with automated cron schedule integration.
- **One-Click Stack Upgrades**: Built-in version checker and automated upgrade runners for Matrix Synapse, Element Web, and system packages.

### 8. 🎨 Spatial UI & Ergonomics
- **Multilingual Support**: Fully localized in English, Persian (فارسی), Spanish (Español), Arabic (العربية), German (Deutsch), and Russian (Русский).
- **Adaptive Theming**: Ultra-high-contrast Light Theme and Spatial Dark Mode.
- **Spatial Floating Dock**: Draggable, reorderable, and minimizable bottom dock navigation.
- **Visual Wallpapers**: Curated spatial desktop backgrounds and customizable aesthetic wallpapers.

---

## 🏗️ Technical Architecture & Stack

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           Raven Admin Web Client                        │
│             (React 19 + TypeScript + Tailwind CSS + Motion)             │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTPS / WebSockets
┌────────────────────────────────────▼────────────────────────────────────┐
│                    Matrix Stack Manager Central Server                  │
│                     (Node.js 22 LTS / Express / tsx)                    │
├────────────────────────┬───────────────────────┬────────────────────────┤
│   Local SQLite / JSON  │  Security & RBAC Core │   Job & Task Dispatch  │
│      Database Store    │  Diff & Undo Engine   │    Reverse Proxy Mgmt  │
└────────────────────────┴───────────┬───────────┴────────────────────────┘
                                     │ Encrypted Agent Protocol
┌────────────────────────────────────▼────────────────────────────────────┐
│                       Remote Matrix Target Nodes                        │
│            (Lightweight Python 3 Telemetry & Execution Agent)           │
├────────────────────────┬───────────────────────┬────────────────────────┤
│     Matrix Synapse     │       PostgreSQL      │     Nginx & Certbot    │
│     Coturn & VoIP      │      Element Client   │    LVM & System Daemons│
└────────────────────────┴───────────────────────┴────────────────────────┘
```

---

## 🚀 Quick Central Panel Installation Guide (English)

Deploy the entire full-stack Raven Matrix Stack Manager panel on any fresh Ubuntu or Debian VPS (x86_64 / ARM64) with a single interactive command:

```bash
curl -sSL https://raw.githubusercontent.com/shahbazimasoud/Matrix-Stack-Manager-Advance/master/setup-panel.sh | sudo bash
```

### 📋 How the Interactive Setup Works:
1. **Interactive Prompts**: Prompts for your Panel domain or public IP, custom access port (default `3000`), and your initial Owner administrator credentials.
2. **Auto-Dependency Installation**: Verifies and installs Node.js 22 LTS, `npm`, `git`, build tools, and essential system libraries.
3. **Network Resilience**: Incorporates fallback mechanisms for reliable execution behind strict firewalls and restricted networks.
4. **Persistent Daemon**: Configures and starts a `systemd` background service named `matrix-manager.service` that automatically starts on system boot.

---

## 📡 Remote Agent Installation (Connecting External Matrix Nodes)

To monitor and administer external Matrix servers from your central panel, install the lightweight Python Agent on each remote Matrix host:

```bash
# Replace <PANEL_URL> with your central panel address and <REGISTRATION_TOKEN> with the token generated from Connection Manager:
curl -sSL http://<PANEL_URL>/install-agent.sh | sudo bash -s -- --url http://<PANEL_URL> --token <REGISTRATION_TOKEN>
```

### 🛡️ Remote Agent Highlights:
- **Telemetry & Heartbeat**: Collects CPU, memory, disk, network, and service states, sending a telemetry heartbeat every 30 seconds.
- **Zero Open Inbound Ports**: The agent initiates all communication outbound to the central panel; no extra inbound firewall ports are opened.
- **Remote Execution**: Securely executes maintenance routines, config writes, PostgreSQL queries, and service restarts dispatched by authorized panel users.

---

## 🛠️ Service Management

Use standard `systemd` commands on the host server to manage the central panel service:

```bash
# Check service status
sudo systemctl status matrix-manager

# View live streaming logs
sudo journalctl -u matrix-manager -f -n 100

# Restart the panel
sudo systemctl restart matrix-manager

# Stop the panel
sudo systemctl stop matrix-manager
```

---

## 🗑️ Uninstallation Guide

To completely remove the Matrix Stack Manager panel, its databases, persistent settings, systemd daemons, and related Nginx configurations from your VPS, run the interactive uninstaller:

```bash
curl -sSL https://raw.githubusercontent.com/shahbazimasoud/Matrix-Stack-Manager-Advance/master/uninstall-panel.sh | sudo bash
```

---

## ⚙️ Local Development & Manual Build

If you wish to clone and run the source code locally for testing or development:

```bash
# 1. Clone the repository
git clone https://github.com/shahbazimasoud/Matrix-Stack-Manager-Advance.git
cd Matrix-Stack-Manager-Advance

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Compile production bundle
npm run build
```

---

# 🇮🇷 راهنمای فارسی (Persian Documentation)

## 🌟 فهرست جامع امکانات و قابلیت‌های پنل مدیریتی ماتریکس

پنل **Raven Matrix Stack Manager** یک پلتفرم جامع و فوق‌پیشرفته برای مدیریت، پایش، نگهداری و مقیاس‌پذیری سرورهای ماتریکس (Matrix Synapse)، کلاینت‌های وب المنت (Element Web)، سیستم‌های تماس صوتی و تصویری (Coturn, LiveKit, Jitsi) و پایگاه داده پستگرس در محیط‌های سرور تکی یا کلاسترهای توزیع‌شده است.

---

### ۱. 🖥️ پایش زنده تله‌متری و منابع سخت‌افزاری سرور
- **پایش آنی مصرف منابع سخت‌افزاری**: نمایش لحظه‌ای میزان مصرف پردازنده (CPU)، حافظه رم (Used / Free / Total)، ظرفیت حافظه دیسک، ترافیک ورودی و خروجی شبکه (Network I/O)، تعداد عملیات ورودی/خروجی دیسک (Disk IOPS) و زمان تاخیر دیسک (Latency).
- **آمارهای اختصاصی اکوسیستم ماتریکس**: نمایش زنده تعداد کاربران آنلاین و سشن‌های فعال، تعداد سرورهای فدراسیون متصل، حجم پیام‌های رد و بدل شده در ۲۴ ساعت گذشته، تعداد اتاق‌های عمومی و خصوصی و حجم کل فایل‌های چندرسانه‌ای ذخیره‌شده.
- **آنالیز نموداری تعاملی و چندحالته**: تحلیل بصری تله‌متری با ۵ حالت نمایش مختلف و بازه‌های زمانی متنوع (۱ ساعته، ۶ ساعته، ۲۴ ساعته، ۷ روزه و ۳۰ روزه).
- **پایش و مدیریت فضای ذخیره‌سازی LVM و اسنپ‌شات‌ها**: پایش وضعیت Physical Volumes (PV)، Volume Groups (VG)، Logical Volumes (LV) و اسنپ‌شات‌های فعال همراه با هشدارهای هوشمند برای رسیدن به آستانه‌های بحرانی و پر شدن ظرفیت.

---

### ۲. ⚡ مدیریت و کنترل سرویس‌های لینوکس
- **کنترل یکپارچه با ۱ کلیک**: کنترل مستقیم (شروع، توقف، راه‌اندازی مجدد و بارگذاری مجدد پیکربندی) برای تمامی سرویس‌های حیاتی:
  - `matrix-synapse` (هسته مرکزی سرور ماتریکس)
  - `nginx` (وب‌سرور، پروکسی معکوس و مدیریت گواهی‌های SSL)
  - `postgresql` (پایگاه داده اصلی سیستم)
  - `coturn` (سرویس رله TURN/STUN برای برقراری تماس‌های صوتی و تصویری)
  - `element-web` (وب‌کلاینت پیام‌رسان المنت)
- **لاگ‌های زنده و بی‌درنگ وب‌سوکت**: استریم زنده لاگ‌های ژورنال لینوکس برای خطایابی و تحلیل فوری وضعیت سرور.

---

### ۳. 🌐 مدیریت کلاستر و سرورهای دوردست (عامل پایتون)
- **امنیت حداکثری بدون نیاز به باز کردن پورت ورودی**: عامل سبک پایتون به صورت خروجی با پنل مرکزی ارتباط برقرار کرده و نیازی به باز بودن پورت‌های ورودی روی سرورهای مقصد نیست.
- **ثبت‌نام خودکار و ایمن**: ایجاد اسکریپت نصب یک‌خطی خودکار با توکن‌های ثبت‌نام رمزنگاری‌شده.
- **سیگنال حیات و سلامت (Heartbeat)**: ارسال مداوم داده‌های مصرف منابع و وضعیت سلامت سرویس‌ها هر ۳۰ ثانیه یک‌بار.
- **حالت سندباکس محلی (Sandbox Mode)**: محیط شبیه‌سازی مجازی پیش‌فرض برای تست و مشاهده امکانات بدون دستکاری فایل‌های واقعی سرور.
- **سوئیچ آسان میان سرورها**: جابه‌جایی سریع میان گره‌ها و سرورهای ماتریکس مختلف از طریق نوار ناوبری مرکزی.

---

### ۴. ⚙️ مرکز تنظیمات و پیکربندی جامع (ConfigForms)
- **تنظیمات سرور اصلی و پایگاه داده**: آدرس‌های اصلی، نام دامنه سرور (`HS_DOMAIN`)، دامنه المنت (`ELEMENT_DOMAIN`)، مشخصات اتصال پایگاه داده PostgreSQL و حالت گواهی امنیتی SSL (Let's Encrypt، گواهی‌های سفارشی یا محلی).
- **همگام‌سازی زنده تاریخ، ساعت و منطقه زمانی**: نمایش و تنظیم بلادرنگ ساعت و تایم‌زون سرور متصل همراه با شبیه‌سازی تیک‌تاک زنده ساعت.
- **تنظیمات شبکه و لیسنرها**: تعریف پورت‌های شنود، حالت اتصال IP (لوکال، عمومی یا سفارشی)، محدودیت‌های نرخ ارسال (Rate Limiting) و هدرهای پروکسی.
- **اعلانات سیستمی (Server Notices)**: ارسال پیام‌های رسمی و هشدارهای اضطراری ادمین به تمامی کاربران ثبت‌نام‌شده در سرور.
- **یکپارچه‌سازی با LDAP و اکتیو دایرکتوری**: جستجوی دایرکتوری، تنظیمات اتصال امن TLS، نگاشت ویژگی‌های کاربری (`uid`, `mail`, `name`) و تست اتصال زنده.
- **مقیاس‌پذیری ورکرها (Synapse Workers)**: تعریف و مدیریت خودکار پردازش‌های پس‌زمینه سیناپس و ارسال‌کننده‌های اختصاصی فدراسیون.
- **سیاست‌های نگهداری داده و پیام‌ها**: تنظیم مدت زمان نگهداری فایل‌های چندرسانه‌ای محلی و ریموت، آرشیو پیام‌ها، مجوزهای ساخت اتاق، جستجوی دایرکتوری و کنترل اعلانات تایپ و تیک خوانده‌شدن.
- **تنظیمات ایمیل و SMTP**: ارسال خودکار ایمیل‌های تراکنشی، بازیابی رمز عبور، قالب‌های ایمیل و اعتبارسنجی اتصالات TLS/STARTTLS.
- **سفارشی‌سازی کلاینت Element Web**: تنظیم سرورهای پیش‌فرض، آدرس‌های برندینگ، وب‌سرویس‌های یکپارچه‌سازی (Integrations UI/REST) و مجوزهای ویرایش پروفایل.
- **سیستم تماس تصویری و صوتی**: مدیریت اطلاعات اتصال Coturn، یکپارچه‌سازی با LiveKit و پل‌های اتصال سرور اختصاصی Jitsi Meet.
- **ارتقای امنیت و تدابیر حفاظتی**:
  - **قفل سراسری رمزنگاری مبدا به مقصد (E2EE Lockdown)**: امکان فعال‌سازی یا غیرفعال‌سازی سراسری رمزنگاری انتها به انتها در سطح کل سازمان.
  - **سیستم ضد اسپم و ربات (CAPTCHA)**: پشتیبانی همزمان از Google reCAPTCHA و Cloudflare Turnstile.
  - **مرکز کنترل و تست API سیناپس**: بستر آزمایش وب‌سرویس‌های Admin API ماتریکس، سنجش اعتبار توکن‌ها و تست تاخیر پاسخگویی.
  - **مدیریت گواهی‌های SSL/TLS**: تمدید خودکار گواهی‌های رایگان Let's Encrypt و نصب گواهی‌ها و کلیدهای خصوصی اختصاصی.

---

### ۵. 👥 مدیریت کاربران، اتاق‌ها و فایل‌ها (KetesaAdmin)
- **مدیریت کامل چرخه حیات کاربران**: ساخت حساب‌های کاربری ماتریکس، تغییر رمز عبور، ارتقای دسترسی ادمین، غیرفعال‌سازی، قفل حساب، مسدودسازی نامحسوس (Shadowban) و حذف کامل داده‌های کاربر منطبق با قوانین GDPR.
- **مدیریت و نظارت بر اتاق‌ها**: مرور لیست تمامی اتاق‌های عمومی و خصوصی، مشاهده اعضای عضو با سطح دسترسی دقیق (Creator, Admin, Moderator, Default)، تغییر نام مستعار (Alias) و حذف اتاق‌های متخلف.
- **مرورگر فایل‌های چندرسانه‌ای (Media Vault)**: جستجو و بازرسی فایل‌های آپلود شده (نوع فایل، حجم، آپلودکننده)، قرنطینه کردن فایل‌های نامناسب و پاکسازی فایل‌های یتیم یا منقضی‌شده.
- **توکن‌های ثبت‌نام اختصاصی**: صدور توکن‌های ثبت‌نام دعوت‌نامه‌ای با قابلیت تعیین سقف تعداد دفعات استفاده، تاریخ انقضا و ابطال آنی.
- **گزارشات تخلف و اعتدال محتوا**: دریافت و بررسی گزارش‌های ارسال‌شده توسط کاربران و اعمال تدابیر انضباطی فوری.

---

### ۶. 🛡️ سیستم کنترل دسترسی سطوح کاربری (RBAC) و امنیت
- **نقش‌های پیش‌فرض**: نقش‌های از پیش تعریف‌شده `Owner` (مالک)، `Admin` (مدیر ارشد)، `Moderator` (ناظر) و `Viewer` (مشاهده‌گر).
- **دسترسی‌های سفارشی و ریزدانه‌ای**: امکان ساخت نقش‌های دلخواه با تعیین دسترسی دقیق روی بیش از ۱۵ بخش مختلف پنل (کاربران، اتاق‌ها، مدیا، کانفیگ، ترمینال، پشتیبان‌گیری، تاریخچه تغییرات، لاگ‌ها، تسک‌های سریع و سشن‌ها).
- **لاگ‌های امنیتی ممیزی (Security Audit Logs)**: ثبت غیرقابل دستکاری تمامی رویدادهای ورود، تغییرات حساس، آدرس‌های IP و نتایج عملیات‌ها.
- **ثبت تاریخچه تغییرات فایل‌ها و کانفیگ‌ها (Config Diff Audit)**: نگهداری نسخه قبلی و جدید تمام تنظیمات با نمایش تفاوت‌ها (Diff) و امکان بازگردانی سریع به نسخه قبلی (Undo).
- **مدیریت سشن‌ها و انقضای خودکار**: تنظیم زمان عدم فعالیت (Inactivity Timeout)، مشاهده سشن‌های فعال مرورگر و ابطال سشن‌های مشکوک.

---

### ۷. 💻 ترمینال وب تعاملی و ابزارهای خودکارسازی
- **ترمینال امن لینوکس تحت وب**: شبیه‌ساز شل تعاملی با پشتیبانی از رنگ‌های ANSI، تاریخچه دستورات و کلیدهای میانبر سریع.
- **پاکسازی تعاملی ۱ کلیکی (Quick Cleanup)**: اجرای سریع بهینه‌سازی دیتابیس (VACUUM)، تخلیه کش، حذف فایل‌های چندرسانه‌ای اضافی و پاکسازی پوشه‌های موقت.
- **سیستم پشتیبان‌گیری و بازیابی جامع**: ایجاد، دانلود و بازیابی فایل‌های پشتیبان کامل (تنظیمات، پایگاه داده و گواهی‌های SSL) همراه با زمان‌بندی خودکار کرون‌جاب (Cron).
- **مرکز ارتقای سیستم و پکیج‌ها**: پایش نسخه‌ها و به‌روزرسانی تک‌کلیکی هسته ماتریکس سیناپس، کلاینت المنت و پکیج‌های سیستمی.

---

### ۸. 🎨 رابط کاربری فضایی و امکانات ظاهری (Spatial UI)
- **پشتیبانی از چندین زبان**: ترجمه کامل به زبان‌های فارسی، انگلیسی، اسپانیایی، عربی، آلمانی و روسی.
- **قالب‌های تطبیقی**: پشتیبانی از تم تاریک فضایی (Spatial Dark Mode) و تم روشن شفاف با کنتراست فوق‌العاده بالا.
- **داک ناوبری شناور و انعطاف‌پذیر**: داک پایینی با قابلیت جابه‌جایی با کشیدن و رها کردن (Drag & Drop)، مرتب‌سازی و جمع‌شدن.
- **تصاویر پس‌زمینه اختصاصی**: امکان انتخاب والپیپرهای مدرن فضایی و تنظیم پس‌زمینه‌های دلخواه.

---

## 🏗️ معماری و ساختار فنی

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        کلاینت وب پیشرفته پنل                            │
│             (React 19 + TypeScript + Tailwind CSS + Motion)             │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTPS / WebSockets
┌────────────────────────────────────▼────────────────────────────────────┐
│                       وب‌سرور مرکزی مدیریت ماتریکس                      │
│                     (Node.js 22 LTS / Express / tsx)                    │
├────────────────────────┬───────────────────────┬────────────────────────┤
│   پایگاه داده لوکال    │   هسته امنیت و RBAC   │    صف مدیریت تسک‌ها    │
│      SQLite / JSON     │ موتور Diff و بازیابی  │  پروکسی معکوس و Nginx  │
└────────────────────────┴───────────┬───────────┴────────────────────────┘
                                     │ پروتکل امن و رمزنگاری‌شده عامل
┌────────────────────────────────────▼────────────────────────────────────┐
│                       سرورهای دوردست ماتریکس                            │
│           (عامل پایتونی سبک جهت پایش منابع و اجرای دستورات)             │
├────────────────────────┬───────────────────────┬────────────────────────┤
│     Matrix Synapse     │       PostgreSQL      │     Nginx & Certbot    │
│     Coturn & VoIP      │      Element Client   │   LVM و سرویس‌های سیستم│
└────────────────────────┴───────────────────────┴────────────────────────┘
```

---

## 🚀 راهنمای نصب سریع پنل مرکزی (فارسی)

شما می‌توانید کل پروژه (شامل کلاینت پنل و سرور بک‌اند) را روی هر سرور ابری یا VPS خام (لینوکس اوبونتو یا دبیان) به سادگی با اجرای یک دستور تک‌خطی زیر نصب کنید:

```bash
curl -sSL https://raw.githubusercontent.com/shahbazimasoud/Matrix-Stack-Manager-Advance/master/setup-panel.sh | sudo bash
```

### 📋 مراحل نصب تعاملی پنل:
۱. **دامنه یا IP**: اسکریپت آدرس دامنه یا آی‌پی پنل شما را می‌پرسد.
۲. **پورت شبکه**: پورت اجرای پنل (به صورت پیش‌فرض ۳۰۰۰) را وارد می‌کنید. پنل و وب‌سرویس پشتیبان به‌طور کامل از پورت سفارشی شما در زمان اجرا پشتیبانی می‌کنند.
۳. **اطلاعات ادمین اصلی (Owner)**: نام کاربری، ایمیل و رمز عبور ادمین اولیه از شما پرسیده می‌شود.
۴. **راه‌اندازی خودکار**: اسکریپت به طور خودکار آخرین نسخه پایدار Node.js 22 LTS، ابزارهای کامپایل و Git را نصب کرده، دیتابیس لوکال را با رمز ادمین هش‌شده بذرپاشی (Seed) می‌کند و یک وب‌سرویس پس‌زمینه پایدار با استفاده از `systemd` ایجاد می‌نماید.

---

## 📡 راهنمای راه‌اندازی عامل مدیریتی روی سرورهای دوردست (Remote Agent)

جهت افزودن و مدیریت سرورهای ماتریکس مجزا از طریق پنل مرکزی، کافیست عامل سبک پایتون را روی سرور ماتریکس مقصد با اجرای دستور زیر نصب و فعال نمایید:

```bash
# جایگزین کردن <PANEL_URL> با آدرس پنل مرکزی و <REGISTRATION_TOKEN> با توکن دریافتی از بخش مدیریت اتصالات
curl -sSL http://<PANEL_URL>/install-agent.sh | sudo bash -s -- --url http://<PANEL_URL> --token <REGISTRATION_TOKEN>
```

### 🛡️ ویژگی‌های کلیدی عامل هوشمند:
- **پایش مداوم و ارسال سیگنال حیات (Heartbeat)**: جمع‌آوری داده‌های مصرف پردازنده، رم، دیسک، شبکه و ارسال گزارش به پنل مرکزی هر ۳۰ ثانیه یک‌بار.
- **عدم نیاز به پورت ورودی باز**: ارتباط صرفاً به صورت خروجی به سمت پنل مرکزی برقرار می‌شود تا امنیت سرور مقصد تضمین شود.
- **کنترل و اجرای فرآیندها**: اجرای امن دستورات نگهداری، تغییر فایل‌های تنظیمات، اجرای کوئری‌های دیتابیس و ری‌استارت سرویس‌ها توسط کاربران مجاز.

---

## 🛠️ مدیریت سرویس پنل در لینوکس

پس از اتمام نصب، برای مدیریت سرویس پس‌زمینه پنل از دستورات زیر در ترمینال سرور استفاده کنید:

```bash
# مشاهده وضعیت اجرای سرویس
sudo systemctl status matrix-manager

# مشاهده لاگ‌های زنده و لاگ‌های سرور
sudo journalctl -u matrix-manager -f -n 100

# راه‌اندازی مجدد پنل
sudo systemctl restart matrix-manager

# متوقف کردن پنل
sudo systemctl stop matrix-manager
```

---

## 🗑️ راهنمای حذف کامل پنل از روی سرور

در صورتی که می‌خواهید پنل را به همراه تمامی فایل‌ها، سرویس‌ها، دیتابیس‌ها و تنظیمات وب‌سرور Nginx به طور کامل حذف کنید، از اسکریپت حذف تعاملی زیر استفاده نمایید:

```bash
curl -sSL https://raw.githubusercontent.com/shahbazimasoud/Matrix-Stack-Manager-Advance/master/uninstall-panel.sh | sudo bash
```

---

## ⚙️ توسعه و اجرای محلی (Manual Development)

اگر قصد توسعه پنل روی سیستم محلی یا ویرایش سورس‌کد را دارید:

```bash
# ۱. کلون کردن ریپازیتوری
git clone https://github.com/shahbazimasoud/Matrix-Stack-Manager-Advance.git
cd Matrix-Stack-Manager-Advance

# ۲. نصب پکیج‌ها و وابستگی‌ها
npm install

# ۳. اجرای سرور در حالت توسعه
npm run dev

# ۴. بیلد و کامپایل نسخه نهایی
npm run build
```

---

<div align="center">

**Developed with ❤️ for the Matrix Ecosystem**

</div>
