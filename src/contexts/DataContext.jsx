import React, { createContext, useContext, useState, useEffect } from 'react'
import { mockStudents, mockAppointments, mockAdvisors, mockSessions, SEMESTERS } from '../utils/mockData'

const DataContext = createContext(null)

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState([])
  const [advisors, setAdvisors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    // Load students
    const savedStudents = localStorage.getItem('students')
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents))
    } else {
      setStudents(mockStudents)
      localStorage.setItem('students', JSON.stringify(mockStudents))
    }

    // Load advisors
    const savedAdvisors = localStorage.getItem('advisors')
    if (savedAdvisors) {
      setAdvisors(JSON.parse(savedAdvisors))
    } else {
      setAdvisors(mockAdvisors)
      localStorage.setItem('advisors', JSON.stringify(mockAdvisors))
    }

    // Load appointments
    const savedAppointments = localStorage.getItem('appointments')
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    } else {
      setAppointments(mockAppointments)
      localStorage.setItem('appointments', JSON.stringify(mockAppointments))
    }

    // Load sessions
    const savedSessions = localStorage.getItem('sessions')
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions))
    } else {
      setSessions(mockSessions || [])
      localStorage.setItem('sessions', JSON.stringify(mockSessions || []))
    }
  }, [])

  // Student Management
  const updateStudent = (updatedStudent) => {
    const updatedStudents = students.map(std =>
      std.id === updatedStudent.id ? updatedStudent : std
    )
    setStudents(updatedStudents)
    localStorage.setItem('students', JSON.stringify(updatedStudents))
  }

  const addStudents = (newStudents) => {
    const studentsWithIds = newStudents.map((s, i) => ({
      ...s,
      id: s.id || `std_${Date.now()}_${i}`
    }))
    const updatedStudents = [...students, ...studentsWithIds]
    setStudents(updatedStudents)
    localStorage.setItem('students', JSON.stringify(updatedStudents))
  }

  const deleteStudent = (studentId) => {
    const updatedStudents = students.filter(s => s.id !== studentId)
    setStudents(updatedStudents)
    localStorage.setItem('students', JSON.stringify(updatedStudents))
  }

  // Advisor Management
  const updateAdvisor = (updatedAdvisor) => {
    const updatedAdvisors = advisors.map(adv =>
      adv.id === updatedAdvisor.id ? updatedAdvisor : adv
    )
    setAdvisors(updatedAdvisors)
    localStorage.setItem('advisors', JSON.stringify(updatedAdvisors))
  }

  const addAdvisor = (newAdvisor) => {
    const advisor = {
      ...newAdvisor,
      id: newAdvisor.id || `adv_${Date.now()}`
    }
    const updatedAdvisors = [...advisors, advisor]
    setAdvisors(updatedAdvisors)
    localStorage.setItem('advisors', JSON.stringify(updatedAdvisors))
  }

  const deleteAdvisor = (advisorId) => {
    const updatedAdvisors = advisors.filter(a => a.id !== advisorId)
    setAdvisors(updatedAdvisors)
    localStorage.setItem('advisors', JSON.stringify(updatedAdvisors))
  }

  // Appointment Management
  const addAppointment = (appointment) => {
    const newAppointment = {
      ...appointment,
      id: `apt${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    const updatedAppointments = [...appointments, newAppointment]
    setAppointments(updatedAppointments)
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments))
    return newAppointment
  }

  const updateAppointmentStatus = (appointmentId, status, rejectionReason = null) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { 
        ...apt, 
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : apt.rejectionReason,
        updatedAt: new Date().toISOString()
      } : apt
    )
    setAppointments(updatedAppointments)
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments))
  }

  const updateAppointment = (appointmentId, updates) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { 
        ...apt, 
        ...updates,
        isEdited: true,
        editedAt: new Date().toISOString()
      } : apt
    )
    setAppointments(updatedAppointments)
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments))
  }

  // Session Management
  const addSession = (session) => {
    const newSession = {
      ...session,
      id: `ses_${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    const updatedSessions = [...sessions, newSession]
    setSessions(updatedSessions)
    localStorage.setItem('sessions', JSON.stringify(updatedSessions))
    return newSession
  }

  const updateSession = (sessionId, updates) => {
    const updatedSessions = sessions.map(ses =>
      ses.id === sessionId ? { ...ses, ...updates } : ses
    )
    setSessions(updatedSessions)
    localStorage.setItem('sessions', JSON.stringify(updatedSessions))
  }

  // Getters
  const getStudentById = (studentId) => {
    return students.find(std => std.id === studentId)
  }

  const getStudentsByAdvisor = (advisorId, semester = null) => {
    return students.filter(std => 
      std.advisorId === advisorId && 
      (semester ? std.semester === semester : true)
    )
  }

  const getAppointmentsByAdvisor = (advisorId) => {
    return appointments.filter(apt => apt.advisorId === advisorId)
  }

  const getAppointmentsByStudent = (studentId) => {
    return appointments.filter(apt => apt.studentId === studentId)
  }

  return (
    <DataContext.Provider value={{
      students,
      advisors,
      appointments,
      sessions,
      updateStudent,
      addStudents,
      deleteStudent,
      updateAdvisor,
      addAdvisor,
      deleteAdvisor,
      addAppointment,
      updateAppointmentStatus,
      updateAppointment,
      addSession,
      updateSession,
      getStudentById,
      getStudentsByAdvisor,
      getAppointmentsByAdvisor,
      getAppointmentsByStudent,
      semesters: SEMESTERS
    }}>
      {children}
    </DataContext.Provider>
  )
}
