import ItineraryView from '../components/itinerary/ItineraryView'
import InspirationPool from '../components/inspiration/InspirationPool'
import EmailParser from '../components/email/EmailParser'
import BackupRestore from '../components/common/BackupRestore'
import TripConfigEditor from '../components/config/TripConfigEditor'
import ErrorMessage from '../components/common/ErrorMessage'
import { useBookings } from '../hooks/useBookings'
import { useInspiration } from '../hooks/useInspiration'
import { useTripDetails } from '../hooks/useTripDetails'
import { useTripConfig } from '../hooks/useTripConfig'
import { useRealtime } from '../hooks/useRealtime'
import { getDays } from '../lib/dateUtils'

export default function TripPage({ tripId }) {
  const { trip, updateTrip, error: tripError, setError: setTripError, fetchTrip } = useTripDetails(tripId)
  const { config, saveConfig, error: configError, setError: setConfigError, fetchConfig } = useTripConfig(tripId)
  const { getBooking, toggleStatus, updateNotes, error: bookingError, setError: setBookingError, fetchBookings } = useBookings(tripId)
  const { items, addItem, deleteItem, assignDay, error: inspirationError, setError: setInspirationError, fetchItems } = useInspiration(tripId)

  useRealtime(tripId, {
    onBookingChange: fetchBookings,
    onInspirationChange: fetchItems,
    onConfigChange: fetchConfig,
  })

  // Email 解析完成 → 加入 config
  function handleParsed(result) {
    if (result.type === 'flight') {
      const newFlight = {
        key: `flight-${Date.now()}`,
        label: result.label || '新航班',
        airline: result.airline ?? '',
        flightNumber: result.flightNumber ?? '',
        date: result.date ?? '',
        departure: result.departure ?? { airport: '', terminal: '', time: '' },
        arrival: result.arrival ?? { airport: '', terminal: '', time: '' },
        seatBen: result.seatBen ?? '',
        seatKelly: result.seatKelly ?? '',
        bookingRef: result.bookingRef ?? '',
        baggageAllowance: result.baggageAllowance ?? '',
      }
      saveConfig({ ...config, flights: [...config.flights, newFlight] }, 'Email Parser')
    } else if (result.type === 'hotel') {
      const newHotel = {
        key: `hotel-${Date.now()}`,
        label: result.name || '新住宿',
        name: result.name ?? '',
        checkIn: result.checkIn ?? '',
        checkOut: result.checkOut ?? '',
        roomType: result.roomType ?? '',
        bookingRef: result.bookingRef ?? '',
        cancellationDeadline: result.cancellationDeadline ?? '',
      }
      saveConfig({ ...config, hotels: [...config.hotels, newHotel] }, 'Email Parser')
    }
  }

  return (
    <div className="mx-auto max-w-app px-4 py-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-900">
          {trip?.name || 'Trip Planner'}
        </h1>
        {trip?.start_date && (
          <p className="mt-0.5 text-sm text-gray-500">
            {trip.start_date} — {trip.end_date}
          </p>
        )}
      </header>

      {/* 錯誤訊息 */}
      <ErrorMessage message={tripError} onDismiss={() => setTripError(null)} />
      <ErrorMessage message={configError} onDismiss={() => setConfigError(null)} />
      <ErrorMessage message={bookingError} onDismiss={() => setBookingError(null)} />

      {/* 天天行程視圖 */}
      <ItineraryView
        trip={trip}
        config={config}
        getBooking={getBooking}
        inspirations={items}
        onToggleStatus={toggleStatus}
        onUpdateNotes={updateNotes}
        onAddInspiration={addItem}
        onDeleteInspiration={deleteItem}
        onAssignInspiration={assignDay}
      />

      {/* Email 解析 */}
      <EmailParser onParsed={handleParsed} />

      {/* 靈感池（未指定日期） */}
      <InspirationPool
        items={items}
        onAdd={addItem}
        onDelete={deleteItem}
        onAssign={assignDay}
        days={getDays(trip?.start_date, trip?.end_date)}
        error={inspirationError}
        onClearError={() => setInspirationError(null)}
      />

      {/* 行程設定（航班/住宿/交通編輯） */}
      <TripConfigEditor
        trip={trip}
        config={config}
        onSaveConfig={saveConfig}
        onUpdateTrip={updateTrip}
      />

      {/* 備份/還原 */}
      <BackupRestore
        tripId={tripId}
        onRestored={() => { fetchBookings(); fetchItems(); fetchConfig(); fetchTrip() }}
      />
    </div>
  )
}
