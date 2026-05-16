const CATEGORY_META = {
  flight:    { label: '✈ 航班',   color: '#534AB7' },
  hotel:     { label: '🏨 住宿',   color: '#2e86c1' },
  transport: { label: '🚌 交通',   color: '#16a085' },
  food:      { label: '🍜 吃喝',   color: '#e86c3a' },
  place:     { label: '📍 景點',   color: '#27ae60' },
  shopping:  { label: '🛍 購物',   color: '#8e44ad' },
  activity:  { label: '🎯 活動',   color: '#f39c12' },
  other:     { label: '📌 其他',   color: '#95a5a6' },
}

const CURRENCIES = ['TWD', 'JPY', 'USD']

function collectExpenses(config, items) {
  const list = []
  config?.flights?.forEach(f => {
    if (f.cost) list.push({ key: f.key, label: f.label || f.flightNumber || '航班', category: 'flight', cost: Number(f.cost), currency: f.currency || 'TWD', paid_by: f.paid_by || '' })
  })
  config?.hotels?.forEach(h => {
    if (h.cost) list.push({ key: h.key, label: h.label || h.name || '住宿', category: 'hotel', cost: Number(h.cost), currency: h.currency || 'TWD', paid_by: h.paid_by || '' })
  })
  config?.transports?.forEach(t => {
    if (t.cost) list.push({ key: t.key, label: t.label || '交通', category: 'transport', cost: Number(t.cost), currency: t.currency || 'TWD', paid_by: t.paid_by || '' })
  })
  items?.forEach(i => {
    if (i.cost) list.push({ key: i.id, label: i.content, category: i.category || 'other', cost: Number(i.cost), currency: i.currency || 'TWD', paid_by: i.paid_by || '' })
  })
  return list
}

// Simple settlement: find who owes who
function calcSettlement(members, paidMap, fairShare, currency) {
  const balances = members.map(m => ({ name: m, balance: (paidMap[m] || 0) - fairShare }))
  const creditors = balances.filter(b => b.balance > 0.5).sort((a, b) => b.balance - a.balance)
  const debtors   = balances.filter(b => b.balance < -0.5).sort((a, b) => a.balance - b.balance)
  const txns = []
  let ci = 0, di = 0
  const c = creditors.map(x => ({ ...x }))
  const d = debtors.map(x => ({ ...x }))
  while (ci < c.length && di < d.length) {
    const amount = Math.min(c[ci].balance, -d[di].balance)
    txns.push({ from: d[di].name, to: c[ci].name, amount: Math.round(amount), currency })
    c[ci].balance -= amount
    d[di].balance += amount
    if (Math.abs(c[ci].balance) < 0.5) ci++
    if (Math.abs(d[di].balance) < 0.5) di++
  }
  return txns
}

