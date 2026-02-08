export const SESSION_TOPICS = [
  'جلسه بررسی افت تحصیلی',
  'جلسه بررسی مشروطی',
  'جلسه مشورت آموزشی',
  'جلسه مشورت پژوهشی',
  'جلسه اعلام وضعیت روانی و خانوادگی',
  'جلسه مشورت امور مالی و معرفی به واحد‌های مربوطه',
  'جلسه مشورت شغلی',
  'جلسه سوال متفرقه',
  'ارجاع'
]

export const REFERRAL_OPTIONS = [
  'مشاوره',
  'مسئول مشاور',
  'آموزش',
  'مدیر گروه'
]

export const REJECTION_REASONS = [
  'وقت ندارم',
  'گروه دارم',
  'سایر (تشریح دلیل)'
]

export const APPOINTMENT_TYPES = [
  { value: 'individual-in-person', label: 'فردی - حضوری' },
  { value: 'individual-virtual', label: 'فردی - مجازی' },
  { value: 'individual-phone', label: 'فردی - تلفنی' },
  { value: 'group', label: 'گروهی' }
]

export const SEMESTERS = [
  '1404-1',
  '1403-2',
  '1403-1',
  '1402-2'
]

export const WEEKDAYS = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنجشنبه',
  'جمعه'
]

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
]

export const mockAdvisors = [
  {
    id: 'adv1',
    firstName: 'محمد',
    lastName: 'احمدی',
    username: 'advisor1',
    password: '123456',
    role: 'advisor',
    availability: {
      'شنبه': ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'],
      'یکشنبه': ['08:00', '08:30', '09:00', '09:30', '10:00'],
      'دوشنبه': ['14:00', '14:30', '15:00', '15:30', '16:00'],
      'سه‌شنبه': ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'],
      'چهارشنبه': ['14:00', '14:30', '15:00']
    }
  },
  {
    id: 'adv2',
    firstName: 'فاطمه',
    lastName: 'محمدی',
    username: 'advisor2',
    password: '123456',
    role: 'advisor',
    availability: {
      'شنبه': ['09:00', '09:30', '10:00', '10:30', '11:00'],
      'دوشنبه': ['14:00', '14:30', '15:00'],
      'چهارشنبه': ['09:00', '09:30', '10:00', '10:30', '11:00']
    }
  }
]

export const mockStudents = [
  {
    id: 'std1',
    firstName: 'علی',
    lastName: 'رضایی',
    studentNumber: '9912345',
    gpa: 17.5,
    phoneNumber: '09121234567',
    advisorId: 'adv1',
    advisorName: 'محمد احمدی',
    username: 'student1',
    password: '123456',
    role: 'student',
    semester: '1404-1',
    totalSessions: 3,
    sessions: [
      {
        sessionNumber: 1,
        date: '1404/10/15',
        topics: ['جلسه مشورت آموزشی', 'جلسه مشورت پژوهشی']
      },
      {
        sessionNumber: 2,
        date: '1404/10/22',
        topics: ['جلسه بررسی افت تحصیلی', 'ارجاع'],
        referrals: [
          {
            type: 'مشاوره',
            description: 'دانشجو دچار استرس شدید امتحانات است و نیاز به مشاوره روانشناسی دارد',
            date: '1404/10/22'
          }
        ]
      },
      {
        sessionNumber: 3,
        date: '1404/10/28',
        topics: ['جلسه مشورت شغلی']
      }
    ]
  },
  {
    id: 'std2',
    firstName: 'زهرا',
    lastName: 'کریمی',
    studentNumber: '9912346',
    gpa: 16.8,
    phoneNumber: '09121234568',
    advisorId: 'adv1',
    advisorName: 'محمد احمدی',
    username: 'student2',
    password: '123456',
    role: 'student',
    semester: '1404-1',
    totalSessions: 2,
    sessions: [
      {
        sessionNumber: 1,
        date: '1404/10/10',
        topics: ['جلسه بررسی افت تحصیلی']
      },
      {
        sessionNumber: 2,
        date: '1404/10/20',
        topics: ['جلسه اعلام وضعیت روانی و خانوادگی', 'ارجاع'],
        referrals: [
          {
            type: 'مشاوره',
            description: 'مشکلات خانوادگی باعث افت تحصیلی شده است',
            date: '1404/10/20'
          },
          {
            type: 'مسئول مشاور',
            description: 'نیاز به پیگیری ویژه و تغییر برنامه درسی دارد',
            date: '1404/10/20'
          }
        ]
      }
    ]
  },
  {
    id: 'std3',
    firstName: 'حسین',
    lastName: 'نوری',
    studentNumber: '9912347',
    gpa: 18.2,
    phoneNumber: '09121234569',
    advisorId: 'adv1',
    advisorName: 'محمد احمدی',
    username: 'student3',
    password: '123456',
    role: 'student',
    semester: '1404-1',
    totalSessions: 5,
    sessions: [
      {
        sessionNumber: 1,
        date: '1404/09/25',
        topics: ['جلسه مشورت آموزشی']
      },
      {
        sessionNumber: 2,
        date: '1404/10/05',
        topics: ['جلسه مشورت پژوهشی']
      },
      {
        sessionNumber: 3,
        date: '1404/10/15',
        topics: ['جلسه مشورت امور مالی و معرفی به واحد‌های مربوطه', 'ارجاع'],
        referrals: [
          {
            type: 'آموزش',
            description: 'درخواست تقسیط شهریه به دلیل مشکلات مالی',
            date: '1404/10/15'
          }
        ]
      },
      {
        sessionNumber: 4,
        date: '1404/10/25',
        topics: ['جلسه سوال متفرقه']
      },
      {
        sessionNumber: 5,
        date: '1404/11/05',
        topics: ['جلسه مشورت شغلی']
      }
    ]
  },
  {
    id: 'std4',
    firstName: 'مریم',
    lastName: 'حسینی',
    studentNumber: '9912348',
    gpa: 13.5,
    phoneNumber: '09121234570',
    advisorId: 'adv1',
    advisorName: 'محمد احمدی',
    username: 'student4',
    password: '123456',
    role: 'student',
    semester: '1404-1',
    totalSessions: 0,
    sessions: []
  },
  {
    id: 'std5',
    firstName: 'رضا',
    lastName: 'کاظمی',
    studentNumber: '9912349',
    gpa: 11.8,
    phoneNumber: '09121234571',
    advisorId: 'adv1',
    advisorName: 'محمد احمدی',
    username: 'student5',
    password: '123456',
    role: 'student',
    semester: '1404-1',
    totalSessions: 1,
    sessions: [
      {
        sessionNumber: 1,
        date: '1404/11/01',
        topics: ['جلسه بررسی مشروطی', 'جلسه بررسی افت تحصیلی', 'ارجاع'],
        referrals: [
          {
            type: 'مدیر گروه',
            description: 'دانشجو مشروطی است و نیاز به بررسی وضعیت تحصیلی توسط مدیر گروه دارد',
            date: '1404/11/01'
          },
          {
            type: 'آموزش',
            description: 'بررسی امکان حذف و اضافه برای کاهش واحدها',
            date: '1404/11/01'
          },
          {
            type: 'مشاوره',
            description: 'نیاز به جلسات مشاوره برای بهبود عملکرد تحصیلی',
            date: '1404/11/01'
          }
        ]
      }
    ]
  }
]

export const mockAppointments = []
