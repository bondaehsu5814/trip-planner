import { useState } from 'react'
import TabBar from '../components/layout/TabBar'
import ItineraryView from '../components/itinerary/ItineraryView'
import InspirationPool from '../components/inspiration/InspirationPool'
import EmailParser from '../components/email/EmailParser'
import BackupRestore from '../components/common/BackupRestore'
import TripConfigEditor from '../components/config/TripConfigEditor'
import ErrorMessage from '../components/common/ErrorMessage'
import ExpensePage from '../components/expenses/ExpensePage'
import { useBookings } from '../hooks/useBookings'
import { useInspiration } from '../hooks/useInspiration'
import { useTripDetails } from '../hooks/useTripDetails'
import { useTripConfig } from '../hooks/useTripConfig'
import { useRealtime } from '../hooks/useRealtime'
import { getDays } from '../lib/dateUtils'

export default function TripPage({ tripId }) {
  const [tab, setTab] = useState('itinerary')
  const [showCosts, setShowCosts] = useState(false)

  const { trip, updateTrip, error: tripError, setError: setTripError, fetchTrip } = useTripDetails(tripId)
  const { config, saveConfig, error: configError, setError: setConfigError, fetchConfig } = useTripConfig(tripId)
  const { getBooking, toggleStatus, updateNotes, error: bookingError, setError: setBookingError, fetchBookings } = useBookings(tripId)
  const { items, addItem, deleteItem, assignDay, updateItem, reorderItems, error: inspirationError, setError: setInspirationError, fetchItems } = useInspiration(tripId)

  useRealtime(tripId, {
    onBookingChange: fetchBookings,
    onInspirationChange: fetchItems,
    onConfigChange: fetchConfig,
  })

  const members = config?.members ?? []

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
        cost: null, currency: 'TWD', paid_by: '',
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
        cost: null, currency: 'TWD', paid_by: '',
      }
      saveConfig({ ...config, hotels: [...config.hotels, newHotel] }, 'Email Parser')
    }
  }

  return (
    <div className="mx-auto max-w-app px-4 py-6">
      <header className="mb-4">
        <h1 className="font-serif text-2xl font-bold text-gray-900">
          {trip?.name || 'Trip Planner'}
        </h1>
        {trip?.start_date && (
          <p className="mt-0.5 text-sm text-gray-500">
            {trip.start_date} — {trip.end_date}
          </p>
        )}
      </header>

      <TabBar active={tab} onChange={setTab} />

      <ErrorMessage message={tripError} onDismiss={() => setTripError(null)} />
      <ErrorMessage message={configError} onDismiss={() => setConfigError(null)} />
      <ErrorMessage message={bookingError} onDismiss={() => setBookingError(null)} />

      {tab === 'setup' && (
        <>
          <div className="mb-4 flex items-center justify-end gap-2">
            <span className="text-xs text-gray-500">顯示費用</span>
            <button
              onClick={() => setShowCosts(v => !v)}
              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
              style={{ background: showCosts ? '#534AB7' : '#d1d5db' }}
            >
              <span className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
                style={{ transform: showCosts ? 'translateX(18px)' : 'translateX(2px)' }} />
            </button>
          </div>
          <TripConfigEditor
            trip={trip}
            config={config}
            onSaveConfig={saveConfig}
            onUpdateTrip={updateTrip}
            showCosts={showCosts}
          />
          <EmailParser onParsed={handleParsed} />
          <BackupRestore
            tripId={tripId}
            onRestored={() => { fetchBookings(); fetchItems(); fetchConfig(); fetchTrip() }}
          />
        </>
      )}

      {tab === 'itinerary' && (
        <>
          {/* 費用開關 */}
          <div className="mb-4 flex items-center justify-end gap-2">
            <span className="text-xs text-gray-500">顯示費用</span>
            <button
              onClick={() => setShowCosts(v => !v)}
              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
              style={{ background: showCosts ? '#534AB7' : '#d1d5db' }}
            >
              <span
                className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
                style={{ transform: showCosts ? 'translateX(18px)' : 'translateX(2px)' }}
              />
            </button>
          </div>

          <ItineraryView
            trip={trip}
            config={config}
            getBooking={getBooking}
            inspirations={items}
            members={members}
            showCosts={showCosts}
            onToggleStatus={toggleStatus}
            onUpdateNotes={updateNotes}
            onAddInspiration={addItem}
            onDeleteInspiration={deleteItem}
            onAssignInspiration={assignDay}
            onUpdateInspiration={updateItem}
            onReorderInspirations={reorderItems}
          />

          <InspirationPool
            items={items}
            onAdd={addItem}
            onDelete={deleteItem}
            onAssign={assignDay}
            onUpdate={updateItem}
            days={getDays(trip?.start_date, trip?.end_date)}
            members={members}
            showCosts={showCosts}
            error={inspirationError}
            onClearError={() => setInspirationError(null)}
          />
        </>
      )}

      {tab === 'expenses' && (
        <ExpensePage
          trip={trip}
          config={config}
          items={items}
          members={members}
        />
      )}
    </div>
  )
}
