import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'
import Navbar from '../Shared/Navbar'

const StudentDetail = () => {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const { getStudentById } = useData()
  const student = getStudentById(studentId)
  const [activeTab, setActiveTab] = useState('info')

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 to-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="card text-center">
            <p className="text-red-600 text-lg font-bold">⚠️ دانشجو یافت نشد</p>
          </div>
        </div>
      </div>
    )
  }

  const sessionsWithReferrals = student.sessions?.filter(s => s.referrals && s.referrals.length > 0) || []
  const totalReferrals = sessionsWithReferrals.reduce((sum, s) => sum + (s.referrals?.length || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => navigate('/advisor/dashboard')}
            className="btn-secondary mb-6"
          >
            ← بازگشت به لیست
          </button>

          {/* Header Card */}
          <div className="card-navy mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="opacity-90">شماره دانشجویی: {student.studentNumber}</p>
              </div>
              <button
                onClick={() => navigate(`/session-entry/${studentId}`)}
                className="bg-white text-navy-800 px-6 py-3 rounded-xl hover:shadow-xl transition font-semibold flex items-center gap-2"
              >
                <span className="text-xl">✏️</span>
                <span>ویرایش جلسات</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="card mb-6">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-3 rounded-xl font-semibold transition whitespace-nowrap ${
                  activeTab === 'info'
                    ? 'bg-navy-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📋 اطلاعات کلی
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`px-6 py-3 rounded-xl font-semibold transition whitespace-nowrap ${
                  activeTab === 'sessions'
                    ? 'bg-navy-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📚 جلسات ({student.totalSessions || 0})
              </button>
              {totalReferrals > 0 && (
                <button
                  onClick={() => setActiveTab('referrals')}
                  className={`px-6 py-3 rounded-xl font-semibold transition whitespace-nowrap relative ${
                    activeTab === 'referrals'
                      ? 'bg-amber-600 text-white shadow-lg'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }`}
                >
                  🔔 ارجاع‌ها ({totalReferrals})
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          {activeTab === 'info' && (
            <div className="card">
              <h3 className="text-2xl font-bold text-navy-800 mb-6">اطلاعات دانشجو</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-navy-50 p-4 rounded-xl">
                  <label className="text-sm text-navy-600 font-semibold">نام و نام خانوادگی</label>
                  <p className="text-lg font-bold text-navy-900">{student.firstName} {student.lastName}</p>
                </div>

                <div className="bg-navy-50 p-4 rounded-xl">
                  <label className="text-sm text-navy-600 font-semibold">شماره دانشجویی</label>
                  <p className="text-lg font-bold text-navy-900">{student.studentNumber}</p>
                </div>

                <div className="bg-navy-50 p-4 rounded-xl">
                  <label className="text-sm text-navy-600 font-semibold">معدل</label>
                  <p className="text-lg font-bold text-navy-900">{student.gpa}</p>
                </div>

                <div className="bg-navy-50 p-4 rounded-xl">
                  <label className="text-sm text-navy-600 font-semibold">شماره تماس</label>
                  <p className="text-lg font-bold text-navy-900" dir="ltr">{student.phoneNumber}</p>
                </div>

                <div className="bg-navy-50 p-4 rounded-xl">
                  <label className="text-sm text-navy-600 font-semibold">تعداد جلسات</label>
                  <p className="text-lg font-bold text-navy-900">{student.totalSessions || 0} جلسه</p>
                </div>

                <div className="bg-navy-50 p-4 rounded-xl">
                  <label className="text-sm text-navy-600 font-semibold">نیمسال</label>
                  <p className="text-lg font-bold text-navy-900">{student.semester}</p>
                </div>
              </div>

              {totalReferrals > 0 && (
                <div className="mt-6 p-5 bg-amber-50 border-2 border-amber-300 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🔔</span>
                    <h4 className="font-bold text-amber-900 text-lg">هشدار ارجاع</h4>
                  </div>
                  <p className="text-amber-800">
                    این دانشجو {totalReferrals} مورد ارجاع دارد. لطفاً تب "ارجاع‌ها" را بررسی کنید.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-navy-800">
                  جلسات مشاوره ({student.totalSessions || 0})
                </h3>
                <button
                  onClick={() => navigate(`/session-entry/${studentId}`)}
                  className="btn-primary"
                >
                  ✏️ ویرایش جلسات
                </button>
              </div>

              {!student.sessions || student.sessions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <p className="empty-state-text">هنوز جلسه‌ای ثبت نشده است</p>
                  <button
                    onClick={() => navigate(`/session-entry/${studentId}`)}
                    className="btn-primary mt-4"
                  >
                    ➕ ثبت اولین جلسه
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="rounded-tr-xl">شماره جلسه</th>
                        <th>تاریخ</th>
                        <th className="rounded-tl-xl">موضوعات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.sessions.map((session, index) => (
                        <tr key={index} className="hover:bg-navy-50 transition">
                          <td className="font-bold text-center">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-navy-700 text-white font-black">
                              {session.sessionNumber}
                            </span>
                          </td>
                          <td className="font-semibold text-gray-700">{session.date || '—'}</td>
                          <td>
                            {session.topics && session.topics.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {session.topics.map((topic, idx) => (
                                  <span 
                                    key={idx}
                                    className={`badge text-xs ${
                                      topic === 'ارجاع' ? 'badge-warning' : 'badge-navy'
                                    }`}
                                  >
                                    {topic === 'ارجاع' && '🔔 '}
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'referrals' && (
            <div className="card">
              <h3 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">🔔</span>
                <span>ارجاع‌های ثبت شده ({totalReferrals})</span>
              </h3>

              {sessionsWithReferrals.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <p className="empty-state-text">هیچ ارجاعی ثبت نشده است</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sessionsWithReferrals.map((session) => (
                    <div key={session.sessionNumber} className="border-2 border-amber-300 rounded-2xl p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-600 text-white font-bold">
                          {session.sessionNumber}
                        </span>
                        <div>
                          <h4 className="font-bold text-lg text-amber-900">جلسه {session.sessionNumber}</h4>
                          <p className="text-sm text-amber-700">تاریخ: {session.date}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {session.referrals.map((referral, index) => {
                          const icons = {
                            'مشاوره': '🧠',
                            'مسئول مشاور': '👔',
                            'آموزش': '📚',
                            'مدیر گروه': '👨‍💼'
                          }

                          return (
                            <div key={index} className="bg-white border-2 border-amber-200 rounded-xl p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">{icons[referral.type]}</span>
                                <div className="flex-1">
                                  <h5 className="font-bold text-amber-900">ارجاع به {referral.type}</h5>
                                  <p className="text-xs text-amber-600">تاریخ ارجاع: {referral.date}</p>
                                </div>
                                <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                                  فعال
                                </span>
                              </div>
                              
                              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                <p className="text-sm font-bold text-amber-900 mb-2">📝 دلیل ارجاع:</p>
                                <p className="text-sm text-amber-800 leading-relaxed">{referral.description}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalReferrals > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div className="text-sm text-blue-900">
                      <p className="font-bold mb-1">یادآوری:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800">
                        <li>پیامک ارجاع به واحدهای مربوطه ارسال شده است</li>
                        <li>لطفاً وضعیت ارجاع را با واحدهای ذی‌ربط پیگیری کنید</li>
                        <li>در صورت نیاز می‌توانید ارجاع‌های جدید اضافه کنید</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDetail
