import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Navbar from '../Shared/Navbar'

const PerformanceReport = () => {
  const { user } = useAuth()
  const { getStudentsByAdvisor, semesters } = useData()
  const [selectedSemester, setSelectedSemester] = useState(semesters[0])
  const [students, setStudents] = useState([])
  const [expandedSection, setExpandedSection] = useState('overview')

  useEffect(() => {
    const allStudents = getStudentsByAdvisor(user.id, selectedSemester)
    setStudents(allStudents)
  }, [selectedSemester, user.id])

  // Calculate statistics
  const totalStudents = students.length
  const totalSessions = students.reduce((sum, std) => sum + (std.totalSessions || 0), 0)
  const avgGPA = totalStudents > 0 
    ? (students.reduce((sum, std) => sum + std.gpa, 0) / totalStudents).toFixed(2)
    : 0

  const studentsWithoutSession = students.filter(std => !std.totalSessions || std.totalSessions === 0).length
  const studentsWithLowGPA = students.filter(std => std.gpa < 14).length

  // Session topics analysis
  const topicStats = {}
  students.forEach(student => {
    student.sessions?.forEach(session => {
      session.topics?.forEach(topic => {
        topicStats[topic] = (topicStats[topic] || 0) + 1
      })
    })
  })

  const topTopics = Object.entries(topicStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // GPA Distribution
  const gpaDistribution = {
    'عالی (17-20)': students.filter(s => s.gpa >= 17).length,
    'خوب (14-17)': students.filter(s => s.gpa >= 14 && s.gpa < 17).length,
    'متوسط (12-14)': students.filter(s => s.gpa >= 12 && s.gpa < 14).length,
    'ضعیف (<12)': students.filter(s => s.gpa < 12).length,
  }

  // Session Distribution
  const sessionDistribution = {
    '0 جلسه': students.filter(s => !s.totalSessions || s.totalSessions === 0).length,
    '1-2 جلسه': students.filter(s => s.totalSessions >= 1 && s.totalSessions <= 2).length,
    '3-4 جلسه': students.filter(s => s.totalSessions >= 3 && s.totalSessions <= 4).length,
    '5+ جلسه': students.filter(s => s.totalSessions >= 5).length,
  }

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleExportReport = () => {
    const report = `
گزارش عملکرد استاد مشاور
========================

👨‍🏫 استاد: ${user.firstName} ${user.lastName}
📅 نیمسال: ${selectedSemester}
📆 تاریخ گزارش: ${new Date().toLocaleDateString('fa-IR')}

آمار کلی
--------
📊 تعداد کل دانشجویان: ${totalStudents}
📚 تعداد کل جلسات: ${totalSessions}
⭐ میانگین معدل: ${avgGPA}
⚠️ دانشجویان بدون جلسه: ${studentsWithoutSession}

موضوعات پربحث
-------------
${topTopics.map(([topic, count], i) => `${i + 1}. ${topic}: ${count} بار`).join('\n')}

توزیع معدل
----------
${Object.entries(gpaDistribution).map(([range, count]) => `${range}: ${count} نفر`).join('\n')}

توزیع جلسات
-----------
${Object.entries(sessionDistribution).map(([range, count]) => `${range}: ${count} نفر`).join('\n')}
    `.trim()

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `report_${selectedSemester}_${Date.now()}.txt`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    alert('📊 گزارش با موفقیت دانلود شد!')
  }

  const handleSendReport = () => {
    const message = `📊 گزارش عملکرد استاد مشاور

👨‍🏫 ${user.firstName} ${user.lastName}
📅 نیمسال ${selectedSemester}

📈 آمار کلی:
• ${totalStudents} دانشجو
• ${totalSessions} جلسه
• میانگین معدل: ${avgGPA}

⚠️ ${studentsWithoutSession} دانشجو بدون جلسه`

    alert('📱 گزارش به مسئول در بله ارسال شد:\n\n' + message)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-black text-navy-800 mb-2">
            📊 گزارش عملکرد
          </h1>
          <p className="text-gray-600 text-lg">
            تحلیل جامع عملکرد و فعالیت‌های مشاوره
          </p>
        </div>

        {/* Controls */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <label className="label">انتخاب نیمسال</label>
              <select 
                value={selectedSemester} 
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="input-field max-w-xs"
              >
                {semesters.map(semester => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={handleExportReport} className="btn-success">
                💾 دانلود گزارش
              </button>
              <button onClick={handleSendReport} className="btn-primary">
                📱 ارسال به مسئول
              </button>
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-navy">
            <div className="text-sm opacity-90 mb-2">کل دانشجویان</div>
            <div className="text-5xl font-black mb-2">{totalStudents}</div>
            <div className="text-xs opacity-75">👨‍🎓 دانشجو</div>
          </div>

          <div className="card-success">
            <div className="text-sm opacity-90 mb-2">کل جلسات</div>
            <div className="text-5xl font-black mb-2">{totalSessions}</div>
            <div className="text-xs opacity-75">📚 جلسه</div>
          </div>

          <div className="card-info">
            <div className="text-sm opacity-90 mb-2">میانگین معدل</div>
            <div className="text-5xl font-black mb-2">{avgGPA}</div>
            <div className="text-xs opacity-75">⭐ از 20</div>
          </div>

          <div className="card-warning">
            <div className="text-sm opacity-90 mb-2">بدون جلسه</div>
            <div className="text-5xl font-black mb-2">{studentsWithoutSession}</div>
            <div className="text-xs opacity-75">⚠️ دانشجو</div>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* Overview Section */}
          <div className="card">
            <button
              onClick={() => toggleSection('overview')}
              className="collapsible-header w-full"
            >
              <h3 className="text-xl font-bold text-navy-800 flex items-center gap-2">
                <span>📈</span>
                <span>نمای کلی</span>
              </h3>
              <span className="text-2xl">{expandedSection === 'overview' ? '−' : '+'}</span>
            </button>
            
            {expandedSection === 'overview' && (
              <div className="collapsible-content">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-navy-50 rounded-xl">
                    <div className="text-3xl font-black text-navy-700">{totalStudents}</div>
                    <div className="text-sm text-navy-600 mt-1">دانشجو</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-3xl font-black text-green-700">{totalSessions}</div>
                    <div className="text-sm text-green-600 mt-1">جلسه</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-3xl font-black text-blue-700">{avgGPA}</div>
                    <div className="text-sm text-blue-600 mt-1">میانگین معدل</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-xl">
                    <div className="text-3xl font-black text-amber-700">{studentsWithoutSession}</div>
                    <div className="text-sm text-amber-600 mt-1">بدون جلسه</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GPA Analysis */}
          <div className="card">
            <button
              onClick={() => toggleSection('gpa')}
              className="collapsible-header w-full"
            >
              <h3 className="text-xl font-bold text-navy-800 flex items-center gap-2">
                <span>⭐</span>
                <span>تحلیل معدل دانشجویان</span>
              </h3>
              <span className="text-2xl">{expandedSection === 'gpa' ? '−' : '+'}</span>
            </button>
            
            {expandedSection === 'gpa' && (
              <div className="collapsible-content">
                <div className="space-y-4">
                  {Object.entries(gpaDistribution).map(([range, count]) => {
                    const percentage = totalStudents > 0 ? (count / totalStudents) * 100 : 0
                    const color = 
                      range.includes('عالی') ? 'bg-green-500' :
                      range.includes('خوب') ? 'bg-blue-500' :
                      range.includes('متوسط') ? 'bg-amber-500' :
                      'bg-red-500'
                    
                    return (
                      <div key={range}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-navy-800">{range}</span>
                          <span className="text-sm font-bold text-navy-600">{count} نفر ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="progress-bar">
                          <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Session Analysis */}
          <div className="card">
            <button
              onClick={() => toggleSection('sessions')}
              className="collapsible-header w-full"
            >
              <h3 className="text-xl font-bold text-navy-800 flex items-center gap-2">
                <span>📚</span>
                <span>تحلیل جلسات</span>
              </h3>
              <span className="text-2xl">{expandedSection === 'sessions' ? '−' : '+'}</span>
            </button>
            
            {expandedSection === 'sessions' && (
              <div className="collapsible-content">
                <div className="space-y-4">
                  {Object.entries(sessionDistribution).map(([range, count]) => {
                    const percentage = totalStudents > 0 ? (count / totalStudents) * 100 : 0
                    
                    return (
                      <div key={range}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-navy-800">{range}</span>
                          <span className="text-sm font-bold text-navy-600">{count} نفر ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Top Topics */}
          {topTopics.length > 0 && (
            <div className="card">
              <button
                onClick={() => toggleSection('topics')}
                className="collapsible-header w-full"
              >
                <h3 className="text-xl font-bold text-navy-800 flex items-center gap-2">
                  <span>🔥</span>
                  <span>موضوعات پربحث</span>
                </h3>
                <span className="text-2xl">{expandedSection === 'topics' ? '−' : '+'}</span>
              </button>
              
              {expandedSection === 'topics' && (
                <div className="collapsible-content">
                  <div className="space-y-4">
                    {topTopics.map(([topic, count], index) => {
                      const maxCount = topTopics[0][1]
                      const percentage = (count / maxCount) * 100
                      
                      return (
                        <div key={topic}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-700 text-white font-bold text-sm">
                                {index + 1}
                              </span>
                              <span className="text-sm font-bold text-navy-800">{topic}</span>
                            </div>
                            <span className="text-sm font-bold text-navy-600">{count} بار</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Advanced Analysis */}
          <div className="card">
            <button
              onClick={() => toggleSection('advanced')}
              className="collapsible-header w-full"
            >
              <h3 className="text-xl font-bold text-navy-800 flex items-center gap-2">
                <span>🎯</span>
                <span>تحلیل پیشرفته</span>
              </h3>
              <span className="text-2xl">{expandedSection === 'advanced' ? '−' : '+'}</span>
            </button>
            
            {expandedSection === 'advanced' && (
              <div className="collapsible-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">⚠️</span>
                      <div>
                        <h4 className="font-bold text-red-900">نیازمند توجه ویژه</h4>
                        <p className="text-2xl font-black text-red-700">{studentsWithoutSession + studentsWithLowGPA}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-red-800">• {studentsWithoutSession} دانشجو بدون جلسه</p>
                      <p className="text-red-800">• {studentsWithLowGPA} دانشجو با معدل پایین</p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">✅</span>
                      <div>
                        <h4 className="font-bold text-green-900">عملکرد عالی</h4>
                        <p className="text-2xl font-black text-green-700">
                          {students.filter(s => s.gpa >= 17 && s.totalSessions >= 3).length}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-green-800">
                      دانشجویان با معدل بالا و جلسات منظم
                    </p>
                  </div>
                </div>

                {studentsWithoutSession > 0 && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <p className="text-sm text-amber-900">
                      💡 <strong>پیشنهاد:</strong> با {studentsWithoutSession} دانشجویی که هنوز جلسه نداشته‌اند تماس بگیرید.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceReport
