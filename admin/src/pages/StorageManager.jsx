import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  HardDrive,
  RefreshCw,
  Trash2,
  FolderOpen,
  Folder,
  ChevronRight,
  Home,
  CheckCircle,
  XCircle,
  Image,
  Loader2,
  Copy,
  Terminal,
  ExternalLink,
  X,
  FileImage,
  Info,
} from 'lucide-react'
import { backendUrl } from '../App'
import { imageProxyUrl } from '../utils/storageUrl'

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (bytes) => {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const isImage = (name) => /\.(jpe?g|png|gif|webp|avif|svg|bmp)$/i.test(name)

const CopyBtn = ({ text, label = '' }) => {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-xs"
      title="Copy"
    >
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      {label}
    </button>
  )
}

// ─── MinIO setup guide (shown when not connected) ───────────────────────────

const DOCKER_CMD =
  'docker run -d --name minio \\\n  -p 9000:9000 -p 9001:9001 \\\n  -e MINIO_ROOT_USER=minioadmin \\\n  -e MINIO_ROOT_PASSWORD=minioadmin \\\n  minio/minio server /data --console-address ":9001"'

const SetupGuide = ({ endpoint, onRetry, retrying }) => (
  <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
    <div className="p-5 bg-red-50 border-b border-red-200 flex items-center gap-3">
      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-red-700">MinIO is not running</p>
        <p className="text-sm text-red-500 truncate">Cannot connect to <span className="font-mono">{endpoint}</span></p>
      </div>
      <button
        onClick={onRetry}
        disabled={retrying}
        className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex-shrink-0"
      >
        {retrying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        Retry
      </button>
    </div>
    <div className="p-6 space-y-5">
      <p className="text-slate-600 text-sm">Start MinIO, then click <strong>Retry</strong>.</p>
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <Terminal className="w-4 h-4" /> Docker (recommended)
        </p>
        <div className="relative bg-slate-900 rounded-xl p-4 font-mono text-xs text-green-400 leading-relaxed">
          <pre className="whitespace-pre-wrap pr-8">{DOCKER_CMD}</pre>
          <span className="absolute top-3 right-3"><CopyBtn text={DOCKER_CMD} /></span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'API', value: 'localhost:9000' },
          { label: 'Console', value: 'localhost:9001' },
          { label: 'User', value: 'minioadmin' },
          { label: 'Password', value: 'minioadmin' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-0.5">{label}</p>
            <p className="font-mono text-sm text-slate-500 font-medium">{value}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// ─── File detail side panel ──────────────────────────────────────────────────

const FileDetail = ({ file, onClose, onDelete, deleting }) => (
  <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col">
    <div className="flex items-center justify-between p-4 border-b border-slate-100">
      <span className="font-semibold text-slate-500 text-sm truncate flex-1">{file.displayName}</span>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-slate-100 rounded-lg transition-colors">
        <X className="w-4 h-4 text-slate-500" />
      </button>
    </div>

    {/* Preview */}
    <div className="p-4 border-b border-slate-100 bg-slate-50">
      {isImage(file.displayName) ? (
        <img
          src={imageProxyUrl(file.url)}
          alt={file.displayName}
          className="w-full max-h-48 object-contain rounded-xl bg-white border border-slate-200"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      ) : (
        <div className="w-full h-32 flex items-center justify-center rounded-xl bg-white border border-slate-200">
          <FileImage className="w-10 h-10 text-slate-300" />
        </div>
      )}
    </div>

    {/* Meta */}
    <div className="p-4 space-y-3 flex-1 overflow-y-auto">
      <div>
        <p className="text-xs text-slate-700 mb-0.5">Object key</p>
        <p className="font-mono text-xs text-slate-600 break-all">{file.name}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-slate-700 mb-0.5">Size</p>
          <p className="text-sm font-medium text-slate-700">{fmt(file.size)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-700 mb-0.5">Modified</p>
          <p className="text-sm font-medium text-slate-700">
            {new Date(file.lastModified).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div>
        <p className="text-xs text-slate-700 mb-1">Public URL</p>
        <div className="flex items-start gap-2">
          <p className="font-mono text-xs text-slate-600 break-all flex-1 bg-slate-50 rounded-lg p-2 border border-slate-200">{file.url}</p>
        </div>
        <div className="flex gap-3 mt-2">
          <CopyBtn text={file.url} label="Copy URL" />
          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open
          </a>
        </div>
      </div>
    </div>

    {/* Actions */}
    <div className="p-4 border-t border-slate-100">
      <button
        onClick={() => onDelete(file.name, file.displayName)}
        disabled={deleting}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
      >
        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        {deleting ? 'Deleting…' : 'Delete file'}
      </button>
    </div>
  </div>
)

// ─── Main component ──────────────────────────────────────────────────────────

const StorageManager = ({ token }) => {
  const [health, setHealth] = useState(null)
  const [loadingHealth, setLoadingHealth] = useState(true)

  const [prefix, setPrefix] = useState('')
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [loadingBrowse, setLoadingBrowse] = useState(false)

  const [stats, setStats] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [deletingKey, setDeletingKey] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [deleteConfirm, setDeleteConfirm] = useState(null)   // { objectName, displayName }
  const [selectedFiles, setSelectedFiles] = useState(new Set())
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false)
  const [deletingBulk, setDeletingBulk] = useState(false)

  const headers = { token }
  const isConnected = health?.success === true

  // Build breadcrumbs from prefix string e.g. "products/reviews/" → ['products','reviews']
  const breadcrumbs = prefix ? prefix.replace(/\/$/, '').split('/') : []

  const fetchHealth = useCallback(async () => {
    setLoadingHealth(true)
    try {
      const { data } = await axios.get(`${backendUrl}/api/storage/health`, { headers })
      setHealth(data)
      return data.success === true
    } catch (err) {
      setHealth({ success: false, status: 'disconnected', minioDown: true, message: err.message, endpoint: 'localhost:9000' })
      return false
    } finally {
      setLoadingHealth(false)
    }
  }, [token])

  const fetchBrowse = useCallback(async (p = '') => {
    setLoadingBrowse(true)
    try {
      const { data } = await axios.get(`${backendUrl}/api/storage/browse`, {
        headers,
        params: { prefix: p },
      })
      if (data.success) {
        setFolders(data.folders)
        setFiles(data.files)
      }
    } catch {
      toast.error('Failed to load folder contents')
    } finally {
      setLoadingBrowse(false)
    }
  }, [token])

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/storage/stats`, { headers })
      if (data.success) setStats(data.stats)
    } catch { /* silent */ }
  }, [token])

  useEffect(() => {
    fetchHealth().then((ok) => {
      if (ok) {
        fetchBrowse('')
        fetchStats()
      }
    })
  }, [])

  const navigate = (newPrefix) => {
    setPrefix(newPrefix)
    setSelectedFile(null)
    setSelectedFiles(new Set())
    fetchBrowse(newPrefix)
  }

  const navigateToBreadcrumb = (index) => {
    const newPrefix = index < 0 ? '' : breadcrumbs.slice(0, index + 1).join('/') + '/'
    navigate(newPrefix)
  }

  const handleRetry = async () => {
    const ok = await fetchHealth()
    if (ok) {
      fetchBrowse(prefix)
      fetchStats()
    }
  }

  const handleDelete = (objectName, displayName) => {
    setDeleteConfirm({ objectName, displayName: displayName || objectName })
  }

  const confirmDelete = async () => {
    const { objectName } = deleteConfirm
    setDeleteConfirm(null)
    setDeletingKey(objectName)
    try {
      const { data } = await axios.delete(`${backendUrl}/api/storage/delete`, {
        headers,
        data: { objectName },
      })
      if (data.success) {
        toast.success('File deleted')
        setFiles((prev) => prev.filter((f) => f.name !== objectName))
        if (selectedFile?.name === objectName) setSelectedFile(null)
        setSelectedFiles((prev) => { const next = new Set(prev); next.delete(objectName); return next })
        fetchStats()
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeletingKey(null)
    }
  }

  const toggleSelectFile = (name) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const toggleSelectAllFiles = () => {
    if (selectedFiles.size === files.length && files.length > 0) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(files.map((f) => f.name)))
    }
  }

  const handleBulkDelete = async () => {
    setDeletingBulk(true)
    setBulkDeleteConfirm(false)
    const names = Array.from(selectedFiles)
    try {
      await Promise.all(
        names.map((objectName) =>
          axios.delete(`${backendUrl}/api/storage/delete`, { headers, data: { objectName } })
        )
      )
      toast.success(`${names.length} file${names.length > 1 ? 's' : ''} deleted`)
      setFiles((prev) => prev.filter((f) => !selectedFiles.has(f.name)))
      if (selectedFile && selectedFiles.has(selectedFile.name)) setSelectedFile(null)
      setSelectedFiles(new Set())
      fetchStats()
    } catch {
      toast.error('Some files could not be deleted')
    } finally {
      setDeletingBulk(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Storage Manager</h1>
            <p className="text-sm text-slate-500">MinIO · {health?.bucket || '—'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected && stats && (
            <span className="hidden sm:block text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
              {stats.totalObjects} files · {fmt(stats.totalSize)}
            </span>
          )}
          {isConnected && health?.consoleUrl && (
            <a
              href={`${health.consoleUrl}/browser/${health?.bucket || 'inkdapper'}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-xl text-sm font-medium transition-colors"
              title="Open MinIO Web Console"
            >
              <ExternalLink className="w-4 h-4" />
              MinIO Console
            </a>
          )}
          {isConnected && !health?.consoleUrl && (
            <a
              href={`http://localhost:9001/browser/${health?.bucket || 'inkdapper'}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-xl text-sm font-medium transition-colors"
              title="Open MinIO Web Console (local dev only)"
            >
              <ExternalLink className="w-4 h-4" />
              MinIO Console
            </a>
          )}
          <button
            onClick={handleRetry}
            disabled={loadingHealth}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loadingHealth ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh
          </button>
        </div>
      </div>

      {/* ── Loading ── */}
      {loadingHealth && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex items-center justify-center gap-3 text-slate-700">
          <Loader2 className="w-5 h-5 animate-spin" />
          Checking MinIO connection…
        </div>
      )}

      {/* ── Not connected ── */}
      {!loadingHealth && !isConnected && (
        <SetupGuide endpoint={health?.endpoint || 'localhost:9000'} onRetry={handleRetry} retrying={loadingHealth} />
      )}

      {/* ── File Explorer ── */}
      {!loadingHealth && isConnected && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Top toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 flex-wrap text-sm min-w-0">
              <button
                onClick={() => navigate('')}
                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-200 transition-colors text-slate-600 font-medium flex-shrink-0"
              >
                <Home className="w-3.5 h-3.5" />
                {health.bucket}
              </button>

              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
                  <button
                    onClick={() => navigateToBreadcrumb(i)}
                    className={`px-2 py-1 rounded-lg hover:bg-slate-200 transition-colors font-medium flex-shrink-0 ${i === breadcrumbs.length - 1 ? 'text-blue-600' : 'text-slate-600'
                      }`}
                  >
                    {crumb}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Select-all checkbox (only when files exist) */}
            {files.length > 0 && (
              <label className="flex items-center gap-1.5 ml-3 cursor-pointer flex-shrink-0" title="Select all files">
                <input
                  type="checkbox"
                  checked={selectedFiles.size === files.length && files.length > 0}
                  onChange={toggleSelectAllFiles}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs text-slate-500 select-none">All</span>
              </label>
            )}

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-slate-200 rounded-lg p-0.5 flex-shrink-0 ml-3">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewMode === 'grid' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewMode === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Selection action bar */}
          {selectedFiles.size > 0 && (
            <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50 border-b border-blue-100">
              <span className="text-sm font-medium text-blue-800">
                {selectedFiles.size} file{selectedFiles.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedFiles(new Set())}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-white transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setBulkDeleteConfirm(true)}
                  disabled={deletingBulk}
                  className="px-3 py-1.5 text-xs text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {deletingBulk ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* Content area */}
          <div className="p-4">
            {loadingBrowse ? (
              <div className="py-16 flex items-center justify-center gap-2 text-slate-700">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading…
              </div>
            ) : folders.length === 0 && files.length === 0 ? (
              prefix === '' ? (
                /* Root-level empty — bucket has no files yet */
                <div className="py-10 space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <HardDrive className="w-8 h-8 text-cyan-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-1">Bucket is empty</h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                      MinIO is connected and ready. Files will appear here after you upload products or banners through the admin panel.
                    </p>
                  </div>

                  {/* Quick action cards */}
                  <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {[
                      { icon: '🖼️', label: 'Add Product', sub: 'Upload product images via Add Items', href: '/add' },
                      { icon: '📸', label: 'Add Banner', sub: 'Upload banner images via Add Banner', href: '/add-banner' },
                      { icon: '🗂️', label: 'MinIO Console', sub: 'Upload files directly in MinIO web UI', href: health?.consoleUrl ? `${health.consoleUrl}/browser/${health?.bucket || 'inkdapper'}` : `http://localhost:9001/browser/${health?.bucket || 'inkdapper'}`, external: true },
                    ].map(({ icon, label, sub, href, external }) => (
                      external ? (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 transition-all text-center group"
                        >
                          <span className="text-2xl">{icon}</span>
                          <span className="text-sm font-semibold text-slate-700">{label}</span>
                          <span className="text-xs text-slate-700">{sub}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-700 group-hover:text-cyan-500 transition-colors" />
                        </a>
                      ) : (
                        <a
                          key={label}
                          href={href}
                          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-center"
                        >
                          <span className="text-2xl">{icon}</span>
                          <span className="text-sm font-semibold text-slate-700">{label}</span>
                          <span className="text-xs text-slate-700">{sub}</span>
                        </a>
                      )
                    ))}
                  </div>

                  {/* Info box */}
                  <div className="max-w-2xl mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                    <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-relaxed">
                      <strong>Note:</strong> Existing product images imported from Cloudinary are stored on Cloudinary's servers and won't appear here. Only new images uploaded after switching to MinIO will be stored in this bucket.
                    </p>
                  </div>
                </div>
              ) : (
                /* Sub-folder empty */
                <div className="py-16 text-center text-slate-700">
                  <FolderOpen className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">This folder is empty</p>
                </div>
              )
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3'
                : 'space-y-1'
              }>
                {/* ── Folders ── */}
                {folders.map((f) => (
                  viewMode === 'grid' ? (
                    <button
                      key={f.prefix}
                      onClick={() => navigate(f.prefix)}
                      className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-center"
                    >
                      <div className="w-12 h-12 flex items-center justify-center">
                        <Folder className="w-10 h-10 text-amber-400 group-hover:text-amber-500 transition-colors fill-amber-100" />
                      </div>
                      <span className="text-xs font-medium text-slate-700 truncate w-full">{f.name}</span>
                    </button>
                  ) : (
                    <button
                      key={f.prefix}
                      onClick={() => navigate(f.prefix)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-left group"
                    >
                      <Folder className="w-5 h-5 text-amber-400 fill-amber-100 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-700 flex-1 truncate">{f.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-500 flex-shrink-0" />
                    </button>
                  )
                ))}

                {/* ── Files ── */}
                {files.map((file) => (
                  viewMode === 'grid' ? (
                    <div
                      key={file.name}
                      onClick={() => setSelectedFile(file)}
                      className={`group relative flex flex-col items-center gap-2 p-2 rounded-xl border transition-all text-center cursor-pointer ${selectedFiles.has(file.name)
                          ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300'
                          : selectedFile?.name === file.name
                            ? 'border-blue-400 bg-blue-50 shadow-sm'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                    >
                      {/* Select checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedFiles.has(file.name)}
                        onChange={(e) => { e.stopPropagation(); toggleSelectFile(file.name) }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-1.5 left-1.5 w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity checked:opacity-100"
                      />
                      {/* Thumbnail */}
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                        {isImage(file.displayName) ? (
                          <img
                            src={imageProxyUrl(file.url)}
                            alt={file.displayName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div
                          className="w-full h-full items-center justify-center"
                          style={{ display: isImage(file.displayName) ? 'none' : 'flex' }}
                        >
                          <Image className="w-8 h-8 text-slate-300" />
                        </div>
                      </div>
                      <span className="text-xs text-slate-600 truncate w-full px-1">{file.displayName}</span>
                      <span className="text-xs text-slate-700">{fmt(file.size)}</span>

                      {/* Quick delete on hover */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(file.name, file.displayName) }}
                        disabled={deletingKey === file.name}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingKey === file.name
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <Trash2 className="w-3 h-3" />
                        }
                      </button>
                    </div>
                  ) : (
                    <div
                      key={file.name}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left group cursor-pointer ${selectedFiles.has(file.name)
                          ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-200'
                          : selectedFile?.name === file.name
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
                        }`}
                    >
                      {/* Select checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedFiles.has(file.name)}
                        onChange={(e) => { e.stopPropagation(); toggleSelectFile(file.name) }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
                      />
                      {/* Thumbnail */}
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0">
                        {isImage(file.displayName) ? (
                          <img
                            src={imageProxyUrl(file.url)}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        ) : (
                          <Image className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{file.displayName}</p>
                        <p className="text-xs text-slate-700">
                          {fmt(file.size)} · {new Date(file.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <span className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                          <Info className="w-3.5 h-3.5 text-slate-500" />
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(file.name, file.displayName) }}
                          disabled={deletingKey === file.name}
                          className="p-1.5 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingKey === file.name
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                            : <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          }
                        </button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Footer status bar */}
          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-700">
            <span>{folders.length} folder{folders.length !== 1 ? 's' : ''}, {files.length} file{files.length !== 1 ? 's' : ''}</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Connected to {health.endpoint}
            </span>
          </div>
        </div>
      )}

      {/* ── Single delete confirmation modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Delete File</h2>
            </div>
            <p className="text-slate-600 mb-1 text-sm">Are you sure you want to delete:</p>
            <p className="font-mono text-xs text-slate-700 bg-slate-50 rounded-lg px-3 py-2 mb-5 break-all border border-slate-200">{deleteConfirm.displayName}</p>
            <p className="text-xs text-slate-700 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk delete confirmation modal ── */}
      {bulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Delete {selectedFiles.size} Files</h2>
            </div>
            <p className="text-slate-600 mb-5 text-sm">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-red-600">{selectedFiles.size} file{selectedFiles.size > 1 ? 's' : ''}</span>?{' '}
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setBulkDeleteConfirm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                No
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── File detail side panel ── */}
      {selectedFile && (
        <>
          <div
            className="fixed inset-0 bg-black/10 z-40"
            onClick={() => setSelectedFile(null)}
          />
          <FileDetail
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
            onDelete={handleDelete}
            deleting={deletingKey === selectedFile.name}
          />
        </>
      )}
    </div>
  )
}

export default StorageManager
