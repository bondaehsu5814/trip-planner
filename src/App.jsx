import { TRIP_ID } from './config/trips/sampleTrip'
import TripPage from './pages/TripPage'

export default function App() {
  return <TripPage tripId={TRIP_ID} />
}
