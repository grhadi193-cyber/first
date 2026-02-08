import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth()

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/" replace />
  }

  // If a specific role is required and user doesn't have it, redirect to their dashboard
  if (role && user.role !== role) {
    const dashboardPath = user.role === 'advisor' ? '/advisor/dashboard' : '/student/dashboard'
    return <Navigate to={dashboardPath} replace />
  }

  // User is authorized, render the children
  return children
}

export default PrivateRoute
