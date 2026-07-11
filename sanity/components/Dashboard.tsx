'use client'

import { useClient } from 'sanity'
import { useState, useEffect, useCallback } from 'react'

interface Stats {
  newB2C: number
  newB2B: number
  newB2CParts: number
  newB2BParts: number
  inProgressB2C: number
  inProgressB2B: number
  activeOrders: number
  pendingPayment: number
  depositOnlyOrders: number
  ordersReadyForCollection: number
  totalModels: number
  inStockModels: number
  totalParts: number
  lowStock: number
  totalCustomers: number
  b2bCustomers: number
  followUpsOverdue: number
}

type Locale = 'en' | 'it'

/* ─── translations ───────────────────────────────────────────── */
const T = {
  en: {
    cms:             'Content Management System',
    refresh:         'Refresh',
    refreshing:      'Refreshing…',
    updated:         'Updated',
    loading:         'Loading dashboard data…',
    allClear:        'All clear — no urgent items today',
    actionRequired:  '⚠️ Action Required',
    items:           'items',
    enquiriesLabel:  'New Enquiries (Unread)',
    b2cBike:         'B2C E-Bike Enquiries',
    b2cParts:        'B2C Parts Enquiries',
    b2bTrade:        'B2B Trade Applications',
    b2bBulk:         'B2B Bulk Parts Orders',
    inProgress:      'in progress',
    negotiating:     'negotiating',
    ordersLabel:     'Orders & Payments',
    activeOrders:    'Active Orders',
    readyCollection: 'Ready for Collection',
    unpaidOrders:    'Unpaid Orders',
    depositOnly:     'Deposit Only (Balance Due)',
    catalogueLabel:  'Catalogue & Customers',
    bikeModels:      'E-Bike Models',
    partsAcc:        'Parts & Accessories',
    lowStockAlerts:  'Low Stock Alerts',
    customerRecords: 'Customer Records',
    tradePartners:   'trade partners',
    inStock:         'in stock',
    checklistTitle:  'Daily Checklist',
    checklist: [
      'Check Enquiries — open all 🔴 New items and assign to a team member',
      'Update order status for any deliveries or collections happening today',
      'Mark payments received — deposit or full payment on the Orders screen',
      'Check Stock & Inventory for any items below the low-stock threshold',
      'Review Customer Records for overdue follow-up reminders',
    ],
    pillUnread:    (n: number) => `📬 ${n} unread enquir${n === 1 ? 'y' : 'ies'}`,
    pillReady:     (n: number) => `📦 ${n} ready for collection`,
    pillUnpaid:    (n: number) => `💳 ${n} unpaid order${n === 1 ? '' : 's'}`,
    pillLowStock:  (n: number) => `⚠️ ${n} low stock`,
    pillFollowUp:  (n: number) => `📅 ${n} overdue follow-up${n === 1 ? '' : 's'}`,
    builtBy:       'Built by',
    lastRefreshed: 'Last refreshed',
  },
  it: {
    cms:             'Sistema di Gestione Contenuti',
    refresh:         'Aggiorna',
    refreshing:      'Aggiornamento…',
    updated:         'Aggiornato',
    loading:         'Caricamento dati dashboard…',
    allClear:        'Tutto in ordine — nessun elemento urgente oggi',
    actionRequired:  '⚠️ Azione Richiesta',
    items:           'elementi',
    enquiriesLabel:  'Nuove Richieste (Non lette)',
    b2cBike:         'Richieste B2C E-Bike',
    b2cParts:        'Richieste B2C Ricambi',
    b2bTrade:        'Candidature B2B Commerciale',
    b2bBulk:         'Ordini B2B Ricambi Bulk',
    inProgress:      'in lavorazione',
    negotiating:     'in trattativa',
    ordersLabel:     'Ordini e Pagamenti',
    activeOrders:    'Ordini Attivi',
    readyCollection: 'Pronti per il Ritiro',
    unpaidOrders:    'Ordini Non Pagati',
    depositOnly:     'Solo Acconto (Saldo Dovuto)',
    catalogueLabel:  'Catalogo e Clienti',
    bikeModels:      'Modelli E-Bike',
    partsAcc:        'Ricambi e Accessori',
    lowStockAlerts:  'Avvisi Scorte Basse',
    customerRecords: 'Schede Clienti',
    tradePartners:   'partner commerciali',
    inStock:         'disponibili',
    checklistTitle:  'Lista di Controllo Giornaliera',
    checklist: [
      'Controlla le Richieste — apri tutti gli elementi 🔴 Nuovi e assegnali a un membro del team',
      'Aggiorna lo stato degli ordini per le consegne o i ritiri di oggi',
      'Registra i pagamenti ricevuti — acconto o pagamento completo nella schermata Ordini',
      'Controlla Scorte e Inventario per elementi al di sotto della soglia minima',
      'Rivedi le Schede Clienti per i promemoria di follow-up scaduti',
    ],
    pillUnread:    (n: number) => `📬 ${n} richiest${n === 1 ? 'a' : 'e'} non lett${n === 1 ? 'a' : 'e'}`,
    pillReady:     (n: number) => `📦 ${n} pront${n === 1 ? 'o' : 'i'} per il ritiro`,
    pillUnpaid:    (n: number) => `💳 ${n} ordin${n === 1 ? 'e' : 'i'} non pagat${n === 1 ? 'o' : 'i'}`,
    pillLowStock:  (n: number) => `⚠️ ${n} scorte basse`,
    pillFollowUp:  (n: number) => `📅 ${n} follow-up scadut${n === 1 ? 'o' : 'i'}`,
    builtBy:       'Creato da',
    lastRefreshed: 'Ultimo aggiornamento',
  },
} as const

/* ─── colour tokens ──────────────────────────────────────────── */
const C = {
  red:        '#dc2626',
  redLight:   '#fef2f2',
  redBorder:  '#fecaca',
  amber:      '#d97706',
  amberLight: '#fffbeb',
  amberBorder:'#fde68a',
  green:      '#16a34a',
  greenLight: '#f0fdf4',
  greenBorder:'#bbf7d0',
  blue:       '#2563eb',
  blueLight:  '#eff6ff',
  blueBorder: '#bfdbfe',
  gray:       '#6b7280',
  grayLight:  '#f9fafb',
  grayBorder: '#e5e7eb',
  dark:       '#111827',
  darkMid:    '#1f2937',
  white:      '#ffffff',
  text:       '#111827',
  muted:      '#6b7280',
}

type Tone = 'red' | 'amber' | 'green' | 'blue' | 'gray'

const toneColor: Record<Tone, string>    = { red: C.red,   amber: C.amber,   green: C.green,   blue: C.blue,   gray: C.gray   }
const toneLightBg: Record<Tone, string>  = { red: C.redLight, amber: C.amberLight, green: C.greenLight, blue: C.blueLight, gray: C.grayLight }
const toneBorder: Record<Tone, string>   = { red: C.redBorder, amber: C.amberBorder, green: C.greenBorder, blue: C.blueBorder, gray: C.grayBorder }

/* ─── Stat Card ──────────────────────────────────────────────── */
function StatCard({ label, value, sub, tone, icon }: { label: string; value: number; sub?: string; tone: Tone; icon: string }) {
  const color   = toneColor[tone]
  const lightBg = toneLightBg[tone]
  const border  = toneBorder[tone]
  return (
    <div style={{
      background: C.white, border: `1px solid ${border}`, borderRadius: 12,
      padding: '20px 20px 16px', borderTop: `4px solid ${color}`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: lightBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 8 }}>
        {icon}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, color: C.text, letterSpacing: '-1px' }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

/* ─── Section Heading ────────────────────────────────────────── */
function SectionHeading({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <span style={{ width: 28, height: 28, borderRadius: 6, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
        {icon}
      </span>
      <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: C.muted }}>
        {label}
      </span>
    </div>
  )
}

/* ─── Alert Pill ─────────────────────────────────────────────── */
function Pill({ text, critical }: { text: string; critical?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
      background: critical ? C.redLight   : C.amberLight,
      border:     `1px solid ${critical ? C.redBorder : C.amberBorder}`,
      color:      critical ? '#991b1b'    : '#92400e',
    }}>
      {text}
    </span>
  )
}

