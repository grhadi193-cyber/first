import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'

const UserManagement = () => {
  const { students, advisors, updateStudent, updateAdvisor, deleteStudent, deleteAdvisor, addAdvisor } = useData()
  const [activeTab, setActiveTab] = useState('students')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [newAdvisor, setNewAdvisor] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    department: '',
    expertise: ''
  })

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentId?.includes(searchQuery) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredAdvisors = advisors.filter(a => 
    a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEditStudent = (student) => {
    setEditingUser({ ...student, type: 'student' })
  }

  const handleEditAdvisor = (advisor) => {
    setEditingUser({ ...advisor, type: 'advisor' })
  }

  const handleSaveEdit = () => {
    if (editingUser.type === 'student') {
      updateStudent(editingUser)
    } else {
      updateAdvisor(editingUser)
    }
    setEditingUser(null)
  }

  const handleDeleteUser = (id, type) => {
    if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      if (type === 'student') {
        deleteStudent(id)
      } else {
        deleteAdvisor(id)
      }
    }
  }

  const handleAddAdvisor = () => {
    addAdvisor({
      ...newAdvisor,
      id: `adv_${Date.now()}`,
      role: 'advisor'
    })
    setShowAddModal(false)
    setNewAdvisor({
      name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      department: '',
      expertise: ''
    })
  }

  const handleReassignStudent = (studentId, newAdvisorId) => {
    const student = students.find(s => s.id === studentId)
    if (student) {
      updateStudent({ ...student, advisorId: newAdvisorId })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
            ← بازگشت به داشبورد
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('students')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'students'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                دانشجویان ({students.length})
              </button>
              <button
                onClick={() => setActiveTab('advisors')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'advisors'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                اساتید مشاور ({advisors.length})
              </button>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="جستجو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {activeTab === 'advisors' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  + افزودن استاد
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Students Table */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">شماره دانشجویی</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">نام و نام خانوادگی</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">ایمیل</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">رشته</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">ترم</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">استاد مشاور</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const advisor = advisors.find(a => a.id === student.advisorId)
                    return (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">{student.studentId}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{student.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.field}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">{student.semester}</td>
                        <td className="px-4 py-3 text-sm">
                          <select
                            value={student.advisorId}
                            onChange={(e) => handleReassignStudent(student.id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {advisors.map(adv => (
                              <option key={adv.id} value={adv.id}>{adv.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEditStudent(student)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              ویرایش
                            </button>
                            <button
                              onClick={() => handleDeleteUser(student.id, 'student')}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Advisors Table */}
        {activeTab === 'advisors' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">نام و نام خانوادگی</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">نام کاربری</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">ایمیل</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">دانشکده</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">تعداد دانشجو</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdvisors.map((advisor) => {
                    const studentCount = students.filter(s => s.advisorId === advisor.id).length
                    return (
                      <tr key={advisor.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">{advisor.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{advisor.username}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{advisor.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{advisor.department}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">{studentCount}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <Link
                              to={`/admin/advisor/${advisor.id}`}
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              جزئیات
                            </Link>
                            <button
                              onClick={() => handleEditAdvisor(advisor)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              ویرایش
                            </button>
                            <button
                              onClick={() => handleDeleteUser(advisor.id, 'advisor')}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              ویرایش {editingUser.type === 'student' ? 'دانشجو' : 'استاد'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تلفن</label>
                <input
                  type="text"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Advisor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6">افزودن استاد مشاور جدید</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام و نام خانوادگی</label>
                <input
                  type="text"
                  value={newAdvisor.name}
                  onChange={(e) => setNewAdvisor({ ...newAdvisor, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
                  <input
                    type="text"
                    value={newAdvisor.username}
                    onChange={(e) => setNewAdvisor({ ...newAdvisor, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
                  <input
                    type="password"
                    value={newAdvisor.password}
                    onChange={(e) => setNewAdvisor({ ...newAdvisor, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                <input
                  type="email"
                  value={newAdvisor.email}
                  onChange={(e) => setNewAdvisor({ ...newAdvisor, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">دانشکده</label>
                <input
                  type="text"
                  value={newAdvisor.department}
                  onChange={(e) => setNewAdvisor({ ...newAdvisor, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleAddAdvisor}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                افزودن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement