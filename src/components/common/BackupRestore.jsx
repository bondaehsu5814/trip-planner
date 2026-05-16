import { useRef, useState } from 'react'
import { exportTripJSON, downloadJSON, restoreTripFromJSON } from '../../lib/exportUtils'
import ErrorMessage from './ErrorMessage'

export default function BackupRestore({ tripId, onRestored }) {
  const fileRef = useRef(null)
  const [error, setError] = useState(null)
  const [restoring, setRestoring] = useState(false)

  async function handleExport() {
    try {
      const data = await exportTripJSON(tripId)
      const date = new Date().toISOString().slice(0, 10)
      downloadJSON(data, `trip-backup-${date}.json`)
    } catch {
      setError('備份失敗，請稍後再試。')
    }
  }

  async function handleRestore(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setRestoring(true)
    setError(null)
    try {
      const text = await file.text()
      const json = JSON.parse(text)
      await restoreTripFromJSON(json)
      onRestored?.()
    } catch (err) {
      setError('還原失敗：' + (err.message ?? '檔案格式不正確'))
    } finally {
      setRestoring(false)
      e.target.value = ''
    }
  }

  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">資料備份</p>
      <ErrorMessage message={error} onDismiss={() => setError(null)} />
      <div className="flex gap-3 mt-2">
        <button
          onClick={handleExport}
          className="rounded-[10px] border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          匯出 JSON
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={restoring}
          className="rounded-[10px] border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
        >
          {restoring ? '還原中…' : '匯入 JSON'}
        </button>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleRestore} />
      </div>
    </div>
  )
}
