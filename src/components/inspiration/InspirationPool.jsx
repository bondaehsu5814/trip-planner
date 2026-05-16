import { useState } from 'react'
import InspirationItem from './InspirationItem'
import ExportButton from './ExportButton'
import WhoBar from '../layout/WhoBar'
import ErrorMessage from '../common/ErrorMessage'

export const CATEGORIES = [
  { value: 'food', label: '吃喝' },
  { value: 'place', label: '景點' },
  { value: 'shopping', label: '購物' },
  { value: 'activity', label: '活動' },
  { value: 'other', label: '其他' },
]

// 新增表單（可複用於靈感池和 DayView）
export function InspirationForm({ onAdd, onCancel, compact = false }) {
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [comment, setComment] = useState('')
  const [category, setCategory] = useState('other')
  const [showWhoBar, setShowWhoBar] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) return
    setShowWhoBar(true)
  }

  function handleWhoSelect(who) {
    setShowWhoBar(false)
    onAdd(content.trim(), category, who, url.trim() || null, comment.trim() || null)
    setContent('')
    setUrl('')
    setComment('')
    setCategory('other')
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-4">
        {/* 分類 */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {CATEGORIES.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={
                category === c.value
                  ? { background: '#534AB7', color: '#fff', border: '0.5px solid #534AB7' }
                  : { background: '#EEEDFE', color: '#534AB7', border: '0.5px solid #c4c1f0' }
              }
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 名稱 */}
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="名稱（必填）"
          className="mb-2 w-full rounded-[10px] px-3 py-2 text-sm focus:outline-none"
          style={{ border: '0.5px solid #c4c1f0', background: '#EEEDFE' }}
        />

        {/* URL */}
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="連結（Google Maps、小紅書…）"
          className="mb-2 w-full rounded-[10px] px-3 py-2 text-sm focus:outline-none"
          style={{ border: '0.5px solid #c4c1f0', background: '#EEEDFE' }}
        />

        {/* Comment */}
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="備註（可選）"
          rows={compact ? 1 : 2}
          className="mb-2 w-full rounded-[10px] px-3 py-2 text-sm focus:outline-none resize-none"
          style={{ border: '0.5px solid #c4c1f0', background: '#EEEDFE' }}
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!content.trim()}
            className="flex-1 rounded-[10px] py-2 text-sm font-medium text-white disabled:opacity-40"
            style={{ background: '#534AB7' }}
          >
            新增
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="rounded-[10px] border border-gray-200 px-4 py-2 text-sm text-gray-500">
              取消
            </button>
          )}
        </div>
      </form>

      {showWhoBar && (
        <WhoBar onSelect={handleWhoSelect} onCancel={() => setShowWhoBar(false)} />
      )}
    </>
  )
}

// 通用靈感池（顯示沒有指定日期的靈感）
export default function InspirationPool({ items, onAdd, onDelete, onAssign, days = [], error, onClearError }) {
  const [open, setOpen] = useState(true)
  const poolItems = items.filter(i => !i.trip_date)

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1 font-serif text-lg font-bold"
          style={{ color: '#534AB7' }}
        >
          靈感池 {open ? '▲' : '▼'}
        </button>
        <ExportButton items={poolItems} />
      </div>

      {open && (
        <>
          <ErrorMessage message={error} onDismiss={onClearError} />
          <InspirationForm onAdd={(content, category, who, url, comment) => onAdd(content, category, who, null, url, comment)} />

          {poolItems.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">還沒有未分配的靈感</p>
          ) : (
            poolItems.map(item => (
              <InspirationItem key={item.id} item={item} onDelete={onDelete} days={days} onAssign={onAssign} />
            ))
          )}
        </>
      )}
    </section>
  )
}
