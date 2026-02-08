import React, { createContext, useContext, useState, useEffect } from 'react'
import { mockAdvisors, mockStudents } from '../utils/mockData'

const AuthContext = createContext(null)

// Default admin credentials
const defaultAdmin = {
  id: 'admin_1',
  username: 'admin',
  password: 'admin123',
  name: 'مدیر سیستم',
  role: 'admin',
  email: 'admin@university.edu',
  phone: '021-12345678'
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (username, password, role) => {
    let foundUser = null

    // Check admin credentials
    if (role === 'admin') {
      if (username === defaultAdmin.username && password === defaultAdmin.password) {
        foundUser = defaultAdmin
      }
    }
    // Check advisor credentials
    else if (role === 'advisor') {
      foundUser = mockAdvisors.find(
        adv => adv.username === username && adv.password === password
      )
      
      // Load saved availability if exists
      if (foundUser) {
        const savedAvailability = localStorage.getItem(`availability_${foundUser.id}`)
        if (savedAvailability) {
          foundUser.availability = JSON.parse(savedAvailability)
        }
      }
    }
    // Check student credentials
    else {
      foundUser = mockStudents.find(
        std => std.username === username && std.password === password
      )
    }

    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem('currentUser', JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const updateUserAvailability = (availability) => {
    if (user && user.role === 'advisor') {
      const updatedUser = { ...user, availability }
      setUser(updatedUser)
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      localStorage.setItem(`availability_${user.id}`, JSON.stringify(availability))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserAvailability }}>
      {children}
    </AuthContext.Provider>
  )
}
