import React, { useState } from 'react'
import Navbar from '../Shared/Navbar'

const Evaluation = () => {
  const [formData, setFormData] = useState({
    satisfaction: '5',
    communication: '5',
    availability: '5',
    helpfulness: '5',
    comments: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('✅ فرم ارزشیابی با موفقیت ثبت شد (Mock)')
    console.log('Evaluation submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8">ارزشیابی استاد مشاور</h2>

          <div className="card">
            <p className="text-gray-600 mb-6">
              این فرم برای ارزشیابی عملکرد استاد مشاور توسط دانشجویان است. (نمایش Mock)
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label">میزان رضایت کلی</label>
                <select 
                  name="satisfaction"
                  value={formData.satisfaction}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="5">عالی (5)</option>
                  <option value="4">خوب (4)</option>
                  <option value="3">متوسط (3)</option>
                  <option value="2">ضعیف (2)</option>
                  <option value="1">خیلی ضعیف (1)</option>
                </select>
              </div>

              <div>
                <label className="label">کیفیت ارتباط و گفتگو</label>
                <select 
                  name="communication"
                  value={formData.communication}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="5">عالی (5)</option>
                  <option value="4">خوب (4)</option>
                  <option value="3">متوسط (3)</option>
                  <option value="2">ضعیف (2)</option>
                  <option value="1">خیلی ضعیف (1)</option>
                </select>
              </div>

              <div>
                <label className="label">در دسترس بودن استاد</label>
                <select 
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="5">عالی (5)</option>
                  <option value="4">خوب (4)</option>
                  <option value="3">متوسط (3)</option>
                  <option value="2">ضعیف (2)</option>
                  <option value="1">خیلی ضعیف (1)</option>
                </select>
              </div>

              <div>
                <label className="label">میزان کمک و راهنمایی</label>
                <select 
                  name="helpfulness"
                  value={formData.helpfulness}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="5">عالی (5)</option>
                  <option value="4">خوب (4)</option>
                  <option value="3">متوسط (3)</option>
                  <option value="2">ضعیف (2)</option>
                  <option value="1">خیلی ضعیف (1)</option>
                </select>
              </div>

              <div>
                <label className="label">نظرات و پیشنهادات</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows="5"
                  className="input-field"
                  placeholder="لطفاً نظرات و پیشنهادات خود را بنویسید..."
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  ثبت ارزشیابی
                </button>
                <button type="button" className="btn-secondary">
                  انصراف
                </button>
              </div>
            </form>
          </div>

          <div className="card mt-6 bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ℹ️ این فرم در حالت Mock است و اطلاعات ثبت شده فقط در Console نمایش داده می‌شود.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Evaluation
