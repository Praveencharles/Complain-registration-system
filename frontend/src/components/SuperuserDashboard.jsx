import { useState, useEffect } from 'react'
import API from '../api'

const stages = ['sent', 'opened', 'progress', 'done']

function SuperuserDashboard({ user, onLogout }) {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

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

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`complaints/${id}/status/`, { status })
      setComplaints(complaints.map((c) => (c.id === id ? { ...c, status } : c)))
    } catch {
      alert('Failed to update status')
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-4 sm:mt-6 p-3 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">Superuser Dashboard</h1>
      <p className="text-sm text-gray-600 mb-6">{user.username} (Superuser)</p>

      <h2 className="text-lg font-semibold mb-4">All Complaints</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : complaints.length === 0 ? (
        <p className="text-center text-gray-500">No complaints yet.</p>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c.id} className="bg-white p-3 sm:p-4 rounded-lg shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex-1 w-full">
                  <p className="font-semibold">{c.about}</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded ${c.priority === 'high' ? 'bg-red-100 text-red-700' : c.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{c.priority}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${c.status === 'done' ? 'bg-green-100 text-green-700' : c.status === 'sent' ? 'bg-blue-100 text-blue-700' : c.status === 'opened' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>{c.status}</span>
                    <span className="text-xs text-gray-400">{c.user_name} ({c.user_type})</span>
                    <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 cursor-pointer text-sm w-full sm:w-auto"
                >
                  {expanded === c.id ? 'Collapse' : 'Manage'}
                </button>
              </div>
              {expanded === c.id && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm mb-3"><span className="font-medium">Complaint:</span> {c.about}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-sm font-medium w-full sm:w-auto">Update Status:</span>
                    {stages.filter((s) => s !== 'sent').map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(c.id, s)}
                        disabled={c.status === s}
                        className={`px-3 py-1 rounded text-sm cursor-pointer ${c.status === s ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {stages.map((stage, idx) => {
                      const currentIdx = stages.indexOf(c.status)
                      return (
                        <div key={stage} className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${idx <= currentIdx ? 'bg-blue-600' : 'bg-gray-300'}`}>
                            {idx + 1}
                          </div>
                          <span className={`text-xs ml-1 ${idx <= currentIdx ? 'text-blue-600' : 'text-gray-400'}`}>{stage}</span>
                          {idx < stages.length - 1 && <div className={`w-8 h-0.5 mx-1 ${idx < currentIdx ? 'bg-blue-600' : 'bg-gray-300'}`}></div>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SuperuserDashboard







