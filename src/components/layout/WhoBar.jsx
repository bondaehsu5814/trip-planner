export default function WhoBar({ onSelect, onCancel, members }) {
  const names = members?.length ? members : []

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
      <div
        className="w-full max-w-app rounded-t-2xl bg-white px-4 pb-8 pt-5"
        style={{ border: '0.5px solid #e5e7eb' }}
      >
        <p className="mb-4 text-center text-sm font-medium text-gray-700">這個操作由誰提交？</p>
        {names.length === 0 ? (
          <p className="text-center text-sm text-gray-400">請先在「行程設定」新增團員</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {names.map(name => (
              <button
                key={name}
                onClick={() => onSelect(name)}
                className="flex-1 rounded-[10px] bg-gray-900 py-3 text-sm font-medium text-white active:opacity-80"
              >
                {name}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={onCancel}
          className="mt-3 w-full rounded-[10px] py-3 text-sm text-gray-400 active:opacity-60"
        >
          取消
        </button>
      </div>
    </div>
  )
}
