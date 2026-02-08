import React from 'react'

const AppointmentTimeline = ({ appointments }) => {
  const statusCounts = {
    pending: appointments.filter(apt => apt.status === 'pending').length,
    approved: appointments.filter(apt => apt.status === 'approved').length,
    rejected: appointments.filter(apt => apt.status === 'rejected').length
  }

  const total = appointments.length || 1

  const recentAppointments = appointments
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div className="card fade-in" style={{ animationDelay: '0.8s' }}>
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        📅 وضعیت نوبت‌ها
      </h3>

      {/* Status Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
          <div className="text-3xl font-black text-yellow-600">{statusCounts.pending}</div>
          <div className="text-xs text-yellow-700 font-semibold mt-1">در انتظار</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-200">
          <div className="text-3xl font-black text-green-600">{statusCounts.approved}</div>
          <div className="text-xs text-green-700 font-semibold mt-1">تایید شده</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-xl border-2 border-red-200">
          <div className="text-3xl font-black text-red-600">{statusCounts.rejected}</div>
          <div className="text-xs text-red-700 font-semibold mt-1">رد شده</div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3">آخرین نوبت‌ها</h4>
        {recentAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm">نوبتی ثبت نشده</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAppointments.map(apt => (
              <div 
                key={apt.id}
                className={`p-3 rounded-lg border-r-4 ${
                  apt.status === 'pending' ? 'bg-yellow-50 border-r-yellow-500' :
                  apt.status === 'approved' ? 'bg-green-50 border-r-green-500' :
                  'bg-red-50 border-r-red-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{apt.studentName}</p>
                    <p className="text-xs text-gray-600">{apt.day} - {apt.time}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    apt.status === 'pending' ? 'bg-yellow-500 text-white' :
                    apt.status === 'approved' ? 'bg-green-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {apt.status === 'pending' ? '⏳' : apt.status === 'approved' ? '✅' : '❌'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentTimeline
