import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useBookings(tripId) {
  const [bookings, setBookings] = useState({})
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!tripId) return
    fetchBookings()
  }, [tripId])

  async function fetchBookings() {
    try {
      const { data, error: err } = await supabase
        .from('bookings')
        .select('*')
        .eq('trip_id', tripId)
      if (err) throw err
      // 轉成 { 'flight:outbound': {...}, 'hotel:hotel-1': {...} } 方便查找
      const map = {}
      data.forEach((b) => {
        map[`${b.item_type}:${b.item_key}`] = b
      })
      setBookings(map)
    } catch (err) {
      setError('無法載入訂單狀態，請重新整理頁面。')
    }
  }

  const toggleStatus = useCallback(
    async (itemType, itemKey, who, currentNotes) => {
      const mapKey = `${itemType}:${itemKey}`
      const current = bookings[mapKey]
      const newStatus = current?.status === 'booked' ? 'pending' : 'booked'

      // Optimistic update
      setBookings((prev) => ({
        ...prev,
        [mapKey]: { ...current, item_type: itemType, item_key: itemKey, status: newStatus, updated_by: who },
      }))
      setError(null)

      try {
        const { error: err } = await supabase.from('bookings').upsert(
          {
            trip_id: tripId,
            item_type: itemType,
            item_key: itemKey,
            status: newStatus,
            notes: currentNotes ?? current?.notes ?? null,
            updated_by: who,
          },
          { onConflict: 'trip_id,item_type,item_key' }
        )
        if (err) throw err
      } catch {
        // Rollback on failure
        setBookings((prev) => ({ ...prev, [mapKey]: current }))
        setError('更新失敗，請再試一次。')
      }
    },
    [bookings, tripId]
  )

  const updateNotes = useCallback(
    async (itemType, itemKey, notes, who) => {
      const mapKey = `${itemType}:${itemKey}`
      const current = bookings[mapKey]

      setBookings((prev) => ({
        ...prev,
        [mapKey]: { ...current, notes, updated_by: who },
      }))
      setError(null)

      try {
        const { error: err } = await supabase.from('bookings').upsert(
          {
            trip_id: tripId,
            item_type: itemType,
            item_key: itemKey,
            status: current?.status ?? 'pending',
            notes,
            updated_by: who,
          },
          { onConflict: 'trip_id,item_type,item_key' }
        )
        if (err) throw err
      } catch {
        setBookings((prev) => ({ ...prev, [mapKey]: current }))
        setError('備註儲存失敗，請再試一次。')
      }
    },
    [bookings, tripId]
  )

  function getBooking(itemType, itemKey) {
    return bookings[`${itemType}:${itemKey}`]
  }

  return { bookings, getBooking, toggleStatus, updateNotes, error, setError, fetchBookings }
}
