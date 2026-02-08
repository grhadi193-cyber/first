import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { getAppointmentsByAdvisor, getAppointmentsByStudent } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    if (user) {
      if (user.role === 'advisor') {
        const appointments = getAppointmentsByAdvisor(user.id)
        const pending = appointments.filter(apt => apt.status === 'pending').length
        setPendingCount(pending)
      } else if (user.role === 'student') {
        const appointments = getAppointmentsByStudent(user.id)
        const pending = appointments.filter(apt => apt.status === 'pending').length
        setPendingCount(pending)
      }
    }
  }, [user, location])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-gradient-to-r from-navy-800 to-navy-900 text-white shadow-2xl sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8 space-x-reverse">
            <h1 className="text-2xl font-black flex items-center gap-3">
              <span className="text-4xl">🎓</span>
              <span>سامانه اساتید مشاور</span>
            </h1>
            
            {user?.role === 'advisor' && (
              <div className="flex space-x-2 space-x-reverse">
                <Link 
                  to="/advisor/dashboard" 
                  className={`px-4 py-2 rounded-xl font-semibold transition ${
                    isActive('/advisor/dashboard') 
                      ? 'bg-white text-navy-800 shadow-lg' 
                      : 'hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  🏠 داشبورد
                </Link>
                <Link 
                  to="/advisor/appointments" 
                  className={`px-4 py-2 rounded-xl font-semibold transition relative ${
                    isActive('/advisor/appointments') 
                      ? 'bg-white text-navy-800 shadow-lg' 
                      : 'hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  📅 نوبت‌ها
                  {pendingCount > 0 && (
                    <span className="notification-badge">{pendingCount}</span>
                  )}
                </Link>
                <Link 
                  to="/advisor/availability" 
                  className={`px-4 py-2 rounded-xl font-semibold transition ${
                    isActive('/advisor/availability') 
                      ? 'bg-white text-navy-800 shadow-lg' 
                      : 'hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  ⏰ ساعات حضور
                </Link>
                <Link 
                  to="/advisor/report" 
                  className={`px-4 py-2 rounded-xl font-semibold transition ${
                    isActive('/advisor/report') 
                      ? 'bg-white text-navy-800 shadow-lg' 
                      : 'hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  📊 گزارش
                </Link>
              </div>
            )}

            {user?.role === 'student' && (
              <div className="flex space-x-2 space-x-reverse">
                <Link 
                  to="/student/dashboard" 
                  className={`px-4 py-2 rounded-xl font-semibold transition ${
                    isActive('/student/dashboard') 
                      ? 'bg-white text-navy-800 shadow-lg' 
                      : 'hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  🏠 داشبورد
                </Link>
                <Link 
                  to="/student/appointment" 
                  className={`px-4 py-2 rounded-xl font-semibold transition relative ${
                    isActive('/student/appointment') 
                      ? 'bg-white text-navy-800 shadow-lg' 
                      : 'hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  📅 نوبت‌گیری
                  {pendingCount > 0 && (
                    <span className="notification-badge">{pendingCount}</span>
                  )}
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="text-left">
              <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs opacity-75">
                {user?.role === 'advisor' ? '👨‍🏫 استاد' : '👨‍🎓 دانشجو'}
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-2 rounded-xl transition font-semibold"
            >
              🚪 خروج
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
