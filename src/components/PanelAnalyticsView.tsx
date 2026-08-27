/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  Cpu, 
  History, 
  Users, 
  Wifi, 
  Gauge, 
  HardDrive, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCw, 
  Play, 
  Pause, 
  Download, 
  FileSpreadsheet, 
  LayoutGrid, 
  Layers, 
  BarChart2, 
  Table, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Database, 
  Server, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { SystemStats, MetricTrend } from '../types';

export type AnalyticsViewMode = 'cards' | 'unified' | 'bars' | 'gauges' | 'matrix';
export type TimeRangeFilter = 'live' | '15m' | '1h' | '24h' | '7d';
export type ChartType = 'area' | 'line' | 'bar';

interface PanelAnalyticsViewProps {
  stats: SystemStats | null;
  isLightMode?: boolean;
  lang?: 'fa' | 'en' | 'es' | 'ar' | 'de' | 'ru';
  onManualRefresh?: () => void;
  isRefreshing?: boolean;
}

const analyticsTranslations = {
  fa: {
    title: "تنظیمات پنل و آنالیز عملکرد سیستم",
    sub: "نظارت زنده بر مصرف پردازنده، حافظه رم، ترد‌های ماتریکس، ترافیک شبکه و عملکرد دیسک",
    viewMode: "مدل نمایش",
    viewCards: "کارت‌های تفکیکی",
    viewUnified: "نمودار تجمیعی و تطبیقی",
    viewBars: "نمودار میله‌ای و توزیع",
    viewGauges: "شاخص‌های زنده و سرعت‌سنج",
    viewMatrix: "جدول داده‌ها و خروجی",
    timeRange: "بازه زمانی",
    timeLive: "بلادرنگ (Live)",
    time15m: "۱۵ دقیقه گذشته",
    time1h: "۱ ساعت گذشته",
    time24h: "۲۴ ساعت گذشته",
    time7d: "۷ روز گذشته",
    streamStatus: "وضعیت تلمتری",
    streaming: "در حال جریان زنده",
    paused: "متوقف شده",
    pauseStream: "توقف زنده",
    resumeStream: "ادامه جریان",
    refreshRate: "نرخ بروزرسانی",
    refreshNow: "بروزرسانی دستی",
    sec: "ثانیه",
    cpuUsage: "مصرف پردازنده (CPU)",
    memoryUsage: "حافظه رم مصرفی (RAM)",
    activeUsers: "نشست‌ها و کاربران فعال",
    networkTitle: "ترافیک و سرعت شبکه",
    diskIops: "عملکرد و تاخیر دیسک",
    diskStorage: "فضای دیسک سخت",
    download: "دانلود (دریافت)",
    upload: "آپلود (ارسال)",
    iops: "عملیات ورودی/خروجی (IOPS)",
    latency: "تاخیر پاسخ‌دهی (ms)",
    used: "مصرف شده",
    free: "آزاد",
    total: "کل ظرفیت",
    current: "فعلی",
    peak: "حداکثر",
    min: "حداقل",
    avg: "میانگین",
    delta: "تغییرات",
    healthOptimal: "وضعیت سیستم عالی و پایدار",
    healthWarning: "بار پردازشی نسبتا بالا",
    healthCritical: "هشدار: منابع به حد اشباع رسیده‌اند",
    healthScore: "امتیاز سلامت سیستم",
    chartArea: "ناحیه‌ای (Area)",
    chartLine: "خطی (Line)",
    chartBar: "میله‌ای (Bar)",
    exportCsv: "خروجی اکسل / CSV",
    exportJson: "خروجی JSON",
    recordsCount: "تعداد رکوردهای ثبت‌شده",
    filterTable: "فیلتر و جستجو در جدول...",
    timestamp: "زمان ثبت",
    noData: "داده‌ای برای نمایش یافت نشد.",
    metricsSummary: "خلاصه آماری پارامترها",
    layerToggles: "نمایش لایه‌های نمودار:",
    synapseStatus: "وضعیت سرور Synapse",
    databaseStatus: "پایگاه‌داده Postgres",
    systemUptime: "مدت زمان روشن بودن",
    servicesOnline: "سرویس‌های آنلاین"
  },
  en: {
    title: "Panel Settings & Performance Analysis",
    sub: "Live monitoring of CPU load, memory commit, active Matrix sessions, network traffic, and disk IOPS",
    viewMode: "Display Mode",
    viewCards: "Metric Cards Grid",
    viewUnified: "Unified Multi-Metric",
    viewBars: "Bar Distribution",
    viewGauges: "Live KPI Gauges",
    viewMatrix: "Data Matrix & Export",
    timeRange: "Time Range",
    timeLive: "Real-time (Live)",
    time15m: "Last 15 Minutes",
    time1h: "Last 1 Hour",
    time24h: "Last 24 Hours",
    time7d: "Last 7 Days",
    streamStatus: "Telemetry Stream",
    streaming: "Live Streaming",
    paused: "Stream Paused",
    pauseStream: "Pause Stream",
    resumeStream: "Resume Stream",
    refreshRate: "Refresh Interval",
    refreshNow: "Refresh Now",
    sec: "sec",
    cpuUsage: "CPU Utilization",
    memoryUsage: "Memory Allocation (RAM)",
    activeUsers: "Active Sessions & Users",
    networkTitle: "Network Throughput",
    diskIops: "Disk IOPS & Latency",
    diskStorage: "Disk Storage Space",
    download: "Download",
    upload: "Upload",
    iops: "IOPS (ops/s)",
    latency: "Latency (ms)",
    used: "Used",
    free: "Free",
    total: "Total",
    current: "Current",
    peak: "Peak",
    min: "Min",
    avg: "Average",
    delta: "Delta",
    healthOptimal: "System Health Optimal",
    healthWarning: "Moderate Load Warning",
    healthCritical: "Critical Resource Pressure",
    healthScore: "System Health Score",
    chartArea: "Area Chart",
    chartLine: "Line Chart",
    chartBar: "Bar Chart",
    exportCsv: "Export CSV / Excel",
    exportJson: "Export JSON",
    recordsCount: "Captured Records",
    filterTable: "Filter records...",
    timestamp: "Timestamp",
    noData: "No telemetry data recorded.",
    metricsSummary: "Statistical Metrics Summary",
    layerToggles: "Chart Series Layers:",
    synapseStatus: "Matrix Synapse Status",
    databaseStatus: "PostgreSQL Database",
    systemUptime: "System Uptime",
    servicesOnline: "Services Running"
  },
  es: {
    title: "Ajustes del Panel y Análisis de Rendimiento",
    sub: "Monitoreo en tiempo real del uso de CPU, memoria RAM, sesiones de Matrix, red y disco",
    viewMode: "Modo de Visualización",
    viewCards: "Cuadrícula de Tarjetas",
    viewUnified: "Múltiples Métricas Unificadas",
    viewBars: "Distribución en Barras",
    viewGauges: "Indicadores y Medidores",
    viewMatrix: "Matriz de Datos y Exportación",
    timeRange: "Rango Temporal",
    timeLive: "En Vivo",
    time15m: "Últimos 15 min",
    time1h: "Última 1 hora",
    time24h: "Últimas 24 horas",
    time7d: "Últimos 7 días",
    streamStatus: "Flujo de Telemetría",
    streaming: "Transmitiendo",
    paused: "Pausado",
    pauseStream: "Pausar",
    resumeStream: "Reanudar",
    refreshRate: "Frecuencia",
    refreshNow: "Actualizar Ahora",
    sec: "seg",
    cpuUsage: "Uso de CPU",
    memoryUsage: "Memoria RAM Asignada",
    activeUsers: "Sesiones y Usuarios Activos",
    networkTitle: "Tráfico de Red",
    diskIops: "IOPS y Latencia de Disco",
    diskStorage: "Almacenamiento en Disco",
    download: "Descarga",
    upload: "Carga",
    iops: "IOPS (op/s)",
    latency: "Latencia (ms)",
    used: "Usado",
    free: "Libre",
    total: "Total",
    current: "Actual",
    peak: "Pico",
    min: "Mín",
    avg: "Promedio",
    delta: "Delta",
    healthOptimal: "Salud del Sistema Óptima",
    healthWarning: "Advertencia de Carga Moderada",
    healthCritical: "Presión Crítica de Recursos",
    healthScore: "Puntuación de Salud",
    chartArea: "Área",
    chartLine: "Línea",
    chartBar: "Barras",
    exportCsv: "Exportar CSV/Excel",
    exportJson: "Exportar JSON",
    recordsCount: "Registros Capturados",
    filterTable: "Filtrar registros...",
    timestamp: "Marca de tiempo",
    noData: "Sin datos registrados.",
    metricsSummary: "Resumen Estadístico",
    layerToggles: "Capas del Gráfico:",
    synapseStatus: "Estado de Synapse",
    databaseStatus: "Base de Datos Postgres",
    systemUptime: "Tiempo de Actividad",
    servicesOnline: "Servicios Activos"
  },
  ar: {
    title: "إعدادات اللوحة وتحليل أداء النظام",
    sub: "مراقبة مباشرة للمعالج والذاكرة وجلسات ماتریکس والشبكة والقرص الصلب",
    viewMode: "نمط العرض",
    viewCards: "شبكة البطاقات التفصيلية",
    viewUnified: "المخطط الموحد والمقارن",
    viewBars: "توزيع الأعمدة البيانية",
    viewGauges: "المؤشرات والعدادات الفورية",
    viewMatrix: "جدول البيانات والتصدير",
    timeRange: "النطاق الزمني",
    timeLive: "فوري (Live)",
    time15m: "آخر 15 دقيقة",
    time1h: "آخر ساعة",
    time24h: "آخر 24 ساعة",
    time7d: "آخر 7 أيام",
    streamStatus: "حالة التدفق",
    streaming: "تدفق حي نشط",
    paused: "متوقف مؤقتاً",
    pauseStream: "إيقاف مؤقت",
    resumeStream: "استئناف التدفق",
    refreshRate: "معدل التحديث",
    refreshNow: "تحديث الآن",
    sec: "ثواني",
    cpuUsage: "استخدام المعالج",
    memoryUsage: "استهلاك الذاكرة (RAM)",
    activeUsers: "الجلسات والمستخدمون النشطون",
    networkTitle: "حركة مرور الشبكة",
    diskIops: "أداء وتأخير القرص الصلب",
    diskStorage: "مساحة التخزين",
    download: "تنزيل",
    upload: "رفع",
    iops: "عمليات القرص (IOPS)",
    latency: "زمن الاستجابة (ms)",
    used: "المستخدم",
    free: "المتاح",
    total: "الإجمالي",
    current: "الحالي",
    peak: "الذروة",
    min: "الأدنى",
    avg: "المتوسط",
    delta: "التغير",
    healthOptimal: "صحة النظام ممتازة ومستقرة",
    healthWarning: "تحذير: حمل متوسط",
    healthCritical: "تحذير حرج: ضغط موارد مرتفع",
    healthScore: "درجة كفاءة وصحة النظام",
    chartArea: "مساحة (Area)",
    chartLine: "خطي (Line)",
    chartBar: "شريطي (Bar)",
    exportCsv: "تصدير CSV / إكسل",
    exportJson: "تصدير JSON",
    recordsCount: "السجلات المسجلة",
    filterTable: "تصفية السجلات...",
    timestamp: "الوقت والتاريخ",
    noData: "لا توجد بيانات مسجلة.",
    metricsSummary: "ملخص الإحصاءات",
    layerToggles: "طبقات المخطط:",
    synapseStatus: "حالة خادم سينابس",
    databaseStatus: "قاعدة بيانات بوستجريس",
    systemUptime: "مدة التشغيل",
    servicesOnline: "الخدمات النشطة"
  },
  de: {
    title: "Panel-Einstellungen & Systemleistungsanalyse",
    sub: "Echtzeit-Überwachung von CPU-Last, RAM, aktiven Matrix-Sessions, Netzwerk und Festplatten-IOPS",
    viewMode: "Anzeigemodus",
    viewCards: "Metrikkarten-Gitter",
    viewUnified: "Kombiniertes Mehrfachdiagramm",
    viewBars: "Balkenverteilung",
    viewGauges: "Live-KPI-Messgeräte",
    viewMatrix: "Datenmatrix & Export",
    timeRange: "Zeitbereich",
    timeLive: "Echtzeit (Live)",
    time15m: "Letzte 15 Min",
    time1h: "Letzte 1 Stunde",
    time24h: "Letzte 24 Stunden",
    time7d: "Letzte 7 Tage",
    streamStatus: "Telemetriestatus",
    streaming: "Live-Stream aktiv",
    paused: "Pausiert",
    pauseStream: "Stream anhalten",
    resumeStream: "Fortsetzen",
    refreshRate: "Aktualisierungsrate",
    refreshNow: "Jetzt aktualisieren",
    sec: "Sek",
    cpuUsage: "CPU-Auslastung",
    memoryUsage: "RAM-Speicherbelegung",
    activeUsers: "Aktive Sitzungen & Benutzer",
    networkTitle: "Netzwerkdurchsatz",
    diskIops: "Festplatten-IOPS & Latenz",
    diskStorage: "Festplattenspeicher",
    download: "Download",
    upload: "Upload",
    iops: "IOPS (ops/s)",
    latency: "Latenz (ms)",
    used: "Belegt",
    free: "Frei",
    total: "Gesamt",
    current: "Aktuell",
    peak: "Spitze",
    min: "Min",
    avg: "Durchschnitt",
    delta: "Änderung",
    healthOptimal: "Systemzustand optimal",
    healthWarning: "Warnung vor erhöhter Last",
    healthCritical: "Kritischer Ressourcenengpass",
    healthScore: "System-Integritätswert",
    chartArea: "Flächendiagramm",
    chartLine: "Liniendiagramm",
    chartBar: "Balkendiagramm",
    exportCsv: "CSV / Excel exportieren",
    exportJson: "JSON exportieren",
    recordsCount: "Erfasste Datensätze",
    filterTable: "Datensätze filtern...",
    timestamp: "Zeitstempel",
    noData: "Keine Telemetriedaten vorhanden.",
    metricsSummary: "Statistische Zusammenfassung",
    layerToggles: "Diagrammebenen:",
    synapseStatus: "Matrix Synapse Status",
    databaseStatus: "PostgreSQL Datenbank",
    systemUptime: "System-Laufzeit",
    servicesOnline: "Aktive Dienste"
  },
  ru: {
    title: "Настройки панели и анализ производительности",
    sub: "Мониторинг нагрузки на процессор, память RAM, сессии Matrix, трафик и операции диска в реальном времени",
    viewMode: "Режим отображения",
    viewCards: "Сетка карточек метрик",
    viewUnified: "Сводный мультиграфик",
    viewBars: "Столбчатое распределение",
    viewGauges: "Индикаторы и спидометры",
    viewMatrix: "Таблица данных и экспорт",
    timeRange: "Временной диапазон",
    timeLive: "Реальное время (Live)",
    time15m: "Последние 15 минут",
    time1h: "Последний 1 час",
    time24h: "Последние 24 часа",
    time7d: "Последние 7 дней",
    streamStatus: "Поток телеметрии",
    streaming: "Прямой эфир активен",
    paused: "Приостановлено",
    pauseStream: "Пауза",
    resumeStream: "Продолжить",
    refreshRate: "Частота обновления",
    refreshNow: "Обновить сейчас",
    sec: "сек",
    cpuUsage: "Загрузка процессора (CPU)",
    memoryUsage: "Использование памяти (RAM)",
    activeUsers: "Активные пользователи и сессии",
    networkTitle: "Сетевой трафик и скорость",
    diskIops: "IOPS и задержка диска",
    diskStorage: "Дисковое пространство",
    download: "Загрузка (In)",
    upload: "Отправка (Out)",
    iops: "IOPS (оп/с)",
    latency: "Задержка (мс)",
    used: "Занято",
    free: "Свободно",
    total: "Всего",
    current: "Текущее",
    peak: "Пик",
    min: "Мин",
    avg: "Среднее",
    delta: "Дельта",
    healthOptimal: "Состояние системы: отлично",
    healthWarning: "Умеренная нагрузка",
    healthCritical: "Критическая нагрузка ресурсов",
    healthScore: "Индекс здоровья системы",
    chartArea: "Область (Area)",
    chartLine: "Линия (Line)",
    chartBar: "Столбцы (Bar)",
    exportCsv: "Экспорт в CSV / Excel",
    exportJson: "Экспорт в JSON",
    recordsCount: "Записано замеров",
    filterTable: "Поиск по замерам...",
    timestamp: "Время записи",
    noData: "Данные телеметрии отсутствуют.",
    metricsSummary: "Статистическая сводка",
    layerToggles: "Слои графика:",
    synapseStatus: "Статус Matrix Synapse",
    databaseStatus: "База данных PostgreSQL",
    systemUptime: "Время работы системы",
    servicesOnline: "Активных служб"
  }
};

const CustomChartTooltip = ({ active, payload, label, isLightMode = false }: any) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="chart-custom-tooltip p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md text-left dir-ltr min-w-[175px] pointer-events-none z-50 transition-all"
        style={{
          backgroundColor: '#090d16',
          borderColor: '#334155',
          color: '#ffffff',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)'
        }}
      >
        {label && (
          <div className="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-1.5 mb-2 font-mono">
            <span className="tooltip-header-time text-[11px] font-extrabold tracking-wide flex items-center gap-1.5" style={{ color: '#38bdf8' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
              {label}
            </span>
            <span className="tooltip-header-badge text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>
              Metrics
            </span>
          </div>
        )}
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => {
            const color = entry.color || entry.stroke || entry.fill || '#38bdf8';
            let unit = entry.unit || '';
            if (!unit) {
              if (entry.dataKey === 'cpu') unit = '%';
              else if (entry.dataKey === 'memory') unit = '%';
              else if (entry.dataKey === 'networkIn' || entry.dataKey === 'networkOut') unit = 'KB/s';
              else if (entry.dataKey === 'diskIops') unit = 'op/s';
              else if (entry.dataKey === 'diskLatencyMs') unit = 'ms';
              else if (entry.dataKey === 'activeUsers') unit = 'users';
            }
            const rawVal = entry.value;
            const formattedVal = typeof rawVal === 'number' 
              ? (Number.isInteger(rawVal) ? rawVal : rawVal.toFixed(1))
              : (rawVal !== undefined && rawVal !== null ? rawVal : '--');

            return (
              <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-xs font-bold font-mono">
                <span className="flex items-center gap-1.5 text-slate-100 font-bold" style={{ color: '#f1f5f9' }}>
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ring-1 ring-white/30" style={{ backgroundColor: color }} />
                  <span className="tooltip-item-name font-bold" style={{ color: '#f1f5f9' }}>{entry.name || entry.dataKey}:</span>
                </span>
                <span 
                  className="tooltip-item-val font-black text-xs tracking-tight ml-2 drop-shadow-sm" 
                  style={{ 
                    color: color,
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)' 
                  }}
                >
                  {formattedVal} {unit}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function PanelAnalyticsView({
  stats,
  isLightMode = false,
  lang = 'fa',
  onManualRefresh,
  isRefreshing = false
}: PanelAnalyticsViewProps) {
  const t = analyticsTranslations[lang] || analyticsTranslations.fa;
  const isRtl = ['fa', 'ar'].includes(lang);

  // Display Modes and Controls State
  const [viewMode, setViewMode] = useState<AnalyticsViewMode>('cards');
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('live');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [refreshIntervalSec, setRefreshIntervalSec] = useState<number>(3);
  const [tableFilter, setTableFilter] = useState<string>('');

  // Individual card chart type toggles
  const [cpuChartType, setCpuChartType] = useState<ChartType>('area');
  const [memChartType, setMemChartType] = useState<ChartType>('area');
  const [usersChartType, setUsersChartType] = useState<ChartType>('area');
  const [netChartType, setNetChartType] = useState<ChartType>('line');
  const [diskChartType, setDiskChartType] = useState<ChartType>('area');

  // Unified mode series visible toggles
  const [visibleSeries, setVisibleSeries] = useState({
    cpu: true,
    memory: true,
    activeUsers: true,
    networkIn: true,
    networkOut: true,
    diskIops: true
  });

  // Local rolling trend state to guarantee smooth continuous data flow
  const [localTrends, setLocalTrends] = useState<MetricTrend[]>(() => {
    if (stats?.trends && stats.trends.length > 0) {
      return [...stats.trends];
    }
    const initialPoints: MetricTrend[] = [];
    const now = Date.now();
    const baseCpu = stats?.cpuUsage || 18;
    const baseMem = stats?.memoryUsage || 45;
    const baseUsers = stats?.activeUsers || 4;
    const baseDisk = stats?.diskUsage || 32;

    for (let i = 15; i >= 0; i--) {
      const t = new Date(now - i * 3000);
      const timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const jitter = Math.sin(i * 0.8) * 3.5 + ((i % 3) - 1);
      initialPoints.push({
        time: timeStr,
        cpu: Math.max(5, Math.min(95, parseFloat((baseCpu + jitter).toFixed(1)))),
        memory: Math.max(10, Math.min(95, parseFloat((baseMem + jitter * 0.4).toFixed(1)))),
        activeUsers: Math.max(1, baseUsers),
        disk: baseDisk,
        networkIn: Math.max(60, Math.floor(280 + Math.sin(i) * 120 + Math.random() * 50)),
        networkOut: Math.max(100, Math.floor(540 + Math.cos(i) * 180 + Math.random() * 80)),
        diskIops: Math.max(80, Math.floor(240 + Math.sin(i * 1.2) * 50 + Math.random() * 30)),
        diskLatencyMs: Math.max(0.4, parseFloat((1.1 + Math.sin(i * 0.5) * 0.3).toFixed(2)))
      });
    }
    return initialPoints;
  });

  // Sync external stats into localTrends
  useEffect(() => {
    if (stats?.trends && stats.trends.length > 0) {
      setLocalTrends(stats.trends);
    }
  }, [stats?.trends]);

  // Periodic simulated live tick when streaming is active to guarantee smooth animation
  useEffect(() => {
    if (!isLiveStreaming) return;

    const timer = setInterval(() => {
      setLocalTrends(prev => {
        const last = prev[prev.length - 1];
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        if (last && last.time === timeStr) return prev;

        const baseCpu = stats?.cpuUsage || 20;
        const baseMem = stats?.memoryUsage || 46;
        const baseUsers = stats?.activeUsers || 4;
        const baseDisk = stats?.diskUsage || 32;

        const noise = (Math.random() - 0.5) * 4;
        const newCpu = Math.max(4, Math.min(98, parseFloat((baseCpu + noise).toFixed(1))));
        const newMem = Math.max(10, Math.min(98, parseFloat((baseMem + noise * 0.3).toFixed(1))));
        const newNetIn = Math.max(50, Math.floor(280 + (Math.random() - 0.5) * 120));
        const newNetOut = Math.max(100, Math.floor(540 + (Math.random() - 0.5) * 160));
        const newIops = Math.max(80, Math.floor(240 + (Math.random() - 0.5) * 60));
        const newLatency = Math.max(0.4, parseFloat((1.1 + (Math.random() - 0.5) * 0.3).toFixed(2)));

        const newPoint: MetricTrend = {
          time: timeStr,
          cpu: newCpu,
          memory: newMem,
          activeUsers: Math.max(1, baseUsers),
          disk: baseDisk,
          networkIn: newNetIn,
          networkOut: newNetOut,
          diskIops: newIops,
          diskLatencyMs: newLatency
        };

        const updated = [...prev, newPoint];
        if (updated.length > 35) updated.shift();
        return updated;
      });
    }, refreshIntervalSec * 1000);

    return () => clearInterval(timer);
  }, [isLiveStreaming, refreshIntervalSec, stats]);

  // Derived filtered dataset based on timeRange
  const displayTrends = useMemo(() => {
    if (localTrends.length === 0) return [];
    if (timeRange === 'live') return localTrends;
    if (timeRange === '15m') return localTrends.slice(-15);
    if (timeRange === '1h') return localTrends.slice(-25);
    return localTrends;
  }, [localTrends, timeRange]);

  // Statistical calculations (Min, Max, Avg, Current, Delta)
  const statsSummary = useMemo(() => {
    if (displayTrends.length === 0) {
      return {
        cpu: { current: stats?.cpuUsage || 18, min: 12, max: 28, avg: 18, delta: 0 },
        mem: { current: stats?.memoryUsage || 45, min: 42, max: 48, avg: 45, delta: 0 },
        users: { current: stats?.activeUsers || 4, min: 3, max: 6, avg: 4, delta: 0 },
        netIn: { current: stats?.networkIn || 280, min: 180, max: 390, avg: 275, delta: 0 },
        netOut: { current: stats?.networkOut || 540, min: 340, max: 720, avg: 530, delta: 0 },
        iops: { current: stats?.diskIops || 240, min: 180, max: 310, avg: 235, delta: 0 },
        latency: { current: stats?.diskLatencyMs || 1.1, min: 0.8, max: 1.6, avg: 1.1, delta: 0 }
      };
    }

    const calculateMetrics = (key: keyof MetricTrend) => {
      const vals = displayTrends.map(d => Number(d[key]) || 0).filter(v => !isNaN(v));
      if (vals.length === 0) return { current: 0, min: 0, max: 0, avg: 0, delta: 0 };
      const current = vals[vals.length - 1];
      const prev = vals.length > 1 ? vals[vals.length - 2] : current;
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const avg = parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
      const delta = parseFloat((current - prev).toFixed(1));
      return { current, min, max, avg, delta };
    };

    return {
      cpu: calculateMetrics('cpu'),
      mem: calculateMetrics('memory'),
      users: calculateMetrics('activeUsers'),
      netIn: calculateMetrics('networkIn'),
      netOut: calculateMetrics('networkOut'),
      iops: calculateMetrics('diskIops'),
      latency: calculateMetrics('diskLatencyMs')
    };
  }, [displayTrends, stats]);

  // Overall Health Score (0-100)
  const healthScore = useMemo(() => {
    const cpuPenalty = Math.max(0, (statsSummary.cpu.current - 50) * 0.8);
    const memPenalty = Math.max(0, (statsSummary.mem.current - 60) * 0.7);
    const latencyPenalty = Math.max(0, (statsSummary.latency.current - 5) * 5);
    const score = Math.max(10, Math.min(100, Math.round(100 - cpuPenalty - memPenalty - latencyPenalty)));
    return score;
  }, [statsSummary]);

  // Export handlers
  const handleExportCSV = () => {
    if (displayTrends.length === 0) return;
    const headers = ['Timestamp', 'CPU (%)', 'Memory (%)', 'Active Users', 'Disk (%)', 'Network In (KB/s)', 'Network Out (KB/s)', 'Disk IOPS', 'Latency (ms)'];
    const rows = displayTrends.map(d => [
      d.time,
      d.cpu,
      d.memory,
      d.activeUsers,
      d.disk,
      d.networkIn || 0,
      d.networkOut || 0,
      d.diskIops || 0,
      d.diskLatencyMs || 0
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `raven_matrix_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (displayTrends.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: statsSummary,
      records: displayTrends
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `raven_matrix_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
  };

  // Helper to render responsive single chart
  const renderChart = (
    type: ChartType,
    dataKey: string,
    color: string,
    yDomain?: [number | string, number | string],
    unit?: string,
    name?: string
  ) => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bar' ? (
          <BarChart data={displayTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#e2e8f0' : 'rgba(255,255,255,0.05)'} />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis domain={yDomain || ['auto', 'auto']} stroke="#64748b" />
            <Tooltip content={<CustomChartTooltip isLightMode={isLightMode} />} />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} name={name || dataKey} unit={unit} />
          </BarChart>
        ) : type === 'line' ? (
          <LineChart data={displayTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#e2e8f0' : 'rgba(255,255,255,0.05)'} />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis domain={yDomain || ['auto', 'auto']} stroke="#64748b" />
            <Tooltip content={<CustomChartTooltip isLightMode={isLightMode} />} />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} name={name || dataKey} unit={unit} />
          </LineChart>
        ) : (
          <AreaChart data={displayTrends}>
            <defs>
              <linearGradient id={`grad_${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#e2e8f0' : 'rgba(255,255,255,0.05)'} />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis domain={yDomain || ['auto', 'auto']} stroke="#64748b" />
            <Tooltip content={<CustomChartTooltip isLightMode={isLightMode} />} />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#grad_${dataKey})`} strokeWidth={2.5} name={name || dataKey} unit={unit} />
          </AreaChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
      {/* SECTION 1: Standard Sub-Tab Header matching ReportingPanel */}
      <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b ${
        isLightMode ? 'border-slate-200' : 'border-white/5'
      } ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-3.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={`p-2.5 rounded-2xl border transition-all ${
            isLightMode 
              ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' 
              : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
          }`}>
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <h2 className={`text-xl font-display font-bold ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                {t.title}
              </h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${
                healthScore >= 80 
                  ? (isLightMode ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30')
                  : healthScore >= 50 
                  ? (isLightMode ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-500/15 text-amber-400 border-amber-500/30')
                  : (isLightMode ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-rose-500/15 text-rose-400 border-rose-500/30')
              }`}>
                <span className="w-2 h-2 rounded-full animate-pulse bg-current" />
                {healthScore}% {healthScore >= 80 ? t.healthOptimal : healthScore >= 50 ? t.healthWarning : t.healthCritical}
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.sub}</p>
          </div>
        </div>

        {/* Live Streaming & Action Toolbar */}
        <div className={`flex flex-wrap items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <button
            type="button"
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isLiveStreaming 
                ? (isLightMode ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25')
                : (isLightMode ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100' : 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25')
            }`}
          >
            {isLiveStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>{t.pauseStream}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{t.resumeStream}</span>
              </>
            )}
          </button>

          {/* Refresh Interval Selector */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono ${
            isLightMode ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-black/30 border-white/10 text-slate-300'
          }`}>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={refreshIntervalSec}
              onChange={(e) => setRefreshIntervalSec(Number(e.target.value))}
              className="bg-transparent focus:outline-none cursor-pointer text-xs font-semibold"
            >
              <option value={2} className={isLightMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}>2 {t.sec}</option>
              <option value={3} className={isLightMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}>3 {t.sec}</option>
              <option value={5} className={isLightMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}>5 {t.sec}</option>
              <option value={10} className={isLightMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}>10 {t.sec}</option>
            </select>
          </div>

          {/* Manual Refresh Button */}
          <button
            type="button"
            onClick={() => onManualRefresh && onManualRefresh()}
            disabled={isRefreshing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer disabled:opacity-50 ${
              isLightMode 
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            <span>{t.refreshNow}</span>
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isLightMode 
                ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 shadow-sm' 
                : 'bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border-indigo-500/30'
            }`}
            title={t.exportCsv}
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: Display Mode Switcher & Time Range Selector */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl border ${
        isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/5'
      } ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className={`flex flex-wrap items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <span className={`text-xs font-bold uppercase tracking-wider ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
            {t.viewMode}:
          </span>
          <div className={`flex flex-wrap items-center gap-1 p-1 rounded-xl border ${
            isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/40 border-white/10'
          }`}>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : isLightMode ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t.viewCards}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('unified')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'unified'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                  : isLightMode ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.viewUnified}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('bars')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'bars'
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/30'
                  : isLightMode ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>{t.viewBars}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('gauges')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'gauges'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                  : isLightMode ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>{t.viewGauges}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/30'
                  : isLightMode ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>{t.viewMatrix}</span>
            </button>
          </div>
        </div>

        {/* Time Range Filter Selector */}
        <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <span className={`text-xs font-bold uppercase tracking-wider ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
            {t.timeRange}:
          </span>
          <div className={`flex items-center gap-1 p-1 rounded-xl border text-xs font-semibold ${
            isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/30 border-white/10'
          }`}>
            {(['live', '15m', '1h', '24h', '7d'] as TimeRangeFilter[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  timeRange === r
                    ? (isLightMode ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'bg-white/20 text-white font-bold shadow-sm')
                    : (isLightMode ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200')
                }`}
              >
                {r === 'live' ? t.timeLive : r === '15m' ? t.time15m : r === '1h' ? t.time1h : r === '24h' ? t.time24h : t.time7d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Quick KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border transition-all ${
          isLightMode ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-black/25 border-white/5 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold flex items-center gap-1.5 ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
              <Cpu className="w-4 h-4 text-indigo-500" />
              {t.cpuUsage}
            </span>
            <span className={`text-[11px] font-bold font-mono flex items-center ${statsSummary.cpu.delta >= 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {statsSummary.cpu.delta >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(statsSummary.cpu.delta)}%
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-2xl font-black font-display ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
              {statsSummary.cpu.current}%
            </span>
            <span className={`text-[11px] font-mono ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Peak: {statsSummary.cpu.max}%
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isLightMode ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-black/25 border-white/5 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold flex items-center gap-1.5 ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
              <History className="w-4 h-4 text-purple-500" />
              {t.memoryUsage}
            </span>
            <span className={`text-[11px] font-bold font-mono flex items-center ${statsSummary.mem.delta >= 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {statsSummary.mem.delta >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(statsSummary.mem.delta)}%
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-2xl font-black font-display ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
              {statsSummary.mem.current}%
            </span>
            <span className={`text-[11px] font-mono ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {((stats?.memoryTotal || 8) * (statsSummary.mem.current / 100)).toFixed(1)} GB / {stats?.memoryTotal || 8} GB
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isLightMode ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-black/25 border-white/5 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold flex items-center gap-1.5 ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
              <Wifi className="w-4 h-4 text-cyan-500" />
              {t.networkTitle}
            </span>
            <span className="text-[11px] font-bold font-mono text-cyan-500">
              ↓ {statsSummary.netIn.current} KB/s
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-2xl font-black font-display ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
              ↑ {statsSummary.netOut.current}
            </span>
            <span className={`text-[11px] font-mono ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
              KB/s total
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isLightMode ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-black/25 border-white/5 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold flex items-center gap-1.5 ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
              <Users className="w-4 h-4 text-emerald-500" />
              {t.activeUsers}
            </span>
            <span className="text-[11px] font-bold font-mono text-emerald-500">
              {stats?.publicRoomsCount || 12} Rooms
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-2xl font-black font-display ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
              {statsSummary.users.current}
            </span>
            <span className={`text-[11px] font-mono ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Live sessions
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: DEDICATED METRIC CARDS GRID */}
      {/* ========================================================================= */}
      {viewMode === 'cards' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CPU Card */}
            <div className={`p-6 rounded-3xl border transition-all ${isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/25 border-white/5'}`}>
              <div className={`flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-500" />
                  <h4 className={`text-sm font-bold font-display ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{t.cpuUsage}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 p-1 rounded-xl border text-[10px] ${
                    isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'
                  }`}>
                    {(['area', 'line', 'bar'] as ChartType[]).map((ct) => (
                      <button
                        key={ct}
                        type="button"
                        onClick={() => setCpuChartType(ct)}
                        className={`px-2 py-0.5 rounded-lg capitalize cursor-pointer ${
                          cpuChartType === ct 
                            ? 'bg-indigo-600 text-white font-bold' 
                            : (isLightMode ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')
                        }`}
                      >
                        {ct}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold font-mono text-indigo-500">{statsSummary.cpu.current}%</span>
                </div>
              </div>
              <div className="h-56 w-full font-mono text-[10px]" dir="ltr">
                {renderChart(cpuChartType, 'cpu', '#6366f1', [0, 100], '%', 'CPU')}
              </div>
              <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs font-mono ${
                isLightMode ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'
              }`}>
                <span>{t.min}: {statsSummary.cpu.min}%</span>
                <span>{t.avg}: {statsSummary.cpu.avg}%</span>
                <span>{t.peak}: {statsSummary.cpu.max}%</span>
              </div>
            </div>

            {/* Memory Card */}
            <div className={`p-6 rounded-3xl border transition-all ${isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/25 border-white/5'}`}>
              <div className={`flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-500" />
                  <h4 className={`text-sm font-bold font-display ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{t.memoryUsage}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 p-1 rounded-xl border text-[10px] ${
                    isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'
                  }`}>
                    {(['area', 'line', 'bar'] as ChartType[]).map((ct) => (
                      <button
                        key={ct}
                        type="button"
                        onClick={() => setMemChartType(ct)}
                        className={`px-2 py-0.5 rounded-lg capitalize cursor-pointer ${
                          memChartType === ct 
                            ? 'bg-purple-600 text-white font-bold' 
                            : (isLightMode ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')
                        }`}
                      >
                        {ct}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold font-mono text-purple-500">{statsSummary.mem.current}%</span>
                </div>
              </div>
              <div className="h-56 w-full font-mono text-[10px]" dir="ltr">
                {renderChart(memChartType, 'memory', '#a855f7', [0, 100], '%', 'Memory')}
              </div>
              <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs font-mono ${
                isLightMode ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'
              }`}>
                <span>{t.used}: {((stats?.memoryTotal || 8) * (statsSummary.mem.current / 100)).toFixed(1)} GB</span>
                <span>{t.free}: {((stats?.memoryTotal || 8) - parseFloat(((stats?.memoryTotal || 8) * (statsSummary.mem.current / 100)).toFixed(1))).toFixed(1)} GB</span>
                <span>{t.total}: {stats?.memoryTotal || 8} GB</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Network Card */}
            <div className={`p-6 rounded-3xl border transition-all ${isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/25 border-white/5'}`}>
              <div className={`flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-cyan-500" />
                  <h4 className={`text-sm font-bold font-display ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{t.networkTitle}</h4>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-teal-500 flex items-center gap-1">
                    <ArrowDownLeft className="w-3.5 h-3.5" /> ↓ {statsSummary.netIn.current} KB/s
                  </span>
                  <span className="text-indigo-500 flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> ↑ {statsSummary.netOut.current} KB/s
                  </span>
                </div>
              </div>
              <div className="h-56 w-full font-mono text-[10px]" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displayTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#e2e8f0' : 'rgba(255,255,255,0.05)'} />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip content={<CustomChartTooltip isLightMode={isLightMode} />} />
                    <Line type="monotone" name={t.download} dataKey="networkIn" stroke="#14b8a6" strokeWidth={2.5} dot={false} unit="KB/s" />
                    <Line type="monotone" name={t.upload} dataKey="networkOut" stroke="#6366f1" strokeWidth={2.5} dot={false} unit="KB/s" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs font-mono ${
                isLightMode ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'
              }`}>
                <span>Peak In: {statsSummary.netIn.max} KB/s</span>
                <span>Peak Out: {statsSummary.netOut.max} KB/s</span>
                <span>Avg: {(statsSummary.netIn.avg + statsSummary.netOut.avg).toFixed(1)} KB/s</span>
              </div>
            </div>

            {/* Disk IOPS & Latency Card */}
            <div className={`p-6 rounded-3xl border transition-all ${isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/25 border-white/5'}`}>
              <div className={`flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-amber-500" />
                  <h4 className={`text-sm font-bold font-display ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{t.diskIops}</h4>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-amber-500 font-bold">{statsSummary.iops.current} op/s</span>
                  <span className="text-rose-500 font-bold">{statsSummary.latency.current} ms</span>
                </div>
              </div>
              <div className="h-56 w-full font-mono text-[10px]" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayTrends}>
                    <defs>
                      <linearGradient id="grad_iops" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#e2e8f0' : 'rgba(255,255,255,0.05)'} />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis yAxisId="left" stroke="#f59e0b" />
                    <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" domain={[0, 10]} />
                    <Tooltip content={<CustomChartTooltip isLightMode={isLightMode} />} />
                    <Area yAxisId="left" type="monotone" name={t.iops} dataKey="diskIops" stroke="#f59e0b" fill="url(#grad_iops)" strokeWidth={2} unit="op/s" />
                    <Line yAxisId="right" type="monotone" name={t.latency} dataKey="diskLatencyMs" stroke="#f43f5e" strokeWidth={2} dot={false} unit="ms" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs font-mono ${
                isLightMode ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'
              }`}>
                <span>Max IOPS: {statsSummary.iops.max} op/s</span>
                <span>Avg IOPS: {statsSummary.iops.avg} op/s</span>
                <span>Max Latency: {statsSummary.latency.max} ms</span>
              </div>
            </div>
          </div>

          {/* Active Users & Sessions Card */}
          <div className={`p-6 rounded-3xl border transition-all ${isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/25 border-white/5'}`}>
            <div className={`flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                <h4 className={`text-sm font-bold font-display ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{t.activeUsers}</h4>
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 p-1 rounded-xl border text-[10px] ${
                  isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'
                }`}>
                  {(['area', 'line', 'bar'] as ChartType[]).map((ct) => (
                    <button
                      key={ct}
                      type="button"
                      onClick={() => setUsersChartType(ct)}
                      className={`px-2 py-0.5 rounded-lg capitalize cursor-pointer ${
                        usersChartType === ct 
                          ? 'bg-emerald-600 text-white font-bold' 
                          : (isLightMode ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')
                      }`}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold font-mono text-emerald-500">{statsSummary.users.current} {t.current}</span>
              </div>
            </div>
            <div className="h-56 w-full font-mono text-[10px]" dir="ltr">
              {renderChart(usersChartType, 'activeUsers', '#10b981', [0, 'auto'], '', 'Active Users')}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: UNIFIED MULTI-METRIC COMPARISON STUDIO */}
      {/* ========================================================================= */}
      {viewMode === 'unified' && (
        <div className={`p-6 rounded-3xl border transition-all ${isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/25 border-white/5'} space-y-6`}>
          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ${
            isLightMode ? 'border-slate-200' : 'border-white/10'
          } ${isRtl ? 'text-right' : 'text-left'}`}>
            <div>
              <h3 className={`text-lg font-bold font-display ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{t.viewUnified}</h3>
              <p className={`text-xs ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.metricsSummary}</p>
            </div>

            {/* Interactive Layer Toggles */}
            <div className={`flex flex-wrap items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span className={`text-xs font-semibold ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{t.layerToggles}</span>
              <button
                type="button"
                onClick={() => setVisibleSeries(p => ({ ...p, cpu: !p.cpu }))}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  visibleSeries.cpu 
                    ? (isLightMode ? 'bg-indigo-100 text-indigo-800 border-indigo-300 shadow-sm' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm')
                    : (isLightMode ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-60' : 'bg-black/20 text-slate-500 border-white/5 opacity-50')
                }`}
              >
                CPU (%)
              </button>
              <button
                type="button"
                onClick={() => setVisibleSeries(p => ({ ...p, memory: !p.memory }))}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  visibleSeries.memory 
                    ? (isLightMode ? 'bg-purple-100 text-purple-800 border-purple-300 shadow-sm' : 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm')
                    : (isLightMode ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-60' : 'bg-black/20 text-slate-500 border-white/5 opacity-50')
                }`}
              >
                RAM (%)
              </button>
              <button
                type="button"
                onClick={() => setVisibleSeries(p => ({ ...p, activeUsers: !p.activeUsers }))}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  visibleSeries.activeUsers 
                    ? (isLightMode ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm')
                    : (isLightMode ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-60' : 'bg-black/20 text-slate-500 border-white/5 opacity-50')
                }`}
              >
                Users
              </button>
              <button
                type="button"
                onClick={() => setVisibleSeries(p => ({ ...p, networkIn: !p.networkIn }))}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  visibleSeries.networkIn 
                    ? (isLightMode ? 'bg-cyan-100 text-cyan-800 border-cyan-300 shadow-sm' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm')
                    : (isLightMode ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-60' : 'bg-black/20 text-slate-500 border-white/5 opacity-50')
                }`}
              >
                Net In
              </button>
              <button
                type="button"
                onClick={() => setVisibleSeries(p => ({ ...p, networkOut: !p.networkOut }))}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  visibleSeries.networkOut 
                    ? (isLightMode ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm' : 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm')
                    : (isLightMode ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-60' : 'bg-black/20 text-slate-500 border-white/5 opacity-50')
                }`}
              >
                Net Out
              </button>
              <button
                type="button"
                onClick={() => setVisibleSeries(p => ({ ...p, diskIops: !p.diskIops }))}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  visibleSeries.diskIops 
                    ? (isLightMode ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm' : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm')
                    : (isLightMode ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-60' : 'bg-black/20 text-slate-500 border-white/5 opacity-50')
                }`}
              >
                IOPS
              </button>
            </div>
          </div>

          {/* High-Resolution Unified Chart */}
          <div className="h-96 w-full font-mono text-[11px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#e2e8f0' : 'rgba(255,255,255,0.05)'} />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis yAxisId="pct" domain={[0, 100]} stroke="#818cf8" />
                <YAxis yAxisId="raw" orientation="right" stroke="#38bdf8" />
                <Tooltip content={<CustomChartTooltip isLightMode={isLightMode} />} />
                <Legend />
                {visibleSeries.cpu && (
                  <Line yAxisId="pct" type="monotone" name="CPU Usage (%)" dataKey="cpu" stroke="#6366f1" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} unit="%" />
                )}
                {visibleSeries.memory && (
                  <Line yAxisId="pct" type="monotone" name="RAM Allocation (%)" dataKey="memory" stroke="#a855f7" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} unit="%" />
                )}
                {visibleSeries.activeUsers && (
                  <Line yAxisId="raw" type="monotone" name="Active Users" dataKey="activeUsers" stroke="#10b981" strokeWidth={2} dot={false} />
                )}
                {visibleSeries.networkIn && (
                  <Line yAxisId="raw" type="monotone" name="Network In (KB/s)" dataKey="networkIn" stroke="#06b6d4" strokeWidth={2} dot={false} unit="KB/s" />
                )}
                {visibleSeries.networkOut && (
                  <Line yAxisId="raw" type="monotone" name="Network Out (KB/s)" dataKey="networkOut" stroke="#3b82f6" strokeWidth={2} dot={false} unit="KB/s" />
                )}
                {visibleSeries.diskIops && (
                  <Line yAxisId="raw" type="monotone" name="Disk IOPS" dataKey="diskIops" stroke="#f59e0b" strokeWidth={2} dot={false} unit="op/s" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: BAR DISTRIBUTION & RESOURCE UTILIZATION */}
      {/* ========================================================================= */}
      {viewMode === 'bars' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border transition-all ${isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/25 border-white/5'}`}>
            <h3 className={`text-base font-bold font-display mb-4 ${isLightMode ? 'text-slate-900' : 'text-white'} ${isRtl ? 'text-right' : 'text-left'}`}>
              {t.viewBars} — CPU, RAM & Disk Load
            </h3>
            <div className="h-72 w-full font-mono text-[10px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayTrends.slice(-12)}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#e2e8f0' : 'rgba(255,255,255,0.05)'} />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis domain={[0, 100]} stroke="#64748b" />
                  <Tooltip content={<CustomChartTooltip isLightMode={isLightMode} />} />
                  <Legend />
                  <Bar dataKey="cpu" fill="#6366f1" name="CPU (%)" radius={[4, 4, 0, 0]} unit="%" />
                  <Bar dataKey="memory" fill="#a855f7" name="RAM (%)" radius={[4, 4, 0, 0]} unit="%" />
                  <Bar dataKey="disk" fill="#06b6d4" name="Disk (%)" radius={[4, 4, 0, 0]} unit="%" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-3xl border transition-all ${isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/25 border-white/5'}`}>
              <h4 className={`text-sm font-bold font-display mb-3 ${isLightMode ? 'text-slate-900' : 'text-white'} ${isRtl ? 'text-right' : 'text-left'}`}>
                {t.networkTitle} (Download vs Upload Distribution)
              </h4>
              <div className="h-60 w-full font-mono text-[10px]" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayTrends.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#e2e8f0' : 'rgba(255,255,255,0.05)'} />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip content={<CustomChartTooltip isLightMode={isLightMode} />} />
                    <Legend />
                    <Bar dataKey="networkIn" fill="#14b8a6" name={t.download} radius={[4, 4, 0, 0]} unit="KB/s" />
                    <Bar dataKey="networkOut" fill="#6366f1" name={t.upload} radius={[4, 4, 0, 0]} unit="KB/s" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border transition-all ${isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/25 border-white/5'}`}>
              <h4 className={`text-sm font-bold font-display mb-3 ${isLightMode ? 'text-slate-900' : 'text-white'} ${isRtl ? 'text-right' : 'text-left'}`}>
                {t.diskIops} Distribution
              </h4>
              <div className="h-60 w-full font-mono text-[10px]" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayTrends.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#e2e8f0' : 'rgba(255,255,255,0.05)'} />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip content={<CustomChartTooltip isLightMode={isLightMode} />} />
                    <Bar dataKey="diskIops" fill="#f59e0b" name={t.iops} radius={[4, 4, 0, 0]} unit="op/s" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: COMPACT KPI GAUGES & SPEEDOMETERS */}
      {/* ========================================================================= */}
      {viewMode === 'gauges' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CPU Speedometer Card */}
            <div className={`p-6 rounded-3xl border text-center relative overflow-hidden transition-all ${
              isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/25 border-white/5'
            }`}>
              <div className={`flex items-center justify-center gap-2 mb-3 text-xs font-bold uppercase ${
                isLightMode ? 'text-slate-600' : 'text-slate-400'
              }`}>
                <Cpu className="w-4 h-4 text-indigo-500" />
                {t.cpuUsage}
              </div>
              <div className="relative inline-flex items-center justify-center my-2">
                <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center ${
                  isLightMode ? 'border-indigo-100 bg-indigo-50/50' : 'border-indigo-500/20 bg-indigo-500/5'
                }`}>
                  <div className="text-center">
                    <span className={`text-3xl font-black font-display ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                      {statsSummary.cpu.current}%
                    </span>
                    <p className={`text-[10px] font-mono ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>Peak: {statsSummary.cpu.max}%</p>
                  </div>
                </div>
              </div>
              <div className={`mt-3 flex justify-between text-xs font-mono border-t pt-2 ${
                isLightMode ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'
              }`}>
                <span>Min: {statsSummary.cpu.min}%</span>
                <span>Avg: {statsSummary.cpu.avg}%</span>
              </div>
            </div>

            {/* Memory RAM Gauge */}
            <div className={`p-6 rounded-3xl border text-center relative overflow-hidden transition-all ${
              isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/25 border-white/5'
            }`}>
              <div className={`flex items-center justify-center gap-2 mb-3 text-xs font-bold uppercase ${
                isLightMode ? 'text-slate-600' : 'text-slate-400'
              }`}>
                <History className="w-4 h-4 text-purple-500" />
                {t.memoryUsage}
              </div>
              <div className="relative inline-flex items-center justify-center my-2">
                <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center ${
                  isLightMode ? 'border-purple-100 bg-purple-50/50' : 'border-purple-500/20 bg-purple-500/5'
                }`}>
                  <div className="text-center">
                    <span className={`text-3xl font-black font-display ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                      {statsSummary.mem.current}%
                    </span>
                    <p className={`text-[10px] font-mono ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{((stats?.memoryTotal || 8) * (statsSummary.mem.current / 100)).toFixed(1)} GB</p>
                  </div>
                </div>
              </div>
              <div className={`mt-3 flex justify-between text-xs font-mono border-t pt-2 ${
                isLightMode ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'
              }`}>
                <span>Free: {((stats?.memoryTotal || 8) - parseFloat(((stats?.memoryTotal || 8) * (statsSummary.mem.current / 100)).toFixed(1))).toFixed(1)} GB</span>
                <span>Total: {stats?.memoryTotal || 8} GB</span>
              </div>
            </div>

            {/* Disk Capacity Gauge */}
            <div className={`p-6 rounded-3xl border text-center relative overflow-hidden transition-all ${
              isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/25 border-white/5'
            }`}>
              <div className={`flex items-center justify-center gap-2 mb-3 text-xs font-bold uppercase ${
                isLightMode ? 'text-slate-600' : 'text-slate-400'
              }`}>
                <HardDrive className="w-4 h-4 text-cyan-500" />
                {t.diskStorage}
              </div>
              <div className="relative inline-flex items-center justify-center my-2">
                <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center ${
                  isLightMode ? 'border-cyan-100 bg-cyan-50/50' : 'border-cyan-500/20 bg-cyan-500/5'
                }`}>
                  <div className="text-center">
                    <span className={`text-3xl font-black font-display ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                      {stats?.diskUsage || 32}%
                    </span>
                    <p className={`text-[10px] font-mono ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{stats?.diskFree || 65} GB Free</p>
                  </div>
                </div>
              </div>
              <div className={`mt-3 flex justify-between text-xs font-mono border-t pt-2 ${
                isLightMode ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'
              }`}>
                <span>Used: {stats?.diskTotal ? (stats.diskTotal - (stats.diskFree || 0)).toFixed(1) : '32.0'} GB</span>
                <span>Total: {stats?.diskTotal || 97.7} GB</span>
              </div>
            </div>

            {/* Network Gauge */}
            <div className={`p-6 rounded-3xl border text-center relative overflow-hidden transition-all ${
              isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/25 border-white/5'
            }`}>
              <div className={`flex items-center justify-center gap-2 mb-3 text-xs font-bold uppercase ${
                isLightMode ? 'text-slate-600' : 'text-slate-400'
              }`}>
                <Wifi className="w-4 h-4 text-emerald-500" />
                {t.networkTitle}
              </div>
              <div className="relative inline-flex items-center justify-center my-2">
                <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center ${
                  isLightMode ? 'border-emerald-100 bg-emerald-50/50' : 'border-emerald-500/20 bg-emerald-500/5'
                }`}>
                  <div className="text-center">
                    <span className={`text-2xl font-black font-display ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                      {(statsSummary.netIn.current + statsSummary.netOut.current)}
                    </span>
                    <p className="text-[10px] font-mono text-emerald-500">KB/s total</p>
                  </div>
                </div>
              </div>
              <div className={`mt-3 flex justify-between text-xs font-mono border-t pt-2 ${
                isLightMode ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'
              }`}>
                <span>↓ {statsSummary.netIn.current} KB/s</span>
                <span>↑ {statsSummary.netOut.current} KB/s</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 5: DATA MATRIX & EXPORT TABLE */}
      {/* ========================================================================= */}
      {viewMode === 'matrix' && (
        <div className={`p-6 rounded-3xl border transition-all ${isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/25 border-white/5'} space-y-4`}>
          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ${
            isLightMode ? 'border-slate-200' : 'border-white/10'
          } ${isRtl ? 'text-right' : 'text-left'}`}>
            <div>
              <h3 className={`text-base font-bold font-display ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{t.viewMatrix}</h3>
              <p className={`text-xs ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.recordsCount}: {displayTrends.length}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <input
                type="text"
                placeholder={t.filterTable}
                value={tableFilter}
                onChange={(e) => setTableFilter(e.target.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 ${
                  isLightMode 
                    ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white' 
                    : 'bg-black/30 border-white/10 text-white placeholder-slate-500'
                }`}
              />
              <button
                type="button"
                onClick={handleExportCSV}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isLightMode 
                    ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 shadow-sm' 
                    : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-indigo-500/30'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{t.exportCsv}</span>
              </button>
              <button
                type="button"
                onClick={handleExportJSON}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isLightMode 
                    ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 shadow-sm' 
                    : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-500/30'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.exportJson}</span>
              </button>
            </div>
          </div>

          <div className={`overflow-x-auto rounded-2xl border max-h-[480px] ${
            isLightMode ? 'border-slate-200' : 'border-white/5'
          }`}>
            <table className="w-full text-xs font-mono text-left dir-ltr">
              <thead className={`sticky top-0 backdrop-blur-md border-b ${
                isLightMode ? 'bg-slate-100/95 text-slate-700 border-slate-200' : 'bg-slate-900/90 text-slate-300 border-white/10'
              }`}>
                <tr>
                  <th className="p-3 font-bold">{t.timestamp}</th>
                  <th className="p-3 font-bold text-indigo-500">CPU (%)</th>
                  <th className="p-3 font-bold text-purple-500">RAM (%)</th>
                  <th className="p-3 font-bold text-emerald-500">Users</th>
                  <th className="p-3 font-bold text-cyan-500">Net In (KB/s)</th>
                  <th className="p-3 font-bold text-blue-500">Net Out (KB/s)</th>
                  <th className="p-3 font-bold text-amber-500">Disk IOPS</th>
                  <th className="p-3 font-bold text-rose-500">Latency (ms)</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLightMode ? 'divide-slate-200' : 'divide-white/5'}`}>
                {displayTrends
                  .filter(d => !tableFilter || d.time.includes(tableFilter))
                  .map((row, idx) => (
                    <tr key={idx} className={`transition-colors ${
                      isLightMode ? 'hover:bg-slate-50 text-slate-800' : 'hover:bg-white/[0.02] text-slate-200'
                    }`}>
                      <td className={`p-3 font-semibold ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{row.time}</td>
                      <td className="p-3 text-indigo-500 font-bold">{row.cpu}%</td>
                      <td className="p-3 text-purple-500 font-bold">{row.memory}%</td>
                      <td className="p-3 text-emerald-500 font-bold">{row.activeUsers}</td>
                      <td className="p-3 text-cyan-500">{row.networkIn || 0}</td>
                      <td className="p-3 text-blue-500">{row.networkOut || 0}</td>
                      <td className="p-3 text-amber-500">{row.diskIops || 0}</td>
                      <td className="p-3 text-rose-500">{row.diskLatencyMs || 0}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: System Infrastructure Summary Cards */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/25 border-white/5'
      }`}>
        <h4 className={`text-sm font-bold font-display mb-4 flex items-center gap-2 ${
          isLightMode ? 'text-slate-900' : 'text-white'
        } ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}>
          <Server className="w-4 h-4 text-indigo-500" />
          {t.metricsSummary} & {t.servicesOnline}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className={`p-3.5 rounded-2xl border transition-all ${
            isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/5'
          }`}>
            <span className={`block mb-1 font-semibold ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.synapseStatus}</span>
            <span className="font-bold text-emerald-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Synapse v{stats?.synapseVersion || '1.98.0'}
            </span>
          </div>
          <div className={`p-3.5 rounded-2xl border transition-all ${
            isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/5'
          }`}>
            <span className={`block mb-1 font-semibold ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.databaseStatus}</span>
            <span className="font-bold text-emerald-500 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> PostgreSQL Connected
            </span>
          </div>
          <div className={`p-3.5 rounded-2xl border transition-all ${
            isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/5'
          }`}>
            <span className={`block mb-1 font-semibold ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.systemUptime}</span>
            <span className={`font-bold font-mono ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{stats?.uptime || '4 days, 18 hours'}</span>
          </div>
          <div className={`p-3.5 rounded-2xl border transition-all ${
            isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/5'
          }`}>
            <span className={`block mb-1 font-semibold ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>Server Clock / Date</span>
            <span className={`font-bold font-mono ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{stats?.serverDate || '2026-08-27'} {stats?.serverTime || ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
