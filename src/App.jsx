import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import Login from './components/Shared/Login'
import AdvisorDashboard from './components/Advisor/AdvisorDashboard'
import StudentDashboard from './components/Student/StudentDashboard'
import StudentDetail from './components/Advisor/StudentDetail'
import AvailabilitySettings from './components/Advisor/AvailabilitySettings'
import AppointmentManagement from './components/Advisor/AppointmentManagement'
import PerformanceReport from './components/Advisor/PerformanceReport'
import Appointment from './components/Student/Appointment'
import SessionEntry from './components/Shared/SessionEntry'
import PrivateRoute from './components/Shared/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Advisor Routes */}
            <Route 
              path="/advisor/dashboard" 
              element={
                <PrivateRoute role="advisor">
                  <AdvisorDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/advisor/student/:studentId" 
              element={
                <PrivateRoute role="advisor">
                  <StudentDetail />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/advisor/availability" 
              element={
                <PrivateRoute role="advisor">
                  <AvailabilitySettings />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/advisor/appointments" 
              element={
                <PrivateRoute role="advisor">
                  <AppointmentManagement />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/advisor/report" 
              element={
                <PrivateRoute role="advisor">
                  <PerformanceReport />
                </PrivateRoute>
              } 
            />

            {/* Student Routes */}
            <Route 
              path="/student/dashboard" 
              element={
                <PrivateRoute role="student">
                  <StudentDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/student/appointment" 
              element={
                <PrivateRoute role="student">
                  <Appointment />
                </PrivateRoute>
              } 
            />

            {/* Shared Routes - Session Entry for both advisor and student */}
            <Route 
              path="/session-entry/:studentId" 
              element={
                <PrivateRoute>
                  <SessionEntry />
                </PrivateRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  )
}

export default App
