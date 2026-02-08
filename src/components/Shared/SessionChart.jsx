import React from 'react'

const SessionChart = ({ students }) => {
  // Group students by number of sessions
  const sessionGroups = {
    '0': 0,
    '1-2': 0,
    '3-4': 0,
    '5+': 0
  }

  students.forEach(student => {
    const sessions = student.totalSessions || 0
    if (sessions === 0) sessionGroups['0']++
    else if (sessions <= 2) sessionGroups['1-2']++
    else if (sessions <= 4) sessionGroups['3-4']++
    else sessionGroups['5+']++
  })

  const maxValue = Math.max(...Object.values(sessionGroups), 1)

  return (
    <div className="card fade-in" style={{ animationDelay: '0.7s' }}>
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        📊 توزیع جلسات دانشجویان
      </h3>

      <div className="space-y-4">
        {Object.entries(sessionGroups).map(([range, count]) => {
          const percentage = (count / maxValue) * 100
          
          return (
            <div key={range}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  {range === '0' ? 'بدون جلسه' : `${range} جلسه`}
                </span>
                <span className="text-sm font-bold text-purple-600">
                  {count} دانشجو
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800">
          💡 <strong>توصیه:</strong> دانشجویانی که هنوز جلسه نداشته‌اند را پیگیری کنید.
        </p>
      </div>
    </div>
  )
}

export default SessionChart
