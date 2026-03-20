'use client'

import { useState, useEffect, useRef, useCallback, DragEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'

interface AdminFile {
  name: string
  size: number
  uploadedAt: string
  url: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getFileLabel(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes('summary')) return 'Summary'
  if (lower.includes('flyer')) return 'Flyer'
  if (lower.includes('report')) return 'Report'
  if (lower.includes('newsletter')) return 'Newsletter'
  if (lower.includes('announcement')) return 'Announcement'
  return 'Document'
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [files, setFiles] = useState<AdminFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [deletingFile, setDeletingFile] = useState<string | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/files')
      const data = await res.json()
      setFiles(data.files ?? [])
    } catch {
      showToast('Failed to load files.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  async function uploadFile(file: File) {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Only PDF files are accepted.', 'error')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      showToast('File is too large (max 20 MB).', 'error')
      return
    }

    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)

      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const data = await res.json()

      if (!res.ok) {
        showToast(data.error ?? 'Upload failed.', 'error')
        return
      }

      showToast(`"${data.filename}" uploaded successfully.`, 'success')
      await fetchFiles()
    } catch {
      showToast('Upload failed. Check your connection.', 'error')
    } finally {
      setUploading(false)
    }
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ''
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  async function handleDelete(filename: string) {
    if (!confirm(`Delete "${filename}"? This cannot be undone.`)) return
    setDeletingFile(filename)
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error ?? 'Delete failed.', 'error')
        return
      }
      showToast(`"${filename}" deleted.`, 'success')
      await fetchFiles()
    } catch {
      showToast('Delete failed.', 'error')
    } finally {
      setDeletingFile(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center shadow">
              <span className="text-white text-lg font-bold leading-none" style={{ fontFamily: 'serif' }}>ॐ</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 leading-none">Vishnu Mandir Tampa</p>
              <h1 className="text-base font-semibold text-gray-800 leading-tight">Admin Portal</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* Upload Zone */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Upload Document</h2>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all select-none ${
              dragOver
                ? 'border-amber-500 bg-amber-50'
                : uploading
                ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50/50 bg-white'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileInput}
              disabled={uploading}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <svg className="w-8 h-8 text-amber-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm text-gray-500">Uploading…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Drag & drop a PDF here, or <span className="text-amber-600 underline">click to browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PDF files only — max 20 MB</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* File List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Documents
              {!loading && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({files.length} {files.length === 1 ? 'file' : 'files'})
                </span>
              )}
            </h2>
            <button
              onClick={fetchFiles}
              className="text-xs text-gray-400 hover:text-amber-600 transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 flex justify-center">
              <svg className="w-7 h-7 text-amber-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : files.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-400">No documents uploaded yet.</p>
              <p className="text-xs text-gray-300 mt-1">Upload a PDF above to get started.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
              {files.map((file) => (
                <div key={file.name} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
                  {/* PDF icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 rounded px-1.5 py-0.5 text-xs font-medium mr-2">
                        {getFileLabel(file.name)}
                      </span>
                      {formatBytes(file.size)} · Uploaded {formatDate(file.uploadedAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* View — opens PDF full-screen in a new tab */}
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </a>

                    {/* Download */}
                    <a
                      href={file.url}
                      download={file.name}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </a>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(file.name)}
                      disabled={deletingFile === file.name}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 text-gray-400 text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      {deletingFile === file.name ? (
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 py-6 text-center">
        <p className="text-xs text-gray-400">
          Vishnu Mandir Tampa · Admin Portal · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
