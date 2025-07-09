import { useState, useEffect } from 'react'
import { getInspections, saveInspection, type Inspection } from '../lib/supabase'

export function useInspections() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInspections()
  }, [])

  const loadInspections = async () => {
    try {
      setLoading(true)
      const data = await getInspections()
      setInspections(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inspections')
    } finally {
      setLoading(false)
    }
  }

  const addInspection = async (data: Omit<Inspection, 'id' | 'created_at'>) => {
    try {
      const newInspection = await saveInspection(data)
      setInspections(prev => [newInspection, ...prev])
      return newInspection
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save inspection')
      throw err
    }
  }

  return {
    inspections,
    loading,
    error,
    addInspection,
    refresh: loadInspections
  }
}