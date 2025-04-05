import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getOrderById } from '../features/orders/orderSlice'
import Spinner from '../components/Spinner'

function OrderPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  
  const { order, isLoading } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(getOrderById(id))
  }, [dispatch, id])

  if (isLoading || !order) {
    return <Spinner />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Order #{order._id}</h2>
          <span className={`px-3 py-1 rounded-full text-sm ${
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
            'bg-green-100 text-green-800'
          }`}>
            {order.status}
          </span>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 text-sm">Date Placed</p>
          <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 text-sm">Total Quantity</p>
          <p className="font-medium">{order.totalQuantity} kg</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Items</h2>
          <ul className="divide-y divide-gray-200">
            {order.orderItems.map((item, index) => (
              <li key={index} className="py-3 flex justify-between">
                <span>{item.crop}</span>
                <span className="font-medium">{item.quantity_kg} kg</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
          <p>{order.deliveryAddress.address}</p>
          <p>{order.deliveryAddress.city}, {order.deliveryAddress.postalCode}</p>
          <p>{order.deliveryAddress.country}</p>
        </div>
      </div>
    </div>
  )
}

export default OrderPage