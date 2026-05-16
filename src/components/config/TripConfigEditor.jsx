import { useState } from 'react'
import WhoBar from '../layout/WhoBar'

const CURRENCIES = ['TWD', 'JPY', 'USD']

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

function CostFields({ cost, currency, paid_by, members, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex-1">
        <label className="mb-0.5 block text-xs text-gray-500">幣別</label>
        <select
          value={currency ?? 'TWD'}
          onChange={e => onChange('currency', e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none"
        >
          {CURRENCIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex-1">
        <label className="mb-0.5 block text-xs text-gray-500">金額</label>
        <input
          type="number"
          value={cost ?? ''}
          onChange={e => onChange('cost', e.target.value === '' ? null : Number(e.target.value))}
          placeholder="0"
          className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none"
        />
      </div>
      <div className="flex-1">
        <label className="mb-0.5 block text-xs text-gray-500">付款人</label>
        <select
          value={paid_by ?? ''}
          onChange={e => onChange('paid_by', e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none"
        >
          <option value="">未指定</option>
          {(members ?? []).map(m => <option key={m}>{m}</option>)}
        </select>
      </div>
    </div>
  )
}

// ── 團員管理 ──────────────────────────────────────────
function MembersEditor({ members, onSave }) {
  const [draft, setDraft] = useState(members ?? [])
  const [newName, setNewName] = useState('')

  function add() {
    const name = newName.trim()
    if (!name || draft.includes(name)) return
    setDraft(d => [...d, name])
    setNewName('')
  }

  return (
    <div className="mb-4 rounded-[10px] border border-gray-100 bg-white p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">👥 團員</p>
      <div className="mb-2 flex flex-wrap gap-2">
        {draft.map(name => (
          <span key={name} className="flex items-center gap-1 rounded-full px-3 py-1 text-sm text-white" style={{ background: '#534AB7' }}>
            {name}
            <button onClick={() => setDraft(d => d.filter(n => n !== name))} className="ml-1 opacity-70 hover:opacity-100">×</button>
          </span>
        ))}
        {draft.length === 0 && <p className="text-xs text-gray-400">尚未新增團員</p>}
      </div>
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="輸入名字"
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none"
        />
        <button onClick={add} className="rounded-lg px-3 py-1.5 text-sm font-medium text-white" style={{ background: '#534AB7' }}>新增</button>
        <button onClick={() => onSave(draft)} className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white">儲存</button>
      </div>
    </div>
  )
}

// ── 航班表單 ──────────────────────────────────────────
function FlightForm({ value, onSave, onCancel, showCosts, members }) {
  const [f, setF] = useState({
    key: value?.key || `flight-${Date.now()}`,
    label: '', airline: '', flightNumber: '', date: '',
    departure: { airport: '', terminal: '', time: '' },
    arrival: { airport: '', terminal: '', time: '' },
    seatBen: '', seatKelly: '', bookingRef: '', baggageAllowance: '',
    cost: null, currency: 'TWD', paid_by: '',
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
        <Field label="訂單號" value={f.bookingRef} onChange={v => set('bookingRef', v)} />
        <Field label="行李" value={f.baggageAllowance} onChange={v => set('baggageAllowance', v)} placeholder="23kg x2" />
      </div>
      {showCosts && (
        <CostFields cost={f.cost} currency={f.currency} paid_by={f.paid_by} members={members} onChange={(k, v) => set(k, v)} />
      )}
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(f)} className="flex-1 rounded-[10px] bg-gray-900 py-2 text-sm font-medium text-white">儲存</button>
        <button onClick={onCancel} className="rounded-[10px] border border-gray-200 px-4 py-2 text-sm text-gray-500">取消</button>
      </div>
    </div>
  )
}

// ── 住宿表單 ──────────────────────────────────────────
function HotelForm({ value, onSave, onCancel, showCosts, members }) {
  const [h, setH] = useState({
    key: value?.key || `hotel-${Date.now()}`,
    label: '', name: '', checkIn: '', checkOut: '', roomType: '', bookingRef: '', cancellationDeadline: '',
    cost: null, currency: 'TWD', paid_by: '',
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
      {showCosts && (
        <CostFields cost={h.cost} currency={h.currency} paid_by={h.paid_by} members={members} onChange={(k, v) => set(k, v)} />
      )}
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(h)} className="flex-1 rounded-[10px] bg-gray-900 py-2 text-sm font-medium text-white">儲存</button>
        <button onClick={onCancel} className="rounded-[10px] border border-gray-200 px-4 py-2 text-sm text-gray-500">取消</button>
      </div>
    </div>
  )
}

// ── 交通表單 ──────────────────────────────────────────
function TransportForm({ value, onSave, onCancel, showCosts, members }) {
  const [t, setT] = useState({
    key: value?.key || `transport-${Date.now()}`,
    label: '', type: '', date: '', details: '',
    cost: null, currency: 'TWD', paid_by: '',
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
      {showCosts && (
        <CostFields cost={t.cost} currency={t.currency} paid_by={t.paid_by} members={members} onChange={(k, v) => set(k, v)} />
      )}
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(t)} className="flex-1 rounded-[10px] bg-gray-900 py-2 text-sm font-medium text-white">儲存</button>
        <button onClick={onCancel} className="rounded-[10px] border border-gray-200 px-4 py-2 text-sm text-gray-500">取消</button>
      </div>
    </div>
  )
}

// ── 主元件 ────────────────────────────────────────────
export default function TripConfigEditor({ trip, config, onSaveConfig, onUpdateTrip, showCosts }) {
  const [editingItem, setEditingItem] = useState(null)
  const [addingType, setAddingType] = useState(null)
  const [showWhoBar, setShowWhoBar] = useState(false)
  const [pendingConfig, setPendingConfig] = useState(null)
  const [editingDates, setEditingDates] = useState(false)
  const [draftName, setDraftName] = useState(trip?.name ?? '')
  const [draftStart, setDraftStart] = useState(trip?.start_date ?? '')
  const [draftEnd, setDraftEnd] = useState(trip?.end_date ?? '')

  const members = config?.members ?? []

  function requestSave(newConfig) {
    if (members.length === 0) {
      onSaveConfig(newConfig, '未知')
      setEditingItem(null)
      setAddingType(null)
      return
    }
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

  // Members save directly — no WhoBar needed
  function saveMembers(names) {
    onSaveConfig({ ...config, members: names }, 'system')
  }

  function saveItem(type, item) {
    const existing = config[type].find(i => i.key === item.key)
    const newList = existing
      ? config[type].map(i => i.key === item.key ? item : i)
      : [...config[type], item]
    requestSave({ ...config, [type]: newList })
  }

  function deleteItem(type, key) {
    requestSave({ ...config, [type]: config[type].filter(i => i.key !== key) })
  }

  function saveDates() {
    onUpdateTrip({ name: draftName, start_date: draftStart || null, end_date: draftEnd || null })
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
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium text-gray-800">{item.label || item.name}</span>
              {item.date && <span className="ml-2 text-xs text-gray-400">{item.date}</span>}
              {item.checkIn && <span className="ml-2 text-xs text-gray-400">{item.checkIn} → {item.checkOut}</span>}
              {item.flightNumber && <span className="ml-2 text-xs text-gray-400">{item.flightNumber}</span>}
              {showCosts && item.cost && <span className="ml-2 text-xs text-gray-400">{item.currency} {Number(item.cost).toLocaleString()}</span>}
            </div>
            <div className="flex gap-3 text-xs">
              <button onClick={() => setEditingItem({ type, key: item.key })} className="text-gray-400 hover:text-gray-700">編輯</button>
              <button onClick={() => deleteItem(type, item.key)} className="text-red-300 hover:text-red-500">刪除</button>
            </div>
          </div>
          {editingItem?.type === type && editingItem?.key === item.key && (
            <FormComponent value={item} onSave={i => saveItem(type, i)} onCancel={() => setEditingItem(null)} showCosts={showCosts} members={members} />
          )}
        </div>
      ))}
      {addingType === type && (
        <FormComponent value={null} onSave={i => saveItem(type, i)} onCancel={() => setAddingType(null)} showCosts={showCosts} members={members} />
      )}
      {items.length === 0 && addingType !== type && (
        <p className="text-xs text-gray-400">（尚未新增）</p>
      )}
    </div>
  )

  return (
    <section>
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
              <button onClick={saveDates} className="flex-1 rounded-[10px] bg-gray-900 py-2 text-sm font-medium text-white">儲存</button>
              <button onClick={() => setEditingDates(false)} className="rounded-[10px] border border-gray-200 px-4 py-2 text-sm text-gray-500">取消</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">{trip?.name || '（未命名）'}</p>
              <p className="text-xs text-gray-400">{trip?.start_date} — {trip?.end_date}</p>
            </div>
            <button
              onClick={() => { setEditingDates(true); setDraftName(trip?.name ?? ''); setDraftStart(trip?.start_date ?? ''); setDraftEnd(trip?.end_date ?? '') }}
              className="text-xs text-gray-400 hover:text-gray-700"
            >
              編輯
            </button>
          </div>
        )}
      </div>

      <MembersEditor members={members} onSave={saveMembers} />

      <Section title="✈ 航班" type="flights" items={config.flights} FormComponent={FlightForm} />
      <Section title="🏨 住宿" type="hotels" items={config.hotels} FormComponent={HotelForm} />
      <Section title="🚌 交通" type="transports" items={config.transports} FormComponent={TransportForm} />

      {showWhoBar && (
        <WhoBar members={members} onSelect={handleWhoSelect} onCancel={() => { setShowWhoBar(false); setPendingConfig(null) }} />
      )}
    </section>
  )
}
