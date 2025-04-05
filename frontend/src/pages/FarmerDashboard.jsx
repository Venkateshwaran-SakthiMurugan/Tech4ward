import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { getProduceByFarmer, createProduce, reset as resetProduce } from '../features/produce/produceSlice'
import { getOrdersByFarmer, reset as resetOrders } from '../features/orders/orderSlice'
import Spinner from '../components/Spinner'

function FarmerDashboard() {
  const [formData, setFormData] = useState({
    crop: '',
    quantity_kg: '',
    date: new Date().toISOString().split('T')[0],
  })

  const { crop, quantity_kg, date } = formData

  const [activeTab, setActiveTab] = useState('produce')

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { produce, isLoading: produceLoading, isError: produceError, isSuccess: produceSuccess, message: produceMessage } = useSelector(
    (state) => state.produce
  )
  const { orders, isLoading: ordersLoading, isError: ordersError, isSuccess: ordersSuccess, message: ordersMessage } = useSelector(
    (state) => state.orders
  )

  useEffect(() => {
    if (user && user.farmer) {
      dispatch(getProduceByFarmer(user.farmer))
      dispatch(getOrdersByFarmer(user.farmer))
    }

    return () => {
      dispatch(resetProduce())
      dispatch(resetOrders())
    }
  }, [user, dispatch])

  useEffect(() => {
    if (produceError) {
      toast.error(produceMessage)
      dispatch(resetProduce())
    }

    if (produceSuccess) {
      toast.success('Produce added successfully')
      setFormData({
        crop: '',
        quantity_kg: '',
        date: new Date().toISOString().split('T')[0],
      })
      dispatch(resetProduce())
    }
  }, [produceError, produceSuccess, produceMessage, dispatch])

  useEffect(() => {
    if (ordersError) {
      toast.error(ordersMessage)
      dispatch(resetOrders())
    }
  }, [ordersError, ordersMessage, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (!crop || !quantity_kg) {
      toast.error('Please fill in all fields')
      return
    }

    const produceData = {
      farmer: user.farmer,
      crop,
      quantity_kg: parseFloat(quantity_kg),
      date,
    }

    dispatch(createProduce(produceData))
  }

  const isLoading = produceLoading || ordersLoading

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div>
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'produce'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('produce')}
            >
              Produce
            </button>
            <button
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'produce' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Add New Produce</h2>
              <form onSubmit={onSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="crop">
                    Crop
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="crop"
                    name="crop"
                    value={crop}
                    placeholder="Enter crop name"
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity_kg">
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    id="quantity_kg"
                    name="quantity_kg"
                    value={quantity_kg}
                    placeholder="Enter quantity in kg"
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={date}
                    onChange={onChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Add Produce
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Your Produce History</h2>
              {produce && produce.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Crop
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Quantity (kg)
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {produce.map((item) => (
                        <tr key={item._id}>
                          <td className="py-2 px-4 border-b border-gray-200">{item.crop}</td>
                          <td className="py-2 px-4 border-b border-gray-200">{item.quantity_kg}</td>
                          <td className="py-2 px-4 border-b border-gray-200">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No produce records found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Orders for Your Produce</h2>
          {orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
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
                        {order.user.name}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-sm">
                        <ul>
                          {order.orderItems
                            .filter(item => item.farmer && item.farmer.toString() === user.farmer)
                            .map((item, index) => (
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
                      <td className="py-2 px-4 border-b border-gray-200 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No orders found for your produce</p>
          )}
        </div>
      )}
    </div>
  )
}

export default FarmerDashboard