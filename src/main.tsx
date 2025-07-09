import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#1e40af', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          🔧 보일러 점검 앱
        </h1>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#059669' }}>
            ✅ Vercel 배포 성공!
          </p>
          <p style={{ color: '#6b7280' }}>
            배포 시간: {new Date().toLocaleString('ko-KR')}
          </p>
          <p style={{ color: '#6b7280' }}>
            다음 단계: 점검 기능 추가 예정
          </p>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)