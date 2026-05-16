export default function Header({ tripName, tripDates }) {
  return (
    <header className="mb-6">
      <h1 className="font-serif text-2xl font-bold text-gray-900">{tripName || 'Trip Planner'}</h1>
      {tripDates && (
        <p className="mt-0.5 text-sm text-gray-500">{tripDates}</p>
      )}
    </header>
  )
}
