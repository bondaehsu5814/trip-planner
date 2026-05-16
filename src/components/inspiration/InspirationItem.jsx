import { useState } from 'react'
import { formatDateLabel } from '../../lib/dateUtils'

const CATEGORY_LABELS = { food: '吃喝', activity: '活動', place: '景點', shopping: '購物', other: '其他' }
const CATEGORY_COLORS = { food: '#e86c3a', activity: '#2e86c1', place: '#27ae60', shopping: '#8e44ad', other: '#534AB7' }
const CURRENCIES = ['TWD', 'JPY', 'USD']

export default function InspirationItem({ item, onDelete, days, onAssign, showCosts, onUpdateItem, members, dragHandleProps }) {
  const [editingCost, setEditingCost] = useState(false)
  const [draftCost, setDraftCost] = useState(item.cost ?? '')
  const [draftCurrency, setDraftCurrency] = useState(item.currency ?? 'TWD')
  const [draftPaidBy, setDraftPaidBy] = useState(item.paid_by ?? '')

  const color = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other
  const showDayPicker = !!days

  function saveCost() {
    onUpdateItem?.(item.id, {
      cost: draftCost === '' ? null : Number(draftCost),
      currency: draftCurrency,
      paid_by: draftPaidBy || null,
    })
    setEditingCost(false)
  }

  return (
    <div className="mb-2 rounded-[10px] px-4 py-3" style={{ background: '#EEEDFE', border: '0.5px solid #c4c1f0' }}>
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        {dragHandleProps && (
          <div {...dragHandleProps} className="mt-0.5 cursor-grab text-gray-300 active:cursor-grabbing select-none">
            ⠿
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-medium text-gray-800">{item.content}</p>

          {item.url && (
            <a href={item.url} target="_blank" rel="noreferrer"
              className="mt-1 block truncate text-xs underline" style={{ color: '#534AB7' }}>
              {item.url}
            </a>
          )}

          {item.comment && (
            <p className="mt-1 break-words text-xs text-gray-500">{item.comment}</p>
          )}

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="rounded-full px-2 py-0.5 text-xs text-white" style={{ background: color }}>
              {CATEGORY_LABELS[item.category] ?? item.category}
            </span>
            {item.added_by && <span className="text-xs text-gray-400">by {item.added_by}</span>}

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

            {!showDayPicker && onAssign && (
              <button onClick={() => onAssign(item.id, null)}
                className="ml-auto text-xs text-gray-400 hover:text-gray-600">
                移回靈感池
              </button>
            )}
          </div>

          {/* 費用區塊 */}
          {showCosts && (
            <div className="mt-2 border-t border-purple-100 pt-2">
              {editingCost ? (
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={draftCurrency}
                    onChange={e => setDraftCurrency(e.target.value)}
                    className="rounded border border-purple-200 px-1 py-0.5 text-xs focus:outline-none"
                  >
                    {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input
                    type="number"
                    value={draftCost}
                    onChange={e => setDraftCost(e.target.value)}
                    placeholder="金額"
                    className="w-24 rounded border border-purple-200 px-2 py-0.5 text-xs focus:outline-none"
                  />
                  <select
                    value={draftPaidBy}
                    onChange={e => setDraftPaidBy(e.target.value)}
                    className="rounded border border-purple-200 px-1 py-0.5 text-xs focus:outline-none"
                  >
                    <option value="">付款人</option>
                    {(members ?? []).map(m => <option key={m}>{m}</option>)}
                  </select>
                  <button onClick={saveCost} className="text-xs font-medium" style={{ color: '#534AB7' }}>儲存</button>
                  <button onClick={() => setEditingCost(false)} className="text-xs text-gray-400">取消</button>
                </div>
              ) : (
                <button onClick={() => setEditingCost(true)} className="text-xs text-gray-400 hover:text-gray-600">
                  {item.cost ? `${item.currency} ${Number(item.cost).toLocaleString()} · ${item.paid_by || '未填付款人'}` : '＋ 填寫費用'}
                </button>
              )}
            </div>
          )}
        </div>

        <button onClick={() => onDelete(item.id)}
          className="shrink-0 pt-0.5 text-gray-300 hover:text-red-400" aria-label="刪除">
          ✕
        </button>
      </div>
    </div>
  )
}
