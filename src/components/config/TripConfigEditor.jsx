import { useState } from 'react'
import WhoBar from '../layout/WhoBar'

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="flex-1">
      <label className="mb-0.5 block text-xs text-gray-500">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none"
      />
    </div>
  )
}

// ── 航班表單 ──────────────────────────────────────────
function FlightForm({ value, onSave, onCancel }) {
  const [f, setF] = useState({
    key: value?.key || `flight-${Date.now()}`,
    label: '', airline: '', flightNumber: '', date: '',
    departure: { airport: '', terminal: '', time: '' },
    arrival: { airport: '', terminal: '', time: '' },
    seatBen: '', seatKelly: '', bookingRef: '', baggageAllowance: '',
    ...value,
  })

  const set = (k, v) => setF(p => ({ ...p, [k]: v }))
  const setNested = (parent, k, v) => setF(p => ({ ...p, [parent]: { ...p[parent], [k]: v } }))

  return (
    <div className="mt-3 space-y-2 rounded-[10px] border border-gray-100 bg-gray-50 p-3">
      <div className="flex gap-2">
        <Field label="標籤" value={f.label} onChange={v => set('label', v)} placeholder="去程" />
        <Field label="航班號" value={f.flightNumber} onChange={v => set('flightNumber', v)} placeholder="BR205" />
      </div>
      <div className="flex gap-2">
        <Field label="航空公司" value={f.airline} onChange={v => set('airline', v)} placeholder="EVA Air" />
        <Field label="日期" value={f.date} onChange={v => set('date', v)} type="date" />
      </div>
      <div className="flex gap-2">
        <Field label="出發機場" value={f.departure.airport} onChange={v => setNested('departure', 'airport', v)} placeholder="TPE" />
        <Field label="航廈" value={f.departure.terminal} onChange={v => setNested('departure', 'terminal', v)} placeholder="T2" />
        <Field label="起飛" value={f.departure.time} onChange={v => setNested('departure', 'time', v)} type="time" />
      </div>
      <div className="flex gap-2">
        <Field label="抵達機場" value={f.arrival.airport} onChange={v => setNested('arrival', 'airport', v)} placeholder="NRT" />
        <Field label="航廈" value={f.arrival.terminal} onChange={v => setNested('arrival', 'terminal', v)} placeholder="T3" />
        <Field label="落地" value={f.arrival.time} onChange={v => setNested('arrival', 'time', v)} type="time" />
      </div>
      <div className="flex gap-2">
        <Field label="Ben 座位" value={f.seatBen} onChange={v => set('seatBen', v)} placeholder="12A" />
        <Field label="Kelly 座位" value={f.seatKelly} onChange={v => set('seatKelly', v)} placeholder="12B" />
      </div>
      <div className="flex gap-2">
        <Field label="訂單號" value={f.bookingRef} onChange={v => set('bookingRef', v)} />
        <Field label="行李" value={f.baggageAllowance} onChange={v => set('baggageAllowance', v)} placeholder="23kg x2" />
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(f)} className="flex-1 rounded-[10px] bg-gray-900 py-2 text-sm font-medium text-white">儲存</button>
        <button onClick={onCancel} className="rounded-[10px] border border-gray-200 px-4 py-2 text-sm text-gray-500">取消</button>
      </div>
    </div>
  )
}

