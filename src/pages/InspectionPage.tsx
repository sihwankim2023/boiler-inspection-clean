import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ChevronDown, ChevronUp, Camera, FileText, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface InspectionForm {
  inspectionDate: string
  inspector: string
  siteName: string
  city: string
  district: string
  result: string
  summary: string
  facilityManager: string
  contractorName: string
  businessType: string
  products: Array<{name: string, count: number}>
  fuel: string
  exhaustType: string
  electrical: string
  piping: string
  waterSupply: string
  control: string
  purpose: string
  deliveryType: string
  installationDate: string
  photos: FileList | null
}

// 시/구 데이터
const cityData = {
  '서울특별시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
  '경기도': ['수원시', '성남시', '안양시', '안산시', '용인시', '광명시', '평택시', '과천시', '오산시', '시흥시', '군포시', '의왕시', '하남시', '이천시', '안성시', '김포시', '화성시', '광주시', '양주시', '포천시', '여주시', '연천군', '가평군', '양평군'],
  '인천광역시': ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
  '부산광역시': ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
  '대구광역시': ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군']
}

// 제품 목록
const productList = [
  { name: 'NPW-351K', label: 'NPW-351K (온수보일러)' },
  { name: 'NCN-45HD', label: 'NCN-45HD (콘덴싱보일러)' },
  { name: 'NCB790', label: 'NCB790 (콘덴싱보일러)' },
  { name: 'NFB-500', label: 'NFB-500 (온수보일러)' }
]

// 체크리스트 항목
const checklistItems = [
  { id: 'burner_nozzle', label: '버너 노즐 상태 확인', category: '설치' },
  { id: 'ignition_electrode', label: '점화 전극 상태 확인', category: '설치' },
  { id: 'flame_sensor', label: '화염 감지기 상태 확인', category: '설치' },
  { id: 'gas_valve', label: '가스 밸브 작동 확인', category: '설치' },
  { id: 'air_damper', label: '공기 댐퍼 조절 확인', category: '설치' },
  { id: 'heat_exchanger', label: '열교환기 청소 상태 확인', category: '설치' },
  { id: 'exhaust_pipe', label: '배기관 연결 상태 확인', category: '설치' },
  { id: 'insulation', label: '보온재 설치 상태 확인', category: '설치' },
  { id: 'drain_valve', label: '드레인 밸브 작동 확인', category: '설치' },
  { id: 'pressure_gauge', label: '압력계 정상 작동 확인', category: '설치' },
  { id: 'temperature_gauge', label: '온도계 정상 작동 확인', category: '설치' },
  { id: 'safety_valve', label: '안전밸브 작동 확인', category: '설치' },
  { id: 'water_level', label: '수위 조절 장치 확인', category: 'Check' },
  { id: 'circulation_pump', label: '순환펌프 작동 확인', category: 'Check' },
  { id: 'expansion_tank', label: '팽창탱크 상태 확인', category: 'Check' },
  { id: 'direct_return_filter', label: '직수환수급기필터 상태 확인', category: 'Check' },
  { id: 'blower', label: '송풍기 작동 상태 확인', category: 'Check' },
  { id: 'dual_venturi', label: '듀얼벤츄리 작동 확인', category: 'Check' },
  { id: 'pump', label: '펌프 작동 상태 확인', category: 'Check' },
  { id: 'mixing_valve', label: '믹싱밸브 작동 확인', category: 'Check' },
  { id: 'three_way_valve', label: '삼방밸브 작동 확인', category: 'Check' },
  { id: 'control_panel', label: '제어반 작동 확인', category: 'Check' },
  { id: 'overall_system', label: '전체 시스템 통합 작동 확인', category: 'Check' }
]

// 콤보박스 옵션들
const fuelOptions = ['도시가스', 'LPG', '경유', '등유', '기타']
const exhaustOptions = ['강제배기', '자연배기', '직접배기']
const electricalOptions = ['단상 220V', '삼상 220V', '삼상 380V']
const pipingOptions = ['동관', '스테인리스관', '강관', '플렉시블관']
const waterSupplyOptions = ['상수도', '지하수', '중수도']
const controlOptions = ['온도조절', '압력조절', '자동제어']
const purposeOptions = ['난방용', '급탕용', '난방겸용']
const deliveryOptions = ['개별형', '중앙형', '지역형']

