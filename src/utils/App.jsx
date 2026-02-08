import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import Login from './components/Shared/Login'
import AdvisorDashboard from './components/Advisor/AdvisorDashboard'
import StudentDetail from './components/Advisor/StudentDetail'
import PerformanceReport from './components/Advisor/PerformanceReport'
import Evaluation from './components/Advisor/Evaluation'
import FaqQuestions from './components/Advisor/FaqQuestions'
import StudentDashboard from './components/Student/StudentDashboard'
import Appointment from './components/Student/Appointment'

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/" replace />
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Advisor Routes */}
            <Route 
              path="/advisor/dashboard" 
              element={
                <ProtectedRoute allowedRole="advisor">
                  <AdvisorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/advisor/student/:studentId" 
              element={
                <ProtectedRoute allowedRole="advisor">
                  <StudentDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/advisor/report" 
              element={
                <ProtectedRoute allowedRole="advisor">
                  <PerformanceReport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/advisor/evaluation" 
              element={
                <ProtectedRoute allowedRole="advisor">
                  <Evaluation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/advisor/faq" 
              element={
                <ProtectedRoute allowedRole="advisor">
                  <FaqQuestions />
                </ProtectedRoute>
              } 
            />
            
            {/* Student Routes */}
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/appointment" 
              element={
                <ProtectedRoute allowedRole="student">
                  <Appointment />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
