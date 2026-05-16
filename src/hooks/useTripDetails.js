import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useTripDetails(tripId) {
  const [trip, setTrip] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!tripId) return
    fetchTrip()
  }, [tripId])

  async function fetchTrip() {
    try {
      const { data, error: err } = await supabase
        .from('trips').select('*').eq('id', tripId).single()
      if (err) throw err
      setTrip(data)
    } catch {
      setError('無法載入行程資料')
    }
  }

  async function updateTrip(updates) {
    const prev = trip
    setTrip(t => ({ ...t, ...updates }))
    try {
      const { error: err } = await supabase
        .from('trips').update(updates).eq('id', tripId)
      if (err) throw err
    } catch {
      setTrip(prev)
      setError('行程更新失敗')
    }
  }

  return { trip, updateTrip, error, setError, fetchTrip }
}
