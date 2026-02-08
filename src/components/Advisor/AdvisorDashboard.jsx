import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Navbar from '../Shared/Navbar'

const AdvisorDashboard = () => {
  const { user } = useAuth()
  const { getStudentsByAdvisor, semesters } = useData()
  const [selectedSemester, setSelectedSemester] = useState(semesters[0])
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGPA, setFilterGPA] = useState('all')

  useEffect(() => {
    const allStudents = getStudentsByAdvisor(user.id, selectedSemester)
    setStudents(allStudents)
  }, [selectedSemester, user.id])

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.includes(searchTerm) ||
      student.lastName.includes(searchTerm) ||
      student.studentNumber.includes(searchTerm)
    
    const matchesGPA = 
      filterGPA === 'all' ? true :
      filterGPA === 'high' ? student.gpa >= 17 :
      filterGPA === 'medium' ? student.gpa >= 14 && student.gpa < 17 :
      student.gpa < 14

    return matchesSearch && matchesGPA
  })

  // Calculate statistics
  const totalStudents = students.length
  const totalSessions = students.reduce((sum, std) => sum + (std.totalSessions || 0), 0)
  const avgGPA = totalStudents > 0 
    ? (students.reduce((sum, std) => sum + std.gpa, 0) / totalStudents).toFixed(2)
    : 0
  const avgSessions = totalStudents > 0
    ? (totalSessions / totalStudents).toFixed(1)
    : 0

  const studentsWithoutSession = students.filter(std => !std.totalSessions || std.totalSessions === 0).length

  const handleExportAllData = () => {
    let csv = '\ufeff'
    csv += 'نام,نام خانوادگی,شماره دانشجویی,معدل,شماره تماس,تعداد جلسات,نیمسال\n'
    
    students.forEach(std => {
      csv += `${std.firstName},${std.lastName},${std.studentNumber},${std.gpa},${std.phoneNumber},${std.totalSessions || 0},${std.semester}\n`
    })
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `all_students_${selectedSemester}_${Date.now()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    alert('📊 فایل اکسل با موفقیت دانلود شد!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-black text-navy-800 mb-2">
            📚 داشبورد استاد مشاور
          </h1>
          <p className="text-gray-600 text-lg">
            خوش آمدید، <span className="font-bold">{user.firstName} {user.lastName}</span> 👋
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-navy fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-sm opacity-90 mb-2">کل دانشجویان</div>
            <div className="text-5xl font-black mb-1">{totalStudents}</div>
            <div className="text-xs opacity-75">👨‍🎓 دانشجو تحت سرپرستی</div>
          </div>

          <div className="card-success fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-sm opacity-90 mb-2">کل جلسات</div>
            <div className="text-5xl font-black mb-1">{totalSessions}</div>
            <div className="text-xs opacity-75">📚 جلسه برگزار شده</div>
          </div>

          <div className="card-info fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-sm opacity-90 mb-2">میانگین معدل</div>
            <div className="text-5xl font-black mb-1">{avgGPA}</div>
            <div className="text-xs opacity-75">⭐ از 20</div>
          </div>

          <div className="card-warning fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-sm opacity-90 mb-2">بدون جلسه</div>
            <div className="text-5xl font-black mb-1">{studentsWithoutSession}</div>
            <div className="text-xs opacity-75">⚠️ نیاز به پیگیری</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label">نیمسال تحصیلی</label>
              <select 
                value={selectedSemester} 
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="input-field"
              >
                {semesters.map(semester => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">جستجو</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="نام، نام خانوادگی، شماره دانشجویی"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">فیلتر معدل</label>
              <select 
                value={filterGPA} 
                onChange={(e) => setFilterGPA(e.target.value)}
                className="input-field"
              >
                <option value="all">همه</option>
                <option value="high">بالای 17</option>
                <option value="medium">14 تا 17</option>
                <option value="low">زیر 14</option>
              </select>
            </div>

            <div className="flex items-end">
              <button 
                onClick={handleExportAllData}
                className="btn-success w-full"
              >
                📊 دانلود اکسل
              </button>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-navy-800">
              لیست دانشجویان ({filteredStudents.length})
            </h2>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p className="empty-state-text">دانشجویی یافت نشد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="rounded-tr-xl">ردیف</th>
                    <th>نام و نام خانوادگی</th>
                    <th>شماره دانشجویی</th>
                    <th>معدل</th>
                    <th>شماره تماس</th>
                    <th>تعداد جلسات</th>
                    <th className="rounded-tl-xl">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-navy-50 transition">
                      <td className="font-bold text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-navy-700 text-white text-sm">
                          {index + 1}
                        </span>
                      </td>
                      <td className="font-bold text-navy-800">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="text-gray-600">{student.studentNumber}</td>
                      <td>
                        <span className={`badge ${
                          student.gpa >= 17 ? 'badge-success' :
                          student.gpa >= 14 ? 'badge-warning' :
                          'badge-danger'
                        }`}>
                          {student.gpa}
                        </span>
                      </td>
                      <td className="text-gray-600 text-left" dir="ltr">{student.phoneNumber}</td>
                      <td>
                        <span className="badge badge-navy">
                          {student.totalSessions || 0} جلسه
                        </span>
                      </td>
                      <td>
                        <Link 
                          to={`/advisor/student/${student.id}`}
                          className="inline-block bg-navy-700 text-white px-4 py-2 rounded-lg hover:bg-navy-800 hover:shadow-lg transition text-sm font-semibold"
                        >
                          مشاهده جزئیات
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdvisorDashboard
