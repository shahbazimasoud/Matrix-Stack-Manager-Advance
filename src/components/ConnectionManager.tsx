/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Server, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Terminal, 
  Key, 
  Settings, 
  Activity,
  ArrowRight,
  Sparkles,
  Lock,
  Edit,
  Download,
  Upload,
  Cpu,
  Layers,
  Network,
  Copy,
  Check,
  ShieldCheck,
  Radio,
  Clock
} from 'lucide-react';
import { ConnectionProfile, ServerNodeConfig } from '../types';

interface ConnectionManagerProps {
  authToken: string;
  onProfileChanged: () => void;
  showToast: (type: 'success' | 'error', text: string) => void;
  isLightMode?: boolean;
  lang?: 'fa' | 'en' | 'es' | 'ar' | 'de' | 'ru';
}

const connTranslations = {
  fa: {
    pageTitle: "اتصالات سرور",
    pageSubtitle: "مدیریت و سوئیچ بین سرورهای محلی، سرورهای راه دور (Standalone) و خوشه‌های توزیع‌شده چندسروره (Distributed Cluster).",
    viewProfiles: "مشاهده پروفایل‌ها",
    addRemoteServer: "افزودن سرور / خوشه جدید",
    exportConnections: "خروجی (Export)",
    importConnections: "ورودی (Import)",
    exportSuccess: "پروفایل‌های اتصال با موفقیت خروجی گرفته شدند.",
    importSuccess: "پروفایل‌های اتصال با موفقیت ایمپورت شدند.",
    importError: "خطا در بارگذاری یا ساختار فایل JSON نامعتبر است.",
    configureRemoteServer: "پیکربندی اتصال سرور و معماری استقرار",
    vpsDetailsDesc: "مشخصات سرورها را وارد نمایید. در حالت توزیع‌شده می‌توانید ساینپس، دیتابیس و المنت را روی سرورهای جداگانه تعریف کنید.",
    profileName: "نام پروفایل / خوشه *",
    deploymentMode: "معماری استقرار سیستم",
    standaloneMode: "تک‌سروره / تجمیعی (Standalone)",
    standaloneModeDesc: "تمام سرویس‌ها (ساینپس، دیتابیس و المنت) روی یک سرور مجازی قرار دارند.",
    distributedMode: "توزیع‌شده چندسروره (Distributed Cluster)",
    distributedModeDesc: "ساینپس، دیتابیس PostgreSQL و المنت وب روی سرورهای مجزا با IP و SSH اختصاصی قرار دارند.",
    synapseNodeTab: "سرور ساینپس (Synapse Node)",
    databaseNodeTab: "سرور دیتابیس (DB Node)",
    elementNodeTab: "سرور المنت (Element Node)",
    hostIp: "میزبان / IP *",
    port: "پورت SSH",
    sshUsername: "نام کاربری SSH *",
    authType: "نوع احراز هویت",
    passwordLabel: "رمز عبور",
    privateKeyLabel: "کلید خصوصی SSH",
    sshPassword: "رمز عبور SSH",
    sshPrivateKeyContent: "محتوای کلید خصوصی SSH",
    servicePort: "پورت سرویس",
    copyFromSynapse: "کپی مشخصات ورود از سرور ساینپس",
    copySuccess: "مشخصات SSH با موفقیت کپی شد.",
    showAdvanced: "نمایش تنظیمات پیشرفته (پستگرس و مسیرها)",
    hideAdvanced: "پنهان کردن تنظیمات پیشرفته (پستگرس و مسیرها)",
    showAdminSettings: "نمایش تنظیمات توکن ادمین",
    hideAdminSettings: "پنهان کردن تنظیمات توکن ادمین",
    adminTokenTitle: "توکن ادمین و اطلاعات کاربری ماتریکس",
    adminTokenDesc: "نام کاربری و رمز عبور ادمین ماتریکس المنت یا توکن دسترسی ادمین (Admin Access Token) را برای استفاده در ای‌پی‌آی‌های ادمین ساینپس وارد کنید.",
    adminUsernameLabel: "نام کاربری ادمین",
    adminPasswordLabel: "رمز عبور ادمین",
    adminAccessTokenLabel: "توکن دسترسی ادمین (اختیاری)",
    cancel: "لغو",
    saveProfile: "ذخیره پروفایل / خوشه",
    loadingProfiles: "در حال بارگذاری پروفایل‌های اتصال...",
    noProfilesTitle: "پروفیلی یافت نشد",
    noProfilesDesc: "شما هیچ پروفایل اتصالی تعریف نکرده‌اید. روی دکمه افزودن سرور راه دور کلیک کنید تا یک سرور دیگر را متصل کنید.",
    activeServer: "سرور فعال",
    connectionType: "نوع اتصال:",
    internalSandbox: "سنباکس داخلی محلی",
    remoteSsh: "اتصال SSH راه دور",
    distributedCluster: "خوشه توزیع‌شده چندسروره",
    authMethod: "روش احراز هویت:",
    sshPrivateKey: "کلید خصوصی SSH",
    passwordCredentials: "رمز عبور و مشخصات ورود",
    synapsePostgres: "پست‌گرس ساینپس:",
    testSync: "تست همگام‌سازی",
    testing: "در حال تست...",
    connectedBadge: "متصل",
    detectDbBtn: "شناسایی اطلاعات دیتابیس (Detect DB Info)",
    detectingDb: "در حال شناسایی دیتابیس...",
    detectDbNotice: "اتصال SSH به سرور هدف و استخراج خودکار DB Host, DB Port, DB Name, DB Username و DB Password از فایل homeserver.yaml.",
    detectDbDistributedNotice: "در حالت توزیع‌شده، ابتدا سرور دیتابیس PostgreSQL بررسی شده و سپس تنظیمات ساینپس برای استخراج رمز عبور و نام دیتابیس آنالیز می‌شود.",
    detectDbSuccess: "مشخصات دیتابیس با موفقیت از سرور هدف استخراج و در فیلدهای زیر درج شد!",
    detectDbMissingSSH: "لطفاً ابتدا آدرس سرور (Host)، پورت، نام کاربری SSH و رمز عبور یا کلید خصوصی را وارد نمایید.",
    detectDbMissingDistributedSSH: "لطفاً ابتدا مشخصات SSH سرور دیتابیس PostgreSQL یا سرور ساینپس را وارد نمایید.",
    detectDbFailed: "خطا در شناسایی اطلاعات دیتابیس:",
    detectDbBadge: "استخراج خودکار از سرور ساینپس",
    testAllNodes: "تست اتصال سراسری خوشه",
    clusterTopology: "توپولوژی معماری خوشه",
    synapseServer: "سرور ساینپس",
    databaseServer: "سرور دیتابیس",
    elementServer: "سرور المنت وب",
    nodeSshOk: "SSH متصل",
    nodeSshFail: "خطای SSH",
    clusterSyncOk: "ارتباط تمام نودهای خوشه و سرویس‌ها با موفقیت تأیید شد.",
    clusterSyncFail: "خطا در ارتباط با برخی نودها یا سرویس‌های خوشه."
  },
  en: {
    pageTitle: "Server Connections",
    pageSubtitle: "Manage and switch between local environments, standalone remote VPS, and distributed multi-server clusters.",
    viewProfiles: "View Profiles",
    addRemoteServer: "Add Server / Cluster",
    exportConnections: "Export Connections",
    importConnections: "Import Connections",
    exportSuccess: "Connection profiles exported successfully.",
    importSuccess: "Connection profiles imported successfully.",
    importError: "Failed to import. Invalid JSON file structure.",
    configureRemoteServer: "Configure Server Connection & Architecture",
    vpsDetailsDesc: "Provide server connection details. Under distributed mode, you can assign Synapse, Database, and Element to separate physical/virtual nodes.",
    profileName: "Profile / Cluster Name *",
    deploymentMode: "Deployment Architecture",
    standaloneMode: "Single Server (Standalone)",
    standaloneModeDesc: "All components (Synapse, PostgreSQL, and Element) run co-located on a single VPS.",
    distributedMode: "Distributed Multi-Server Cluster",
    distributedModeDesc: "Synapse, PostgreSQL Database, and Element Web run on distinct servers with dedicated IPs and SSH credentials.",
    synapseNodeTab: "Synapse Node",
    databaseNodeTab: "PostgreSQL DB Node",
    elementNodeTab: "Element Web Node",
    hostIp: "Host / IP *",
    port: "SSH Port",
    sshUsername: "SSH Username *",
    authType: "Authentication Type",
    passwordLabel: "Password",
    privateKeyLabel: "SSH Private Key",
    sshPassword: "SSH Password",
    sshPrivateKeyContent: "SSH Private Key Content",
    servicePort: "Service Port",
    copyFromSynapse: "Copy SSH Credentials from Synapse Node",
    copySuccess: "SSH credentials copied successfully.",
    showAdvanced: "Show Advanced Settings (PostgreSQL & Paths)",
    hideAdvanced: "Hide Advanced Settings (PostgreSQL & Paths)",
    showAdminSettings: "Show Admin Token Settings",
    hideAdminSettings: "Hide Admin Token Settings",
    adminTokenTitle: "Admin Token & Matrix Credentials",
    adminTokenDesc: "Enter the admin username and password for Matrix Element Chat or provide an Admin Access Token to use for the Synapse Admin APIs.",
    adminUsernameLabel: "Admin Username",
    adminPasswordLabel: "Admin Password",
    adminAccessTokenLabel: "Admin Access Token (Optional)",
    cancel: "Cancel",
    saveProfile: "Save Profile / Cluster",
    loadingProfiles: "Loading Connection Profiles...",
    noProfilesTitle: "No Profiles Found",
    noProfilesDesc: "You haven't defined any connection profiles. Click the Add Remote Server button to link a remote node or cluster.",
    activeServer: "Active Server",
    connectionType: "Connection Type:",
    internalSandbox: "Internal Sandbox",
    remoteSsh: "Remote SSH (Standalone)",
    distributedCluster: "Distributed Multi-Node Cluster",
    authMethod: "Auth Method:",
    sshPrivateKey: "SSH Private Key",
    passwordCredentials: "Password Credentials",
    synapsePostgres: "Synapse PostgreSQL:",
    testSync: "Test Sync",
    testing: "Testing...",
    connectedBadge: "Connected",
    detectDbBtn: "Detect DB Info",
    detectingDb: "Detecting Database...",
    detectDbNotice: "SSH to target server and extract DB Host, DB Port, DB Name, DB User and DB Password automatically from homeserver.yaml.",
    detectDbDistributedNotice: "In distributed cluster mode, PostgreSQL DB Node is checked first, followed by Synapse configuration analysis for password & credentials.",
    detectDbSuccess: "Database parameters successfully detected and filled in fields below!",
    detectDbMissingSSH: "Please enter SSH Host, Port, and Username first.",
    detectDbMissingDistributedSSH: "Please enter SSH details for the PostgreSQL DB Node or Synapse Node first.",
    detectDbFailed: "Failed to detect database parameters:",
    detectDbBadge: "Auto-extracted from Synapse",
    testAllNodes: "Test All Cluster Nodes",
    clusterTopology: "Cluster Architecture Topology",
    synapseServer: "Synapse Server",
    databaseServer: "Database Server",
    elementServer: "Element Web Server",
    nodeSshOk: "SSH OK",
    nodeSshFail: "SSH Error",
    clusterSyncOk: "All cluster nodes and services verified successfully.",
    clusterSyncFail: "Some cluster nodes or services failed verification."
  },
  es: {
    pageTitle: "Conexiones de Servidor",
    pageSubtitle: "Administre y cambie entre entornos locales, VPS remotos independientes y clústeres distribuidos multiservidor.",
    viewProfiles: "Ver Perfiles",
    addRemoteServer: "Agregar Servidor / Clúster",
    exportConnections: "Exportar Conexiones",
    importConnections: "Importar Conexiones",
    exportSuccess: "Perfiles de conexión exportados correctamente.",
    importSuccess: "Perfiles de conexión importados correctamente.",
    importError: "Error al importar. Estructura de archivo JSON no válida.",
    configureRemoteServer: "Configurar conexión de Servidor y Arquitectura",
    vpsDetailsDesc: "Proporcione los detalles del servidor. En modo distribuido, puede asignar Synapse, Base de Datos y Element a nodos independientes.",
    profileName: "Nombre del Perfil / Clúster *",
    deploymentMode: "Arquitectura de Despliegue",
    standaloneMode: "Servidor Único (Independiente)",
    standaloneModeDesc: "Todos los servicios (Synapse, Base de Datos y Element) se ejecutan en un único VPS.",
    distributedMode: "Clúster Distribuido Multiservidor",
    distributedModeDesc: "Synapse, PostgreSQL y Element Web se ejecutan en servidores separados con IP y SSH dedicados.",
    synapseNodeTab: "Nodo Synapse",
    databaseNodeTab: "Nodo PostgreSQL",
    elementNodeTab: "Nodo Element Web",
    hostIp: "Host / IP *",
    port: "Puerto SSH",
    sshUsername: "Usuario SSH *",
    authType: "Tipo de Autenticación",
    passwordLabel: "Contraseña",
    privateKeyLabel: "Clave Privada SSH",
    sshPassword: "Contraseña SSH",
    sshPrivateKeyContent: "Contenido de la Clave Privada SSH",
    servicePort: "Puerto del Servicio",
    copyFromSynapse: "Copiar credenciales SSH del nodo Synapse",
    copySuccess: "Credenciales SSH copiadas exitosamente.",
    showAdvanced: "Mostrar Configuración Avanzada (PostgreSQL y Rutas)",
    hideAdvanced: "Ocultar Configuración Avanzada (PostgreSQL y Rutas)",
    showAdminSettings: "Mostrar Configuración de Token de Administrador",
    hideAdminSettings: "Ocultar Configuración de Token de Administrador",
    adminTokenTitle: "Token de Administrador y Credenciales Matrix",
    adminTokenDesc: "Ingrese las credenciales del administrador de Matrix o proporcione un token de acceso de administrador para las API de Synapse.",
    adminUsernameLabel: "Usuario Administrador",
    adminPasswordLabel: "Contraseña Administrador",
    adminAccessTokenLabel: "Token de Acceso de Administrador (Opcional)",
    cancel: "Cancelar",
    saveProfile: "Guardar Perfil",
    loadingProfiles: "Cargando perfiles...",
    noProfilesTitle: "No se encontraron perfiles",
    noProfilesDesc: "No ha definido ningún perfil de conexión.",
    activeServer: "Servidor Activo",
    connectionType: "Tipo de Conexión:",
    internalSandbox: "Sandbox Local Interno",
    remoteSsh: "SSH Remoto",
    distributedCluster: "Clúster Distribuido Multiservidor",
    authMethod: "Método de Autenticación:",
    sshPrivateKey: "Clave Privada SSH",
    passwordCredentials: "Credenciales de Contraseña",
    synapsePostgres: "Postgres de Synapse:",
    testSync: "Probar Sincronización",
    testing: "Probando...",
    connectedBadge: "Conectado",
    detectDbBtn: "Detectar Información de BD",
    detectingDb: "Detectando BD...",
    detectDbNotice: "Se conecta por SSH al servidor Synapse y extrae automáticamente los parámetros de BD desde homeserver.yaml.",
    detectDbSuccess: "¡Parámetros de base de datos detectados exitosamente!",
    detectDbMissingSSH: "Ingrese primero el host SSH, puerto y credenciales.",
    detectDbFailed: "Error al detectar la base de datos:",
    detectDbBadge: "Autoextracción desde Synapse",
    testAllNodes: "Probar Conectividad del Clúster",
    clusterTopology: "Topología del Clúster",
    synapseServer: "Nodo Synapse",
    databaseServer: "Nodo Postgres",
    elementServer: "Nodo Element Web"
  },
  ar: {
    pageTitle: "اتصالات الخادم",
    pageSubtitle: "إدارة والتبديل بين البيئات المحلية والخوادم البعيدة ومجموعات الخوادم الموزعة متعددة العقد.",
    viewProfiles: "عرض ملفات التعريف",
    addRemoteServer: "إضافة خادم / مجموعة جديدة",
    exportConnections: "تصدير (Export)",
    importConnections: "استيراد (Import)",
    exportSuccess: "تم تصدير ملفات تعريف الاتصال بنجاح.",
    importSuccess: "تم استيراد ملفات تعريف الاتصال بنجاح.",
    importError: "فشل الاستيراد. هيكل ملف JSON غير صالح.",
    configureRemoteServer: "تكوين اتصال الخادم وهندسة النشر",
    vpsDetailsDesc: "أدخل تفاصيل الخادم. في الوضع الموزع، يمكنك تحديد خوادم منفصلة لـ Synapse وقاعدة البيانات وElement.",
    profileName: "اسم ملف التعريف / المجموعة *",
    deploymentMode: "هندسة النشر",
    standaloneMode: "خادم فردي (Standalone)",
    standaloneModeDesc: "جميع الخدمات (Synapse وقاعدة البيانات وElement) تعمل على خادم افتراضي واحد.",
    distributedMode: "مجموعة موزعة متعددة الخوادم (Distributed)",
    distributedModeDesc: "يعمل كل من Synapse وPostgreSQL وElement Web على خوادم منفصلة بعناوين IP وبيانات SSH مخصصة.",
    synapseNodeTab: "عقدة Synapse",
    databaseNodeTab: "عقدة قاعدة البيانات Postgres",
    elementNodeTab: "عقدة Element Web",
    hostIp: "المضيف / IP *",
    port: "منفذ SSH",
    sshUsername: "اسم مستخدم SSH *",
    authType: "نوع المصادقة",
    passwordLabel: "كلمة المرور",
    privateKeyLabel: "مفتاح SSH الخاص",
    sshPassword: "كلمة مرور SSH",
    sshPrivateKeyContent: "محتوى مفتاح SSH الخاص",
    servicePort: "منفذ الخدمة",
    copyFromSynapse: "نسخ بيانات الاعتماد من عقدة Synapse",
    copySuccess: "تم نسخ بيانات اعتماد SSH بنجاح.",
    showAdvanced: "عرض الإعدادات المتقدمة (PostgreSQL والمسارات)",
    hideAdvanced: "إخفاء الإعدادات المتقدمة (PostgreSQL والمسارات)",
    showAdminSettings: "عرض إعدادات توكن المسؤول",
    hideAdminSettings: "إخفاء إعدادات توكن المسؤول",
    adminTokenTitle: "توكن المسؤول وبيانات اعتماد ماتریکس",
    adminTokenDesc: "أدخل اسم مستخدم وكلمة مرور المسؤول أو قم بتوفير توكن وصول المسؤول لاستخدامه في واجهات برمجة تطبيقات إدارة Synapse.",
    adminUsernameLabel: "اسم مستخدم المسؤول",
    adminPasswordLabel: "كلمة مرور المسؤول",
    adminAccessTokenLabel: "توكن وصول المسؤول (اختياري)",
    cancel: "إلغاء",
    saveProfile: "حفظ ملف التعريف",
    loadingProfiles: "جاري تحميل ملفات التعريف...",
    noProfilesTitle: "لم يتم العثور على ملفات تعريف",
    noProfilesDesc: "لم تقم بتحديد أي ملفات تعريف اتصال.",
    activeServer: "الخادم النشط",
    connectionType: "نوع الاتصال:",
    internalSandbox: "بيئة حماية داخلية",
    remoteSsh: "اتصال SSH بعيد",
    distributedCluster: "مجموعة موزعة متعددة الخوادم",
    authMethod: "طريقة المصادقة:",
    sshPrivateKey: "مفتاح SSH الخاص",
    passwordCredentials: "بيانات اعتماد كلمة المرور",
    synapsePostgres: "بوستجرس ساينابس:",
    testSync: "اختبار المزامنة",
    testing: "جاري الاختبار...",
    connectedBadge: "متصل",
    detectDbBtn: "اكتشاف معلومات قاعدة البيانات",
    detectingDb: "جاري اكتشاف قاعدة البيانات...",
    detectDbNotice: "يتصل بخادم Synapse ويستخرج تلقائيًا معلومات قاعدة البيانات من homeserver.yaml.",
    detectDbSuccess: "تم اكتشاف معلمات قاعدة البيانات بنجاح!",
    detectDbMissingSSH: "يرجى إدخال مضيف SSH والمنفذ واسم المستخدم أولاً.",
    detectDbFailed: "فشل في اكتشاف معلومات قاعدة البيانات:",
    detectDbBadge: "استخراج تلقائي من خادم Synapse",
    testAllNodes: "اختبار اتصال المجموعة بالكامل",
    clusterTopology: "طوبولوجيا المجموعة",
    synapseServer: "عقدة Synapse",
    databaseServer: "عقدة قاعدة البيانات",
    elementServer: "عقدة Element Web"
  },
  de: {
    pageTitle: "Serververbindungen",
    pageSubtitle: "Lokale Umgebungen, Remote-VPS und verteilte Multi-Server-Cluster sicher über SSH verwalten.",
    viewProfiles: "Profile anzeigen",
    addRemoteServer: "Server / Cluster hinzufügen",
    exportConnections: "Verbindungen exportieren",
    importConnections: "Verbindungen importieren",
    exportSuccess: "Verbindungsprofile erfolgreich exportiert.",
    importSuccess: "Verbindungsprofile erfolgreich importiert.",
    importError: "Import fehlgeschlagen. Ungültige JSON-Dateistruktur.",
    configureRemoteServer: "Serververbindung & Architektur konfigurieren",
    vpsDetailsDesc: "Geben Sie die Serverdetails ein. Im verteilten Modus können Synapse, DB und Element separaten Knoten zugewiesen werden.",
    profileName: "Profil- / Clustername *",
    deploymentMode: "Bereitstellungsarchitektur",
    standaloneMode: "Einzelsystem (Standalone)",
    standaloneModeDesc: "Alle Dienste (Synapse, DB und Element) laufen gemeinsam auf einem einzigen VPS.",
    distributedMode: "Verteiltes Multi-Server-Cluster",
    distributedModeDesc: "Synapse, PostgreSQL und Element Web laufen auf separaten Servern mit dedizierten IPs und SSH-Zugangsdaten.",
    synapseNodeTab: "Synapse-Knoten",
    databaseNodeTab: "PostgreSQL-Knoten",
    elementNodeTab: "Element Web-Knoten",
    hostIp: "Host / IP *",
    port: "SSH-Port",
    sshUsername: "SSH-Benutzername *",
    authType: "Authentifizierungstyp",
    passwordLabel: "Passwort",
    privateKeyLabel: "SSH-Private-Key",
    sshPassword: "SSH-Passwort",
    sshPrivateKeyContent: "SSH-Private-Key-Inhalt",
    servicePort: "Dienst-Port",
    copyFromSynapse: "SSH-Zugangsdaten vom Synapse-Knoten kopieren",
    copySuccess: "SSH-Zugangsdaten erfolgreich kopiert.",
    showAdvanced: "Erweiterte Einstellungen anzeigen (PostgreSQL & Pfade)",
    hideAdvanced: "Erweiterte Einstellungen ausblenden (PostgreSQL & Pfade)",
    showAdminSettings: "Admin-Token-Einstellungen anzeigen",
    hideAdminSettings: "Admin-Token-Einstellungen ausblenden",
    adminTokenTitle: "Admin-Token & Matrix-Anmeldedaten",
    adminTokenDesc: "Geben Sie den Admin-Benutzernamen und das Passwort für Matrix Element Chat ein oder geben Sie ein Admin-Zugangs-Token für die Synapse-Admin-APIs an.",
    adminUsernameLabel: "Admin-Benutzername",
    adminPasswordLabel: "Admin-Passwort",
    adminAccessTokenLabel: "Admin-Zugangs-Token (Optional)",
    cancel: "Abbrechen",
    saveProfile: "Profil speichern",
    loadingProfiles: "Verbindungsprofile werden geladen...",
    noProfilesTitle: "Keine Profile gefunden",
    noProfilesDesc: "Sie haben keine Verbindungsprofile definiert.",
    activeServer: "Aktiver Server",
    connectionType: "Verbindungstyp:",
    internalSandbox: "Interne Sandbox",
    remoteSsh: "Remote-SSH",
    distributedCluster: "Verteiltes Multi-Server-Cluster",
    authMethod: "Authentifizierungsmethode:",
    sshPrivateKey: "SSH-Private-Key",
    passwordCredentials: "Passwort-Anmeldedaten",
    synapsePostgres: "Synapse-Postgres:",
    testSync: "Synchronisierung testen",
    testing: "Testen...",
    connectedBadge: "Verbunden",
    detectDbBtn: "DB-Informationen erkennen",
    detectingDb: "Erkenne DB-Informationen...",
    detectDbNotice: "Verbindet sich mit dem Synapse-Server und extrahiert automatisch DB-Parameter aus homeserver.yaml.",
    detectDbSuccess: "Datenbankparameter wurden erfolgreich erkannt!",
    detectDbMissingSSH: "Bitte geben Sie zuerst SSH-Host, Port und Anmeldedaten ein.",
    detectDbFailed: "Fehler beim Erkennen der Datenbankinformationen:",
    detectDbBadge: "Automatisch von Synapse extrahieren",
    testAllNodes: "Gesamte Cluster-Konnektivität testen",
    clusterTopology: "Cluster-Topologie-Übersicht",
    synapseServer: "Synapse-Knoten",
    databaseServer: "Postgres-Knoten",
    elementServer: "Element Web-Knoten"
  },
  ru: {
    pageTitle: "Подключения к серверам",
    pageSubtitle: "Управление и переключение между локальными средами, автономными VPS и распределенными кластерами.",
    viewProfiles: "Просмотр профилей",
    addRemoteServer: "Добавить сервер / кластер",
    exportConnections: "Экспорт подключений",
    importConnections: "Импорт подключений",
    exportSuccess: "Профили подключения успешно экспортированы.",
    importSuccess: "Профили подключения успешно импортированы.",
    importError: "Ошибка импорта. Недействительная структура JSON-файла.",
    configureRemoteServer: "Настройка подключения сервера и архитектуры",
    vpsDetailsDesc: "Укажите данные серверов. В распределенном режиме вы можете выделить Synapse, БД и Element на отдельные узлы.",
    profileName: "Имя профиля / кластера *",
    deploymentMode: "Архитектура развертывания",
    standaloneMode: "Один сервер (Standalone)",
    standaloneModeDesc: "Все сервисы (Synapse, БД и Element) работают совместно на одном VPS.",
    distributedMode: "Распределенный кластер (Distributed)",
    distributedModeDesc: "Synapse, PostgreSQL и Element Web размещены на разных серверах с индивидуальными IP и SSH-ключами.",
    synapseNodeTab: "Узел Synapse",
    databaseNodeTab: "Узел базы данных Postgres",
    elementNodeTab: "Узел Element Web",
    hostIp: "Хост / IP *",
    port: "SSH-порт",
    sshUsername: "Имя пользователя SSH *",
    authType: "Тип аутентификации",
    passwordLabel: "Пароль",
    privateKeyLabel: "Закрытый SSH-ключ",
    sshPassword: "Пароль SSH",
    sshPrivateKeyContent: "Содержимое закрытого SSH-ключа",
    servicePort: "Порт службы",
    copyFromSynapse: "Скопировать данные SSH из узла Synapse",
    copySuccess: "Данные SSH успешно скопированы.",
    showAdvanced: "Показать дополнительные настройки (PostgreSQL и пути)",
    hideAdvanced: "Скрыть дополнительные настройки (PostgreSQL и пути)",
    showAdminSettings: "Показать настройки токена администратора",
    hideAdminSettings: "Скрыть настройки токена администратора",
    adminTokenTitle: "Токен администратора и учетные данные Matrix",
    adminTokenDesc: "Введите имя пользователя и пароль администратора для Matrix Element Chat или укажите токен доступа администратора.",
    adminUsernameLabel: "Имя пользователя админа",
    adminPasswordLabel: "Пароль админа",
    adminAccessTokenLabel: "Токен доступа администратора (опционально)",
    cancel: "Отмена",
    saveProfile: "Сохранить профиль",
    loadingProfiles: "Загрузка профилей...",
    noProfilesTitle: "Профили не найдены",
    noProfilesDesc: "Вы еще не создали ни одного профиля подключения.",
    activeServer: "Активный сервер",
    connectionType: "Тип подключения:",
    internalSandbox: "Локальная песочница",
    remoteSsh: "Удаленный SSH",
    distributedCluster: "Распределенный кластер",
    authMethod: "Способ аутентификации:",
    sshPrivateKey: "Закрытый SSH-ключ",
    passwordCredentials: "Вход по паролю",
    synapsePostgres: "Synapse Postgres:",
    testSync: "Тест синхронизации",
    testing: "Тестирование...",
    connectedBadge: "Подключено",
    detectDbBtn: "Определить данные БД",
    detectingDb: "Определение данных БД...",
    detectDbNotice: "Подключается к серверу Synapse и автоматически извлекает параметры БД из homeserver.yaml.",
    detectDbSuccess: "Параметры базы данных успешно определены!",
    detectDbMissingSSH: "Пожалуйста, сначала введите хост SSH, порт и учетные данные.",
    detectDbFailed: "Не удалось определить информацию о базе данных:",
    detectDbBadge: "Авто-извлечение из узла Synapse",
    testAllNodes: "Проверить подключение всего кластера",
    clusterTopology: "Топология кластера",
    synapseServer: "Узел Synapse",
    databaseServer: "Узел Postgres",
    elementServer: "Узел Element Web"
  }
};

