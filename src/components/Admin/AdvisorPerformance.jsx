import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'

const AdvisorPerformance = () => {
  const { students, advisors, appointments, sessions } = useData()
  const [selectedAdvisor, setSelectedAdvisor] = useState(null)
  const [timeRange, setTimeRange] = useState('all') // all, month, week

  // Calculate performance metrics for each advisor
  const advisorMetrics = advisors.map(advisor => {
    const advisorStudents = students.filter(s => s.advisorId === advisor.id)
    const advisorAppts = appointments.filter(a => a.advisorId === advisor.id)
    const advisorSessions = sessions.filter(s => s.advisorId === advisor.id)
    
    const completedSessions = advisorSessions.filter(s => s.completed)
    const completionRate = advisorSessions.length > 0 
      ? ((completedSessions.length / advisorSessions.length) * 100).toFixed(1)
      : 0

    const avgSessionDuration = completedSessions.length > 0
      ? completedSessions.reduce((acc, s) => acc + (s.duration || 60), 0) / completedSessions.length
      : 0

    const pendingAppts = advisorAppts.filter(a => a.status === 'pending').length
    const approvedAppts = advisorAppts.filter(a => a.status === 'approved').length
    const approvalRate = advisorAppts.length > 0
      ? ((approvedAppts / advisorAppts.length) * 100).toFixed(1)
      : 0

    return {
      id: advisor.id,
      name: advisor.name,
      department: advisor.department,
      studentCount: advisorStudents.length,
      totalAppointments: advisorAppts.length,
      pendingAppointments: pendingAppts,
      totalSessions: advisorSessions.length,
      completedSessions: completedSessions.length,
      completionRate,
      approvalRate,
      avgSessionDuration: avgSessionDuration.toFixed(0),
      students: advisorStudents,
      sessions: advisorSessions
    }
  })

  // Sort by total sessions
  const sortedAdvisors = [...advisorMetrics].sort((a, b) => b.totalSessions - a.totalSessions)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
            ← بازگشت به داشبورد
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">نظارت بر عملکرد اساتید مشاور</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
            <h3 className="text-sm text-gray-600 mb-2">مجموع جلسات</h3>
            <p className="text-3xl font-bold text-gray-800">
              {advisorMetrics.reduce((acc, a) => acc + a.totalSessions, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
            <h3 className="text-sm text-gray-600 mb-2">میانگین تکمیل</h3>
            <p className="text-3xl font-bold text-gray-800">
              {(advisorMetrics.reduce((acc, a) => acc + parseFloat(a.completionRate), 0) / advisorMetrics.length).toFixed(1)}%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-500">
            <h3 className="text-sm text-gray-600 mb-2">قرارهای در انتظار</h3>
            <p className="text-3xl font-bold text-gray-800">
              {advisorMetrics.reduce((acc, a) => acc + a.pendingAppointments, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-purple-500">
            <h3 className="text-sm text-gray-600 mb-2">میانگین مدت جلسه</h3>
            <p className="text-3xl font-bold text-gray-800">
              {(advisorMetrics.reduce((acc, a) => acc + parseFloat(a.avgSessionDuration), 0) / advisorMetrics.length).toFixed(0)} دقیقه
            </p>
          </div>
        </div>

        {/* Performance Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">عملکرد اساتید</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">رتبه</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">نام استاد</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">دانشکده</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">تعداد دانشجو</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">جلسات</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">تکمیل شده</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">نرخ تکمیل</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">نرخ تایید</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">جزئیات</th>
                </tr>
              </thead>
              <tbody>
                {sortedAdvisors.map((advisor, index) => (
                  <tr key={advisor.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{advisor.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{advisor.department}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{advisor.studentCount}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{advisor.totalSessions}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{advisor.completedSessions}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(advisor.completionRate) >= 80 ? 'bg-green-100 text-green-800' :
                        parseFloat(advisor.completionRate) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {advisor.completionRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(advisor.approvalRate) >= 80 ? 'bg-green-100 text-green-800' :
                        parseFloat(advisor.approvalRate) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {advisor.approvalRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedAdvisor(advisor)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        مشاهده
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Advisor Detail Modal */}
      {selectedAdvisor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedAdvisor.name}</h2>
                <p className="text-gray-600">{selectedAdvisor.department}</p>
              </div>
              <button
                onClick={() => setSelectedAdvisor(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">دانشجویان</p>
                  <p className="text-2xl font-bold text-blue-700">{selectedAdvisor.studentCount}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 mb-1">جلسات</p>
                  <p className="text-2xl font-bold text-green-700">{selectedAdvisor.totalSessions}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 mb-1">نرخ تکمیل</p>
                  <p className="text-2xl font-bold text-purple-700">{selectedAdvisor.completionRate}%</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-yellow-600 mb-1">میانگین مدت</p>
                  <p className="text-2xl font-bold text-yellow-700">{selectedAdvisor.avgSessionDuration} دقیقه</p>
                </div>
              </div>

              {/* Students List */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">دانشجویان تحت سرپرستی</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">شماره دانشجویی</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">نام</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">رشته</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">ترم</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">معدل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAdvisor.students.map(student => (
                        <tr key={student.id} className="border-t border-gray-100">
                          <td className="px-4 py-2 text-sm text-gray-800">{student.studentId}</td>
                          <td className="px-4 py-2 text-sm text-gray-800">{student.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{student.field}</td>
                          <td className="px-4 py-2 text-center text-sm text-gray-600">{student.semester}</td>
                          <td className="px-4 py-2 text-center text-sm text-gray-600">{student.gpa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Sessions */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">جلسات اخیر</h3>
                <div className="space-y-3">
                  {selectedAdvisor.sessions.slice(0, 5).map(session => {
                    const student = students.find(s => s.id === session.studentId)
                    return (
                      <div key={session.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{student?.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{session.date}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            session.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {session.completed ? 'تکمیل شده' : 'در حال انجام'}
                          </span>
                        </div>
                        {session.notes && (
                          <p className="text-sm text-gray-600 mt-2">{session.notes}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvisorPerformance