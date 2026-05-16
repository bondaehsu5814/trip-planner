import { useState } from 'react'

export default function ExportButton({ items }) {
  const [copied, setCopied] = useState(false)

  function handleExport() {
    if (!items.length) return
    const text = items
      .map((i) => `[${i.category}] ${i.content}`)
      .join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleExport}
      disabled={!items.length}
      className="text-xs font-medium disabled:opacity-40"
      style={{ color: '#534AB7' }}
    >
      {copied ? '已複製！' : '複製全部給 Claude'}
    </button>
  )
}
