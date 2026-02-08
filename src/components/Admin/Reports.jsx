import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'
import * as XLSX from 'xlsx'

const Reports = () => {
  const { students, advisors, appointments, sessions } = useData()
  const [reportType, setReportType] = useState('overview')
  const [dateRange, setDateRange] = useState('all')

  // Generate Report Data
  const generateOverviewReport = () => {
    return {
      totalStudents: students.length,
      totalAdvisors: advisors.length,
      totalAppointments: appointments.length,
      totalSessions: sessions.length,
      completedSessions: sessions.filter(s => s.completed).length,
      pendingAppointments: appointments.filter(a => a.status === 'pending').length,
      approvedAppointments: appointments.filter(a => a.status === 'approved').length,
      rejectedAppointments: appointments.filter(a => a.status === 'rejected').length
    }
  }

  const generateStudentReport = () => {
    return students.map(student => {
      const advisor = advisors.find(a => a.id === student.advisorId)
      const studentAppts = appointments.filter(a => a.studentId === student.id)
      const studentSessions = sessions.filter(s => s.studentId === student.id)
      
      return {
        'شماره دانشجویی': student.studentId,
        'نام': student.name,
        'رشته': student.field,
        'ترم': student.semester,
        'معدل': student.gpa,
        'استاد مشاور': advisor?.name || '-',
        'تعداد قرارها': studentAppts.length,
        'تعداد جلسات': studentSessions.length,
        'جلسات تکمیل شده': studentSessions.filter(s => s.completed).length
      }
    })
  }

  const generateAdvisorReport = () => {
    return advisors.map(advisor => {
      const advisorStudents = students.filter(s => s.advisorId === advisor.id)
      const advisorAppts = appointments.filter(a => a.advisorId === advisor.id)
      const advisorSessions = sessions.filter(s => s.advisorId === advisor.id)
      
      return {
        'نام استاد': advisor.name,
        'دانشکده': advisor.department,
        'تخصص': advisor.expertise,
        'تعداد دانشجو': advisorStudents.length,
        'تعداد قرارها': advisorAppts.length,
        'قرارهای تایید شده': advisorAppts.filter(a => a.status === 'approved').length,
        'تعداد جلسات': advisorSessions.length,
        'جلسات تکمیل شده': advisorSessions.filter(s => s.completed).length,
        'نرخ تکمیل': advisorSessions.length > 0 
          ? `${((advisorSessions.filter(s => s.completed).length / advisorSessions.length) * 100).toFixed(1)}%`
          : '0%'
      }
    })
  }

  const generateSessionsReport = () => {
    return sessions.map(session => {
      const student = students.find(s => s.id === session.studentId)
      const advisor = advisors.find(a => a.id === session.advisorId)
      
      return {
        'تاریخ': session.date,
        'دانشجو': student?.name || '-',
        'شماره دانشجویی': student?.studentId || '-',
        'استاد مشاور': advisor?.name || '-',
        'مدت (دقیقه)': session.duration || '-',
        'وضعیت': session.completed ? 'تکمیل شده' : 'در حال انجام',
        'یادداشت': session.notes || '-'
      }
    })
  }

  const exportToExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Report')
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const handleExport = () => {
    let data, filename
    
    switch(reportType) {
      case 'students':
        data = generateStudentReport()
        filename = 'student_report'
        break
      case 'advisors':
        data = generateAdvisorReport()
        filename = 'advisor_report'
        break
      case 'sessions':
        data = generateSessionsReport()
        filename = 'sessions_report'
        break
      default:
        data = [generateOverviewReport()]
        filename = 'overview_report'
    }
    
    exportToExcel(data, filename)
  }

  const overviewData = generateOverviewReport()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
            ← بازگشت به داشبورد
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">گزارش‌گیری جامع</h1>
            <button
              onClick={handleExport}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              خروجی Excel
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Report Type Selector */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">نوع گزارش</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setReportType('overview')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                reportType === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              خلاصه کلی
            </button>
            <button
              onClick={() => setReportType('students')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                reportType === 'students'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              گزارش دانشجویان
            </button>
            <button
              onClick={() => setReportType('advisors')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                reportType === 'advisors'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              گزارش اساتید
            </button>
            <button
              onClick={() => setReportType('sessions')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                reportType === 'sessions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              گزارش جلسات
            </button>
          </div>
        </div>

        {/* Overview Report */}
        {reportType === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-sm text-gray-600 mb-2">کل دانشجویان</h3>
                <p className="text-3xl font-bold text-blue-600">{overviewData.totalStudents}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-sm text-gray-600 mb-2">کل اساتید</h3>
                <p className="text-3xl font-bold text-green-600">{overviewData.totalAdvisors}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-sm text-gray-600 mb-2">کل قرارها</h3>
                <p className="text-3xl font-bold text-yellow-600">{overviewData.totalAppointments}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-sm text-gray-600 mb-2">کل جلسات</h3>
                <p className="text-3xl font-bold text-purple-600">{overviewData.totalSessions}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">جزئیات قرارها</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-yellow-700 mb-1">در انتظار</p>
                  <p className="text-2xl font-bold text-yellow-800">{overviewData.pendingAppointments}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-700 mb-1">تایید شده</p>
                  <p className="text-2xl font-bold text-green-800">{overviewData.approvedAppointments}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm text-red-700 mb-1">رد شده</p>
                  <p className="text-2xl font-bold text-red-800">{overviewData.rejectedAppointments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">جزئیات جلسات</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-700 mb-1">تکمیل شده</p>
                  <p className="text-2xl font-bold text-purple-800">{overviewData.completedSessions}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-700 mb-1">در حال انجام</p>
                  <p className="text-2xl font-bold text-blue-800">{overviewData.totalSessions - overviewData.completedSessions}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Reports - Show preview */}
        {reportType !== 'overview' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                {
                  reportType === 'students' ? 'گزارش دانشجویان' :
                  reportType === 'advisors' ? 'گزارش اساتید' :
                  'گزارش جلسات'
                }
              </h3>
              <p className="text-sm text-gray-600">
                برای مشاهده گزارش کامل، دکمه "خروجی Excel" را بزنید
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600">گزارش آماده خروجی است</p>
              <p className="text-sm text-gray-500 mt-2">
                {
                  reportType === 'students' ? `${students.length} دانشجو` :
                  reportType === 'advisors' ? `${advisors.length} استاد` :
                  `${sessions.length} جلسه`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports