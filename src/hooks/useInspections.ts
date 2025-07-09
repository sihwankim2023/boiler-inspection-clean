import { useState, useEffect } from 'react'

export function useInspections() {
  const [inspections, setInspections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInspections()
  }, [])

  const loadInspections = () => {
    try {
      setLoading(true)
      const data = localStorage.getItem('inspections')
      const parsedData = data ? JSON.parse(data) : []
      setInspections(parsedData)
      setError(null)
    } catch (err) {
      setError('데이터 로드 실패')
      setInspections([])
    } finally {
      setLoading(false)
    }
  }

  const addInspection = (data: any) => {
    try {
      const newInspection = {
        id: Date.now().toString(),
        ...data,
        created_at: new Date().toISOString()
      }
      
      const updated = [newInspection, ...inspections]
      setInspections(updated)
      localStorage.setItem('inspections', JSON.stringify(updated))
      
      return newInspection
    } catch (err) {
      setError('데이터 저장 실패')
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