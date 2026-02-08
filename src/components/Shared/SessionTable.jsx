import React from 'react'

const SessionTable = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <p className="empty-state-text">هنوز جلسه‌ای ثبت نشده است</p>
      </div>
    )
  }

  return (
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
          {sessions.map((session, index) => (
            <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition">
              <td className="font-bold text-center">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black">
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
                        className="badge badge-primary text-xs"
                      >
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
  )
}

export default SessionTable
