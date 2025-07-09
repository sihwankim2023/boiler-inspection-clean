import { useState, useEffect } from 'react'

interface Inspection {
  id: string
  inspection_date: string
  inspector: string
  site_name: string
  address: string
  result: string
  summary: string
  facility_manager?: string
  contractor_name?: string
  business_type?: string
  products?: Array<{name: string, count: number}>
  fuel?: string
  exhaust_type?: string
  electrical?: string
  piping?: string
  water_supply?: string
  control?: string
  purpose?: string
  delivery_type?: string
  installation_date?: string
  usage_years?: string
  checklist_answers?: Record<string, {answer: string, reason: string}>
  photo_count?: number
  created_at: string
}

export function useInspections() {
  const [inspections, setInspections] = useState<Inspection[]>([])
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

  const addInspection = (data: Omit<Inspection, 'id' | 'created_at'>) => {
    try {
      const newInspection: Inspection = {
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

  const updateInspection = (id: string, data: Partial<Inspection>) => {
    try {
      const updated = inspections.map(inspection => 
        inspection.id === id ? { ...inspection, ...data } : inspection
      )
      setInspections(updated)
      localStorage.setItem('inspections', JSON.stringify(updated))
      
      return updated.find(i => i.id === id)
    } catch (err) {
      setError('데이터 수정 실패')
      throw err
    }
  }

  const deleteInspection = (id: string) => {
    try {
      const updated = inspections.filter(inspection => inspection.id !== id)
      setInspections(updated)
      localStorage.setItem('inspections', JSON.stringify(updated))
    } catch (err) {
      setError('데이터 삭제 실패')
      throw err
    }
  }

  const getInspectionStats = () => {
    const now = new Date()
    const thisMonth = inspections.filter(inspection => {
      const inspectionDate = new Date(inspection.inspection_date)
      return inspectionDate.getMonth() === now.getMonth() && 
             inspectionDate.getFullYear() === now.getFullYear()
    }).length

    const results = inspections.reduce((acc, inspection) => {
      acc[inspection.result] = (acc[inspection.result] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: inspections.length,
      thisMonth,
      normal: results['정상'] || 0,
      caution: results['주의'] || 0,
      defective: results['불량'] || 0
    }
  }

  return {
    inspections,
    loading,
    error,
    addInspection,
    updateInspection,
    deleteInspection,
    getInspectionStats,
    refresh: loadInspections
  }
}