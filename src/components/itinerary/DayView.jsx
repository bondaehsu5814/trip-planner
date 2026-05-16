import { useState } from 'react'
import {
  DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import FlightCard from './FlightCard'
import HotelCard from './HotelCard'
import TransportCard from '../transport/TransportCard'
import InspirationItem from '../inspiration/InspirationItem'
import { InspirationForm } from '../inspiration/InspirationPool'
import { formatDateLabel } from '../../lib/dateUtils'

function SortableInspirationItem({ item, onDelete, onAssign, showCosts, onUpdateItem, members }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
    >
      <InspirationItem
        item={item}
        onDelete={onDelete}
        onAssign={onAssign}
        showCosts={showCosts}
        onUpdateItem={onUpdateItem}
        members={members}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

export default function DayView({
  date, dayNumber,
  flights, checkInHotels, checkOutHotels, transports, inspirations,
  getBooking, onToggleStatus, onUpdateNotes,
  onAddInspiration, onDeleteInspiration, onAssignInspiration,
  onUpdateInspiration, onReorderInspirations,
  showCosts, members,
}) {
  const [addingInspiration, setAddingInspiration] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = inspirations.findIndex(i => i.id === active.id)
    const newIndex = inspirations.findIndex(i => i.id === over.id)
    const reordered = arrayMove(inspirations, oldIndex, newIndex).map((item, idx) => ({ ...item, sort_order: idx }))
    onReorderInspirations(reordered)
  }

  const hasContent =
    flights.length + checkInHotels.length + checkOutHotels.length +
    transports.length + inspirations.length > 0

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
        <span className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: '#534AB7' }}>
          Day {dayNumber}
        </span>
        <span className="font-serif text-sm font-semibold text-gray-700">{formatDateLabel(date)}</span>
      </div>

      {checkInHotels.map(h => (
        <div key={h.key + '-in'} className="mb-2 flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm"
          style={{ background: '#EAF3DE', border: '0.5px solid #C0DD97' }}>
          <span>🏨</span>
          <span className="font-medium text-booked-text">{h.label || h.name}</span>
          <span className="text-xs text-gray-500">check-in</span>
          <HotelCard hotel={h} booking={getBooking('hotel', h.key)} onToggleStatus={onToggleStatus} onUpdateNotes={onUpdateNotes} members={members} />
          {showCosts && h.cost && (
            <span className="ml-auto text-xs text-gray-500">{h.currency} {Number(h.cost).toLocaleString()}</span>
          )}
        </div>
      ))}

      {flights.map(f => (
        <div key={f.key}>
          <FlightCard flight={f} booking={getBooking('flight', f.key)} onToggleStatus={onToggleStatus} onUpdateNotes={onUpdateNotes} members={members} />
          {showCosts && f.cost && (
            <p className="mb-1 text-right text-xs text-gray-400">{f.currency} {Number(f.cost).toLocaleString()}</p>
          )}
        </div>
      ))}

      {transports.map(t => (
        <div key={t.key}>
          <TransportCard transport={t} booking={getBooking('transport', t.key)} onToggleStatus={onToggleStatus} onUpdateNotes={onUpdateNotes} members={members} />
          {showCosts && t.cost && (
            <p className="mb-1 text-right text-xs text-gray-400">{t.currency} {Number(t.cost).toLocaleString()}</p>
          )}
        </div>
      ))}

      {checkOutHotels.map(h => (
        <div key={h.key + '-out'} className="mb-2 flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm"
          style={{ background: '#FAEEDA', border: '0.5px solid #FAC775' }}>
          <span>🏨</span>
          <span className="font-medium text-pending-text">{h.label || h.name}</span>
          <span className="text-xs text-gray-500">check-out</span>
          {showCosts && h.cost && (
            <span className="ml-auto text-xs text-gray-500">{h.currency} {Number(h.cost).toLocaleString()}</span>
          )}
        </div>
      ))}

      {/* 靈感：可拖曳排序 */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={inspirations.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {inspirations.map(item => (
            <SortableInspirationItem
              key={item.id}
              item={item}
              onDelete={(id) => onAssignInspiration(id, null)}
              onAssign={onAssignInspiration}
              showCosts={showCosts}
              onUpdateItem={onUpdateInspiration}
              members={members}
            />
          ))}
        </SortableContext>
      </DndContext>

      {!hasContent && !addingInspiration && (
        <p className="rounded-[10px] border border-dashed border-gray-200 px-4 py-3 text-xs text-gray-400">
          這天還沒有安排
        </p>
      )}

      {addingInspiration ? (
        <InspirationForm
          compact
          onAdd={(content, category, who, url, comment) => {
            onAddInspiration(content, category, who, url, comment)
            setAddingInspiration(false)
          }}
          onCancel={() => setAddingInspiration(false)}
          members={members}
        />
      ) : (
        <button onClick={() => setAddingInspiration(true)} className="mt-2 text-xs" style={{ color: '#534AB7' }}>
          ＋ 新增靈感到這天
        </button>
      )}
    </div>
  )
}
