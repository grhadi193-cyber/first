import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('لطفا نام کاربری و رمز عبور را وارد کنید')
      return
    }

    const success = login(username, password, role)
    if (success) {
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin/dashboard')
      } else if (role === 'advisor') {
        navigate('/advisor/dashboard')
      } else {
        navigate('/student/dashboard')
      }
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">سامانه مشاوره تحصیلی</h1>
          <p className="text-gray-600">ورود به سیستم</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نقش کاربری</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  role === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                دانشجو
              </button>
              <button
                type="button"
                onClick={() => setRole('advisor')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  role === 'advisor'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                استاد مشاور
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  role === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                مدیر
              </button>
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              نام کاربری
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              placeholder="نام کاربری خود را وارد کنید"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              placeholder="رمز عبور خود را وارد کنید"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ورود
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center mb-3">اطلاعات ورود آزمایشی:</p>
          <div className="space-y-2 text-xs text-gray-500">
            <div className="bg-gray-50 p-2 rounded">
              <strong>مدیر:</strong> admin / admin123
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <strong>استاد:</strong> موجود در داده‌های Mock
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <strong>دانشجو:</strong> موجود در داده‌های Mock
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
