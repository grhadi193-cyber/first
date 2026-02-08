import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import Navbar from '../Shared/Navbar'

const FaqQuestions = () => {
  const { faqQuestions, updateFaqAnswer } = useData()
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [answer, setAnswer] = useState('')

  const handleAnswerSubmit = (faqId) => {
    if (!answer.trim()) {
      alert('لطفاً پاسخ را وارد کنید')
      return
    }
    
    updateFaqAnswer(faqId, answer)
    alert('✅ پاسخ با موفقیت ثبت شد')
    setSelectedQuestion(null)
    setAnswer('')
  }

  const pendingQuestions = faqQuestions.filter(q => q.status === 'pending')
  const answeredQuestions = faqQuestions.filter(q => q.status === 'answered')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-primary mb-8">سوالات پرسالین</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h3 className="text-xl font-bold text-red-600 mb-4">
                سوالات بدون پاسخ ({pendingQuestions.length})
              </h3>
              
              {pendingQuestions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  همه سوالات پاسخ داده شده‌اند 🎉
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingQuestions.map(faq => (
                    <div 
                      key={faq.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedQuestion(faq)
                        setAnswer('')
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-800">
                          {faq.studentName} - {faq.studentNumber}
                        </h4>
                        <span className="text-sm text-gray-500">{faq.date}</span>
                      </div>
                      <p className="text-gray-700">{faq.question}</p>
                      <button className="text-primary text-sm mt-2 hover:underline">
                        پاسخ دادن ←
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-green-600 mb-4">
                سوالات پاسخ داده شده ({answeredQuestions.length})
              </h3>
              
              {answeredQuestions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  هنوز سوالی پاسخ داده نشده است
                </p>
              ) : (
                <div className="space-y-4">
                  {answeredQuestions.map(faq => (
                    <div 
                      key={faq.id} 
                      className="border border-gray-200 rounded-lg p-4 bg-green-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-800">
                          {faq.studentName} - {faq.studentNumber}
                        </h4>
                        <span className="text-sm text-gray-500">{faq.date}</span>
                      </div>
                      <p className="text-gray-700 mb-2">
                        <strong>سوال:</strong> {faq.question}
                      </p>
                      <p className="text-gray-700 bg-white p-3 rounded">
                        <strong>پاسخ:</strong> {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              {selectedQuestion ? (
                <>
                  <h3 className="text-xl font-bold text-primary mb-4">پاسخ به سوال</h3>
                  
                  <div className="mb-4 p-4 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600 mb-1">دانشجو:</p>
                    <p className="font-bold">{selectedQuestion.studentName}</p>
                    <p className="text-sm text-gray-600 mt-2 mb-1">سوال:</p>
                    <p className="text-gray-800">{selectedQuestion.question}</p>
                  </div>

                  <div className="mb-4">
                    <label className="label">پاسخ شما</label>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows="6"
                      className="input-field"
                      placeholder="پاسخ خود را اینجا بنویسید..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAnswerSubmit(selectedQuestion.id)}
                      className="btn-primary flex-1"
                    >
                      ثبت پاسخ
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedQuestion(null)
                        setAnswer('')
                      }}
                      className="btn-secondary"
                    >
                      انصراف
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>لطفاً یک سوال را برای پاسخ دادن انتخاب کنید</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FaqQuestions
