import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface InspectionData {
  inspectionDate: string
  inspector: string
  siteName: string
  address: string
  result: string
  summary?: string
}

export async function generateInspectionPDF(data: InspectionData): Promise<Blob> {
  const pdf = new jsPDF()
  
  // 한글 폰트 설정 (기본 폰트 사용)
  pdf.setFont('helvetica')
  
  // 제목
  pdf.setFontSize(20)
  pdf.text('보일러 점검 보고서', 20, 30)
  
  // 점검 정보
  pdf.setFontSize(12)
  let y = 60
  
  const addField = (label: string, value: string) => {
    pdf.text(`${label}: ${value}`, 20, y)
    y += 10
  }
  
  addField('점검일', data.inspectionDate)
  addField('점검자', data.inspector)
  addField('현장명', data.siteName)
  addField('주소', data.address)
  addField('점검 결과', data.result)
  
  if (data.summary) {
    y += 10
    pdf.text('점검 요약:', 20, y)
    y += 10
    
    // 요약 내용을 여러 줄로 분할
    const splitSummary = pdf.splitTextToSize(data.summary, 170)
    pdf.text(splitSummary, 20, y)
  }
  
  // 생성 시간 추가
  y += 30
  pdf.setFontSize(10)
  pdf.text(`생성 시간: ${new Date().toLocaleString('ko-KR')}`, 20, y)
  
  return pdf.output('blob')
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}