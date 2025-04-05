import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className="bg-primary-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Namma Vivasayi
        </Link>
        <nav>
          <ul className="flex space-x-6">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <li>
                    <Link to="/admin-dashboard" className="hover:text-primary-200">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                {user.role === 'farmer' && (
                  <li>
                    <Link to="/farmer-dashboard" className="hover:text-primary-200">
                      Farmer Dashboard
                    </Link>
                  </li>
                )}
                {user.role === 'customer' && (
                  <li>
                    <Link to="/customer-portal" className="hover:text-primary-200">
                      Browse Produce
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/profile" className="hover:text-primary-200">
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    className="hover:text-primary-200"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/customer-portal" className="hover:text-primary-200">
                    Browse Produce
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-primary-200">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-primary-200">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header