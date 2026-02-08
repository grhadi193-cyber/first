import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Navbar from '../Shared/Navbar'
import { REJECTION_REASONS } from '../../utils/mockData'

const AppointmentManagement = () => {
  const { user } = useAuth()
  const { getAppointmentsByAdvisor, updateAppointmentStatus, updateAppointment } = useData()
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('all')
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [rejectModal, setRejectModal] = useState(null)
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')

  useEffect(() => {
    if (user) {
      const advisorAppointments = getAppointmentsByAdvisor(user.id)
      setAppointments(advisorAppointments)
    }
  }, [user])

  const refreshAppointments = () => {
    const advisorAppointments = getAppointmentsByAdvisor(user.id)
    setAppointments(advisorAppointments)
  }

  const handleApprove = (appointmentId, studentName) => {
    updateAppointmentStatus(appointmentId, 'approved')
    alert(`✅ نوبت ${studentName} تایید شد\n📱 پیامک تایید به دانشجو در بله ارسال می‌شود`)
    refreshAppointments()
  }

  const handleRejectClick = (appointment) => {
    setRejectModal(appointment)
    setSelectedReason('')
    setCustomReason('')
  }

  const handleRejectConfirm = () => {
    if (!rejectModal) return

    let finalReason = ''
    if (selectedReason === 'سایر (تشریح دلیل)') {
      if (!customReason.trim()) {
        alert('لطفاً دلیل رد را وارد کنید')
        return
      }
      finalReason = customReason.trim()
    } else if (selectedReason) {
      finalReason = selectedReason
    } else {
      alert('لطفاً دلیل رد را انتخاب کنید')
      return
    }

    updateAppointmentStatus(rejectModal.id, 'rejected', finalReason)
    alert(`❌ نوبت ${rejectModal.studentName} رد شد\n\n📱 پیامک رد همراه با دلیل "${finalReason}" به دانشجو در بله ارسال می‌شود`)
    setRejectModal(null)
    refreshAppointments()
  }

  const handleEdit = (appointment) => {
    setEditingAppointment({
      ...appointment,
      newDay: appointment.day,
      newDate: appointment.date,
      newTime: appointment.time
    })
  }

  const handleSaveEdit = () => {
    if (!editingAppointment) return

    const changes = []
    if (editingAppointment.newDay !== editingAppointment.day) {
      changes.push(`روز: ${editingAppointment.day} → ${editingAppointment.newDay}`)
    }
    if (editingAppointment.newDate !== editingAppointment.date) {
      changes.push(`تاریخ: ${editingAppointment.date} → ${editingAppointment.newDate}`)
    }
    if (editingAppointment.newTime !== editingAppointment.time) {
      changes.push(`ساعت: ${editingAppointment.time} → ${editingAppointment.newTime}`)
    }

    if (changes.length === 0) {
      alert('هیچ تغییری ایجاد نشده است')
      return
    }

    updateAppointment(editingAppointment.id, {
      day: editingAppointment.newDay,
      date: editingAppointment.newDate,
      time: editingAppointment.newTime
    })

    const changeMessage = `📝 تغییرات نوبت

👨‍🎓 دانشجو: ${editingAppointment.studentName}
👨‍🏫 استاد: ${user.firstName} ${user.lastName}

تغییرات:
${changes.join('\n')}

📱 پیامک اطلاع‌رسانی به دانشجو ارسال می‌شود.`

    alert('✅ تغییرات با موفقیت ذخیره شد\n\n' + changeMessage)
    setEditingAppointment(null)
    refreshAppointments()
  }

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true
    return apt.status === filter
  })

  const pendingCount = appointments.filter(apt => apt.status === 'pending').length
  const approvedCount = appointments.filter(apt => apt.status === 'approved').length
  const rejectedCount = appointments.filter(apt => apt.status === 'rejected').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-black text-navy-800 mb-2">📅 مدیریت نوبت‌ها</h2>
          <p className="text-gray-600 text-lg">بررسی و تایید نوبت‌های دانشجویان</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-navy">
            <h3 className="text-sm opacity-90 mb-2">کل نوبت‌ها</h3>
            <p className="text-5xl font-black">{appointments.length}</p>
          </div>
          <div className="card-warning">
            <h3 className="text-sm opacity-90 mb-2">در انتظار تایید</h3>
            <p className="text-5xl font-black">{pendingCount}</p>
          </div>
          <div className="card-success">
            <h3 className="text-sm opacity-90 mb-2">تایید شده</h3>
            <p className="text-5xl font-black">{approvedCount}</p>
          </div>
          <div className="card bg-gradient-to-br from-red-600 to-red-700 text-white">
            <h3 className="text-sm opacity-90 mb-2">رد شده</h3>
            <p className="text-5xl font-black">{rejectedCount}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="card mb-6">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-navy-700 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              همه ({appointments.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-3 rounded-xl font-semibold transition whitespace-nowrap ${
                filter === 'pending'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              در انتظار ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-6 py-3 rounded-xl font-semibold transition whitespace-nowrap ${
                filter === 'approved'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              تایید شده ({approvedCount})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-6 py-3 rounded-xl font-semibold transition whitespace-nowrap ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              رد شده ({rejectedCount})
            </button>
          </div>
        </div>

        {/* Reject Modal */}
        {rejectModal && (
          <div className="modal-overlay">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold text-navy-800 mb-4">❌ رد نوبت</h3>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  <strong>دانشجو:</strong> {rejectModal.studentName}
                </p>
                <p className="text-gray-700">
                  <strong>زمان:</strong> {rejectModal.day} {rejectModal.date} - ساعت {rejectModal.time}
                </p>
              </div>

              <div className="mb-4">
                <label className="label">دلیل رد نوبت:</label>
                <div className="space-y-2">
                  {REJECTION_REASONS.map(reason => (
                    <label 
                      key={reason}
                      className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition ${
                        selectedReason === reason
                          ? 'border-navy-600 bg-navy-50'
                          : 'border-gray-300 hover:border-navy-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="rejection-reason"
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="w-4 h-4 text-navy-600"
                      />
                      <span className="mr-3 font-semibold">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {selectedReason === 'سایر (تشریح دلیل)' && (
                <div className="mb-4">
                  <label className="label">تشریح دلیل:</label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    rows="3"
                    className="input-field"
                    placeholder="دلیل رد نوبت را بنویسید..."
                  />
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={handleRejectConfirm} className="btn-danger flex-1">
                  ❌ تایید رد نوبت
                </button>
                <button onClick={() => setRejectModal(null)} className="btn-secondary flex-1">
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingAppointment && (
          <div className="modal-overlay">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold text-navy-800 mb-4">✏️ ویرایش نوبت</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="label">دانشجو</label>
                  <p className="font-semibold text-navy-800">{editingAppointment.studentName}</p>
                </div>

                <div>
                  <label className="label">روز جدید</label>
                  <input
                    type="text"
                    value={editingAppointment.newDay}
                    onChange={(e) => setEditingAppointment({...editingAppointment, newDay: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">تاریخ جدید</label>
                  <input
                    type="text"
                    value={editingAppointment.newDate}
                    onChange={(e) => setEditingAppointment({...editingAppointment, newDate: e.target.value})}
                    className="input-field"
                    placeholder="1404/11/15"
                  />
                </div>

                <div>
                  <label className="label">ساعت جدید</label>
                  <input
                    type="text"
                    value={editingAppointment.newTime}
                    onChange={(e) => setEditingAppointment({...editingAppointment, newTime: e.target.value})}
                    className="input-field"
                    placeholder="10:00"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={handleSaveEdit} className="btn-primary flex-1">
                    ✅ ذخیره تغییرات
                  </button>
                  <button onClick={() => setEditingAppointment(null)} className="btn-secondary flex-1">
                    انصراف
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4 opacity-50">📭</div>
              <p className="text-lg text-gray-500">نوبتی یافت نشد</p>
            </div>
          ) : (
            filteredAppointments.map(apt => (
              <div 
                key={apt.id}
                className={`card border-r-4 ${
                  apt.status === 'pending'
                    ? 'border-r-amber-500 bg-amber-50'
                    : apt.status === 'approved'
                    ? 'border-r-green-500 bg-green-50'
                    : 'border-r-red-500 bg-red-50'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-navy-800">{apt.studentName}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        apt.status === 'pending'
                          ? 'bg-amber-500 text-white'
                          : apt.status === 'approved'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {apt.status === 'pending' ? '⏳ در انتظار' : apt.status === 'approved' ? '✅ تایید شده' : '❌ رد شده'}
                      </span>
                      {apt.isEdited && (
                        <span className="text-sm text-blue-600 font-semibold">✏️ ویرایش شده</span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-gray-600 text-xs">روز</p>
                        <p className="font-bold text-navy-800">{apt.day}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-gray-600 text-xs">تاریخ</p>
                        <p className="font-bold text-navy-800">{apt.date}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-gray-600 text-xs">ساعت</p>
                        <p className="font-bold text-navy-800">{apt.time}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-gray-600 text-xs">نوع نوبت</p>
                        <p className="font-bold text-navy-800 text-xs">{apt.appointmentType || '—'}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-gray-600 text-xs">موضوع جلسه</p>
                        <p className="font-bold text-navy-800 text-xs">{apt.sessionTopic || '—'}</p>
                      </div>
                    </div>

                    {apt.description && (
                      <div className="mt-3 p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-600">توضیحات:</p>
                        <p className="text-sm font-semibold text-navy-800">{apt.description}</p>
                      </div>
                    )}

                    {apt.status === 'rejected' && apt.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-100 rounded-lg border border-red-200">
                        <p className="text-sm font-bold text-red-900">دلیل رد:</p>
                        <p className="text-sm text-red-800">{apt.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {apt.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleApprove(apt.id, apt.studentName)}
                          className="btn-success px-6 py-2"
                        >
                          ✅ تایید
                        </button>
                        <button 
                          onClick={() => handleRejectClick(apt)}
                          className="btn-danger px-6 py-2"
                        >
                          ❌ رد
                        </button>
                      </>
                    )}
                    {apt.status === 'approved' && (
                      <button 
                        onClick={() => handleEdit(apt)}
                        className="bg-navy-600 text-white px-6 py-2 rounded-lg hover:bg-navy-700 transition font-semibold"
                      >
                        ✏️ ویرایش
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AppointmentManagement