// ── 住宿表單 ──────────────────────────────────────────
function HotelForm({ value, onSave, onCancel }) {
  const [h, setH] = useState({
    key: value?.key || `hotel-${Date.now()}`,
    label: '', name: '', checkIn: '', checkOut: '', roomType: '', bookingRef: '', cancellationDeadline: '',
    ...value,
  })
  const set = (k, v) => setH(p => ({ ...p, [k]: v }))

  return (
    <div className="mt-3 space-y-2 rounded-[10px] border border-gray-100 bg-gray-50 p-3">
      <div className="flex gap-2">
        <Field label="標籤" value={h.label} onChange={v => set('label', v)} placeholder="東京飯店" />
        <Field label="飯店名稱" value={h.name} onChange={v => set('name', v)} />
      </div>
      <div className="flex gap-2">
        <Field label="Check-in" value={h.checkIn} onChange={v => set('checkIn', v)} type="date" />
        <Field label="Check-out" value={h.checkOut} onChange={v => set('checkOut', v)} type="date" />
      </div>
      <div className="flex gap-2">
        <Field label="房型" value={h.roomType} onChange={v => set('roomType', v)} />
        <Field label="訂單號" value={h.bookingRef} onChange={v => set('bookingRef', v)} />
      </div>
      <Field label="取消截止日" value={h.cancellationDeadline} onChange={v => set('cancellationDeadline', v)} type="date" />
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(h)} className="flex-1 rounded-[10px] bg-gray-900 py-2 text-sm font-medium text-white">儲存</button>
        <button onClick={onCancel} className="rounded-[10px] border border-gray-200 px-4 py-2 text-sm text-gray-500">取消</button>
      </div>
    </div>
  )
}

// ── 交通表單 ──────────────────────────────────────────
function TransportForm({ value, onSave, onCancel }) {
  const [t, setT] = useState({
    key: value?.key || `transport-${Date.now()}`,
    label: '', type: '', date: '', details: '',
    ...value,
  })
  const set = (k, v) => setT(p => ({ ...p, [k]: v }))

  return (
    <div className="mt-3 space-y-2 rounded-[10px] border border-gray-100 bg-gray-50 p-3">
      <div className="flex gap-2">
        <Field label="標籤" value={t.label} onChange={v => set('label', v)} placeholder="機場接送" />
        <Field label="類型" value={t.type} onChange={v => set('type', v)} placeholder="shuttle / taxi / train" />
      </div>
      <div className="flex gap-2">
        <Field label="日期" value={t.date} onChange={v => set('date', v)} type="date" />
        <Field label="細節" value={t.details} onChange={v => set('details', v)} />
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(t)} className="flex-1 rounded-[10px] bg-gray-900 py-2 text-sm font-medium text-white">儲存</button>
        <button onClick={onCancel} className="rounded-[10px] border border-gray-200 px-4 py-2 text-sm text-gray-500">取消</button>
      </div>
    </div>
  )
}

