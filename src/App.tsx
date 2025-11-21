import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import ProtectedRoute from '@/components/ProtectedRoute'
import MainLayout from '@/layouts/MainLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import LeadsList from '@/pages/leads/LeadsList'
import AccountsList from '@/pages/accounts/AccountsList'
import ContactsList from '@/pages/contacts/ContactsList'
import OpportunitiesList from '@/pages/opportunities/OpportunitiesList'
import TasksList from '@/pages/tasks/TasksList'

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
        <Route path="accounts" element={<AccountsList />} />
        <Route path="contacts" element={<ContactsList />} />
        <Route path="opportunities" element={<OpportunitiesList />} />
        <Route path="tasks" element={<TasksList />} />
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
