import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { register, reset } from '../features/auth/authSlice'
import { getVillages } from '../features/villages/villageSlice'
import { getFarmersByVillage } from '../features/farmers/farmerSlice'
import Spinner from '../components/Spinner'

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'customer',
    village: '',
    farmer: '',
  })

  const { name, email, password, password2, role, village, farmer } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  const { villages } = useSelector((state) => state.villages)
  const { farmers } = useSelector((state) => state.farmers)

  useEffect(() => {
    dispatch(getVillages())
  }, [dispatch])

  useEffect(() => {
    if (village && role === 'farmer' && village !== '') {
      dispatch(getFarmersByVillage(village))
    }
  }, [village, role, dispatch])

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      toast.success('Registration successful! Welcome to Farm to City.')

      // Short delay before redirecting to allow the success message to be seen
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin-dashboard')
        } else if (user.role === 'farmer') {
          navigate('/farmer-dashboard')
        } else {
          navigate('/customer-portal')
        }
      }, 1500)
    }

    return () => {
      if (isSuccess || isError) {
        dispatch(reset())
      }
    }
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (password !== password2) {
      toast.error('Passwords do not match')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Validate password strength
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    // Validate farmer selection if role is farmer
    if (role === 'farmer' && !farmer) {
      toast.error('Please select a farmer profile')
      return
    }

    try {
      // Prepare user data
      const userData = {
        name,
        email,
        password,
        role,
      }

      if (role === 'farmer' && farmer) {
        userData.farmer = farmer
      }

      toast.info('Creating your account...')
      dispatch(register(userData))
    } catch (error) {
      console.error('Registration submission error:', error)
      toast.error('Registration failed. Please try again.')
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
        
        <form onSubmit={onSubmit} className="card">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password2">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password2"
              name="password2"
              value={password2}
              placeholder="Confirm password"
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Role
            </label>
            <select
              className="form-control"
              id="role"
              name="role"
              value={role}
              onChange={onChange}
            >
              <option value="customer">Customer</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>

          {role === 'farmer' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="village">
                  Village
                </label>
                <select
                  className="form-control"
                  id="village"
                  name="village"
                  value={village}
                  onChange={onChange}
                  required={role === 'farmer'}
                >
                  <option value="">Select Village</option>
                  {villages.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              {village && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="farmer">
                    Farmer
                  </label>
                  <select
                    className="form-control"
                    id="farmer"
                    name="farmer"
                    value={farmer}
                    onChange={onChange}
                    required={role === 'farmer'}
                  >
                    <option value="">Select Farmer</option>
                    {farmers.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <div className="flex items-center justify-between">
            <button type="submit" className="btn btn-primary w-full">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage