export default function StatusBadge({ status }) {
  if (status === 'booked') {
    return (
      <span
        className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
        style={{ background: '#EAF3DE', color: '#27500A', border: '0.5px solid #C0DD97' }}
      >
        已訂
      </span>
    )
  }
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ background: '#FAEEDA', color: '#633806', border: '0.5px solid #FAC775' }}
    >
      待訂
    </span>
  )
}
