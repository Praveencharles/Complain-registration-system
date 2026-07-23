import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

function Dashboard({ user, onLogout }) {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadComplaints()
  }, [])

  const loadComplaints = () => {
    API.get('complaints/')
      .then((res) => {
        setComplaints(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this complaint?')) return
    try {
      await API.delete(`complaints/${id}/`)
      setComplaints(complaints.filter((c) => c.id !== id))
    } catch {
      alert('Failed to delete')
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-4 sm:mt-6 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">My Complaints</h1>
          <p className="text-sm text-gray-600">{user.username} ({user.user_type})</p>
        </div>
        <button onClick={() => navigate('/dashboard/new')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer w-full sm:w-auto text-center text-sm sm:text-base">
          New Complaint
        </button>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : complaints.length === 0 ? (
        <p className="text-center text-gray-500">No complaints yet.</p>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c.id} className="bg-white p-3 sm:p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex-1 w-full cursor-pointer" onClick={() => navigate(`/dashboard/${c.id}`)}>
                <p className="font-semibold truncate">{c.about}</p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded ${c.priority === 'high' ? 'bg-red-100 text-red-700' : c.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{c.priority}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${c.status === 'done' ? 'bg-green-100 text-green-700' : c.status === 'sent' ? 'bg-blue-100 text-blue-700' : c.status === 'opened' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>{c.status}</span>
                  <span className="text-xs text-gray-400">{c.user_type}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(c.id)} className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 cursor-pointer text-sm w-full sm:w-auto">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard















