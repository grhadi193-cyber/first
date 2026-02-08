import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Navbar from '../Shared/Navbar'
import { mockAdvisors, APPOINTMENT_TYPES, SESSION_TOPICS } from '../../utils/mockData'
import { getNextMonthDates } from '../../utils/dateHelper'

const Appointment = () => {
  const { user } = useAuth()
  const { addAppointment, getStudentById, getAppointmentsByStudent } = useData()
  const navigate = useNavigate()
  const studentData = getStudentById(user.id)

  const [selectedDate, setSelectedDate] = useState(null)
  const [appointmentTime, setAppointmentTime] = useState('')
  const [appointmentType, setAppointmentType] = useState('')
  const [sessionTopic, setSessionTopic] = useState('')
  const [description, setDescription] = useState('')
  const [advisorAvailability, setAdvisorAvailability] = useState({})
  const [availableDates, setAvailableDates] = useState([])
  const [studentAppointments, setStudentAppointments] = useState([])

  useEffect(() => {
    if (studentData?.advisorId) {
      const savedAvailability = localStorage.getItem(`availability_${studentData.advisorId}`)
      
      if (savedAvailability) {
        setAdvisorAvailability(JSON.parse(savedAvailability))
      } else {
        const advisor = mockAdvisors.find(adv => adv.id === studentData.advisorId)
        if (advisor?.availability) {
          setAdvisorAvailability(advisor.availability)
        }
      }
    }

    const appointments = getAppointmentsByStudent(user.id)
    setStudentAppointments(appointments)
  }, [studentData, user.id])

  useEffect(() => {
    const nextMonthDates = getNextMonthDates()
    const filtered = nextMonthDates.filter(dateObj => {
      const dayOfWeek = dateObj.dayOfWeek
      return advisorAvailability[dayOfWeek] && advisorAvailability[dayOfWeek].length > 0
    })
    setAvailableDates(filtered)
  }, [advisorAvailability])

  const handleDateSelect = (dateObj) => {
    setSelectedDate(dateObj)
    setAppointmentTime('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!selectedDate) {
      alert('لطفاً تاریخ را انتخاب کنید')
      return
    }

    if (!appointmentTime) {
      alert('لطفاً ساعت جلسه را انتخاب کنید')
      return
    }

    if (!appointmentType) {
      alert('لطفاً نوع نوبت را انتخاب کنید')
      return
    }

    if (!sessionTopic) {
      alert('لطفاً موضوع جلسه را انتخاب کنید')
      return
    }

    const appointment = {
      studentId: user.id,
      studentName: `${user.firstName} ${user.lastName}`,
      advisorId: studentData.advisorId,
      advisorName: studentData.advisorName,
      day: selectedDate.dayOfWeek,
      date: selectedDate.persian,
      time: appointmentTime,
      appointmentType,
      sessionTopic,
      description: description || 'جلسه مشاوره',
      createdAt: new Date().toISOString()
    }

    addAppointment(appointment)
    
    const appointmentTypeLabel = APPOINTMENT_TYPES.find(t => t.value === appointmentType)?.label || appointmentType

    const confirmMessage = `✅ نوبت شما با موفقیت ثبت شد!

📅 روز: ${selectedDate.dayOfWeek}
📆 تاریخ: ${selectedDate.persian}
⏰ ساعت: ${appointmentTime}
👨‍🏫 استاد: ${studentData.advisorName}
📋 نوع نوبت: ${appointmentTypeLabel}
📝 موضوع: ${sessionTopic}

📱 پیامک اطلاع‌رسانی به استاد در بله ارسال می‌شود.
⏳ لطفاً منتظر تایید استاد باشید.`

    alert(confirmMessage)
    window.location.reload()
  }

  const handleUnconfirmedAppointment = () => {
    const pendingAppointments = studentAppointments.filter(apt => {
      if (apt.status !== 'pending') return false
      
      const createdTime = new Date(apt.createdAt).getTime()
      const currentTime = new Date().getTime()
      const hoursPassed = (currentTime - createdTime) / (1000 * 60 * 60)
      
      return hoursPassed > 24
    })
    
    if (pendingAppointments.length === 0) {
      alert('❌ شما نوبت تایید نشده‌ای که بیش از 24 ساعت گذشته باشد ندارید.')
      return
    }

    const reportMessage = `⚠️ گزارش نوبت تایید نشده

👨‍🎓 دانشجو: ${user.firstName} ${user.lastName}
📚 شماره دانشجویی: ${user.studentNumber}
👨‍🏫 استاد مشاور: ${studentData.advisorName}

📋 تعداد نوبت‌های تایید نشده (بیش از 24 ساعت): ${pendingAppointments.length}

لیست نوبت‌ها:
${pendingAppointments.map((apt, i) => `${i + 1}. ${apt.day} ${apt.date} - ساعت ${apt.time}`).join('\n')}

⏰ این نوبت‌ها بیش از 24 ساعت است که تایید نشده‌اند.`

    alert('📱 پیام به مسئول اساتید مشاور در بله ارسال شد:\n\n' + reportMessage)
  }

  const pendingCount = studentAppointments.filter(apt => apt.status === 'pending').length
  const approvedCount = studentAppointments.filter(apt => apt.status === 'approved').length
  const rejectedAppointments = studentAppointments.filter(apt => apt.status === 'rejected')
  const oldPendingCount = studentAppointments.filter(apt => {
    if (apt.status !== 'pending') return false
    const hoursPassed = (new Date().getTime() - new Date(apt.createdAt).getTime()) / (1000 * 60 * 60)
    return hoursPassed > 24
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => navigate('/student/dashboard')}
            className="btn-secondary mb-6"
          >
            ← بازگشت به داشبورد
          </button>

          {/* Header Card */}
          <div className="card-navy mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">📅 نوبت‌گیری جلسه مشاوره</h2>
                <p className="opacity-90">
                  <strong>استاد مشاور:</strong> {studentData?.advisorName}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  <p className="text-sm">در انتظار تایید</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  <p className="text-sm">تایید شده</p>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Warning for old pending */}
          {oldPendingCount > 0 && (
            <div className="card mb-6 bg-amber-50 border-2 border-amber-400">
              <div className="flex items-start gap-4">
                <div className="text-4xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-900 mb-2">
                    هشدار: نوبت تایید نشده
                  </h3>
                  <p className="text-amber-800 mb-4">
                    شما {oldPendingCount} نوبت دارید که بیش از 24 ساعت است تایید نشده است.
                  </p>
                  <button
                    onClick={handleUnconfirmedAppointment}
                    className="bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition font-semibold"
                  >
                    📱 ارسال گزارش به مسئول
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Rejected Appointments */}
          {rejectedAppointments.length > 0 && (
            <div className="card mb-6 bg-red-50 border-2 border-red-400">
              <h3 className="text-xl font-bold text-red-900 mb-4">❌ نوبت‌های رد شده</h3>
              <div className="space-y-3">
                {rejectedAppointments.map(apt => (
                  <div key={apt.id} className="bg-white p-4 rounded-xl border border-red-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-navy-800">{apt.day} - {apt.date}</p>
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

          {availableDates.length === 0 ? (
            <div className="card">
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-amber-800 text-lg">
                  استاد مشاور هنوز ساعات حضور خود را تنظیم نکرده است.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar Section */}
              <div className="lg:col-span-2">
                <div className="card">
                  <h3 className="text-2xl font-bold text-navy-800 mb-6">
                    📅 انتخاب تاریخ
                  </h3>

                  <div className="space-y-3">
                    {availableDates.map((dateObj, index) => {
                      const isSelected = selectedDate?.persian === dateObj.persian
                      
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleDateSelect(dateObj)}
                          className={`w-full p-4 rounded-xl border-2 transition text-right ${
                            isSelected
                              ? 'border-navy-700 bg-navy-50 shadow-md'
                              : 'border-gray-300 hover:border-navy-500 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold text-lg text-navy-800">{dateObj.dayOfWeek}</p>
                              <p className="text-gray-600">{dateObj.persian}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {advisorAvailability[dateObj.dayOfWeek]?.length} ساعت در دسترس
                              </p>
                            </div>
                            {isSelected && (
                              <span className="bg-navy-700 text-white text-xs px-3 py-1 rounded-full font-semibold">
                                انتخاب شده
                              </span>
                            )}
                          </div>

                          {/* Show time slots, appointment type, and topic below selected day */}
                          {isSelected && (
                            <div className="mt-4 pt-4 border-t-2 border-navy-200 space-y-4">
                              {/* Time Slots */}
                              <div>
                                <label className="block text-sm font-bold text-navy-800 mb-2">⏰ انتخاب ساعت:</label>
                                <div className="grid grid-cols-4 gap-2">
                                  {advisorAvailability[dateObj.dayOfWeek]?.map(time => (
                                    <button
                                      key={time}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setAppointmentTime(time)
                                      }}
                                      className={`p-2 rounded-lg border-2 transition text-sm font-semibold ${
                                        appointmentTime === time
                                          ? 'border-navy-700 bg-navy-700 text-white'
                                          : 'border-gray-300 hover:border-navy-500'
                                      }`}
                                    >
                                      {time}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Appointment Type */}
                              <div>
                                <label className="block text-sm font-bold text-navy-800 mb-2">📋 نوع نوبت:</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {APPOINTMENT_TYPES.map(type => (
                                    <button
                                      key={type.value}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setAppointmentType(type.value)
                                      }}
                                      className={`p-2 rounded-lg border-2 transition text-xs font-semibold ${
                                        appointmentType === type.value
                                          ? 'border-navy-700 bg-navy-700 text-white'
                                          : 'border-gray-300 hover:border-navy-500'
                                      }`}
                                    >
                                      {type.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Session Topic */}
                              <div>
                                <label className="block text-sm font-bold text-navy-800 mb-2">📝 موضوع جلسه:</label>
                                <select
                                  value={sessionTopic}
                                  onChange={(e) => {
                                    e.stopPropagation()
                                    setSessionTopic(e.target.value)
                                  }}
                                  className="input-field w-full text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <option value="">انتخاب موضوع</option>
                                  {SESSION_TOPICS.filter(t => t !== 'ارجاع').map(topic => (
                                    <option key={topic} value={topic}>{topic}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 space-y-4">
                  {selectedDate ? (
                    <div className="card">
                      <h3 className="text-xl font-bold text-navy-800 mb-4">
                        📋 خلاصه نوبت
                      </h3>

                      <div className="space-y-3 mb-4">
                        <div className="bg-navy-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600">روز و تاریخ</p>
                          <p className="font-bold text-navy-800">{selectedDate.dayOfWeek}</p>
                          <p className="text-sm text-gray-600">{selectedDate.persian}</p>
                        </div>

                        {appointmentTime && (
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <p className="text-xs text-gray-600">ساعت</p>
                            <p className="font-bold text-green-800 text-lg">{appointmentTime}</p>
                          </div>
                        )}

                        {appointmentType && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-xs text-gray-600">نوع نوبت</p>
                            <p className="font-bold text-blue-800 text-sm">
                              {APPOINTMENT_TYPES.find(t => t.value === appointmentType)?.label}
                            </p>
                          </div>
                        )}

                        {sessionTopic && (
                          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <p className="text-xs text-gray-600">موضوع</p>
                            <p className="font-bold text-purple-800 text-sm">{sessionTopic}</p>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <label className="label">توضیحات (اختیاری)</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows="3"
                          className="input-field text-sm"
                          placeholder="توضیحات خود را بنویسید..."
                        />
                      </div>

                      <button 
                        onClick={handleSubmit}
                        disabled={!appointmentTime || !appointmentType || !sessionTopic}
                        className={`w-full py-3 rounded-xl transition font-semibold ${
                          appointmentTime && appointmentType && sessionTopic
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        ✅ ثبت نوبت
                      </button>
                    </div>
                  ) : (
                    <div className="card text-center text-gray-500">
                      <div className="text-6xl mb-4">📅</div>
                      <p>لطفاً یک تاریخ را انتخاب کنید</p>
                    </div>
                  )}

                  {/* My Appointments */}
                  <div className="card">
                    <h3 className="text-lg font-bold text-navy-800 mb-4">نوبت‌های من</h3>
                    
                    {studentAppointments.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">
                        شما هنوز نوبتی ثبت نکرده‌اید
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {studentAppointments.slice(0, 5).map(apt => (
                          <div 
                            key={apt.id}
                            className={`p-3 rounded-lg border text-sm ${
                              apt.status === 'pending'
                                ? 'border-amber-300 bg-amber-50'
                                : apt.status === 'approved'
                                ? 'border-green-300 bg-green-50'
                                : 'border-red-300 bg-red-50'
                            }`}
                          >
                            <p className="font-bold">{apt.day}</p>
                            <p className="text-xs text-gray-600">{apt.date} - {apt.time}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className={`text-xs px-2 py-1 rounded ${
                                apt.status === 'pending'
                                  ? 'bg-amber-500 text-white'
                                  : apt.status === 'approved'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-red-500 text-white'
                              }`}>
                                {apt.status === 'pending' ? '⏳' : apt.status === 'approved' ? '✅' : '❌'}
                              </span>
                              {apt.isEdited && (
                                <span className="text-xs text-blue-600">✏️</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="card mt-6 bg-blue-50 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="text-3xl">ℹ️</div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 mb-2">نکات مهم:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• فقط روزهایی که استاد حضور دارد نمایش داده می‌شود</li>
                  <li>• بعد از انتخاب روز، ساعت و نوع نوبت را مشخص کنید</li>
                  <li>• موضوع جلسه را انتخاب کنید تا استاد آماده باشد</li>
                  <li>• پس از ثبت نوبت، پیامک به استاد ارسال می‌شود</li>
                  <li>• استاد تا 24 ساعت نوبت شما را تایید یا رد می‌کند</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appointment
