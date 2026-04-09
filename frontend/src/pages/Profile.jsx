import React, { useContext, useEffect, useRef, useState, memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import { storageUrl } from '../utils/storageUrl'
import ProfileListItems from '../components/ProfileListItems'
import CreditPoints from '../components/CreditPoints'
import {
  User, Mail, Phone, Lock, MapPin, Bell, ShoppingBag,
  Heart, Star, Camera, Save, Eye, EyeOff, Key, Plus,
  Trash2, Edit3, CheckCircle, AlertCircle, Home, Briefcase,
  Package, ChevronRight, ToggleLeft, ToggleRight, Shield,
  Clock, X, Check
} from 'lucide-react'
import { toast } from 'react-toastify'

// ── Constants ────────────────────────────────────────────────────────────────
const ADDR_KEY  = 'inkdapper_addresses'
const PREF_KEY  = 'inkdapper_preferences'
const PROF_KEY  = 'inkdapper_profile_local'

const TABS = [
  { id: 'overview',   label: 'Overview',      icon: User        },
  { id: 'edit',       label: 'Edit Profile',  icon: Edit3       },
  { id: 'addresses',  label: 'Addresses',     icon: MapPin      },
  { id: 'security',   label: 'Security',      icon: Shield      },
  { id: 'prefs',      label: 'Preferences',   icon: Bell        },
]

const defaultPrefs = {
  orderUpdates: true,
  promotions: false,
  newsletter: true,
  smsAlerts: false,
  newArrivals: true,
  priceDrops: true,
}

const emptyAddress = {
  id: '', label: 'Home', name: '', phone: '',
  line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false,
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback }
  catch { return fallback }
}
const persist = (key, val) => localStorage.setItem(key, JSON.stringify(val))

const calcStrength = pwd => {
  let s = 0
  if (pwd.length >= 8) s++
  if (/[A-Z]/.test(pwd)) s++
  if (/[0-9]/.test(pwd)) s++
  if (/[^A-Za-z0-9]/.test(pwd)) s++
  return s
}
const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLOR = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e']

// ── Shared UI atoms ──────────────────────────────────────────────────────────
const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all
  bg-white/[0.04] border border-white/10 text-slate-700 placeholder:text-slate-600
  focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10
  disabled:opacity-40 disabled:cursor-not-allowed`

const OrangeBtn = ({ children, loading, className = '', ...props }) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl
      text-sm font-bold uppercase tracking-wider transition-all
      disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)', color: '#0a0a0b',
      boxShadow: '0 4px 20px rgba(249,115,22,0.3)', ...props.style }}
  >
    {loading
      ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
      : children}
  </button>
)

const GhostBtn = ({ children, ...props }) => (
  <button {...props}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
      transition-all border ${props.className || ''}`}
    style={{ borderColor: 'rgba(249,115,22,0.25)', color: '#fdba74',
      background: 'rgba(249,115,22,0.07)', ...props.style }}
  >
    {children}
  </button>
)

const Card = ({ children, className = '' }) => (
  <div
    className={`relative rounded-2xl overflow-hidden ${className}`}
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}
  >
    <div className="absolute top-0 left-0 w-full h-px"
      style={{ background: 'linear-gradient(90deg,#f97316,#f59e0b,transparent)' }} />
    {children}
  </div>
)

const FieldLabel = ({ children }) => (
  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400/70 mb-1.5">{children}</p>
)

const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b border-white/5 last:border-0">
    <div>
      <p className="text-sm font-medium text-slate-200">{label}</p>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
    <button type="button" onClick={() => onChange(!checked)} className="shrink-0">
      {checked
        ? <ToggleRight className="w-9 h-9 text-orange-500 transition-colors" />
        : <ToggleLeft  className="w-9 h-9 text-slate-600 transition-colors" />}
    </button>
  </div>
)

// ── Sub-sections ─────────────────────────────────────────────────────────────