// ── 主元件 ────────────────────────────────────────────
export default function TripConfigEditor({ trip, config, onSaveConfig, onUpdateTrip }) {
  const [open, setOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null) // { type, key } | null
  const [addingType, setAddingType] = useState(null)   // 'flight' | 'hotel' | 'transport' | null
  const [showWhoBar, setShowWhoBar] = useState(false)
  const [pendingConfig, setPendingConfig] = useState(null)

  // 行程日期編輯
  const [editingDates, setEditingDates] = useState(false)
  const [draftName, setDraftName] = useState(trip?.name ?? '')
  const [draftStart, setDraftStart] = useState(trip?.start_date ?? '')
  const [draftEnd, setDraftEnd] = useState(trip?.end_date ?? '')

  function requestSave(newConfig) {
    setPendingConfig(newConfig)
    setShowWhoBar(true)
  }

  function handleWhoSelect(who) {
    setShowWhoBar(false)
    if (pendingConfig) {
      onSaveConfig(pendingConfig, who)
      setPendingConfig(null)
    }
    setEditingItem(null)
    setAddingType(null)
  }

  function saveItem(type, item) {
    const key = type === 'flights' ? 'flights' : type === 'hotels' ? 'hotels' : 'transports'
    const existing = config[key].find(i => i.key === item.key)
    const newList = existing
      ? config[key].map(i => i.key === item.key ? item : i)
      : [...config[key], item]
    requestSave({ ...config, [key]: newList })
  }

  function deleteItem(type, key) {
    const newList = config[type].filter(i => i.key !== key)
    requestSave({ ...config, [type]: newList })
  }

  function saveDates(who) {
    onUpdateTrip({ name: draftName, start_date: draftStart, end_date: draftEnd })
    setEditingDates(false)
  }

  const Section = ({ title, type, items, FormComponent }) => (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</span>
        <button onClick={() => setAddingType(type)} className="text-xs font-medium" style={{ color: '#534AB7' }}>＋ 新增</button>
      </div>

      {items.map(item => (
        <div key={item.key}>
          <div className="mb-1 flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2">
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-800">{item.label || item.name}</span>
              {item.date && <span className="ml-2 text-xs text-gray-400">{item.date}</span>}
              {item.checkIn && <span className="ml-2 text-xs text-gray-400">{item.checkIn} → {item.checkOut}</span>}
              {item.flightNumber && <span className="ml-2 text-xs text-gray-400">{item.flightNumber}</span>}
            </div>
            <div className="flex gap-3 text-xs">
              <button onClick={() => setEditingItem({ type, key: item.key })} className="text-gray-400 hover:text-gray-700">編輯</button>
              <button onClick={() => deleteItem(type, item.key)} className="text-red-300 hover:text-red-500">刪除</button>
            </div>
          </div>

          {editingItem?.type === type && editingItem?.key === item.key && (
            <FormComponent value={item} onSave={i => saveItem(type, i)} onCancel={() => setEditingItem(null)} />
          )}
        </div>
      ))}

      {addingType === type && (
        <FormComponent
          value={null}
          onSave={i => saveItem(type, i)}
          onCancel={() => setAddingType(null)}
        />
      )}

      {items.length === 0 && addingType !== type && (
        <p className="text-xs text-gray-400">（尚未新增）</p>
      )}
    </div>
  )

  return (
    <section className="mt-8 border-t border-gray-100 pt-6">
      <button
        onClick={() => setOpen(v => !v)}
        className="mb-4 flex items-center gap-1 text-sm font-semibold text-gray-600"
      >
        ⚙ 行程設定 {open ? '▲' : '▼'}
      </button>

      {open && (
        <>
          {/* 行程名稱與日期 */}
          <div className="mb-4 rounded-[10px] border border-gray-100 bg-white p-3">
            {editingDates ? (
              <div className="space-y-2">
                <Field label="行程名稱" value={draftName} onChange={setDraftName} />
                <div className="flex gap-2">
                  <Field label="開始日期" value={draftStart} onChange={setDraftStart} type="date" />
                  <Field label="結束日期" value={draftEnd} onChange={setDraftEnd} type="date" />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => saveDates()} className="flex-1 rounded-[10px] bg-gray-900 py-2 text-sm font-medium text-white">儲存</button>
                  <button onClick={() => setEditingDates(false)} className="rounded-[10px] border border-gray-200 px-4 py-2 text-sm text-gray-500">取消</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{trip?.name || '（未命名）'}</p>
                  <p className="text-xs text-gray-400">{trip?.start_date} — {trip?.end_date}</p>
                </div>
                <button onClick={() => { setEditingDates(true); setDraftName(trip?.name ?? ''); setDraftStart(trip?.start_date ?? ''); setDraftEnd(trip?.end_date ?? '') }} className="text-xs text-gray-400 hover:text-gray-700">編輯</button>
              </div>
            )}
          </div>

          <Section title="✈ 航班" type="flights" items={config.flights} FormComponent={FlightForm} />
          <Section title="🏨 住宿" type="hotels" items={config.hotels} FormComponent={HotelForm} />
          <Section title="🚌 交通" type="transports" items={config.transports} FormComponent={TransportForm} />
        </>
      )}

      {showWhoBar && (
        <WhoBar onSelect={handleWhoSelect} onCancel={() => { setShowWhoBar(false); setPendingConfig(null) }} />
      )}
    </section>
  )
}
