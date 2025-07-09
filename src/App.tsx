import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import InspectionPage from './pages/InspectionPage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inspection" element={<InspectionPage />} />
          <Route path="/inspection/:id" element={<InspectionPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App