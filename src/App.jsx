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

// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard'
import UserManagement from './components/Admin/UserManagement'
import StudentImport from './components/Admin/StudentImport'
import AdvisorPerformance from './components/Admin/AdvisorPerformance'
import Reports from './components/Admin/Reports'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <PrivateRoute role="admin">
                  <UserManagement />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/import" 
              element={
                <PrivateRoute role="admin">
                  <StudentImport />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/advisor-performance" 
              element={
                <PrivateRoute role="admin">
                  <AdvisorPerformance />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/appointments" 
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/sessions" 
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <PrivateRoute role="admin">
                  <Reports />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/advisor/:advisorId" 
              element={
                <PrivateRoute role="admin">
                  <AdvisorPerformance />
                </PrivateRoute>
              } 
            />

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
