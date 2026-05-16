import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useInspiration(tripId) {
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!tripId) return
    fetchItems()
  }, [tripId])

  async function fetchItems() {
    try {
      const { data, error: err } = await supabase
        .from('inspiration_items')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false })
      if (err) throw err
      setItems(data)
    } catch {
      setError('無法載入靈感池')
    }
  }

  // tripDate: string 'YYYY-MM-DD' or null (general pool)
  const addItem = useCallback(async (content, category, who, tripDate = null, url = null, comment = null) => {
    const optimistic = {
      id: `temp-${Date.now()}`,
      trip_id: tripId,
      content,
      category,
      added_by: who,
      trip_date: tripDate,
      url,
      comment,
      created_at: new Date().toISOString(),
    }
    setItems(prev => [optimistic, ...prev])
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('inspiration_items')
        .insert({ trip_id: tripId, content, category, added_by: who, trip_date: tripDate, url, comment })
        .select().single()
      if (err) throw err
      setItems(prev => prev.map(i => i.id === optimistic.id ? data : i))
    } catch {
      setItems(prev => prev.filter(i => i.id !== optimistic.id))
      setError('新增失敗，請再試一次')
    }
  }, [tripId])

  const deleteItem = useCallback(async (id) => {
    const backup = items.find(i => i.id === id)
    setItems(prev => prev.filter(i => i.id !== id))
    setError(null)
    try {
      const { error: err } = await supabase.from('inspiration_items').delete().eq('id', id)
      if (err) throw err
    } catch {
      setItems(prev => [backup, ...prev])
      setError('刪除失敗，請再試一次')
    }
  }, [items])

  const assignDay = useCallback(async (id, tripDate) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, trip_date: tripDate } : i))
    try {
      const { error: err } = await supabase
        .from('inspiration_items').update({ trip_date: tripDate || null }).eq('id', id)
      if (err) throw err
    } catch {
      setItems(prev => prev.map(i => i.id === id ? { ...i, trip_date: tripDate === null ? 'old' : null } : i))
      setError('指派失敗，請再試一次')
    }
  }, [])

  return { items, addItem, deleteItem, assignDay, error, setError, fetchItems }
}
