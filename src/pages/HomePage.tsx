import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
          🔧 보일러 점검 앱
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">새 점검 시작</h2>
            <p className="text-gray-600 mb-4">
              새로운 보일러 점검을 시작하고 체크리스트를 작성하세요.
            </p>
            <Link 
              to="/inspection" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              점검 시작하기
            </Link>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">최근 점검</h2>
            <p className="text-gray-600 mb-4">
              이전에 완료한 점검 기록을 확인하세요.
            </p>
            <button className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              기록 보기
            </button>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">시스템 정보</h3>
          <p className="text-sm text-gray-600">
            배포 시간: {new Date().toLocaleString('ko-KR')}
          </p>
          <p className="text-sm text-gray-600">
            상태: Vercel 배포 성공 ✅
          </p>
        </div>
      </div>
    </div>
  )
}