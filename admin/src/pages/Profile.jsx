import React, { useState, useRef } from 'react'
import {
  User, Mail, Phone, Shield, Camera, Save, Eye, EyeOff,
  Lock, CheckCircle, AlertCircle, Clock, Key, Trash2
} from 'lucide-react'
import { toast } from 'react-toastify'

const STORAGE_KEY = 'inkdapper_admin_profile'

const defaultProfile = {
  name: 'Admin',
  email: 'admin@inkdapper.com',
  phone: '',
  role: 'Super Admin',
  bio: '',
  avatar: null,
  joinedAt: '2024-01-01',
}

const loadProfile = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile
  } catch {
    return defaultProfile
  }
}

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-orange-500" />
      </div>
      <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
)

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
    {children}
  </div>
)

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-gray-300 disabled:bg-gray-50 disabled:text-gray-400"

const Profile = () => {
  const [profile, setProfile] = useState(loadProfile)
  const [form, setForm] = useState({ ...profile })
  const [passwords, setPasswords] = useState({ current: '', newPwd: '', confirm: '' })
  const [showPwd, setShowPwd] = useState({ current: false, newPwd: false, confirm: false })
  const [saving, setSaving] = useState(false)
  const [pwdSaving, setPwdSaving] = useState(false)
  const [pwdStrength, setPwdStrength] = useState(0)
  const fileRef = useRef()

  // ── Password strength ──────────────────────────────────────────
  const calcStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    return score
  }

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e']

  // ── Avatar upload ──────────────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2 MB'); return }
    const reader = new FileReader()
    reader.onload = (ev) => setForm(f => ({ ...f, avatar: ev.target.result }))
    reader.readAsDataURL(file)
  }

  // ── Save profile ───────────────────────────────────────────────
  const saveProfile = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name is required'); return }
    if (!form.email.trim()) { toast.error('Email is required'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    const updated = { ...form }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setProfile(updated)
    setSaving(false)
    toast.success('Profile updated successfully!')
  }

  // ── Change password ────────────────────────────────────────────
  const changePassword = async (e) => {
    e.preventDefault()
    if (!passwords.current) { toast.error('Enter your current password'); return }
    if (passwords.newPwd.length < 8) { toast.error('New password must be at least 8 characters'); return }
    if (passwords.newPwd !== passwords.confirm) { toast.error('Passwords do not match'); return }
    setPwdSaving(true)
    await new Promise(r => setTimeout(r, 700))
    setPasswords({ current: '', newPwd: '', confirm: '' })
    setPwdStrength(0)
    setPwdSaving(false)
    toast.success('Password changed successfully!')
  }

  const initials = (form.name || 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-7 rounded-full bg-gradient-to-b from-orange-500 to-amber-400" />
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage your admin account details</p>
        </div>
      </div>

      {/* ── Avatar + Identity card ── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #111113 0%, #0d0d0e 100%)',
          border: '1px solid rgba(249,115,22,0.2)',
        }}
      >
        {/* glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', filter: 'blur(30px)' }} />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)' }} />

        <div className="relative flex flex-col sm:flex-row items-center gap-6 p-8">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2"
              style={{ borderColor: 'rgba(249,115,22,0.4)' }}>
              {form.avatar
                ? <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
                : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }}>
                    <span className="text-2xl font-extrabold text-black">{initials}</span>
                  </div>
                )
              }
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              style={{ background: '#f97316', boxShadow: '0 4px 12px rgba(249,115,22,0.4)' }}
              title="Change photo"
            >
              <Camera className="w-4 h-4 text-black" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Identity */}
          <div className="text-center sm:text-left">
            <p className="text-xl font-extrabold text-white">{profile.name}</p>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(253,186,116,0.7)' }}>{profile.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', color: '#fdba74' }}>
                <Shield className="w-3 h-3" /> {profile.role}
              </span>
              <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#86efac' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Online
              </span>
            </div>
            <p className="text-xs mt-2 flex items-center justify-center sm:justify-start gap-1.5"
              style={{ color: 'rgba(255,255,255,0.25)' }}>
              <Clock className="w-3 h-3" /> Member since {new Date(profile.joinedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>

      {/* ── Personal info form ── */}
      <Section title="Personal Information" icon={User}>
        <form onSubmit={saveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name">
              <input className={inputCls} value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your name" />
            </Field>
            <Field label="Role">
              <input className={inputCls} value={form.role} disabled />
            </Field>
            <Field label="Email Address">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input className={inputCls + ' pl-9'} type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@inkdapper.com" />
              </div>
            </Field>
            <Field label="Phone Number">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input className={inputCls + ' pl-9'} type="tel" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 9876543210" />
              </div>
            </Field>
          </div>
          <Field label="Bio">
            <textarea className={inputCls + ' resize-none h-20'} value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Short bio about yourself..." />
          </Field>
          <div className="flex justify-end pt-1">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#0a0a0b', boxShadow: '0 4px 16px rgba(249,115,22,0.3)' }}>
              {saving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Section>

      {/* ── Change password ── */}
      <Section title="Change Password" icon={Lock}>
        <form onSubmit={changePassword} className="space-y-5">
          <Field label="Current Password">
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                className={inputCls + ' pl-9 pr-10'}
                type={showPwd.current ? 'text' : 'password'}
                value={passwords.current}
                onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                placeholder="Current password"
              />
              <button type="button" onClick={() => setShowPwd(s => ({ ...s, current: !s.current }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPwd.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="New Password">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  className={inputCls + ' pl-9 pr-10'}
                  type={showPwd.newPwd ? 'text' : 'password'}
                  value={passwords.newPwd}
                  onChange={e => {
                    setPasswords(p => ({ ...p, newPwd: e.target.value }))
                    setPwdStrength(calcStrength(e.target.value))
                  }}
                  placeholder="New password"
                />
                <button type="button" onClick={() => setShowPwd(s => ({ ...s, newPwd: !s.newPwd }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd.newPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {passwords.newPwd && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i <= pwdStrength ? strengthColor[pwdStrength] : '#e5e7eb' }} />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: strengthColor[pwdStrength] }}>
                    {strengthLabel[pwdStrength]}
                  </p>
                </div>
              )}
            </Field>

            <Field label="Confirm New Password">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  className={inputCls + ' pl-9 pr-10'}
                  type={showPwd.confirm ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  placeholder="Confirm password"
                />
                <button type="button" onClick={() => setShowPwd(s => ({ ...s, confirm: !s.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwords.confirm && passwords.newPwd && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${passwords.newPwd === passwords.confirm ? 'text-emerald-500' : 'text-red-400'}`}>
                  {passwords.newPwd === passwords.confirm
                    ? <><CheckCircle className="w-3 h-3" /> Passwords match</>
                    : <><AlertCircle className="w-3 h-3" /> Passwords do not match</>}
                </p>
              )}
            </Field>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">Use at least 8 characters with uppercase letters, numbers, and symbols for a strong password.</p>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={pwdSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#0a0a0b', boxShadow: '0 4px 16px rgba(249,115,22,0.3)' }}>
              {pwdSaving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Key className="w-4 h-4" />}
              {pwdSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </Section>

      {/* ── Danger zone ── */}
      <div className="rounded-2xl border border-red-100 bg-red-50/40 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-red-100">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <h2 className="text-sm font-bold text-red-700 uppercase tracking-wide">Danger Zone</h2>
        </div>
        <div className="p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-gray-800">Remove Profile Photo</p>
            <p className="text-xs text-gray-400 mt-0.5">Resets your avatar back to initials.</p>
          </div>
          <button
            onClick={() => {
              setForm(f => ({ ...f, avatar: null }))
              const updated = { ...form, avatar: null }
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
              setProfile(updated)
              toast.info('Profile photo removed')
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Remove Photo
          </button>
        </div>
      </div>

    </div>
  )
}

export default Profile
