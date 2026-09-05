/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  Terminal as TermIcon, 
  BarChart3, 
  Lock, 
  User, 
  Users,
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  HardDrive, 
  Activity, 
  Network, 
  Layers,
  FileText, 
  Undo2, 
  Globe, 
  Play, 
  RefreshCw, 
  UserPlus, 
  ShieldCheck as Shield,
  Languages,
  Video,
  ShieldAlert,
  Sun,
  Moon,
  ArrowRight,
  LogOut,
  BookOpen,
  Palette,
  Info,
  ExternalLink,
  Code,
  Flag,
  Github,
  WifiOff,
  Loader2,
  Check,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import SpatialDock from './components/SpatialDock';
import MetricCard from './components/MetricCard';
import TerminalPanel from './components/TerminalPanel';
import ConfigForms from './components/ConfigForms';
import ReportingPanel from './components/ReportingPanel';
import KetesaAdmin from './components/KetesaAdmin';
import ConnectionManager from './components/ConnectionManager';
import { InstallWizardModal } from './components/InstallWizardModal';
import { GuidedTourModal } from './components/GuidedTourModal';
import { AboutModal } from './components/AboutModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import RavenLogo from './components/RavenLogo';
import { SystemStats, ServiceState, PanelUser, AuditLog, BackupItem, UndoItem, MatrixConfig, LDAPConfig, MatrixUser, CustomPermissions } from './types';
import { PANEL_VERSION, PANEL_BUILD_DATE, PANEL_NAME, getUpdateVersionString } from './version';

// Translation Dictionary for Persian (Default), English, Spanish, Arabic, German & Russian
const translations = {
  fa: {
    title: "Raven — مدیریت پشته ماتریکس",
    subtitle: "رابط کاربری فضایی (Spatial UI) - مدیریت بلادرنگ سرور ماتریکس، المنت و سرویس‌های پشته Raven",
    loginTitle: "پنل مدیریت پشته ماتریکس Raven",
    loginSubtitle: "درگاه امن Raven برای مدیریت سرور ماتریکس (Synapse)، کلاینت المنت و سرویس‌های پشتیبان",
    username: "نام کاربری",
    password: "رمز عبور",
    rememberMe: "مرا به خاطر بسپار",
    loginBtn: "لاگین",
    logoutBtn: "خروج",
    liveStatus: "وضعیت سرور: متصل",
    checkingStatus: "در حال به روز رسانی...",
    cpuLoad: "بار پردازنده",
    ramUsage: "رم مصرفی",
    diskUsage: "فضای دیسک",
    activeSessions: "نشست‌های ماتریکس",
    servicesState: "وضعیت سرویس‌های لینوکس",
    logsTitle: "گزارشات آنی سرور (WebSockets)",
    terminalTitle: "کنسول خط فرمان لینوکس",
    saveSuccess: "تغییرات با موفقیت در دیتابیس نود جی‌اس ذخیره و همگام‌سازی شد.",
    testLdapBtn: "تست اتصال اکتیو دایرکتوری",
    e2eeLock: "قفل و غیرفعال‌سازی رمزگذاری سرتاسری (E2EE) در کل سازمان",
    e2eeUnlock: "فعال‌سازی رمزگذاری سرتاسری (E2EE)",
    autoReporting: "تحلیل بلادرنگ و گزارش‌گیری خودکار عملکرد",
    roleManage: "سیستم مدیریت دسترسی و نقش‌ها (RBAC)",
    unauthorized: "دسترسی غیرمجاز: نقش شما اجازه انجام این کار را نمی‌دهد.",
    runningTask: "در حال اجرای دستور روی سرور...",
    backupCreated: "پشتیبان‌گیری جدید با موفقیت ایجاد شد.",
    undoSuccess: "آخرین تغییر پیکربندی با موفقیت بازگردانی شد.",
    themeToggle: "تغییر تم (روشن/تاریک)",
    connectedPrefix: "متصل به: ",
    localSandboxMode: "حالت سنباکس محلی",
    remoteOnboardingTitle: "اتصال به سرور ماتریکس / المنت راه دور",
    remoteOnboardingDesc: "این پنل در حال حاضر در حالت سندباکس محلی اجرا می‌شود. برای مدیریت مستقیم سرویس‌های ماتریکس، تنظیمات، کاربران و تلمتری در سرور VPS واقعی خود، یک اتصال SSH و پایگاه‌داده جدید تعریف نمایید.",
    connectRemoteBtn: "اتصال سرور راه دور",
    connectedProfileLabel: "پروفایل سرور متصل",
    connectedProfileDesc: "سرویس‌های ماتریکس، وب‌کلاینت المنت و دیتابیس پستگرس از طریق تونل SSH امن به شکل زنده مدیریت می‌شوند.",
    refreshStatsBtn: "به‌روزرسانی آمار",
    switchProfileBtn: "تغییر سرور",
    refreshing: "درحال همگام‌سازی...",
    dateTime: "تاریخ و ساعت سرور",
    dateTimeSub: "زمان و تاریخ محلی سرور متصل",
    serviceStart: "شروع",
    serviceStarting: "درحال شروع...",
    serviceStop: "توقف",
    serviceStopping: "درحال توقف...",
    serviceRestart: "راه‌اندازی مجدد",
    serviceRestarting: "درحال راه‌اندازی...",
    serviceReload: "بارگذاری مجدد",
    serviceReloading: "درحال بارگذاری..."
  },
  en: {
    title: "Raven — Matrix Stack Manager",
    subtitle: "Spatial UI Design - Real-time Management Panel for Matrix Synapse, Element & TURN",
    loginTitle: "Raven Matrix Stack Panel",
    loginSubtitle: "Secure access gateway for Raven Matrix Synapse core, Element Client, and auxiliary services",
    username: "Username",
    password: "Password",
    rememberMe: "Remember me",
    loginBtn: "Login",
    logoutBtn: "Logout",
    liveStatus: "Server State: Connected",
    checkingStatus: "Syncing data...",
    cpuLoad: "CPU Usage",
    ramUsage: "Memory Usage",
    diskUsage: "Disk Occupied",
    activeSessions: "Active Users",
    servicesState: "Linux Service Statuses",
    logsTitle: "Live Server Logs (WebSockets)",
    terminalTitle: "Linux Secure Shell Console",
    saveSuccess: "Configurations saved and synced with Node.js in real-time.",
    testLdapBtn: "Test Active Directory Bind",
    e2eeLock: "Lock & Disable End-to-End Encryption (E2EE) Org-Wide",
    e2eeUnlock: "Enable End-to-End Encryption (E2EE)",
    autoReporting: "Real-time Analysis & Automated Reporting",
    roleManage: "Role-Based Access Control System (RBAC)",
    unauthorized: "Unauthorized: Your role does not have privileges for this action.",
    runningTask: "Executing server-side scripts...",
    backupCreated: "New full-archive backup created successfully.",
    undoSuccess: "Last configuration change reverted successfully.",
    themeToggle: "Toggle Theme (Light/Dark)",
    connectedPrefix: "Connected: ",
    localSandboxMode: "Local Sandbox Mode",
    remoteOnboardingTitle: "Connect Your Remote Matrix/Element Server",
    remoteOnboardingDesc: "This control panel is currently running in fallback Sandbox mode. Establish a secure SSH and Database connection profile to start managing your active Matrix homeserver services, config files, user registration, rooms, and live telemetry on your production VPS.",
    connectRemoteBtn: "Connect Remote Server",
    connectedProfileLabel: "Connected Server Profile",
    connectedProfileDesc: "Matrix homeserver, Element client, and Postgres Database are actively being managed over SSH tunnel.",
    refreshStatsBtn: "Refresh Stats",
    switchProfileBtn: "Switch Profile",
    refreshing: "Refreshing...",
    dateTime: "Server Date & Time",
    dateTimeSub: "Connected server local system clock",
    serviceStart: "Start",
    serviceStarting: "Starting...",
    serviceStop: "Stop",
    serviceStopping: "Stopping...",
    serviceRestart: "Restart",
    serviceRestarting: "Restarting...",
    serviceReload: "Reload",
    serviceReloading: "Reloading..."
  },
  es: {
    title: "Gestor de Pila Matrix",
    subtitle: "Diseño de Interfaz Espacial - Panel de Gestión en Tiempo Real para Matrix Synapse, Element y TURN",
    loginTitle: "Gestor de Pila Matrix",
    loginSubtitle: "Puerta de acceso segura para el núcleo Matrix Synapse, el cliente Element y el servidor TURN",
    username: "Nombre de usuario",
    password: "Contraseña",
    rememberMe: "Recordarme",
    loginBtn: "Iniciar Sesión",
    logoutBtn: "Cerrar Sesión",
    liveStatus: "Estado del Servidor: Conectado",
    checkingStatus: "Sincronizando datos...",
    cpuLoad: "Uso de CPU",
    ramUsage: "Uso de Memoria",
    diskUsage: "Disco Ocupado",
    activeSessions: "Usuarios Activos",
    servicesState: "Estado de Servicios Linux",
    logsTitle: "Logs del Servidor en Vivo (WebSockets)",
    terminalTitle: "Consola de Comandos Linux Segura",
    saveSuccess: "Configuraciones guardadas y sincronizadas con Node.js en tiempo real.",
    testLdapBtn: "Probar Conexión de Active Directory",
    e2eeLock: "Bloquear y Desactivar Encriptación de Extremo a Extremo (E2EE) en la Organización",
    e2eeUnlock: "Activar Encriptación de Extremo a Extremo (E2EE)",
    autoReporting: "Análisis en Tiempo Real y Reportes Automatizados",
    roleManage: "Sistema de Control de Acceso Basado en Roles (RBAC)",
    unauthorized: "No autorizado: Su rol no tiene privilegios para esta acción.",
    runningTask: "Ejecutando scripts en el servidor...",
    backupCreated: "Nueva copia de seguridad completa creada con éxito.",
    undoSuccess: "Último cambio de configuración revertido con éxito.",
    themeToggle: "Alternar Tema (Claro/Oscuro)",
    connectedPrefix: "Conectado a: ",
    localSandboxMode: "Modo Sandbox Local",
    remoteOnboardingTitle: "Conecte su Servidor Matrix/Element Remoto",
    remoteOnboardingDesc: "Este panel de control se está ejecutando actualmente en modo Sandbox de respaldo. Establezca un perfil de conexión SSH و Base de Datos seguro para comenzar a administrar sus servicios activos de servidor Matrix, archivos de configuración, registro de usuarios, salas y telemetría en vivo en su VPS de producción.",
    connectRemoteBtn: "Conectar Servidor Remoto",
    connectedProfileLabel: "Perfil de Servidor Conectado",
    connectedProfileDesc: "El servidor Matrix, el cliente Element و la base de datos Postgres se administran activamente a través de un túnel SSH.",
    refreshStatsBtn: "Refrescar Estadísticas",
    switchProfileBtn: "Cambiar Perfil",
    refreshing: "Refrescando...",
    dateTime: "Fecha y Hora del Servidor",
    dateTimeSub: "Reloj del sistema del servidor conectado",
    serviceStart: "Iniciar",
    serviceStarting: "Iniciando...",
    serviceStop: "Detener",
    serviceStopping: "Deteniendo...",
    serviceRestart: "Reiniciar",
    serviceRestarting: "Reiniciando...",
    serviceReload: "Recargar",
    serviceReloading: "Recargando..."
  },
  ar: {
    title: "مدير حزمة ماتريكس",
    subtitle: "تصميم واجهة مستخدم فضائية - لوحة تحكم فورية لـ Matrix Synapse و Element و TURN",
    loginTitle: "مدير حزمة ماتريكس",
    loginSubtitle: "بوابة وصول آمنة لنواة ماتريكس سينابس، وعميل المنت، وخادم TURN",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    rememberMe: "تذكرني",
    loginBtn: "تسجيل الدخول",
    logoutBtn: "تسجيل الخروج",
    liveStatus: "حالة الخادم: متصل",
    checkingStatus: "مزامنة البيانات...",
    cpuLoad: "استخدام المعالج",
    ramUsage: "استخدام الذاكرة",
    diskUsage: "المساحة المستخدمة",
    activeSessions: "المستخدمون النشطون",
    servicesState: "حالة خدمات لينكس",
    logsTitle: "سجلات الخادم المباشرة (WebSockets)",
    terminalTitle: "وحدة التحكم الطرفية الآمنة لينكس",
    saveSuccess: "تم حفظ التكوينات ومزامنتها مع Node.js في الوقت الفعلي.",
    testLdapBtn: "اختبار اتصال الدليل النشط",
    e2eeLock: "قفل وتعطيل التشفير بين الطرفين (E2EE) على مستوى المؤسسة",
    e2eeUnlock: "تمكين التشفير بين الطرفين (E2EE)",
    autoReporting: "التحليل الفوري والتقارير الآلية",
    roleManage: "نظام التحكم في الوصول المستند إلى الأدوار (RBAC)",
    unauthorized: "غير مصرح به: ليس لدورك الصلاحيات اللازمة لهذا الإجراء.",
    runningTask: "تشغيل النصوص البرمجية على الخادم...",
    backupCreated: "تم إنشاء نسخة احتياطية أرشيفية كاملة بنجاح.",
    undoSuccess: "تم التراجع عن آخر تغيير في التكوين بنجاح.",
    themeToggle: "تبديل المظهر (فاتح/داكن)",
    connectedPrefix: "متصل بـ: ",
    localSandboxMode: "وضع الحماية المحلي (Sandbox)",
    remoteOnboardingTitle: "قم بتوصيل خادم ماتريكس/المنت البعيد الخاص بك",
    remoteOnboardingDesc: "تعمل لوحة التحكم هذه حاليًا في وضع الحماية الاحتياطي. قم بإنشاء ملف تعریف اتصال SSH وقاعدة بيانات آمن لبدء إدارة خدمات خادم ماتريكس النشطة وملفات التكوين وتسجيل المستخدمين والغرف والقياس المباشر عن بُعد على خادمك الافتراضي (VPS).",
    connectRemoteBtn: "توصيل خادم بعيد",
    connectedProfileLabel: "ملف تعریف الخادم المتصل",
    connectedProfileDesc: "يتم إدارة خادم ماتريكس وعميل المنت وقاعدة بيانات بوستجرس بنشاط عبر نفق SSH آمن.",
    refreshStatsBtn: "تحديث الإحصائيات",
    switchProfileBtn: "تبديل ملف التعريف",
    refreshing: "جاري التحديث...",
    dateTime: "تاريخ ووقت الخادم",
    dateTimeSub: "الساعة والوقت المحلي للخادم المتصل",
    serviceStart: "بدء",
    serviceStarting: "جاري البدء...",
    serviceStop: "إيقاف",
    serviceStopping: "جاري الإيقاف...",
    serviceRestart: "إعادة التشغيل",
    serviceRestarting: "جاري إعادة التشغيل...",
    serviceReload: "إعادة التحميل",
    serviceReloading: "جاري إعادة التحميل..."
  },
  de: {
    title: "Matrix-Stack-Manager",
    subtitle: "Spatial UI-Design - Echtzeit-Verwaltungspanel für Matrix Synapse, Element & TURN",
    loginTitle: "Matrix-Stack-Manager",
    loginSubtitle: "Sicheres Zugangs-Gateway für den Matrix Synapse Core, den Element Client und den TURN-Server",
    username: "Benutzername",
    password: "Passwort",
    rememberMe: "Angemeldet bleiben",
    loginBtn: "Anmelden",
    logoutBtn: "Abmelden",
    liveStatus: "Server-Status: Verbunden",
    checkingStatus: "Daten werden synchronisiert...",
    cpuLoad: "CPU-Auslastung",
    ramUsage: "Speicherauslastung",
    diskUsage: "Belegter Festplattenplatz",
    activeSessions: "Aktive Benutzer",
    servicesState: "Linux-Dienststatus",
    logsTitle: "Live-Server-Protokolle (WebSockets)",
    terminalTitle: "Sichere Linux-Shell-Konsole",
    saveSuccess: "Konfigurationen wurden in Echtzeit gespeichert und mit Node.js synchronisiert.",
    testLdapBtn: "Active Directory Bindung testen",
    e2eeLock: "Ende-zu-Ende-Verschlüsselung (E2EE) organisationsweit sperren & deaktivieren",
    e2eeUnlock: "Ende-zu-Ende-Verschlüsselung (E2EE) aktivieren",
    autoReporting: "Echtzeit-Analyse & automatisierte Berichterstattung",
    roleManage: "Rollenbasierte Zugriffskontrolle (RBAC)",
    unauthorized: "Nicht autorisiert: Ihre Rolle hat keine Berechtigungen für diese Aktion.",
    runningTask: "Server-Skripte werden ausgeführt...",
    backupCreated: "Neues Vollarchiv-Backup erfolgreich erstellt.",
    undoSuccess: "Letzte Konfigurationsänderung erfolgreich rückgängig gemacht.",
    themeToggle: "Design umschalten (Hell/Dunkel)",
    connectedPrefix: "Verbunden mit: ",
    localSandboxMode: "Lokaler Sandbox-Modus",
    remoteOnboardingTitle: "Verbinden Sie Ihren Remote-Matrix/Element-Server",
    remoteOnboardingDesc: "Dieses Bedienfeld wird derzeit im Fallback-Sandbox-Modus ausgeführt. Richten Sie ein sicheres SSH- und Datenbank-Verbindungsprofil ein, um Ihre aktiven Matrix-Homeserver-Dienste, Konfigurationsdateien, Benutzerregistrierungen, Räume und Live-Telemetriedaten auf Ihrem Produktions-VPS zu verwalten.",
    connectRemoteBtn: "Remote-Server verbinden",
    connectedProfileLabel: "Verbundenes Serverprofil",
    connectedProfileDesc: "Matrix-Homeserver, Element-Client und Postgres-Datenbank werden aktiv über einen SSH-Tunnel verwaltet.",
    refreshStatsBtn: "Statistiken aktualisieren",
    switchProfileBtn: "Profil wechseln",
    refreshing: "Aktualisierung...",
    dateTime: "Server Datum & Uhrzeit",
    dateTimeSub: "Lokale Systemzeit des verbundenen Servers",
    serviceStart: "Starten",
    serviceStarting: "Wird gestartet...",
    serviceStop: "Stoppen",
    serviceStopping: "Wird gestoppt...",
    serviceRestart: "Neustarten",
    serviceRestarting: "Wird neu gestartet...",
    serviceReload: "Neu laden",
    serviceReloading: "Wird neu geladen..."
  },
  ru: {
    title: "Управление стеком Matrix",
    subtitle: "Пространственный интерфейс (Spatial UI) — панель управления Matrix Synapse, Element и TURN в реальном времени",
    loginTitle: "Управление стеком Matrix",
    loginSubtitle: "Безопасный вход в панель управления ядром Matrix Synapse, клиентом Element и TURN-сервером",
    username: "Имя пользователя",
    password: "Пароль",
    rememberMe: "Запомнить меня",
    loginBtn: "Войти",
    logoutBtn: "Выйти",
    liveStatus: "Статус сервера: Подключен",
    checkingStatus: "Синхронизация данных...",
    cpuLoad: "Нагрузка на ЦП",
    ramUsage: "Использование ОЗУ",
    diskUsage: "Занято на диске",
    activeSessions: "Активные пользователи",
    servicesState: "Статус служб Linux",
    logsTitle: "Живые логи сервера (WebSockets)",
    terminalTitle: "Безопасная консоль Linux (SSH)",
    saveSuccess: "Конфигурации сохранены и синхронизированы с Node.js в реальном времени.",
    testLdapBtn: "Тестировать подключение к Active Directory",
    e2eeLock: "Заблокировать и отключить сквозное шифрование (E2EE) в организации",
    e2eeUnlock: "Включить сквозное шифрование (E2EE)",
    autoReporting: "Анализ в реальном времени и автоотчеты",
    roleManage: "Система управления доступом на основе ролей (RBAC)",
    unauthorized: "Неавторизовано: у вашей роли недостаточно прав для этого действия.",
    runningTask: "Выполнение скриптов на сервере...",
    backupCreated: "Новая резервная копия успешно создана.",
    undoSuccess: "Последнее изменение конфигурации успешно отменено.",
    themeToggle: "Переключить тему (Светлая/Темная)",
    connectedPrefix: "Подключено к: ",
    localSandboxMode: "Локальный режим песочницы",
    remoteOnboardingTitle: "Подключите ваш удаленный сервер Matrix/Element",
    remoteOnboardingDesc: "Эта панель управления в данный момент работает в резервном режиме песочницы. Создайте безопасное SSH- и профиль подключения к базе данных, чтобы начать управлять активными службами Matrix, файлами конфигурации, регистрацией пользователей, комнатами и живой телеметрией на вашем рабочем VPS.",
    connectRemoteBtn: "Подключить удаленный сервер",
    connectedProfileLabel: "Профиль подключенного сервера",
    connectedProfileDesc: "Сервер Matrix, веб-клиент Element и база данных Postgres активно управляются через безопасный SSH-туннель.",
    refreshStatsBtn: "Обновить статистику",
    switchProfileBtn: "Сменить профиль",
    refreshing: "Обновление...",
    dateTime: "Дата и время сервера",
    dateTimeSub: "Системное время подключенного сервера",
    serviceStart: "Запустить",
    serviceStarting: "Запуск...",
    serviceStop: "Остановить",
    serviceStopping: "Остановка...",
    serviceRestart: "Перезапустить",
    serviceRestarting: "Перезапуск...",
    serviceReload: "Перезагрузить",
    serviceReloading: "Перезагрузка..."
  }
};
const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' }
] as const;

