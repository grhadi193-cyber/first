// Convert Gregorian date to Persian date (simple approximation)
export const getPersianDate = (gregorianDate) => {
  const year = gregorianDate.getFullYear()
  const month = gregorianDate.getMonth() + 1
  const day = gregorianDate.getDate()
  
  // Simple conversion (approximate)
  const persianYear = year - 621
  const persianMonth = month
  const persianDay = day
  
  return `${persianYear}/${String(persianMonth).padStart(2, '0')}/${String(persianDay).padStart(2, '0')}`
}

export const getDayOfWeek = (date) => {
  const days = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه']
  return days[date.getDay()]
}

export const getNextMonthDates = () => {
  const dates = []
  const today = new Date()
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    dates.push({
      gregorian: date,
      persian: getPersianDate(date),
      dayOfWeek: getDayOfWeek(date),
      dayNumber: date.getDate(),
      monthNumber: date.getMonth() + 1,
      isPast: i === 0
    })
  }
  
  return dates
}

export const formatPersianDate = (date) => {
  if (!date) return ''
  return date
}

export const getCurrentPersianDate = () => {
  return getPersianDate(new Date())
}

export const parsePersianDate = (dateString) => {
  if (!dateString) return null
  return dateString
}
