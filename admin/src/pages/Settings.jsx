import React, { useState } from 'react'
import {
  Store, Bell, Shield, Palette, Globe, Mail, Phone,
  Save, AlertCircle, ToggleLeft, ToggleRight, RefreshCw,
  CheckCircle, ChevronDown, Trash2, Download
} from 'lucide-react'
import { toast } from 'react-toastify'

const STORAGE_KEY = 'inkdapper_admin_settings'

const defaultSettings = {
  store: {
    name: 'Ink Dapper',
    tagline: 'Premium Streetwear',
    email: 'support@inkdapper.com',
    phone: '+91 9876543210',
    address: 'Mumbai, Maharashtra, India',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    language: 'en',
  },
  notifications: {
    newOrder: true,
    orderCancelled: true,
    returnRequest: true,
    lowStock: true,
    newUser: false,
    newsletterSignup: false,
    dailySummary: true,
    emailNotifications: true,
  },
  security: {
    sessionTimeout: '60',
    twoFactor: false,
    loginAlerts: true,
    requireStrongPassword: true,
    autoLogout: true,
  },
  appearance: {
    theme: 'dark',
    accentColor: 'orange',
    compactMode: false,
    animations: true,
    sidebarCollapsed: false,
  },
}

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultSettings
    const parsed = JSON.parse(saved)
    return {
      store: { ...defaultSettings.store, ...parsed.store },
      notifications: { ...defaultSettings.notifications, ...parsed.notifications },
      security: { ...defaultSettings.security, ...parsed.security },
      appearance: { ...defaultSettings.appearance, ...parsed.appearance },
    }
  } catch {
    return defaultSettings
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────

const Section = ({ title, icon: Icon, description, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-start gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-orange-500" />
      </div>
      <div>
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title}</h2>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </div>
)

const Field = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
    {children}
    {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
  </div>
)

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-gray-300"

const SelectInput = ({ value, onChange, children }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className={inputCls + ' appearance-none pr-9 cursor-pointer'}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
)

const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between gap-4 py-1">
    <div>
      <p className="text-sm font-medium text-gray-800">{label}</p>
      {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="shrink-0 transition-all duration-200"
      aria-pressed={checked}
    >
      {checked
        ? <ToggleRight className="w-9 h-9 text-orange-500" />
        : <ToggleLeft className="w-9 h-9 text-gray-300" />}
    </button>
  </div>
)

const Divider = () => <div className="border-t border-gray-100" />

// ── Main component ─────────────────────────────────────────────────────────

const Settings = () => {
  const [settings, setSettings] = useState(loadSettings)
  const [saving, setSaving] = useState(null)

  const update = (section, key, value) =>
    setSettings(s => ({ ...s, [section]: { ...s[section], [key]: value } }))

  const save = async (section) => {
    setSaving(section)
    await new Promise(r => setTimeout(r, 600))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setSaving(null)
    toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved!`)
  }

  const SaveBtn = ({ section }) => (
    <div className="flex justify-end pt-2 border-t border-gray-100">
      <button
        onClick={() => save(section)}
        disabled={saving === section}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#0a0a0b', boxShadow: '0 4px 16px rgba(249,115,22,0.25)' }}
      >
        {saving === section
          ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          : <Save className="w-4 h-4" />}
        {saving === section ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-7 rounded-full bg-gradient-to-b from-orange-500 to-amber-400" />
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-xs text-gray-400 mt-0.5">Configure your store and admin preferences</p>
        </div>
      </div>

      {/* ── Store Information ── */}
      <Section title="Store Information" icon={Store} description="Your public store details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Store Name">
            <input className={inputCls} value={settings.store.name}
              onChange={e => update('store', 'name', e.target.value)}
              placeholder="Store name" />
          </Field>
          <Field label="Tagline">
            <input className={inputCls} value={settings.store.tagline}
              onChange={e => update('store', 'tagline', e.target.value)}
              placeholder="e.g. Premium Streetwear" />
          </Field>
          <Field label="Support Email">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input className={inputCls + ' pl-9'} type="email" value={settings.store.email}
                onChange={e => update('store', 'email', e.target.value)}
                placeholder="support@inkdapper.com" />
            </div>
          </Field>
          <Field label="Phone Number">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input className={inputCls + ' pl-9'} type="tel" value={settings.store.phone}
                onChange={e => update('store', 'phone', e.target.value)}
                placeholder="+91 9876543210" />
            </div>
          </Field>
          <Field label="Business Address" >
            <input className={inputCls} value={settings.store.address}
              onChange={e => update('store', 'address', e.target.value)}
              placeholder="City, State, Country" />
          </Field>
          <Field label="Currency">
            <SelectInput value={settings.store.currency} onChange={e => update('store', 'currency', e.target.value)}>
              <option value="INR">INR — Indian Rupee (₹)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
              <option value="GBP">GBP — British Pound (£)</option>
            </SelectInput>
          </Field>
          <Field label="Timezone">
            <SelectInput value={settings.store.timezone} onChange={e => update('store', 'timezone', e.target.value)}>
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
            </SelectInput>
          </Field>
          <Field label="Language">
            <SelectInput value={settings.store.language} onChange={e => update('store', 'language', e.target.value)}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </SelectInput>
          </Field>
        </div>
        <SaveBtn section="store" />
      </Section>

      {/* ── Notifications ── */}
      <Section title="Notifications" icon={Bell} description="Choose what events you want to be notified about">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Order Events</p>
          <Toggle checked={settings.notifications.newOrder} onChange={v => update('notifications', 'newOrder', v)}
            label="New Order Placed" description="Alert when a customer places a new order" />
          <Divider />
          <Toggle checked={settings.notifications.orderCancelled} onChange={v => update('notifications', 'orderCancelled', v)}
            label="Order Cancelled" description="Alert when an order is cancelled by customer" />
          <Divider />
          <Toggle checked={settings.notifications.returnRequest} onChange={v => update('notifications', 'returnRequest', v)}
            label="Return Request" description="Alert when a return is initiated" />
          <Divider />
          <Toggle checked={settings.notifications.lowStock} onChange={v => update('notifications', 'lowStock', v)}
            label="Low Stock Warning" description="Alert when product stock falls below threshold" />
        </div>

        <div className="space-y-1 pt-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer Events</p>
          <Toggle checked={settings.notifications.newUser} onChange={v => update('notifications', 'newUser', v)}
            label="New User Registration" description="Alert when a new customer registers" />
          <Divider />
          <Toggle checked={settings.notifications.newsletterSignup} onChange={v => update('notifications', 'newsletterSignup', v)}
            label="Newsletter Signup" description="Alert for new newsletter subscribers" />
        </div>

        <div className="space-y-1 pt-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Digest</p>
          <Toggle checked={settings.notifications.dailySummary} onChange={v => update('notifications', 'dailySummary', v)}
            label="Daily Summary Email" description="Receive a daily report of store activity" />
          <Divider />
          <Toggle checked={settings.notifications.emailNotifications} onChange={v => update('notifications', 'emailNotifications', v)}
            label="Email Notifications" description="Send all alerts via email as well as in-app" />
        </div>
        <SaveBtn section="notifications" />
      </Section>

      {/* ── Security ── */}
      <Section title="Security" icon={Shield} description="Control access and authentication settings">
        <div className="space-y-1">
          <Toggle checked={settings.security.twoFactor} onChange={v => update('security', 'twoFactor', v)}
            label="Two-Factor Authentication"
            description="Require a verification code on every login" />
          <Divider />
          <Toggle checked={settings.security.loginAlerts} onChange={v => update('security', 'loginAlerts', v)}
            label="Login Alerts"
            description="Send an email when a new login is detected" />
          <Divider />
          <Toggle checked={settings.security.requireStrongPassword} onChange={v => update('security', 'requireStrongPassword', v)}
            label="Require Strong Password"
            description="Enforce uppercase, number, and symbol requirements" />
          <Divider />
          <Toggle checked={settings.security.autoLogout} onChange={v => update('security', 'autoLogout', v)}
            label="Auto Logout on Inactivity"
            description="Automatically log out after the timeout period" />
        </div>

        <Field label="Session Timeout" hint="Auto logout after this many minutes of inactivity">
          <SelectInput value={settings.security.sessionTimeout} onChange={e => update('security', 'sessionTimeout', e.target.value)}>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="240">4 hours</option>
            <option value="0">Never</option>
          </SelectInput>
        </Field>

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex gap-2.5">
          <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">All admin actions are logged for security auditing. Logs are retained for 90 days.</p>
        </div>
        <SaveBtn section="security" />
      </Section>

      {/* ── Appearance ── */}
      <Section title="Appearance" icon={Palette} description="Customize your admin panel look and feel">
        <div className="space-y-1">
          <Toggle checked={settings.appearance.compactMode} onChange={v => update('appearance', 'compactMode', v)}
            label="Compact Mode"
            description="Reduce spacing and padding for a denser layout" />
          <Divider />
          <Toggle checked={settings.appearance.animations} onChange={v => update('appearance', 'animations', v)}
            label="UI Animations"
            description="Enable smooth transitions and micro-animations" />
          <Divider />
          <Toggle checked={settings.appearance.sidebarCollapsed} onChange={v => update('appearance', 'sidebarCollapsed', v)}
            label="Collapsed Sidebar by Default"
            description="Start with the sidebar in collapsed state on load" />
        </div>

        <Field label="Theme">
          <div className="grid grid-cols-2 gap-3">
            {['dark', 'light'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => update('appearance', 'theme', t)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all capitalize ${
                  settings.appearance.theme === t
                    ? 'border-orange-400 bg-orange-50 text-orange-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 ${settings.appearance.theme === t ? 'border-orange-400 bg-orange-400' : 'border-gray-300'}`} />
                {t === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Accent Colour">
          <div className="flex gap-3">
            {[
              { key: 'orange', bg: '#f97316', label: 'Orange' },
              { key: 'blue',   bg: '#3b82f6', label: 'Blue' },
              { key: 'purple', bg: '#a855f7', label: 'Purple' },
              { key: 'green',  bg: '#22c55e', label: 'Green' },
            ].map(({ key, bg, label }) => (
              <button
                key={key}
                type="button"
                title={label}
                onClick={() => update('appearance', 'accentColor', key)}
                className="w-9 h-9 rounded-xl border-2 transition-all hover:scale-110"
                style={{
                  background: bg,
                  borderColor: settings.appearance.accentColor === key ? '#0a0a0b' : 'transparent',
                  boxShadow: settings.appearance.accentColor === key ? `0 0 0 3px ${bg}55` : 'none',
                }}
              />
            ))}
          </div>
        </Field>
        <SaveBtn section="appearance" />
      </Section>

      {/* ── Danger Zone ── */}
      <div className="rounded-2xl border border-red-100 bg-red-50/40 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-red-100">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-red-700 uppercase tracking-wide">Danger Zone</h2>
            <p className="text-xs text-red-400 mt-0.5">These actions are irreversible. Proceed with caution.</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {/* Reset Settings */}
          <div className="flex items-center justify-between gap-4 flex-wrap py-2">
            <div>
              <p className="text-sm font-semibold text-gray-800">Reset All Settings</p>
              <p className="text-xs text-gray-400 mt-0.5">Restore all settings to their default values.</p>
            </div>
            <button
              onClick={() => {
                if (!window.confirm('Reset all settings to defaults?')) return
                localStorage.removeItem(STORAGE_KEY)
                setSettings(defaultSettings)
                toast.info('Settings reset to defaults')
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-orange-600 border border-orange-200 hover:bg-orange-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reset Defaults
            </button>
          </div>

          <Divider />

          {/* Export Settings */}
          <div className="flex items-center justify-between gap-4 flex-wrap py-2">
            <div>
              <p className="text-sm font-semibold text-gray-800">Export Settings</p>
              <p className="text-xs text-gray-400 mt-0.5">Download your current settings as a JSON backup.</p>
            </div>
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'inkdapper-settings.json'
                a.click()
                URL.revokeObjectURL(url)
                toast.success('Settings exported!')
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              <Download className="w-4 h-4" /> Export JSON
            </button>
          </div>

          <Divider />

          {/* Clear all data */}
          <div className="flex items-center justify-between gap-4 flex-wrap py-2">
            <div>
              <p className="text-sm font-semibold text-gray-800">Clear Admin Preferences</p>
              <p className="text-xs text-gray-400 mt-0.5">Delete all locally stored admin data (profile + settings).</p>
            </div>
            <button
              onClick={() => {
                if (!window.confirm('This will delete your saved profile and settings. Continue?')) return
                localStorage.removeItem(STORAGE_KEY)
                localStorage.removeItem('inkdapper_admin_profile')
                setSettings(defaultSettings)
                toast.error('All admin preferences cleared')
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Settings
