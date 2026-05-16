import { supabase } from './supabaseClient'

export async function exportTripJSON(tripId) {
  const [tripsRes, configRes, bookingsRes, inspirationRes] = await Promise.all([
    supabase.from('trips').select('*').eq('id', tripId).single(),
    supabase.from('trip_configs').select('*').eq('trip_id', tripId).single(),
    supabase.from('bookings').select('*').eq('trip_id', tripId),
    supabase.from('inspiration_items').select('*').eq('trip_id', tripId),
  ])

  return {
    exportedAt: new Date().toISOString(),
    trip: tripsRes.data,
    config: configRes.data,
    bookings: bookingsRes.data,
    inspirationItems: inspirationRes.data,
  }
}

export function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function restoreTripFromJSON(json) {
  const { trip, config, bookings, inspirationItems } = json

  // Upsert trip
  const { data: tripData, error: tripErr } = await supabase
    .from('trips')
    .upsert(trip, { onConflict: 'id' })
    .select()
    .single()
  if (tripErr) throw new Error('還原行程失敗：' + tripErr.message)

  const tripId = tripData.id

  // Upsert config
  if (config) {
    const { error: configErr } = await supabase
      .from('trip_configs')
      .upsert({ ...config, trip_id: tripId }, { onConflict: 'id' })
    if (configErr) throw new Error('還原設定失敗：' + configErr.message)
  }

  // Delete + re-insert bookings
  await supabase.from('bookings').delete().eq('trip_id', tripId)
  if (bookings?.length) {
    const { error: bErr } = await supabase.from('bookings').insert(bookings.map((b) => ({ ...b, trip_id: tripId })))
    if (bErr) throw new Error('還原訂單失敗：' + bErr.message)
  }

  // Delete + re-insert inspiration items
  await supabase.from('inspiration_items').delete().eq('trip_id', tripId)
  if (inspirationItems?.length) {
    const { error: iErr } = await supabase.from('inspiration_items').insert(inspirationItems.map((i) => ({ ...i, trip_id: tripId })))
    if (iErr) throw new Error('還原靈感池失敗：' + iErr.message)
  }

  return tripId
}

export function exportInspirationText(items) {
  return items.map((i) => `[${i.category}] ${i.content}`).join('\n')
}
