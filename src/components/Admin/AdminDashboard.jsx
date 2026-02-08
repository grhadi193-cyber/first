import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const { students, advisors, appointments, sessions } = useData()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Statistics
  const totalStudents = students.length
  const totalAdvisors = advisors.length
  const totalAppointments = appointments.length
  const totalSessions = sessions.length
  const pendingAppts = appointments.filter(a => a.status === 'pending').length
  const completedSessions = sessions.filter(s => s.completed).length

  // Advisor Performance Overview
  const advisorStats = advisors.map(advisor => {
    const advisorStudents = students.filter(s => s.advisorId === advisor.id)
    const advisorAppts = appointments.filter(a => a.advisorId === advisor.id)
    const advisorSessions = sessions.filter(s => s.advisorId === advisor.id)
    
    return {
      id: advisor.id,
      name: advisor.name,
      studentCount: advisorStudents.length,
      appointmentCount: advisorAppts.length,
      sessionCount: advisorSessions.length,
      completedSessions: advisorSessions.filter(s => s.completed).length
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">پنل مدیریت سیستم</h1>
              <p className="text-sm text-gray-600 mt-1">خوش آمدید، {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              خروج
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">تعداد دانشجویان</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalStudents}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">تعداد اساتید مشاور</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalAdvisors}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">قرارهای ملاقات</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalAppointments}</p>
                <p className="text-xs text-yellow-600 mt-1">در انتظار: {pendingAppts}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">جلسات مشاوره</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalSessions}</p>
                <p className="text-xs text-purple-600 mt-1">تکمیل شده: {completedSessions}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/users"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow border-t-4 border-blue-500"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full ml-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">مدیریت کاربران</h3>
            </div>
            <p className="text-gray-600 text-sm">مدیریت اساتید و دانشجویان، ویرایش اطلاعات و دسترسی‌ها</p>
          </Link>

          <Link
            to="/admin/import"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow border-t-4 border-green-500"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full ml-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">ورود دانشجویان</h3>
            </div>
            <p className="text-gray-600 text-sm">آپلود فایل اکسل و اختصاص دانشجویان به اساتید مشاور</p>
          </Link>

          <Link
            to="/admin/advisor-performance"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow border-t-4 border-yellow-500"
          >
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 p-3 rounded-full ml-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">عملکرد اساتید</h3>
            </div>
            <p className="text-gray-600 text-sm">نظارت و بررسی عملکرد اساتید مشاور</p>
          </Link>

          <Link
            to="/admin/appointments"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow border-t-4 border-purple-500"
          >
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full ml-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">مدیریت قرارها</h3>
            </div>
            <p className="text-gray-600 text-sm">مشاهده و مدیریت تمام قرارهای ملاقات سیستم</p>
          </Link>

          <Link
            to="/admin/sessions"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow border-t-4 border-red-500"
          >
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-full ml-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">مدیریت جلسات</h3>
            </div>
            <p className="text-gray-600 text-sm">مشاهده و مدیریت تمام جلسات مشاوره</p>
          </Link>

          <Link
            to="/admin/reports"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow border-t-4 border-indigo-500"
          >
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 p-3 rounded-full ml-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">گزارشات</h3>
            </div>
            <p className="text-gray-600 text-sm">گزارش‌گیری جامع از عملکرد سیستم</p>
          </Link>
        </div>

        {/* Advisor Performance Table */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">خلاصه عملکرد اساتید مشاور</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">نام استاد</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">تعداد دانشجو</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">قرارهای ملاقات</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">جلسات</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">جلسات تکمیل شده</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {advisorStats.map((advisor) => (
                  <tr key={advisor.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">{advisor.name}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{advisor.studentCount}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{advisor.appointmentCount}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{advisor.sessionCount}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{advisor.completedSessions}</td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        to={`/admin/advisor/${advisor.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        جزئیات
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard