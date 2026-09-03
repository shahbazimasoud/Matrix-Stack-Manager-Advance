import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, AlertCircle, ShieldCheck, ChevronRight, ChevronLeft, 
  Terminal, Globe, Key, CloudDownload, FileText, CheckCircle, 
  Server, ArrowRight, Database, Layers, Network, Copy, CheckCheck,
  RotateCw, Sparkles
} from 'lucide-react';
import { wizardTranslations } from './installWizard/translations';

interface InstallWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: any) => void;
  lang: string;
  isLightMode: boolean;
  defaultHost?: string;
  defaultDomain?: string;
  activeConnection?: any;
  connections?: any[];
}

export const InstallWizardModal: React.FC<InstallWizardModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  lang,
  isLightMode,
  defaultHost = '127.0.0.1',
  defaultDomain = 'example.com',
  activeConnection,
  connections = []
}) => {
  const t = wizardTranslations[lang] || wizardTranslations.en;
  const isRtl = lang === 'fa' || lang === 'ar';

  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [copiedDbNotice, setCopiedDbNotice] = useState(false);
  const [copiedElNotice, setCopiedElNotice] = useState(false);

  // STEP 1: Installation Source
  const [installSource, setInstallSource] = useState<'online' | 'offline'>('online');
  const [offlineConfigPath, setOfflineConfigPath] = useState('');
  const [offlineElementPath, setOfflineElementPath] = useState('');
  const [offlineSynapseDebDir, setOfflineSynapseDebDir] = useState('');

  // STEP 2: Deployment Topology & Target Nodes
  const [deploymentMode, setDeploymentMode] = useState<'single' | 'distributed'>('single');

  // Domains & Routing
  const [hsDomain, setHsDomain] = useState('');
  const [elementDomain, setElementDomain] = useState('');
  const [baseDomain, setBaseDomain] = useState('');
  const [publicIp, setPublicIp] = useState('');
  const [leEmail, setLeEmail] = useState('');
  const [hasManuallyEditedHs, setHasManuallyEditedHs] = useState(false);
  const [hasManuallyEditedElement, setHasManuallyEditedElement] = useState(false);

  // Synapse Node (Distributed / Dedicated)
  const [synapseHost, setSynapseHost] = useState('');
  const [synapsePort, setSynapsePort] = useState(22);
  const [synapseUsername, setSynapseUsername] = useState('root');
  const [synapseAuthType, setSynapseAuthType] = useState<'password' | 'privateKey'>('password');
  const [synapsePassword, setSynapsePassword] = useState('');
  const [synapsePrivateKey, setSynapsePrivateKey] = useState('');

  // Database Node (Distributed / Dedicated)
  const [dbHost, setDbHost] = useState('');
  const [dbSshPort, setDbSshPort] = useState(22);
  const [dbUsername, setDbUsername] = useState('root');
  const [dbAuthType, setDbAuthType] = useState<'password' | 'privateKey'>('password');
  const [dbSshPassword, setDbSshPassword] = useState('');
  const [dbPrivateKey, setDbPrivateKey] = useState('');
  const [dbName, setDbName] = useState('synapse');
  const [dbUser, setDbUser] = useState('synapse_user');
  const [dbPass, setDbPass] = useState('');
  const [dbPostgresPort, setDbPostgresPort] = useState(5432);

  // Element Node (Distributed / Dedicated)
  const [elementHost, setElementHost] = useState('');
  const [elementSshPort, setElementSshPort] = useState(22);
  const [elementUsername, setElementUsername] = useState('root');
  const [elementAuthType, setElementAuthType] = useState<'password' | 'privateKey'>('password');
  const [elementSshPassword, setElementSshPassword] = useState('');
  const [elementPrivateKey, setElementPrivateKey] = useState('');

  // STEP 3: SSL Settings
  const [sslMode, setSslMode] = useState<'auto' | 'selfsigned' | 'custom'>('auto');
  const [customCertPem, setCustomCertPem] = useState('');
  const [customKeyPem, setCustomKeyPem] = useState('');
  const [customChainPem, setCustomChainPem] = useState('');

  // STEP 4: Element Web Installation
  const [elementInstallMode, setElementInstallMode] = useState<'online' | 'offline'>('online');
  const [elementOnlineVersion, setElementOnlineVersion] = useState('');
  const [elementOfflinePathVal, setElementOfflinePathVal] = useState('');
  const [elementOfflineVersionLabel, setElementOfflineVersionLabel] = useState('');

  // STEP 5: LDAP Settings
  const [ldapConfigureNow, setLdapConfigureNow] = useState(false);
  const [ldapUri, setLdapUri] = useState('');
  const [ldapBindDn, setLdapBindDn] = useState('');
  const [ldapBindPassword, setLdapBindPassword] = useState('');
  const [ldapBaseDn, setLdapBaseDn] = useState('');

  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [profileLoadedNotice, setProfileLoadedNotice] = useState<string | null>(null);

  // Load connection profile data into wizard inputs
  const loadProfileData = (conn: any) => {
    if (!conn) return;

    // Multi-node auto-detection if connection has cluster info or separate DB host
    const isCluster = conn.deploymentMode === 'distributed' ||
      Boolean(conn.databaseNode?.host || conn.elementNode?.host || (conn.dbHost && conn.dbHost !== '127.0.0.1' && conn.dbHost !== 'localhost'));
    if (isCluster) {
      setDeploymentMode('distributed');
    }

    // Domains & Networking
    const domainVal = conn.domain || conn.baseDomain || defaultDomain || '';
    if (domainVal) setBaseDomain(domainVal);
    if (conn.hsDomain) {
      setHsDomain(conn.hsDomain);
    } else if (domainVal) {
      setHsDomain(`matrix.${domainVal}`);
    }
    if (conn.elementDomain) {
      setElementDomain(conn.elementDomain);
    } else if (domainVal) {
      setElementDomain(`chat.${domainVal}`);
    }
    if (conn.host) setPublicIp(conn.host);

    // 1. Synapse Node
    const syn = conn.synapseNode || conn;
    setSynapseHost(syn.host || conn.host || '');
    setSynapsePort(Number(syn.port || conn.port) || 22);
    setSynapseUsername(syn.username !== undefined ? syn.username : (conn.username || 'root'));
    const synAuth = syn.authType || conn.authType || 'password';
    setSynapseAuthType(synAuth === 'key' ? 'privateKey' : 'password');
    setSynapsePassword(syn.password !== undefined ? syn.password : (conn.password || ''));
    setSynapsePrivateKey(syn.privateKey !== undefined ? syn.privateKey : (conn.privateKey || ''));

    // 2. Database Node
    const db = conn.databaseNode || {};
    setDbHost(db.host || conn.dbHost || '');
    setDbSshPort(Number(db.port) || 22);
    setDbUsername(db.username !== undefined ? db.username : 'root');
    const dbAuth = db.authType || 'password';
    setDbAuthType(dbAuth === 'key' ? 'privateKey' : 'password');
    setDbSshPassword(db.password !== undefined ? db.password : '');
    setDbPrivateKey(db.privateKey !== undefined ? db.privateKey : '');
    setDbName(db.dbName || conn.dbName || 'synapse');
    setDbUser(db.dbUser || conn.dbUser || 'synapse_user');
    setDbPass(db.dbPass !== undefined ? db.dbPass : (conn.dbPass || ''));
    setDbPostgresPort(Number(db.dbPort || conn.dbPort) || 5432);

    // 3. Element Web Node
    const elem = conn.elementNode || {};
    setElementHost(elem.host || '');
    setElementSshPort(Number(elem.port) || 22);
    setElementUsername(elem.username !== undefined ? elem.username : 'root');
    const elemAuth = elem.authType || 'password';
    setElementAuthType(elemAuth === 'key' ? 'privateKey' : 'password');
    setElementSshPassword(elem.password !== undefined ? elem.password : '');
    setElementPrivateKey(elem.privateKey !== undefined ? elem.privateKey : '');
  };

  // Initialize and auto pre-populate values when modal opens or activeConnection changes
  useEffect(() => {
    if (isOpen) {
      const activeConn = activeConnection || (connections && connections.find((c: any) => c.isActive)) || (connections && connections[0]);
      if (activeConn) {
        setSelectedProfileId(activeConn.id || '');
        loadProfileData(activeConn);
      } else {
        const initBase = defaultDomain || 'example.com';
        const initHost = defaultHost || '127.0.0.1';

        if (!baseDomain) setBaseDomain(initBase);
        if (!hsDomain) setHsDomain(initBase ? `matrix.${initBase}` : 'matrix.example.com');
        if (!elementDomain) setElementDomain(initBase ? `chat.${initBase}` : 'chat.example.com');
        if (!publicIp) setPublicIp(initHost);
        if (!leEmail) setLeEmail(`admin@${initBase}`);
        if (!synapseHost) setSynapseHost(initHost);
      }
    }
  }, [isOpen, activeConnection]);

  if (!isOpen) return null;

  // Copy Synapse SSH credentials to Database Node
  const handleCopyCredentialsToDb = () => {
    setDbUsername(synapseUsername);
    setDbAuthType(synapseAuthType);
    setDbSshPassword(synapsePassword);
    setDbPrivateKey(synapsePrivateKey);
    setCopiedDbNotice(true);
    setTimeout(() => setCopiedDbNotice(false), 3000);
  };

  // Copy Synapse SSH credentials to Element Node
  const handleCopyCredentialsToElement = () => {
    setElementUsername(synapseUsername);
    setElementAuthType(synapseAuthType);
    setElementSshPassword(synapsePassword);
    setElementPrivateKey(synapsePrivateKey);
    setCopiedElNotice(true);
    setTimeout(() => setCopiedElNotice(false), 3000);
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    const domainRegex = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (step === 2) {
      if (hsDomain.trim() && !domainRegex.test(hsDomain.trim())) errors.hsDomain = t.errDomain;
      if (elementDomain.trim() && !domainRegex.test(elementDomain.trim())) errors.elementDomain = t.errDomain;
      if (baseDomain.trim() && !domainRegex.test(baseDomain.trim())) errors.baseDomain = t.errDomain;
      if (leEmail.trim() && !emailRegex.test(leEmail.trim())) errors.leEmail = t.errEmail;

      if (deploymentMode === 'distributed') {
        if (!synapseHost.trim()) errors.synapseHost = t.errRequired;
        if (!dbHost.trim()) errors.dbHost = t.errRequired;
        if (!elementHost.trim()) errors.elementHost = t.errRequired;
      }
    }

    if (step === 3 && sslMode === 'custom') {
      if (!customCertPem.trim()) errors.customCertPem = t.errRequired;
      if (!customKeyPem.trim()) errors.customKeyPem = t.errRequired;
    }

    if (step === 4 && elementInstallMode === 'offline') {
      if (!elementOfflinePathVal.trim()) errors.elementOfflinePath = t.errRequired;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleFinalConfirm = () => {
    if (!validateStep(2) || !validateStep(3) || !validateStep(4) || !validateStep(5)) {
      return;
    }

    const effectiveHsDomain = hsDomain.trim() || (defaultDomain ? `matrix.${defaultDomain}` : 'matrix.example.com');
    const effectiveElementDomain = elementDomain.trim() || (defaultDomain ? `chat.${defaultDomain}` : 'chat.example.com');
    const effectiveBaseDomain = baseDomain.trim() || defaultDomain || 'example.com';
    const effectivePublicIp = (deploymentMode === 'distributed' ? synapseHost.trim() : publicIp.trim()) || defaultHost || '127.0.0.1';
    const effectiveLeEmail = leEmail.trim() || `admin@${defaultDomain || 'example.com'}`;

    const effectiveLdapUri = ldapUri.trim() || 'ldap://localhost:389';
    const effectiveLdapBindDn = ldapBindDn.trim() || 'cn=admin,dc=example,dc=com';
    const effectiveLdapBaseDn = ldapBaseDn.trim() || 'ou=users,dc=example,dc=com';

    // Build the final deployment config
    const finalConfig: any = {
      deploymentMode,
      HS_DOMAIN: effectiveHsDomain,
      ELEMENT_DOMAIN: effectiveElementDomain,
      BASE_DOMAIN: effectiveBaseDomain,
      PUBLIC_IP: effectivePublicIp,
      LE_EMAIL: effectiveLeEmail,
    };

    if (deploymentMode === 'distributed') {
      const resolvedSynPass = synapsePassword || dbSshPassword || elementSshPassword;
      const resolvedSynKey = synapsePrivateKey || dbPrivateKey || elementPrivateKey;

      finalConfig.synapseNode = {
        host: synapseHost.trim() || effectivePublicIp,
        port: Number(synapsePort) || 22,
        username: synapseUsername.trim() || 'root',
        authType: synapseAuthType,
        password: resolvedSynPass,
        privateKey: resolvedSynKey,
      };

      finalConfig.databaseNode = {
        host: dbHost.trim(),
        port: Number(dbSshPort) || 22,
        username: dbUsername.trim() || 'root',
        authType: dbAuthType,
        password: dbSshPassword || resolvedSynPass,
        privateKey: dbPrivateKey || resolvedSynKey,
        dbName: dbName.trim() || 'synapse',
        dbUser: dbUser.trim() || 'synapse_user',
        dbPass: dbPass.trim(),
        dbPort: Number(dbPostgresPort) || 5432,
      };

      finalConfig.elementNode = {
        host: elementHost.trim(),
        port: Number(elementSshPort) || 22,
        username: elementUsername.trim() || 'root',
        authType: elementAuthType,
        password: elementSshPassword || resolvedSynPass,
        privateKey: elementPrivateKey || resolvedSynKey,
      };
    }

    // SSL Configuration
    if (sslMode === 'auto') {
      const isLocal = effectiveHsDomain.includes('.local') || effectiveHsDomain.includes('.lan') || effectiveHsDomain.includes('.internal') || effectiveHsDomain.includes('localhost');
      finalConfig.SSL_MODE = isLocal ? 'selfsigned' : 'letsencrypt';
    } else if (sslMode === 'selfsigned') {
      finalConfig.SSL_MODE = 'selfsigned';
    } else if (sslMode === 'custom') {
      finalConfig.SSL_MODE = 'custom';
      finalConfig.CUSTOM_CERT_PEM = customCertPem.trim();
      finalConfig.CUSTOM_KEY_PEM = customKeyPem.trim();
      if (customChainPem.trim()) finalConfig.CUSTOM_CHAIN_PEM = customChainPem.trim();
    }

    // Offline / Online Source
    if (installSource === 'offline') {
      if (offlineConfigPath.trim()) finalConfig.OFFLINE_CONFIG_PATH = offlineConfigPath.trim();
      if (offlineElementPath.trim()) finalConfig.OFFLINE_ELEMENT_PKG = offlineElementPath.trim();
      if (offlineSynapseDebDir.trim()) finalConfig.OFFLINE_SYNAPSE_DEB_DIR = offlineSynapseDebDir.trim();
    }

    // Element Web mode
    if (elementInstallMode === 'offline') {
      finalConfig.OFFLINE_ELEMENT_PKG = elementOfflinePathVal.trim();
      if (elementOfflineVersionLabel.trim()) finalConfig.ELEMENT_VERSION = elementOfflineVersionLabel.trim();
    } else {
      if (elementOnlineVersion.trim()) finalConfig.ELEMENT_VERSION = elementOnlineVersion.trim();
    }

    // LDAP switch
    if (ldapConfigureNow) {
      finalConfig.LDAP_NOW = 'y';
      finalConfig.LDAP_URI = effectiveLdapUri;
      finalConfig.LDAP_BIND_DN = effectiveLdapBindDn;
      finalConfig.LDAP_BIND_PASS = ldapBindPassword.trim();
      finalConfig.LDAP_BIND_PASSWORD = ldapBindPassword.trim();
      finalConfig.LDAP_BASE_DC = effectiveLdapBaseDn;
      finalConfig.LDAP_BASE = effectiveLdapBaseDn;
      finalConfig.LDAP_MODE = 'search';
      finalConfig.LDAP_UID_ATTR = 'sAMAccountName';
      finalConfig.LDAP_MAIL_ATTR = 'mail';
      finalConfig.LDAP_NAME_ATTR = 'displayName';
      finalConfig.LDAP_START_TLS = 'false';
    } else {
      finalConfig.LDAP_NOW = 'n';
    }

    onConfirm(finalConfig);
  };

  const stepsList = [
    { id: 1, name: t.sourceTitle },
    { id: 2, name: t.serverTitle },
    { id: 3, name: t.sslTitle },
    { id: 4, name: t.elementTitle },
    { id: 5, name: t.ldapTitle },
    { id: 6, name: t.summaryTitle }
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 backdrop-blur-md overflow-y-auto transition-colors duration-300 ${isLightMode ? 'bg-slate-900/40' : 'bg-slate-950/80'}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className={`relative w-full max-w-5xl border rounded-3xl flex flex-col max-h-[92vh] overflow-hidden transition-all duration-300 ${
          isLightMode 
            ? 'bg-white border-slate-200 shadow-2xl shadow-slate-300/60' 
            : 'bg-slate-900 border-white/10 shadow-2xl shadow-black/80'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between transition-colors duration-300 ${
          isLightMode ? 'border-slate-100 bg-slate-50/50' : 'border-white/5 bg-slate-950/40'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border transition-colors ${
              isLightMode 
                ? 'bg-rose-50 border-rose-100 text-rose-600 shadow-sm' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-xl font-black transition-colors duration-300 ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                {t.title}
              </h2>
              <p className={`text-xs mt-0.5 max-w-xl transition-colors duration-300 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.subtitle}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isLightMode 
                ? 'border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700' 
                : 'border-white/10 hover:bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className={`px-6 py-3 border-b flex items-center justify-between overflow-x-auto gap-2 transition-colors duration-300 ${
          isLightMode ? 'border-slate-100 bg-slate-100/50' : 'border-white/5 bg-slate-950/20'
        }`}>
          {stepsList.map((step) => {
            const isActive = currentStep === step.id;
            const isDone = currentStep > step.id;

            return (
              <div 
                key={step.id} 
                className={`flex items-center gap-2 whitespace-nowrap text-xs transition-all ${
                  isActive 
                    ? isLightMode ? 'text-rose-600 font-bold' : 'text-rose-400 font-bold' 
                    : isDone 
                      ? isLightMode ? 'text-emerald-600 font-medium' : 'text-emerald-400 font-medium' 
                      : isLightMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border transition-all ${
                  isActive 
                    ? isLightMode 
                      ? 'bg-rose-500 text-white border-rose-500 ring-2 ring-rose-500/20' 
                      : 'bg-rose-500 text-white border-rose-500 ring-2 ring-rose-500/20'
                    : isDone 
                      ? isLightMode 
                        ? 'bg-emerald-100 border-emerald-200 text-emerald-700' 
                        : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                      : isLightMode ? 'bg-white border-slate-200 text-slate-400' : 'bg-slate-900 border-white/10 text-slate-600'
                }`}>
                  {isDone ? <Check className="w-3.5 h-3.5" /> : step.id}
                </span>
                <span className="hidden sm:inline">{step.name}</span>
                {step.id < stepsList.length && (
                  <ChevronRight className={`w-3 h-3 mx-1 opacity-40 ${isRtl ? 'rotate-180' : ''}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Content Container */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: isRtl ? -15 : 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtl ? 15 : -15 }}
              transition={{ duration: 0.2 }}
            >
              {/* STEP 1: Installation Source */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 transition-colors duration-300 ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                      <CloudDownload className="w-5 h-5 text-rose-500" />
                      {t.sourceTitle}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.sourceDesc}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Online Card */}
                    <div 
                      onClick={() => setInstallSource('online')}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-44 ${
                        installSource === 'online' 
                          ? isLightMode
                            ? 'bg-rose-50/50 border-rose-500/40 text-slate-800 ring-2 ring-rose-500/10 shadow-sm shadow-rose-100'
                            : 'bg-rose-500/5 border-rose-500/40 text-white ring-2 ring-rose-500/10' 
                          : isLightMode
                            ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10 hover:bg-slate-950/60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl border transition-colors ${
                          isLightMode ? 'bg-slate-50 border-slate-200 text-rose-500' : 'bg-slate-900 border-white/10 text-rose-400'
                        }`}>
                          <Globe className="w-6 h-6" />
                        </div>
                        {installSource === 'online' && (
                          <span className={`p-1 rounded-full border ${isLightMode ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-rose-500/20 text-rose-400 border-rose-500/20'}`}>
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="mt-4">
                        <h4 className={`font-bold text-md transition-colors ${isLightMode ? 'text-slate-800' : 'text-white'}`}>{t.sourceOnline}</h4>
                        <p className={`text-xs mt-1 transition-colors ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.sourceOnlineDesc}</p>
                      </div>
                    </div>

                    {/* Offline Card */}
                    <div 
                      onClick={() => setInstallSource('offline')}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-44 ${
                        installSource === 'offline' 
                          ? isLightMode
                            ? 'bg-rose-50/50 border-rose-500/40 text-slate-800 ring-2 ring-rose-500/10 shadow-sm shadow-rose-100'
                            : 'bg-rose-500/5 border-rose-500/40 text-white ring-2 ring-rose-500/10' 
                          : isLightMode
                            ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10 hover:bg-slate-950/60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl border transition-colors ${
                          isLightMode ? 'bg-slate-50 border-slate-200 text-amber-500' : 'bg-slate-900 border-white/10 text-amber-400'
                        }`}>
                          <FileText className="w-6 h-6" />
                        </div>
                        {installSource === 'offline' && (
                          <span className={`p-1 rounded-full border ${isLightMode ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-rose-500/20 text-rose-400 border-rose-500/20'}`}>
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="mt-4">
                        <h4 className={`font-bold text-md transition-colors ${isLightMode ? 'text-slate-800' : 'text-white'}`}>{t.sourceOffline}</h4>
                        <p className={`text-xs mt-1 transition-colors ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.sourceOfflineDesc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Offline Extra Fields */}
                  {installSource === 'offline' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl border transition-colors ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.offlineConfigLabel}</label>
                          <input 
                            type="text"
                            value={offlineConfigPath}
                            onChange={(e) => setOfflineConfigPath(e.target.value)}
                            placeholder={t.offlineConfigPlaceholder}
                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 transition-all font-mono ${
                              isLightMode 
                                ? 'bg-white border-slate-200 text-slate-800' 
                                : 'bg-slate-950/60 border-white/10 text-white'
                            }`}
                          />
                          <p className={`text-[10px] mt-1 transition-colors ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.offlineConfigHelp}</p>
                        </div>

                        <div>
                          <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.offlineElementLabel}</label>
                          <input 
                            type="text"
                            value={offlineElementPath}
                            onChange={(e) => setOfflineElementPath(e.target.value)}
                            placeholder={t.offlineElementPlaceholder}
                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 transition-all font-mono ${
                              isLightMode 
                                ? 'bg-white border-slate-200 text-slate-800' 
                                : 'bg-slate-950/60 border-white/10 text-white'
                            }`}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.offlineSynapseDebLabel}</label>
                          <input 
                            type="text"
                            value={offlineSynapseDebDir}
                            onChange={(e) => setOfflineSynapseDebDir(e.target.value)}
                            placeholder={t.offlineSynapseDebPlaceholder}
                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 transition-all font-mono ${
                              isLightMode 
                                ? 'bg-white border-slate-200 text-slate-800' 
                                : 'bg-slate-950/60 border-white/10 text-white'
                            }`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 2: Deployment Topology & Target Nodes */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 transition-colors duration-300 ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                      <Server className="w-5 h-5 text-rose-400" />
                      {t.serverTitle}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.serverDesc}</p>
                  </div>

                  {/* Connection Profile Auto-Fill & Selector */}
                  {connections && connections.length > 0 && (
                    <div className={`p-4 rounded-2xl border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isLightMode ? 'bg-indigo-50/70 border-indigo-200' : 'bg-indigo-950/20 border-indigo-500/20'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${isLightMode ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-500/20 text-indigo-400'}`}>
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isLightMode ? 'text-indigo-950' : 'text-indigo-200'}`}>
                            Pre-fill from Saved Connection Profile
                          </div>
                          <div className={`text-[11px] ${isLightMode ? 'text-indigo-600/80' : 'text-indigo-400/80'}`}>
                            Synapse, Database, and Element SSH credentials will be mapped from this profile
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                          value={selectedProfileId}
                          onChange={(e) => {
                            const pId = e.target.value;
                            setSelectedProfileId(pId);
                            const found = connections.find((c: any) => c.id === pId);
                            if (found) {
                              loadProfileData(found);
                              setProfileLoadedNotice(found.name || found.host);
                              setTimeout(() => setProfileLoadedNotice(null), 3000);
                            }
                          }}
                          className={`flex-1 sm:flex-initial text-xs font-semibold rounded-xl border px-3 py-2 transition-all font-mono focus:outline-none ${
                            isLightMode 
                              ? 'bg-white border-indigo-200 text-slate-800 focus:border-indigo-500' 
                              : 'bg-slate-900 border-indigo-500/30 text-white focus:border-indigo-400'
                          }`}
                        >
                          {connections.map((c: any) => (
                            <option key={c.id} value={c.id}>
                              {c.name || c.host} ({c.deploymentMode === 'distributed' ? 'Cluster' : 'Single'}{c.isActive ? ' - Active' : ''})
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => {
                            const found = connections.find((c: any) => c.id === selectedProfileId) || connections[0];
                            if (found) {
                              loadProfileData(found);
                              setProfileLoadedNotice(found.name || found.host);
                              setTimeout(() => setProfileLoadedNotice(null), 3000);
                            }
                          }}
                          title="Reload Profile"
                          className={`p-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                            isLightMode 
                              ? 'bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50' 
                              : 'bg-slate-900 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/30'
                          }`}
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">Reload</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {profileLoadedNotice && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 ${
                        isLightMode ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>
                        {`Credentials loaded from profile "${profileLoadedNotice}".`}
                      </span>
                    </motion.div>
                  )}

                  {/* Architecture Topology Selector */}
                  <div className={`p-4 rounded-2xl border transition-colors ${isLightMode ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-950/30 border-white/5'}`}>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-3 ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>
                      {t.topologyTitle}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Single Mode Option */}
                      <div 
                        onClick={() => setDeploymentMode('single')}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-3 items-start ${
                          deploymentMode === 'single'
                            ? isLightMode
                              ? 'bg-rose-50 border-rose-500/50 text-slate-800 ring-2 ring-rose-500/10 shadow-sm shadow-rose-100'
                              : 'bg-rose-500/10 border-rose-500/50 text-white ring-2 ring-rose-500/10'
                            : isLightMode
                              ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                              : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/10'
                        }`}
                      >
                        <div className={`p-2 rounded-lg mt-0.5 ${deploymentMode === 'single' ? 'bg-rose-500 text-white' : isLightMode ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-400'}`}>
                          <Server className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{t.modeSingle}</div>
                          <div className={`text-xs mt-0.5 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.modeSingleDesc}</div>
                        </div>
                      </div>

                      {/* Distributed Multi-Server Option */}
                      <div 
                        onClick={() => setDeploymentMode('distributed')}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-3 items-start ${
                          deploymentMode === 'distributed'
                            ? isLightMode
                              ? 'bg-indigo-50 border-indigo-500/50 text-slate-800 ring-2 ring-indigo-500/10 shadow-sm shadow-indigo-100'
                              : 'bg-indigo-500/10 border-indigo-500/50 text-white ring-2 ring-indigo-500/10'
                            : isLightMode
                              ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                              : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/10'
                        }`}
                      >
                        <div className={`p-2 rounded-lg mt-0.5 ${deploymentMode === 'distributed' ? 'bg-indigo-500 text-white' : isLightMode ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-400'}`}>
                          <Network className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{t.modeDistributed}</div>
                          <div className={`text-xs mt-0.5 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.modeDistributedDesc}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DOMAIN ROUTING SECTION */}
                  <div className={`p-5 rounded-2xl border transition-colors ${isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-950/40 border-white/10'}`}>
                    <h4 className={`text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-2 ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>
                      <Globe className="w-4 h-4 text-rose-500" />
                      {t.domains} & Routing
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.hsDomainLabel}</label>
                        <input 
                          type="text"
                          value={hsDomain}
                          onChange={(e) => {
                            setHsDomain(e.target.value);
                            setHasManuallyEditedHs(true);
                          }}
                          placeholder={t.hsDomainPlaceholder}
                          className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all font-mono ${
                            formErrors.hsDomain 
                              ? isLightMode ? 'border-red-400 bg-red-50/15 text-slate-800 focus:border-red-500' : 'border-red-500/50 focus:border-red-500 text-white'
                              : isLightMode ? 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800 focus:bg-white' : 'bg-slate-950/40 border-white/10 focus:border-rose-500/50 text-white'
                          }`}
                        />
                        {formErrors.hsDomain && <p className="text-xs text-red-500 mt-1">{formErrors.hsDomain}</p>}
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.elementDomainLabel}</label>
                        <input 
                          type="text"
                          value={elementDomain}
                          onChange={(e) => {
                            setElementDomain(e.target.value);
                            setHasManuallyEditedElement(true);
                          }}
                          placeholder={t.elementDomainPlaceholder}
                          className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all font-mono ${
                            formErrors.elementDomain 
                              ? isLightMode ? 'border-red-400 bg-red-50/15 text-slate-800 focus:border-red-500' : 'border-red-500/50 focus:border-red-500 text-white'
                              : isLightMode ? 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800 focus:bg-white' : 'bg-slate-950/40 border-white/10 focus:border-rose-500/50 text-white'
                          }`}
                        />
                        {formErrors.elementDomain && <p className="text-xs text-red-500 mt-1">{formErrors.elementDomain}</p>}
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.baseDomainLabel}</label>
                        <input 
                          type="text"
                          value={baseDomain}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBaseDomain(val);
                            if (!hasManuallyEditedHs) setHsDomain(val ? `matrix.${val}` : '');
                            if (!hasManuallyEditedElement) setElementDomain(val ? `chat.${val}` : '');
                          }}
                          placeholder={t.baseDomainPlaceholder}
                          className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all font-mono ${
                            formErrors.baseDomain 
                              ? isLightMode ? 'border-red-400 bg-red-50/15 text-slate-800 focus:border-red-500' : 'border-red-500/50 focus:border-red-500 text-white'
                              : isLightMode ? 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800 focus:bg-white' : 'bg-slate-950/40 border-white/10 focus:border-rose-500/50 text-white'
                          }`}
                        />
                        {formErrors.baseDomain && <p className="text-xs text-red-500 mt-1">{formErrors.baseDomain}</p>}
                      </div>

                      {deploymentMode === 'single' ? (
                        <div>
                          <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.publicIpLabel}</label>
                          <input 
                            type="text"
                            value={publicIp}
                            onChange={(e) => setPublicIp(e.target.value)}
                            placeholder={t.publicIpPlaceholder}
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all font-mono ${
                              formErrors.publicIp 
                                ? isLightMode ? 'border-red-400 bg-red-50/15 text-slate-800 focus:border-red-500' : 'border-red-500/50 focus:border-red-500 text-white'
                                : isLightMode ? 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800 focus:bg-white' : 'bg-slate-950/40 border-white/10 focus:border-rose-500/50 text-white'
                            }`}
                          />
                          {formErrors.publicIp && <p className="text-xs text-red-500 mt-1">{formErrors.publicIp}</p>}
                        </div>
                      ) : (
                        <div>
                          <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.leEmailLabel}</label>
                          <input 
                            type="text"
                            value={leEmail}
                            onChange={(e) => setLeEmail(e.target.value)}
                            placeholder={t.leEmailPlaceholder}
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all font-mono ${
                              formErrors.leEmail 
                                ? isLightMode ? 'border-red-400 bg-red-50/15 text-slate-800 focus:border-red-500' : 'border-red-500/50 focus:border-red-500 text-white'
                                : isLightMode ? 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800 focus:bg-white' : 'bg-slate-950/40 border-white/10 focus:border-rose-500/50 text-white'
                            }`}
                          />
                          {formErrors.leEmail && <p className="text-xs text-red-500 mt-1">{formErrors.leEmail}</p>}
                        </div>
                      )}

                      {deploymentMode === 'single' && (
                        <div className="md:col-span-2">
                          <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.leEmailLabel}</label>
                          <input 
                            type="text"
                            value={leEmail}
                            onChange={(e) => setLeEmail(e.target.value)}
                            placeholder={t.leEmailPlaceholder}
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all font-mono ${
                              formErrors.leEmail 
                                ? isLightMode ? 'border-red-400 bg-red-50/15 text-slate-800 focus:border-red-500' : 'border-red-500/50 focus:border-red-500 text-white'
                                : isLightMode ? 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800 focus:bg-white' : 'bg-slate-950/40 border-white/10 focus:border-rose-500/50 text-white'
                            }`}
                          />
                          {formErrors.leEmail && <p className="text-xs text-red-500 mt-1">{formErrors.leEmail}</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DISTRIBUTED MULTI-NODE CARDS */}
                  {deploymentMode === 'distributed' && (
                    <div className="space-y-4">
                      {/* Node 1: Synapse Server */}
                      <div className={`p-5 rounded-2xl border transition-all ${
                        isLightMode 
                          ? 'bg-rose-50/30 border-rose-200 shadow-sm' 
                          : 'bg-slate-950/60 border-rose-500/20 shadow-md shadow-rose-950/10'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-xl ${isLightMode ? 'bg-rose-100 text-rose-700' : 'bg-rose-500/20 text-rose-400'}`}>
                              <Server className="w-4 h-4" />
                            </div>
                            <h4 className={`text-sm font-bold ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                              {t.nodeSynapseTitle}
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSynapseHost('localhost');
                              setSynapsePort(22);
                              setSynapseUsername('root');
                              setSynapsePassword('');
                            }}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                              synapseHost === 'localhost' || synapseHost === '127.0.0.1'
                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 font-bold'
                                : isLightMode ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200' : 'bg-slate-800/80 text-slate-300 border-white/10 hover:bg-slate-700'
                            }`}
                            title="Direct execution on this local panel server without remote SSH"
                          >
                            {synapseHost === 'localhost' || synapseHost === '127.0.0.1' ? '✓ Local Server' : 'Set as Local Server'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2">
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.nodeHostIp}</label>
                            <input 
                              type="text"
                              value={synapseHost}
                              onChange={(e) => setSynapseHost(e.target.value)}
                              placeholder="e.g. 192.168.1.10 or matrix.company.com"
                              className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none transition-all ${
                                formErrors.synapseHost ? 'border-red-500 bg-red-50/10 text-red-500' : isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'
                              }`}
                            />
                            {formErrors.synapseHost && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.synapseHost}</p>}
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.nodeSshPort}</label>
                            <input 
                              type="number"
                              value={synapsePort}
                              onChange={(e) => setSynapsePort(Number(e.target.value))}
                              className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                            />
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.nodeSshUser}</label>
                            <input 
                              type="text"
                              value={synapseUsername}
                              onChange={(e) => setSynapseUsername(e.target.value)}
                              placeholder="root"
                              className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                            />
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.nodeAuthType}</label>
                            <select
                              value={synapseAuthType}
                              onChange={(e) => setSynapseAuthType(e.target.value as any)}
                              className={`w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                            >
                              <option value="password">{t.authPasswordLabel}</option>
                              <option value="privateKey">{t.authKeyLabel}</option>
                            </select>
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>
                              {synapseAuthType === 'password' ? t.nodePassword : t.nodePrivateKey}
                            </label>
                            {synapseAuthType === 'password' ? (
                              <input 
                                type="password"
                                value={synapsePassword}
                                onChange={(e) => setSynapsePassword(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                              />
                            ) : (
                              <textarea
                                value={synapsePrivateKey}
                                onChange={(e) => setSynapsePrivateKey(e.target.value)}
                                placeholder="-----BEGIN OPENSSH PRIVATE KEY-----"
                                rows={1}
                                className={`w-full border rounded-xl px-3.5 py-1.5 text-xs font-mono focus:outline-none resize-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                              />
                            )}
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-200/40 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-500">
                          <span>💡 When Synapse is hosted locally on this server, commands execute directly without requiring SSH passwords.</span>
                        </div>
                      </div>

                      {/* Node 2: Database Server (PostgreSQL) */}
                      <div className={`p-5 rounded-2xl border transition-all ${
                        isLightMode 
                          ? 'bg-blue-50/30 border-blue-200 shadow-sm' 
                          : 'bg-slate-950/60 border-blue-500/20 shadow-md shadow-blue-950/10'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-xl ${isLightMode ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-400'}`}>
                              <Database className="w-4 h-4" />
                            </div>
                            <h4 className={`text-sm font-bold ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                              {t.nodeDbTitle}
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={handleCopyCredentialsToDb}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                              isLightMode 
                                ? 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50' 
                                : 'bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20'
                            }`}
                          >
                            {copiedDbNotice ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedDbNotice ? t.credentialsCopied : t.copySynapseCredentials}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2">
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.nodeHostIp}</label>
                            <input 
                              type="text"
                              value={dbHost}
                              onChange={(e) => setDbHost(e.target.value)}
                              placeholder="e.g. 192.168.1.11 or db.company.com"
                              className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none transition-all ${
                                formErrors.dbHost ? 'border-red-500 bg-red-50/10 text-red-500' : isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'
                              }`}
                            />
                            {formErrors.dbHost && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.dbHost}</p>}
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.nodeSshPort}</label>
                            <input 
                              type="number"
                              value={dbSshPort}
                              onChange={(e) => setDbSshPort(Number(e.target.value))}
                              className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                            />
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.nodeSshUser}</label>
                            <input 
                              type="text"
                              value={dbUsername}
                              onChange={(e) => setDbUsername(e.target.value)}
                              placeholder="root"
                              className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                            />
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.nodeAuthType}</label>
                            <select
                              value={dbAuthType}
                              onChange={(e) => setDbAuthType(e.target.value as any)}
                              className={`w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                            >
                              <option value="password">{t.authPasswordLabel}</option>
                              <option value="privateKey">{t.authKeyLabel}</option>
                            </select>
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>
                              {dbAuthType === 'password' ? t.nodePassword : t.nodePrivateKey}
                            </label>
                            {dbAuthType === 'password' ? (
                              <input 
                                type="password"
                                value={dbSshPassword}
                                onChange={(e) => setDbSshPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                              />
                            ) : (
                              <textarea
                                value={dbPrivateKey}
                                onChange={(e) => setDbPrivateKey(e.target.value)}
                                placeholder="-----BEGIN OPENSSH PRIVATE KEY-----"
                                rows={1}
                                className={`w-full border rounded-xl px-3.5 py-1.5 text-xs font-mono focus:outline-none resize-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                              />
                            )}
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.dbNameLabel}</label>
                            <input 
                              type="text"
                              value={dbName}
                              onChange={(e) => setDbName(e.target.value)}
                              placeholder="synapse"
                              className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                            />
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.dbUserLabel}</label>
                            <input 
                              type="text"
                              value={dbUser}
                              onChange={(e) => setDbUser(e.target.value)}
                              placeholder="synapse_user"
                              className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                            />
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.dbPortLabel}</label>
                            <input 
                              type="number"
                              value={dbPostgresPort}
                              onChange={(e) => setDbPostgresPort(Number(e.target.value))}
                              className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Node 3: Element Web Server */}
                      <div className={`p-5 rounded-2xl border transition-all ${
                        isLightMode 
                          ? 'bg-purple-50/30 border-purple-200 shadow-sm' 
                          : 'bg-slate-950/60 border-purple-500/20 shadow-md shadow-purple-950/10'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-xl ${isLightMode ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/20 text-purple-400'}`}>
                              <Layers className="w-4 h-4" />
                            </div>
                            <h4 className={`text-sm font-bold ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                              {t.nodeElementTitle}
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={handleCopyCredentialsToElement}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                              isLightMode 
                                ? 'bg-white border-purple-200 text-purple-700 hover:bg-purple-50' 
                                : 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                            }`}
                          >
                            {copiedElNotice ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedElNotice ? t.credentialsCopied : t.copySynapseCredentials}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2">
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.nodeHostIp}</label>
                            <input 
                              type="text"
                              value={elementHost}
                              onChange={(e) => setElementHost(e.target.value)}
                              placeholder="e.g. 192.168.1.12 or chat.company.com"
                              className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none transition-all ${
                                formErrors.elementHost ? 'border-red-500 bg-red-50/10 text-red-500' : isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'
                              }`}
                            />
                            {formErrors.elementHost && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.elementHost}</p>}
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.nodeSshPort}</label>
                            <input 
                              type="number"
                              value={elementSshPort}
                              onChange={(e) => setElementSshPort(Number(e.target.value))}
                              className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                            />
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.nodeSshUser}</label>
                            <input 
                              type="text"
                              value={elementUsername}
                              onChange={(e) => setElementUsername(e.target.value)}
                              placeholder="root"
                              className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                            />
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.nodeAuthType}</label>
                            <select
                              value={elementAuthType}
                              onChange={(e) => setElementAuthType(e.target.value as any)}
                              className={`w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                            >
                              <option value="password">{t.authPasswordLabel}</option>
                              <option value="privateKey">{t.authKeyLabel}</option>
                            </select>
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold mb-1 uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>
                              {elementAuthType === 'password' ? t.nodePassword : t.nodePrivateKey}
                            </label>
                            {elementAuthType === 'password' ? (
                              <input 
                                type="password"
                                value={elementSshPassword}
                                onChange={(e) => setElementSshPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                              />
                            ) : (
                              <textarea
                                value={elementPrivateKey}
                                onChange={(e) => setElementPrivateKey(e.target.value)}
                                placeholder="-----BEGIN OPENSSH PRIVATE KEY-----"
                                rows={1}
                                className={`w-full border rounded-xl px-3.5 py-1.5 text-xs font-mono focus:outline-none resize-none ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'}`}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Inter-Node Info Banner */}
                      <div className={`p-4 rounded-2xl border flex gap-3 transition-colors ${
                        isLightMode 
                          ? 'bg-indigo-50/70 border-indigo-200 text-slate-700 shadow-sm' 
                          : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                      }`}>
                        <Network className={`w-5 h-5 shrink-0 mt-0.5 ${isLightMode ? 'text-indigo-600' : 'text-indigo-400'}`} />
                        <div>
                          <h5 className="font-bold text-xs uppercase tracking-wider mb-0.5">{t.interNodeComms}</h5>
                          <p className="text-xs leading-relaxed opacity-90">{t.interNodeCommsDesc}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Database Notice Box for Single Server */}
                  {deploymentMode === 'single' && (
                    <div className={`p-4 rounded-2xl border flex gap-3 transition-colors ${
                      isLightMode 
                        ? 'bg-indigo-50/50 border-indigo-100 text-slate-600 shadow-sm' 
                        : 'bg-indigo-500/5 border-indigo-500/10 text-slate-400'
                    }`}>
                      <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isLightMode ? 'text-indigo-500' : 'text-indigo-400'}`} />
                      <p className="text-xs leading-relaxed">{t.dbNotice}</p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: SSL Certificate */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 transition-colors duration-300 ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                      <Globe className="w-5 h-5 text-rose-400" />
                      {t.sslTitle}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.sslDesc}</p>
                  </div>

                  <div className="space-y-3">
                    {/* Auto */}
                    <div 
                      onClick={() => setSslMode('auto')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center ${
                        sslMode === 'auto' 
                          ? isLightMode
                            ? 'bg-rose-50/50 border-rose-500/40 text-slate-800 shadow-sm shadow-rose-100 ring-2 ring-rose-500/10'
                            : 'bg-rose-500/5 border-rose-500/40 text-white' 
                          : isLightMode
                            ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        sslMode === 'auto' ? 'border-rose-500 text-rose-500' : 'border-slate-400'
                      }`}>
                        {sslMode === 'auto' && <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />}
                      </span>
                      <div>
                        <h4 className={`font-bold text-sm ${isLightMode ? 'text-slate-800' : 'text-white'}`}>{t.sslAuto}</h4>
                        <p className={`text-xs mt-0.5 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.sslAutoDesc}</p>
                      </div>
                    </div>

                    {/* Self-Signed */}
                    <div 
                      onClick={() => setSslMode('selfsigned')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center ${
                        sslMode === 'selfsigned' 
                          ? isLightMode
                            ? 'bg-rose-50/50 border-rose-500/40 text-slate-800 shadow-sm shadow-rose-100 ring-2 ring-rose-500/10'
                            : 'bg-rose-500/5 border-rose-500/40 text-white' 
                          : isLightMode
                            ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        sslMode === 'selfsigned' ? 'border-rose-500 text-rose-500' : 'border-slate-400'
                      }`}>
                        {sslMode === 'selfsigned' && <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />}
                      </span>
                      <div>
                        <h4 className={`font-bold text-sm ${isLightMode ? 'text-slate-800' : 'text-white'}`}>{t.sslSelfSigned}</h4>
                        <p className={`text-xs mt-0.5 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.sslSelfSignedDesc}</p>
                      </div>
                    </div>

                    {/* Custom */}
                    <div 
                      onClick={() => setSslMode('custom')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center ${
                        sslMode === 'custom' 
                          ? isLightMode
                            ? 'bg-rose-50/50 border-rose-500/40 text-slate-800 shadow-sm shadow-rose-100 ring-2 ring-rose-500/10'
                            : 'bg-rose-500/5 border-rose-500/40 text-white' 
                          : isLightMode
                            ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        sslMode === 'custom' ? 'border-rose-500 text-rose-500' : 'border-slate-400'
                      }`}>
                        {sslMode === 'custom' && <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />}
                      </span>
                      <div>
                        <h4 className={`font-bold text-sm ${isLightMode ? 'text-slate-800' : 'text-white'}`}>{t.sslCustom}</h4>
                        <p className={`text-xs mt-0.5 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.sslCustomDesc}</p>
                      </div>
                    </div>
                  </div>

                  {sslMode === 'custom' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl border space-y-4 transition-colors ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}
                    >
                      <div>
                        <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.customCertLabel}</label>
                        <input 
                          type="text"
                          value={customCertPem}
                          onChange={(e) => setCustomCertPem(e.target.value)}
                          placeholder={t.customCertPlaceholder}
                          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-mono ${
                            formErrors.customCertPem 
                              ? 'border-red-500 bg-red-50/15' 
                              : isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950/60 border-white/10 text-white'
                          }`}
                        />
                        {formErrors.customCertPem && <p className="text-xs text-red-500 mt-1">{formErrors.customCertPem}</p>}
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.customKeyLabel}</label>
                        <input 
                          type="text"
                          value={customKeyPem}
                          onChange={(e) => setCustomKeyPem(e.target.value)}
                          placeholder={t.customKeyPlaceholder}
                          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-mono ${
                            formErrors.customKeyPem 
                              ? 'border-red-500 bg-red-50/15' 
                              : isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950/60 border-white/10 text-white'
                          }`}
                        />
                        {formErrors.customKeyPem && <p className="text-xs text-red-500 mt-1">{formErrors.customKeyPem}</p>}
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.customChainLabel}</label>
                        <input 
                          type="text"
                          value={customChainPem}
                          onChange={(e) => setCustomChainPem(e.target.value)}
                          placeholder={t.customChainPlaceholder}
                          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-mono ${
                            isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950/60 border-white/10 text-white'
                          }`}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 4: Element Web Installation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 transition-colors duration-300 ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                      <Layers className="w-5 h-5 text-rose-400" />
                      {t.elementTitle}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.elementDesc}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Online GitHub */}
                    <div 
                      onClick={() => setElementInstallMode('online')}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-40 ${
                        elementInstallMode === 'online' 
                          ? isLightMode
                            ? 'bg-rose-50/50 border-rose-500/40 text-slate-800 shadow-sm shadow-rose-100 ring-2 ring-rose-500/10'
                            : 'bg-rose-500/5 border-rose-500/40 text-white ring-2 ring-rose-500/10' 
                          : isLightMode
                            ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl border transition-colors ${
                          isLightMode ? 'bg-slate-50 border-slate-200 text-rose-500' : 'bg-slate-900 border-white/10 text-rose-400'
                        }`}>
                          <CloudDownload className="w-5 h-5" />
                        </div>
                        {elementInstallMode === 'online' && (
                          <span className={`p-1 rounded-full border ${isLightMode ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-rose-500/20 text-rose-400 border-rose-500/20'}`}>
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${isLightMode ? 'text-slate-800' : 'text-white'}`}>{t.elementOnline}</h4>
                        <p className={`text-xs mt-1 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.elementOnlineDesc}</p>
                      </div>
                    </div>

                    {/* Offline Tarball */}
                    <div 
                      onClick={() => setElementInstallMode('offline')}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-40 ${
                        elementInstallMode === 'offline' 
                          ? isLightMode
                            ? 'bg-rose-50/50 border-rose-500/40 text-slate-800 shadow-sm shadow-rose-100 ring-2 ring-rose-500/10'
                            : 'bg-rose-500/5 border-rose-500/40 text-white ring-2 ring-rose-500/10' 
                          : isLightMode
                            ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl border transition-colors ${
                          isLightMode ? 'bg-slate-50 border-slate-200 text-amber-500' : 'bg-slate-900 border-white/10 text-amber-400'
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        {elementInstallMode === 'offline' && (
                          <span className={`p-1 rounded-full border ${isLightMode ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-rose-500/20 text-rose-400 border-rose-500/20'}`}>
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${isLightMode ? 'text-slate-800' : 'text-white'}`}>{t.elementOffline}</h4>
                        <p className={`text-xs mt-1 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.elementOfflineDesc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Online custom version input */}
                  {elementInstallMode === 'online' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl border transition-colors ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}
                    >
                      <div>
                        <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.elementVersionLabel}</label>
                        <input 
                          type="text"
                          value={elementOnlineVersion}
                          onChange={(e) => setElementOnlineVersion(e.target.value)}
                          placeholder={t.elementVersionPlaceholder}
                          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 transition-all font-mono ${
                            isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950/60 border-white/10 text-white'
                          }`}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Offline elements paths */}
                  {elementInstallMode === 'offline' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl border transition-colors ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.elementOfflinePathLabel}</label>
                          <input 
                            type="text"
                            value={elementOfflinePathVal}
                            onChange={(e) => setElementOfflinePathVal(e.target.value)}
                            placeholder={t.elementOfflinePathPlaceholder}
                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 transition-all font-mono ${
                              formErrors.elementOfflinePath 
                                ? 'border-red-500 bg-red-50/15' 
                                : isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950/60 border-white/10 text-white'
                            }`}
                          />
                          {formErrors.elementOfflinePath && <p className="text-xs text-red-500 mt-1">{formErrors.elementOfflinePath}</p>}
                        </div>

                        <div className="md:col-span-2">
                          <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.elementOfflineLabelLabel}</label>
                          <input 
                            type="text"
                            value={elementOfflineVersionLabel}
                            onChange={(e) => setElementOfflineVersionLabel(e.target.value)}
                            placeholder={t.elementOfflineLabelPlaceholder}
                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 transition-all font-mono ${
                              isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950/60 border-white/10 text-white'
                            }`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 5: LDAP Configuration */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 transition-colors duration-300 ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                      <Key className="w-5 h-5 text-rose-400" />
                      {t.ldapTitle}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.ldapDesc}</p>
                  </div>

                  <div 
                    onClick={() => setLdapConfigureNow(prev => !prev)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex gap-4 items-start ${
                      ldapConfigureNow 
                        ? isLightMode
                          ? 'bg-rose-50/50 border-rose-500/40 text-slate-800 ring-2 ring-rose-500/10 shadow-sm shadow-rose-100'
                          : 'bg-rose-500/5 border-rose-500/40 text-white ring-2 ring-rose-500/10'
                        : isLightMode
                          ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10 hover:bg-slate-950/60'
                    }`}
                  >
                    <div className="pt-0.5">
                      <span className={`w-5.5 h-5.5 rounded border flex items-center justify-center shrink-0 transition-all ${
                        ldapConfigureNow 
                          ? 'bg-rose-500 border-rose-500 text-white' 
                          : isLightMode ? 'border-slate-300 bg-white' : 'border-slate-600 bg-transparent'
                      }`}>
                        {ldapConfigureNow && <Check className="w-4 h-4 stroke-[3px]" />}
                      </span>
                    </div>
                    <div>
                      <h4 className={`font-bold text-md ${isLightMode ? 'text-slate-800' : 'text-white'}`}>{t.ldapCheckbox}</h4>
                      <p className={`text-xs mt-1.5 leading-relaxed ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.ldapNotice}</p>
                    </div>
                  </div>

                  {ldapConfigureNow && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className={`p-6 rounded-2xl border grid grid-cols-1 md:grid-cols-2 gap-4 ${
                        isLightMode ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-950/20 border-white/5'
                      }`}>
                        <div className="md:col-span-2">
                          <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.ldapUriLabel}</label>
                          <input 
                            type="text"
                            value={ldapUri}
                            onChange={(e) => setLdapUri(e.target.value)}
                            placeholder={t.ldapUriPlaceholder}
                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 transition-all font-mono ${
                              formErrors.ldapUri 
                                ? 'border-red-500 bg-red-50/10' 
                                : isLightMode 
                                  ? 'bg-white border-slate-200 text-slate-800' 
                                  : 'bg-slate-950/60 border-white/10 text-white'
                            }`}
                          />
                          {formErrors.ldapUri && <p className="text-xs text-red-500 mt-1">{formErrors.ldapUri}</p>}
                        </div>

                        <div>
                          <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.ldapBindDnLabel}</label>
                          <input 
                            type="text"
                            value={ldapBindDn}
                            onChange={(e) => setLdapBindDn(e.target.value)}
                            placeholder={t.ldapBindDnPlaceholder}
                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 transition-all font-mono ${
                              formErrors.ldapBindDn 
                                ? 'border-red-500 bg-red-50/10' 
                                : isLightMode 
                                  ? 'bg-white border-slate-200 text-slate-800' 
                                  : 'bg-slate-950/60 border-white/10 text-white'
                            }`}
                          />
                          {formErrors.ldapBindDn && <p className="text-xs text-red-500 mt-1">{formErrors.ldapBindDn}</p>}
                        </div>

                        <div>
                          <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.ldapBindPasswordLabel}</label>
                          <input 
                            type="password"
                            value={ldapBindPassword}
                            onChange={(e) => setLdapBindPassword(e.target.value)}
                            placeholder={t.ldapBindPasswordPlaceholder}
                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 transition-all font-mono ${
                              formErrors.ldapBindPassword 
                                ? 'border-red-500 bg-red-50/10' 
                                : isLightMode 
                                  ? 'bg-white border-slate-200 text-slate-800' 
                                  : 'bg-slate-950/60 border-white/10 text-white'
                            }`}
                          />
                          {formErrors.ldapBindPassword && <p className="text-xs text-red-500 mt-1">{formErrors.ldapBindPassword}</p>}
                        </div>

                        <div className="md:col-span-2">
                          <label className={`block text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{t.ldapBaseDnLabel}</label>
                          <input 
                            type="text"
                            value={ldapBaseDn}
                            onChange={(e) => setLdapBaseDn(e.target.value)}
                            placeholder={t.ldapBaseDnPlaceholder}
                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 transition-all font-mono ${
                              formErrors.ldapBaseDn 
                                ? 'border-red-500 bg-red-50/10' 
                                : isLightMode 
                                  ? 'bg-white border-slate-200 text-slate-800' 
                                  : 'bg-slate-950/60 border-white/10 text-white'
                            }`}
                          />
                          {formErrors.ldapBaseDn && <p className="text-xs text-red-500 mt-1">{formErrors.ldapBaseDn}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 6: Summary & Confirm */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 transition-colors duration-300 ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      {t.summaryTitle}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.summaryDesc}</p>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Topology & Source Info */}
                    <div className={`p-4 rounded-2xl border transition-colors ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
                      <span className={`text-[10px] uppercase font-bold tracking-wider block mb-2 ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.topology}</span>
                      <div className={`flex items-center gap-2 text-sm ${isLightMode ? 'text-slate-800' : 'text-slate-200'}`}>
                        <span className={`w-2 h-2 rounded-full ${deploymentMode === 'distributed' ? 'bg-indigo-500 animate-pulse' : 'bg-rose-500'}`} />
                        <span className="font-semibold">{deploymentMode === 'distributed' ? t.modeDistributed : t.modeSingle}</span>
                      </div>
                      <div className="mt-2 text-xs font-mono space-y-1">
                        <div className="flex justify-between">
                          <span className={isLightMode ? 'text-slate-400' : 'text-slate-500'}>Package Source:</span>
                          <span className="font-semibold capitalize">{installSource === 'online' ? t.online : t.offline}</span>
                        </div>
                      </div>
                    </div>

                    {/* SSL Info */}
                    <div className={`p-4 rounded-2xl border transition-colors ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
                      <span className={`text-[10px] uppercase font-bold tracking-wider block mb-2 ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.ssl}</span>
                      <div className={`flex items-center gap-2 text-sm ${isLightMode ? 'text-slate-800' : 'text-slate-200'}`}>
                        <span className="font-semibold text-rose-500 uppercase">{sslMode}</span>
                      </div>
                      {sslMode === 'custom' && (
                        <div className={`mt-2 text-xs font-mono space-y-1 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          <div className="truncate">Cert: {customCertPem}</div>
                          <div className="truncate">Key: {customKeyPem}</div>
                        </div>
                      )}
                    </div>

                    {/* Nodes & Target Hosts Breakdown */}
                    <div className={`p-4 rounded-2xl border transition-colors md:col-span-2 space-y-2 ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
                      <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {deploymentMode === 'distributed' ? 'Cluster Server Nodes' : 'Target Host & Routing'}
                      </span>
                      
                      {deploymentMode === 'distributed' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          {/* Synapse Node Summary */}
                          <div className={`p-3 rounded-xl border ${isLightMode ? 'bg-white border-rose-200' : 'bg-slate-900 border-rose-500/20'}`}>
                            <div className="flex items-center gap-1.5 font-bold text-xs text-rose-500 mb-1">
                              <Server className="w-3.5 h-3.5" />
                              <span>Synapse Node</span>
                            </div>
                            <div className="text-xs font-mono font-semibold truncate">{synapseHost || '127.0.0.1'}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">https://{hsDomain || `matrix.${defaultDomain}`}</div>
                          </div>

                          {/* Database Node Summary */}
                          <div className={`p-3 rounded-xl border ${isLightMode ? 'bg-white border-blue-200' : 'bg-slate-900 border-blue-500/20'}`}>
                            <div className="flex items-center gap-1.5 font-bold text-xs text-blue-500 mb-1">
                              <Database className="w-3.5 h-3.5" />
                              <span>PostgreSQL Node</span>
                            </div>
                            <div className="text-xs font-mono font-semibold truncate">{dbHost || '127.0.0.1'}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{dbName} ({dbUser}@{dbPostgresPort})</div>
                          </div>

                          {/* Element Node Summary */}
                          <div className={`p-3 rounded-xl border ${isLightMode ? 'bg-white border-purple-200' : 'bg-slate-900 border-purple-500/20'}`}>
                            <div className="flex items-center gap-1.5 font-bold text-xs text-purple-500 mb-1">
                              <Layers className="w-3.5 h-3.5" />
                              <span>Element Web Node</span>
                            </div>
                            <div className="text-xs font-mono font-semibold truncate">{elementHost || '127.0.0.1'}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">https://{elementDomain || `chat.${defaultDomain}`}</div>
                          </div>
                        </div>
                      ) : (
                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono ${isLightMode ? 'text-slate-600' : 'text-slate-300'}`}>
                          <div className={`flex justify-between border-b pb-1 ${isLightMode ? 'border-slate-100' : 'border-white/5'}`}>
                            <span className={isLightMode ? 'text-slate-400' : 'text-slate-500'}>Homeserver:</span>
                            <span className={`${isLightMode ? 'text-indigo-600' : 'text-indigo-400'} font-bold`}>https://{hsDomain || (defaultDomain ? `matrix.${defaultDomain}` : 'matrix.company.local')}</span>
                          </div>
                          <div className={`flex justify-between border-b pb-1 ${isLightMode ? 'border-slate-100' : 'border-white/5'}`}>
                            <span className={isLightMode ? 'text-slate-400' : 'text-slate-500'}>Element:</span>
                            <span className={`${isLightMode ? 'text-purple-600' : 'text-purple-400'} font-bold`}>https://{elementDomain || (defaultDomain ? `chat.${defaultDomain}` : 'chat.company.local')}</span>
                          </div>
                          <div className={`flex justify-between border-b pb-1 ${isLightMode ? 'border-slate-100' : 'border-white/5'}`}>
                            <span className={isLightMode ? 'text-slate-400' : 'text-slate-500'}>Base Domain:</span>
                            <span className={isLightMode ? 'text-slate-700' : 'text-slate-400'}>{baseDomain || defaultDomain || 'company.local'}</span>
                          </div>
                          <div className={`flex justify-between border-b pb-1 ${isLightMode ? 'border-slate-100' : 'border-white/5'}`}>
                            <span className={isLightMode ? 'text-slate-400' : 'text-slate-500'}>Public IP:</span>
                            <span className={`${isLightMode ? 'text-emerald-600' : 'text-emerald-400'} font-bold`}>{publicIp || defaultHost || '127.0.0.1'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Element App Deployment Info */}
                    <div className={`p-4 rounded-2xl border transition-colors ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
                      <span className={`text-[10px] uppercase font-bold tracking-wider block mb-2 ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.element}</span>
                      <div className={`text-xs font-mono ${isLightMode ? 'text-slate-600' : 'text-slate-300'}`}>
                        <div className="flex justify-between">
                          <span className={isLightMode ? 'text-slate-400' : 'text-slate-500'}>Distribution:</span>
                          <span className={`font-semibold capitalize ${isLightMode ? 'text-slate-800' : 'text-slate-200'}`}>{elementInstallMode}</span>
                        </div>
                        {elementInstallMode === 'online' && elementOnlineVersion && (
                          <div className="flex justify-between mt-1">
                            <span className={isLightMode ? 'text-slate-400' : 'text-slate-500'}>Version:</span>
                            <span className="text-rose-500">{elementOnlineVersion}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* LDAP Info */}
                    <div className={`p-4 rounded-2xl border transition-colors ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/5'}`}>
                      <span className={`text-[10px] uppercase font-bold tracking-wider block mb-2 ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.ldap}</span>
                      <div className={`flex items-center gap-2 text-sm ${isLightMode ? 'text-slate-800' : 'text-slate-200'}`}>
                        <span className={`w-2 h-2 rounded-full ${ldapConfigureNow ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        <span className="font-semibold">{ldapConfigureNow ? t.yes : t.no}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post-Installation Guidance Box */}
                  <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                    isLightMode 
                      ? 'bg-indigo-50/80 border-indigo-200 text-slate-800' 
                      : 'bg-gradient-to-br from-indigo-950/50 via-slate-900/90 to-purple-950/40 border-indigo-500/30 text-slate-100 shadow-xl'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl border shrink-0 ${
                        isLightMode 
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-700' 
                          : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                      }`}>
                        <ShieldCheck className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isLightMode ? 'text-indigo-950' : 'text-indigo-300'}`}>
                          {t.postInstallGuideTitle}
                        </h4>
                        <p className={`text-xs mt-0.5 leading-relaxed ${isLightMode ? 'text-slate-600' : 'text-slate-300'}`}>
                          {t.postInstallGuideSub}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {/* Step 1: DB connection */}
                      <div className={`p-3 rounded-xl border space-y-1.5 ${
                        isLightMode ? 'bg-white border-indigo-200/80 shadow-sm' : 'bg-slate-950/60 border-indigo-500/20'
                      }`}>
                        <div className={`flex items-center gap-2 font-bold text-xs ${isLightMode ? 'text-emerald-700' : 'text-emerald-400'}`}>
                          <Database className="w-4 h-4 shrink-0" />
                          <span>{t.stepDbTitle}</span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${isLightMode ? 'text-slate-600' : 'text-slate-300'}`}>
                          {t.stepDbDesc}
                        </p>
                      </div>

                      {/* Step 2: Admin creation */}
                      <div className={`p-3 rounded-xl border space-y-1.5 ${
                        isLightMode ? 'bg-white border-indigo-200/80 shadow-sm' : 'bg-slate-950/60 border-indigo-500/20'
                      }`}>
                        <div className={`flex items-center gap-2 font-bold text-xs ${isLightMode ? 'text-indigo-700' : 'text-indigo-400'}`}>
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>{t.stepAdminTitle}</span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${isLightMode ? 'text-slate-600' : 'text-slate-300'}`}>
                          {t.stepAdminDesc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ready Message */}
                  <div className={`p-4 rounded-2xl border flex gap-3 transition-colors ${
                    isLightMode 
                      ? 'bg-emerald-50/50 border-emerald-100 text-slate-600 shadow-sm' 
                      : 'bg-emerald-500/5 border-emerald-500/10 text-slate-400'
                  }`}>
                    <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isLightMode ? 'text-emerald-500' : 'text-emerald-400'}`} />
                    <div>
                      <h4 className={`text-xs font-bold uppercase tracking-wider ${isLightMode ? 'text-slate-800' : 'text-white'}`}>{t.confirmReady}</h4>
                      <p className={`text-xs mt-1 leading-relaxed ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.confirmReadyDesc}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer controls */}
        <div className={`p-6 border-t flex items-center justify-between gap-4 transition-colors duration-300 ${
          isLightMode ? 'border-slate-100 bg-slate-50' : 'border-white/5 bg-slate-950/40'
        }`}>
          <button 
            onClick={currentStep === 1 ? onClose : handleBack}
            className={`px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              isLightMode 
                ? 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-800' 
                : 'border-white/10 hover:bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            {currentStep > 1 && <ChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />}
            {currentStep === 1 ? t.cancel : t.back}
          </button>

          {currentStep < 6 ? (
            <button 
              onClick={handleNext}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-lg ${
                isLightMode 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-200/50 hover:scale-[1.01]' 
                  : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-950/30 hover:scale-[1.01]'
              }`}
            >
              {t.next}
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <button 
              onClick={handleFinalConfirm}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-rose-950/30 ring-2 ring-rose-500/10 hover:scale-[1.02]"
            >
              {t.confirmInstall}
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
export default InstallWizardModal;
