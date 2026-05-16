const TABS = [
  { id: 'setup', label: '行程設定', icon: '⚙' },
  { id: 'itinerary', label: '行程表', icon: '🗓' },
  { id: 'expenses', label: '帳單', icon: '💰' },
]

export default function TabBar({ active, onChange }) {
  return (
    <div className="mb-6 flex rounded-[12px] p-1" style={{ background: '#EEEDFE' }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="flex-1 rounded-[10px] py-2 text-sm font-medium transition-colors"
          style={
            active === tab.id
              ? { background: '#534AB7', color: '#fff' }
              : { color: '#534AB7' }
          }
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  )
}
