import { useState } from 'react'
import StatusBadge from '../common/StatusBadge'
import WhoBar from '../layout/WhoBar'

const STATUS_STYLES = {
  pending: { background: '#FAEEDA', borderColor: '#FAC775' },
  booked: { background: '#EAF3DE', borderColor: '#C0DD97' },
}

export default function FlightCard({ flight, booking, onToggleStatus, onUpdateNotes }) {
  const status = booking?.status ?? 'pending'
  const [showWhoBar, setShowWhoBar] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState(booking?.notes ?? '')
  const [whoBarAction, setWhoBarAction] = useState(null) // 'toggle' | 'notes'

  function handleToggleClick() {
    setWhoBarAction('toggle')
    setShowWhoBar(true)
  }

  function handleNotesClick() {
    setEditingNotes(true)
  }

  function handleNotesSave() {
    setWhoBarAction('notes')
    setShowWhoBar(true)
  }

  function handleWhoSelect(who) {
    setShowWhoBar(false)
    if (whoBarAction === 'toggle') {
      onToggleStatus('flight', flight.key, who, booking?.notes)
    } else if (whoBarAction === 'notes') {
      onUpdateNotes('flight', flight.key, notesValue, who)
      setEditingNotes(false)
    }
  }

  return (
    <>
      <div
        className="mb-3 overflow-hidden rounded-[10px] p-4"
        style={{ border: `0.5px solid ${STATUS_STYLES[status].borderColor}`, background: STATUS_STYLES[status].background }}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">{flight.label}</span>
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            <button
              onClick={handleToggleClick}
              className="rounded-full border border-current px-2.5 py-0.5 text-xs"
              style={{ color: status === 'booked' ? '#27500A' : '#633806' }}
            >
              {status === 'booked' ? '改為待訂' : '標為已訂'}
            </button>
          </div>
        </div>

        {/* 航班資訊 */}
        {flight.flightNumber && (
          <p className="mb-1 text-sm text-gray-700">
            <span className="font-medium">{flight.airline}</span> {flight.flightNumber}
            {flight.date && <span className="ml-2 text-gray-500">{flight.date}</span>}
          </p>
        )}
        {(flight.departure?.airport || flight.arrival?.airport) && (
          <div className="mb-1 flex items-center gap-2 text-sm text-gray-600">
            <span>{flight.departure?.airport}{flight.departure?.terminal && ` T${flight.departure.terminal}`}</span>
            {flight.departure?.time && <span className="text-gray-500">{flight.departure.time}</span>}
            <span>→</span>
            <span>{flight.arrival?.airport}{flight.arrival?.terminal && ` T${flight.arrival.terminal}`}</span>
            {flight.arrival?.time && <span className="text-gray-500">{flight.arrival.time}</span>}
          </div>
        )}
        {(flight.seatBen || flight.seatKelly) && (
          <p className="mb-1 text-xs text-gray-500">
            座位：Ben {flight.seatBen || '—'} ／ Kelly {flight.seatKelly || '—'}
          </p>
        )}
        {flight.bookingRef && (
          <p className="mb-1 text-xs text-gray-500">訂單號：{flight.bookingRef}</p>
        )}
        {flight.baggageAllowance && (
          <p className="mb-1 text-xs text-gray-500">行李：{flight.baggageAllowance}</p>
        )}

        {/* 備註 */}
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
              <button onClick={handleNotesSave} className="text-xs font-medium text-gray-700">儲存</button>
              <button onClick={() => { setEditingNotes(false); setNotesValue(booking?.notes ?? '') }} className="text-xs text-gray-400">取消</button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleNotesClick}
            className="mt-2 block text-left text-xs text-gray-500 hover:text-gray-700"
          >
            {booking?.notes ? booking.notes : '＋ 新增備註'}
          </button>
        )}

        {/* 更新者 */}
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