export default function App() {
  const [lang, setLang] = useState<'fa' | 'en' | 'es' | 'ar' | 'de' | 'ru'>((localStorage.getItem('lang_pref') as any) || 'en');
  const t = translations[lang] || translations.en;
  const isRtl = lang === 'fa' || lang === 'ar';
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  // Theme State (obsidian, emerald, rose, amber, cobalt, light)
  type ThemeType = 'obsidian' | 'emerald' | 'rose' | 'amber' | 'cobalt' | 'light';

  const [panelTheme, setPanelTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('panel_theme') as ThemeType;
    if (['obsidian', 'emerald', 'rose', 'amber', 'cobalt', 'light'].includes(saved)) return saved;
    if (localStorage.getItem('theme_mode') === 'light') return 'light';
    return 'obsidian';
  });

  const isLightMode = panelTheme === 'light';

  const changeTheme = (newTheme: ThemeType) => {
    setPanelTheme(newTheme);
    localStorage.setItem('panel_theme', newTheme);
    localStorage.setItem('theme_mode', newTheme === 'light' ? 'light' : 'dark');
  };

  // Auth States
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginUser, setLoginUser] = useState(() => localStorage.getItem('last_login_user') || '');
  const [loginPass, setLoginPass] = useState('');
  const [rememberMe, setRememberMe] = useState<boolean>(() => localStorage.getItem('remember_me') === 'true');
  const [loginErrorData, setLoginErrorData] = useState<{ errorsByLang?: Record<string, string>; defaultMsg?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('last_login_error_data');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });
  const [loginError, setLoginError] = useState(() => localStorage.getItem('last_login_error') || '');
  const [isPassFocused, setIsPassFocused] = useState(false);

  // Sync login error message language dynamically when language changes
  useEffect(() => {
    if (loginErrorData) {
      let activeErr = '';
      if (loginErrorData.errorsByLang && loginErrorData.errorsByLang[lang]) {
        activeErr = loginErrorData.errorsByLang[lang];
      } else if (lang === 'fa' && loginErrorData.errorsByLang?.fa) {
        activeErr = loginErrorData.errorsByLang.fa;
      } else if (loginErrorData.errorsByLang?.en) {
        activeErr = loginErrorData.errorsByLang.en;
      } else if (loginErrorData.defaultMsg) {
        activeErr = loginErrorData.defaultMsg;
      }
      if (activeErr) {
        setLoginError(activeErr);
        localStorage.setItem('last_login_error', activeErr);
      }
    }
  }, [lang, loginErrorData]);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaId, setCaptchaId] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [lockoutRemainingSecs, setLockoutRemainingSecs] = useState<number>(0);

  // Countdown timer for account lockout remaining seconds
  useEffect(() => {
    if (lockoutRemainingSecs <= 0) return;
    const timer = setInterval(() => {
      setLockoutRemainingSecs(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          checkLoginSecurityConfig(loginUser);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutRemainingSecs, loginUser]);

  // On mount or when unauthenticated, check login security rules for saved username
  useEffect(() => {
    if (!authToken) {
      const savedUser = localStorage.getItem('last_login_user') || loginUser;
      if (savedUser) {
        checkLoginSecurityConfig(savedUser);
      } else {
        checkLoginSecurityConfig('');
      }
    }
  }, [authToken]);

  // Fetch security configuration for login
  const checkLoginSecurityConfig = (uname: string) => {
    fetch(`/api/security/login-config?username=${encodeURIComponent(uname)}`)
      .then(res => res.json())
      .then(data => {
        if (data.captchaRequired) {
          setCaptchaRequired(true);
          if (data.captcha) {
            setCaptchaId(data.captcha.id);
            setCaptchaSvg(data.captcha.svg);
          }
        } else {
          setCaptchaRequired(false);
        }
        if (data.lockoutStatus?.isLocked) {
          setLockoutRemainingSecs(data.lockoutStatus.remainingSeconds);
        } else {
          setLockoutRemainingSecs(0);
        }
      })
      .catch(() => {});
  };

  const refreshCaptcha = () => {
    fetch('/api/security/captcha')
      .then(res => res.json())
      .then(data => {
        if (data.id && data.svg) {
          setCaptchaId(data.id);
          setCaptchaSvg(data.svg);
          setCaptchaCode('');
        }
      })
      .catch(() => {});
  };

  // Live Metric and VFS state
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [services, setServices] = useState<ServiceState[]>([
    { id: 'synapse', name: 'matrix-synapse', displayName: 'Matrix Synapse Server', status: 'active', port: 8008, version: '1.98.0' },
    { id: 'element', name: 'nginx-element', displayName: 'Element Web client', status: 'active', port: 443 },
    { id: 'postgres', name: 'postgresql', displayName: 'PostgreSQL Database', status: 'active', port: 5432 },
    { id: 'coturn', name: 'coturn', displayName: 'coturn TURN Server', status: 'active', port: 3478 },
    { id: 'redis', name: 'redis-server', displayName: 'Redis Worker Queue', status: 'inactive' },
    { id: 'nginx', name: 'nginx', displayName: 'Nginx Web Proxy', status: 'active', port: 80 },
    { id: 'fail2ban', name: 'fail2ban', displayName: 'fail2ban Brute Protection', status: 'active' },
    { id: 'prometheus', name: 'prometheus', displayName: 'Prometheus Monitoring', status: 'inactive', port: 9090 }
  ]);
  const [loadingServices, setLoadingServices] = useState<Record<string, 'start' | 'stop' | 'restart' | 'reload' | null>>({});

  // Configurations, user accounts, audit and backup states
  const [config, setConfig] = useState<MatrixConfig>({
    HS_DOMAIN: 'matrix.example.com',
    ELEMENT_DOMAIN: 'chat.example.com',
    BASE_DOMAIN: 'example.com',
    PUBLIC_IP: '192.168.1.100',
    LE_EMAIL: 'admin@example.com',
    SSL_MODE: 'selfsigned',
    PG_DB: 'synapse',
    PG_USER: 'synapse_user',
    PG_HOST: 'localhost',
    PG_PORT: '5432',
    PG_PASS: ''
  });
  const [ldap, setLdap] = useState<LDAPConfig>({
    enabled: false,
    uri: '',
    base: '',
    mode: 'search',
    start_tls: false,
    bind_dn: '',
    bind_password: '',
    uid_attr: 'sAMAccountName',
    mail_attr: 'mail',
    name_attr: 'cn'
  });
  const [workers, setWorkers] = useState<any>({
    enabled: false,
    count: 2,
    federationSender: false,
    basePort: 8083
  });
  const [matrixUsers, setMatrixUsers] = useState<MatrixUser[]>([]);
  const [panelUsers, setPanelUsers] = useState<PanelUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [undoHistory, setUndoHistory] = useState<UndoItem[]>([]);

  // System Update state
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [commitsBehind, setCommitsBehind] = useState<number>(0);
  const [latestCommitDesc, setLatestCommitDesc] = useState<string>('');
  const [latestVersion, setLatestVersion] = useState<string>('');
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [isGuidedTourOpen, setIsGuidedTourOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [terminalInitialTab, setTerminalInitialTab] = useState<'console' | 'install' | 'updates' | 'element-synapse'>('console');

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const userAvatarBtnRef = useRef<HTMLButtonElement>(null);

  // Click outside and keydown handler to close profile menu and modals
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        userDropdownOpen &&
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node) &&
        userAvatarBtnRef.current &&
        !userAvatarBtnRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
        setIsAboutModalOpen(false);
        setIsGuidedTourOpen(false);
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userDropdownOpen]);

  // Connection Profile states
  const [connections, setConnections] = useState<any[]>([]);
  const [activeConnection, setActiveConnection] = useState<any>({ id: 'local', name: 'Local Server (This Machine)', host: 'localhost', isActive: true });
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);

  const fetchStats = async (token?: string) => {
    const tk = token || authToken || localStorage.getItem('token') || localStorage.getItem('matrix_auth_token') || '';
    if (!tk) return;
    try {
      const res = await fetch('/api/matrix/stats', {
        headers: { 'Authorization': `Bearer ${tk}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(prev => ({
          ...(prev || {}),
          ...data
        }));
      }
    } catch (e) {
      console.error("Failed to fetch stats:", e);
    }
  };

  const handleRefreshStats = async () => {
    setIsRefreshingStats(true);
    setStats(null);
    try {
      await fetchStats();
      fetchMatrixUsers();
      fetchLogs();
      fetchConfig();

      // Trigger role-specific WebSocket checks and telemetry in multi-server distributed mode
      if (synapseWsRef.current && synapseWsRef.current.readyState === WebSocket.OPEN) {
        synapseWsRef.current.send(JSON.stringify({ type: 'request_node_metrics' }));
        synapseWsRef.current.send(JSON.stringify({ type: 'check_synapse_api' }));
      }
      if (databaseWsRef.current && databaseWsRef.current.readyState === WebSocket.OPEN) {
        databaseWsRef.current.send(JSON.stringify({ type: 'request_node_metrics' }));
        databaseWsRef.current.send(JSON.stringify({ type: 'check_database' }));
      }
      if (elementWsRef.current && elementWsRef.current.readyState === WebSocket.OPEN) {
        elementWsRef.current.send(JSON.stringify({ type: 'request_node_metrics' }));
        elementWsRef.current.send(JSON.stringify({ type: 'check_element' }));
      }

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        setWsConnected(true);
        wsRef.current.send(JSON.stringify({ type: 'request_metrics' }));
      } else {
        setWsConnected(false);
        if (authToken) setupWebSocket(authToken);
      }
    } catch (err) {
      console.error("Error refreshing stats:", err);
    } finally {
      setTimeout(() => {
        setIsRefreshingStats(false);
        showToast('success', isRtl ? 'آمار و تلمتری سرور با موفقیت بروزرسانی شد' : 'Dashboard stats and connection telemetry refreshed successfully!');
      }, 1000);
    }
  };

  // Navigation and terminal/command execution states
  const [activeView, setActiveView] = useState('dashboard');
  const [configInitialTab, setConfigInitialTab] = useState<'homeserver' | 'datetime' | 'network' | 'serverNotices' | 'ldap' | 'workers' | 'policies' | 'smtp' | 'client' | 'wallpaper' | 'backups' | 'video' | 'security' | 'api' | 'certificates' | undefined>(undefined);
  const [ketesaAdminTab, setKetesaAdminTab] = useState<'users' | 'rooms' | 'media' | 'tokens' | 'installer' | 'reports'>('users');
  const [showInstallWizard, setShowInstallWizard] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "System Shell Monitor Initialized. Welcome to Raven Matrix Stack Manager."
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // WebSocket reference & connection states for multi-server architecture
  const wsRef = useRef<WebSocket | null>(null);
  const synapseWsRef = useRef<WebSocket | null>(null);
  const databaseWsRef = useRef<WebSocket | null>(null);
  const elementWsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const motherWsConnIdRef = useRef<string | null>(null);
  const motherWsTokenRef = useRef<string | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const wsConnected = connectionStatus === 'connected';

  const [synapseWsStatus, setSynapseWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [databaseWsStatus, setDatabaseWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [elementWsStatus, setElementWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  // Live node API & diagnostic checks via WebSocket
  const [synapseApiCheck, setSynapseApiCheck] = useState<any>(null);
  const [databaseCheck, setDatabaseCheck] = useState<any>(null);
  const [elementCheck, setElementCheck] = useState<any>(null);

  const [isCheckingSynapseApi, setIsCheckingSynapseApi] = useState(false);
  const [isCheckingDatabase, setIsCheckingDatabase] = useState(false);
  const [isCheckingElement, setIsCheckingElement] = useState(false);
  const [isServerNodesExpanded, setIsServerNodesExpanded] = useState(false);

  const isDistributed = Boolean(
    activeConnection?.deploymentMode === 'distributed' ||
    activeConnection?.synapseNode?.host ||
    activeConnection?.databaseNode?.host ||
    activeConnection?.elementNode?.host
  );

  const setWsConnected = (connected: boolean) => {
    setConnectionStatus(connected ? 'connected' : 'disconnected');
  };

  const isDashboardLoading = (!stats && connectionStatus === 'connecting') || (isRefreshingStats && !stats);

  // Fetch Panel Database on boot and check token verification via HttpOnly cookie or token
  useEffect(() => {
    fetch('/api/auth/verify', {
      credentials: 'include',
      headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
    })
    .then(res => {
      if (!res.ok) throw new Error("Invalid token");
      return res.json();
    })
    .then(data => {
      if (!data.valid || !data.user) {
        handleLogout();
        return;
      }
      const activeTok = data.token || authToken || '';
      setCurrentUser(data.user);
      setAuthToken(activeTok);
      fetchStats(activeTok);
      fetchConfig(activeTok);
      fetchLogs(activeTok);
      fetchPanelUsers(activeTok);
      fetchMatrixUsers(activeTok);
      fetchBackups(activeTok);
      setupWebSocket(activeTok);
      fetchConnections(activeTok);
      checkUpdates(activeTok);
    })
    .catch(() => {
      handleLogout();
    });
  }, []);

  // Periodic session verification to instantly log out kicked users
  useEffect(() => {
    if (!authToken && !currentUser) return;
    const interval = setInterval(() => {
      fetch('/api/auth/verify', {
        credentials: 'include',
        headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
      })
      .then(res => res.json())
      .then(data => {
        if (!data.valid) {
          handleLogout();
          setLoginError(
            lang === 'fa'
              ? 'نشست شما توسط مدیر سیستم خاتمه یافت و از پنل خارج شدید.'
              : 'Your session was terminated by an administrator and you have been logged out.'
          );
        }
      })
      .catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, [authToken, currentUser, lang]);

  // Handle browser network status changes
  useEffect(() => {
    const handleOnline = () => {
      if (authToken) setupWebSocket(authToken);
    };
    const handleOffline = () => {
      setWsConnected(false);
      window.dispatchEvent(new CustomEvent('matrix_socket_status', { detail: { connected: false } }));
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [authToken]);

  // Active Connection Health Monitor (verifies connection on profile switch; continuous health is managed by live WebSocket)
  useEffect(() => {
    if (!authToken) return;

    setConnectionStatus('connecting');

    const checkActiveServerHealth = async () => {
      try {
        if (!activeConnection || activeConnection.id === 'local') {
          const res = await fetch('/api/auth/verify', {
            headers: { 'Authorization': `Bearer ${authToken}` }
          });
          if (res.ok) {
            setConnectionStatus('connected');
            window.dispatchEvent(new CustomEvent('matrix_socket_status', { detail: { connected: true } }));
          } else {
            setConnectionStatus('disconnected');
            window.dispatchEvent(new CustomEvent('matrix_socket_status', { detail: { connected: false } }));
          }
        } else {
          // Verify remote profile on switch
          const res = await fetch('/api/connections/test', {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(activeConnection)
          });
          const data = await res.json();
          if (data.success && (data.ssh || data.agent || data.status === 'online')) {
            setConnectionStatus('connected');
            window.dispatchEvent(new CustomEvent('matrix_socket_status', { detail: { connected: true } }));
          } else {
            if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
              setConnectionStatus('disconnected');
              window.dispatchEvent(new CustomEvent('matrix_socket_status', { detail: { connected: false } }));
            }
          }
        }
      } catch (err) {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          setConnectionStatus('disconnected');
          window.dispatchEvent(new CustomEvent('matrix_socket_status', { detail: { connected: false } }));
        }
      }
    };

    checkActiveServerHealth();
  }, [authToken, activeConnection?.id]);

  // Auto re-setup WebSocket connections when active connection profile changes
  useEffect(() => {
    if (authToken && activeConnection) {
      setupWebSocket(authToken);
    }
  }, [activeConnection?.id, activeConnection?.deploymentMode]);

  // Unified rock-solid "Mother" WebSocket setup for telemetry, metrics, and multi-server diagnostics
  const setupWebSocket = (token: string, forceReconnect: boolean = false) => {
    if (!token || token === 'null' || token === 'undefined') return;

    const connId = activeConnection?.id || 'local';

    // Singleton check: If mother WebSocket is already active or connecting for this token & connection, DO NOT create a new one!
    if (
      !forceReconnect &&
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) &&
      motherWsConnIdRef.current === connId &&
      motherWsTokenRef.current === token
    ) {
      return;
    }

    motherWsConnIdRef.current = connId;
    motherWsTokenRef.current = token;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws?token=${encodeURIComponent(token)}${connId ? `&connId=${encodeURIComponent(connId)}` : ''}`;
    
    setConnectionStatus('connecting');
    setSynapseWsStatus('connecting');
    setDatabaseWsStatus('connecting');
    setElementWsStatus('connecting');

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Matrix Admin Panel Mother WebSocket connected.");
      (window as any).__matrixMotherWs = ws;
      setConnectionStatus('connected');
      setWsConnected(true);
      window.dispatchEvent(new CustomEvent('matrix_socket_status', { detail: { connected: true } }));

      // Run live node health checks
      try {
        ws.send(JSON.stringify({ type: 'check_synapse_api' }));
        ws.send(JSON.stringify({ type: 'check_database' }));
        ws.send(JSON.stringify({ type: 'check_element' }));
      } catch (_) {}

      // Keepalive heartbeat ping every 15 seconds
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          try { ws.send(JSON.stringify({ type: 'ping' })); } catch (_) {}
        }
      }, 15000);
    };

    ws.onmessage = (event) => {
      setConnectionStatus('connected');
      setWsConnected(true);
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'metrics') {
          setStats(data.stats);
          if (data.stats && data.stats.services) {
            setServices(prev => prev.map(s => {
              const updated = data.stats.services.find((us: any) => us.id === s.id);
              return updated ? { ...s, status: updated.status } : s;
            }));
          }
          // Update per-node status indicators from live clusterNodes
          if (data.stats?.clusterNodes && Array.isArray(data.stats.clusterNodes)) {
            const synNode = data.stats.clusterNodes.find((n: any) => n.role === 'synapse');
            const dbNode = data.stats.clusterNodes.find((n: any) => n.role === 'database');
            const elemNode = data.stats.clusterNodes.find((n: any) => n.role === 'element');
            if (synNode) setSynapseWsStatus(synNode.status === 'online' ? 'connected' : synNode.status === 'error' ? 'disconnected' : 'connecting');
            if (dbNode) setDatabaseWsStatus(dbNode.status === 'online' ? 'connected' : dbNode.status === 'error' ? 'disconnected' : 'connecting');
            if (elemNode) setElementWsStatus(elemNode.status === 'online' ? 'connected' : elemNode.status === 'error' ? 'disconnected' : 'connecting');
          } else {
            setSynapseWsStatus('connected');
            setDatabaseWsStatus('connected');
            setElementWsStatus('connected');
          }
        } else if (data.type === 'node_metrics') {
          setStats(prev => {
            if (!prev) return prev;
            const existingNodes = prev.clusterNodes || [];
            const updatedNodes = existingNodes.map(n => 
              n.role === data.role ? { ...n, ...data.stats, status: 'online' } : n
            );
            return { ...prev, clusterNodes: updatedNodes };
          });
          if (data.role === 'synapse') setSynapseWsStatus('connected');
          if (data.role === 'database') setDatabaseWsStatus('connected');
          if (data.role === 'element') setElementWsStatus('connected');
        } else if (data.type === 'synapse_api_status' || data.type === 'api_check_result') {
          setSynapseApiCheck(data);
          setSynapseWsStatus(data.ok ? 'connected' : 'disconnected');
          setIsCheckingSynapseApi(false);
        } else if (data.type === 'database_status' || data.type === 'db_check_result') {
          setDatabaseCheck(data);
          setDatabaseWsStatus(data.ok ? 'connected' : 'disconnected');
          setIsCheckingDatabase(false);
        } else if (data.type === 'element_status' || data.type === 'element_check_result') {
          setElementCheck(data);
          setElementWsStatus(data.ok ? 'connected' : 'disconnected');
          setIsCheckingElement(false);
        } else if (data.type === 'cmd_stdout') {
          setTerminalLogs(prev => [...prev, data.text]);
        } else if (data.type === 'cmd_start') {
          setIsExecuting(true);
          setTerminalLogs(prev => [...prev, `\nroot@matrix-node:~# executing ${data.command}...`]);
        } else if (data.type === 'session_terminated') {
          setIsExecuting(false);
          showToast('success', isRtl ? 'بروزرسانی پنل با موفقیت انجام شد. جهت امنیت، سشن کاربری بسته شد و به صفحه لاگین هدایت شدید.' : 'Panel update completed! User session closed for security. Please log in again.');
          handleLogout();
          setTimeout(() => {
            try {
              window.location.href = window.location.origin + window.location.pathname;
            } catch (_) {}
          }, 1500);
        } else if (data.type === 'cmd_end') {
          setIsExecuting(false);
          setTerminalLogs(prev => [...prev, `\nCommand executed successfully. Exit code: ${data.code}`]);
          if (data.isUpdate) {
            showToast('success', isRtl ? 'بروزرسانی پنل با موفقیت انجام شد. سشن کاربری بسته شد و به صفحه لاگین هدایت شدید.' : 'Panel update completed! User session closed for security. Redirecting to login...');
            handleLogout();
            setTimeout(() => {
              try {
                window.location.href = window.location.origin + window.location.pathname;
              } catch (_) {}
            }, 1500);
          } else {
            fetchConfig();
            fetchLogs();
            fetchBackups();
          }
        } else if (data.type === 'cmd_err') {
          setIsExecuting(false);
          setTerminalLogs(prev => [...prev, `\n❌ ERROR: ${data.text}`]);
        } else if (data.type === 'error') {
          showToast('error', data.message);
          setIsCheckingSynapseApi(false);
          setIsCheckingDatabase(false);
          setIsCheckingElement(false);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onerror = () => {
      console.warn("WebSocket connection error.");
      setWsConnected(false);
      window.dispatchEvent(new CustomEvent('matrix_socket_status', { detail: { connected: false } }));
    };

    ws.onclose = () => {
      console.log("Mother WebSocket closed. Scheduling reconnect in 4s...");
      if ((window as any).__matrixMotherWs === ws) {
        (window as any).__matrixMotherWs = null;
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      setConnectionStatus('connecting');
      setWsConnected(false);
      window.dispatchEvent(new CustomEvent('matrix_socket_status', { detail: { connected: false } }));

      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectTimeoutRef.current = null;
          const currentToken = localStorage.getItem('admin_token') || token;
          if (currentToken && currentToken !== 'null' && currentToken !== 'undefined') {
            setupWebSocket(currentToken);
          }
        }, 4000);
      }
    };

    wsRef.current = ws;
    synapseWsRef.current = ws;
    databaseWsRef.current = ws;
    elementWsRef.current = ws;
  };

  const checkSynapseApiOverWs = () => {
    setIsCheckingSynapseApi(true);
    const target = synapseWsRef.current?.readyState === WebSocket.OPEN ? synapseWsRef.current : wsRef.current;
    if (target && target.readyState === WebSocket.OPEN) {
      target.send(JSON.stringify({ type: 'check_synapse_api' }));
    } else {
      setIsCheckingSynapseApi(false);
      showToast('error', isRtl ? 'وب‌سوکت سرور ساینپس متصل نیست' : 'Synapse WebSocket is not connected');
    }
  };

  const checkDatabaseOverWs = () => {
    setIsCheckingDatabase(true);
    const target = databaseWsRef.current?.readyState === WebSocket.OPEN ? databaseWsRef.current : wsRef.current;
    if (target && target.readyState === WebSocket.OPEN) {
      target.send(JSON.stringify({ type: 'check_database' }));
    } else {
      setIsCheckingDatabase(false);
      showToast('error', isRtl ? 'وب‌سوکت سرور دیتابیس متصل نیست' : 'Database WebSocket is not connected');
    }
  };

  const checkElementOverWs = () => {
    setIsCheckingElement(true);
    const target = elementWsRef.current?.readyState === WebSocket.OPEN ? elementWsRef.current : wsRef.current;
    if (target && target.readyState === WebSocket.OPEN) {
      target.send(JSON.stringify({ type: 'check_element' }));
    } else {
      setIsCheckingElement(false);
      showToast('error', isRtl ? 'وب‌سوکت سرور المنت متصل نیست' : 'Element WebSocket is not connected');
    }
  };

  // Configured Server Nodes for the active connection profile (determines 1, 2, or 3 servers dynamically)
  const configuredServers = useMemo(() => {
    if (!activeConnection) return [];

    const isDist = activeConnection.deploymentMode === 'distributed';
    const synNode = activeConnection.synapseNode;
    const dbNode = activeConnection.databaseNode;
    const elemNode = activeConnection.elementNode;

    const synHost = synNode?.host || activeConnection.host || '127.0.0.1';
    const synPort = synNode?.port || activeConnection.port || 22;
    const synServicePort = synNode?.servicePort || activeConnection.servicePort || 8008;

    const list: Array<{
      id: string;
      role: 'synapse' | 'database' | 'element';
      name: string;
      roleTitle: string;
      host: string;
      port: number;
      servicePort: number | string;
      status: 'connecting' | 'connected' | 'disconnected';
      checkData: any;
      icon: any;
      onCheck: () => void;
      isChecking: boolean;
    }> = [
      {
        id: 'synapse',
        role: 'synapse',
        name: isRtl ? 'سرور سیناپس (Synapse)' : 'Synapse Homeserver',
        roleTitle: isRtl ? 'هسته اصلی ماتریکس' : 'Matrix Core Homeserver',
        host: synHost,
        port: synPort,
        servicePort: synServicePort,
        status: synapseWsStatus,
        checkData: synapseApiCheck,
        icon: Server,
        onCheck: () => checkSynapseApiOverWs(),
        isChecking: isCheckingSynapseApi
      }
    ];

    // Database Server: if distributed or has a designated host
    const dbHost = dbNode?.host?.trim() || (isDist ? '' : (activeConnection.dbHost && activeConnection.dbHost !== activeConnection.host ? activeConnection.dbHost : ''));
    if (dbHost) {
      list.push({
        id: 'database',
        role: 'database',
        name: isRtl ? 'سرور دیتابیس (PostgreSQL)' : 'PostgreSQL Database',
        roleTitle: isRtl ? 'پایگاه‌داده و تراکنش‌ها' : 'SQL Database Storage',
        host: dbHost,
        port: dbNode?.port || 22,
        servicePort: dbNode?.servicePort || 5432,
        status: databaseWsStatus,
        checkData: databaseCheck,
        icon: Database,
        onCheck: () => checkDatabaseOverWs(),
        isChecking: isCheckingDatabase
      });
    }

    // Element Server: if distributed or has a designated host
    const elemHost = elemNode?.host?.trim();
    if (elemHost) {
      list.push({
        id: 'element',
        role: 'element',
        name: isRtl ? 'سرور کلاینت المنت (Element)' : 'Element Web Client',
        roleTitle: isRtl ? 'رابط وب کاربر' : 'Web UI Client',
        host: elemHost,
        port: elemNode?.port || 22,
        servicePort: elemNode?.servicePort || 80,
        status: elementWsStatus,
        checkData: elementCheck,
        icon: Globe,
        onCheck: () => checkElementOverWs(),
        isChecking: isCheckingElement
      });
    }

    return list;
  }, [
    activeConnection,
    synapseWsStatus,
    databaseWsStatus,
    elementWsStatus,
    synapseApiCheck,
    databaseCheck,
    elementCheck,
    isCheckingSynapseApi,
    isCheckingDatabase,
    isCheckingElement,
    isRtl
  ]);

  // Fetch functions for panel REST API
  const fetchConfig = (token = authToken) => {
    if (!token) return;
    fetch('/api/matrix/config', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setConfig(data.config);
        setLdap(data.ldap);
        if (data.workers) {
          setWorkers(data.workers);
        }
        // Sync workers on UI from config
        setServices(prev => prev.map(s => {
          if (s.id === 'redis') {
            return { ...s, status: data.workers?.enabled ? 'active' : 'inactive' };
          }
          return s;
        }));
      });
  };

  const fetchLogs = (token = authToken) => {
    if (!token) return;
    fetch('/api/logs/audit', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAuditLogs(data);
      })
      .catch(err => console.error("Error fetching audit logs:", err));
  };

  const fetchPanelUsers = (token = authToken) => {
    if (!token) return;
    fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPanelUsers(data);
      })
      .catch(err => console.error("Error fetching panel users:", err));
  };

  const fetchConnections = (token = authToken) => {
    if (!token) return;
    fetch('/api/connections', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setConnections(data);
          const active = data.find((c: any) => c.isActive);
          setActiveConnection(active || { id: 'local', name: 'Local Server (This Machine)', host: 'localhost', isActive: true });
        }
      })
      .catch(err => console.error("Error fetching connections:", err));
  };

  const fetchMatrixUsers = (token = authToken) => {
    if (!token) return;
    fetch('/api/matrix/users', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMatrixUsers(data);
      })
      .catch(err => console.error("Error fetching matrix users:", err));
  };

  const fetchBackups = (token = authToken) => {
    if (!token) return;
    fetch('/api/backups', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBackups(data);
      })
      .catch(err => console.error("Error fetching backups:", err));
  };

  const checkUpdates = (token = authToken) => {
    if (!token) return;
    fetch('/api/system/update/check', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setUpdateAvailable(data.updateAvailable);
        setCommitsBehind(data.commitsBehind);
        setLatestCommitDesc(data.latestRemoteCommit || '');
        setLatestVersion(data.latestVersion || '');
      }
    })
    .catch(err => console.error("Error checking updates in App header:", err));
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginErrorData(null);
    if (loginUser.trim()) {
      localStorage.setItem('last_login_user', loginUser.trim());
    }

    fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: loginUser.trim(),
        password: loginPass,
        captchaId: captchaRequired ? captchaId : undefined,
        captchaCode: captchaRequired ? captchaCode : undefined,
        rememberMe,
        lang
      })
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) {
        if (data.captchaRequired) {
          setCaptchaRequired(true);
          if (data.captcha) {
            setCaptchaId(data.captcha.id);
            setCaptchaSvg(data.captcha.svg);
            setCaptchaCode('');
          }
        }
        if (data.isLocked && data.remainingSeconds) {
          setLockoutRemainingSecs(data.remainingSeconds);
        }
        let errDataObj = null;
        if (data.errorsByLang) {
          errDataObj = { errorsByLang: data.errorsByLang, defaultMsg: data.error };
        } else {
          errDataObj = { defaultMsg: data.error || data.detail || "Invalid username or password" };
        }
        setLoginErrorData(errDataObj);
        localStorage.setItem('last_login_error_data', JSON.stringify(errDataObj));

        const activeErr = (data.errorsByLang && data.errorsByLang[lang]) || data.error || data.detail || "Invalid username or password";
        localStorage.setItem('last_login_error', activeErr);
        throw new Error(activeErr);
      }
      return data;
    })
    .then(data => {
      localStorage.removeItem('admin_token');
      localStorage.setItem('remember_me', rememberMe ? 'true' : 'false');
      if (rememberMe && loginUser.trim()) {
        localStorage.setItem('last_login_user', loginUser.trim());
      }
      localStorage.removeItem('last_login_error');
      localStorage.removeItem('last_login_error_data');
      setCurrentUser(data.user);
      setAuthToken(data.token || null);
      setLoginUser('');
      setLoginPass('');
      setCaptchaCode('');
      setCaptchaRequired(false);
      setLockoutRemainingSecs(0);
      setLoginErrorData(null);
      
      // Instantly load data using the freshly acquired token
      const activeTok = data.token || '';
      fetchConfig(activeTok);
      fetchLogs(activeTok);
      fetchPanelUsers(activeTok);
      fetchMatrixUsers(activeTok);
      fetchBackups(activeTok);
      setupWebSocket(activeTok);
    })
    .catch(err => {
      setLoginError(err.message);
    });
  };

  // Logout handler
  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    localStorage.removeItem('admin_token');
    setAuthToken(null);
    setCurrentUser(null);
    if (wsRef.current) wsRef.current.close();
    if (synapseWsRef.current) synapseWsRef.current.close();
    if (databaseWsRef.current) databaseWsRef.current.close();
    if (elementWsRef.current) elementWsRef.current.close();
    setActiveView('dashboard');
  };

  // Handler for navigation / view switching with session check
  const handleViewChange = async (view: string) => {
    if (authToken || currentUser) {
      try {
        const res = await fetch('/api/auth/verify', {
          credentials: 'include',
          headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
        });
        const data = await res.json();
        if (!data.valid) {
          handleLogout();
          setLoginError(
            lang === 'fa'
              ? 'نشست شما توسط مدیر سیستم خاتمه یافت و از پنل خارج شدید.'
              : 'Your session was terminated by an administrator and you have been logged out.'
          );
          return;
        }
      } catch (e) {
        // ignore network error during view change check
      }
    }
    setActiveView(view);
  };

  // Global fetch response interceptor to instantly kick invalidated sessions on any API interaction
  useEffect(() => {
    if (!authToken && !currentUser) return;
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401 && (authToken || currentUser)) {
        handleLogout();
        setLoginError(
          lang === 'fa'
            ? 'نشست شما توسط مدیر سیستم خاتمه یافت و از پنل خارج شدید.'
            : 'Your session was terminated by an administrator and you have been logged out.'
        );
      }
      return response;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, [authToken, currentUser, lang]);

  // Periodic active session verification poll (every 10 seconds)
  useEffect(() => {
    if (!authToken && !currentUser) return;
    const verifyInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/auth/verify', {
          credentials: 'include',
          headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
        });
        if (res.status === 401) {
          handleLogout();
          setLoginError(
            lang === 'fa'
              ? 'نشست شما توسط مدیر سیستم خاتمه یافت و از پنل خارج شدید.'
              : 'Your session was terminated by an administrator and you have been logged out.'
          );
        }
      } catch (_) {}
    }, 10000);

    return () => clearInterval(verifyInterval);
  }, [authToken, currentUser, lang]);

  // Inactivity Session Timeout Listener (Configurable: default 15 mins, 0 = unlimited)
  const lastActivityRef = useRef<number>(Date.now());
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('panel_session_timeout_minutes');
    return saved !== null ? parseInt(saved, 10) : 15;
  });

  useEffect(() => {
    const handleSessionSettingsUpdate = (e: any) => {
      if (e.detail && typeof e.detail.sessionTimeoutMinutes === 'number') {
        setSessionTimeoutMinutes(e.detail.sessionTimeoutMinutes);
      } else {
        const saved = localStorage.getItem('panel_session_timeout_minutes');
        if (saved !== null) setSessionTimeoutMinutes(parseInt(saved, 10));
      }
    };
    window.addEventListener('sessionSettingsUpdated', handleSessionSettingsUpdate);
    const handleSessionTerminated = () => {
      handleLogout();
    };
    window.addEventListener('panel_session_terminated', handleSessionTerminated);
    return () => {
      window.removeEventListener('sessionSettingsUpdated', handleSessionSettingsUpdate);
      window.removeEventListener('panel_session_terminated', handleSessionTerminated);
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    lastActivityRef.current = Date.now();

    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, handleUserActivity, { passive: true }));

    let hasWarned = false;

    const checkInactivityInterval = setInterval(() => {
      if (sessionTimeoutMinutes === 0) return; // 0 means unlimited - no auto logout

      const timeoutMs = sessionTimeoutMinutes * 60 * 1000;
      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = timeoutMs - elapsed;

      // 60 seconds warning alert
      if (remaining <= 60000 && remaining > 0 && !hasWarned) {
        hasWarned = true;
        showToast(
          'error',
          lang === 'fa'
            ? `هشدار: نشست شما تا ۶۰ ثانیه دیگر به علت عدم فعالیت منقضی می‌شود.`
            : `Warning: Your session will expire in 60 seconds due to inactivity.`
        );
      } else if (remaining > 60000) {
        hasWarned = false;
      }

      if (elapsed >= timeoutMs) {
        handleLogout();
        setLoginError(
          lang === 'fa' 
            ? `نشست کاربری شما به دلیل عدم فعالیت (${sessionTimeoutMinutes} دقیقه) منقضی شد. لطفاً دوباره وارد شوید.` 
            : `Session expired due to inactivity (${sessionTimeoutMinutes} minutes). Please log in again.`
        );
      }
    }, 5000);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleUserActivity));
      clearInterval(checkInactivityInterval);
    };
  }, [currentUser, lang, sessionTimeoutMinutes]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // REST mutations
  const handleSaveConfig = (data: { config?: Partial<MatrixConfig>; ldap?: Partial<LDAPConfig>; workers?: any; applyToExistingUsers?: boolean }) => {
    return fetch('/api/matrix/config/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(data)
    })
    .then(async res => {
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || errData.error || "Could not save configuration settings.");
      }
      return res.json();
    })
    .then((resData) => {
      showToast('success', t.saveSuccess);
      if (resData && resData.ldap) {
        setLdap(resData.ldap);
      } else if (data && data.ldap) {
        setLdap(prev => ({ ...prev, ...(data.ldap as any) }));
      }
      fetchConfig();
      fetchLogs();
    })
    .catch(err => {
      showToast('error', err.message);
      throw err;
    });
  };

  const handleRegisterMatrixUser = (username: string, pass: string, isAdmin: boolean) => {
    fetch('/api/matrix/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ username, password: pass, isAdmin })
    })
    .then(res => {
      if (!res.ok) throw new Error("User already exists or registration failed.");
      return res.json();
    })
    .then(() => {
      showToast('success', "Matrix user registered successfully on local Homeserver.");
      fetchMatrixUsers();
      fetchLogs();
    })
    .catch(err => showToast('error', err.message));
  };

  const handleDeactivateMatrixUser = (mxid: string) => {
    fetch('/api/matrix/users/deactivate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ mxid })
    })
    .then(res => res.json())
    .then(() => {
      showToast('success', "Matrix user deactivated successfully.");
      fetchMatrixUsers();
      fetchLogs();
    });
  };

  const handleReactivateMatrixUser = (mxid: string, pass: string, isAdmin: boolean) => {
    fetch('/api/matrix/users/reactivate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ mxid, password: pass, isAdmin })
    })
    .then(res => res.json())
    .then(() => {
      showToast('success', "Matrix user reactivated with new credentials.");
      fetchMatrixUsers();
      fetchLogs();
    });
  };

  const handleCreatePanelUser = (username: string, email: string, pass: string, role: string, permissions?: CustomPermissions) => {
    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ username, email, password: pass, role, permissions })
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to create panel administrator.");
      return res.json();
    })
    .then(() => {
      showToast('success', "Panel Administrator authorized successfully.");
      fetchPanelUsers();
      fetchLogs();
    })
    .catch(err => showToast('error', err.message));
  };

  const handleChangeUserRole = (id: string, role: string, permissions?: CustomPermissions) => {
    return fetch(`/api/users/${id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ role, permissions })
    })
    .then(async res => {
      if (!res.ok) {
        let errText = "Failed to modify panel role.";
        try {
          const errData = await res.json();
          errText = errData.error || errText;
        } catch (_) {}
        throw new Error(errText);
      }
      return res.json();
    })
    .then((data) => {
      showToast('success', "Administrator role updated successfully.");
      fetchPanelUsers();
      fetchLogs();
      return data;
    })
    .catch(err => {
      showToast('error', err.message);
      throw err;
    });
  };

  const handleUpdateUserPermissions = (id: string, permissions: CustomPermissions) => {
    return fetch(`/api/users/${id}/permissions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ permissions })
    })
    .then(async res => {
      if (!res.ok) {
        let errText = "Failed to update custom permissions.";
        try {
          const errData = await res.json();
          errText = errData.error || errText;
        } catch (_) {}
        throw new Error(errText);
      }
      return res.json();
    })
    .then((data) => {
      fetchPanelUsers();
      fetchLogs();
      return data;
    })
    .catch(err => {
      throw err;
    });
  };

  const handleDeletePanelUser = (id: string) => {
    return fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    .then(async res => {
      if (!res.ok) {
        let errText = "Failed to delete user.";
        try {
          const errData = await res.json();
          errText = errData.error || errText;
        } catch (_) {}
        throw new Error(errText);
      }
      return res.json();
    })
    .then((data) => {
      showToast('success', "Administrator access revoked.");
      fetchPanelUsers();
      fetchLogs();
      return data;
    })
    .catch(err => {
      showToast('error', err.message);
      throw err;
    });
  };

  const handleChangeUserPassword = (id: string, pass: string) => {
    return fetch(`/api/users/${id}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ password: pass })
    })
    .then(async res => {
      if (!res.ok) {
        let errText = "Failed to update user password.";
        try {
          const errData = await res.json();
          errText = errData.error || errText;
        } catch (_) {}
        throw new Error(errText);
      }
      return res.json();
    })
    .then((data) => {
      showToast('success', lang === 'fa' ? "رمز عبور کاربر با موفقیت تغییر یافت." : "User password updated successfully.");
      fetchPanelUsers();
      fetchLogs();
      return data;
    })
    .catch(err => {
      showToast('error', err.message);
      throw err;
    });
  };

  const handleRefreshBackups = () => {
    fetchBackups();
    fetchLogs();
  };

  const handleCreateBackup = (includeSSL: boolean) => {
    fetch('/api/backups/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ type: 'config', includeSSL })
    })
    .then(res => res.json())
    .then(() => {
      showToast('success', t.backupCreated);
      fetchBackups();
      fetchLogs();
    });
  };

  const handleDeleteBackup = (id: string) => {
    fetchBackups();
    fetchLogs();
  };

  const handleExecuteCommand = (command: string, args?: any) => {
    if (command === 'install' && !args) {
      setShowInstallWizard(true);
      return;
    }
    const target = synapseWsRef.current?.readyState === WebSocket.OPEN ? synapseWsRef.current : wsRef.current;
    if (!target || target.readyState !== WebSocket.OPEN || isExecuting) return;
    target.send(JSON.stringify({ type: 'execute_command', command, args }));
    setActiveView('terminal');
  };

  // Linux service controls (Start/Stop/Restart/Reload)
  const handleServiceAction = (serviceId: string, action: 'start' | 'stop' | 'restart' | 'reload') => {
    if (currentUser?.role === 'Viewer') {
      showToast('error', t.unauthorized);
      return;
    }

    setLoadingServices(prev => ({ ...prev, [serviceId]: action }));

    fetch('/api/services/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ serviceId, action })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.error || err.detail || 'Service control failed');
        });
      }
      return res.json();
    })
    .then(data => {
      if (data.success) {
        const actionLabels: Record<string, string> = {
          start: t.serviceStart || 'Start',
          stop: t.serviceStop || 'Stop',
          restart: t.serviceRestart || 'Restart',
          reload: t.serviceReload || 'Reload'
        };
        showToast('success', `${serviceId} (${actionLabels[action] || action}) successfully executed.`);
        setServices(prev => prev.map(s => {
          if (s.id === serviceId) {
            return { 
              ...s, 
              status: (action === 'start' || action === 'restart' || action === 'reload') ? 'active' : 'inactive' 
            };
          }
          return s;
        }));
        fetchLogs();
      }
    })
    .catch(err => {
      showToast('error', `Failed to execute ${action} on ${serviceId}: ${err.message}`);
    })
    .finally(() => {
      setLoadingServices(prev => ({ ...prev, [serviceId]: null }));
    });
  };

  return (
    <div 
      className={`min-h-screen relative flex flex-col justify-between theme-${panelTheme} ${isRtl ? 'dir-rtl' : 'dir-ltr'}`} 
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background neon visual noise */}
      <div className="ambient-glow-background" />

      {/* Global Notifications Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div className={`px-5 py-3.5 rounded-2xl border text-sm font-semibold flex items-center gap-3 shadow-2xl backdrop-blur-md ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            <Shield className="w-5 h-5 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* VIEW: UNAUTHENTICATED LOGIN CARD */}
      {!authToken ? (
        <div className="flex-1 flex items-center justify-center p-6 min-h-[80vh]">
          <div className="spatial-glass max-w-md w-full rounded-3xl p-8 border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.6)] spatial-depth-card relative overflow-hidden">
            {/* Upper Right Quick Controls */}
            <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} flex items-center gap-2 z-10`}>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <Languages className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{LANGUAGES.find(l => l.code === lang)?.flag || '🇬🇧'}</span>
                </button>
                {isLangMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
                    <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-10 mt-1 w-32 rounded-xl p-1 shadow-2xl backdrop-blur-md z-50 border ${
                      isLightMode 
                        ? 'bg-white border-slate-200 text-slate-800' 
                        : 'bg-slate-900 border-white/10 text-white'
                    }`}>
                      <div className="flex flex-col gap-0.5">
                        {LANGUAGES.map((l) => (
                          <button
                            key={l.code}
                            type="button"
                            onClick={() => {
                              setLang(l.code);
                              localStorage.setItem('lang_pref', l.code);
                              setIsLangMenuOpen(false);
                            }}
                            className={`flex items-center gap-2 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-indigo-500 hover:text-white transition-all text-left w-full cursor-pointer ${
                              lang === l.code ? 'bg-indigo-500/10 text-indigo-400' : ''
                            }`}
                          >
                            <span>{l.flag}</span>
                            <span>{l.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Premium Aesthetic Glowing backdrops inside card */}
            <div className="absolute -top-16 -left-16 w-36 h-36 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Matrix Decorative Grid Background overlay inside card */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] pointer-events-none" />

            <div className="flex flex-col items-center text-center mb-8 relative">
              <div className="mb-4 animate-float flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_35px_rgba(99,102,241,0.3)]">
                <RavenLogo size={106} showGlow={true} eyesClosed={isPassFocused} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white tracking-tight glow-text-cyan">{t.loginTitle}</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-sm">{t.loginSubtitle}</p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center mb-6 flex items-center justify-center gap-2 animate-pulse">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5 relative">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">{t.username}</label>
                <div className="relative group">
                  <User className="w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
                  <input
                    type="text"
                    value={loginUser}
                    onChange={(e) => {
                      setLoginUser(e.target.value);
                      localStorage.setItem('last_login_user', e.target.value.trim());
                      checkLoginSecurityConfig(e.target.value);
                    }}
                    onBlur={(e) => {
                      localStorage.setItem('last_login_user', e.target.value.trim());
                      checkLoginSecurityConfig(e.target.value);
                    }}
                    required
                    autoComplete="username"
                    className="w-full bg-black/40 border border-white/10 focus:border-indigo-500/50 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 outline-none transition-all focus:ring-2 focus:ring-indigo-500/15"
                    placeholder={lang === 'fa' ? "مثال: admin" : "e.g. admin"}
                    id="username-input"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">{t.password}</label>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    onFocus={() => setIsPassFocused(true)}
                    onBlur={() => setIsPassFocused(false)}
                    required
                    autoComplete="current-password"
                    className="w-full bg-black/40 border border-white/10 focus:border-indigo-500/50 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 outline-none transition-all focus:ring-2 focus:ring-indigo-500/15"
                    placeholder="••••••••"
                    id="password-input"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    rememberMe
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                      : 'bg-black/40 border-white/20 group-hover:border-indigo-400/50'
                  }`}>
                    {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => {
                      setRememberMe(e.target.checked);
                      localStorage.setItem('remember_me', e.target.checked ? 'true' : 'false');
                    }}
                    className="sr-only"
                    id="remember-me-checkbox"
                  />
                  <span className="text-xs text-slate-300 font-medium group-hover:text-white transition-colors">
                    {t.rememberMe || (lang === 'fa' ? 'مرا به خاطر بسپار' : 'Remember me')}
                  </span>
                </label>
              </div>

              {captchaRequired && (
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{lang === 'fa' ? "کد امنیتی کپچا" : "Security CAPTCHA"}</span>
                    </label>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                      title={lang === 'fa' ? "تولید مجدد کپچا" : "Refresh CAPTCHA"}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{lang === 'fa' ? "کد جدید" : "Refresh"}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {captchaSvg ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: captchaSvg }} 
                        className="shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-inner"
                      />
                    ) : (
                      <div className="w-[140px] h-[48px] bg-slate-900 rounded-xl border border-white/10 flex items-center justify-center text-xs text-slate-500 shrink-0">
                        Loading...
                      </div>
                    )}
                    <input
                      type="text"
                      value={captchaCode}
                      onChange={(e) => setCaptchaCode(e.target.value)}
                      required={captchaRequired}
                      placeholder={lang === 'fa' ? "کد تصویر" : "Code"}
                      className="w-full bg-black/60 border border-white/10 focus:border-indigo-500/60 rounded-xl px-3 py-3 text-center text-sm font-bold tracking-widest text-indigo-300 outline-none transition-all"
                      id="captcha-input"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white font-bold text-sm tracking-wide shadow-[0_4px_25px_rgba(99,102,241,0.3)] hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_4px_30px_rgba(99,102,241,0.45)] transition-all mt-6 cursor-pointer"
              >
                {t.loginBtn}
              </button>
            </form>

            {/* Theme Selector Panel for Login Screen */}
            <div className="mt-6 pt-5 border-t border-white/10 relative">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3 text-center flex items-center justify-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span>{lang === 'fa' ? "انتخاب تم پنل:" : "Panel Theme:"}</span>
              </span>
              <div className="grid grid-cols-6 gap-1 p-1.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                {/* Obsidian */}
                <button
                  type="button"
                  onClick={() => changeTheme('obsidian')}
                  title="Obsidian Dark"
                  className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    panelTheme === 'obsidian'
                      ? 'bg-indigo-600 text-white shadow-lg ring-1 ring-indigo-400 scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-indigo-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  </div>
                  <span className="text-[9px] font-bold truncate">
                    {lang === 'fa' ? 'تاریک' : 'Obsidian'}
                  </span>
                </button>

                {/* Emerald */}
                <button
                  type="button"
                  onClick={() => changeTheme('emerald')}
                  title="Matrix Emerald"
                  className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    panelTheme === 'emerald'
                      ? 'bg-emerald-600 text-white shadow-lg ring-1 ring-emerald-400 scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-950 border border-emerald-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[9px] font-bold truncate">
                    {lang === 'fa' ? 'زمردی' : 'Emerald'}
                  </span>
                </button>

                {/* Rose */}
                <button
                  type="button"
                  onClick={() => changeTheme('rose')}
                  title="Cyber Rose"
                  className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    panelTheme === 'rose'
                      ? 'bg-rose-600 text-white shadow-lg ring-1 ring-rose-400 scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-950 border border-rose-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  </div>
                  <span className="text-[9px] font-bold truncate">
                    {lang === 'fa' ? 'رز' : 'Rose'}
                  </span>
                </button>

                {/* Amber */}
                <button
                  type="button"
                  onClick={() => changeTheme('amber')}
                  title="Sunset Gold"
                  className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    panelTheme === 'amber'
                      ? 'bg-amber-600 text-white shadow-lg ring-1 ring-amber-400 scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-950 border border-amber-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </div>
                  <span className="text-[9px] font-bold truncate">
                    {lang === 'fa' ? 'کهربا' : 'Amber'}
                  </span>
                </button>

                {/* Cobalt */}
                <button
                  type="button"
                  onClick={() => changeTheme('cobalt')}
                  title="Ocean Cobalt"
                  className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    panelTheme === 'cobalt'
                      ? 'bg-sky-600 text-white shadow-lg ring-1 ring-sky-400 scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-sky-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  </div>
                  <span className="text-[9px] font-bold truncate">
                    {lang === 'fa' ? 'کبالت' : 'Cobalt'}
                  </span>
                </button>

                {/* Light */}
                <button
                  type="button"
                  onClick={() => changeTheme('light')}
                  title="Nordic Light"
                  className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    panelTheme === 'light'
                      ? 'bg-slate-200 text-slate-900 shadow-lg ring-1 ring-slate-400 scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-white border border-slate-300 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  </div>
                  <span className="text-[9px] font-bold truncate">
                    {lang === 'fa' ? 'روشن' : 'Light'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN PANEL DASHBOARD LAYOUT */
        <div className="flex-1 flex flex-col pb-28">
          
          {/* Top Spatial Header bar */}
          <header className={`px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
            isLightMode 
              ? 'bg-white/90 border-slate-200 text-slate-800 shadow-sm' 
              : 'bg-slate-950/80 border-white/5 text-white'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                <RavenLogo size={32} showGlow={false} />
              </div>
              <div>
                <h1 className={`text-lg font-display font-bold flex items-center gap-2 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                  {t.title}
                </h1>
                
                {/* Active Server Connection Status Badge */}
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border ${
                    connectionStatus === 'connected'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : connectionStatus === 'connecting'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                      : 'bg-red-500/20 border-red-500/50 text-red-600 dark:text-red-400 animate-pulse shadow-sm'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      connectionStatus === 'connected'
                        ? 'bg-emerald-500 animate-pulse'
                        : connectionStatus === 'connecting'
                        ? 'bg-amber-500 animate-ping'
                        : 'bg-red-500 animate-ping'
                    }`} />
                    <span>
                      {connectionStatus === 'connected' 
                        ? (lang === 'fa' ? 'متصل' : ((t as any).connectedBadge || 'Connected')) 
                        : connectionStatus === 'connecting'
                        ? (lang === 'fa' ? 'در حال برقراری ارتباط...' : 'Connecting...')
                        : (lang === 'fa' ? 'قطع ارتباط' : 'Disconnected')
                      }
                    </span>
                  </span>

                  <span className="text-[10px] text-slate-400 font-mono tracking-wider truncate max-w-[200px] sm:max-w-[300px]">
                    {activeConnection?.id !== 'local' 
                      ? `${activeConnection?.name || 'Remote Server'} (${activeConnection?.host}:${activeConnection?.port || 22})` 
                      : (lang === 'fa' ? 'سرور محلی' : 'Local Server')
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Theme Switcher & User Indicator */}
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    isLightMode 
                      ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <Languages className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-semibold">{LANGUAGES.find(l => l.code === lang)?.flag || '🇬🇧'} {LANGUAGES.find(l => l.code === lang)?.label || 'English'}</span>
                </button>
                {isLangMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsLangMenuOpen(false)} />
                    <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-10 mt-1 w-36 rounded-xl p-1 shadow-2xl backdrop-blur-md z-50 border ${
                      isLightMode 
                        ? 'bg-white border-slate-200 text-slate-800' 
                        : 'bg-slate-900 border-white/10 text-white'
                    }`}>
                      <div className="flex flex-col gap-0.5">
                        {LANGUAGES.map((l) => (
                          <button
                            key={l.code}
                            type="button"
                            onClick={() => {
                              setLang(l.code);
                              localStorage.setItem('lang_pref', l.code);
                              setIsLangMenuOpen(false);
                            }}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-500 hover:text-white transition-all text-left w-full cursor-pointer ${
                              lang === l.code ? 'bg-indigo-500/10 text-indigo-400' : ''
                            }`}
                          >
                            <span>{l.flag}</span>
                            <span>{l.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Avatar & Dropdown */}
              {currentUser && (
                <div className={`flex items-center gap-3 ${isRtl ? 'border-r pr-4' : 'border-l pl-4'} ${isLightMode ? 'border-slate-200' : 'border-white/10'} relative`}>
                  <div className={`${isRtl ? 'text-left' : 'text-right'} hidden sm:block`}>
                    <span className={`text-xs font-semibold block ${isLightMode ? 'text-slate-800' : 'text-white'}`}>@{currentUser.username}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{currentUser.role}</span>
                  </div>
                  
                  <button
                    type="button"
                    ref={userAvatarBtnRef}
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="relative focus:outline-none cursor-pointer group active:scale-95 transition-transform"
                    id="user-avatar-btn"
                  >
                    <img 
                      src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`} 
                      alt={currentUser.username}
                      className={`w-9 h-9 rounded-xl p-0.5 transition-all ${
                        isLightMode ? 'bg-slate-100 border border-slate-300 group-hover:border-indigo-500' : 'bg-slate-800 border border-white/10 group-hover:border-indigo-500/50'
                      }`}
                    />
                    {updateAvailable && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-slate-900"></span>
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40 bg-transparent" 
                        onClick={() => setUserDropdownOpen(false)} 
                      />
                      <div 
                        ref={profileDropdownRef}
                        className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-12 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl p-4 shadow-2xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-3 duration-200 border ${
                          isLightMode 
                            ? 'bg-white border-slate-200 text-slate-800' 
                            : 'bg-slate-950/95 border-white/10 text-white'
                        }`} dir={isRtl ? 'rtl' : 'ltr'}>
                        <div className={`flex items-center gap-3 border-b pb-3 mb-3 ${isLightMode ? 'border-slate-100' : 'border-white/5'}`}>
                          <img 
                            src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`} 
                            alt={currentUser.username}
                            className={`w-10 h-10 rounded-xl p-0.5 border ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-white/10'}`}
                          />
                          <div>
                            <span className={`text-xs font-bold block ${isLightMode ? 'text-slate-800' : 'text-white'}`}>@{currentUser.username}</span>
                            <span className={`text-[10px] block font-mono uppercase ${isLightMode ? 'text-slate-400' : 'text-slate-400'}`}>{currentUser.role}</span>
                          </div>
                        </div>

                        {/* Dedicated About Section inside Profile Dropdown */}
                        <div className={`mb-3 p-3 rounded-2xl border transition-all ${
                          isLightMode 
                            ? 'bg-indigo-50/60 border-indigo-100 text-slate-800' 
                            : 'bg-indigo-950/20 border-indigo-500/20 text-white'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 font-extrabold text-xs">
                              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span>{lang === 'fa' ? 'درباره پنل Raven' : 'About Raven Panel'}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              v{PANEL_VERSION}
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px] mb-2.5">
                            <div className="flex items-center justify-between text-slate-400">
                              <span>{lang === 'fa' ? 'عنوان سیستم:' : 'System:'}</span>
                              <span className="font-semibold text-slate-300 dark:text-slate-200">{PANEL_NAME}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400">
                              <span>{lang === 'fa' ? 'تاریخ انتشار:' : 'Build:'}</span>
                              <span className="font-mono">{PANEL_BUILD_DATE}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400">
                              <span>{lang === 'fa' ? 'مخزن اصلی:' : 'Repo:'}</span>
                              <a 
                                href="https://github.com/shahbazimasoud/Matrix-Stack-Manager" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-indigo-400 hover:underline flex items-center gap-1 text-[10px] font-semibold"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>GitHub</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              setIsAboutModalOpen(true);
                            }}
                            className="w-full py-1.5 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>
                              {lang === 'fa' ? 'مشاهده کامل درباره پنل' :
                               lang === 'es' ? 'Ver información completa' :
                               lang === 'ar' ? 'عرض تفاصيل اللوحة' :
                               lang === 'de' ? 'Vollständige Info anzeigen' :
                               lang === 'ru' ? 'Информация о панели' : 'Full About Panel Info'}
                            </span>
                          </button>

                          {/* Small Update Notice inside About Raven Panel box */}
                          {updateAvailable && (
                            <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] font-bold ${
                              isLightMode ? 'border-indigo-200 text-purple-700' : 'border-indigo-500/20 text-purple-300'
                            }`}>
                              <span className="flex items-center gap-1.5 animate-pulse">
                                <RefreshCw className="w-3 h-3 animate-spin text-purple-400" style={{ animationDuration: '4s' }} />
                                <span>
                                  {lang === 'fa' ? `آپدیت جدید موجود است (${commitsBehind} کامیت)` :
                                   lang === 'es' ? `Nueva actualización (${commitsBehind} commits)` :
                                   lang === 'ar' ? `تحديث جديد متاح (${commitsBehind})` :
                                   lang === 'de' ? `Neues Update (${commitsBehind} Commits)` :
                                   lang === 'ru' ? `Доступно обновление (${commitsBehind} коммитов)` :
                                   `New Update Available (${commitsBehind} commits)`}
                                </span>
                              </span>
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                v{getUpdateVersionString(PANEL_VERSION, latestVersion)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Theme Selector Section */}
                        <div className={`mb-3 pb-3 border-b ${isLightMode ? 'border-slate-100' : 'border-white/5'}`}>
                          <div className="flex items-center justify-between mb-2 px-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold">
                              <Palette className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                              <span>
                                {lang === 'fa' ? 'تم رنگی پنل' :
                                 lang === 'es' ? 'Tema del panel' :
                                 lang === 'ar' ? 'مظهر اللوحة' :
                                 lang === 'de' ? 'Panel-Design' :
                                 lang === 'ru' ? 'Тема панели' : 'Panel Theme'}
                              </span>
                            </div>
                          </div>
                          
                          <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl border ${
                            isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/5'
                          }`}>
                            {/* Obsidian Theme */}
                            <button
                              type="button"
                              onClick={() => changeTheme('obsidian')}
                              className={`p-2 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                panelTheme === 'obsidian'
                                  ? 'bg-indigo-600 text-white shadow-md ring-1 ring-indigo-400'
                                  : isLightMode ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-white/5'
                              }`}
                              title="Obsidian Dark (Indigo)"
                            >
                              <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-indigo-400 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              </div>
                              <span className="truncate">
                                {lang === 'fa' ? 'آبسیډین' : 'Obsidian'}
                              </span>
                            </button>

                            {/* Emerald Theme */}
                            <button
                              type="button"
                              onClick={() => changeTheme('emerald')}
                              className={`p-2 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                panelTheme === 'emerald'
                                  ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400'
                                  : isLightMode ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-white/5'
                              }`}
                              title="Matrix Emerald (Green)"
                            >
                              <div className="w-3.5 h-3.5 rounded-full bg-emerald-950 border border-emerald-400 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              </div>
                              <span className="truncate">
                                {lang === 'fa' ? 'زمردی' : 'Emerald'}
                              </span>
                            </button>

                            {/* Rose Theme */}
                            <button
                              type="button"
                              onClick={() => changeTheme('rose')}
                              className={`p-2 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                panelTheme === 'rose'
                                  ? 'bg-rose-600 text-white shadow-md ring-1 ring-rose-400'
                                  : isLightMode ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-white/5'
                              }`}
                              title="Cyber Rose (Crimson)"
                            >
                              <div className="w-3.5 h-3.5 rounded-full bg-rose-950 border border-rose-400 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                              </div>
                              <span className="truncate">
                                {lang === 'fa' ? 'ارغوانی' : 'Rose'}
                              </span>
                            </button>

                            {/* Amber Theme */}
                            <button
                              type="button"
                              onClick={() => changeTheme('amber')}
                              className={`p-2 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                panelTheme === 'amber'
                                  ? 'bg-amber-600 text-white shadow-md ring-1 ring-amber-400'
                                  : isLightMode ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-white/5'
                              }`}
                              title="Sunset Gold (Amber)"
                            >
                              <div className="w-3.5 h-3.5 rounded-full bg-amber-950 border border-amber-400 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              </div>
                              <span className="truncate">
                                {lang === 'fa' ? 'کهربایی' : 'Amber'}
                              </span>
                            </button>

                            {/* Cobalt Theme */}
                            <button
                              type="button"
                              onClick={() => changeTheme('cobalt')}
                              className={`p-2 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                panelTheme === 'cobalt'
                                  ? 'bg-sky-600 text-white shadow-md ring-1 ring-sky-400'
                                  : isLightMode ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-white/5'
                              }`}
                              title="Ocean Cobalt (Blue)"
                            >
                              <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-sky-400 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                              </div>
                              <span className="truncate">
                                {lang === 'fa' ? 'کبالت' : 'Cobalt'}
                              </span>
                            </button>

                            {/* Light Theme */}
                            <button
                              type="button"
                              onClick={() => changeTheme('light')}
                              className={`p-2 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                panelTheme === 'light'
                                  ? 'bg-slate-200 text-slate-900 shadow-md ring-1 ring-slate-400'
                                  : isLightMode ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-white/5'
                              }`}
                              title="Nordic Light"
                            >
                              <div className="w-3.5 h-3.5 rounded-full bg-white border border-slate-300 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                              </div>
                              <span className="truncate">
                                {lang === 'fa' ? 'روشن' : 'Light'}
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              setIsAboutModalOpen(true);
                            }}
                            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isRtl ? 'text-right justify-start' : 'text-left justify-start'
                            } ${
                              isLightMode 
                                ? 'text-purple-600 hover:bg-purple-50' 
                                : 'text-purple-400 hover:bg-purple-500/10'
                            }`}
                          >
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {lang === 'fa' ? 'درباره و مشخصات پنل' :
                               lang === 'es' ? 'Acerca del panel' :
                               lang === 'ar' ? 'عن اللوحة والمواصفات' :
                               lang === 'de' ? 'Über das Panel' :
                               lang === 'ru' ? 'О панели' : 'About & System Specs'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              setIsGuidedTourOpen(true);
                            }}
                            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isRtl ? 'text-right justify-start' : 'text-left justify-start'
                            } ${
                              isLightMode 
                                ? 'text-indigo-600 hover:bg-indigo-50' 
                                : 'text-indigo-400 hover:bg-indigo-500/10'
                            }`}
                          >
                            <BookOpen className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {lang === 'fa' ? 'راهنمای کار با پنل' :
                               lang === 'es' ? 'Guía del panel' :
                               lang === 'ar' ? 'دليل استخدام اللوحة' :
                               lang === 'de' ? 'Panel-Anleitung' :
                               lang === 'ru' ? 'Инструкция по панели' : 'Panel Guided Tour'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              handleLogout();
                            }}
                            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isRtl ? 'text-right justify-start' : 'text-left justify-start'
                            } ${
                              isLightMode 
                                ? 'text-rose-600 hover:bg-rose-50' 
                                : 'text-rose-400 hover:bg-rose-500/10'
                            }`}
                          >
                            <LogOut className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {lang === 'fa' ? 'خروج از حساب کاربری' :
                               lang === 'es' ? 'Cerrar sesión' :
                               lang === 'ar' ? 'تسجيل الخروج' :
                               lang === 'de' ? 'Abmelden' :
                               lang === 'ru' ? 'Выйти' : 'Sign Out'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </header>

          {/* Dynamic Dashboard Section View Container */}
          <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
            
            {/* Active Connection Banner / Onboarding */}
            {activeView !== 'connections' && (
              activeConnection?.id === 'local' ? (
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900/40 border border-indigo-500/20 p-6 md:p-8 shadow-[0_10px_30px_rgba(99,102,241,0.05)]">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
                        <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                        <span>{t.localSandboxMode}</span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-display font-extrabold text-white tracking-tight">
                        {t.remoteOnboardingTitle}
                      </h2>
                      <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                        {t.remoteOnboardingDesc}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setActiveView('connections')}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{t.connectRemoteBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`relative overflow-hidden rounded-3xl transition-all duration-300 p-5 md:p-6 ${
                  isLightMode
                    ? connectionStatus === 'connected'
                      ? 'bg-white/95 border border-emerald-500/30 shadow-[0_10px_30px_rgba(16,185,129,0.08)]'
                      : connectionStatus === 'connecting'
                      ? 'bg-white/95 border border-amber-500/40 shadow-[0_10px_30px_rgba(245,158,11,0.08)]'
                      : 'bg-white/95 border border-red-500/40 shadow-[0_10px_30px_rgba(239,68,68,0.08)]'
                    : connectionStatus === 'connected' 
                    ? 'bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-slate-950/95 border border-emerald-500/20 shadow-[0_10px_30px_rgba(16,185,129,0.03)]' 
                    : connectionStatus === 'connecting'
                    ? 'bg-gradient-to-br from-slate-900/80 via-amber-950/15 to-slate-950/95 border border-amber-500/30 shadow-[0_10px_30px_rgba(245,158,11,0.05)]'
                    : 'bg-gradient-to-br from-slate-900/80 via-red-950/20 to-slate-950/95 border border-red-500/40 shadow-[0_10px_30px_rgba(239,68,68,0.15)]'
                }`}>
                  {/* Top Bar: Connection Name, Cluster Mode, & Actions */}
                  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                        connectionStatus === 'connected' 
                          ? (isLightMode ? 'bg-emerald-50 border border-emerald-300 text-emerald-600' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400')
                          : connectionStatus === 'connecting'
                          ? (isLightMode ? 'bg-amber-50 border border-amber-300 text-amber-600' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400')
                          : (isLightMode ? 'bg-red-50 border border-red-300 text-red-600' : 'bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse')
                      }`}>
                        {connectionStatus === 'connected' ? (
                          <Server className="w-6 h-6 animate-pulse" />
                        ) : connectionStatus === 'connecting' ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <WifiOff className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center flex-wrap gap-2">
                          <h3 className={`text-xs font-bold uppercase tracking-wider ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {t.connectedProfileLabel}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isLightMode ? 'bg-slate-100 border border-slate-200 text-slate-700' : 'bg-white/5 border border-white/10 text-slate-300'
                          }`}>
                            <Layers className={`w-3 h-3 ${isLightMode ? 'text-indigo-600' : 'text-indigo-400'}`} />
                            <span>
                              {configuredServers.length > 1
                                ? (isRtl ? `خوشه توزیع‌شده (${configuredServers.length} سرور)` : `Distributed Cluster (${configuredServers.length} Servers)`)
                                : (isRtl ? 'سرور یکپارچه (Standalone)' : 'Standalone (Single Server)')
                              }
                            </span>
                          </span>
                          {connectionStatus === 'connected' ? (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isLightMode ? 'bg-emerald-50 border border-emerald-300 text-emerald-700' : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                            }`}>
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                              <span>{isRtl ? 'فعال و متصل' : 'ALL CONNECTED'}</span>
                            </span>
                          ) : connectionStatus === 'connecting' ? (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isLightMode ? 'bg-amber-50 border border-amber-300 text-amber-800' : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                            }`}>
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                              <span>{isRtl ? 'در حال اتصال...' : 'CONNECTING...'}</span>
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isLightMode ? 'bg-red-50 border border-red-300 text-red-700' : 'bg-red-500/15 border border-red-500/30 text-red-400'
                            }`}>
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                              <span>{isRtl ? 'قطع ارتباط' : 'DISCONNECTED'}</span>
                            </span>
                          )}
                        </div>
                        <p className={`text-lg font-bold font-mono mt-1 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                          {activeConnection?.name}
                        </p>
                        <p className={`text-xs mt-0.5 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {t.connectedProfileDesc || 'Matrix homeserver, Element client, and Postgres Database are actively being managed over SSH tunnel.'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                      <button
                        onClick={handleRefreshStats}
                        disabled={isRefreshingStats || connectionStatus === 'connecting'}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 ${
                          connectionStatus === 'connected'
                            ? (isLightMode 
                                ? 'bg-teal-50 border border-teal-300 hover:bg-teal-100 text-teal-800 shadow-xs'
                                : 'bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 text-teal-300 hover:text-white')
                            : connectionStatus === 'connecting'
                            ? (isLightMode
                                ? 'bg-amber-50 border border-amber-300 text-amber-800 opacity-80 cursor-wait'
                                : 'bg-amber-500/10 border border-amber-500/20 text-amber-300 opacity-80 cursor-wait')
                            : (isLightMode
                                ? 'bg-red-50 border border-red-300 hover:bg-red-100 text-red-800 shadow-xs'
                                : 'bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 text-red-200 hover:text-white shadow-lg shadow-red-500/10')
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingStats || connectionStatus === 'connecting' ? 'animate-spin' : ''}`} />
                        <span>
                          {isRefreshingStats 
                            ? (t.refreshing || 'Refreshing...') 
                            : connectionStatus === 'connecting'
                            ? (isRtl ? 'در حال اتصال...' : 'Connecting...')
                            : (t.refreshStatsBtn || 'Refresh Stats')
                          }
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setActiveView('connections')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                          isLightMode 
                            ? 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-800' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>{t.switchProfileBtn}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Accordion Toggle Bar & Section Divider */}
                  <div className={`mt-5 pt-4 border-t ${isLightMode ? 'border-slate-200/80' : 'border-white/10'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>
                          {isRtl ? 'وضعیت گره‌های متصل' : 'Connected Node Endpoints'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isLightMode ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-white/5 text-slate-400 border border-white/10'
                        }`}>
                          {isRtl ? `${configuredServers.length} سرور` : `${configuredServers.length} Servers`}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsServerNodesExpanded(!isServerNodesExpanded)}
                        className={`inline-flex items-center justify-between sm:justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                          isLightMode 
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-xs' 
                            : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border-white/10'
                        }`}
                      >
                        <span>
                          {isServerNodesExpanded
                            ? (isRtl ? 'بستن جزئیات سرورها' : 'Collapse Node Details')
                            : (isRtl ? 'مشاهده جزئیات کامل سرورها' : 'Show Full Node Details')
                          }
                        </span>
                        {isServerNodesExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </div>

                    {/* When COLLAPSED: Quick overview of each of the configured servers */}
                    {!isServerNodesExpanded && (
                      <div className={`mt-3 grid grid-cols-1 ${
                        configuredServers.length === 2 ? 'sm:grid-cols-2' : configuredServers.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                      } gap-2.5`}>
                        {configuredServers.map((server) => {
                          const IconComp = server.icon;
                          const isConnected = server.status === 'connected';
                          const isConnecting = server.status === 'connecting';
                          return (
                            <div
                              key={server.id}
                              onClick={() => setIsServerNodesExpanded(true)}
                              className={`flex items-center justify-between gap-3 p-3 rounded-2xl transition-all cursor-pointer border ${
                                isLightMode
                                  ? isConnected
                                    ? 'bg-slate-50/90 border-emerald-500/30 hover:bg-emerald-50/40 shadow-xs'
                                    : isConnecting
                                    ? 'bg-slate-50/90 border-amber-500/40 hover:bg-amber-50/40'
                                    : 'bg-slate-50/90 border-red-500/40 hover:bg-red-50/40'
                                  : isConnected
                                  ? 'bg-slate-900/50 border-emerald-500/20 hover:bg-slate-900/80 hover:border-emerald-500/40'
                                  : isConnecting
                                  ? 'bg-slate-900/50 border-amber-500/25 hover:bg-slate-900/80 hover:border-amber-500/40'
                                  : 'bg-slate-900/50 border-red-500/30 hover:bg-slate-900/80 hover:border-red-500/50'
                              }`}
                              title={isRtl ? 'برای مشاهده جزئیات کامل کلیک کنید' : 'Click to view full node details'}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                                  isConnected
                                    ? (isLightMode ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20')
                                    : isConnecting
                                    ? (isLightMode ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20')
                                    : (isLightMode ? 'bg-red-100 text-red-700' : 'bg-red-500/10 text-red-400 border border-red-500/20')
                                }`}>
                                  <IconComp className="w-3.5 h-3.5" />
                                </div>
                                <div className="truncate">
                                  <span className={`text-xs font-bold truncate block ${isLightMode ? 'text-slate-800' : 'text-slate-200'}`}>
                                    {server.name}
                                  </span>
                                  <span className={`text-[10px] font-mono block truncate ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {server.host}:{server.servicePort}
                                  </span>
                                </div>
                              </div>

                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                                isConnected
                                  ? (isLightMode ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30')
                                  : isConnecting
                                  ? (isLightMode ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30')
                                  : (isLightMode ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-red-500/10 text-red-400 border border-red-500/30')
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  isConnected ? 'bg-emerald-500 animate-ping' : isConnecting ? 'bg-amber-500 animate-spin' : 'bg-red-500'
                                }`} />
                                <span>
                                  {isConnected
                                    ? (isRtl ? 'آنلاین' : 'Online')
                                    : isConnecting
                                    ? (isRtl ? 'بررسی...' : 'Checking...')
                                    : (isRtl ? 'آفلاین' : 'Offline')}
                                </span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* When EXPANDED: Full detailed status cards with SSH host, service port, version, & individual node test button */}
                    {isServerNodesExpanded && (
                      <div className={`mt-4 grid grid-cols-1 ${
                        configuredServers.length === 2 ? 'sm:grid-cols-2' : configuredServers.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                      } gap-3`}>
                        {configuredServers.map((server) => {
                          const IconComp = server.icon;
                          const isConnected = server.status === 'connected';
                          const isConnecting = server.status === 'connecting';
                          return (
                            <div 
                              key={server.id}
                              className={`rounded-2xl p-4 transition-all duration-200 border ${
                                isLightMode
                                  ? isConnected
                                    ? 'bg-white border-emerald-500/30 shadow-sm hover:border-emerald-500/50'
                                    : isConnecting
                                    ? 'bg-white border-amber-500/30 shadow-sm hover:border-amber-500/50'
                                    : 'bg-white border-red-500/30 shadow-sm hover:border-red-500/50'
                                  : isConnected
                                  ? 'bg-slate-900/60 border-emerald-500/20 hover:border-emerald-500/40 shadow-sm'
                                  : isConnecting
                                  ? 'bg-slate-900/60 border-amber-500/25 hover:border-amber-500/40'
                                  : 'bg-slate-900/60 border-red-500/30 hover:border-red-500/50'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-2.5">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                    isConnected
                                      ? (isLightMode ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20')
                                      : isConnecting
                                      ? (isLightMode ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20')
                                      : (isLightMode ? 'bg-red-100 text-red-700' : 'bg-red-500/10 text-red-400 border border-red-500/20')
                                  }`}>
                                    <IconComp className="w-4 h-4" />
                                  </div>
                                  <div className="truncate">
                                    <h4 className={`text-xs font-bold truncate ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                                      {server.name}
                                    </h4>
                                    <p className={`text-[10px] truncate ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                      {server.roleTitle}
                                    </p>
                                  </div>
                                </div>
                                
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                  isConnected
                                    ? (isLightMode ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30')
                                    : isConnecting
                                    ? (isLightMode ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30')
                                    : (isLightMode ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-red-500/10 text-red-400 border border-red-500/30')
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    isConnected ? 'bg-emerald-500 animate-ping' : isConnecting ? 'bg-amber-500 animate-spin' : 'bg-red-500'
                                  }`} />
                                  <span>
                                    {isConnected
                                      ? (isRtl ? 'متصل' : 'Connected')
                                      : isConnecting
                                      ? (isRtl ? 'بررسی...' : 'Checking...')
                                      : (isRtl ? 'قطع' : 'Disconnected')}
                                  </span>
                                </span>
                              </div>

                              <div className={`space-y-1.5 text-[11px] font-mono rounded-xl p-2.5 border ${
                                isLightMode ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-black/20 border-white/5 text-slate-300'
                              }`}>
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`text-[10px] uppercase font-sans ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {isRtl ? 'آدرس SSH' : 'SSH Endpoint'}:
                                  </span>
                                  <span className={`font-semibold ${isLightMode ? 'text-slate-800' : 'text-slate-200'}`}>
                                    {server.host}:{server.port}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`text-[10px] uppercase font-sans ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {isRtl ? 'پورت سرویس' : 'Service Port'}:
                                  </span>
                                  <span className={`font-semibold ${isLightMode ? 'text-indigo-600' : 'text-indigo-300'}`}>
                                    :{server.servicePort}
                                  </span>
                                </div>
                              </div>

                              <div className={`mt-2.5 pt-2 border-t flex items-center justify-between ${isLightMode ? 'border-slate-100' : 'border-white/5'}`}>
                                <span className={`text-[10px] truncate max-w-[140px] ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                  {server.checkData?.version 
                                    ? `v${server.checkData.version}` 
                                    : server.checkData?.db_version 
                                    ? server.checkData.db_version 
                                    : (isRtl ? 'تونل SSH فعال' : 'SSH Tunnel Active')}
                                </span>
                                <button
                                  onClick={server.onCheck}
                                  disabled={server.isChecking}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50 border ${
                                    isLightMode 
                                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200'
                                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/5'
                                  }`}
                                >
                                  <RefreshCw className={`w-3 h-3 ${server.isChecking ? 'animate-spin' : ''}`} />
                                  <span>{isRtl ? 'تست وضعیت' : 'Test Node'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
            
            {/* VIEW 1: CENTRAL METRICS DASHBOARD */}
            {activeView === 'dashboard' && (
              <ErrorBoundary fallbackTitle="Dashboard Metrics Recovery">
                <div className="space-y-6">
                
                {/* Real-time stats bento grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard
                    title={t.cpuLoad}
                    value={stats ? `${stats.cpuUsage}%` : null}
                    subtext={lang === 'fa' ? 'بار پردازشی هسته سرور' : 'Core CPU processing load'}
                    icon={Cpu}
                    glowColor="cyan"
                    isLoading={isDashboardLoading}
                    onClick={() => setActiveView('reporting')}
                  />
                  <MetricCard
                    title={t.ramUsage}
                    value={stats ? `${stats.memoryUsage}%` : null}
                    subtext={lang === 'fa' ? `مصرف‌شده: ${stats ? (stats.memoryTotal * (stats.memoryUsage / 100)).toFixed(1) : 0} GB از ${stats?.memoryTotal || 0} GB` : `Used: ${stats ? (stats.memoryTotal * (stats.memoryUsage / 100)).toFixed(1) : 0} GB of ${stats?.memoryTotal || 0} GB`}
                    icon={Activity}
                    glowColor="purple"
                    isLoading={isDashboardLoading}
                    onClick={() => setActiveView('reporting')}
                  />
                  <MetricCard
                    title={t.diskUsage}
                    value={stats ? `${stats.diskUsage}%` : null}
                    subtext={lang === 'fa' ? `مصرف‌شده: ${stats ? (stats.diskTotal * (stats.diskUsage / 100)).toFixed(1) : 0} GB از ${stats?.diskTotal || 0} GB (آزاد: ${stats ? stats.diskFree.toFixed(1) : 0} GB)` : `Used: ${stats ? (stats.diskTotal * (stats.diskUsage / 100)).toFixed(1) : 0} GB of ${stats?.diskTotal || 0} GB (Free: ${stats ? stats.diskFree.toFixed(1) : 0} GB)`}
                    icon={HardDrive}
                    glowColor="amber"
                    isLoading={isDashboardLoading}
                    onClick={() => setActiveView('reporting')}
                  />
                  <MetricCard
                    title={t.activeSessions}
                    value={stats ? stats.activeUsers : null}
                    subtext={lang === 'fa' ? 'کاربران آنلاین و فعال سرور ماتریکس' : 'Active Matrix server users'}
                    icon={Users}
                    glowColor="emerald"
                    isLoading={isDashboardLoading}
                    isDbDisconnected={stats ? stats.isDbConnected === false : false}
                    onClick={() => {
                      setKetesaAdminTab('users');
                      setActiveView('admin');
                    }}
                  />
                </div>

                {/* Matrix Content & Media Metrics Bento Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard
                    title={lang === 'fa' ? 'روم‌های عمومی' : 'Public Rooms'}
                    value={stats ? (stats.publicRoomsCount ?? 0) : null}
                    subtext={lang === 'fa' ? 'برای مدیریت روم‌ها کلیک کنید' : 'Click to manage public rooms'}
                    icon={Globe}
                    glowColor="cyan"
                    isLoading={isDashboardLoading}
                    isDbDisconnected={stats ? stats.isDbConnected === false : false}
                    onClick={() => {
                      setKetesaAdminTab('rooms');
                      setActiveView('admin');
                    }}
                  />
                  <MetricCard
                    title={lang === 'fa' ? 'روم‌های خصوصی' : 'Private Rooms'}
                    value={stats ? (stats.privateRoomsCount ?? 0) : null}
                    subtext={lang === 'fa' ? 'برای مدیریت روم‌ها کلیک کنید' : 'Click to manage private rooms'}
                    icon={Lock}
                    glowColor="purple"
                    isLoading={isDashboardLoading}
                    isDbDisconnected={stats ? stats.isDbConnected === false : false}
                    onClick={() => {
                      setKetesaAdminTab('rooms');
                      setActiveView('admin');
                    }}
                  />
                  <MetricCard
                    title={lang === 'fa' ? 'حجم رسانه‌های ذخیره‌شده' : 'Stored Media Size'}
                    value={
                      stats
                        ? stats.totalMediaSizeMB >= 1024
                          ? `${(stats.totalMediaSizeMB / 1024).toFixed(2)} GB`
                          : `${stats.totalMediaSizeMB} MB`
                        : null
                    }
                    subtext={lang === 'fa' ? 'برای پاکسازی کش رسانه‌ها کلیک کنید' : 'Click to manage & clean media cache'}
                    icon={Database}
                    glowColor="emerald"
                    isLoading={isDashboardLoading}
                    isDbDisconnected={stats ? stats.isDbConnected === false : false}
                    onClick={() => {
                      setKetesaAdminTab('media');
                      setActiveView('admin');
                    }}
                  />
                  <MetricCard
                    title={lang === 'fa' ? 'چت‌های گزارش‌شده' : 'Reported Messages'}
                    value={stats ? (stats.reportsCount ?? 0) : null}
                    subtext={lang === 'fa' ? 'برای بررسی و مدیریت گزارش‌ها کلیک کنید' : 'Click to manage & review reports'}
                    icon={Flag}
                    glowColor="rose"
                    isLoading={isDashboardLoading}
                    isDbDisconnected={stats ? stats.isDbConnected === false : false}
                    onClick={() => {
                      setKetesaAdminTab('reports');
                      setActiveView('admin');
                    }}
                  />
                </div>

                {/* Distributed Cluster Multi-Node Overview */}
                {stats?.clusterNodes && stats.clusterNodes.length > 0 && (
                  <div className="spatial-glass rounded-3xl p-5 border border-indigo-500/20 bg-indigo-950/10 backdrop-blur-xl relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          <Network className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{lang === 'fa' ? 'وضعیت گره‌های خوشه توزیع‌شده (Distributed Cluster Nodes)' : 'Distributed Cluster Node Telemetry'}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse">
                              {stats.clusterNodes.filter(n => n.status === 'online').length}/{stats.clusterNodes.length} Online
                            </span>
                          </h4>
                          <p className="text-xs text-slate-400">
                            {lang === 'fa' ? 'مانیتورینگ و وضعیت لحظه‌ای سرورهای مجزای ساینپس، پستگرس و المنت' : 'Real-time telemetry across discrete Synapse, Database, and Element host instances'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveView('connections')}
                        className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto transition-all"
                      >
                        <Server className="w-3.5 h-3.5" />
                        <span>{lang === 'fa' ? 'مدیریت سرورها' : 'Cluster Settings'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {stats.clusterNodes.map(node => (
                        <div 
                          key={node.role} 
                          className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {node.role === 'synapse' && <Cpu className="w-4 h-4 text-purple-400" />}
                              {node.role === 'database' && <Database className="w-4 h-4 text-emerald-400" />}
                              {node.role === 'element' && <Globe className="w-4 h-4 text-blue-400" />}
                              <span className="text-xs font-bold uppercase tracking-wider text-white">
                                {node.role === 'synapse' ? (lang === 'fa' ? 'سرور ساینپس' : 'Synapse Node') :
                                 node.role === 'database' ? (lang === 'fa' ? 'سرور دیتابیس' : 'Database Node') :
                                 (lang === 'fa' ? 'سرور المنت وب' : 'Element Node')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                                (node.role === 'synapse' ? synapseWsStatus === 'connected' :
                                 node.role === 'database' ? databaseWsStatus === 'connected' :
                                 elementWsStatus === 'connected')
                                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                  : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                              }`}>
                                <Activity className="w-2.5 h-2.5" />
                                <span>WS: {(node.role === 'synapse' ? synapseWsStatus : node.role === 'database' ? databaseWsStatus : elementWsStatus)}</span>
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                                node.status === 'online' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${node.status === 'online' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                {node.status === 'online' ? (lang === 'fa' ? 'آنلاین' : 'Online') : (lang === 'fa' ? 'خطا' : 'Unreachable')}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-[11px] font-mono text-slate-300 flex items-center justify-between">
                              <span className="text-slate-500">Host / IP:</span>
                              <span className="font-bold">{node.host}:{node.port}</span>
                            </div>
                            {(node.pingMs !== undefined || node.latencyMs !== undefined) && (
                              <div className="text-[11px] font-mono text-slate-300 flex items-center justify-between">
                                <span className="text-slate-500">Latency:</span>
                                <span className="text-teal-400">{node.pingMs ?? node.latencyMs} ms</span>
                              </div>
                            )}
                            {node.cpu !== undefined && (
                              <div className="text-[11px] font-mono text-slate-300 flex items-center justify-between">
                                <span className="text-slate-500">CPU Usage:</span>
                                <span>{typeof node.cpu === 'object' && node.cpu !== null ? (node.cpu as any).pct : node.cpu}%</span>
                              </div>
                            )}
                            {(node.ram !== undefined || node.memory !== undefined) && (
                              <div className="text-[11px] font-mono text-slate-300 flex items-center justify-between">
                                <span className="text-slate-500">RAM Usage:</span>
                                <span>
                                  {typeof node.ram === 'number'
                                    ? `${node.ram}%`
                                    : typeof node.memory === 'object' && node.memory !== null && 'pct' in node.memory
                                      ? `${node.memory.pct}%`
                                      : `${typeof node.ram === 'object' && node.ram !== null && 'pct' in node.ram ? (node.ram as any).pct : 0}%`}
                                </span>
                              </div>
                            )}
                            {(node.disk !== undefined || node.diskPct !== undefined) && (
                              <div className="text-[11px] font-mono text-slate-300 flex items-center justify-between">
                                <span className="text-slate-500">Disk Used:</span>
                                <span>
                                  {typeof node.disk === 'number'
                                    ? `${node.disk}%`
                                    : typeof node.diskPct === 'number'
                                      ? `${node.diskPct}%`
                                      : typeof node.disk === 'object' && node.disk !== null && 'pct' in node.disk
                                        ? `${node.disk.pct}%`
                                        : '0%'}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {node.role === 'synapse' && synapseApiCheck ? (synapseApiCheck.ok ? `Matrix: OK (${synapseApiCheck.latencyMs}ms)` : 'Matrix: Error') :
                               node.role === 'database' && databaseCheck ? (databaseCheck.ok ? `Postgres: OK (${databaseCheck.latencyMs}ms)` : 'Postgres: Error') :
                               node.role === 'element' && elementCheck ? (elementCheck.ok ? `Element: OK (${elementCheck.latencyMs}ms)` : 'Element: Error') :
                               'WS Diagnostic'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (node.role === 'synapse') checkSynapseApiOverWs();
                                else if (node.role === 'database') checkDatabaseOverWs();
                                else if (node.role === 'element') checkElementOverWs();
                              }}
                              disabled={
                                (node.role === 'synapse' && isCheckingSynapseApi) ||
                                (node.role === 'database' && isCheckingDatabase) ||
                                (node.role === 'element' && isCheckingElement)
                              }
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-[10px] font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                            >
                              <RefreshCw className={`w-3 h-3 ${
                                ((node.role === 'synapse' && isCheckingSynapseApi) ||
                                 (node.role === 'database' && isCheckingDatabase) ||
                                 (node.role === 'element' && isCheckingElement)) ? 'animate-spin' : ''
                              }`} />
                              <span>{lang === 'fa' ? 'تست لحظه‌ای' : 'Test Node'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Element Web, Synapse Server & Server Date & Time Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Element Web Card */}
                  {isDashboardLoading ? (
                    <div className="spatial-glass rounded-3xl p-5 border border-indigo-500/25 relative overflow-hidden space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 w-3/4">
                          <div className="w-10 h-10 rounded-2xl bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden shrink-0 border border-black/5 dark:border-white/[0.05]">
                            <div className="shimmer-light-beam" />
                          </div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 w-36 rounded bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                              <div className="shimmer-light-beam" />
                            </div>
                            <div className="h-3 w-48 rounded bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                              <div className="shimmer-light-beam" />
                            </div>
                          </div>
                        </div>
                        <div className="w-4 h-4 rounded bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden">
                          <div className="shimmer-light-beam" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="h-7 w-28 rounded-lg bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                          <div className="shimmer-light-beam" />
                        </div>
                        <div className="h-6 w-36 rounded-full bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                          <div className="shimmer-light-beam" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => {
                        setTerminalInitialTab('element-synapse');
                        setActiveView('terminal');
                      }}
                      className={`spatial-glass rounded-3xl p-5 border transition-all cursor-pointer group relative overflow-hidden ${
                        (stats?.elementHasUpdate || (stats?.elementVersion && stats?.elementLatestVersion && stats.elementVersion !== stats.elementLatestVersion)) 
                          ? 'border-amber-500/40 bg-amber-500/5 hover:border-amber-500/60 hover:bg-amber-500/10' 
                          : 'border-white/10 hover:border-indigo-500/30 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-2xl ${isLightMode ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            <Globe className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                              <span>{lang === 'fa' ? 'نسخه المنت وب (Element Web)' : 'Element Web Version'}</span>
                              {(stats?.elementHasUpdate || (stats?.elementVersion && stats?.elementLatestVersion && stats.elementVersion !== stats.elementLatestVersion)) && (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                  </span>
                                  {lang === 'fa' ? 'آپدیت جدید موجود است' : 'New Update Available'}
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {lang === 'fa' ? 'کلاینت رسمی ماتریکس روی سرور متصل' : 'Official Matrix web client on connected server'}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1 shrink-0" />
                      </div>

                      <div className="flex flex-wrap items-baseline justify-between gap-2 mt-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-mono font-bold text-white">
                            {stats?.elementVersion || 'v1.11.55'}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({lang === 'fa' ? 'فعلی' : 'Installed'})
                          </span>
                        </div>

                        {(stats?.elementHasUpdate || (stats?.elementVersion && stats?.elementLatestVersion && stats.elementVersion !== stats.elementLatestVersion)) ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            {lang === 'fa' 
                              ? `آپدیت جدید موجود است: ${stats?.elementLatestVersion || 'v1.12.25'}` 
                              : `New update available: ${stats?.elementLatestVersion || 'v1.12.25'}`}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Check className="w-3 h-3" />
                            {lang === 'fa' ? 'نسخه بروز' : 'Up to date'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Synapse Server Card */}
                  {isDashboardLoading ? (
                    <div className="spatial-glass rounded-3xl p-5 border border-purple-500/25 relative overflow-hidden space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 w-3/4">
                          <div className="w-10 h-10 rounded-2xl bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden shrink-0 border border-black/5 dark:border-white/[0.05]">
                            <div className="shimmer-light-beam" />
                          </div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 w-36 rounded bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                              <div className="shimmer-light-beam" />
                            </div>
                            <div className="h-3 w-48 rounded bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                              <div className="shimmer-light-beam" />
                            </div>
                          </div>
                        </div>
                        <div className="w-4 h-4 rounded bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden">
                          <div className="shimmer-light-beam" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="h-7 w-28 rounded-lg bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                          <div className="shimmer-light-beam" />
                        </div>
                        <div className="h-6 w-36 rounded-full bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                          <div className="shimmer-light-beam" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => {
                        setTerminalInitialTab('element-synapse');
                        setActiveView('terminal');
                      }}
                      className={`spatial-glass rounded-3xl p-5 border transition-all cursor-pointer group relative overflow-hidden ${
                        (stats?.synapseHasUpdate || (stats?.synapseVersion && stats?.synapseLatestVersion && stats.synapseVersion !== stats.synapseLatestVersion))
                          ? 'border-purple-500/40 bg-purple-500/5 hover:border-purple-500/60 hover:bg-purple-500/10' 
                          : 'border-white/10 hover:border-indigo-500/30 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-2xl ${isLightMode ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/10 text-purple-400'}`}>
                            <Server className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                              <span>{lang === 'fa' ? 'نسخه سرور سیناپس (Synapse)' : 'Synapse Server Version'}</span>
                              {(stats?.synapseHasUpdate || (stats?.synapseVersion && stats?.synapseLatestVersion && stats.synapseVersion !== stats.synapseLatestVersion)) && (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                  </span>
                                  {lang === 'fa' ? 'آپدیت جدید موجود است' : 'New Update Available'}
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {lang === 'fa' ? 'موتور اصلی هوم‌سرور ماتریکس متصل' : 'Core Matrix Homeserver engine connected'}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1 shrink-0" />
                      </div>

                      <div className="flex flex-wrap items-baseline justify-between gap-2 mt-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-mono font-bold text-white">
                            {stats?.synapseVersion || 'v1.102.0'}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({lang === 'fa' ? 'فعلی' : 'Installed'})
                          </span>
                        </div>

                        {(stats?.synapseHasUpdate || (stats?.synapseVersion && stats?.synapseLatestVersion && stats.synapseVersion !== stats.synapseLatestVersion)) ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                            {lang === 'fa' 
                              ? `آپدیت جدید موجود است: ${stats?.synapseLatestVersion || ''}` 
                              : `New update available: ${stats?.synapseLatestVersion || ''}`}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Check className="w-3 h-3" />
                            {lang === 'fa' ? 'نسخه بروز' : 'Up to date'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Date & Time Card */}
                  {isDashboardLoading ? (
                    <div className="spatial-glass rounded-3xl p-5 border border-cyan-500/25 relative overflow-hidden space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 w-3/4">
                          <div className="w-10 h-10 rounded-2xl bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden shrink-0 border border-black/5 dark:border-white/[0.05]">
                            <div className="shimmer-light-beam" />
                          </div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 w-36 rounded bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                              <div className="shimmer-light-beam" />
                            </div>
                            <div className="h-3 w-48 rounded bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                              <div className="shimmer-light-beam" />
                            </div>
                          </div>
                        </div>
                        <div className="w-4 h-4 rounded bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden">
                          <div className="shimmer-light-beam" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="h-7 w-28 rounded-lg bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                          <div className="shimmer-light-beam" />
                        </div>
                        <div className="h-6 w-36 rounded-full bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                          <div className="shimmer-light-beam" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => {
                        setConfigInitialTab('datetime');
                        setActiveView('config');
                      }}
                      title={lang === 'fa' ? 'کلیک جهت رفتن به تنظیمات زمان، تاریخ و منطقه زمانی سرور' : 'Click to configure server date, time & timezone'}
                      className="spatial-glass rounded-3xl p-5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-2xl ${isLightMode ? 'bg-cyan-100 text-cyan-600' : 'bg-cyan-500/10 text-cyan-400'}`}>
                              <Clock className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                                <span>{lang === 'fa' ? 'Date & Time' : 'Date & Time'}</span>
                              </h4>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {t.dateTimeSub || (lang === 'fa' ? 'زمان و تاریخ سیستم سرور متصل' : 'Connected server local system clock')}
                              </p>
                            </div>
                          </div>
                          <RefreshCw className={`w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0 ${isRefreshingStats ? 'animate-spin' : ''}`} />
                        </div>

                        {/* Date and Time Formatted Display */}
                        <div className="mt-2.5 space-y-1.5 bg-black/20 dark:bg-black/30 rounded-2xl p-3 border border-white/5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-medium text-slate-400">Date :</span>
                            <span className="text-base sm:text-lg font-mono font-bold text-white tracking-wide">
                              {stats?.serverDate || 'YYYY-MM-DD'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-t border-white/5 pt-1.5">
                            <span className="text-xs font-mono font-medium text-slate-400">Time:</span>
                            <span className="text-base sm:text-lg font-mono font-bold text-cyan-400 tracking-wide">
                              {stats?.serverTime || 'HH:MM:SS'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer with Timezone badge & sync indicator */}
                      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/5">
                        <span className="text-[11px] text-slate-400 truncate max-w-[130px]" title={stats?.serverTimezone || 'UTC'}>
                          {lang === 'fa' ? 'منطقه:' : 'TZ:'} <span className="font-mono text-slate-300 font-medium">{stats?.serverTimezone || 'UTC'}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
                          </span>
                          <span>{lang === 'fa' ? 'همگام زنده' : 'Live Sync'}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Services status and bento components */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Service status management card */}
                  <div className="lg:col-span-2 spatial-glass rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-md font-display font-semibold text-white mb-4 flex items-center gap-2">
                        <Server className="w-5 h-5 text-indigo-400" />
                        {t.servicesState}
                      </h3>

                      {isDashboardLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[1, 2, 3, 4].map((idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-black/25 border border-white/5 flex items-center justify-between relative overflow-hidden">
                              <div className="flex items-center gap-3 w-1/2">
                                <div className="w-3 h-3 rounded-full bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden shrink-0">
                                  <div className="shimmer-light-beam" />
                                </div>
                                <div className="space-y-1.5 flex-1">
                                  <div className="h-3.5 w-24 rounded bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                                    <div className="shimmer-light-beam" />
                                  </div>
                                  <div className="h-2.5 w-16 rounded bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                                    <div className="shimmer-light-beam" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <div className="h-6 w-12 rounded-lg bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                                  <div className="shimmer-light-beam" />
                                </div>
                                <div className="h-6 w-14 rounded-lg bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                                  <div className="shimmer-light-beam" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {services.map((svc) => (
                            <div key={svc.id} className="p-4 rounded-2xl bg-black/25 border border-white/5 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className={`w-2.5 h-2.5 rounded-full ${
                                  svc.status === 'active' 
                                    ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' 
                                    : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                                }`} />
                                <div>
                                  <h4 className="text-xs font-semibold text-white">{svc.displayName}</h4>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {svc.name} {svc.port ? `:${svc.port}` : ''}
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-1.5 sm:gap-2">
                                {svc.status === 'active' ? (
                                  <button
                                    disabled={!!loadingServices[svc.id]}
                                    onClick={() => handleServiceAction(svc.id, 'stop')}
                                    className="text-[10px] bg-red-500/10 hover:bg-red-500/20 border border-red-500/15 text-red-400 px-2 py-1 rounded-lg font-bold flex items-center gap-1 disabled:opacity-50 transition-all duration-200"
                                    title={`Stop ${svc.displayName}`}
                                  >
                                    {loadingServices[svc.id] === 'stop' && (
                                      <svg className="animate-spin h-3 w-3 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                    )}
                                    {loadingServices[svc.id] === 'stop' ? (t.serviceStopping || 'Stopping...') : (t.serviceStop || 'Stop')}
                                  </button>
                                ) : (
                                  <button
                                    disabled={!!loadingServices[svc.id]}
                                    onClick={() => handleServiceAction(svc.id, 'start')}
                                    className="text-[10px] bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/15 text-emerald-400 px-2 py-1 rounded-lg font-bold flex items-center gap-1 disabled:opacity-50 transition-all duration-200"
                                    title={`Start ${svc.displayName}`}
                                  >
                                    {loadingServices[svc.id] === 'start' && (
                                      <svg className="animate-spin h-3 w-3 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                    )}
                                    {loadingServices[svc.id] === 'start' ? (t.serviceStarting || 'Starting...') : (t.serviceStart || 'Start')}
                                  </button>
                                )}
                                <button
                                  disabled={!!loadingServices[svc.id]}
                                  onClick={() => handleServiceAction(svc.id, 'reload')}
                                  className="text-[10px] bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/15 text-amber-300 px-2 py-1 rounded-lg font-semibold flex items-center gap-1 disabled:opacity-50 transition-all duration-200"
                                  title={`Reload configuration for ${svc.displayName}`}
                                >
                                  {loadingServices[svc.id] === 'reload' && (
                                    <svg className="animate-spin h-3 w-3 text-amber-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  )}
                                  {loadingServices[svc.id] === 'reload' ? (t.serviceReloading || 'Reloading...') : (t.serviceReload || 'Reload')}
                                </button>
                                <button
                                  disabled={!!loadingServices[svc.id]}
                                  onClick={() => handleServiceAction(svc.id, 'restart')}
                                  className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-2 py-1 rounded-lg font-semibold flex items-center gap-1 disabled:opacity-50 transition-all duration-200"
                                  title={`Restart ${svc.displayName}`}
                                >
                                  {loadingServices[svc.id] === 'restart' && (
                                    <svg className="animate-spin h-3 w-3 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  )}
                                  {loadingServices[svc.id] === 'restart' ? (t.serviceRestarting || 'Restarting...') : (t.serviceRestart || 'Restart')}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side: Information and logs */}
                  <div className="spatial-glass rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-md font-display font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        Matrix Connection Details
                      </h3>

                      {isDashboardLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3, 4, 5, 6].map((idx) => (
                            <div key={idx} className="flex justify-between border-b border-white/5 pb-2 items-center">
                              <div className="h-3 w-28 rounded bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                                <div className="shimmer-light-beam" />
                              </div>
                              <div className="h-3.5 w-36 rounded bg-slate-300/40 dark:bg-slate-800/40 relative overflow-hidden border border-black/5 dark:border-white/[0.05]">
                                <div className="shimmer-light-beam" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4 text-xs font-mono">
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400">Homeserver URL:</span>
                            <span className="text-indigo-400 font-semibold">https://{config?.HS_DOMAIN || (activeConnection?.id !== 'local' ? `matrix.${activeConnection?.host}` : 'matrix.example.com')}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400">Element App:</span>
                            <span className="text-purple-400 font-semibold">https://{config?.ELEMENT_DOMAIN || (activeConnection?.id !== 'local' ? `chat.${activeConnection?.host}` : 'chat.example.com')}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400">Base Domain:</span>
                            <span className="text-slate-200">{config?.BASE_DOMAIN || (activeConnection?.id !== 'local' ? activeConnection?.host : 'example.com')}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400">Server Public IP:</span>
                            <span className="text-slate-200">{config?.PUBLIC_IP || (activeConnection?.id !== 'local' ? activeConnection?.host : '127.0.0.1')}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400">SSL Profile:</span>
                            <span className="text-amber-400 font-semibold">{(config?.SSL_MODE || 'selfsigned').toUpperCase()}</span>
                          </div>
                          {activeConnection?.id !== 'local' && (
                            <>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">SSH Tunnel:</span>
                                <span className="text-teal-400 font-semibold">{activeConnection?.username}@{activeConnection?.host}:{activeConnection?.port}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">Postgres Target:</span>
                                <span className="text-emerald-400 font-semibold">{activeConnection?.dbUser}@{activeConnection?.dbHost}:{activeConnection?.dbPort}/{activeConnection?.dbName}</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between">
                            <span className="text-slate-400">LDAP Bridging:</span>
                            <span className={ldap?.enabled ? "text-emerald-400 font-semibold" : "text-slate-500"}>
                              {ldap?.enabled ? "ENABLED" : "DISABLED"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Diagnostic Test</h4>
                        <button
                          disabled={isDashboardLoading}
                          onClick={() => handleExecuteCommand('health_check')}
                          className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-xs font-bold transition-all disabled:opacity-50"
                        >
                          Launch HealthCheck
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ErrorBoundary>
          )}

            {/* VIEW 2: HOMESERVER CONFIGURATION */}
            {activeView === 'config' && (
              <ConfigForms
                initialTab={configInitialTab}
                config={config}
                ldap={ldap}
                workers={workers}
                matrixUsers={matrixUsers}
                onSaveConfig={handleSaveConfig}
                onRegisterUser={handleRegisterMatrixUser}
                onDeactivateUser={handleDeactivateMatrixUser}
                onReactivateUser={handleReactivateMatrixUser}
                userRole={currentUser?.role || 'Viewer'}
                authToken={authToken || ''}
                showToast={showToast}
                isExecuting={isExecuting}
                onExecuteCommand={handleExecuteCommand}
                isLightMode={isLightMode}
                lang={lang}
                activeConnectionId={activeConnection?.id}
                backups={backups}
                onDeleteBackup={handleDeleteBackup}
                onCreateBackup={handleRefreshBackups}
                onRefreshBackups={handleRefreshBackups}
                multiWsStates={{
                  isDistributed,
                  synapseConnected: synapseWsStatus === 'connected',
                  databaseConnected: databaseWsStatus === 'connected',
                  elementConnected: elementWsStatus === 'connected',
                  synapseApiCheck,
                  databaseCheck,
                  elementCheck,
                  isCheckingSynapseApi,
                  isCheckingDatabase,
                  isCheckingElement,
                  onCheckSynapseApi: checkSynapseApiOverWs,
                  onCheckDatabase: checkDatabaseOverWs,
                  onCheckElement: checkElementOverWs,
                }}
              />
            )}

            {/* VIEW - KETESA ADMIN PANEL */}
            {activeView === 'admin' && (
              <KetesaAdmin
                lang={lang}
                authToken={authToken}
                currentUser={currentUser}
                showToast={showToast}
                isLightMode={isLightMode}
                activeConnectionId={activeConnection?.id}
                onExecuteCommand={handleExecuteCommand}
                isExecuting={isExecuting}
                logs={terminalLogs}
                initialTab={ketesaAdminTab}
                onNavigateToConfig={(tab) => {
                  if (tab) {
                    setConfigInitialTab(tab as any);
                  }
                  setActiveView('config');
                }}
              />
            )}

            {/* VIEW 6: SHELL TERMINAL CONSOLE */}
            {activeView === 'terminal' && (
              <TerminalPanel
                logs={terminalLogs}
                isExecuting={isExecuting}
                onExecuteCommand={handleExecuteCommand}
                userRole={currentUser?.role || 'Viewer'}
                authToken={authToken}
                lang={lang}
                isLightMode={isLightMode}
                showToast={showToast}
                initialTab={terminalInitialTab}
                onTabChange={(tab) => setTerminalInitialTab(tab)}
                config={config}
                activeConnection={activeConnection}
                onLogout={handleLogout}
              />
            )}

            {/* VIEW 7: ANALYTICS & REPORTS */}
            {activeView === 'reporting' && (
              <ReportingPanel
                stats={stats}
                panelUsers={panelUsers}
                auditLogs={auditLogs}
                backups={backups}
                undoHistory={undoHistory}
                onCreatePanelUser={handleCreatePanelUser}
                onChangeUserRole={handleChangeUserRole}
                onUpdateUserPermissions={handleUpdateUserPermissions}
                onChangeUserPassword={handleChangeUserPassword}
                onDeletePanelUser={handleDeletePanelUser}
                onDeleteBackup={handleDeleteBackup}
                onCreateBackup={handleRefreshBackups}
                userRole={currentUser?.role || 'Viewer'}
                authToken={authToken}
                showToast={showToast}
                isLightMode={isLightMode}
                lang={lang}
                currentUser={currentUser}
              />
            )}

            {/* VIEW 8: MULTI-SERVER CONNECTION MANAGEMENT */}
            {activeView === 'connections' && (
              <ConnectionManager
                authToken={authToken || ''}
                onProfileChanged={async () => {
                  setIsRefreshingStats(true);
                  setStats(null);
                  await fetchConfig();
                  await fetchLogs();
                  await fetchPanelUsers();
                  await fetchMatrixUsers();
                  await fetchBackups();
                  await fetchConnections();
                  await fetchStats();
                  if (authToken) setupWebSocket(authToken);
                  setIsRefreshingStats(false);
                }}
                showToast={showToast}
                isLightMode={isLightMode}
                lang={lang}
              />
            )}
          </main>

          {/* Floating Spatial Navigation Control Dock */}
          <SpatialDock 
            activeView={activeView} 
            onViewChange={handleViewChange} 
            onLogout={handleLogout}
            userRole={currentUser?.role || 'Owner'}
            currentUser={currentUser}
            lang={lang}
            isLightMode={isLightMode}
          />

          <InstallWizardModal
            isOpen={showInstallWizard}
            onClose={() => setShowInstallWizard(false)}
            onConfirm={(config) => {
              setShowInstallWizard(false);
              setTerminalInitialTab('install');
              handleExecuteCommand('install', { config });
            }}
            lang={lang}
            isLightMode={isLightMode}
            defaultHost={activeConnection?.host}
            defaultDomain={activeConnection?.domain}
            activeConnection={activeConnection}
            connections={connections}
          />

          <GuidedTourModal
            isOpen={isGuidedTourOpen}
            onClose={() => setIsGuidedTourOpen(false)}
            lang={lang}
            isLightMode={isLightMode}
            onNavigateView={(view) => setActiveView(view)}
          />

          <AboutModal
            isOpen={isAboutModalOpen}
            onClose={() => setIsAboutModalOpen(false)}
            lang={lang}
            isLightMode={isLightMode}
            activeConnection={activeConnection}
            updateAvailable={updateAvailable}
            commitsBehind={commitsBehind}
            latestCommitDesc={latestCommitDesc}
            latestVersion={latestVersion}
            onOpenUpdates={() => {
              setTerminalInitialTab('updates');
              setActiveView('terminal');
            }}
          />
        </div>
      )}
    </div>
  );
}