export default function ConnectionManager({ 
  authToken, 
  onProfileChanged, 
  showToast, 
  isLightMode = false,
  lang = 'en'
}: ConnectionManagerProps) {
  const t = connTranslations[lang] || connTranslations.en;
  const [profiles, setProfiles] = useState<ConnectionProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { 
    success: boolean; 
    ssh: boolean; 
    db: boolean; 
    api?: boolean; 
    error?: string;
    clusterNodes?: Array<{ role: string; host: string; ssh: boolean; error?: string }>;
  }>>({});

  // Active form tab for distributed mode
  const [activeNodeTab, setActiveNodeTab] = useState<'synapse' | 'database' | 'element'>('synapse');

  // Form State: Profile & Deployment Mode
  const [name, setName] = useState('');
  const [deploymentMode, setDeploymentMode] = useState<'standalone' | 'distributed'>('standalone');

  // Standalone / Primary Synapse Node Form State
  const [host, setHost] = useState('');
  const [port, setPort] = useState(22);
  const [username, setUsername] = useState('root');
  const [authType, setAuthType] = useState<'password' | 'key'>('password');
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [servicePort, setServicePort] = useState(8008);

  // Distributed Database Node Form State
  const [dbNodeHost, setDbNodeHost] = useState('');
  const [dbNodePort, setDbNodePort] = useState(22);
  const [dbNodeUsername, setDbNodeUsername] = useState('root');
  const [dbNodeAuthType, setDbNodeAuthType] = useState<'password' | 'key'>('password');
  const [dbNodePassword, setDbNodePassword] = useState('');
  const [dbNodePrivateKey, setDbNodePrivateKey] = useState('');
  const [dbNodeServicePort, setDbNodeServicePort] = useState(5432);

  // Distributed Element Web Node Form State
  const [elemNodeHost, setElemNodeHost] = useState('');
  const [elemNodePort, setElemNodePort] = useState(22);
  const [elemNodeUsername, setElemNodeUsername] = useState('root');
  const [elemNodeAuthType, setElemNodeAuthType] = useState<'password' | 'key'>('password');
  const [elemNodePassword, setElemNodePassword] = useState('');
  const [elemNodePrivateKey, setElemNodePrivateKey] = useState('');
  const [elemNodeServicePort, setElemNodeServicePort] = useState(80);
  const [elemNodeWebPath, setElemNodeWebPath] = useState('/var/www/element');

  // Advanced DB Settings
  const [dbHost, setDbHost] = useState('localhost');
  const [dbPort, setDbPort] = useState(5432);
  const [dbName, setDbName] = useState('synapse');
  const [dbUser, setDbUser] = useState('synapse_user');
  const [dbPass, setDbPass] = useState('');

  // Paths
  const [configPath, setConfigPath] = useState('/etc/matrix-stack.conf');
  const [homeserverYamlPath, setHomeserverYamlPath] = useState('/etc/matrix-synapse/homeserver.yaml');
  const [elementConfigPath, setElementConfigPath] = useState('/var/www/element/config.json');
  const [homeserverLogPath, setHomeserverLogPath] = useState('/var/log/matrix-synapse/homeserver.log');

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isTestingForm, setIsTestingForm] = useState(false);
  const [formTestResult, setFormTestResult] = useState<{ 
    success: boolean; 
    ssh: boolean; 
    db: boolean; 
    api?: boolean; 
    error?: string;
    clusterNodes?: Array<{ role: string; host: string; ssh: boolean; error?: string }>;
  } | null>(null);

  // Admin Credentials Form State
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAccessToken, setAdminAccessToken] = useState('');

  // Database Auto-Detection State
  const [isDetectingDb, setIsDetectingDb] = useState(false);
  const [dbDetectionMessage, setDbDetectionMessage] = useState<{ type: 'success' | 'error'; text: string; details?: string } | null>(null);

  const fetchProfiles = () => {
    if (!authToken || authToken === 'null' || authToken === 'undefined') return;
    setIsLoading(true);
    fetch('/api/connections', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch connection profiles");
      return res.json();
    })
    .then(data => {
      setProfiles(data);
      setIsLoading(false);
    })
    .catch(err => {
      showToast('error', err.message);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (authToken && authToken !== 'null' && authToken !== 'undefined') {
      fetchProfiles();
    }
  }, [authToken]);

  const handleCopyCredentialsToDbNode = () => {
    setDbNodePort(port);
    setDbNodeUsername(username);
    setDbNodeAuthType(authType);
    setDbNodePassword(password);
    setDbNodePrivateKey(privateKey);
    showToast('success', t.copySuccess);
  };

  const handleCopyCredentialsToElemNode = () => {
    setElemNodePort(port);
    setElemNodeUsername(username);
    setElemNodeAuthType(authType);
    setElemNodePassword(password);
    setElemNodePrivateKey(privateKey);
    showToast('success', t.copySuccess);
  };

  const handleDetectDbInfo = async () => {
    setDbDetectionMessage(null);
    
    if (deploymentMode === 'distributed') {
      const hasDbCredentials = !!dbNodeHost?.trim();
      const hasSynapseCredentials = !!host?.trim();
      if (!hasDbCredentials && !hasSynapseCredentials) {
        setDbDetectionMessage({
          type: 'error',
          text: (t as any).detectDbMissingDistributedSSH || "Please enter the SSH details for PostgreSQL DB Node or Synapse Node first."
        });
        return;
      }
    } else {
      if (!host || !host.trim()) {
        setDbDetectionMessage({
          type: 'error',
          text: (t as any).detectDbMissingSSH || "Please enter SSH Host, Port, and Username first."
        });
        return;
      }

      if (authType === 'password' && !password) {
        setDbDetectionMessage({
          type: 'error',
          text: (t as any).detectDbMissingSSH || "Please enter the SSH password first."
        });
        return;
      }

      if (authType === 'key' && !privateKey) {
        setDbDetectionMessage({
          type: 'error',
          text: (t as any).detectDbMissingSSH || "Please enter the SSH Private Key first."
        });
        return;
      }
    }

    setIsDetectingDb(true);
    try {
      const synapseNode: ServerNodeConfig = {
        host: host.trim(),
        port: Number(port) || 22,
        username: username.trim(),
        authType,
        password: authType === 'password' ? password : '',
        privateKey: authType === 'key' ? privateKey : '',
        servicePort: Number(servicePort) || 8008,
        configPath: homeserverYamlPath
      };

      let databaseNode: ServerNodeConfig | undefined = undefined;
      if (deploymentMode === 'distributed') {
        databaseNode = {
          host: dbNodeHost.trim() || dbHost.trim() || host.trim(),
          port: Number(dbNodePort) || 22,
          username: dbNodeUsername.trim() || 'root',
          authType: dbNodeAuthType,
          password: dbNodeAuthType === 'password' ? dbNodePassword : '',
          privateKey: dbNodeAuthType === 'key' ? dbNodePrivateKey : '',
          servicePort: Number(dbNodeServicePort) || 5432,
          dbName,
          dbUser,
          dbPass
        };
      }

      let elementNode: ServerNodeConfig | undefined = undefined;
      if (deploymentMode === 'distributed') {
        elementNode = {
          host: elemNodeHost.trim() || host.trim(),
          port: Number(elemNodePort) || 22,
          username: elemNodeUsername.trim() || 'root',
          authType: elemNodeAuthType,
          password: elemNodeAuthType === 'password' ? elemNodePassword : '',
          privateKey: elemNodeAuthType === 'key' ? elemNodePrivateKey : '',
          servicePort: Number(elemNodeServicePort) || 80,
          webPath: elemNodeWebPath
        };
      }

      const res = await fetch('/api/connections/detect-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          id: editingId || undefined,
          deploymentMode,
          host: host.trim(),
          port: port || 22,
          username: username.trim(),
          authType,
          password: password || undefined,
          privateKey: privateKey || undefined,
          synapseNode,
          databaseNode,
          elementNode,
          dbHost: deploymentMode === 'distributed' && dbNodeHost ? dbNodeHost.trim() : (dbHost.trim() || 'localhost'),
          dbPort,
          dbName,
          dbUser,
          dbPass,
          homeserverYamlPath: homeserverYamlPath.trim() || undefined,
          configPath: configPath.trim() || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDbHost(data.dbHost || '127.0.0.1');
        setDbPort(Number(data.dbPort) || 5432);
        setDbName(data.dbName || 'synapse');
        setDbUser(data.dbUser || 'synapse_user');
        if (data.dbPass) {
          setDbPass(data.dbPass);
        }
        if (deploymentMode === 'distributed' && data.dbHost && data.dbHost !== '127.0.0.1' && data.dbHost !== 'localhost') {
          setDbNodeHost(data.dbHost);
        }
        setShowAdvanced(true);
        const nodeDetailList = Array.isArray(data.checkedNodes) 
          ? ` (${data.checkedNodes.map((n: any) => `${n.role}: ${n.ok ? '✓' : '✗'}`).join(' • ')})`
          : '';
        setDbDetectionMessage({
          type: 'success',
          text: (t as any).detectDbSuccess || "Database parameters successfully detected!",
          details: `${data.dbUser}@${data.dbHost}:${data.dbPort}/${data.dbName} [Source: ${data.source || 'homeserver.yaml'}]${data.dbVerified ? ' • Live PostgreSQL Verified ✓' : ''}${nodeDetailList}`
        });
      } else {
        setDbDetectionMessage({
          type: 'error',
          text: ((t as any).detectDbFailed || "Failed to detect database parameters:") + " " + (data.error || data.message || "Unknown error")
        });
      }
    } catch (err: any) {
      setDbDetectionMessage({
        type: 'error',
        text: ((t as any).detectDbFailed || "Failed to detect database parameters:") + " " + (err.message || String(err))
      });
    } finally {
      setIsDetectingDb(false);
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !host || !username) {
      showToast('error', 'Please fill in all required fields.');
      return;
    }

    const synapseNode: ServerNodeConfig = {
      host: host.trim(),
      port: Number(port) || 22,
      username: username.trim(),
      authType,
      password: authType === 'password' ? password : '',
      privateKey: authType === 'key' ? privateKey : '',
      servicePort: Number(servicePort) || 8008,
      configPath: homeserverYamlPath
    };

    let databaseNode: ServerNodeConfig | undefined = undefined;
    if (deploymentMode === 'distributed') {
      databaseNode = {
        host: (dbNodeHost.trim() || dbHost.trim() || host.trim()),
        port: Number(dbNodePort) || 22,
        username: dbNodeUsername.trim() || 'root',
        authType: dbNodeAuthType,
        password: dbNodeAuthType === 'password' ? dbNodePassword : '',
        privateKey: dbNodeAuthType === 'key' ? dbNodePrivateKey : '',
        servicePort: Number(dbNodeServicePort) || 5432,
        dbName: dbName.trim() || 'synapse',
        dbUser: dbUser.trim() || 'synapse_user',
        dbPass: dbPass
      };
    }

    let elementNode: ServerNodeConfig | undefined = undefined;
    if (deploymentMode === 'distributed') {
      elementNode = {
        host: (elemNodeHost.trim() || host.trim()),
        port: Number(elemNodePort) || 22,
        username: elemNodeUsername.trim() || 'root',
        authType: elemNodeAuthType,
        password: elemNodeAuthType === 'password' ? elemNodePassword : '',
        privateKey: elemNodeAuthType === 'key' ? elemNodePrivateKey : '',
        servicePort: Number(elemNodeServicePort) || 80,
        webPath: elemNodeWebPath.trim() || '/var/www/element',
        configPath: elementConfigPath
      };
    }

    const payload: Partial<ConnectionProfile> = {
      name: name.trim(),
      deploymentMode,
      host: host.trim(),
      port: Number(port) || 22,
      username: username.trim(),
      authType,
      password: authType === 'password' ? password : '',
      privateKey: authType === 'key' ? privateKey : '',
      synapseNode,
      databaseNode,
      elementNode,
      dbHost: deploymentMode === 'distributed' && dbNodeHost ? dbNodeHost.trim() : (dbHost.trim() || 'localhost'),
      dbPort: Number(dbPort) || 5432,
      dbName: dbName.trim() || 'synapse',
      dbUser: dbUser.trim() || 'synapse_user',
      dbPass,
      configPath,
      homeserverYamlPath,
      elementConfigPath,
      homeserverLogPath,
      adminUsername: adminUsername.trim(),
      adminPassword,
      adminAccessToken: adminAccessToken.trim(),
    };

    const url = editingId ? `/api/connections/${editingId}` : '/api/connections';
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error(editingId ? "Failed to update connection profile" : "Failed to create connection profile");
      return res.json();
    })
    .then(() => {
      showToast('success', editingId ? 'Connection Profile updated successfully!' : 'Connection Profile created successfully!');
      setShowForm(false);
      resetForm();
      fetchProfiles();
      onProfileChanged();
    })
    .catch(err => {
      showToast('error', err.message);
    });
  };

  const handleEditProfile = (profile: ConnectionProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(profile.id);
    setName(profile.name || '');
    setDeploymentMode(profile.deploymentMode || (profile.synapseNode || profile.databaseNode || profile.elementNode ? 'distributed' : 'standalone'));
    
    // Synapse Node / Primary
    const synNode = profile.synapseNode || profile;
    setHost(synNode.host || profile.host || '');
    setPort(synNode.port || profile.port || 22);
    setUsername(synNode.username || profile.username || 'root');
    setAuthType(synNode.authType || profile.authType || 'password');
    setPassword(synNode.password || profile.password || '');
    setPrivateKey(synNode.privateKey || profile.privateKey || '');
    setServicePort(synNode.servicePort || 8008);

    // Database Node
    const dbNode = profile.databaseNode;
    if (dbNode) {
      setDbNodeHost(dbNode.host || '');
      setDbNodePort(dbNode.port || 22);
      setDbNodeUsername(dbNode.username || 'root');
      setDbNodeAuthType(dbNode.authType || 'password');
      setDbNodePassword(dbNode.password || '');
      setDbNodePrivateKey(dbNode.privateKey || '');
      setDbNodeServicePort(dbNode.servicePort || 5432);
    } else {
      setDbNodeHost(profile.dbHost || '');
      setDbNodePort(22);
      setDbNodeUsername('root');
      setDbNodeAuthType('password');
      setDbNodePassword('');
      setDbNodePrivateKey('');
      setDbNodeServicePort(5432);
    }

    // Element Node
    const elemNode = profile.elementNode;
    if (elemNode) {
      setElemNodeHost(elemNode.host || '');
      setElemNodePort(elemNode.port || 22);
      setElemNodeUsername(elemNode.username || 'root');
      setElemNodeAuthType(elemNode.authType || 'password');
      setElemNodePassword(elemNode.password || '');
      setElemNodePrivateKey(elemNode.privateKey || '');
      setElemNodeServicePort(elemNode.servicePort || 80);
      setElemNodeWebPath(elemNode.webPath || '/var/www/element');
    } else {
      setElemNodeHost('');
      setElemNodePort(22);
      setElemNodeUsername('root');
      setElemNodeAuthType('password');
      setElemNodePassword('');
      setElemNodePrivateKey('');
      setElemNodeServicePort(80);
      setElemNodeWebPath('/var/www/element');
    }

    setDbHost(profile.dbHost || 'localhost');
    setDbPort(profile.dbPort || 5432);
    setDbName(profile.dbName || 'synapse');
    setDbUser(profile.dbUser || 'synapse_user');
    setDbPass(profile.dbPass || '');
    setConfigPath(profile.configPath || '/etc/matrix-stack.conf');
    setHomeserverYamlPath(profile.homeserverYamlPath || '/etc/matrix-synapse/homeserver.yaml');
    setElementConfigPath(profile.elementConfigPath || '/var/www/element/config.json');
    setHomeserverLogPath(profile.homeserverLogPath || '/var/log/matrix-synapse/homeserver.log');
    setAdminUsername(profile.adminUsername || '');
    setAdminPassword(profile.adminPassword || '');
    setAdminAccessToken(profile.adminAccessToken || '');
    setShowForm(true);
  };

  const handleSelectProfile = (id: string) => {
    fetch('/api/connections/select', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ id })
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to activate connection profile");
      return res.json();
    })
    .then(() => {
      showToast('success', `Active connection switched successfully! Reloading panel data...`);
      fetchProfiles();
      onProfileChanged();
    })
    .catch(err => {
      showToast('error', err.message);
    });
  };

  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === 'local') {
      showToast('error', 'Cannot delete the local system profile.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this connection profile?')) return;

    fetch(`/api/connections/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to delete connection profile");
      return res.json();
    })
    .then(() => {
      showToast('success', 'Profile deleted successfully.');
      fetchProfiles();
    })
    .catch(err => {
      showToast('error', err.message);
    });
  };

  const handleTestProfile = (profile: ConnectionProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    setTestingId(profile.id);
    setTestResults(prev => ({ ...prev, [profile.id]: undefined as any }));

    fetch('/api/connections/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(profile)
    })
    .then(res => {
      if (!res.ok) throw new Error("Connection test failed");
      return res.json();
    })
    .then(data => {
      setTestResults(prev => ({
        ...prev,
        [profile.id]: {
          success: data.ssh && data.db && data.api,
          ssh: data.ssh,
          db: data.db,
          api: data.api,
          error: data.dbError || data.apiError || data.error,
          clusterNodes: data.clusterNodes
        }
      }));
      setTestingId(null);
      if (data.adminAccessToken) {
        setAdminAccessToken(data.adminAccessToken);
      }
      if (data.ssh && data.db && data.api) {
        showToast('success', `All services & cluster nodes for ${profile.name} are fully healthy!`);
      } else if (data.ssh && data.db && !data.api) {
        showToast('error', `SSH and Database are active, but Matrix API test failed: ${data.apiError || 'API unreachable'}`);
      } else if (data.ssh && !data.db) {
        showToast('error', `SSH is active, but Database connection failed: ${data.dbError}`);
      } else {
        showToast('error', `Failed to connect over SSH to ${profile.name}`);
      }
    })
    .catch(err => {
      setTestResults(prev => ({
        ...prev,
        [profile.id]: {
          success: false,
          ssh: false,
          db: false,
          api: false,
          error: err.message
        }
      }));
      setTestingId(null);
      showToast('error', `Connection handshake failed: ${err.message}`);
    });
  };

  const handleTestCurrentForm = () => {
    if (!host) {
      showToast('error', 'Please enter a Host / IP address before testing connection.');
      return;
    }
    setIsTestingForm(true);
    setFormTestResult(null);

    const synapseNode: ServerNodeConfig = {
      host: host.trim(),
      port: Number(port) || 22,
      username: username.trim(),
      authType,
      password: authType === 'password' ? password : '',
      privateKey: authType === 'key' ? privateKey : '',
      servicePort: Number(servicePort) || 8008
    };

    let databaseNode: ServerNodeConfig | undefined = undefined;
    if (deploymentMode === 'distributed') {
      databaseNode = {
        host: dbNodeHost.trim() || dbHost.trim() || host.trim(),
        port: Number(dbNodePort) || 22,
        username: dbNodeUsername.trim() || 'root',
        authType: dbNodeAuthType,
        password: dbNodeAuthType === 'password' ? dbNodePassword : '',
        privateKey: dbNodeAuthType === 'key' ? dbNodePrivateKey : '',
        servicePort: Number(dbNodeServicePort) || 5432,
        dbName,
        dbUser,
        dbPass
      };
    }

    let elementNode: ServerNodeConfig | undefined = undefined;
    if (deploymentMode === 'distributed') {
      elementNode = {
        host: elemNodeHost.trim() || host.trim(),
        port: Number(elemNodePort) || 22,
        username: elemNodeUsername.trim() || 'root',
        authType: elemNodeAuthType,
        password: elemNodeAuthType === 'password' ? elemNodePassword : '',
        privateKey: elemNodeAuthType === 'key' ? elemNodePrivateKey : '',
        servicePort: Number(elemNodeServicePort) || 80,
        webPath: elemNodeWebPath
      };
    }

    const tempProfile: any = {
      id: editingId || 'temp-test',
      name: name || 'Test Server',
      deploymentMode,
      host,
      port,
      username,
      authType,
      password,
      privateKey,
      synapseNode,
      databaseNode,
      elementNode,
      dbHost: deploymentMode === 'distributed' && dbNodeHost ? dbNodeHost.trim() : (dbHost.trim() || 'localhost'),
      dbPort,
      dbName,
      dbUser,
      dbPass,
      configPath,
      homeserverYamlPath,
      elementConfigPath,
      homeserverLogPath,
      adminUsername,
      adminPassword,
      adminAccessToken,
    };

    fetch('/api/connections/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(tempProfile)
    })
    .then(res => res.json())
    .then(data => {
      const isSuccess = data.ssh && data.db && data.api;
      setFormTestResult({
        success: isSuccess,
        ssh: data.ssh,
        db: data.db,
        api: data.api,
        error: data.dbError || data.apiError || data.error,
        clusterNodes: data.clusterNodes
      });
      setIsTestingForm(false);
      if (isSuccess) {
        showToast('success', 'All cluster nodes, Database, and Matrix API tests passed!');
      } else if (data.ssh && !data.db) {
        showToast('error', `SSH connected, but Database test failed: ${data.dbError || 'Authentication failed'}`);
      } else if (data.ssh && data.db && !data.api) {
        showToast('error', `SSH & DB connected, but Matrix API test failed: ${data.apiError || 'API unreachable'}`);
      } else {
        showToast('error', `SSH connection failed: ${data.error || 'Server unreachable'}`);
      }
    })
    .catch(err => {
      setFormTestResult({
        success: false,
        ssh: false,
        db: false,
        api: false,
        error: err.message
      });
      setIsTestingForm(false);
      showToast('error', `Connection test failed: ${err.message}`);
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportProfiles = () => {
    if (profiles.length === 0) {
      showToast('error', 'No connection profiles available to export.');
      return;
    }
    const remoteProfiles = profiles.filter(p => p.id !== 'local');
    if (remoteProfiles.length === 0) {
      showToast('error', 'No remote server connection profiles to export.');
      return;
    }

    const exportData = JSON.stringify(remoteProfiles, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `matrix-server-connections-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('success', t.exportSuccess || 'Connection profiles exported successfully.');
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      const items = Array.isArray(importedData) ? importedData : [importedData];
      const validProfiles = items.filter((item: any) => item && typeof item === 'object' && item.name && (item.host || item.synapseNode));

      if (validProfiles.length === 0) {
        showToast('error', t.importError || 'Invalid JSON file structure.');
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (const profile of validProfiles) {
        try {
          const res = await fetch('/api/connections', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(profile)
          });

          if (res.ok) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          failCount++;
        }
      }

      if (successCount > 0) {
        showToast('success', `${successCount} ${t.importSuccess || 'Connection profiles imported successfully.'}`);
        fetchProfiles();
        onProfileChanged();
      } else {
        showToast('error', t.importError || 'Failed to import connection profiles.');
      }
    } catch (err: any) {
      showToast('error', (t.importError || 'Error parsing JSON file: ') + err.message);
    }
  };

  const resetForm = () => {
    setName('');
    setDeploymentMode('standalone');
    setHost('');
    setPort(22);
    setUsername('root');
    setAuthType('password');
    setPassword('');
    setPrivateKey('');
    setServicePort(8008);

    setDbNodeHost('');
    setDbNodePort(22);
    setDbNodeUsername('root');
    setDbNodeAuthType('password');
    setDbNodePassword('');
    setDbNodePrivateKey('');
    setDbNodeServicePort(5432);

    setElemNodeHost('');
    setElemNodePort(22);
    setElemNodeUsername('root');
    setElemNodeAuthType('password');
    setElemNodePassword('');
    setElemNodePrivateKey('');
    setElemNodeServicePort(80);
    setElemNodeWebPath('/var/www/element');

    setDbHost('localhost');
    setDbPort(5432);
    setDbName('synapse');
    setDbUser('synapse_user');
    setDbPass('');
    setConfigPath('/etc/matrix-stack.conf');
    setHomeserverYamlPath('/etc/matrix-synapse/homeserver.yaml');
    setElementConfigPath('/var/www/element/config.json');
    setHomeserverLogPath('/var/log/matrix-synapse/homeserver.log');
    setAdminUsername('');
    setAdminPassword('');
    setAdminAccessToken('');
    setDbDetectionMessage(null);
    setShowAdminSettings(false);
    setShowAdvanced(false);
    setEditingId(null);
    setFormTestResult(null);
    setActiveNodeTab('synapse');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="spatial-glass rounded-3xl p-6 border border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/10">
              <Network className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white tracking-tight">{t.pageTitle}</h1>
              <p className="text-xs text-slate-400 mt-1">
                {t.pageSubtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            type="button"
            onClick={handleExportProfiles}
            title={t.exportConnections}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 font-bold text-xs transition-all duration-300"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>{t.exportConnections}</span>
          </button>

          <button
            type="button"
            onClick={handleImportClick}
            title={t.importConnections}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 font-bold text-xs transition-all duration-300"
          >
            <Upload className="w-4 h-4 text-teal-400" />
            <span>{t.importConnections}</span>
          </button>

          <button
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                resetForm();
              } else {
                resetForm();
                setShowForm(true);
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            {showForm ? t.viewProfiles : t.addRemoteServer}
          </button>
        </div>
      </div>

      {showForm ? (
        /* Create / Edit Connection Form */
        <form onSubmit={handleCreateProfile} className="spatial-glass rounded-3xl p-6 border border-white/5 space-y-6 max-w-4xl mx-auto">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-400" />
              {t.configureRemoteServer}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t.vpsDetailsDesc}
            </p>
          </div>

          {/* Profile Name & Deployment Architecture Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">{t.profileName}</label>
              <input
                type="text"
                placeholder="e.g. Tehran Production Cluster"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
              />
            </div>

            {/* Architecture Mode Selector */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">{t.deploymentMode}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  onClick={() => setDeploymentMode('standalone')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    deploymentMode === 'standalone'
                      ? 'bg-teal-500/15 border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.15)] ring-1 ring-teal-500/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl ${deploymentMode === 'standalone' ? 'bg-teal-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{t.standaloneMode}</h4>
                      <span className="text-[11px] text-teal-300 font-mono">1 Server VPS</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {t.standaloneModeDesc}
                  </p>
                </div>

                <div 
                  onClick={() => setDeploymentMode('distributed')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    deploymentMode === 'distributed'
                      ? 'bg-indigo-500/15 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl ${deploymentMode === 'distributed' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                      <Network className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{t.distributedMode}</h4>
                      <span className="text-[11px] text-indigo-300 font-mono">3 Independent Nodes</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {t.distributedModeDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Distributed Node Selector Tabs (when in distributed mode) */}
          {deploymentMode === 'distributed' && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Network className="w-4 h-4 text-indigo-400" />
                  Configure Cluster Server Nodes
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Separate IPs, SSH credentials & ports
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-black/20 border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveNodeTab('synapse')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    activeNodeTab === 'synapse'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400/50'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  <span>{t.synapseNodeTab}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNodeTab('database')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    activeNodeTab === 'database'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400/50'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>{t.databaseNodeTab}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNodeTab('element')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    activeNodeTab === 'element'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/50'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>{t.elementNodeTab}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: SYNAPSE HOMESERVER NODE */}
          {(deploymentMode === 'standalone' || activeNodeTab === 'synapse') && (
            <div className="space-y-5 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  {deploymentMode === 'distributed' ? 'Synapse Homeserver Server (Host / SSH)' : 'Server SSH Connection'}
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Port 8008 Matrix API & SSH
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="grid grid-cols-3 gap-3 md:col-span-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-2">{t.hostIp}</label>
                    <input
                      type="text"
                      placeholder="e.g. 192.168.1.50 or synapse.domain.com"
                      value={host}
                      onChange={e => setHost(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">{t.port}</label>
                    <input
                      type="number"
                      placeholder="22"
                      value={port}
                      onChange={e => setPort(parseInt(e.target.value) || 22)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">{t.sshUsername}</label>
                  <input
                    type="text"
                    placeholder="root"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">{t.authType}</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setAuthType('password')}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        authType === 'password'
                          ? 'bg-teal-500/10 border-teal-500 text-teal-400'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {t.passwordLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthType('key')}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        authType === 'key'
                          ? 'bg-teal-500/10 border-teal-500 text-teal-400'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {t.privateKeyLabel}
                    </button>
                  </div>
                </div>

                {authType === 'password' ? (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-2">{t.sshPassword}</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
                      />
                      <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-2">{t.sshPrivateKeyContent}</label>
                    <textarea
                      placeholder="-----BEGIN OPENSSH PRIVATE KEY-----\n...\n-----END OPENSSH PRIVATE KEY-----"
                      value={privateKey}
                      onChange={e => setPrivateKey(e.target.value)}
                      className="w-full h-28 bg-white border border-slate-300 rounded-xl p-4 text-xs font-mono text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: POSTGRESQL DATABASE NODE */}
          {deploymentMode === 'distributed' && activeNodeTab === 'database' && (
            <div className="space-y-5 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  PostgreSQL Database Server (Host / SSH & Port 5432)
                </h4>
                <button
                  type="button"
                  onClick={handleCopyCredentialsToDbNode}
                  className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-bold bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/20"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {t.copyFromSynapse}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="grid grid-cols-3 gap-3 md:col-span-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-2">DB Server Host / IP *</label>
                    <input
                      type="text"
                      placeholder="e.g. 192.168.1.60 or db.internal.lan"
                      value={dbNodeHost}
                      onChange={e => {
                        setDbNodeHost(e.target.value);
                        setDbHost(e.target.value);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">{t.port}</label>
                    <input
                      type="number"
                      placeholder="22"
                      value={dbNodePort}
                      onChange={e => setDbNodePort(parseInt(e.target.value) || 22)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">SSH Username (DB Node)</label>
                  <input
                    type="text"
                    placeholder="root"
                    value={dbNodeUsername}
                    onChange={e => setDbNodeUsername(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">DB Node Auth Type</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setDbNodeAuthType('password')}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        dbNodeAuthType === 'password'
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {t.passwordLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDbNodeAuthType('key')}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        dbNodeAuthType === 'key'
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {t.privateKeyLabel}
                    </button>
                  </div>
                </div>

                {dbNodeAuthType === 'password' ? (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-2">SSH Password (DB Node)</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={dbNodePassword}
                        onChange={e => setDbNodePassword(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
                      />
                      <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-2">SSH Private Key (DB Node)</label>
                    <textarea
                      placeholder="-----BEGIN OPENSSH PRIVATE KEY-----\n...\n-----END OPENSSH PRIVATE KEY-----"
                      value={dbNodePrivateKey}
                      onChange={e => setDbNodePrivateKey(e.target.value)}
                      className="w-full h-28 bg-white border border-slate-300 rounded-xl p-4 text-xs font-mono text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ELEMENT WEB CLIENT NODE */}
          {deploymentMode === 'distributed' && activeNodeTab === 'element' && (
            <div className="space-y-5 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Element Web Server (Host / SSH & Nginx Web Server)
                </h4>
                <button
                  type="button"
                  onClick={handleCopyCredentialsToElemNode}
                  className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-bold bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/20"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {t.copyFromSynapse}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="grid grid-cols-3 gap-3 md:col-span-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Element Web Host / IP *</label>
                    <input
                      type="text"
                      placeholder="e.g. 192.168.1.70 or chat.domain.com"
                      value={elemNodeHost}
                      onChange={e => setElemNodeHost(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">{t.port}</label>
                    <input
                      type="number"
                      placeholder="22"
                      value={elemNodePort}
                      onChange={e => setElemNodePort(parseInt(e.target.value) || 22)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">SSH Username (Element Node)</label>
                  <input
                    type="text"
                    placeholder="root"
                    value={elemNodeUsername}
                    onChange={e => setElemNodeUsername(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Element Node Auth Type</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setElemNodeAuthType('password')}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        elemNodeAuthType === 'password'
                          ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {t.passwordLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => setElemNodeAuthType('key')}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        elemNodeAuthType === 'key'
                          ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {t.privateKeyLabel}
                    </button>
                  </div>
                </div>

                {elemNodeAuthType === 'password' ? (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-2">SSH Password (Element Node)</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={elemNodePassword}
                        onChange={e => setElemNodePassword(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
                      />
                      <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-2">SSH Private Key (Element Node)</label>
                    <textarea
                      placeholder="-----BEGIN OPENSSH PRIVATE KEY-----\n...\n-----END OPENSSH PRIVATE KEY-----"
                      value={elemNodePrivateKey}
                      onChange={e => setElemNodePrivateKey(e.target.value)}
                      className="w-full h-28 bg-white border border-slate-300 rounded-xl p-4 text-xs font-mono text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-400"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Smart Detect DB Info Banner */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isLightMode 
              ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200 shadow-sm' 
              : 'bg-gradient-to-r from-teal-950/30 to-emerald-950/20 border-teal-500/20 shadow-lg'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl border mt-0.5 shrink-0 ${
                  isLightMode 
                    ? 'bg-teal-100 text-teal-700 border-teal-300' 
                    : 'bg-teal-500/10 text-teal-400 border-teal-500/20 shadow-inner'
                }`}>
                  <Database className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                      {(t as any).detectDbBtn}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border flex items-center gap-1 ${
                      isLightMode 
                        ? 'bg-teal-100 text-teal-800 border-teal-200' 
                        : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                    }`}>
                      <Sparkles className="w-3 h-3 text-teal-400" />
                      {(t as any).detectDbBadge}
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed max-w-2xl ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
                    {(t as any).detectDbNotice}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDetectDbInfo}
                disabled={isDetectingDb}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer shadow-md ${
                  isDetectingDb
                    ? 'cursor-wait bg-teal-600 text-white border border-teal-400 shadow-teal-500/30'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white hover:shadow-teal-500/25 active:scale-95'
                }`}
              >
                {isDetectingDb ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white shrink-0" />
                    <span className="text-white font-extrabold tracking-wide drop-shadow-sm">{(t as any).detectingDb}</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 text-white shrink-0" />
                    <span className="text-white font-bold">{(t as any).detectDbBtn}</span>
                  </>
                )}
              </button>
            </div>

            {dbDetectionMessage && (
              <div className={`mt-3.5 p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                dbDetectionMessage.type === 'success'
                  ? isLightMode
                    ? 'bg-emerald-100/90 border-emerald-300 text-emerald-900'
                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                  : isLightMode
                    ? 'bg-rose-100/90 border-rose-300 text-rose-900'
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-200'
              }`}>
                {dbDetectionMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="font-semibold">{dbDetectionMessage.text}</div>
                  {dbDetectionMessage.details && (
                    <div className="font-mono text-[11px] opacity-90">{dbDetectionMessage.details}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Advanced Settings (PostgreSQL Connection details & File Paths) */}
          <div className="border-t border-white/5 pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors"
            >
              <Settings className={`w-4 h-4 transform transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
              {showAdvanced ? t.hideAdvanced : t.showAdvanced}
            </button>

            {showAdvanced && (
              <div className="space-y-6 mt-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-md">
                {/* PostgreSQL Database parameters */}
                <div>
                  <h4 className="text-sm font-bold text-teal-400 flex items-center gap-2 mb-4">
                    <Database className="w-4 h-4 text-teal-400" />
                    PostgreSQL Authentication & Host Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">DB Host (Local to Synapse or Remote IP)</label>
                      <input
                        type="text"
                        value={dbHost}
                        onChange={e => setDbHost(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">DB Port</label>
                      <input
                        type="number"
                        value={dbPort}
                        onChange={e => setDbPort(parseInt(e.target.value) || 5432)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">DB Name</label>
                      <input
                        type="text"
                        value={dbName}
                        onChange={e => setDbName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">DB Username</label>
                      <input
                        type="text"
                        value={dbUser}
                        onChange={e => setDbUser(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all shadow-inner"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">DB Password</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={dbPass}
                        onChange={e => setDbPass(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom system files paths */}
                <div className="border-t border-white/10 pt-5">
                  <h4 className="text-sm font-bold text-teal-400 flex items-center gap-2 mb-4">
                    <Terminal className="w-4 h-4 text-teal-400" />
                    Configuration File Paths (On Remote)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Matrix Stack Config Path</label>
                      <input
                        type="text"
                        value={configPath}
                        onChange={e => setConfigPath(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Homeserver YAML Path</label>
                      <input
                        type="text"
                        value={homeserverYamlPath}
                        onChange={e => setHomeserverYamlPath(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Element Client Config Path</label>
                      <input
                        type="text"
                        value={elementConfigPath}
                        onChange={e => setElementConfigPath(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Synapse Log File Path</label>
                      <input
                        type="text"
                        value={homeserverLogPath}
                        onChange={e => setHomeserverLogPath(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Admin Token Settings */}
          <div className="border-t border-white/5 pt-4">
            <button
              type="button"
              onClick={() => setShowAdminSettings(!showAdminSettings)}
              className="flex items-center gap-2 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors"
            >
              <Key className={`w-4 h-4 transform transition-transform ${showAdminSettings ? 'rotate-90' : ''}`} />
              {showAdminSettings ? t.hideAdminSettings : t.showAdminSettings}
            </button>

            {showAdminSettings && (
              <div className="space-y-6 mt-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-md">
                <div>
                  <h4 className="text-sm font-bold text-teal-400 flex items-center gap-2 mb-4">
                    <Key className="w-4 h-4 text-teal-400" />
                    {t.adminTokenTitle}
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">
                    {t.adminTokenDesc}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">{t.adminUsernameLabel}</label>
                      <input
                        type="text"
                        placeholder="@admin:domain.com"
                        value={adminUsername}
                        onChange={e => setAdminUsername(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">{t.adminPasswordLabel}</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={adminPassword}
                        onChange={e => setAdminPassword(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">{t.adminAccessTokenLabel}</label>
                      <input
                        type="password"
                        placeholder="syt_..."
                        value={adminAccessToken}
                        onChange={e => setAdminAccessToken(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Test Feedback */}
          {formTestResult && (
            <div className={`p-4 rounded-xl border text-xs space-y-3 ${
              formTestResult.success 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  {formTestResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                  Test Result: {formTestResult.success ? 'All Services & Nodes Reachable' : 'Connection Test Issues'}
                </span>
                <span className="text-[11px] font-mono opacity-80">
                  SSH: {formTestResult.ssh ? 'OK' : 'FAIL'} | DB: {formTestResult.db ? 'OK' : 'FAIL'} | API: {formTestResult.api ? 'OK' : 'FAIL'}
                </span>
              </div>
              
              {formTestResult.clusterNodes && formTestResult.clusterNodes.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                    <span>Cluster Nodes Verification:</span>
                    <span className={formTestResult.clusterNodes.every(n => n.ssh) ? 'text-emerald-400' : 'text-rose-400'}>
                      {formTestResult.clusterNodes.filter(n => n.ssh).length} / {formTestResult.clusterNodes.length} Nodes Online
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {formTestResult.clusterNodes.map(cn => (
                      <div key={cn.role} className={`p-2.5 rounded-xl border flex flex-col gap-1.5 ${
                        cn.ssh && (cn.service === undefined || cn.service)
                          ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200'
                          : 'bg-rose-500/10 border-rose-500/25 text-rose-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold uppercase text-[10px] tracking-wider opacity-90">{cn.name || `${cn.role} Node`}</span>
                          <span className={`text-[10px] font-bold flex items-center gap-1 ${cn.ssh ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {cn.ssh ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            {cn.ssh ? 'SSH OK' : 'SSH Failed'}
                          </span>
                        </div>
                        <div className="font-mono text-[10px] opacity-75 truncate">{cn.host}</div>
                        {cn.serviceName && (
                          <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                            <span className="opacity-80 truncate">{cn.serviceName}:</span>
                            <span className={`font-bold flex items-center gap-0.5 shrink-0 ${cn.service ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {cn.service ? <Check className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                              {cn.service ? 'Active' : 'Unreachable'}
                            </span>
                          </div>
                        )}
                        {cn.error && !cn.ssh && (
                          <div className="text-[9px] text-rose-300 font-mono opacity-90 leading-tight">
                            {cn.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formTestResult.error && (
                <p className="text-[11px] font-mono leading-relaxed opacity-90 break-words pt-1">
                  Error Details: {formTestResult.error}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={handleTestCurrentForm}
              disabled={isTestingForm}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold text-xs transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isTestingForm ? 'animate-spin' : ''}`} />
              {isTestingForm ? 'Testing Connectivity...' : t.testAllNodes}
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm transition-all shadow-lg hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]"
              >
                {t.saveProfile}
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Profiles Cards List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-2 text-center py-12">
              <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-400">{t.loadingProfiles}</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="col-span-2 text-center py-12 spatial-glass rounded-3xl border border-white/5">
              <Server className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white">{t.noProfilesTitle}</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                {t.noProfilesDesc}
              </p>
            </div>
          ) : (
            profiles.map(profile => {
              const isActive = profile.isActive;
              const isLocal = profile.id === 'local';
              const isDistributed = profile.deploymentMode === 'distributed';
              const testResult = testResults[profile.id];
              const isTesting = testingId === profile.id;

              return (
                <div
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile.id)}
                  className={`spatial-glass rounded-3xl border p-6 transition-all duration-300 relative flex flex-col justify-between cursor-pointer group hover:scale-[1.01] ${
                    isActive
                      ? isLightMode
                        ? 'border-teal-500 bg-teal-50/60 shadow-[0_10px_30px_rgba(20,184,166,0.18)] ring-2 ring-teal-500/20'
                        : 'border-teal-400 bg-teal-950/20 shadow-[0_0_35px_rgba(20,184,166,0.25)] ring-2 ring-teal-400/20'
                      : isLightMode
                        ? 'border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50/50 shadow-sm'
                        : 'border-white/5 hover:border-white/10 bg-white/5'
                  }`}
                >
                  {/* Left Accent Indicator Bar for Active Profile */}
                  {isActive && (
                    <div className="absolute left-0 top-8 bottom-8 w-1.5 bg-gradient-to-b from-teal-400 to-teal-600 rounded-r-lg" />
                  )}

                  {/* Selected / Active Badge */}
                  {isActive && (
                    <div className={`absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1.5 shadow-sm border animate-pulse ${
                      isLightMode
                        ? 'bg-teal-600 text-white border-teal-600/20'
                        : 'bg-teal-500/25 text-teal-300 border-teal-500/30'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t.activeServer}
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-2xl border transition-colors duration-300 ${
                        isActive 
                          ? isDistributed ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-teal-500/10 text-teal-500 border-teal-500/20' 
                          : isLightMode
                            ? 'bg-slate-100 text-slate-500 border-slate-200'
                            : 'bg-white/5 text-slate-400 border-white/5'
                      }`}>
                        {isLocal ? <Server className="w-6 h-6" /> : isDistributed ? <Network className="w-6 h-6 text-indigo-400" /> : <Globe className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-lg font-bold transition-colors duration-300 ${
                            isActive
                              ? isLightMode ? 'text-teal-700' : 'text-teal-400'
                              : isLightMode ? 'text-slate-800 group-hover:text-teal-600' : 'text-white group-hover:text-teal-400'
                          }`}>
                            {profile.name}
                          </h3>
                          {isDistributed && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              3 Nodes
                            </span>
                          )}
                        </div>
                        <p className={`text-xs font-mono mt-1 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {isLocal ? 'local-loopback' : `${profile.username}@${profile.host}:${profile.port}`}
                        </p>
                      </div>
                    </div>

                    {/* Status Meta */}
                    <div className={`space-y-2.5 border-t pt-4 transition-colors duration-300 ${isLightMode ? 'border-slate-100' : 'border-white/5'}`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className={isLightMode ? 'text-slate-500' : 'text-slate-400'}>{t.connectionType}</span>
                        <span className={`font-semibold uppercase text-[11px] ${
                          isDistributed ? 'text-indigo-400 font-bold' : isLightMode ? 'text-slate-700' : 'text-slate-300'
                        }`}>
                          {isLocal ? t.internalSandbox : isDistributed ? t.distributedCluster : t.remoteSsh}
                        </span>
                      </div>
                      
                      {!isLocal && (
                        <>
                          {isDistributed ? (
                            /* 3 Nodes Summary Matrix */
                            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                                <span className="block text-[10px] font-bold text-purple-300">Synapse</span>
                                <span className="text-[10px] font-mono text-slate-300 truncate block">
                                  {profile.synapseNode?.host || profile.host}
                                </span>
                              </div>
                              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                                <span className="block text-[10px] font-bold text-emerald-300">PostgreSQL</span>
                                <span className="text-[10px] font-mono text-slate-300 truncate block">
                                  {profile.databaseNode?.host || profile.dbHost || 'Remote'}
                                </span>
                              </div>
                              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                                <span className="block text-[10px] font-bold text-blue-300">Element</span>
                                <span className="text-[10px] font-mono text-slate-300 truncate block">
                                  {profile.elementNode?.host || profile.host}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between text-xs">
                                <span className={isLightMode ? 'text-slate-500' : 'text-slate-400'}>{t.authMethod}</span>
                                <span className={`font-mono flex items-center gap-1 ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>
                                  <Lock className="w-3 h-3 text-slate-400" />
                                  {profile.authType === 'key' ? t.sshPrivateKey : t.passwordCredentials}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className={isLightMode ? 'text-slate-500' : 'text-slate-400'}>{t.synapsePostgres}</span>
                                <span className={`font-mono ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{profile.dbUser}@{profile.dbHost}:{profile.dbPort}</span>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className={`mt-6 pt-4 border-t flex items-center justify-between gap-2 transition-colors duration-300 ${isLightMode ? 'border-slate-100' : 'border-white/5'}`}>
                    <div className="flex items-center gap-2">
                      {!isLocal && (
                        <button
                          type="button"
                          onClick={(e) => handleTestProfile(profile, e)}
                          disabled={isTesting}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            isLightMode
                              ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700'
                              : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-300'
                          }`}
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-teal-400' : ''}`} />
                          {isTesting ? t.testing : t.testSync}
                        </button>
                      )}

                      {!isLocal && (
                        <button
                          type="button"
                          onClick={(e) => handleEditProfile(profile, e)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLightMode
                              ? 'hover:bg-slate-100 text-slate-500 hover:text-teal-600'
                              : 'hover:bg-teal-500/10 text-slate-400 hover:text-teal-400'
                          }`}
                          title="Edit Connection / Cluster"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}

                      {!isLocal && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteProfile(profile.id, e)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLightMode
                              ? 'hover:bg-red-50 text-slate-500 hover:text-red-600 hover:bg-red-500/10'
                              : 'hover:bg-red-500/10 text-slate-400 hover:text-red-400'
                          }`}
                          title="Delete Connection"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Test Feedback Badges */}
                    {testResult && (
                      <div className="flex flex-col items-end text-[10px] w-full">
                        {testResult.clusterNodes && testResult.clusterNodes.length > 0 ? (
                          <div className={`p-2 rounded-lg border w-full space-y-1.5 ${
                            testResult.success
                              ? isLightMode ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                              : isLightMode ? 'bg-amber-50/80 border-amber-200 text-amber-800' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                          }`}>
                            <div className="flex items-center justify-between text-[10px] font-bold">
                              <span>Cluster Multi-Node Test:</span>
                              <span className={testResult.success ? 'text-emerald-500' : 'text-amber-500'}>
                                {testResult.clusterNodes.filter((n: any) => n.ssh).length} / {testResult.clusterNodes.length} Online
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                              {testResult.clusterNodes.map((cn: any) => (
                                <div key={cn.role} className={`p-1 rounded text-[9px] border flex flex-col gap-0.5 ${
                                  cn.ssh && (cn.service === undefined || cn.service)
                                    ? isLightMode ? 'bg-white border-emerald-300 text-emerald-700' : 'bg-black/30 border-emerald-500/30 text-emerald-300'
                                    : isLightMode ? 'bg-white border-rose-300 text-rose-700' : 'bg-black/30 border-rose-500/30 text-rose-300'
                                }`}>
                                  <div className="font-extrabold uppercase text-[8px] truncate">{cn.role}</div>
                                  <div className="flex items-center gap-0.5 font-bold">
                                    {cn.ssh ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <AlertCircle className="w-2.5 h-2.5 text-rose-500" />}
                                    <span>{cn.ssh ? 'SSH OK' : 'SSH Fail'}</span>
                                  </div>
                                  {cn.serviceName && (
                                    <div className="flex items-center gap-0.5 text-[8px] opacity-85">
                                      {cn.service ? <Check className="w-2 h-2 text-emerald-500" /> : <AlertCircle className="w-2 h-2 text-rose-500" />}
                                      <span className="truncate">{cn.service ? 'Service' : 'Err'}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 font-bold">
                            {testResult.ssh ? (
                              <span className={`${isLightMode ? 'text-emerald-600' : 'text-emerald-400'} flex items-center gap-0.5`}><CheckCircle2 className="w-3 h-3" /> SSH</span>
                            ) : (
                              <span className={`${isLightMode ? 'text-rose-600' : 'text-rose-400'} flex items-center gap-0.5`}><AlertCircle className="w-3 h-3" /> SSH</span>
                            )}
                            <span className={isLightMode ? 'text-slate-300' : 'text-slate-500'}>|</span>
                            {testResult.db ? (
                              <span className={`${isLightMode ? 'text-emerald-600' : 'text-emerald-400'} flex items-center gap-0.5`}><CheckCircle2 className="w-3 h-3" /> Postgres</span>
                            ) : (
                              <span className={`${isLightMode ? 'text-rose-600' : 'text-rose-400'} flex items-center gap-0.5`}><AlertCircle className="w-3 h-3" /> Postgres</span>
                            )}
                            <span className={isLightMode ? 'text-slate-300' : 'text-slate-500'}>|</span>
                            {testResult.api ? (
                              <span className={`${isLightMode ? 'text-emerald-600' : 'text-emerald-400'} flex items-center gap-0.5`}><CheckCircle2 className="w-3 h-3" /> Matrix API</span>
                            ) : (
                              <span className={`${isLightMode ? 'text-rose-600' : 'text-rose-400'} flex items-center gap-0.5`}><AlertCircle className="w-3 h-3" /> Matrix API</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {isActive && (
                      <span className={`text-[11px] font-bold flex items-center gap-1.5 ${isLightMode ? 'text-teal-600' : 'text-teal-400'}`}>
                        {t.connectedBadge}
                        <span className={`w-2 h-2 rounded-full animate-ping ${isLightMode ? 'bg-teal-600' : 'bg-teal-400'}`} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
