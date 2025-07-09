import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useInspections } from '../hooks/useInspections'
import { generateInspectionPDF, downloadPDF } from '../lib/pdfGenerator'

interface InspectionForm {
  inspectionDate: string
  inspector: string
  siteName: string
  address: string
  result: string
  summary: string
}

export default function InspectionPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<InspectionForm>({
    defaultValues: {
      inspectionDate: new Date().toISOString().split('T')[0]
    }
  })
  const { addInspection } = useInspections()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: InspectionForm) => {
    setIsSubmitting(true)
    
    try {
      // Supabase에 데이터 저장
      const savedInspection = await addInspection({
        inspection_date: data.inspectionDate,
        inspector: data.inspector,
        site_name: data.siteName,
        address: data.address,
        result: data.result,
        summary: data.summary
      })
      
      // PDF 생성
      const pdfBlob = await generateInspectionPDF(data)
      downloadPDF(pdfBlob, `점검보고서_${data.siteName}_${data.inspectionDate}.pdf`)
      
      alert('점검이 완료되고 PDF가 생성되었습니다!')
      navigate('/')
      
    } catch (error) {
      console.error('점검 저장 실패:', error)
      alert('점검 저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-600">보일러 점검</h1>
          <button 
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            ← 홈으로
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                점검일 *
              </label>
              <input
                type="date"
                {...register('inspectionDate', { required: '점검일을 입력하세요' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.inspectionDate && (
                <p className="mt-1 text-sm text-red-600">{errors.inspectionDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                점검자 *
              </label>
              <input
                type="text"
                {...register('inspector', { required: '점검자를 입력하세요' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="점검자 이름"
              />
              {errors.inspector && (
                <p className="mt-1 text-sm text-red-600">{errors.inspector.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현장명 *
            </label>
            <input
              type="text"
              {...register('siteName', { required: '현장명을 입력하세요' })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="현장명"
            />
            {errors.siteName && (
              <p className="mt-1 text-sm text-red-600">{errors.siteName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주소 *
            </label>
            <input
              type="text"
              {...register('address', { required: '주소를 입력하세요' })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="설치 주소"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              점검 결과 *
            </label>
            <select
              {...register('result', { required: '점검 결과를 선택하세요' })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">점검 결과 선택</option>
              <option value="정상">정상</option>
              <option value="주의">주의</option>
              <option value="불량">불량</option>
            </select>
            {errors.result && (
              <p className="mt-1 text-sm text-red-600">{errors.result.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              점검 요약
            </label>
            <textarea
              {...register('summary')}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="점검 내용을 간단히 요약하세요"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">점검 완료 시</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 점검 데이터가 Supabase에 저장됩니다</li>
              <li>• PDF 보고서가 자동으로 생성됩니다</li>
              <li>• 홈 화면에서 점검 기록을 확인할 수 있습니다</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '저장 중...' : '점검 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}