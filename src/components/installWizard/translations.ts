export interface WizardTranslations {
  title: string;
  subtitle: string;
  step: string;
  next: string;
  back: string;
  cancel: string;
  confirmInstall: string;
  
  // Step 1: Installation Source
  sourceTitle: string;
  sourceDesc: string;
  sourceOnline: string;
  sourceOnlineDesc: string;
  sourceOffline: string;
  sourceOfflineDesc: string;
  offlineConfigLabel: string;
  offlineConfigPlaceholder: string;
  offlineConfigHelp: string;
  offlineElementLabel: string;
  offlineElementPlaceholder: string;
  offlineSynapseDebLabel: string;
  offlineSynapseDebPlaceholder: string;

  // Step 2: Deployment Topology & Server Settings
  serverTitle: string;
  serverDesc: string;
  topologyTitle: string;
  topologyDesc: string;
  modeSingle: string;
  modeSingleDesc: string;
  modeDistributed: string;
  modeDistributedDesc: string;

  // Single mode
  hsDomainLabel: string;
  hsDomainPlaceholder: string;
  elementDomainLabel: string;
  elementDomainPlaceholder: string;
  baseDomainLabel: string;
  baseDomainPlaceholder: string;
  publicIpLabel: string;
  publicIpPlaceholder: string;
  leEmailLabel: string;
  leEmailPlaceholder: string;
  dbNotice: string;

  // Multi-Node Cards
  nodeSynapseTitle: string;
  nodeDbTitle: string;
  nodeElementTitle: string;
  nodeHostIp: string;
  nodeSshPort: string;
  nodeSshUser: string;
  nodeAuthType: string;
  nodePassword: string;
  nodePrivateKey: string;
  authPasswordLabel: string;
  authKeyLabel: string;
  copySynapseCredentials: string;
  credentialsCopied: string;
  interNodeComms: string;
  interNodeCommsDesc: string;
  dbNameLabel: string;
  dbUserLabel: string;
  dbPasswordLabel: string;
  dbPortLabel: string;
  detectedFromActiveConn: string;

  // Step 3: SSL Certificate
  sslTitle: string;
  sslDesc: string;
  sslAuto: string;
  sslAutoDesc: string;
  sslSelfSigned: string;
  sslSelfSignedDesc: string;
  sslCustom: string;
  sslCustomDesc: string;
  customCertLabel: string;
  customCertPlaceholder: string;
  customKeyLabel: string;
  customKeyPlaceholder: string;
  customChainLabel: string;
  customChainPlaceholder: string;

  // Step 4: Element Web
  elementTitle: string;
  elementDesc: string;
  elementOnline: string;
  elementOnlineDesc: string;
  elementVersionLabel: string;
  elementVersionPlaceholder: string;
  elementOffline: string;
  elementOfflineDesc: string;
  elementOfflinePathLabel: string;
  elementOfflinePathPlaceholder: string;
  elementOfflineLabelLabel: string;
  elementOfflineLabelPlaceholder: string;

  // Step 5: LDAP Addons
  ldapTitle: string;
  ldapDesc: string;
  ldapCheckbox: string;
  ldapNotice: string;
  ldapUriLabel: string;
  ldapUriPlaceholder: string;
  ldapBindDnLabel: string;
  ldapBindDnPlaceholder: string;
  ldapBindPasswordLabel: string;
  ldapBindPasswordPlaceholder: string;
  ldapBaseDnLabel: string;
  ldapBaseDnPlaceholder: string;

  // Step 6: Summary & Confirm
  summaryTitle: string;
  summaryDesc: string;
  confirmReady: string;
  confirmReadyDesc: string;
  source: string;
  topology: string;
  domains: string;
  ssl: string;
  element: string;
  ldap: string;
  yes: string;
  no: string;
  online: string;
  offline: string;

  // Validations
  errDomain: string;
  errIp: string;
  errEmail: string;
  errRequired: string;

  // Post-Install Guidance
  postInstallGuideTitle: string;
  postInstallGuideSub: string;
  stepDbTitle: string;
  stepDbDesc: string;
  stepAdminTitle: string;
  stepAdminDesc: string;
}

