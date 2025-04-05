import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getMyOrders } from '../features/orders/orderSlice'
import Spinner from '../components/Spinner'

function ProfilePage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { orders, isLoading } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(getMyOrders())
  }, [dispatch])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
          <div className="mb-4">
            <p className="text-gray-600 text-sm">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 text-sm">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 text-sm">Role</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
          {user.role === 'farmer' && user.farmer && (
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Farmer ID</p>
              <p className="font-medium">{user.farmer}</p>
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
          {orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="py-2 px-4 border-b border-gray-200 text-sm">
                        {order._id}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-sm">
                        <ul>
                          {order.orderItems.map((item, index) => (
                            <li key={index}>
                              {item.crop}: {item.quantity_kg} kg
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No orders found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage