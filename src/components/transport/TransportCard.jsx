import { useState } from 'react'
import StatusBadge from '../common/StatusBadge'
import WhoBar from '../layout/WhoBar'

const STATUS_STYLES = {
  pending: { background: '#FAEEDA', borderColor: '#FAC775' },
  booked: { background: '#EAF3DE', borderColor: '#C0DD97' },
}

export default function TransportCard({ transport, booking, onToggleStatus, onUpdateNotes }) {
  const status = booking?.status ?? 'pending'
  const [showWhoBar, setShowWhoBar] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState(booking?.notes ?? '')
  const [whoBarAction, setWhoBarAction] = useState(null)

  function handleWhoSelect(who) {
    setShowWhoBar(false)
    if (whoBarAction === 'toggle') {
      onToggleStatus('transport', transport.key, who, booking?.notes)
    } else if (whoBarAction === 'notes') {
      onUpdateNotes('transport', transport.key, notesValue, who)
      setEditingNotes(false)
    }
  }

  return (
    <>
      <div
        className="mb-3 overflow-hidden rounded-[10px] p-4"
        style={{ border: `0.5px solid ${STATUS_STYLES[status].borderColor}`, background: STATUS_STYLES[status].background }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">{transport.label}</span>
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            <button
              onClick={() => { setWhoBarAction('toggle'); setShowWhoBar(true) }}
              className="rounded-full border border-current px-2.5 py-0.5 text-xs"
              style={{ color: status === 'booked' ? '#27500A' : '#633806' }}
            >
              {status === 'booked' ? '改為待訂' : '標為已訂'}
            </button>
          </div>
        </div>

        {transport.date && <p className="mb-1 text-sm text-gray-600">{transport.date}</p>}
        {transport.details && <p className="mb-1 text-sm text-gray-600">{transport.details}</p>}

        {editingNotes ? (
          <div className="mt-3">
            <textarea
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
              rows={2}
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              placeholder="備註…"
              autoFocus
            />
            <div className="mt-1 flex gap-2">
              <button onClick={() => { setWhoBarAction('notes'); setShowWhoBar(true) }} className="text-xs font-medium text-gray-700">儲存</button>
              <button onClick={() => { setEditingNotes(false); setNotesValue(booking?.notes ?? '') }} className="text-xs text-gray-400">取消</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditingNotes(true)}
            className="mt-2 block text-left text-xs text-gray-500 hover:text-gray-700"
          >
            {booking?.notes ? booking.notes : '＋ 新增備註'}
          </button>
        )}

        {booking?.updated_by && (
          <p className="mt-2 text-right text-xs text-gray-400">by {booking.updated_by}</p>
        )}
      </div>

      {showWhoBar && (
        <WhoBar onSelect={handleWhoSelect} onCancel={() => setShowWhoBar(false)} />
      )}
    </>
  )
}
