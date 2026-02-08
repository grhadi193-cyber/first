import React, { createContext, useContext, useState, useEffect } from 'react'
import { mockStudents, mockAppointments, SEMESTERS } from '../utils/mockData'

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
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    const savedStudents = localStorage.getItem('students')
    const savedAppointments = localStorage.getItem('appointments')

    if (savedStudents) {
      setStudents(JSON.parse(savedStudents))
    } else {
      setStudents(mockStudents)
      localStorage.setItem('students', JSON.stringify(mockStudents))
    }

    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    } else {
      setAppointments(mockAppointments)
      localStorage.setItem('appointments', JSON.stringify(mockAppointments))
    }
  }, [])

  const updateStudent = (studentId, updatedData) => {
    const updatedStudents = students.map(std =>
      std.id === studentId ? { ...std, ...updatedData } : std
    )
    setStudents(updatedStudents)
    localStorage.setItem('students', JSON.stringify(updatedStudents))
  }

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
      appointments,
      updateStudent,
      addAppointment,
      updateAppointmentStatus,
      updateAppointment,
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