export const wizardTranslations: Record<string, WizardTranslations> = {
  en: {
    title: "Configure Matrix Enterprise Stack",
    subtitle: "Complete the step-by-step wizard to configure and deploy a production-ready Matrix cluster across single or distributed servers.",
    step: "Step",
    next: "Next",
    back: "Back",
    cancel: "Cancel",
    confirmInstall: "Confirm & Start Installation",
    
    // Step 1: Installation Source
    sourceTitle: "Installation Source",
    sourceDesc: "Specify how you want to retrieve the required packages for the installation.",
    sourceOnline: "Online Installation",
    sourceOnlineDesc: "Download all components dynamically from the official repositories and GitHub during the install process.",
    sourceOffline: "Offline / Local Installation",
    sourceOfflineDesc: "Use local package files, pre-downloaded Debian packages, and static assets from the server.",
    offlineConfigLabel: "Offline Config File Path (Optional)",
    offlineConfigPlaceholder: "e.g., /etc/matrix-stack.conf",
    offlineConfigHelp: "If specified, values from this file will be loaded as defaults.",
    offlineElementLabel: "Offline Element Web Tarball Path (Optional)",
    offlineElementPlaceholder: "e.g., /tmp/element-web.tar.gz",
    offlineSynapseDebLabel: "Synapse .deb Package Folder (Optional)",
    offlineSynapseDebPlaceholder: "e.g., /tmp/synapse_debs",

    // Step 2: Deployment Topology & Server Settings
    serverTitle: "Deployment Topology & Target Nodes",
    serverDesc: "Specify your cluster architecture, host IP addresses for each service, and domain routing.",
    topologyTitle: "Deployment Architecture",
    topologyDesc: "Choose whether to deploy all services on a single server or distribute Synapse, PostgreSQL, and Element across dedicated hosts.",
    modeSingle: "Single Server (All-in-One)",
    modeSingleDesc: "Synapse, PostgreSQL, and Element Web run together on the same host.",
    modeDistributed: "Distributed Multi-Server Cluster",
    modeDistributedDesc: "Deploy Synapse, PostgreSQL database, and Element Web on dedicated remote IP addresses.",

    // Single mode fields
    hsDomainLabel: "Matrix Homeserver Domain",
    hsDomainPlaceholder: "matrix.example.com",
    elementDomainLabel: "Element Web Frontend Domain",
    elementDomainPlaceholder: "chat.example.com",
    baseDomainLabel: "Base Domain (for Well-Known pointers)",
    baseDomainPlaceholder: "example.com",
    publicIpLabel: "Server Public IP Address",
    publicIpPlaceholder: "e.g., 198.51.100.42",
    leEmailLabel: "Notification / SSL Let's Encrypt Email",
    leEmailPlaceholder: "admin@example.com",
    dbNotice: "Database Notice: The PostgreSQL database cluster is automatically configured with dedicated names and secure random passwords.",

    // Multi-Node Cards
    nodeSynapseTitle: "Synapse Server Node (Matrix Homeserver)",
    nodeDbTitle: "Database Server Node (PostgreSQL DB)",
    nodeElementTitle: "Element Web Server Node (Frontend Client)",
    nodeHostIp: "Server Host / IP Address *",
    nodeSshPort: "SSH Port",
    nodeSshUser: "SSH Username",
    nodeAuthType: "SSH Authentication",
    nodePassword: "SSH Password",
    nodePrivateKey: "SSH Private Key (PEM)",
    authPasswordLabel: "Password",
    authKeyLabel: "Private Key",
    copySynapseCredentials: "Copy SSH Credentials from Synapse Node",
    credentialsCopied: "SSH credentials copied successfully!",
    interNodeComms: "Inter-Node Connectivity & Firewall Routing",
    interNodeCommsDesc: "PostgreSQL pg_hba.conf will automatically whitelist the Synapse Node IP. Element Web will link directly to the Matrix homeserver.",
    dbNameLabel: "Database Name",
    dbUserLabel: "Database User",
    dbPasswordLabel: "Database Password (leave blank for auto-generated)",
    dbPortLabel: "Database Port",
    detectedFromActiveConn: "Detected from active connection profile",

    // Step 3: SSL Certificate
    sslTitle: "SSL/TLS Security Layer",
    sslDesc: "Select the encryption method for secure HTTPS connections between clients, servers, and homeservers.",
    sslAuto: "Automatic Resolution",
    sslAutoDesc: "Internal domains resolve to Self-Signed; Public domains request Let's Encrypt certificates.",
    sslSelfSigned: "Force Self-Signed Certificates",
    sslSelfSignedDesc: "Create a safe, local 10-year 4096-bit self-signed certificate for private networks or VPNs.",
    sslCustom: "Custom PEM Certificates",
    sslCustomDesc: "Upload or specify paths to your own pre-generated SSL certificate files.",
    customCertLabel: "Fullchain PEM File Path",
    customCertPlaceholder: "e.g., /etc/ssl/certs/matrix.crt",
    customKeyLabel: "Private Key PEM File Path",
    customKeyPlaceholder: "e.g., /etc/ssl/private/matrix.key",
    customChainLabel: "CA Chain Certificate PEM File Path (Optional)",
    customChainPlaceholder: "e.g., /etc/ssl/certs/ca-bundle.crt",

    // Step 4: Element Web
    elementTitle: "Element Web Frontend",
    elementDesc: "Configure the deployment strategy for the Element Web chat client.",
    elementOnline: "Online GitHub Distribution",
    elementOnlineDesc: "Download and deploy standard Element release packages directly from GitHub.",
    elementVersionLabel: "Custom Element Version (Optional)",
    elementVersionPlaceholder: "e.g., 1.11.55 (defaults to latest supported stable)",
    elementOffline: "Local Distribution Tarball",
    elementOfflineDesc: "Decompress and host a static .tar.gz archive of Element Web pre-uploaded to the server.",
    elementOfflinePathLabel: "Local Element Tarball File Path",
    elementOfflinePathPlaceholder: "e.g., /tmp/element-web.tar.gz",
    elementOfflineLabelLabel: "Offline Version Tag (Optional)",
    elementOfflineLabelPlaceholder: "e.g., v1.11.55",

    // Step 5: LDAP Addons
    ldapTitle: "Enterprise Directory (LDAP)",
    ldapDesc: "Enable LDAP integration to allow your users to log in using their enterprise directory accounts.",
    ldapCheckbox: "Configure LDAP Authentication right after installation completes?",
    ldapNotice: "If checked, the system will prompt you with the LDAP Wizard immediately after the core installation finishes successfully.",
    ldapUriLabel: "LDAP Server URI",
    ldapUriPlaceholder: "e.g., ldap://ldap.example.com:389 or ldaps://ldap.example.com:636",
    ldapBindDnLabel: "LDAP Bind DN",
    ldapBindDnPlaceholder: "e.g., cn=admin,dc=example,dc=com",
    ldapBindPasswordLabel: "LDAP Bind Password",
    ldapBindPasswordPlaceholder: "Enter password for the LDAP Bind DN account",
    ldapBaseDnLabel: "LDAP User Search Base DN",
    ldapBaseDnPlaceholder: "e.g., ou=users,dc=example,dc=com",

    // Step 6: Summary & Confirm
    summaryTitle: "Installation Summary",
    summaryDesc: "Please review all your installation parameters carefully before triggering the automated deployment.",
    confirmReady: "System Ready for Deployment",
    confirmReadyDesc: "All mandatory fields have been validated. The server will execute the installation script and stream real-time logs.",
    source: "Source",
    topology: "Topology",
    domains: "Domains",
    ssl: "SSL Mode",
    element: "Element Web",
    ldap: "LDAP Auth",
    yes: "Yes",
    no: "No",
    online: "Online",
    offline: "Offline",

    // Validations
    errDomain: "Please enter a valid domain format.",
    errIp: "Please enter a valid IPv4 address or hostname.",
    errEmail: "Please enter a valid email address.",
    errRequired: "This field is required.",

    // Post-Install Guidance
    postInstallGuideTitle: "Mandatory Steps After Installation Completes",
    postInstallGuideSub: "Follow these essential steps after installation to connect the panel to PostgreSQL and enable Matrix API capabilities:",
    stepDbTitle: "1. Enter Database Credentials in 'Server Connections'",
    stepDbDesc: "Navigate to 'Server Connections', edit your active server profile, and verify the database credentials match your deployed PostgreSQL instance.",
    stepAdminTitle: "2. Register Synapse Admin User & Save Admin Token",
    stepAdminDesc: "Create an administrator account and save the Admin Token under 'Server Connections' to enable complete management features."
  },
  fa: {
    title: "پیکربندی پیشرفته بسته سازمانی ماتریکس (Matrix Stack)",
    subtitle: "تنظیم و استقرار خودکار کلاستر ماتریکس بر روی یک سرور یا به صورت توزیع‌شده بین سرورهای مجزا (Synapse، دیتابیس، Element).",
    step: "مرحله",
    next: "مرحله بعدی",
    back: "مرحله قبلی",
    cancel: "انصراف",
    confirmInstall: "تایید و شروع نصب",
    
    // Step 1: Installation Source
    sourceTitle: "منبع تامین پکیج‌های نصب",
    sourceDesc: "نحوه دریافت فایل‌های نصب ماتریکس و کلاینت آن را مشخص کنید.",
    sourceOnline: "دانلود آنلاین (Online)",
    sourceOnlineDesc: "تمام پکیج‌ها و کدهای کلاینت به صورت خودکار از مخازن رسمی و گیت‌هاب دانلود می‌شوند.",
    sourceOffline: "فایل‌های محلی و آفلاین (Offline)",
    sourceOfflineDesc: "استفاده از فایل‌های tar.gz، پکیج‌های deb محلی و بسته‌های از پیش دانلود شده روی سرور.",
    offlineConfigLabel: "مسیر فایل کانفیگ ذخیره‌شده (اختیاری)",
    offlineConfigPlaceholder: "مثال: /etc/matrix-stack.conf",
    offlineConfigHelp: "در صورت وجود، مقادیر پیش‌فرض بقیه فرم از روی این فایل لود خواهند شد.",
    offlineElementLabel: "مسیر فایل tar.gz المنت وب (اختیاری)",
    offlineElementPlaceholder: "مثال: /tmp/element-web.tar.gz",
    offlineSynapseDebLabel: "پوشه پکیج‌های deb ساینپس (اختیاری)",
    offlineSynapseDebPlaceholder: "مثال: /tmp/synapse_debs",

    // Step 2: Deployment Topology & Server Settings
    serverTitle: "معماری استقرار و اختصاص سرورها / آی‌پی‌ها",
    serverDesc: "تعیین کنید هر سرویس (Synapse، دیتابیس PostgreSQL و Element Web) روی چه سرور و آی‌پی مستقر گردد.",
    topologyTitle: "نوع معماری استقرار",
    topologyDesc: "مشخص کنید کل سیستم روی یک سرور یکپارچه نصب شود یا سرویس‌ها روی سرورهای مجزا توزیع شوند.",
    modeSingle: "استقرار تک‌سروره / تجمیعی (All-in-One)",
    modeSingleDesc: "سرویس‌های ساینپس، پایگاه‌داده PostgreSQL و المنت وب همگی روی یک سرور مشترک نصب می‌شوند.",
    modeDistributed: "خوشه توزیع‌شده چندسروره (Distributed Cluster)",
    modeDistributedDesc: "ساینپس، پایگاه‌داده PostgreSQL و وب‌کلاینت Element روی سرورها با IPها و دسترسی‌های مجزا مستقر می‌شوند.",

    // Single mode fields
    hsDomainLabel: "دامنه سرور ماتریکس (Synapse Domain)",
    hsDomainPlaceholder: "matrix.example.com",
    elementDomainLabel: "دامنه المنت وب (Element Domain)",
    elementDomainPlaceholder: "chat.example.com",
    baseDomainLabel: "دامنه پایه برای تنظیمات Well-Known",
    baseDomainPlaceholder: "example.com",
    publicIpLabel: "آی‌پی سرور اصلی (Public IP)",
    publicIpPlaceholder: "مثال: 198.51.100.42",
    leEmailLabel: "ایمیل جهت گواهی SSL و اعلان‌ها",
    leEmailPlaceholder: "admin@example.com",
    dbNotice: "توضیح پایگاه‌داده: در حالت تک‌سروره، PostgreSQL به صورت خودکار نصب و کانفیگ شده و نیازی به ورود مشخصات نیست.",

    // Multi-Node Cards
    nodeSynapseTitle: "سرور ساینپس ماتریکس (Synapse Node)",
    nodeDbTitle: "سرور پایگاه‌داده (PostgreSQL Node)",
    nodeElementTitle: "سرور المنت وب (Element Web Node)",
    nodeHostIp: "آی‌پی یا هاست سرور *",
    nodeSshPort: "پورت SSH",
    nodeSshUser: "نام کاربری SSH",
    nodeAuthType: "روش احراز هویت SSH",
    nodePassword: "رمز عبور SSH",
    nodePrivateKey: "کلید خصوصی SSH (PEM)",
    authPasswordLabel: "رمز عبور",
    authKeyLabel: "کلید خصوصی",
    copySynapseCredentials: "کپی مشخصات SSH از سرور ساینپس",
    credentialsCopied: "مشخصات SSH با موفقیت کپی شد!",
    interNodeComms: "ارتباط خودکار بین نودها (Inter-Node Routing)",
    interNodeCommsDesc: "پستگرس به صورت خودکار برای پذیرش اتصالات ساینپس از آی‌پی ساینپس کانفیگ شده و المنت به دامنه ساینپس متصل خواهد شد.",
    dbNameLabel: "نام پایگاه‌داده",
    dbUserLabel: "کاربر پایگاه‌داده",
    dbPasswordLabel: "رمز عبور دیتابیس (خالی = خودکار)",
    dbPortLabel: "پورت پایگاه‌داده",
    detectedFromActiveConn: "تشخیص خودکار از پروفایل اتصال فعال",

    // Step 3: SSL Certificate
    sslTitle: "تنظیمات گواهی امنیتی SSL/TLS",
    sslDesc: "روش رمزنگاری و تامین گواهی‌های SSL برای دامنه‌ها را تعیین کنید.",
    sslAuto: "تشخیص هوشمند و خودکار (Auto)",
    sslAutoDesc: "دامنه‌های داخلی (.local/.lan) مجهز به Self-signed و دامنه‌های عمومی مجهز به Let's Encrypt خواهند شد.",
    sslSelfSigned: "گواهی امضا شده شخصی (Self-Signed)",
    sslSelfSignedDesc: "ساخت گواهی امنیتی بومی ۱۰ ساله و ۴۰۹۶ بیتی. مناسب شبکه‌های داخلی، VPN و اهداف توسعه.",
    sslCustom: "گواهی شخصی سفارشی (PEM Certificate)",
    sslCustomDesc: "در صورت داشتن گواهی معتبر خریداری شده، مسیر فایل‌های PEM را در سرور مشخص کنید.",
    customCertLabel: "مسیر فایل گواهی اصلی (Cert / Fullchain PEM)",
    customCertPlaceholder: "مثال: /etc/ssl/certs/matrix.crt",
    customKeyLabel: "مسیر فایل کلید خصوصی (Private Key PEM)",
    customKeyPlaceholder: "مثال: /etc/ssl/private/matrix.key",
    customChainLabel: "مسیر فایل زنجیره گواهی (CA Chain PEM - اختیاری)",
    customChainPlaceholder: "مثال: /etc/ssl/certs/ca-bundle.crt",

    // Step 4: Element Web
    elementTitle: "تنظیمات وب کلاینت Element Web",
    elementDesc: "روش استقرار و نسخه مورد استفاده کلاینت چت Element را مشخص کنید.",
    elementOnline: "دانلود خودکار آنلاین از گیت‌هاب",
    elementOnlineDesc: "دانلود مستقیم پکیج رسمی وب کلاینت از مخازن گیت‌هاب المنت.",
    elementVersionLabel: "ورژن دلخواه المنت (اختیاری)",
    elementVersionPlaceholder: "مثال: 1.11.55 (پیش‌فرض آخرین نسخه پایدار)",
    elementOffline: "استفاده از فایل فشرده محلی (tar.gz)",
    elementOfflineDesc: "استفاده از پکیج از پیش دانلود شده المنت وب که در سرور قرار دارد.",
    elementOfflinePathLabel: "مسیر فایل tar.gz المنت کلاینت روی سرور",
    elementOfflinePathPlaceholder: "مثال: /tmp/element-web.tar.gz",
    elementOfflineLabelLabel: "برچسب ورژن کلاینت آفلاین (اختیاری)",
    elementOfflineLabelPlaceholder: "مثال: v1.11.55",

    // Step 5: LDAP Addons
    ldapTitle: "یکپارچه‌سازی سرویس LDAP (اختیاری)",
    ldapDesc: "امکان احراز هویت کاربران سازمانی از طریق سرویس دایرکتوری سنترال (LDAP).",
    ldapCheckbox: "آیا می‌خواهید همین الان احراز هویت LDAP را پیکربندی کنید؟",
    ldapNotice: "در صورت انتخاب، بلافاصله پس از اتمام موفق نصب، ویزارد تنظیمات سرور LDAP به شما نمایش داده می‌شود.",
    ldapUriLabel: "آدرس سرور LDAP (URI)",
    ldapUriPlaceholder: "مثال: ldap://ldap.example.com:389 یا ldaps://ldap.example.com:636",
    ldapBindDnLabel: "مشخصه اتصال (Bind DN)",
    ldapBindDnPlaceholder: "مثال: cn=admin,dc=example,dc=com",
    ldapBindPasswordLabel: "کلمه عبور اتصال (Bind Password)",
    ldapBindPasswordPlaceholder: "پسورد اکانت متصل شونده به اکتیو دایرکتوری",
    ldapBaseDnLabel: "پایه جستجوی کاربران (User Search Base DN)",
    ldapBaseDnPlaceholder: "مثال: ou=users,dc=example,dc=com",

    // Step 6: Summary & Confirm
    summaryTitle: "خلاصه پیکربندی و شروع نصب",
    summaryDesc: "لطفاً مقادیر واردشده را با دقت مرور کنید. با کلیک بر روی شروع، عملیات نصب به صورت خودکار آغاز خواهد شد.",
    confirmReady: "آماده‌سازی نهایی برای استقرار بدون وقفه",
    confirmReadyDesc: "تمامی مقادیر اعتبارسنجی شدند. لاگ‌های فرآیند نصب به صورت زنده در کنسول ترمینال نمایش داده می‌شوند.",
    source: "منبع فایل‌ها",
    topology: "معماری استقرار",
    domains: "دامنه‌ها",
    ssl: "حالت گواهی SSL",
    element: "پکیج کلاینت",
    ldap: "پیکربندی LDAP",
    yes: "بله",
    no: "خیر",
    online: "آنلاین (اینترنتی)",
    offline: "آفلاین (محلی)",

    // Validations
    errDomain: "فرمت دامنه نامعتبر است.",
    errIp: "آدرس آی‌پی یا نام هاست وارد شده معتبر نیست.",
    errEmail: "ایمیل وارد شده نامعتبر است.",
    errRequired: "پر کردن این فیلد اجباری است.",

    // Post-Install Guidance
    postInstallGuideTitle: "اقدام‌های ضروری پس از اتمام نصب",
    postInstallGuideSub: "پس از پایان نصب، پنل مشخصات سرورها را به عنوان پروفایل کلاستر فعال ذخیره می‌کند.",
    stepDbTitle: "۱. همگام‌سازی پروفایل اتصال کلاستر",
    stepDbDesc: "پروفایل چندسروره به صورت خودکار ذخیره شده و می‌توانید در بخش «ارتباط با سرور» وضعیت اتصال تمام نودها را چک کنید.",
    stepAdminTitle: "۲. ساخت کاربر مدیرکل و توکن ادمین",
    stepAdminDesc: "در بخش مدیریت کاربران یک کاربر مدیرکل ساخته و توکن آن را ذخیره کنید تا دسترسی به APIهای ساینپس فعال گردد."
  },
  es: {
    title: "Configurar Pila de Matrix Enterprise",
    subtitle: "Asistente paso a paso para configurar e implementar un clúster Matrix en un servidor único o distribuido.",
    step: "Paso",
    next: "Siguiente",
    back: "Atrás",
    cancel: "Cancelar",
    confirmInstall: "Confirmar e Iniciar Instalación",
    sourceTitle: "Fuente de Instalación",
    sourceDesc: "Especifique cómo desea obtener los paquetes necesarios para la instalación.",
    sourceOnline: "Instalación en Línea",
    sourceOnlineDesc: "Descargue todos los componentes dinámicamente de repositorios oficiales y GitHub.",
    sourceOffline: "Instalación Local / Fuera de Línea",
    sourceOfflineDesc: "Use archivos de paquetes locales y recursos pre-descargados.",
    offlineConfigLabel: "Ruta del archivo de configuración sin conexión (Opcional)",
    offlineConfigPlaceholder: "ej., /etc/matrix-stack.conf",
    offlineConfigHelp: "Si se especifica, los valores se cargarán por defecto.",
    offlineElementLabel: "Ruta del tarball de Element Web (Opcional)",
    offlineElementPlaceholder: "ej., /tmp/element-web.tar.gz",
    offlineSynapseDebLabel: "Carpeta de paquetes .deb de Synapse (Opcional)",
    offlineSynapseDebPlaceholder: "ej., /tmp/synapse_debs",
    serverTitle: "Topología de Despliegue y Nodos",
    serverDesc: "Especifique la arquitectura del clúster, las direcciones IP de los hosts y las rutas de dominio.",
    topologyTitle: "Arquitectura de Despliegue",
    topologyDesc: "Elija entre implementar todo en un servidor o distribuir Synapse, PostgreSQL y Element en hosts dedicados.",
    modeSingle: "Servidor Único (Todo en Uno)",
    modeSingleDesc: "Synapse, PostgreSQL y Element Web se ejecutan en el mismo host.",
    modeDistributed: "Clúster Distribuido Multi-Servidor",
    modeDistributedDesc: "Despliegue Synapse, PostgreSQL y Element Web en direcciones IP remotas dedicadas.",
    hsDomainLabel: "Dominio de Matrix Homeserver",
    hsDomainPlaceholder: "matrix.example.com",
    elementDomainLabel: "Dominio Frontend de Element Web",
    elementDomainPlaceholder: "chat.example.com",
    baseDomainLabel: "Dominio Base (para punteros Well-Known)",
    baseDomainPlaceholder: "example.com",
    publicIpLabel: "Dirección IP Pública del Servidor",
    publicIpPlaceholder: "ej., 198.51.100.42",
    leEmailLabel: "Correo Electrónico para SSL Let's Encrypt",
    leEmailPlaceholder: "admin@example.com",
    dbNotice: "Aviso de Base de Datos: PostgreSQL se configura automáticamente con nombres dedicados.",
    nodeSynapseTitle: "Nodo del Servidor Synapse (Homeserver)",
    nodeDbTitle: "Nodo del Servidor de Base de Datos (PostgreSQL)",
    nodeElementTitle: "Nodo del Servidor Element Web (Frontend)",
    nodeHostIp: "Host / Dirección IP del Servidor *",
    nodeSshPort: "Puerto SSH",
    nodeSshUser: "Usuario SSH",
    nodeAuthType: "Autenticación SSH",
    nodePassword: "Password SSH",
    nodePrivateKey: "Clave Privada SSH (PEM)",
    authPasswordLabel: "Contraseña",
    authKeyLabel: "Clave Privada",
    copySynapseCredentials: "Copiar credenciales SSH del nodo Synapse",
    credentialsCopied: "¡Credenciales SSH copiadas con éxito!",
    interNodeComms: "Conectividad Inter-Nodos y Enrutamiento",
    interNodeCommsDesc: "PostgreSQL autorizará automáticamente la IP de Synapse y Element se vinculará al homeserver.",
    dbNameLabel: "Nombre de BD",
    dbUserLabel: "Usuario de BD",
    dbPasswordLabel: "Contraseña de BD (en blanco = automática)",
    dbPortLabel: "Puerto de BD",
    detectedFromActiveConn: "Detectado del perfil de conexión activo",
    sslTitle: "Capa de Seguridad SSL/TLS",
    sslDesc: "Seleccione el método de cifrado para conexiones HTTPS seguras.",
    sslAuto: "Resolución Automática",
    sslAutoDesc: "Dominios internos usan autofirmado; públicos solicitan Let's Encrypt.",
    sslSelfSigned: "Forzar Certificados Autofirmados",
    sslSelfSignedDesc: "Cree un certificado autofirmado seguro de 10 años para VPN o redes privadas.",
    sslCustom: "Certificados PEM Personalizados",
    sslCustomDesc: "Especifique rutas a sus propios archivos de certificados SSL de confianza.",
    customCertLabel: "Ruta del archivo Fullchain PEM",
    customCertPlaceholder: "ej., /etc/ssl/certs/matrix.crt",
    customKeyLabel: "Ruta del archivo Private Key PEM",
    customKeyPlaceholder: "ej., /etc/ssl/private/matrix.key",
    customChainLabel: "Ruta del archivo CA Chain PEM (Opcional)",
    customChainPlaceholder: "ej., /etc/ssl/certs/ca-bundle.crt",
    elementTitle: "Element Web Frontend",
    elementDesc: "Configure la estrategia de implementación para el cliente Element Web.",
    elementOnline: "Distribución GitHub en Línea",
    elementOnlineDesc: "Descargue paquetes oficiales de Element directamente desde GitHub.",
    elementVersionLabel: "Versión Personalizada de Element (Opcional)",
    elementVersionPlaceholder: "ej., 1.11.55",
    elementOffline: "Archivo Tarball Local",
    elementOfflineDesc: "Aloje un archivo estático .tar.gz de Element Web precargado en el servidor.",
    elementOfflinePathLabel: "Ruta del archivo Tarball de Element",
    elementOfflinePathPlaceholder: "ej., /tmp/element-web.tar.gz",
    elementOfflineLabelLabel: "Etiqueta de versión sin conexión (Opcional)",
    elementOfflineLabelPlaceholder: "ej., v1.11.55",
    ldapTitle: "Directorio Empresarial (LDAP)",
    ldapDesc: "Habilite la integración con LDAP para permitir el inicio de sesión corporativo.",
    ldapCheckbox: "¿Configurar autenticación LDAP justo después de la instalación?",
    ldapNotice: "Si se marca, el asistente de LDAP se abrirá tras completar la instalación.",
    ldapUriLabel: "URI del Servidor LDAP",
    ldapUriPlaceholder: "ej., ldap://ldap.example.com:389",
    ldapBindDnLabel: "LDAP Bind DN",
    ldapBindDnPlaceholder: "ej., cn=admin,dc=example,dc=com",
    ldapBindPasswordLabel: "Contraseña LDAP Bind",
    ldapBindPasswordPlaceholder: "Ingrese la contraseña de la cuenta Bind DN",
    ldapBaseDnLabel: "DN Base de búsqueda de usuarios",
    ldapBaseDnPlaceholder: "ej., ou=users,dc=example,dc=com",
    summaryTitle: "Resumen de la Instalación",
    summaryDesc: "Revise detenidamente todos los parámetros antes de iniciar el despliegue automatizado.",
    confirmReady: "Sistema Listo para el Despliegue",
    confirmReadyDesc: "Todos los campos obligatorios han sido validados.",
    source: "Fuente",
    topology: "Topología",
    domains: "Dominios",
    ssl: "Modo SSL",
    element: "Element Web",
    ldap: "Auth LDAP",
    yes: "Sí",
    no: "No",
    online: "En línea",
    offline: "Fuera de línea",
    errDomain: "Ingrese un formato de dominio válido.",
    errIp: "Ingrese una dirección IP o host válido.",
    errEmail: "Ingrese un correo electrónico válido.",
    errRequired: "Este campo es obligatorio.",
    postInstallGuideTitle: "Pasos Obligatorios Después de la Instalación",
    postInstallGuideSub: "Siga estos pasos para conectar el panel a PostgreSQL:",
    stepDbTitle: "1. Credenciales de Base de Datos",
    stepDbDesc: "Verifique que el perfil del servidor tenga las credenciales de PostgreSQL correctas.",
    stepAdminTitle: "2. Registrar Usuario Administrador",
    stepAdminDesc: "Cree un usuario administrador de Synapse y guarde el token en 'Conexiones'."
  },
  ar: {
    title: "تكوين حزمة مصفوفة المؤسسات (Matrix Enterprise Stack)",
    subtitle: "معالج الإعداد لنشر مصفوفة ماتریکس على خادم فردي أو بيئة موزعة متعددة الخوادم.",
    step: "خطوة",
    next: "التالي",
    back: "السابق",
    cancel: "إلغاء",
    confirmInstall: "تأكيد وبدء التثبيت",
    sourceTitle: "مصدر التثبيت",
    sourceDesc: "حدد كيفية الحصول على حزم التثبيت المطلوبة.",
    sourceOnline: "التثبيت عبر الإنترنت (Online)",
    sourceOnlineDesc: "تنزيل جميع المكونات ديناميكيًا من المستودعات الرسمية وGitHub.",
    sourceOffline: "تثبيت محلي / غير متصل (Offline)",
    sourceOfflineDesc: "استخدام ملفات الحزم المحلية والأصول الثابتة مسبقة التنزيل.",
    offlineConfigLabel: "مسار ملف التكوين غير المتصل (اختياري)",
    offlineConfigPlaceholder: "مثال: /etc/matrix-stack.conf",
    offlineConfigHelp: "سيتم تحميل القيم من هذا الملف كقيم افتراضية.",
    offlineElementLabel: "مسار ملف Element Web المضغوط (اختياري)",
    offlineElementPlaceholder: "مثال: /tmp/element-web.tar.gz",
    offlineSynapseDebLabel: "مجلد حزم .deb لـ Synapse (اختياري)",
    offlineSynapseDebPlaceholder: "مثال: /tmp/synapse_debs",
    serverTitle: "بنية النشر وخوادم العقد",
    serverDesc: "حدد معمارية الكتلة وعناوين IP الخاصة بكل خدمة ونطاقات التوجيه.",
    topologyTitle: "معمارية النشر",
    topologyDesc: "اختر بين نشر جميع الخدمات على خادم واحد أو توزيع Synapse و PostgreSQL و Element على خوادم مخصصة.",
    modeSingle: "خادم فردي شامل (All-in-One)",
    modeSingleDesc: "يتم تشغيل Synapse و PostgreSQL و Element Web معًا على نفس الخادم.",
    modeDistributed: "عنقود موزع متعدد الخوادم (Distributed Cluster)",
    modeDistributedDesc: "نشر Synapse وقاعدة بيانات PostgreSQL و Element Web على عناوين IP منفصلة.",
    hsDomainLabel: "نطاق خادم ماتریکس (Matrix Homeserver)",
    hsDomainPlaceholder: "matrix.example.com",
    elementDomainLabel: "نطاق واجهة Element Web",
    elementDomainPlaceholder: "chat.example.com",
    baseDomainLabel: "النطاق الأساسي (لمؤشرات Well-Known)",
    baseDomainPlaceholder: "example.com",
    publicIpLabel: "عنوان IP العام للخادم",
    publicIpPlaceholder: "مثال: 198.51.100.42",
    leEmailLabel: "البريد الإلكتروني لشهادة SSL Let's Encrypt",
    leEmailPlaceholder: "admin@example.com",
    dbNotice: "ملاحظة قاعدة البيانات: يتم تكوين PostgreSQL تلقائيًا بأسماء وكلمات مرور آمنة.",
    nodeSynapseTitle: "خادم Synapse (عقدة Homeserver)",
    nodeDbTitle: "خادم قاعدة البيانات (عقدة PostgreSQL)",
    nodeElementTitle: "خادم واجهة Element Web",
    nodeHostIp: "عنوان المضيف / IP للخادم *",
    nodeSshPort: "منفذ SSH",
    nodeSshUser: "اسم مستخدم SSH",
    nodeAuthType: "طريقة مصادقة SSH",
    nodePassword: "كلمة مرور SSH",
    nodePrivateKey: "المفتاح الخاص لـ SSH (PEM)",
    authPasswordLabel: "كلمة المرور",
    authKeyLabel: "المفتاح الخاص",
    copySynapseCredentials: "نسخ بيانات اعتماد SSH من خادم Synapse",
    credentialsCopied: "تم نسخ بيانات اعتماد SSH بنجاح!",
    interNodeComms: "التوصيل والتوجيه بين العقد",
    interNodeCommsDesc: "سيتم تكوين PostgreSQL للسماح باتصالات خادم Synapse وربط Element بنطاق الخادم.",
    dbNameLabel: "اسم قاعدة البيانات",
    dbUserLabel: "مستخدم قاعدة البيانات",
    dbPasswordLabel: "كلمة مرور قاعدة البيانات (اترك فارغاً للإنشاء التلقائي)",
    dbPortLabel: "منفذ قاعدة البيانات",
    detectedFromActiveConn: "تم الاكتشاف تلقائيًا من ملف تعريف الاتصال النشط",
    sslTitle: "طبقة أمان SSL/TLS",
    sslDesc: "حدد طريقة التشفير لتأمين اتصالات HTTPS.",
    sslAuto: "تحديد تلقائي ذكي",
    sslAutoDesc: "النطاقات المحلية تستخدم شهادات موقعة ذاتيًا؛ العامة تطلب Let's Encrypt.",
    sslSelfSigned: "شهادات موقعة ذاتيًا",
    sslSelfSignedDesc: "إنشاء شهادة موقعة ذاتيًا صالحة لمدة 10 سنوات للشبكات الخاصة وVPN.",
    sslCustom: "شهادات PEM مخصصة",
    sslCustomDesc: "حدد مسارات ملفات شهادات SSL الموثوقة الخاصة بك.",
    customCertLabel: "مسار ملف Fullchain PEM",
    customCertPlaceholder: "مثال: /etc/ssl/certs/matrix.crt",
    customKeyLabel: "مسار ملف Private Key PEM",
    customKeyPlaceholder: "مثال: /etc/ssl/private/matrix.key",
    customChainLabel: "مسار ملف CA Chain PEM (اختياري)",
    customChainPlaceholder: "مثال: /etc/ssl/certs/ca-bundle.crt",
    elementTitle: "واجهة Element Web",
    elementDesc: "تكوين استراتيجية نشر عميل الدردشة Element Web.",
    elementOnline: "توزيع GitHub عبر الإنترنت",
    elementOnlineDesc: "تنزيل ونشر حزم إصدار Element مباشرة من GitHub.",
    elementVersionLabel: "إصدار Element مخصص (اختياري)",
    elementVersionPlaceholder: "مثال: 1.11.55",
    elementOffline: "أرشيف Tarball محلي",
    elementOfflineDesc: "استضافة أرشيف ثابت من Element Web تم تحميله مسبقًا على الخادم.",
    elementOfflinePathLabel: "مسار ملف Tarball لـ Element",
    elementOfflinePathPlaceholder: "مثال: /tmp/element-web.tar.gz",
    elementOfflineLabelLabel: "رمز الإصدار غير المتصل (اختياري)",
    elementOfflineLabelPlaceholder: "مثال: v1.11.55",
    ldapTitle: "دليل المؤسسة (LDAP)",
    ldapDesc: "تمكين تكامل LDAP للسماح للمستخدمين بتسجيل الدخول بحسابات الدليل.",
    ldapCheckbox: "هل تريد تكوين مصادقة LDAP فور اكتمال التثبيت؟",
    ldapNotice: "في حالة التحديد، سيتم فتح معالج LDAP مباشرة بعد انتهاء التثبيت الأساسي.",
    ldapUriLabel: "عنوان خادم LDAP (URI)",
    ldapUriPlaceholder: "مثال: ldap://ldap.example.com:389",
    ldapBindDnLabel: "LDAP Bind DN",
    ldapBindDnPlaceholder: "مثال: cn=admin,dc=example,dc=com",
    ldapBindPasswordLabel: "كلمة مرور LDAP Bind",
    ldapBindPasswordPlaceholder: "أدخل كلمة مرور حساب Bind DN",
    ldapBaseDnLabel: "DN الأساسي للبحث عن المستخدمين",
    ldapBaseDnPlaceholder: "مثال: ou=users,dc=example,dc=com",
    summaryTitle: "ملخص التثبيت",
    summaryDesc: "يرجى مراجعة كافة المعلمات بعناية قبل بدء النشر التلقائي.",
    confirmReady: "النظام جاهز للنشر",
    confirmReadyDesc: "تم التحقق من جميع الحقول الإلزامية.",
    source: "المصدر",
    topology: "معمارية النشر",
    domains: "النطاقات",
    ssl: "وضع SSL",
    element: "Element Web",
    ldap: "مصادقة LDAP",
    yes: "نعم",
    no: "لا",
    online: "عبر الإنترنت",
    offline: "محلي",
    errDomain: "يرجى إدخال تنسيق نطاق صالح.",
    errIp: "يرجى إدخال عنوان IP أو اسم مضيف صالح.",
    errEmail: "يرجى إدخال بريد إلكتروني صالح.",
    errRequired: "هذا الحقل مطلوب.",
    postInstallGuideTitle: "الخطوات الإلزامية بعد اكتمال التثبيت",
    postInstallGuideSub: "اتبع هذه الخطوات لتوصيل اللوحة بقاعدة بيانات PostgreSQL:",
    stepDbTitle: "1. حفظ بيانات اعتماد قاعدة البيانات",
    stepDbDesc: "تحقق من تطابق بيانات اعتماد قاعدة البيانات في ملف تعريف اتصال الخادم.",
    stepAdminTitle: "2. إنشاء مستخدم مسؤول",
    stepAdminDesc: "قم بإنشاء مستخدم مسؤول لـ Synapse وحفظ الرمز المميز في الاتصالات."
  },
  de: {
    title: "Matrix Enterprise Stack konfigurieren",
    subtitle: "Schritt-für-Schritt-Assistent zur Bereitstellung eines Matrix-Clusters auf einzelnen oder verteilten Servern.",
    step: "Schritt",
    next: "Weiter",
    back: "Zurück",
    cancel: "Abbrechen",
    confirmInstall: "Bestätigen & Installation starten",
    sourceTitle: "Installationsquelle",
    sourceDesc: "Geben Sie an, wie Sie die erforderlichen Pakete abrufen möchten.",
    sourceOnline: "Online-Installation",
    sourceOnlineDesc: "Alle Komponenten werden dynamisch von offiziellen Repositories und GitHub heruntergeladen.",
    sourceOffline: "Lokale / Offline-Installation",
    sourceOfflineDesc: "Lokale Paketdateien und vorgeladene Ressourcen verwenden.",
    offlineConfigLabel: "Offline-Konfigurationsdateipfad (Optional)",
    offlineConfigPlaceholder: "z.B., /etc/matrix-stack.conf",
    offlineConfigHelp: "Werte aus dieser Datei werden als Standardwerte geladen.",
    offlineElementLabel: "Element Web Tarball-Pfad (Optional)",
    offlineElementPlaceholder: "z.B., /tmp/element-web.tar.gz",
    offlineSynapseDebLabel: "Synapse .deb Paketordner (Optional)",
    offlineSynapseDebPlaceholder: "z.B., /tmp/synapse_debs",
    serverTitle: "Bereitstellungstopologie & Zielknoten",
    serverDesc: "Legen Sie die Cluster-Architektur, Host-IP-Adressen für jeden Dienst und Domain-Routen fest.",
    topologyTitle: "Bereitstellungsarchitektur",
    topologyDesc: "Wählen Sie, ob alle Dienste auf einem Server oder auf dedizierten Hosts bereitgestellt werden.",
    modeSingle: "Einzelsystem (All-in-One)",
    modeSingleDesc: "Synapse, PostgreSQL und Element Web laufen auf demselben Host.",
    modeDistributed: "Verteilter Multi-Server-Cluster",
    modeDistributedDesc: "Verteilen Sie Synapse, PostgreSQL und Element Web auf dedizierte Remote-IP-Adressen.",
    hsDomainLabel: "Matrix Homeserver Domain",
    hsDomainPlaceholder: "matrix.example.com",
    elementDomainLabel: "Element Web Frontend Domain",
    elementDomainPlaceholder: "chat.example.com",
    baseDomainLabel: "Basis-Domain (für Well-Known-Zeiger)",
    baseDomainPlaceholder: "example.com",
    publicIpLabel: "Öffentliche Server-IP-Adresse",
    publicIpPlaceholder: "z.B., 198.51.100.42",
    leEmailLabel: "Benachrichtigungs- / SSL Let's Encrypt E-Mail",
    leEmailPlaceholder: "admin@example.com",
    dbNotice: "Datenbankhinweis: PostgreSQL wird automatisch mit dedizierten Namen und sicheren Passwörtern konfiguriert.",
    nodeSynapseTitle: "Synapse Server Node (Homeserver)",
    nodeDbTitle: "Datenbank Server Node (PostgreSQL DB)",
    nodeElementTitle: "Element Web Server Node (Frontend)",
    nodeHostIp: "Server Host / IP-Adresse *",
    nodeSshPort: "SSH-Port",
    nodeSshUser: "SSH-Benutzername",
    nodeAuthType: "SSH-Authentifizierung",
    nodePassword: "SSH-Passwort",
    nodePrivateKey: "Privater SSH-Schlüssel (PEM)",
    authPasswordLabel: "Passwort",
    authKeyLabel: "Privater Schlüssel",
    copySynapseCredentials: "SSH-Zugangsdaten vom Synapse-Knoten kopieren",
    credentialsCopied: "SSH-Zugangsdaten erfolgreich kopiert!",
    interNodeComms: "Interknoten-Konnektivität & Firewall-Routing",
    interNodeCommsDesc: "PostgreSQL erlaubt automatisch die Synapse-IP und Element verbindet sich mit dem Homeserver.",
    dbNameLabel: "Datenbankname",
    dbUserLabel: "Datenbankbenutzer",
    dbPasswordLabel: "Datenbankpasswort (leer = automatisch)",
    dbPortLabel: "Datenbankport",
    detectedFromActiveConn: "Aus aktivem Verbindungsprofil erkannt",
    sslTitle: "SSL/TLS-Sicherheitsschicht",
    sslDesc: "Wählen Sie die Verschlüsselungsmethode für sichere HTTPS-Verbindungen.",
    sslAuto: "Automatische Erkennung",
    sslAutoDesc: "Interne Domains erhalten selbstsignierte Zertifikate; öffentliche fordern Let's Encrypt an.",
    sslSelfSigned: "Selbstsignierte Zertifikate erzwingen",
    sslSelfSignedDesc: "Erstellen Sie ein sicheres 10-Jahres-Zertifikat für private Netzwerke oder VPNs.",
    sslCustom: "Benutzerdefinierte PEM-Zertifikate",
    sslCustomDesc: "Geben Sie Pfade zu Ihren eigenen SSL-Zertifikatsdateien an.",
    customCertLabel: "Fullchain PEM Dateipfad",
    customCertPlaceholder: "z.B., /etc/ssl/certs/matrix.crt",
    customKeyLabel: "Private Key PEM Dateipfad",
    customKeyPlaceholder: "z.B., /etc/ssl/private/matrix.key",
    customChainLabel: "CA Chain Zertifikatsdateipfad (Optional)",
    customChainPlaceholder: "z.B., /etc/ssl/certs/ca-bundle.crt",
    elementTitle: "Element Web Frontend",
    elementDesc: "Konfigurieren Sie die Bereitstellungsstrategie für Element Web.",
    elementOnline: "Online GitHub-Verteilung",
    elementOnlineDesc: "Standard-Element-Release-Pakete direkt von GitHub herunterladen.",
    elementVersionLabel: "Benutzerdefinierte Element-Version (Optional)",
    elementVersionPlaceholder: "z.B., 1.11.55",
    elementOffline: "Lokales Tarball-Archiv",
    elementOfflineDesc: "Statisches .tar.gz-Archiv von Element Web auf dem Server bereitstellen.",
    elementOfflinePathLabel: "Lokaler Element Tarball-Dateipfad",
    elementOfflinePathPlaceholder: "z.B., /tmp/element-web.tar.gz",
    elementOfflineLabelLabel: "Offline-Versions-Tag (Optional)",
    elementOfflineLabelPlaceholder: "z.B., v1.11.55",
    ldapTitle: "Unternehmensverzeichnis (LDAP)",
    ldapDesc: "Aktivieren Sie die LDAP-Integration für Unternehmensbenutzer.",
    ldapCheckbox: "LDAP-Authentifizierung direkt nach der Installation konfigurieren?",
    ldapNotice: "Wenn aktiviert, öffnet sich der LDAP-Assistent nach Abschluss der Hauptinstallation.",
    ldapUriLabel: "LDAP-Server-URI",
    ldapUriPlaceholder: "z.B., ldap://ldap.example.com:389",
    ldapBindDnLabel: "LDAP Bind DN",
    ldapBindDnPlaceholder: "z.B., cn=admin,dc=example,dc=com",
    ldapBindPasswordLabel: "LDAP Bind-Passwort",
    ldapBindPasswordPlaceholder: "Passwort für das Bind DN-Konto",
    ldapBaseDnLabel: "Basis-DN für Benutzersuche",
    ldapBaseDnPlaceholder: "z.B., ou=users,dc=example,dc=com",
    summaryTitle: "Installationszusammenfassung",
    summaryDesc: "Überprüfen Sie alle Parameter sorgfältig vor dem Start.",
    confirmReady: "Bereit für unbeaufsichtigte Bereitstellung",
    confirmReadyDesc: "Alle Pflichtfelder wurden erfolgreich validiert.",
    source: "Quelle",
    topology: "Topologie",
    domains: "Domains",
    ssl: "SSL-Modus",
    element: "Element Web",
    ldap: "LDAP-Auth",
    yes: "Ja",
    no: "Nein",
    online: "Online",
    offline: "Offline",
    errDomain: "Bitte geben Sie ein gültiges Domainformat ein.",
    errIp: "Bitte geben Sie eine gültige IP-Adresse oder einen Hostnamen ein.",
    errEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    errRequired: "Dieses Feld ist erforderlich.",
    postInstallGuideTitle: "Obligatorische Schritte nach Abschluss",
    postInstallGuideSub: "Verbinden Sie das Panel mit PostgreSQL:",
    stepDbTitle: "1. Datenbank Zugangsdaten prüfen",
    stepDbDesc: "Überprüfen Sie die PostgreSQL-Zugangsdaten im Serververbindungsprofil.",
    stepAdminTitle: "2. Synapse-Admin-Benutzer registrieren",
    stepAdminDesc: "Erstellen Sie ein Administratorkonto und speichern Sie das Admin-Token."
  },
  ru: {
    title: "Настройка пакета Matrix Enterprise",
    subtitle: "Пошаговый мастер настройки и развертывания кластера Matrix на одном или нескольких распределенных серверах.",
    step: "Шаг",
    next: "Далее",
    back: "Назад",
    cancel: "Отмена",
    confirmInstall: "Подтвердить и начать установку",
    sourceTitle: "Источник установки",
    sourceDesc: "Укажите, как вы хотите получить необходимые пакеты для установки.",
    sourceOnline: "Онлайн-установка",
    sourceOnlineDesc: "Динамически загружайте все компоненты из официальных репозиториев и GitHub.",
    sourceOffline: "Локальная / офлайн-установка",
    sourceOfflineDesc: "Используйте локальные файлы пакетов и предварительно загруженные ресурсы.",
    offlineConfigLabel: "Путь к файлу конфигурации офлайн (Необязательно)",
    offlineConfigPlaceholder: "например, /etc/matrix-stack.conf",
    offlineConfigHelp: "Значения из этого файла будут загружены по умолчанию.",
    offlineElementLabel: "Путь к архиву Element Web офлайн (Необязательно)",
    offlineElementPlaceholder: "например, /tmp/element-web.tar.gz",
    offlineSynapseDebLabel: "Папка с пакетами .deb Synapse (Необязательно)",
    offlineSynapseDebPlaceholder: "например, /tmp/synapse_debs",
    serverTitle: "Топология развертывания и целевые узлы",
    serverDesc: "Укажите архитектуру кластера, IP-адреса хостов для каждой службы и маршрутизацию доменов.",
    topologyTitle: "Архитектура развертывания",
    topologyDesc: "Выберите: развернуть все службы на одном сервере или распределить Synapse, PostgreSQL и Element по отдельным хостам.",
    modeSingle: "Один сервер (All-in-One)",
    modeSingleDesc: "Synapse, PostgreSQL и Element Web работают на одном общем хосте.",
    modeDistributed: "Распределенный мультисерверный кластер",
    modeDistributedDesc: "Развертывание Synapse, PostgreSQL и Element Web на выделенных IP-адресах.",
    hsDomainLabel: "Домен Matrix Homeserver",
    hsDomainPlaceholder: "matrix.example.com",
    elementDomainLabel: "Домен Element Web Frontend",
    elementDomainPlaceholder: "chat.example.com",
    baseDomainLabel: "Базовый домен (для Well-Known указателей)",
    baseDomainPlaceholder: "example.com",
    publicIpLabel: "Публичный IP-адрес сервера",
    publicIpPlaceholder: "например, 198.51.100.42",
    leEmailLabel: "Электронная почта Let's Encrypt",
    leEmailPlaceholder: "admin@example.com",
    dbNotice: "Уведомление о БД: PostgreSQL настраивается автоматически с безопасными паролями.",
    nodeSynapseTitle: "Узел сервера Synapse (Homeserver)",
    nodeDbTitle: "Узел сервера базы данных (PostgreSQL)",
    nodeElementTitle: "Узел сервера Element Web (Frontend)",
    nodeHostIp: "Хост / IP-адрес сервера *",
    nodeSshPort: "Порт SSH",
    nodeSshUser: "Имя пользователя SSH",
    nodeAuthType: "Метод аутентификации SSH",
    nodePassword: "Password SSH",
    nodePrivateKey: "Приватный ключ SSH (PEM)",
    authPasswordLabel: "Пароль",
    authKeyLabel: "Приватный ключ",
    copySynapseCredentials: "Скопировать данные SSH с узла Synapse",
    credentialsCopied: "Данные SSH успешно скопированы!",
    interNodeComms: "Межузловая связь и маршрутизация",
    interNodeCommsDesc: "PostgreSQL автоматически разрешит подключения от IP-адреса Synapse, а Element подключится к homeserver.",
    dbNameLabel: "Имя БД",
    dbUserLabel: "Пользователь БД",
    dbPasswordLabel: "Пароль БД (пусто = автогенерация)",
    dbPortLabel: "Порт БД",
    detectedFromActiveConn: "Определено из активного профиля подключения",
    sslTitle: "Уровень безопасности SSL/TLS",
    sslDesc: "Выберите метод шифрования для безопасных соединений HTTPS.",
    sslAuto: "Автоматическое разрешение",
    sslAutoDesc: "Внутренние домены получают самоподписанные сертификаты; публичные запрашивают Let's Encrypt.",
    sslSelfSigned: "Принудительные самоподписанные сертификаты",
    sslSelfSignedDesc: "Создайте безопасный самоподписанный сертификат на 10 лет для VPN.",
    sslCustom: "Пользовательские сертификаты PEM",
    sslCustomDesc: "Укажите пути к собственным доверенным файлам SSL-сертификатов.",
    customCertLabel: "Путь к файлу Fullchain PEM",
    customCertPlaceholder: "например, /etc/ssl/certs/matrix.crt",
    customKeyLabel: "Путь к файлу Private Key PEM",
    customKeyPlaceholder: "например, /etc/ssl/private/matrix.key",
    customChainLabel: "Путь к файлу CA Chain PEM (Необязательно)",
    customChainPlaceholder: "например, /etc/ssl/certs/ca-bundle.crt",
    elementTitle: "Element Web Frontend",
    elementDesc: "Настройте стратегию развертывания чат-клиента Element Web.",
    elementOnline: "Онлайн-дистрибуция GitHub",
    elementOnlineDesc: "Загружайте стандартные релизы Element прямо из GitHub.",
    elementVersionLabel: "Пользовательская версия Element (Необязательно)",
    elementVersionPlaceholder: "например, 1.11.55",
    elementOffline: "Локальный архив Tarball",
    elementOfflineDesc: "Разместите статический архив Element Web, предварительно загруженный на сервер.",
    elementOfflinePathLabel: "Путь к локальному архиву Tarball Element",
    elementOfflinePathPlaceholder: "например, /tmp/element-web.tar.gz",
    elementOfflineLabelLabel: "Тег офлайн-версии (Необязательно)",
    elementOfflineLabelPlaceholder: "например, v1.11.55",
    ldapTitle: "Корпоративный каталог (LDAP)",
    ldapDesc: "Включите интеграцию LDAP для корпоративных пользователей.",
    ldapCheckbox: "Настроить авторизацию LDAP сразу после завершения установки?",
    ldapNotice: "Если отмечено, мастер LDAP откроется сразу после завершения установки.",
    ldapUriLabel: "URI сервера LDAP",
    ldapUriPlaceholder: "например, ldap://ldap.example.com:389",
    ldapBindDnLabel: "LDAP Bind DN",
    ldapBindDnPlaceholder: "например, cn=admin,dc=example,dc=com",
    ldapBindPasswordLabel: "Пароль LDAP Bind",
    ldapBindPasswordPlaceholder: "Введите пароль для учетной записи Bind DN",
    ldapBaseDnLabel: "Базовый DN поиска пользователей",
    ldapBaseDnPlaceholder: "например, ou=users,dc=example,dc=com",
    summaryTitle: "Сводка установки",
    summaryDesc: "Внимательно проверьте все параметры перед автоматическим запуском.",
    confirmReady: "Система готова к развертыванию",
    confirmReadyDesc: "Все обязательные поля проверены.",
    source: "Источник",
    topology: "Топология",
    domains: "Домены",
    ssl: "Режим SSL",
    element: "Element Web",
    ldap: "Авторизация LDAP",
    yes: "Да",
    no: "Нет",
    online: "Онлайн",
    offline: "Офлайн",
    errDomain: "Пожалуйста, введите корректный формат домена.",
    errIp: "Пожалуйста, введите корректный IP-адрес или имя хоста.",
    errEmail: "Пожалуйста, введите корректный адрес электронной почты.",
    errRequired: "Это поле обязательно для заполнения.",
    postInstallGuideTitle: "Обязательные шаги после завершения",
    postInstallGuideSub: "Подключите панель к PostgreSQL:",
    stepDbTitle: "1. Проверка данных БД",
    stepDbDesc: "Убедитесь, что данные PostgreSQL указаны в профиле сервера.",
    stepAdminTitle: "2. Регистрация администратора",
    stepAdminDesc: "Создайте аккаунт администратора Synapse и сохраните токен."
  }
};
