import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'
import * as XLSX from 'xlsx'

const StudentImport = () => {
  const { advisors, addStudents, updateStudent } = useData()
  const navigate = useNavigate()
  const [uploadedData, setUploadedData] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const [assignments, setAssignments] = useState({})
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const wb = XLSX.read(event.target.result, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws)

        // Map Excel columns to student data
        const students = data.map((row, index) => ({
          tempId: `temp_${index}`,
          studentId: row['شماره دانشجویی'] || row['student_id'] || '',
          name: row['نام'] || row['name'] || '',
          family: row['نام خانوادگی'] || row['family'] || '',
          email: row['ایمیل'] || row['email'] || '',
          phone: row['تلفن'] || row['phone'] || '',
          field: row['رشته'] || row['field'] || '',
          semester: row['ترم'] || row['semester'] || '',
          gpa: row['معدل'] || row['gpa'] || '',
        }))

        setUploadedData(students)
        setShowPreview(true)
        setMessage({ type: 'success', text: `${students.length} دانشجو از فایل خوانده شد` })
      } catch (error) {
        setMessage({ type: 'error', text: 'خطا در خواندن فایل اکسل' })
      }
    }
    reader.readAsBinaryString(file)
  }

  const handleAdvisorAssignment = (studentTempId, advisorId) => {
    setAssignments(prev => ({
      ...prev,
      [studentTempId]: advisorId
    }))
  }

  const handleAutoAssign = () => {
    // Auto-assign students evenly across advisors
    const newAssignments = {}
    uploadedData.forEach((student, index) => {
      const advisorIndex = index % advisors.length
      newAssignments[student.tempId] = advisors[advisorIndex].id
    })
    setAssignments(newAssignments)
    setMessage({ type: 'success', text: 'دانشجویان به صورت خودکار اختصاص داده شدند' })
  }

  const handleSubmit = async () => {
    setProcessing(true)
    try {
      const studentsToAdd = uploadedData.map(student => ({
        ...student,
        advisorId: assignments[student.tempId] || advisors[0].id,
        username: student.studentId,
        password: '123456', // Default password
        role: 'student'
      }))

      addStudents(studentsToAdd)
      setMessage({ type: 'success', text: `${studentsToAdd.length} دانشجو با موفقیت افزوده شدند` })
      
      setTimeout(() => {
        navigate('/admin/users')
      }, 2000)
    } catch (error) {
      setMessage({ type: 'error', text: 'خطا در ثبت دانشجویان' })
    } finally {
      setProcessing(false)
    }
  }

  const downloadTemplate = () => {
    const template = [
      {
        'شماره دانشجویی': '401234567',
        'نام': 'علی',
        'نام خانوادگی': 'محمدی',
        'ایمیل': 'ali@example.com',
        'تلفن': '09121234567',
        'رشته': 'مهندسی کامپیوتر',
        'ترم': '5',
        'معدل': '17.5'
      }
    ]
    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Students')
    XLSX.writeFile(wb, 'student_template.xlsx')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
                ← بازگشت به داشبورد
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">ورود دانشجویان از فایل اکسل</h1>
            </div>
            <button
              onClick={downloadTemplate}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              دانلود فایل نمونه
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* Upload Section */}
        {!showPreview && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">آپلود فایل اکسل دانشجویان</h2>
              <p className="text-gray-600 mb-6">فایل اکسل حاوی اطلاعات دانشجویان را انتخاب کنید</p>
              
              <label className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                انتخاب فایل اکسل
              </label>

              <div className="mt-8 text-right bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4">راهنمای فرمت فایل اکسل:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>فایل باید شامل ستون‌های: شماره دانشجویی، نام، نام خانوادگی، ایمیل، تلفن، رشته، ترم، معدل باشد</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>می‌توانید از فایل نمونه استفاده کنید</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>پس از آپلود، می‌توانید دانشجویان را به اساتید مشاور اختصاص دهید</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>رمز عبور پیش‌فرض برای دانشجویان: 123456</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Preview and Assignment Section */}
        {showPreview && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">پیش‌نمایش دانشجویان ({uploadedData.length})</h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleAutoAssign}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    اختصاص خودکار
                  </button>
                  <button
                    onClick={() => {
                      setShowPreview(false)
                      setUploadedData([])
                      setAssignments({})
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    انصراف
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">ردیف</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">شماره دانشجویی</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">نام و نام خانوادگی</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">رشته</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">ترم</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">معدل</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">استاد مشاور</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedData.map((student, index) => (
                      <tr key={student.tempId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{student.studentId}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{student.name} {student.family}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.field}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">{student.semester}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">{student.gpa}</td>
                        <td className="px-4 py-3">
                          <select
                            value={assignments[student.tempId] || ''}
                            onChange={(e) => handleAdvisorAssignment(student.tempId, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">انتخاب استاد</option>
                            {advisors.map(advisor => (
                              <option key={advisor.id} value={advisor.id}>
                                {advisor.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={processing || Object.keys(assignments).length === 0}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {processing ? 'در حال ثبت...' : `ثبت ${uploadedData.length} دانشجو`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentImport