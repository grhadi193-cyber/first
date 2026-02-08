import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 800))

    const success = login(username, password, role)
    
    if (success) {
      if (role === 'advisor') {
        navigate('/advisor/dashboard')
      } else {
        navigate('/student/dashboard')
      }
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است')
      setLoading(false)
    }
  }

  const demoAccounts = [
    { username: 'advisor1', password: '123456', role: 'advisor', name: 'محمد احمدی' },
    { username: 'advisor2', password: '123456', role: 'advisor', name: 'فاطمه محمدی' },
    { username: 'student1', password: '123456', role: 'student', name: 'علی رضایی' },
    { username: 'student2', password: '123456', role: 'student', name: 'زهرا کریمی' },
  ]

  const fillDemo = (demo) => {
    setUsername(demo.username)
    setPassword(demo.password)
    setRole(demo.role)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="text-white text-center lg:text-right fade-in">
            <div className="text-8xl mb-6 animate-float">🎓</div>
            <h1 className="text-5xl font-black mb-4">
              سامانه اساتید مشاور
            </h1>
            <p className="text-xl opacity-90 mb-8">
              مدیریت هوشمند جلسات مشاوره دانشجویی
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-xl">
                <div className="text-3xl font-black">500+</div>
                <div className="text-sm opacity-75">دانشجو</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-xl">
                <div className="text-3xl font-black">50+</div>
                <div className="text-sm opacity-75">استاد</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-xl">
                <div className="text-3xl font-black">2000+</div>
                <div className="text-sm opacity-75">جلسه</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-3xl font-black text-gray-800 mb-6 text-center">
                ورود به سامانه
              </h2>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6 animate-pulse">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <span className="font-semibold">{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="label">نوع کاربری</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`p-4 rounded-xl border-2 transition font-semibold ${
                        role === 'student'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">👨‍🎓</div>
                      دانشجو
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('advisor')}
                      className={`p-4 rounded-xl border-2 transition font-semibold ${
                        role === 'advisor'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">👨‍🏫</div>
                      استاد
                    </button>
                  </div>
                </div>

                <div>
                  <label className="label">نام کاربری</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field"
                    placeholder="نام کاربری خود را وارد کنید"
                    required
                  />
                </div>

                <div>
                  <label className="label">رمز عبور</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="رمز عبور خود را وارد کنید"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full btn-primary text-lg py-4 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="spinner"></div>
                      <span>در حال ورود...</span>
                    </div>
                  ) : (
                    '🚀 ورود به سامانه'
                  )}
                </button>
              </form>

              <div className="divider mt-8">
                <span>حساب‌های آزمایشی</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                {demoAccounts.map((demo, index) => (
                  <button
                    key={index}
                    onClick={() => fillDemo(demo)}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition text-sm"
                  >
                    <div className="font-semibold text-gray-800">{demo.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {demo.role === 'advisor' ? '👨‍🏫 استاد' : '👨‍🎓 دانشجو'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