/* OVERVIEW */
const Overview = ({ user, orderCount, creditPoints, wishlistCount, cartCount }) => {
  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const localData = load(PROF_KEY, {})
  const avatar = user?.avatar || localData.avatar || null

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card>
        <div className="absolute -top-20 -right-10 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(249,115,22,0.8),transparent 70%)' }} />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2"
            style={{ borderColor: 'rgba(249,115,22,0.4)' }}>
            {avatar
              ? <img src={storageUrl(avatar)} alt="avatar" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)' }}>
                  <span className="text-xl font-extrabold text-black">{initials}</span>
                </div>
            }
          </div>
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-2"
              style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-400">Welcome Back</span>
            </div>
            <h2 className="ragged-title text-3xl sm:text-5xl mb-2">{user?.name || 'Member'}</h2>
            <p className="text-slate-400 text-sm">{user?.email || ''}</p>
            {user?.phone && <p className="text-slate-500 text-xs mt-1">{user.phone}</p>}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Orders',   value: orderCount,    icon: Package, color: '#f97316' },
          { label: 'Wishlist', value: wishlistCount,  icon: Heart,   color: '#f59e0b' },
          { label: 'Cart',     value: cartCount,      icon: ShoppingBag, color: '#fb923c' },
          { label: 'Credits',  value: creditPoints,   icon: Star,    color: '#fbbf24' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-semibold">{label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
            <p className="text-3xl font-extrabold" style={{ color }}>{value ?? 0}</p>
          </Card>
        ))}
      </div>

      {/* Credit Points full card */}
      <Card className="p-6 sm:p-8"><CreditPoints /></Card>

      {/* Quick Actions */}
      <Card className="p-6 sm:p-8">
        <h3 className="ragged-title text-xl mb-1">Quick Actions</h3>
        <p className="text-slate-400 text-xs mb-5">Jump into what matters most</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/orders',     label: 'My Orders',    style: { background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#fdba74' } },
            { to: '/wishlist',   label: 'Wishlist',     style: { background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#fcd34d' } },
            { to: '/cart',       label: 'View Cart',    style: { background: 'rgba(251,191,36,0.1)',  border: '1px solid rgba(251,191,36,0.25)', color: '#fde68a' } },
            { to: '/collection', label: 'Shop Now',     style: { background: 'linear-gradient(135deg,#f97316,#f59e0b)', color: '#0d0d0e' } },
          ].map(({ to, label, style }) => (
            <Link key={to} to={to}
              className="rounded-xl px-3 py-4 text-center text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={style}>
              {label}
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent orders + buy again */}
      <ProfileListItems />
    </div>
  )
}

/* EDIT PROFILE */
const EditProfile = ({ user, backendUrl, token, onRefresh }) => {
  const fileRef = useRef()
  const localData = load(PROF_KEY, {})
  const [form, setForm]       = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' })
  const [avatar, setAvatar]   = useState(user?.avatar || localData.avatar || null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [saving, setSaving]   = useState(false)

  const handleAvatar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2 MB'); return }
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = ev => setAvatar(ev.target.result)
    reader.readAsDataURL(file)
  }

  const save = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      if (form.phone) formData.append('phone', form.phone)
      if (avatarFile) formData.append('avatar', avatarFile)

      const res = await axios.put(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token, 'Content-Type': 'multipart/form-data' } }
      )
      if (res.data?.success) {
        const avatarUrl = res.data.user?.avatar || null
        // Sync avatar URL to localStorage so Navbar picks it up immediately
        persist(PROF_KEY, { ...load(PROF_KEY, {}), avatar: avatarUrl })
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'inkdapper_profile_local',
          newValue: JSON.stringify({ ...load(PROF_KEY, {}), avatar: avatarUrl })
        }))
        setAvatarFile(null)
        toast.success('Profile updated!')
        onRefresh?.()
      } else {
        toast.error(res.data?.message || 'Update failed')
      }
    } catch (err) {
      toast.error('Failed to save profile')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const removeAvatar = () => {
    setAvatar(null)
    setAvatarFile(null)
    persist(PROF_KEY, { ...load(PROF_KEY, {}), avatar: null })
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'inkdapper_profile_local',
      newValue: JSON.stringify({ ...load(PROF_KEY, {}), avatar: null })
    }))
    toast.info('Avatar removed')
  }

  const initials = (form.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="ragged-title text-2xl mb-6">Edit Profile</h3>
      <form onSubmit={save} className="space-y-7">

        {/* Avatar */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2"
              style={{ borderColor: 'rgba(249,115,22,0.4)' }}>
              {avatar
                ? <img src={storageUrl(avatar)} alt="avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)' }}>
                    <span className="text-2xl font-extrabold text-black">{initials}</span>
                  </div>
              }
            </div>
            <button type="button" onClick={() => fileRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              style={{ background: '#f97316', boxShadow: '0 4px 12px rgba(249,115,22,0.4)' }}>
              <Camera className="w-4 h-4 text-black" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-slate-200 mb-1">Profile Photo</p>
            <p className="text-xs text-slate-500 mb-3">JPG, PNG or GIF — max 2 MB</p>
            <div className="flex gap-2">
              <GhostBtn type="button" onClick={() => fileRef.current?.click()}>
                <Camera className="w-3.5 h-3.5" /> Upload
              </GhostBtn>
              {avatar && (
                <button type="button" onClick={removeAvatar}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel>Full Name</FieldLabel>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input className={inputCls + ' pl-9'} value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your full name" />
            </div>
          </div>
          <div>
            <FieldLabel>Email Address</FieldLabel>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input className={inputCls + ' pl-9'} value={form.email} disabled
                title="Email cannot be changed" />
            </div>
            <p className="text-[10px] text-slate-600 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <FieldLabel>Phone Number</FieldLabel>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input className={inputCls + ' pl-9'} type="tel" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+91 9876543210" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <OrangeBtn type="submit" loading={saving}>
            {!saving && <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </OrangeBtn>
        </div>
      </form>
    </Card>
  )
}

/* ADDRESSES */
const AddressBook = () => {
  const [addresses, setAddresses] = useState(() => load(ADDR_KEY, []))
  const [editing, setEditing]     = useState(null)   // null = closed, {} = new/edit
  const [saving, setSaving]       = useState(false)

  const saveAddresses = (list) => { setAddresses(list); persist(ADDR_KEY, list) }

  const openNew  = () => setEditing({ ...emptyAddress, id: Date.now().toString() })
  const openEdit = (addr) => setEditing({ ...addr })
  const closeForm = () => setEditing(null)

  const setDefault = (id) => {
    saveAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })))
    toast.success('Default address updated')
  }

  const remove = (id) => {
    if (!window.confirm('Remove this address?')) return
    saveAddresses(addresses.filter(a => a.id !== id))
    toast.info('Address removed')
  }

  const submitForm = async (e) => {
    e.preventDefault()
    if (!editing.name || !editing.line1 || !editing.city || !editing.state || !editing.pincode) {
      toast.error('Please fill all required fields'); return
    }
    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    const exists = addresses.find(a => a.id === editing.id)
    let updated
    if (exists) {
      updated = addresses.map(a => a.id === editing.id ? { ...editing } : a)
    } else {
      const isFirst = addresses.length === 0
      updated = [...addresses, { ...editing, isDefault: editing.isDefault || isFirst }]
    }
    if (editing.isDefault) {
      updated = updated.map(a => ({ ...a, isDefault: a.id === editing.id }))
    }
    saveAddresses(updated)
    setSaving(false)
    setEditing(null)
    toast.success(exists ? 'Address updated!' : 'Address added!')
  }

  const LabelIcon = ({ label }) => label === 'Work'
    ? <Briefcase className="w-3.5 h-3.5" />
    : <Home className="w-3.5 h-3.5" />

  return (
    <div className="space-y-5">
      {/* Address list */}
      {addresses.length === 0 && !editing && (
        <Card className="p-8 text-center">
          <MapPin className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p className="text-slate-400 text-sm mb-4">No saved addresses yet</p>
          <OrangeBtn onClick={openNew}><Plus className="w-4 h-4" /> Add Address</OrangeBtn>
        </Card>
      )}

      {addresses.map(addr => (
        <Card key={addr.id} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#fdba74' }}>
                <LabelIcon label={addr.label} /> {addr.label}
              </div>
              {addr.isDefault && (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#86efac' }}>
                  <Check className="w-3 h-3" /> Default
                </span>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              {!addr.isDefault && (
                <button onClick={() => setDefault(addr.id)}
                  className="text-[10px] font-semibold text-slate-400 hover:text-orange-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
                  Set Default
                </button>
              )}
              <button onClick={() => openEdit(addr)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-orange-400 hover:bg-white/5 transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => remove(addr.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-200">{addr.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{addr.phone}</p>
          <p className="text-xs text-slate-400 mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
          <p className="text-xs text-slate-400">{addr.city}, {addr.state} — {addr.pincode}</p>
        </Card>
      ))}

      {/* Add button when list has items */}
      {addresses.length > 0 && !editing && (
        <GhostBtn onClick={openNew} className="w-full justify-center py-3">
          <Plus className="w-4 h-4" /> Add New Address
        </GhostBtn>
      )}

      {/* Address Form */}
      {editing && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h4 className="ragged-title text-lg">{addresses.find(a => a.id === editing.id) ? 'Edit Address' : 'New Address'}</h4>
            <button onClick={closeForm} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={submitForm} className="space-y-4">
            {/* Label */}
            <div>
              <FieldLabel>Address Type</FieldLabel>
              <div className="flex gap-2">
                {['Home', 'Work', 'Other'].map(l => (
                  <button key={l} type="button"
                    onClick={() => setEditing(f => ({ ...f, label: l }))}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                    style={{
                      background: editing.label === l ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
                      borderColor: editing.label === l ? 'rgba(249,115,22,0.5)' : 'rgba(255,255,255,0.08)',
                      color: editing.label === l ? '#fdba74' : '#64748b',
                    }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Full Name *</FieldLabel>
                <input className={inputCls} value={editing.name}
                  onChange={e => setEditing(f => ({ ...f, name: e.target.value }))}
                  placeholder="Recipient name" />
              </div>
              <div>
                <FieldLabel>Phone *</FieldLabel>
                <input className={inputCls} type="tel" value={editing.phone}
                  onChange={e => setEditing(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 9876543210" />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Address Line 1 *</FieldLabel>
                <input className={inputCls} value={editing.line1}
                  onChange={e => setEditing(f => ({ ...f, line1: e.target.value }))}
                  placeholder="House / Flat / Block No., Street" />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Address Line 2</FieldLabel>
                <input className={inputCls} value={editing.line2}
                  onChange={e => setEditing(f => ({ ...f, line2: e.target.value }))}
                  placeholder="Landmark, Area (optional)" />
              </div>
              <div>
                <FieldLabel>City *</FieldLabel>
                <input className={inputCls} value={editing.city}
                  onChange={e => setEditing(f => ({ ...f, city: e.target.value }))}
                  placeholder="City" />
              </div>
              <div>
                <FieldLabel>State *</FieldLabel>
                <input className={inputCls} value={editing.state}
                  onChange={e => setEditing(f => ({ ...f, state: e.target.value }))}
                  placeholder="State" />
              </div>
              <div>
                <FieldLabel>Pincode *</FieldLabel>
                <input className={inputCls} value={editing.pincode}
                  onChange={e => setEditing(f => ({ ...f, pincode: e.target.value }))}
                  placeholder="110001" maxLength={6} />
              </div>
            </div>

            {/* Set as default */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setEditing(f => ({ ...f, isDefault: !f.isDefault }))}
                className="w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer"
                style={{
                  borderColor: editing.isDefault ? '#f97316' : 'rgba(255,255,255,0.15)',
                  background: editing.isDefault ? '#f97316' : 'transparent',
                }}>
                {editing.isDefault && <Check className="w-3 h-3 text-black" />}
              </div>
              <span className="text-sm text-slate-300">Set as default address</span>
            </label>

            <div className="flex gap-3 justify-end pt-1">
              <button type="button" onClick={closeForm}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 border border-white/10 hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <OrangeBtn type="submit" loading={saving}>
                {!saving && <Save className="w-4 h-4" />}
                {saving ? 'Saving…' : 'Save Address'}
              </OrangeBtn>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}

/* SECURITY */
const Security = ({ backendUrl, token }) => {
  const [pwd, setPwd]         = useState({ current: '', newPwd: '', confirm: '' })
  const [show, setShow]       = useState({ current: false, newPwd: false, confirm: false })
  const [strength, setStrength] = useState(0)
  const [saving, setSaving]   = useState(false)

  const change = async (e) => {
    e.preventDefault()
    if (!pwd.current)            { toast.error('Enter current password');      return }
    if (pwd.newPwd.length < 8)   { toast.error('Minimum 8 characters');        return }
    if (pwd.newPwd !== pwd.confirm) { toast.error('Passwords do not match');   return }
    setSaving(true)
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/change-password`,
        { currentPassword: pwd.current, newPassword: pwd.newPwd },
        { headers: { token } }
      )
      if (res.data?.success) {
        toast.success('Password changed successfully!')
        setPwd({ current: '', newPwd: '', confirm: '' })
        setStrength(0)
      } else {
        toast.error(res.data?.message || 'Failed to change password')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed')
    } finally {
      setSaving(false)
    }
  }

  const EyeBtn = ({ field }) => (
    <button type="button" onClick={() => setShow(s => ({ ...s, [field]: !s[field] }))}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
      {show[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  )

  return (
    <div className="space-y-5">
      {/* Change password */}
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <Key className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Change Password</h3>
            <p className="text-xs text-slate-500 mt-0.5">Keep your account secure with a strong password</p>
          </div>
        </div>

        <form onSubmit={change} className="space-y-5">
          <div>
            <FieldLabel>Current Password</FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input className={inputCls + ' pl-9 pr-10'} type={show.current ? 'text' : 'password'}
                value={pwd.current} onChange={e => setPwd(p => ({ ...p, current: e.target.value }))}
                placeholder="Current password" />
              <EyeBtn field="current" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel>New Password</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input className={inputCls + ' pl-9 pr-10'} type={show.newPwd ? 'text' : 'password'}
                  value={pwd.newPwd}
                  onChange={e => { setPwd(p => ({ ...p, newPwd: e.target.value })); setStrength(calcStrength(e.target.value)) }}
                  placeholder="New password" />
                <EyeBtn field="newPwd" />
              </div>
              {pwd.newPwd && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? STRENGTH_COLOR[strength] : 'rgba(255,255,255,0.08)' }} />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: STRENGTH_COLOR[strength] }}>
                    {STRENGTH_LABEL[strength]}
                  </p>
                </div>
              )}
            </div>

            <div>
              <FieldLabel>Confirm Password</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input className={inputCls + ' pl-9 pr-10'} type={show.confirm ? 'text' : 'password'}
                  value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))}
                  placeholder="Confirm new password" />
                <EyeBtn field="confirm" />
              </div>
              {pwd.confirm && pwd.newPwd && (
                <p className={`text-xs mt-1.5 flex items-center gap-1 ${pwd.newPwd === pwd.confirm ? 'text-emerald-400' : 'text-red-400'}`}>
                  {pwd.newPwd === pwd.confirm
                    ? <><CheckCircle className="w-3 h-3" /> Passwords match</>
                    : <><AlertCircle className="w-3 h-3" /> Does not match</>}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl"
            style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-400/80">Use at least 8 characters including uppercase letters, numbers and symbols.</p>
          </div>

          <div className="flex justify-end">
            <OrangeBtn type="submit" loading={saving}>
              {!saving && <Key className="w-4 h-4" />}
              {saving ? 'Updating…' : 'Update Password'}
            </OrangeBtn>
          </div>
        </form>
      </Card>

      {/* Account info */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <Shield className="w-4 h-4 text-orange-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Account Security</h3>
        </div>
        {[
          { label: 'Account Status', value: 'Active & Verified', color: '#22c55e' },
          { label: 'Login Method',   value: 'Email & Password',  color: '#94a3b8' },
          { label: 'Data Encryption', value: 'AES-256 Secured',  color: '#94a3b8' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-xs font-semibold" style={{ color }}>{value}</p>
          </div>
        ))}
      </Card>
    </div>
  )
}

/* PREFERENCES */
const Preferences = () => {
  const [prefs, setPrefs] = useState(() => load(PREF_KEY, defaultPrefs))

  const update = (key, val) => {
    const updated = { ...prefs, [key]: val }
    setPrefs(updated)
    persist(PREF_KEY, updated)
    toast.success('Preference saved')
  }

  return (
    <div className="space-y-5">
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <Bell className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Notification Preferences</h3>
            <p className="text-xs text-slate-500 mt-0.5">Choose what you want to hear about</p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400/60 mb-2">Orders & Shipping</p>
          <Toggle checked={prefs.orderUpdates} onChange={v => update('orderUpdates', v)}
            label="Order Updates" description="Shipping status, delivery confirmations" />
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400/60 mb-2">Marketing</p>
          <Toggle checked={prefs.promotions}   onChange={v => update('promotions', v)}
            label="Promotions & Offers" description="Exclusive deals, flash sales and coupons" />
          <Toggle checked={prefs.newsletter}   onChange={v => update('newsletter', v)}
            label="Newsletter" description="Weekly style drops and brand updates" />
          <Toggle checked={prefs.smsAlerts}    onChange={v => update('smsAlerts', v)}
            label="SMS Alerts" description="Receive important updates via text message" />
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400/60 mb-2">Products</p>
          <Toggle checked={prefs.newArrivals}  onChange={v => update('newArrivals', v)}
            label="New Arrivals" description="Be first to know when new styles drop" />
          <Toggle checked={prefs.priceDrops}   onChange={v => update('priceDrops', v)}
            label="Price Drops" description="Alert when a wishlisted item goes on sale" />
        </div>
      </Card>

      {/* Recently viewed */}
      <RecentlyViewed />
    </div>
  )
}

/* RECENTLY VIEWED */
const RecentlyViewed = () => {
  const { recentlyViewed, currency } = useContext(ShopContext)
  if (!recentlyViewed?.length) return null

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
          <Clock className="w-4 h-4 text-orange-400" />
        </div>
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Recently Viewed</h3>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {recentlyViewed.slice(0, 5).map(product => (
          <Link key={product._id} to={`/product/${product.slug || product._id}`}
            className="group relative rounded-xl overflow-hidden border transition-all hover:-translate-y-0.5"
            style={{ borderColor: 'rgba(249,115,22,0.15)' }}>
            <div className="aspect-square bg-slate-900">
              <img src={storageUrl(Array.isArray(product.image) ? product.image[0] : product.image)}
                alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-2 bg-black/40">
              <p className="text-[10px] text-slate-300 font-medium truncate">{product.name}</p>
              <p className="text-[10px] text-orange-400 font-bold mt-0.5">{currency}{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}

// ── Main Profile Page ─────────────────────────────────────────────────────────
const Profile = () => {
  const { usersDetails, orderCount, fetchOrderDetails, getCreditScore,
          creditPoints, backendUrl, token, wishlist, getWishlistCount, getCartCount } = useContext(ShopContext)
  const effectRan = useRef(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (effectRan.current) return
    getCreditScore()
    fetchOrderDetails()
    effectRan.current = true
    return () => { effectRan.current = false }
  }, [])

  const user = usersDetails?.[0]?.users || null
  const wishlistCount = getWishlistCount?.() ?? 0
  const cartCount     = getCartCount?.() ?? 0

  return (
    <div className="ragged-section min-h-screen" style={{ background: '#0d0d0e' }}>
      <div className="ragged-noise" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <h1 className="sr-only">Your Profile</h1>

        {/* ── Tab bar ── */}
        <div className="flex items-center gap-1 mb-7 overflow-x-auto pb-1 scrollbar-none">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id
            return (
              <button key={id} onClick={() => setActiveTab(id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 shrink-0"
                style={{
                  background: active ? 'linear-gradient(135deg,#f97316,#f59e0b)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? 'transparent' : 'rgba(249,115,22,0.12)'}`,
                  color: active ? '#0a0a0b' : '#94a3b8',
                  boxShadow: active ? '0 4px 16px rgba(249,115,22,0.3)' : 'none',
                }}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            )
          })}
        </div>

        {/* ── Tab content ── */}
        {activeTab === 'overview' && (
          <Overview user={user} orderCount={orderCount} creditPoints={creditPoints}
            wishlistCount={wishlistCount} cartCount={cartCount} />
        )}
        {activeTab === 'edit' && (
          <EditProfile user={user} backendUrl={backendUrl} token={token}
            onRefresh={() => { getCreditScore(); fetchOrderDetails() }} />
        )}
        {activeTab === 'addresses' && <AddressBook />}
        {activeTab === 'security'  && <Security backendUrl={backendUrl} token={token} />}
        {activeTab === 'prefs'     && <Preferences />}
      </div>
    </div>
  )
}

export default memo(Profile)
