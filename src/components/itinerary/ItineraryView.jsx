import DayView from './DayView'
import { getDays } from '../../lib/dateUtils'

export default function ItineraryView({
  trip, config, getBooking, inspirations, members, showCosts,
  onToggleStatus, onUpdateNotes, onAddInspiration, onDeleteInspiration,
  onAssignInspiration, onUpdateInspiration, onReorderInspirations,
}) {
  if (!trip?.start_date || !trip?.end_date) {
    return (
      <p className="rounded-[10px] border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
        請先在「行程設定」填入開始和結束日期
      </p>
    )
  }

  const days = getDays(trip.start_date, trip.end_date)

  return (
    <div>
      {days.map((date, i) => {
        const flights = config.flights.filter(f => f.date === date)
        const checkInHotels = config.hotels.filter(h => h.checkIn === date)
        const checkOutHotels = config.hotels.filter(h => h.checkOut === date)
        const transports = config.transports.filter(t => t.date === date)
        const dayInspirations = inspirations
          .filter(item => item.trip_date === date)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

        return (
          <DayView
            key={date}
            date={date}
            dayNumber={i + 1}
            flights={flights}
            checkInHotels={checkInHotels}
            checkOutHotels={checkOutHotels}
            transports={transports}
            inspirations={dayInspirations}
            getBooking={getBooking}
            onToggleStatus={onToggleStatus}
            onUpdateNotes={onUpdateNotes}
            onAddInspiration={(content, category, who, url, comment) =>
              onAddInspiration(content, category, who, date, url, comment)
            }
            onDeleteInspiration={onDeleteInspiration}
            onAssignInspiration={onAssignInspiration}
            onUpdateInspiration={onUpdateInspiration}
            onReorderInspirations={onReorderInspirations}
            showCosts={showCosts}
            members={members}
          />
        )
      })}
    </div>
  )
}
