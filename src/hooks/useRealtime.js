import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useRealtime(tripId, { onBookingChange, onInspirationChange, onConfigChange } = {}) {
  useEffect(() => {
    if (!tripId) return

    const channel = supabase
      .channel(`trip-${tripId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'bookings', filter: `trip_id=eq.${tripId}` },
        () => onBookingChange?.())
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'inspiration_items', filter: `trip_id=eq.${tripId}` },
        () => onInspirationChange?.())
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'trip_configs', filter: `trip_id=eq.${tripId}` },
        () => onConfigChange?.())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [tripId])
}
