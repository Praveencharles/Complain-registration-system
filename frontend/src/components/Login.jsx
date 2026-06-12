import { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('login/', form)
      onLogin(res.data.user, res.data.token)
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input className="w-full p-3 border rounded mb-4 text-sm" type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input className="w-full p-3 border rounded mb-4 text-sm" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 cursor-pointer text-sm sm:text-base" type="submit">Login</button>
        </form>
        <p className="mt-4 text-center text-sm">Don't have an account? <Link to="/register" className="text-blue-600">Register</Link></p>
      </div>
    </div>
  )
}

export default Login
