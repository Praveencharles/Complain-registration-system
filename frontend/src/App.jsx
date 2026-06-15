import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import API from './api'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import CreateComplaint from './components/CreateComplaint'
import ComplaintProgress from './components/ComplaintProgress'
import SuperuserDashboard from './components/SuperuserDashboard'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register onLogin={handleLogin} />} />
        <Route
  path="/dashboard"
  element={
    user
      ? (
          user.user_type === 'admin'
            ? <SuperuserDashboard user={user} onLogout={handleLogout} />
            : <Dashboard user={user} onLogout={handleLogout} />
        )
      : <Navigate to="/login" />
  }
/>
        <Route path="/dashboard/new" element={user ? <CreateComplaint user={user} /> : <Navigate to="/login" />} />
        <Route path="/dashboard/:id" element={user ? <ComplaintProgress user={user} /> : <Navigate to="/login" />} />
        <Route path="/superuser" element={user && user.user_type === 'admin' ? <SuperuserDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
