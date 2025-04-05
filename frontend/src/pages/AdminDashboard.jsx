import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { getVillages, createVillage, reset as resetVillages } from '../features/villages/villageSlice'
import { getFarmers, createFarmer, reset as resetFarmers } from '../features/farmers/farmerSlice'
import { getInventory } from '../features/inventory/inventorySlice'
import { getOrders, updateOrderStatus } from '../features/orders/orderSlice'
import Spinner from '../components/Spinner'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('villages')
  const [villageForm, setVillageForm] = useState({ name: '' })
  const [farmerForm, setFarmerForm] = useState({ name: '', village: '' })

  const dispatch = useDispatch()
  
  const { villages, isLoading: villagesLoading } = useSelector((state) => state.villages)
  const { farmers, isLoading: farmersLoading } = useSelector((state) => state.farmers)
  const { inventory, isLoading: inventoryLoading } = useSelector((state) => state.inventory)
  const { orders, isLoading: ordersLoading } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(getVillages())
    dispatch(getFarmers())
    dispatch(getInventory())
    dispatch(getOrders())
  }, [dispatch])

  const handleVillageSubmit = (e) => {
    e.preventDefault()
    
    if (!villageForm.name) {
      toast.error('Please enter a village name')
      return
    }
    
    dispatch(createVillage(villageForm))
    setVillageForm({ name: '' })
  }

  const handleFarmerSubmit = (e) => {
    e.preventDefault()
    
    if (!farmerForm.name || !farmerForm.village) {
      toast.error('Please fill in all fields')
      return
    }
    
    dispatch(createFarmer(farmerForm))
    setFarmerForm({ name: '', village: '' })
  }

  const handleOrderStatusUpdate = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }))
  }

  const isLoading = villagesLoading || farmersLoading || inventoryLoading || ordersLoading

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'villages'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('villages')}
            >
              Villages
            </button>
            <button
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'farmers'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('farmers')}
            >
              Farmers
            </button>
            <button
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'inventory'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('inventory')}
            >
              Inventory
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

      {activeTab === 'villages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Add New Village</h2>
            <form onSubmit={handleVillageSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="villageName">
                  Village Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="villageName"
                  value={villageForm.name}
                  onChange={(e) => setVillageForm({ name: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Village
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Villages List</h2>
            {villages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {villages.map((village) => (
                      <tr key={village._id}>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm">
                          {village._id}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm">
                          {village.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No villages found</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'farmers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Add New Farmer</h2>
            <form onSubmit={handleFarmerSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="farmerName">
                  Farmer Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="farmerName"
                  value={farmerForm.name}
                  onChange={(e) => setFarmerForm({ ...farmerForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="farmerVillage">
                  Village
                </label>
                <select
                  className="form-control"
                  id="farmerVillage"
                  value={farmerForm.village}
                  onChange={(e) => setFarmerForm({ ...farmerForm, village: e.target.value })}
                  required
                >
                  <option value="">Select Village</option>
                  {villages.map((village) => (
                    <option key={village._id} value={village._id}>
                      {village.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Add Farmer
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Farmers List</h2>
            {farmers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Village
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmers.map((farmer) => (
                      <tr key={farmer._id}>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm">
                          {farmer.name}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm">
                          {farmer.village.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No farmers found</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Current Inventory</h2>
          {inventory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Crop
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Quantity (kg)
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Village Contributions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item._id}>
                      <td className="py-2 px-4 border-b border-gray-200 text-sm">
                        {item.crop}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-sm">
                        {item.total_quantity_kg}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-sm">
                        <ul>
                          {item.village_contributions.map((vc) => (
                            <li key={vc._id}>
                              {vc.village.name}: {vc.quantity_kg} kg
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No inventory found</p>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Orders</h2>
          {orders.length > 0 ? (
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
                      Total Quantity
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
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
                          {order.orderItems.map((item, index) => (
                            <li key={index}>
                              {item.crop}: {item.quantity_kg} kg
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-sm">
                        {order.totalQuantity} kg
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
                        <select
                          className="form-control text-sm"
                          value={order.status}
                          onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
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
      )}
    </div>
  )
}

export default AdminDashboard