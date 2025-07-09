import React from 'react'
import { Link } from 'react-router-dom'
import { useInspections } from '../hooks/useInspections'

export default function HomePage() {
  const { inspections, loading } = useInspections()
  const recentInspections = inspections.slice(0, 5)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
          🔧 보일러 점검 관리 시스템
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">새 점검 시작</h2>
            <p className="mb-4 opacity-90">
              새로운 보일러 점검을 시작하고 체크리스트를 작성하세요.
            </p>
            <Link 
              to="/inspection" 
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              점검 시작하기 →
            </Link>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">통계 및 현황</h2>
            <p className="mb-4 opacity-90">
              총 점검 수: {inspections.length}개
            </p>
            <p className="mb-4 opacity-90">
              이번 달 점검: {inspections.filter(i => 
                new Date(i.inspection_date).getMonth() === new Date().getMonth()
              ).length}개
            </p>
            <div className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold">
              활성 상태 ✅
            </div>
          </div>
        </div>
      </div>

      {/* 최근 점검 기록 */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">최근 점검 기록</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">점검 기록을 불러오는 중...</p>
          </div>
        ) : recentInspections.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">아직 점검 기록이 없습니다.</p>
            <Link 
              to="/inspection" 
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              첫 점검 시작하기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentInspections.map((inspection) => (
              <div key={inspection.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{inspection.site_name}</h3>
                    <p className="text-gray-600 text-sm">{inspection.address}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span className="text-gray-500">
                        점검일: {new Date(inspection.inspection_date).toLocaleDateString('ko-KR')}
                      </span>
                      <span className="text-gray-500">
                        점검자: {inspection.inspector}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      inspection.result === '정상' ? 'bg-green-100 text-green-800' :
                      inspection.result === '주의' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {inspection.result}
                    </span>
                  </div>
                </div>
                {inspection.summary && (
                  <p className="mt-2 text-gray-700 text-sm">{inspection.summary}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">시스템 상태</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">배포 상태:</span>
            <span className="ml-2 text-green-600 font-medium">✅ 성공</span>
          </div>
          <div>
            <span className="text-gray-600">데이터베이스:</span>
            <span className="ml-2 text-green-600 font-medium">✅ 연결됨</span>
          </div>
          <div>
            <span className="text-gray-600">마지막 업데이트:</span>
            <span className="ml-2 text-gray-600">{new Date().toLocaleString('ko-KR')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}