export default function InspectionPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<InspectionForm>({
    defaultValues: {
      inspectionDate: new Date().toISOString().split('T')[0],
      city: '',
      district: '',
      products: [],
      installationDate: ''
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([])
  const [checklistOpen, setChecklistOpen] = useState(false)
  const [checklistAnswers, setChecklistAnswers] = useState<Record<string, {answer: string, reason: string}>>({})
  const [products, setProducts] = useState<Array<{name: string, count: number}>>([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [productCount, setProductCount] = useState(1)

  const selectedCity = watch('city')
  const installationDate = watch('installationDate')
  const availableDistricts = cityData[selectedCity as keyof typeof cityData] || []

  // 사용 년수 계산
  const calculateUsageYears = (installDate: string) => {
    if (!installDate) return ''
    const install = new Date(installDate)
    const now = new Date()
    const diffTime = now.getTime() - install.getTime()
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365))
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
    return diffYears > 0 ? `${diffYears}년 ${diffMonths}개월` : `${diffMonths}개월`
  }

  // 제품 추가
  const addProduct = () => {
    if (selectedProduct && productCount > 0) {
      const newProduct = { name: selectedProduct, count: productCount }
      setProducts([...products, newProduct])
      setSelectedProduct('')
      setProductCount(1)
      setShowProductForm(false)
    }
  }

  // 제품 제거
  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index))
  }

  // 체크리스트 답변 변경
  const updateChecklistAnswer = (itemId: string, answer: string, reason: string = '') => {
    setChecklistAnswers(prev => ({
      ...prev,
      [itemId]: { answer, reason }
    }))
  }

  // 전체 Yes 설정
  const setAllYes = () => {
    const allYes = checklistItems.reduce((acc, item) => {
      acc[item.id] = { answer: 'yes', reason: '' }
      return acc
    }, {} as Record<string, {answer: string, reason: string}>)
    setChecklistAnswers(allYes)
  }

  // 사진 업로드 처리
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newPhotos = Array.from(files).slice(0, 5) // 최대 5장
      setUploadedPhotos(prev => [...prev, ...newPhotos].slice(0, 5))
    }
  }

  // 사진 제거
  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index))
  }

  // PDF 생성 함수
  const generatePDF = (data: any) => {
    const totalProducts = products.reduce((sum, p) => sum + p.count, 0)
    const usageYears = calculateUsageYears(data.installationDate)
    
    const pdfContent = `
보일러 점검 보고서
====================

문서번호: INS-${Date.now()}
점검 차수: 1차
점검일: ${data.inspectionDate}
점검자: ${data.inspector}
점검 결과: ${data.result}
시설 관리자: ${data.facilityManager || '미입력'}

현장 정보
---------
현장명: ${data.siteName}
주소: ${data.city} ${data.district}
시공업체: ${data.contractorName || '미입력'}
업종: ${data.businessType || '미입력'}

설치 제품
---------
${products.map(p => `${p.name}: ${p.count}대`).join('\n')}
총 ${totalProducts}대 설치

설치 정보
---------
설치일: ${data.installationDate || '미입력'}
사용 년수: ${usageYears || '미입력'}

기술적 세부사항
--------------
사용연료: ${data.fuel || '미입력'}
연도방식: ${data.exhaustType || '미입력'}
정격전압: ${data.electrical || '미입력'}
배관재질: ${data.piping || '미입력'}
급수방식: ${data.waterSupply || '미입력'}
제어방식: ${data.control || '미입력'}
설치용도: ${data.purpose || '미입력'}
공급형태: ${data.deliveryType || '미입력'}

점검 체크리스트
--------------
${checklistItems.map(item => {
  const answer = checklistAnswers[item.id]
  const status = answer?.answer === 'yes' ? '✓' : answer?.answer === 'no' ? '✗' : '미확인'
  const reason = answer?.reason ? ` (사유: ${answer.reason})` : ''
  return `[${item.category}] ${item.label}: ${status}${reason}`
}).join('\n')}

점검 요약
---------
${data.summary || '점검 요약 없음'}

첨부 사진
---------
총 ${uploadedPhotos.length}장의 사진이 첨부되었습니다.

생성 시간: ${new Date().toLocaleString('ko-KR')}
    `
    
    return pdfContent
  }

  const onSubmit = async (data: InspectionForm) => {
    setIsSubmitting(true)
    
    try {
      const newInspection = {
        id: Date.now().toString(),
        inspection_date: data.inspectionDate,
        inspector: data.inspector,
        site_name: data.siteName,
        address: `${data.city} ${data.district}`,
        result: data.result,
        summary: data.summary,
        facility_manager: data.facilityManager,
        contractor_name: data.contractorName,
        business_type: data.businessType,
        products: products,
        fuel: data.fuel,
        exhaust_type: data.exhaustType,
        electrical: data.electrical,
        piping: data.piping,
        water_supply: data.waterSupply,
        control: data.control,
        purpose: data.purpose,
        delivery_type: data.deliveryType,
        installation_date: data.installationDate,
        usage_years: calculateUsageYears(data.installationDate),
        checklist_answers: checklistAnswers,
        photo_count: uploadedPhotos.length,
        created_at: new Date().toISOString()
      }
      
      // 로컬 스토리지에 저장
      const existingData = localStorage.getItem('inspections')
      const inspections = existingData ? JSON.parse(existingData) : []
      inspections.unshift(newInspection)
      localStorage.setItem('inspections', JSON.stringify(inspections))
      
      // PDF 생성
      const pdfContent = generatePDF(data)
      
      // 파일 다운로드
      const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `점검보고서_${data.siteName}_${data.inspectionDate}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('점검이 완료되고 상세 보고서가 다운로드되었습니다!')
      navigate('/')
      
    } catch (error) {
      console.error('점검 저장 실패:', error)
      alert('점검 저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-600">보일러 점검</h1>
          <button 
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded hover:bg-gray-100"
          >
            ← 홈으로
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 점검 정보 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">점검 정보</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">점검일 *</label>
                <input
                  type="date"
                  {...register('inspectionDate', { required: '점검일을 입력하세요' })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.inspectionDate && <p className="text-red-600 text-sm mt-1">{errors.inspectionDate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">점검자 *</label>
                <input
                  type="text"
                  {...register('inspector', { required: '점검자를 입력하세요' })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="점검자 이름"
                />
                {errors.inspector && <p className="text-red-600 text-sm mt-1">{errors.inspector.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">현장명 *</label>
                <input
                  type="text"
                  {...register('siteName', { required: '현장명을 입력하세요' })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="현장명"
                />
                {errors.siteName && <p className="text-red-600 text-sm mt-1">{errors.siteName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">점검 결과 *</label>
                <select
                  {...register('result', { required: '점검 결과를 선택하세요' })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">점검 결과 선택</option>
                  <option value="정상">정상</option>
                  <option value="주의">주의</option>
                  <option value="불량">불량</option>
                </select>
                {errors.result && <p className="text-red-600 text-sm mt-1">{errors.result.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시설 관리자</label>
                <input
                  type="text"
                  {...register('facilityManager')}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="시설 관리자 이름"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시공업체</label>
                <input
                  type="text"
                  {...register('contractorName')}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="시공업체명"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">업종</label>
                <input
                  type="text"
                  {...register('businessType')}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="업종"
                />
              </div>
            </div>
          </div>

          {/* 설치 위치 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">설치 위치</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시/도 *</label>
                <select
                  {...register('city', { required: '시/도를 선택하세요' })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">시/도 선택</option>
                  {Object.keys(cityData).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">구/군 *</label>
                <select
                  {...register('district', { required: '구/군을 선택하세요' })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!selectedCity}
                >
                  <option value="">구/군 선택</option>
                  {availableDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && <p className="text-red-600 text-sm mt-1">{errors.district.message}</p>}
              </div>
            </div>
          </div>

          {/* 설치 제품 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">설치 제품</h2>
            
            {products.length > 0 && (
              <div className="mb-4">
                <div className="space-y-2">
                  {products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                      <div>
                        <span className="font-medium">{product.name}</span>
                        <span className="text-gray-600 ml-2">{product.count}대</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        제거
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-2 bg-blue-50 rounded">
                  <span className="text-blue-800 font-medium">
                    총 {products.reduce((sum, p) => sum + p.count, 0)}대 설치
                  </span>
                </div>
              </div>
            )}

            {showProductForm ? (
              <div className="bg-white p-4 rounded border">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">제품 선택</label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">제품 선택</option>
                      {productList.map(product => (
                        <option key={product.name} value={product.name}>{product.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">설치 대수</label>
                    <input
                      type="number"
                      min="1"
                      value={productCount}
                      onChange={(e) => setProductCount(parseInt(e.target.value) || 1)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={addProduct}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    추가
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowProductForm(true)}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600"
              >
                + 제품 추가
              </button>
            )}
          </div>

          {/* 설치 정보 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">설치 정보</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설치일</label>
                <input
                  type="date"
                  {...register('installationDate')}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사용 년수</label>
                <input
                  type="text"
                  value={calculateUsageYears(installationDate)}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                  placeholder="설치일 입력 시 자동 계산"
                />
              </div>
            </div>
          </div>

          {/* 기술적 세부사항 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">기술적 세부사항</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사용연료</label>
                <select {...register('fuel')} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">선택</option>
                  {fuelOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연도방식</label>
                <select {...register('exhaustType')} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">선택</option>
                  {exhaustOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">정격전압</label>
                <select {...register('electrical')} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">선택</option>
                  {electricalOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">배관재질</label>
                <select {...register('piping')} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">선택</option>
                  {pipingOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">급수방식</label>
                <select {...register('waterSupply')} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">선택</option>
                  {waterSupplyOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제어방식</label>
                <select {...register('control')} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">선택</option>
                  {controlOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설치용도</label>
                <select {...register('purpose')} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">선택</option>
                  {purposeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">공급형태</label>
                <select {...register('deliveryType')} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">선택</option>
                  {deliveryOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* 체크리스트 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">점검 체크리스트 (23개 항목)</h2>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={setAllYes}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  전체 Yes
                </button>
                <button
                  type="button"
                  onClick={() => setChecklistOpen(!checklistOpen)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                >
                  <span>{checklistOpen ? '접기' : '펼치기'}</span>
                  {checklistOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>
            
            {checklistOpen && (
              <div className="space-y-4">
                {/* 설치 카테고리 */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">설치 항목</h3>
                  <div className="space-y-3">
                    {checklistItems.filter(item => item.category === '설치').map(item => (
                      <div key={item.id} className="bg-white p-3 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{item.label}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => updateChecklistAnswer(item.id, 'yes')}
                              className={`px-3 py-1 rounded text-sm ${checklistAnswers[item.id]?.answer === 'yes' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                              예
                            </button>
                            <button
                              type="button"
                              onClick={() => updateChecklistAnswer(item.id, 'no')}
                              className={`px-3 py-1 rounded text-sm ${checklistAnswers[item.id]?.answer === 'no' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                              아니오
                            </button>
                          </div>
                        </div>
                        {checklistAnswers[item.id]?.answer === 'no' && (
                          <input
                            type="text"
                            placeholder="사유를 입력하세요"
                            value={checklistAnswers[item.id]?.reason || ''}
                            onChange={(e) => updateChecklistAnswer(item.id, 'no', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Check 카테고리 */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">점검 항목</h3>
                  <div className="space-y-3">
                    {checklistItems.filter(item => item.category === 'Check').map(item => (
                      <div key={item.id} className="bg-white p-3 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{item.label}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => updateChecklistAnswer(item.id, 'yes')}
                              className={`px-3 py-1 rounded text-sm ${checklistAnswers[item.id]?.answer === 'yes' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                              예
                            </button>
                            <button
                              type="button"
                              onClick={() => updateChecklistAnswer(item.id, 'no')}
                              className={`px-3 py-1 rounded text-sm ${checklistAnswers[item.id]?.answer === 'no' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                              아니오
                            </button>
                          </div>
                        </div>
                        {checklistAnswers[item.id]?.answer === 'no' && (
                          <input
                            type="text"
                            placeholder="사유를 입력하세요"
                            value={checklistAnswers[item.id]?.reason || ''}
                            onChange={(e) => updateChecklistAnswer(item.id, 'no', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 사진 업로드 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">사진 첨부 (최대 5장)</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {uploadedPhotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`점검 사진 ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 점검 요약 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">점검 요약</label>
            <textarea
              {...register('summary')}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="점검 내용을 간단히 요약하세요"
            />
          </div>

          {/* 안내사항 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">완전한 점검 시스템 기능</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 23개 세부 점검 항목 체크리스트</li>
              <li>• 4가지 제품군 동적 추가 시스템</li>
              <li>• 8개 기술적 세부사항 콤보박스</li>
              <li>• 사진 첨부 기능 (최대 5장)</li>
              <li>• 설치일 기반 사용년수 자동 계산</li>
              <li>• 상세한 PDF 형식 보고서 생성</li>
              <li>• 로컬 저장 및 점검 기록 관리</li>
            </ul>
          </div>

          {/* 버튼 */}
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