function HorizontalBar({ label, amount, currency, maxAmount, color }) {
  const pct = maxAmount > 0 ? (amount / maxAmount) * 100 : 0
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <span className="text-xs font-semibold text-gray-700">{currency} {amount.toLocaleString()}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

function CurrencySection({ currency, expenses, members }) {
  const filtered = expenses.filter(e => e.currency === currency)
  if (!filtered.length) return null

  const grandTotal = filtered.reduce((s, e) => s + e.cost, 0)
  const allPayers = members?.length ? members : [...new Set(filtered.map(e => e.paid_by).filter(Boolean))]
  const fairShare = allPayers.length > 0 ? grandTotal / allPayers.length : 0

  // Per category totals
  const byCat = {}
  filtered.forEach(e => {
    byCat[e.category] = (byCat[e.category] || 0) + e.cost
  })
  const catEntries = Object.entries(byCat).sort((a, b) => b[1] - a[1])
  const maxCat = catEntries[0]?.[1] || 1

  // Per member totals
  const paidMap = {}
  filtered.forEach(e => {
    if (e.paid_by) paidMap[e.paid_by] = (paidMap[e.paid_by] || 0) + e.cost
  })

  const settlement = allPayers.length > 1 ? calcSettlement(allPayers, paidMap, fairShare, currency) : []

  // By category detail
  const byCatItems = {}
  filtered.forEach(e => {
    if (!byCatItems[e.category]) byCatItems[e.category] = []
    byCatItems[e.category].push(e)
  })

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-serif text-lg font-bold text-gray-800">{currency}</h3>
        <span className="text-sm text-gray-500">合計 <span className="font-semibold text-gray-800">{grandTotal.toLocaleString()}</span></span>
      </div>

      {/* Bar chart */}
      <div className="mb-6 rounded-[12px] bg-white p-4" style={{ border: '0.5px solid #e5e7eb' }}>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">類別分佈</p>
        {catEntries.map(([cat, amt]) => (
          <HorizontalBar
            key={cat}
            label={CATEGORY_META[cat]?.label || cat}
            amount={amt}
            currency={currency}
            maxAmount={maxCat}
            color={CATEGORY_META[cat]?.color || '#534AB7'}
          />
        ))}
      </div>

      {/* Member summary */}
      {allPayers.length > 0 && (
        <div className="mb-4 rounded-[12px] p-4" style={{ background: '#EEEDFE', border: '0.5px solid #c4c1f0' }}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#534AB7' }}>成員支出</p>
          <div className="space-y-2">
            {allPayers.map(m => {
              const paid = paidMap[m] || 0
              const diff = paid - fairShare
              return (
                <div key={m} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{m}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{currency} {paid.toLocaleString()}</span>
                    {allPayers.length > 1 && (
                      <span
                        className="min-w-[60px] rounded-full px-2 py-0.5 text-center text-xs font-semibold"
                        style={diff >= 0
                          ? { background: '#EAF3DE', color: '#27500A' }
                          : { background: '#FAEEDA', color: '#633806' }}
                      >
                        {diff >= 0 ? `+${Math.round(diff).toLocaleString()}` : Math.round(diff).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {allPayers.length > 1 && (
            <p className="mt-2 text-right text-xs text-gray-400">每人均攤 {currency} {Math.round(fairShare).toLocaleString()}</p>
          )}
        </div>
      )}

      {/* Settlement */}
      {settlement.length > 0 && (
        <div className="mb-4 rounded-[12px] border border-dashed border-gray-200 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">結算建議</p>
          {settlement.map((t, i) => (
            <p key={i} className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">{t.from}</span>
              {' 付給 '}
              <span className="font-medium text-gray-800">{t.to}</span>
              {' '}
              <span className="font-semibold" style={{ color: '#534AB7' }}>{t.currency} {t.amount.toLocaleString()}</span>
            </p>
          ))}
        </div>
      )}

      {/* Detail list */}
      <div className="space-y-4">
        {catEntries.map(([cat]) => (
          <div key={cat}>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: CATEGORY_META[cat]?.color }} />
              {CATEGORY_META[cat]?.label || cat}
            </p>
            {byCatItems[cat].map(e => (
              <div key={e.key} className="mb-1 flex items-center justify-between rounded-lg bg-white px-3 py-2" style={{ border: '0.5px solid #e5e7eb' }}>
                <span className="flex-1 truncate text-sm text-gray-700">{e.label}</span>
                <span className="ml-3 text-sm font-medium text-gray-800">{currency} {e.cost.toLocaleString()}</span>
                {e.paid_by && <span className="ml-2 text-xs text-gray-400">by {e.paid_by}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ExpensePage({ trip, config, items, members }) {
  const expenses = collectExpenses(config, items)

  if (expenses.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-2xl mb-2">💰</p>
        <p className="text-sm font-medium text-gray-500">還沒有費用紀錄</p>
        <p className="mt-1 text-xs text-gray-400">在行程表開啟「顯示費用」後，點各項目填入金額</p>
      </div>
    )
  }

  return (
    <div>
      {CURRENCIES.map(c => (
        <CurrencySection key={c} currency={c} expenses={expenses} members={members} />
      ))}
    </div>
  )
}
