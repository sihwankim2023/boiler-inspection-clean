import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

interface InspectionForm {
  inspectionDate: string
  inspector: string
  siteName: string
  city: string
  district: string
  result: string
  summary: string
}

// 시/구 데이터
const cityData = {
  '서울특별시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
  '경기도': ['수원시', '성남시', '안양시', '안산시', '용인시', '광명시', '평택시', '과천시', '오산시', '시흥시', '군포시', '의왕시', '하남시', '이천시', '안성시', '김포시', '화성시', '광주시', '양주시', '포천시', '여주시', '연천군', '가평군', '양평군'],
  '인천광역시': ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
  '부산광역시': ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
  '대구광역시': ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군']
}

export default function InspectionPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm<InspectionForm>({
    defaultValues: {
      inspectionDate: new Date().toISOString().split('T')[0],
      city: '',
      district: ''
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inspections, setInspections] = useState<any[]>([])
  
  const selectedCity = watch('city')
  const availableDistricts = cityData[selectedCity as keyof typeof cityData] || []

  const onSubmit = async (data: InspectionForm) => {
    setIsSubmitting(true)
    
    try {
      // 로컬 스토리지에 저장 (Supabase 대신)
      const newInspection = {
        id: Date.now().toString(),
        inspection_date: data.inspectionDate,
        inspector: data.inspector,
        site_name: data.siteName,
        address: `${data.city} ${data.district}`,
        result: data.result,
        summary: data.summary,
        created_at: new Date().toISOString()
      }
      
      // 기존 데이터 가져오기
      const existingData = localStorage.getItem('inspections')
      const inspections = existingData ? JSON.parse(existingData) : []
      
      // 새 데이터 추가
      inspections.unshift(newInspection)
      localStorage.setItem('inspections', JSON.stringify(inspections))
      
      // PDF 생성 시뮬레이션
      const pdfContent = `
보일러 점검 보고서

점검일: ${data.inspectionDate}
점검자: ${data.inspector}
현장명: ${data.siteName}
주소: ${data.city} ${data.district}
점검 결과: ${data.result}
점검 요약: ${data.summary || '없음'}

생성 시간: ${new Date().toLocaleString('ko-KR')}
      `
      
      // 텍스트 파일로 다운로드
      const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `점검보고서_${data.siteName}_${data.inspectionDate}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('점검이 완료되고 보고서가 다운로드되었습니다!')
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

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시/도 *
              </label>
              <select
                {...register('city', { required: '시/도를 선택하세요' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">시/도 선택</option>
                {Object.keys(cityData).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                구/군 *
              </label>
              <select
                {...register('district', { required: '구/군을 선택하세요' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!selectedCity}
              >
                <option value="">구/군 선택</option>
                {availableDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              {errors.district && (
                <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
              )}
            </div>
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
              <li>• 점검 데이터가 로컬에 저장됩니다</li>
              <li>• 텍스트 보고서가 자동으로 다운로드됩니다</li>
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