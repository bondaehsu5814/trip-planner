import { useState } from 'react'
import FlightCard from './FlightCard'
import HotelCard from './HotelCard'
import TransportCard from '../transport/TransportCard'
import InspirationItem from '../inspiration/InspirationItem'
import { InspirationForm } from '../inspiration/InspirationPool'
import { formatDateLabel } from '../../lib/dateUtils'

export default function DayView({
  date, dayNumber,
  flights, checkInHotels, checkOutHotels, stayingHotels, transports, inspirations,
  getBooking, onToggleStatus, onUpdateNotes,
  onAddInspiration, onDeleteInspiration, onAssignInspiration,
}) {
  const [addingInspiration, setAddingInspiration] = useState(false)
  const hasContent =
    flights.length + checkInHotels.length + checkOutHotels.length +
    transports.length + inspirations.length > 0

  return (
    <div className="mb-6">
      {/* 日期 header */}
      <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
        <span
          className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
          style={{ background: '#534AB7' }}
        >
          Day {dayNumber}
        </span>
        <span className="font-serif text-sm font-semibold text-gray-700">
          {formatDateLabel(date)}
        </span>
      </div>

      {/* 住宿 check-in */}
      {checkInHotels.map(h => (
        <div
          key={h.key + '-in'}
          className="mb-2 flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm"
          style={{ background: '#EAF3DE', border: '0.5px solid #C0DD97' }}
        >
          <span>🏨</span>
          <span className="font-medium text-booked-text">{h.label || h.name}</span>
          <span className="text-xs text-gray-500">check-in</span>
          <HotelCard hotel={h} booking={getBooking('hotel', h.key)} onToggleStatus={onToggleStatus} onUpdateNotes={onUpdateNotes} />
        </div>
      ))}

      {/* 航班 */}
      {flights.map(f => (
        <FlightCard key={f.key} flight={f} booking={getBooking('flight', f.key)} onToggleStatus={onToggleStatus} onUpdateNotes={onUpdateNotes} />
      ))}

      {/* 交通 */}
      {transports.map(t => (
        <TransportCard key={t.key} transport={t} booking={getBooking('transport', t.key)} onToggleStatus={onToggleStatus} onUpdateNotes={onUpdateNotes} />
      ))}

      {/* 住宿 check-out */}
      {checkOutHotels.map(h => (
        <div
          key={h.key + '-out'}
          className="mb-2 flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm"
          style={{ background: '#FAEEDA', border: '0.5px solid #FAC775' }}
        >
          <span>🏨</span>
          <span className="font-medium text-pending-text">{h.label || h.name}</span>
          <span className="text-xs text-gray-500">check-out</span>
        </div>
      ))}

      {/* 靈感 */}
      {inspirations.map(item => (
        <InspirationItem key={item.id} item={item} onDelete={onDeleteInspiration} onAssign={onAssignInspiration} />
      ))}

      {/* 空白提示 */}
      {!hasContent && !addingInspiration && (
        <p className="rounded-[10px] border border-dashed border-gray-200 px-4 py-3 text-xs text-gray-400">
          這天還沒有安排
        </p>
      )}

      {/* 新增靈感 */}
      {addingInspiration ? (
        <InspirationForm
          compact
          onAdd={(content, category, who, url, comment) => {
            onAddInspiration(content, category, who, url, comment)
            setAddingInspiration(false)
          }}
          onCancel={() => setAddingInspiration(false)}
        />
      ) : (
        <button
          onClick={() => setAddingInspiration(true)}
          className="mt-2 text-xs"
          style={{ color: '#534AB7' }}
        >
          ＋ 新增靈感到這天
        </button>
      )}
    </div>
  )
}
