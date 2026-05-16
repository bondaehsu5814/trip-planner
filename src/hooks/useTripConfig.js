import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const EMPTY = { flights: [], hotels: [], transports: [], members: [] }

export function useTripConfig(tripId) {
  const [config, setConfig] = useState(EMPTY)
  const [configId, setConfigId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!tripId) return
    fetchConfig()
  }, [tripId])

  async function fetchConfig() {
    try {
      const { data, error: err } = await supabase
        .from('trip_configs').select('*').eq('trip_id', tripId).maybeSingle()
      if (err) throw err
      if (data) {
        setConfigId(data.id)
        setConfig({
          ...data.config,
          flights: data.config?.flights ?? [],
          hotels: data.config?.hotels ?? [],
          transports: data.config?.transports ?? [],
          members: data.config?.members ?? [],
        })
      }
    } catch {
      setError('無法載入行程設定')
    }
  }

  const saveConfig = useCallback(async (newConfig, who) => {
    const prev = config
    setConfig(newConfig)
    setError(null)
    try {
      if (configId) {
        const { error: err } = await supabase
          .from('trip_configs')
          .update({ config: newConfig, updated_by: who })
          .eq('id', configId)
        if (err) throw err
      } else {
        const { data, error: err } = await supabase
          .from('trip_configs')
          .insert({ trip_id: tripId, config: newConfig, updated_by: who })
          .select().single()
        if (err) throw err
        setConfigId(data.id)
      }
    } catch {
      setConfig(prev)
      setError('設定儲存失敗，請再試一次')
    }
  }, [config, configId, tripId])

  return { config, saveConfig, error, setError, fetchConfig }
}
