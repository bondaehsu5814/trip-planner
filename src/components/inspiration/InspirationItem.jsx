import { formatDateLabel } from '../../lib/dateUtils'

const CATEGORY_LABELS = { food: '吃喝', activity: '活動', place: '景點', shopping: '購物', other: '其他' }
const CATEGORY_COLORS = { food: '#e86c3a', activity: '#2e86c1', place: '#27ae60', shopping: '#8e44ad', other: '#534AB7' }

export default function InspirationItem({ item, onDelete, days, onAssign }) {
  const color = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other
  const showDayPicker = !!days // 只在靈感池（有 days）才顯示 dropdown

  return (
    <div className="mb-2 rounded-[10px] px-4 py-3" style={{ background: '#EEEDFE', border: '0.5px solid #c4c1f0' }}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 break-words">{item.content}</p>

          {item.url && (
            <a href={item.url} target="_blank" rel="noreferrer"
              className="mt-1 block truncate text-xs underline" style={{ color: '#534AB7' }}>
              {item.url}
            </a>
          )}

          {item.comment && (
            <p className="mt-1 text-xs text-gray-500 break-words">{item.comment}</p>
          )}

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="rounded-full px-2 py-0.5 text-xs text-white" style={{ background: color }}>
              {CATEGORY_LABELS[item.category] ?? item.category}
            </span>
            {item.added_by && <span className="text-xs text-gray-400">by {item.added_by}</span>}

            {/* 天天 dropdown（只在靈感池顯示） */}
            {showDayPicker && (
              <select
                value={item.trip_date ?? ''}
                onChange={e => onAssign(item.id, e.target.value || null)}
                className="ml-auto rounded-lg border border-purple-200 bg-white px-2 py-0.5 text-xs focus:outline-none"
                style={{ color: '#534AB7' }}
              >
                <option value="">未分配</option>
                {days.map((d, i) => (
                  <option key={d} value={d}>Day {i + 1} · {formatDateLabel(d)}</option>
                ))}
              </select>
            )}

            {/* 在 DayView 裡顯示「移回」按鈕 */}
            {!showDayPicker && onAssign && (
              <button onClick={() => onAssign(item.id, null)}
                className="ml-auto text-xs text-gray-400 hover:text-gray-600">
                移回靈感池
              </button>
            )}
          </div>
        </div>

        <button onClick={() => onDelete(item.id)}
          className="shrink-0 pt-0.5 text-gray-300 hover:text-red-400" aria-label="刪除">
          ✕
        </button>
      </div>
    </div>
  )
}
