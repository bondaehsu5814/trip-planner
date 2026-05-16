// 顯示 Claude 解析結果，讓使用者確認後可複製或標記
export default function ParsePreview({ result, onConfirm, onDiscard }) {
  if (!result) return null

  const fields =
    result.type === 'flight'
      ? [
          { label: '航空公司', value: result.airline },
          { label: '航班號', value: result.flightNumber },
          { label: '日期', value: result.date },
          { label: '出發', value: `${result.departure?.airport} T${result.departure?.terminal} ${result.departure?.time}` },
          { label: '抵達', value: `${result.arrival?.airport} T${result.arrival?.terminal} ${result.arrival?.time}` },
          { label: 'Ben 座位', value: result.seatBen },
          { label: 'Kelly 座位', value: result.seatKelly },
          { label: '訂單號', value: result.bookingRef },
          { label: '行李', value: result.baggageAllowance },
        ]
      : [
          { label: '飯店名稱', value: result.name },
          { label: 'Check-in', value: result.checkIn },
          { label: 'Check-out', value: result.checkOut },
          { label: '房型', value: result.roomType },
          { label: '訂單號', value: result.bookingRef },
          { label: '取消截止', value: result.cancellationDeadline },
        ]

  return (
    <div className="mt-4 rounded-[10px] border border-gray-200 bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-gray-700">
        解析結果：{result.type === 'flight' ? '航班' : '飯店'}
      </p>
      <dl className="space-y-2">
        {fields.map((f) => (
          <div key={f.label} className="flex gap-3 text-sm">
            <dt className="w-20 shrink-0 text-gray-500">{f.label}</dt>
            <dd className={`flex-1 ${f.value === '待確認' ? 'text-amber-600' : 'text-gray-800'}`}>
              {f.value || '—'}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex gap-2">
        <button
          onClick={onConfirm}
          className="flex-1 rounded-[10px] bg-gray-900 py-2 text-sm font-medium text-white"
        >
          確認填入
        </button>
        <button
          onClick={onDiscard}
          className="rounded-[10px] border border-gray-200 px-4 py-2 text-sm text-gray-500"
        >
          捨棄
        </button>
      </div>
    </div>
  )
}
