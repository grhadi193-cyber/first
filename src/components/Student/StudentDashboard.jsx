import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Navbar from '../Shared/Navbar'
import SessionTable from '../Shared/SessionTable'

const StudentDashboard = () => {
  const { user } = useAuth()
  const { getStudentById, getAppointmentsByStudent } = useData()
  const studentData = getStudentById(user.id)
  const appointments = getAppointmentsByStudent(user.id)

  const handleSendSMS = () => {
    alert('📱 پیامک به استاد مشاور ارسال شد!')
  }

  const handleEvaluation = () => {
    window.open('https://survey.porsline.ir/', '_blank')
  }

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending')
  const approvedAppointments = appointments.filter(apt => apt.status === 'approved')
  const rejectedAppointments = appointments.filter(apt => apt.status === 'rejected')

  // Calculate session topics statistics
  const topicStats = {}
  studentData?.sessions?.forEach(session => {
    session.topics?.forEach(topic => {
      topicStats[topic] = (topicStats[topic] || 0) + 1
    })
  })

  const mostDiscussedTopic = Object.entries(topicStats).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            خوش آمدید، {user.firstName} {user.lastName} 👋
          </h1>
          <p className="text-gray-600 text-lg">
            به پنل دانشجویی خود خوش آمدید
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-gradient fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm opacity-90 mb-2">استاد مشاور</h3>
                <p className="text-xl font-bold">{studentData?.advisorName}</p>
              </div>
              <div className="text-5xl opacity-50">👨‍🏫</div>
            </div>
          </div>

          <div className="card-gradient-success fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm opacity-90 mb-2">جلسات برگزار شده</h3>
                <p className="text-4xl font-black">{studentData?.totalSessions || 0}</p>
              </div>
              <div className="text-5xl opacity-50">📚</div>
            </div>
          </div>

          <div className="card-gradient-warning fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm opacity-90 mb-2">نوبت در انتظار</h3>
                <p className="text-4xl font-black">{pendingAppointments.length}</p>
              </div>
              <div className="text-5xl opacity-50">⏳</div>
            </div>
          </div>

          <div className="card-gradient-info fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm opacity-90 mb-2">معدل</h3>
                <p className="text-4xl font-black">{studentData?.gpa}</p>
              </div>
              <div className="text-5xl opacity-50">⭐</div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        {approvedAppointments.length > 0 && (
          <div className="card mb-6 fade-in" style={{ animationDelay: '0.5s' }}>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span>📅</span>
              <span>نوبت‌های تایید شده</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedAppointments.map(apt => (
                <div key={apt.id} className="p-4 border-2 border-green-500 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-lg text-gray-800">{apt.day}</p>
                      <p className="text-sm text-gray-600">{apt.date}</p>
                    </div>
                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      ✅ تایید شده
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">⏰</span>
                    <p className="text-3xl font-black text-green-700">{apt.time}</p>
                  </div>
                  {apt.description && (
                    <p className="text-sm text-gray-600 mt-2 bg-white p-2 rounded-lg">
                      {apt.description}
                    </p>
                  )}
                  {apt.isEdited && (
                    <div className="mt-2 text-xs text-blue-600 font-semibold">
                      ✏️ ویرایش شده توسط استاد
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected Appointments Warning */}
        {rejectedAppointments.length > 0 && (
          <div className="card mb-6 bg-red-50 border-2 border-red-200 fade-in" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-3">
              <span>⚠️</span>
              <span>نوبت‌های رد شده</span>
            </h3>
            <div className="space-y-3">
              {rejectedAppointments.map(apt => (
                <div key={apt.id} className="bg-white p-4 rounded-lg border border-red-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold">{apt.day} - {apt.date}</p>
                      <p className="text-sm text-gray-600">ساعت {apt.time}</p>
                    </div>
                    <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                      رد شده
                    </span>
                  </div>
                  {apt.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-100 rounded-lg">
                      <p className="text-sm font-bold text-red-900 mb-1">دلیل رد:</p>
                      <p className="text-sm text-red-800">{apt.rejectionReason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Personal Info */}
          <div className="lg:col-span-2 card fade-in" style={{ animationDelay: '0.7s' }}>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span>👤</span>
              <span>اطلاعات شخصی</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
                <label className="text-sm text-gray-600 font-semibold">نام و نام خانوادگی</label>
                <p className="text-lg font-bold text-gray-800 mt-1">{user.firstName} {user.lastName}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
                <label className="text-sm text-gray-600 font-semibold">شماره دانشجویی</label>
                <p className="text-lg font-bold text-gray-800 mt-1">{user.studentNumber}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
                <label className="text-sm text-gray-600 font-semibold">شماره همراه</label>
                <p className="text-lg font-bold text-gray-800 mt-1" dir="ltr">{user.phoneNumber}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
                <label className="text-sm text-gray-600 font-semibold">نیمسال تحصیلی</label>
                <p className="text-lg font-bold text-gray-800 mt-1">{studentData?.semester}</p>
              </div>
            </div>
          </div>

          {/* Session Topics Stats */}
          <div className="card fade-in" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">📊 آمار موضوعات</h3>
            {Object.keys(topicStats).length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-sm">هنوز جلسه‌ای برگزار نشده</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(topicStats)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([topic, count]) => (
                    <div key={topic}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600 font-semibold truncate">{topic}</span>
                        <span className="text-xs font-bold text-purple-600">{count}</span>
                      </div>
                      <div className="progress-bar h-1.5">
                        <div 
                          className="progress-bar-fill"
                          style={{ width: `${(count / Math.max(...Object.values(topicStats))) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                {mostDiscussedTopic && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-800">
                      💡 <strong>بیشترین موضوع:</strong> {mostDiscussedTopic[0]}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sessions Table */}
        <div className="card mb-6 fade-in" style={{ animationDelay: '0.9s' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span>📝</span>
              <span>جلسات مشاوره</span>
            </h3>
            <span className="badge badge-primary text-lg px-4 py-2">
              {studentData?.sessions?.length || 0} جلسه
            </span>
          </div>
          <SessionTable sessions={studentData?.sessions || []} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link 
            to="/student/appointment" 
            className="card hover:shadow-2xl transition cursor-pointer bg-gradient-to-br from-blue-500 to-purple-600 text-white fade-in"
            style={{ animationDelay: '1s' }}
          >
            <div className="text-center">
              <div className="text-6xl mb-4 animate-float">📅</div>
              <h3 className="text-xl font-bold mb-2">نوبت‌گیری</h3>
              <p className="text-sm opacity-90">رزرو جلسه با استاد</p>
            </div>
          </Link>

          <div 
            onClick={handleSendSMS}
            className="card hover:shadow-2xl transition cursor-pointer bg-gradient-to-br from-green-500 to-emerald-600 text-white fade-in"
            style={{ animationDelay: '1.1s' }}
          >
            <div className="text-center">
              <div className="text-6xl mb-4 animate-float" style={{ animationDelay: '0.2s' }}>📱</div>
              <h3 className="text-xl font-bold mb-2">ارسال پیامک</h3>
              <p className="text-sm opacity-90">پیام به استاد مشاور</p>
            </div>
          </div>

          <div 
            onClick={handleEvaluation}
            className="card hover:shadow-2xl transition cursor-pointer bg-gradient-to-br from-yellow-500 to-orange-500 text-white fade-in"
            style={{ animationDelay: '1.2s' }}
          >
            <div className="text-center">
              <div className="text-6xl mb-4 animate-float" style={{ animationDelay: '0.4s' }}>⭐</div>
              <h3 className="text-xl font-bold mb-2">ارزشیابی استاد</h3>
              <p className="text-sm opacity-90">ثبت نظر در پرسلاین</p>
            </div>
          </div>

          <Link 
            to={`/session-entry/${user.id}`}
            className="card hover:shadow-2xl transition cursor-pointer bg-gradient-to-br from-pink-500 to-rose-600 text-white fade-in"
            style={{ animationDelay: '1.3s' }}
          >
            <div className="text-center">
              <div className="text-6xl mb-4 animate-float" style={{ animationDelay: '0.6s' }}>📝</div>
              <h3 className="text-xl font-bold mb-2">ثبت جلسه</h3>
              <p className="text-sm opacity-90">ثبت اطلاعات جلسه</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
