import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

function CreateComplaint({ user }) {
  const [form, setForm] = useState({ about: '', priority: 'medium' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post('complaints/', form)
      navigate('/dashboard')
    } catch {
      setError('Failed to create complaint')
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-4 sm:mt-8 p-3 sm:p-4">
      <button onClick={() => navigate('/dashboard')} className="mb-4 text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1 text-sm sm:text-base">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Dashboard
      </button>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h1 className="text-lg sm:text-xl font-bold mb-4">New Complaint</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <textarea className="w-full p-3 border rounded mb-4 text-sm" rows="5" placeholder="Describe your complaint..." value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} required />
          <select className="w-full p-3 border rounded mb-4 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 cursor-pointer text-sm sm:text-base" type="submit">Submit Complaint</button>
        </form>
      </div>
    </div>
  )
}

export default CreateComplaint
