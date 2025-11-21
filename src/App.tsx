import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import ProtectedRoute from '@/components/ProtectedRoute'
import MainLayout from '@/layouts/MainLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import LeadsList from '@/pages/leads/LeadsList'

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<LeadsList />} />
        <Route path="accounts" element={<div className="text-2xl">Accounts - Coming Soon</div>} />
        <Route path="contacts" element={<div className="text-2xl">Contacts - Coming Soon</div>} />
        <Route path="opportunities" element={<div className="text-2xl">Opportunities - Coming Soon</div>} />
        <Route path="tasks" element={<div className="text-2xl">Tasks - Coming Soon</div>} />
        <Route path="events" element={<div className="text-2xl">Events - Coming Soon</div>} />
        <Route path="cases" element={<div className="text-2xl">Cases - Coming Soon</div>} />
        <Route path="teams" element={<div className="text-2xl">Teams - Coming Soon</div>} />
        <Route path="documents" element={<div className="text-2xl">Documents - Coming Soon</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
