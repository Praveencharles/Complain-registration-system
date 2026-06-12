import { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'

function Register({ onLogin }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', user_type: 'student' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('register/', form)
      onLogin(res.data.user, res.data.token)
    } catch (err) {
      setError(err.response?.data?.username?.[0] || err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input className="w-full p-3 border rounded mb-4" type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input className="w-full p-3 border rounded mb-4" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="w-full p-3 border rounded mb-4" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <select className="w-full p-3 border rounded mb-4" value={form.user_type} onChange={(e) => setForm({ ...form, user_type: e.target.value })}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="staff">Staff</option>
          </select>
          <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 cursor-pointer" type="submit">Register</button>
        </form>
        <p className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </div>
    </div>
  )
}

export default Register
