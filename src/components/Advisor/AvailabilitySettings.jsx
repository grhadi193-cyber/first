import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../Shared/Navbar'
import { WEEKDAYS, TIME_SLOTS } from '../../utils/mockData'

const AvailabilitySettings = () => {
  const { user, updateUserAvailability } = useAuth()
  const [availability, setAvailability] = useState({})
  const [removedSlots, setRemovedSlots] = useState({})

  useEffect(() => {
    if (user?.availability) {
      setAvailability(user.availability)
    }
  }, [user])

  const toggleTimeSlot = (day, time) => {
    const daySlots = availability[day] || []
    
    if (daySlots.includes(time)) {
      // Remove from availability
      setAvailability({
        ...availability,
        [day]: daySlots.filter(t => t !== time)
      })
      // Add to removed slots
      setRemovedSlots({
        ...removedSlots,
        [day]: [...(removedSlots[day] || []), time]
      })
    } else {
      // Add to availability
      setAvailability({
        ...availability,
        [day]: [...daySlots, time].sort()
      })
      // Remove from removed slots
      if (removedSlots[day]) {
        setRemovedSlots({
          ...removedSlots,
          [day]: removedSlots[day].filter(t => t !== time)
        })
      }
    }
  }

  const handleSave = () => {
    updateUserAvailability(availability)
    alert('✅ ساعات حضور شما با موفقیت ذخیره شد')
  }

  const getSlotStatus = (day, time) => {
    const isAvailable = availability[day]?.includes(time)
    const isRemoved = removedSlots[day]?.includes(time)
    
    if (isAvailable) return 'available'
    if (isRemoved) return 'removed'
    return 'not-selected'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-black text-navy-800 mb-2">⏰ تنظیم ساعات حضور</h2>
          <p className="text-gray-600 text-lg">مدیریت برنامه زمانی خود برای جلسات مشاوره</p>
        </div>

        <div className="card mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">💡</div>
            <div className="flex-1">
              <h3 className="font-bold text-navy-800 mb-2">راهنما:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-navy-700 rounded"></div>
                  <span className="text-sm">انتخاب شده (در دسترس)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-500 rounded"></div>
                  <span className="text-sm">حذف شده</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
                  <span className="text-sm">انتخاب نشده</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {WEEKDAYS.map(day => {
            const selectedCount = availability[day]?.length || 0
            const removedCount = removedSlots[day]?.length || 0
            
            return (
              <div key={day} className="card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-navy-800">{day}</h3>
                  <div className="flex gap-3">
                    {selectedCount > 0 && (
                      <span className="badge badge-navy text-sm">
                        {selectedCount} ساعت انتخاب شده
                      </span>
                    )}
                    {removedCount > 0 && (
                      <span className="badge badge-danger text-sm">
                        {removedCount} ساعت حذف شده
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {TIME_SLOTS.map(time => {
                    const status = getSlotStatus(day, time)
                    
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => toggleTimeSlot(day, time)}
                        className={`p-3 rounded-lg border-2 transition font-semibold ${
                          status === 'available'
                            ? 'border-navy-700 bg-navy-700 text-white shadow-md'
                            : status === 'removed'
                            ? 'border-red-500 bg-red-100 text-red-700 line-through'
                            : 'border-gray-300 hover:border-navy-500 hover:bg-navy-50'
                        }`}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>

                {availability[day]?.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>ساعات در دسترس:</strong> {availability[day].join(', ')}
                    </p>
                  </div>
                )}

                {removedSlots[day]?.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800">
                      <strong>ساعات حذف شده:</strong> {removedSlots[day].join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex gap-4">
          <button onClick={handleSave} className="btn-primary">
            💾 ذخیره ساعات حضور
          </button>
        </div>
      </div>
    </div>
  )
}

export default AvailabilitySettings
