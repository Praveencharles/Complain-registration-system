import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api'

const stages = ['sent', 'opened', 'progress', 'done']
const stageLabels = { sent: 'Sent', opened: 'Opened', progress: 'In Progress', done: 'Done' }

function ComplaintProgress({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get(`complaints/${id}/`)
      .then((res) => {
        setComplaint(res.data)
        setLoading(false)
      })
      .catch(() => navigate('/dashboard'))
  }, [id, navigate])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!complaint) return null

  const currentIndex = stages.indexOf(complaint.status)

  return (
    <div className="max-w-lg mx-auto mt-4 sm:mt-8 p-3 sm:p-4">
      <button onClick={() => navigate('/dashboard')} className="mb-4 text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1 text-sm sm:text-base">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Dashboard
      </button>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <p className="text-base sm:text-lg font-semibold mb-2">Complaint #{complaint.id}</p>
        <p className="text-gray-600 mb-1 text-sm sm:text-base"><span className="font-medium">About:</span> {complaint.about}</p>
        <p className="text-gray-600 mb-1 text-sm sm:text-base"><span className="font-medium">Priority:</span> <span className={`px-2 py-0.5 rounded text-sm ${complaint.priority === 'high' ? 'bg-red-100 text-red-700' : complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{complaint.priority}</span></p>
        <p className="text-gray-600 mb-4 text-sm sm:text-base"><span className="font-medium">Submitted by:</span> {complaint.user_name} ({complaint.user_type})</p>

        <div className="mt-6">
          <h3 className="font-semibold mb-3">Status Progress</h3>
          <div className="flex justify-between items-center">
            {stages.map((stage, idx) => (
              <div key={stage} className="flex flex-col items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold ${idx <= currentIndex ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  {idx + 1}
                </div>
                <span className={`text-xs mt-1 ${idx <= currentIndex ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>{stageLabels[stage]}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-2 h-1">
            <div className="absolute top-0 left-[12.5%] right-[12.5%] h-1 bg-gray-300">
              <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {complaint.status === 'done' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded text-green-700 text-center font-semibold text-sm sm:text-base">
            This complaint has been resolved!
          </div>
        )}
      </div>
    </div>
  )
}

export default ComplaintProgress






