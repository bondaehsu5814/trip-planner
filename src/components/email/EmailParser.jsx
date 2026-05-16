import { useState } from 'react'
import { parseConfirmationEmail } from '../../lib/claudeParser'
import ParsePreview from './ParsePreview'
import ErrorMessage from '../common/ErrorMessage'

export default function EmailParser({ onParsed }) {
  const [emailText, setEmailText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)

  async function handleParse() {
    if (!emailText.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const parsed = await parseConfirmationEmail(emailText)
      setResult(parsed)
    } catch {
      setError('解析失敗，請確認 API key 正確，或稍後再試。')
    } finally {
      setLoading(false)
    }
  }

  function handleConfirm() {
    onParsed?.(result)
    setResult(null)
    setEmailText('')
    setOpen(false)
  }

  return (
    <section className="mt-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-gray-600 underline-offset-2 hover:underline"
      >
        {open ? '▲' : '▼'} 貼上確認信（自動解析）
      </button>

      {open && (
        <div className="mt-3">
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
          <textarea
            className="w-full rounded-[10px] border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none"
            rows={6}
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder="將訂位確認信的文字貼在這裡…"
          />
          <button
            onClick={handleParse}
            disabled={!emailText.trim() || loading}
            className="mt-2 rounded-[10px] bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {loading ? '解析中…' : '解析'}
          </button>

          {result && (
            <ParsePreview
              result={result}
              onConfirm={handleConfirm}
              onDiscard={() => setResult(null)}
            />
          )}
        </div>
      )}
    </section>
  )
}
