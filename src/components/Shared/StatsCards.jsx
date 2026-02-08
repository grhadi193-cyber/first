import React from 'react'

const StatsCards = ({ 
  totalStudents, 
  totalSessions, 
  avgGPA, 
  avgSessions,
  pendingAppointments,
  approvedAppointments 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      <div className="card-gradient fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="text-sm opacity-90 mb-2">کل دانشجویان</div>
        <div className="text-4xl font-black mb-1">{totalStudents}</div>
        <div className="text-xs opacity-75">👨‍🎓 دانشجو</div>
      </div>

      <div className="card-gradient-success fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="text-sm opacity-90 mb-2">کل جلسات</div>
        <div className="text-4xl font-black mb-1">{totalSessions}</div>
        <div className="text-xs opacity-75">📚 جلسه برگزار شده</div>
      </div>

      <div className="card-gradient-warning fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="text-sm opacity-90 mb-2">میانگین معدل</div>
        <div className="text-4xl font-black mb-1">{avgGPA}</div>
        <div className="text-xs opacity-75">📊 از 20</div>
      </div>

      <div className="card-gradient-info fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="text-sm opacity-90 mb-2">میانگین جلسات</div>
        <div className="text-4xl font-black mb-1">{avgSessions}</div>
        <div className="text-xs opacity-75">📈 جلسه به ازای هر دانشجو</div>
      </div>

      <div className="card bg-gradient-to-br from-yellow-400 to-orange-500 text-white fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="text-sm opacity-90 mb-2">نوبت در انتظار</div>
        <div className="text-4xl font-black mb-1">{pendingAppointments}</div>
        <div className="text-xs opacity-75">⏳ نیاز به تایید</div>
      </div>

      <div className="card bg-gradient-to-br from-emerald-400 to-cyan-500 text-white fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="text-sm opacity-90 mb-2">نوبت تایید شده</div>
        <div className="text-4xl font-black mb-1">{approvedAppointments}</div>
        <div className="text-xs opacity-75">✅ آماده برگزاری</div>
      </div>
    </div>
  )
}

export default StatsCards
