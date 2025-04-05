import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const FarmerRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth)

  if (!user || (user.role !== 'farmer' && user.role !== 'admin')) {
    return <Navigate to="/" />
  }

  return children
}

export default FarmerRoute