/* ─── Checklist Item ─────────────────────────────────────────── */
function CheckItem({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.grayBorder}` }}>
      <div style={{
        flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
        background: C.blueLight, border: `1.5px solid ${C.blueBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, color: C.blue,
      }}>
        {n}
      </div>
      <span style={{ fontSize: 13, color: '#374151', lineHeight: '22px' }}>{text}</span>
    </div>
  )
}

/* ─── Language Toggle ────────────────────────────────────────── */
function LangToggle({ locale, onToggle }: { locale: Locale; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      title={locale === 'en' ? 'Passa all\'italiano' : 'Switch to English'}
      style={{
        display: 'flex', alignItems: 'center', gap: 0,
        padding: '0', borderRadius: 8,
        border: '1px solid #374151', overflow: 'hidden',
        cursor: 'pointer', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.06em',
        background: 'transparent',
      }}
    >
      {(['en', 'it'] as Locale[]).map((lang) => (
        <span
          key={lang}
          style={{
            padding: '6px 11px',
            background: locale === lang ? C.red : 'transparent',
            color: locale === lang ? '#fff' : '#9ca3af',
            transition: 'all 0.2s',
            textTransform: 'uppercase',
          }}
        >
          {lang}
        </span>
      ))}
    </button>
  )
}

/* ─── Main Dashboard ─────────────────────────────────────────── */
export function Dashboard() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [stats, setStats]             = useState<Stats | null>(null)
  const [loading, setLoading]         = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [spinning, setSpinning]       = useState(false)
  const [locale, setLocale]           = useState<Locale>('en')

  /* ── Restore saved locale ─────────────────────────────────── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rks-cms-locale') as Locale | null
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount, must run client-only to avoid SSR hydration mismatch
      if (saved === 'en' || saved === 'it') setLocale(saved)
    } catch {}
  }, [])

  const toggleLocale = () => {
    const next: Locale = locale === 'en' ? 'it' : 'en'
    setLocale(next)
    try { localStorage.setItem('rks-cms-locale', next) } catch {}
  }

  const t = T[locale]

  /* ── Fetch stats ──────────────────────────────────────────── */
  const fetchStats = useCallback(() => {
    setSpinning(true)
    setLoading(true)
    client
      .fetch<Stats>(`{
        "newB2C":                   count(*[_type=="b2cEnquiry"      && status=="new"]),
        "newB2B":                   count(*[_type=="b2bEnquiry"      && status=="new"]),
        "newB2CParts":              count(*[_type=="b2cPartsEnquiry" && status=="new"]),
        "newB2BParts":              count(*[_type=="b2bPartsEnquiry" && status=="new"]),
        "inProgressB2C":            count(*[_type=="b2cEnquiry"      && status=="in-progress"]),
        "inProgressB2B":            count(*[_type=="b2bEnquiry"      && status in ["offer-sent","negotiating"]]),
        "activeOrders":             count(*[_type=="order" && status in ["pending","confirmed","in-production","ready"]]),
        "ordersReadyForCollection": count(*[_type=="order" && status=="ready"]),
        "pendingPayment":           count(*[_type=="order" && paymentStatus=="unpaid"]),
        "depositOnlyOrders":        count(*[_type=="order" && paymentStatus=="deposit-paid"]),
        "totalModels":              count(*[_type=="bikeModel"]),
        "inStockModels":            count(*[_type=="bikeModel" && availability=="in-stock"]),
        "totalParts":               count(*[_type=="bikePart"]),
        "lowStock":                 count(*[_type=="stockItem" && quantity<=lowStockAlert]),
        "totalCustomers":           count(*[_type=="customerRecord"]),
        "b2bCustomers":             count(*[_type=="customerRecord" && recordType=="b2b"]),
        "followUpsOverdue":         count(*[_type=="customerRecord" && followUpDate!=null && followUpDate<=now()]),
      }`)
      .then((data) => {
        setStats(data)
        setLastRefresh(new Date())
        setLoading(false)
        setTimeout(() => setSpinning(false), 400)
      })
      .catch(() => { setLoading(false); setSpinning(false) })
  }, [client])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount, loading/spinner state must be set before the async call starts
  useEffect(() => { fetchStats() }, [fetchStats])

  const totalNew =
    (stats?.newB2C ?? 0) + (stats?.newB2B ?? 0) +
    (stats?.newB2CParts ?? 0) + (stats?.newB2BParts ?? 0)

  const hasAlerts =
    totalNew > 0 ||
    (stats?.lowStock ?? 0) > 0 ||
    (stats?.pendingPayment ?? 0) > 0 ||
    (stats?.followUpsOverdue ?? 0) > 0 ||
    (stats?.ordersReadyForCollection ?? 0) > 0

  const alertCount = [
    totalNew,
    stats?.ordersReadyForCollection ?? 0,
    stats?.pendingPayment ?? 0,
    stats?.lowStock ?? 0,
    stats?.followUpsOverdue ?? 0,
  ].filter(Boolean).length

  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
    gap: 14,
  }

  const dateLocale = locale === 'it' ? 'it-IT' : 'en-IE'

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', minHeight: '100%', background: '#f3f4f6' }}>

      {/* ── Top Header Bar ──────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkMid} 100%)`, padding: '0 32px', borderBottom: `3px solid ${C.red}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
              ⚡
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.white, letterSpacing: '-0.3px' }}>RKS E-Bikes</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{t.cms}</div>
            </div>
          </div>

          {/* Right: lang toggle + date + refresh */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LangToggle locale={locale} onToggle={toggleLocale} />

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#d1d5db', fontWeight: 500 }}>
                {new Date().toLocaleDateString(dateLocale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              {!loading && (
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                  {t.updated} {lastRefresh.toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>

            <button
              onClick={fetchStats}
              style={{
                padding: '8px 16px', borderRadius: 8,
                border: '1px solid #374151',
                background: spinning ? '#374151' : 'transparent',
                color: spinning ? '#9ca3af' : '#d1d5db',
                cursor: spinning ? 'default' : 'pointer',
                fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
              disabled={spinning}
            >
              <span style={{ display: 'inline-block', transition: 'transform 0.4s', transform: spinning ? 'rotate(360deg)' : 'none' }}>↻</span>
              {spinning ? t.refreshing : t.refresh}
            </button>
          </div>
        </div>
      </div>

      {/* ── Page Body ───────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 32px 60px' }}>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid ${C.grayBorder}`, borderTopColor: C.red, animation: 'spin 0.8s linear infinite' }} />
            <div style={{ fontSize: 13, color: C.muted }}>{t.loading}</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {!loading && stats && (
          <>
            {/* ── Alert Banner ──────────────────────────────────── */}
            {hasAlerts ? (
              <div style={{
                background: `linear-gradient(135deg, #fff7ed 0%, #fef2f2 100%)`,
                border: `1px solid ${C.redBorder}`, borderLeft: `4px solid ${C.red}`,
                borderRadius: 12, padding: '16px 20px', marginBottom: 28,
                boxShadow: '0 2px 8px rgba(220,38,38,0.08)',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {t.actionRequired}
                  <span style={{ marginLeft: 4, background: C.red, color: '#fff', borderRadius: 999, padding: '1px 8px', fontSize: 11 }}>
                    {alertCount} {t.items}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {totalNew > 0                          && <Pill critical text={t.pillUnread(totalNew)} />}
                  {stats.ordersReadyForCollection > 0    && <Pill text={t.pillReady(stats.ordersReadyForCollection)} />}
                  {stats.pendingPayment > 0              && <Pill critical text={t.pillUnpaid(stats.pendingPayment)} />}
                  {stats.lowStock > 0                    && <Pill text={t.pillLowStock(stats.lowStock)} />}
                  {stats.followUpsOverdue > 0            && <Pill text={t.pillFollowUp(stats.followUpsOverdue)} />}
                </div>
              </div>
            ) : (
              <div style={{
                background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderLeft: `4px solid ${C.green}`,
                borderRadius: 12, padding: '14px 20px', marginBottom: 28,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>{t.allClear}</span>
              </div>
            )}

            {/* ── Enquiries ─────────────────────────────────────── */}
            <div style={{ marginBottom: 32 }}>
              <SectionHeading icon="📬" label={t.enquiriesLabel} color={C.red} />
              <div style={grid}>
                <StatCard icon="🟢" label={t.b2cBike}   value={stats.newB2C}      tone={stats.newB2C > 0 ? 'red' : 'gray'}    sub={`${stats.inProgressB2C} ${t.inProgress}`} />
                <StatCard icon="🔧" label={t.b2cParts}  value={stats.newB2CParts} tone={stats.newB2CParts > 0 ? 'red' : 'gray'} />
                <StatCard icon="🔵" label={t.b2bTrade}  value={stats.newB2B}      tone={stats.newB2B > 0 ? 'amber' : 'gray'}   sub={`${stats.inProgressB2B} ${t.negotiating}`} />
                <StatCard icon="📦" label={t.b2bBulk}   value={stats.newB2BParts} tone={stats.newB2BParts > 0 ? 'amber' : 'gray'} />
              </div>
            </div>

            {/* ── Orders & Payments ─────────────────────────────── */}
            <div style={{ marginBottom: 32 }}>
              <SectionHeading icon="🧾" label={t.ordersLabel} color={C.blue} />
              <div style={grid}>
                <StatCard icon="📋" label={t.activeOrders}    value={stats.activeOrders}             tone={stats.activeOrders > 0 ? 'blue' : 'gray'} />
                <StatCard icon="📦" label={t.readyCollection} value={stats.ordersReadyForCollection} tone={stats.ordersReadyForCollection > 0 ? 'amber' : 'gray'} />
                <StatCard icon="💳" label={t.unpaidOrders}    value={stats.pendingPayment}           tone={stats.pendingPayment > 0 ? 'red' : 'green'} />
                <StatCard icon="💰" label={t.depositOnly}     value={stats.depositOnlyOrders}        tone={stats.depositOnlyOrders > 0 ? 'amber' : 'gray'} />
              </div>
            </div>

            {/* ── Catalogue & Customers ─────────────────────────── */}
            <div style={{ marginBottom: 32 }}>
              <SectionHeading icon="⚡" label={t.catalogueLabel} color={C.green} />
              <div style={grid}>
                <StatCard icon="⚡" label={t.bikeModels}      value={stats.totalModels}    tone="blue" sub={`${stats.inStockModels} ${t.inStock}`} />
                <StatCard icon="🔩" label={t.partsAcc}        value={stats.totalParts}     tone="blue" />
                <StatCard icon="⚠️" label={t.lowStockAlerts}  value={stats.lowStock}       tone={stats.lowStock > 0 ? 'amber' : 'green'} />
                <StatCard icon="👥" label={t.customerRecords} value={stats.totalCustomers} tone="blue" sub={`${stats.b2bCustomers} ${t.tradePartners}`} />
              </div>
            </div>

            {/* ── Daily Checklist ───────────────────────────────── */}
            <div style={{ background: C.white, border: `1px solid ${C.grayBorder}`, borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.grayBorder}` }}>
                <span style={{ fontSize: 16 }}>📋</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{t.checklistTitle}</span>
              </div>
              {t.checklist.map((tip, i) => (
                <CheckItem key={i} n={i + 1} text={tip} />
              ))}
            </div>

            {/* ── Footer ────────────────────────────────────────── */}
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>
                {t.builtBy} <strong style={{ color: C.muted }}>Tech Logies</strong>
              </span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>
                {t.lastRefreshed}: {lastRefresh.toLocaleTimeString(dateLocale)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
