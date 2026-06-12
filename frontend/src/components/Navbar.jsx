import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Complaint System
          </Link>

          <div className="hidden md:flex items-center gap-3">
            {user && (
              <button
                onClick={() => { navigate(user.user_type === 'staff' ? '/superuser' : '/dashboard'); setMenuOpen(false) }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 cursor-pointer"
              >
                Profile
              </button>
            )}
            {user ? (
              <button
                onClick={() => { onLogout(); setMenuOpen(false); navigate('/') }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user && (
              <button
                onClick={() => { navigate(user.user_type === 'staff' ? '/superuser' : '/dashboard'); setMenuOpen(false) }}
                className="w-full text-left bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 cursor-pointer"
              >
                Profile
              </button>
            )}
            {user ? (
              <button
                onClick={() => { onLogout(); setMenuOpen(false); navigate('/') }}
                className="w-full text-left bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
