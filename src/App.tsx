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
import EventsList from '@/pages/events/EventsList'
import CasesList from '@/pages/cases/CasesList'
import TeamsList from '@/pages/teams/TeamsList'
import DocumentsList from '@/pages/documents/DocumentsList'

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
        <Route path="events" element={<EventsList />} />
        <Route path="cases" element={<CasesList />} />
        <Route path="teams" element={<TeamsList />} />
        <Route path="documents" element={<DocumentsList />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
