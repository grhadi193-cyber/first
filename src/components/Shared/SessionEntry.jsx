import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from './Navbar'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { SESSION_TOPICS, REFERRAL_OPTIONS } from '../../utils/mockData'

const SessionEntry = () => {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getStudentById, updateStudent } = useData()
  const student = getStudentById(studentId)

  const [totalSessions, setTotalSessions] = useState(0)
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    if (student) {
      setTotalSessions(student.totalSessions || 0)
      setSessions(student.sessions || [])
    }
  }, [student])

  useEffect(() => {
    const newSessions = Array.from({ length: totalSessions }, (_, i) => {
      if (sessions[i]) {
        return sessions[i]
      }
      return {
        sessionNumber: i + 1,
        date: '',
        topics: [],
        referrals: [] // Array of referral objects
      }
    })
    setSessions(newSessions)
  }, [totalSessions])

  const handleSessionDateChange = (index, date) => {
    const newSessions = [...sessions]
    newSessions[index] = {
      ...newSessions[index],
      date: date ? date.format('YYYY/MM/DD') : ''
    }
    setSessions(newSessions)
  }

  const handleSessionTopicToggle = (index, topic) => {
    const newSessions = [...sessions]
    const currentTopics = newSessions[index].topics || []
    
    if (currentTopics.includes(topic)) {
      // Remove topic
      newSessions[index].topics = currentTopics.filter(t => t !== topic)
      
      // If removing "ارجاع", clear all referrals
      if (topic === 'ارجاع') {
        newSessions[index].referrals = []
      }
    } else {
      // Add topic
      newSessions[index].topics = [...currentTopics, topic]
    }
    
    setSessions(newSessions)
  }

  const handleReferralToggle = (sessionIndex, referralType) => {
    const newSessions = [...sessions]
    const currentReferrals = newSessions[sessionIndex].referrals || []
    
    // Check if this referral type already exists
    const existingIndex = currentReferrals.findIndex(r => r.type === referralType)
    
    if (existingIndex !== -1) {
      // Remove this referral
      newSessions[sessionIndex].referrals = currentReferrals.filter((_, i) => i !== existingIndex)
    } else {
      // Add new referral with empty description
      newSessions[sessionIndex].referrals = [
        ...currentReferrals,
        {
          type: referralType,
          description: '',
          date: new Date().toLocaleDateString('fa-IR')
        }
      ]
    }
    
    setSessions(newSessions)
  }

  const handleReferralDescriptionChange = (sessionIndex, referralType, description) => {
    const newSessions = [...sessions]
    const referrals = newSessions[sessionIndex].referrals || []
    
    const referralIndex = referrals.findIndex(r => r.type === referralType)
    if (referralIndex !== -1) {
      newSessions[sessionIndex].referrals[referralIndex] = {
        ...referrals[referralIndex],
        description
      }
      setSessions(newSessions)
    }
  }

  const getReferralByType = (sessionIndex, referralType) => {
    const referrals = sessions[sessionIndex]?.referrals || []
    return referrals.find(r => r.type === referralType)
  }

  const isReferralSelected = (sessionIndex, referralType) => {
    const referrals = sessions[sessionIndex]?.referrals || []
    return referrals.some(r => r.type === referralType)
  }

  const handleSave = () => {
    // Validate referrals have descriptions
    for (let i = 0; i < totalSessions; i++) {
      const session = sessions[i]
      if (session.topics?.includes('ارجاع')) {
        if (!session.referrals || session.referrals.length === 0) {
          alert(`❌ در جلسه ${i + 1} گزینه ارجاع انتخاب شده، اما نوع ارجاع مشخص نشده است.`)
          return
        }
        
        // Check if all referrals have descriptions
        for (const referral of session.referrals) {
          if (!referral.description || referral.description.trim() === '') {
            alert(`❌ در جلسه ${i + 1}، لطفاً دلیل ارجاع به "${referral.type}" را وارد کنید.`)
            return
          }
        }
      }
    }

    updateStudent(studentId, {
      totalSessions: parseInt(totalSessions),
      sessions: sessions.slice(0, totalSessions)
    })

    // Generate detailed referral message
    let referralMessages = []
    sessions.slice(0, totalSessions).forEach((session, index) => {
      if (session.referrals && session.referrals.length > 0) {
        session.referrals.forEach(referral => {
          referralMessages.push(`
📋 جلسه ${index + 1} - ${session.date}
🎯 ارجاع به: ${referral.type}
📝 دلیل: ${referral.description}
          `)
        })
      }
    })

    const message = `📝 ثبت اطلاعات جلسه توسط ${user.role === 'student' ? 'دانشجو' : 'استاد'}

${user.role === 'student' ? '👨‍🎓' : '👨‍🏫'} ثبت‌کننده: ${user.firstName} ${user.lastName}
👨‍🎓 دانشجو: ${student.firstName} ${student.lastName}
📚 شماره دانشجویی: ${student.studentNumber}
📊 تعداد جلسات: ${totalSessions}

${referralMessages.length > 0 ? '🔔 ارجاع‌های ثبت شده:\n' + referralMessages.join('\n---\n') : ''}

${user.role === 'student' ? '⏳ منتظر تایید استاد مشاور' : '✅ ثبت شد'}`

    alert('✅ اطلاعات با موفقیت ثبت شد')
    
    if (referralMessages.length > 0) {
      alert('📱 پیامک ارجاع به واحدهای مربوطه در بله ارسال می‌شود:\n\n' + message)
    }
    
    if (user.role === 'student') {
      alert('📱 پیامک به استاد برای تایید ارسال می‌شود:\n\n' + message)
    }
    
    navigate(user.role === 'advisor' ? '/advisor/dashboard' : '/student/dashboard')
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 to-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="card text-center">
            <p className="text-red-600">دانشجو یافت نشد</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => navigate(user.role === 'advisor' ? '/advisor/dashboard' : '/student/dashboard')}
            className="btn-secondary mb-6"
          >
            ← بازگشت به داشبورد
          </button>

          <div className="card-navy mb-6">
            <h2 className="text-3xl font-bold mb-2">📝 ثبت اطلاعات جلسه مشاوره</h2>
            <p className="opacity-90">صفحه مشترک برای ثبت اطلاعات جلسات</p>
          </div>

          <div className="card mb-6">
            <h3 className="text-xl font-bold text-navy-800 mb-4">👨‍🎓 اطلاعات دانشجو</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-navy-50 p-4 rounded-xl">
                <label className="text-sm text-navy-600 font-semibold">نام و نام خانوادگی</label>
                <p className="text-lg font-bold text-navy-900">{student.firstName} {student.lastName}</p>
              </div>
              <div className="bg-navy-50 p-4 rounded-xl">
                <label className="text-sm text-navy-600 font-semibold">شماره دانشجویی</label>
                <p className="text-lg font-bold text-navy-900">{student.studentNumber}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-2xl font-bold text-navy-800 mb-6">📚 ثبت و مدیریت جلسات</h3>
            
            <div className="mb-6">
              <label className="label">تعداد جلسات برگزار شده</label>
              <input 
                type="number"
                min="0"
                max="20"
                value={totalSessions}
                onChange={(e) => setTotalSessions(Math.max(0, parseInt(e.target.value) || 0))}
                className="input-field max-w-xs"
              />
            </div>

            {totalSessions > 0 && (
              <div className="space-y-6">
                {sessions.slice(0, totalSessions).map((session, index) => (
                  <div key={index} className="border-2 border-navy-200 rounded-2xl p-6 bg-navy-50">
                    <h3 className="font-bold text-xl mb-4 text-navy-800 flex items-center gap-3">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy-700 text-white text-lg">
                        {index + 1}
                      </span>
                      <span>جلسه {index + 1}</span>
                    </h3>
                    
                    {/* Date Picker */}
                    <div className="mb-5">
                      <label className="label">📅 تاریخ جلسه</label>
                      <DatePicker
                        value={session.date}
                        onChange={(date) => handleSessionDateChange(index, date)}
                        calendar={persian}
                        locale={persian_fa}
                        format="YYYY/MM/DD"
                        placeholder="انتخاب تاریخ"
                        containerClassName="w-full"
                        inputClass="input-field w-full"
                      />
                    </div>
                    
                    {/* Session Topics */}
                    <div className="mb-5">
                      <label className="label">📝 موضوعات جلسه (چند انتخابی)</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SESSION_TOPICS.map(topic => {
                          const isSelected = session.topics?.includes(topic)
                          const isReferral = topic === 'ارجاع'
                          
                          return (
                            <label 
                              key={topic} 
                              className={`flex items-center space-x-2 space-x-reverse p-4 border-2 rounded-xl cursor-pointer transition ${
                                isSelected
                                  ? isReferral
                                    ? 'border-amber-600 bg-amber-100 shadow-md'
                                    : 'border-navy-600 bg-navy-100 shadow-md'
                                  : 'border-gray-300 hover:border-navy-400 bg-white'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSessionTopicToggle(index, topic)}
                                className="w-5 h-5 text-navy-600 rounded focus:ring-2 focus:ring-navy-500"
                              />
                              <span className={`text-sm font-bold ${isSelected ? 'text-navy-900' : 'text-gray-700'}`}>
                                {isReferral && '🔔 '}{topic}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    {/* Referral Section */}
                    {session.topics?.includes('ارجاع') && (
                      <div className="mt-6 p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-3 mb-5">
                          <span className="text-4xl">🔔</span>
                          <div>
                            <h4 className="font-black text-xl text-amber-900">ارجاع دانشجو</h4>
                            <p className="text-sm text-amber-700">حداقل یک مورد ارجاع را انتخاب و دلیل را وارد کنید</p>
                          </div>
                        </div>

                        {/* Referral Options Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                          {REFERRAL_OPTIONS.map(option => {
                            const isSelected = isReferralSelected(index, option)
                            const icons = {
                              'مشاوره': '🧠',
                              'مسئول مشاور': '👔',
                              'آموزش': '📚',
                              'مدیر گروه': '👨‍💼'
                            }
                            
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => handleReferralToggle(index, option)}
                                className={`p-4 rounded-xl border-2 transition font-bold text-center ${
                                  isSelected
                                    ? 'border-amber-700 bg-amber-200 text-amber-900 shadow-md scale-105'
                                    : 'border-amber-400 bg-white hover:border-amber-600 hover:bg-amber-50 text-amber-800'
                                }`}
                              >
                                <div className="text-3xl mb-2">{icons[option]}</div>
                                <div className="text-sm leading-tight">{option}</div>
                                {isSelected && (
                                  <div className="mt-2">
                                    <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                      ✓ انتخاب شده
                                    </span>
                                  </div>
                                )}
                              </button>
                            )
                          })}
                        </div>

                        {/* Referral Descriptions */}
                        {session.referrals && session.referrals.length > 0 && (
                          <div className="space-y-4">
                            <div className="border-t-2 border-amber-200 pt-4">
                              <h5 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                                <span className="text-xl">📋</span>
                                <span>توضیحات ارجاع‌ها</span>
                              </h5>
                              
                              {session.referrals.map((referral, refIndex) => {
                                const icons = {
                                  'مشاوره': '🧠',
                                  'مسئول مشاور': '👔',
                                  'آموزش': '📚',
                                  'مدیر گروه': '👨‍💼'
                                }
                                
                                return (
                                  <div key={refIndex} className="mb-4 last:mb-0">
                                    <label className="block mb-2">
                                      <span className="flex items-center gap-2 font-bold text-amber-900">
                                        <span className="text-2xl">{icons[referral.type]}</span>
                                        <span>دلیل ارجاع به {referral.type}:</span>
                                        <span className="text-red-600">*</span>
                                      </span>
                                    </label>
                                    <textarea
                                      value={referral.description}
                                      onChange={(e) => handleReferralDescriptionChange(index, referral.type, e.target.value)}
                                      rows="3"
                                      className="input-field w-full resize-none"
                                      placeholder={`چرا دانشجو به ${referral.type} ارجاع داده می‌شود؟ (اجباری)`}
                                      required
                                    />
                                    {referral.description && referral.description.trim() !== '' && (
                                      <div className="mt-2 flex items-center gap-2 text-green-700 text-sm">
                                        <span>✓</span>
                                        <span className="font-semibold">دلیل ثبت شد</span>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Warning if no referral selected */}
                        {(!session.referrals || session.referrals.length === 0) && (
                          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                              <p className="font-bold text-red-900">هشدار!</p>
                              <p className="text-sm text-red-800">گزینه "ارجاع" انتخاب شده اما هیچ واحدی برای ارجاع مشخص نشده است.</p>
                              <p className="text-sm text-red-800 mt-1">لطفاً حداقل یک مورد از بالا را انتخاب کنید.</p>
                            </div>
                          </div>
                        )}

                        {/* Info Box */}
                        <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">💡</span>
                            <div className="text-sm text-blue-900">
                              <p className="font-bold mb-1">نکته مهم:</p>
                              <ul className="list-disc list-inside space-y-1 text-blue-800">
                                <li>می‌توانید چند ارجاع همزمان انتخاب کنید</li>
                                <li>برای هر ارجاع باید دلیل مشخصی وارد کنید</li>
                                <li>پیامک ارجاع به واحدهای مربوطه ارسال می‌شود</li>
                                <li>دانشجو از ارجاع مطلع خواهد شد</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <button onClick={handleSave} className="btn-primary flex-1 py-4 text-lg">
                💾 ذخیره اطلاعات
              </button>
              <button 
                onClick={() => navigate(user.role === 'advisor' ? '/advisor/dashboard' : '/student/dashboard')}
                className="btn-secondary py-4"
              >
                انصراف
              </button>
            </div>
          </div>

          {/* Info Box */}
          {user.role === 'student' && (
            <div className="card mt-6 bg-blue-50 border-2 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">ℹ️</div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-3 text-lg">نکته مهم:</h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>بعد از ذخیره اطلاعات، پیامکی به استاد مشاور شما ارسال می‌شود تا اطلاعات را بررسی و تایید کند.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>در صورت انتخاب گزینه "ارجاع"، پیامک به واحدهای مربوطه نیز ارسال خواهد شد.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Advisor Info */}
          {user.role === 'advisor' && sessions.some(s => s.referrals?.length > 0) && (
            <div className="card mt-6 bg-amber-50 border-2 border-amber-300">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🔔</div>
                <div className="flex-1">
                  <h4 className="font-bold text-amber-900 mb-3 text-lg">اطلاعیه ارجاع:</h4>
                  <p className="text-sm text-amber-800 mb-3">
                    شما برای این دانشجو ارجاع ثبت کرده‌اید. پس از ذخیره، پیامک‌های زیر ارسال می‌شود:
                  </p>
                  <ul className="text-sm text-amber-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <span>📱</span>
                      <span>به واحدهای مربوطه (مشاوره، آموزش، ...)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>📱</span>
                      <span>به دانشجو برای اطلاع از ارجاع</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>📱</span>
                      <span>به مسئول اساتید مشاور برای پیگیری</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SessionEntry
