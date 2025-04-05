import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { getInventory } from '../features/inventory/inventorySlice'
import { createOrder, reset } from '../features/orders/orderSlice'
import { getVillages } from '../features/villages/villageSlice'
import Spinner from '../components/Spinner'

function CustomerPortal() {
  const [selectedCrops, setSelectedCrops] = useState([])
  const [filterVillage, setFilterVillage] = useState('')
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderForm, setOrderForm] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  })

  const { address, city, postalCode, country } = orderForm

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { inventory, isLoading: inventoryLoading } = useSelector((state) => state.inventory)
  const { villages } = useSelector((state) => state.villages)
  const { isLoading: orderLoading, isSuccess, isError, message } = useSelector(
    (state) => state.orders
  )

  useEffect(() => {
    dispatch(getInventory())
    dispatch(getVillages())
  }, [dispatch])

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess) {
      toast.success('Order placed successfully')
      setSelectedCrops([])
      setShowOrderForm(false)
      setOrderForm({
        address: '',
        city: '',
        postalCode: '',
        country: '',
      })
    }

    dispatch(reset())
  }, [isError, isSuccess, message, dispatch])

  const handleCropSelect = (crop, quantity) => {
    const existingCrop = selectedCrops.find((item) => item.crop === crop)

    if (existingCrop) {
      setSelectedCrops(
        selectedCrops.map((item) =>
          item.crop === crop ? { ...item, quantity_kg: quantity } : item
        )
      )
    } else {
      setSelectedCrops([...selectedCrops, { crop, quantity_kg: quantity }])
    }
  }

  const handleRemoveCrop = (crop) => {
    setSelectedCrops(selectedCrops.filter((item) => item.crop !== crop))
  }

  const handleOrderFormChange = (e) => {
    setOrderForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please login to place an order')
      return
    }

    if (selectedCrops.length === 0) {
      toast.error('Please select at least one crop')
      return
    }

    if (!address || !city || !postalCode || !country) {
      toast.error('Please fill in all delivery details')
      return
    }

    const orderData = {
      orderItems: selectedCrops,
      deliveryAddress: {
        address,
        city,
        postalCode,
        country,
      },
    }

    dispatch(createOrder(orderData))
  }

  const filteredInventory = filterVillage
    ? inventory.filter((item) =>
        item.village_contributions.some(
          (vc) => vc.village._id === filterVillage
        )
      )
    : inventory

  if (inventoryLoading) {
    return <Spinner />
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Produce</h1>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="mb-4 sm:mb-0">
          <label htmlFor="villageFilter" className="mr-2 font-medium">
            Filter by Village:
          </label>
          <select
            id="villageFilter"
            className="form-control inline-block w-auto"
            value={filterVillage}
            onChange={(e) => setFilterVillage(e.target.value)}
          >
            <option value="">All Villages</option>
            {villages.map((village) => (
              <option key={village._id} value={village._id}>
                {village.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCrops.length > 0 && (
          <button
            className="btn btn-primary"
            onClick={() => setShowOrderForm(true)}
          >
            Proceed to Order ({selectedCrops.length} items)
          </button>
        )}
      </div>

      {filteredInventory.length === 0 ? (
        <p>No produce available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map((item) => (
            <div key={item._id} className="card">
              <h3 className="text-xl font-bold mb-2">{item.crop}</h3>
              <p className="mb-4">
                Available: <span className="font-semibold">{item.total_quantity_kg} kg</span>
              </p>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Village Contributions:</p>
                <ul className="text-sm">
                  {item.village_contributions.map((vc) => (
                    <li key={vc._id}>
                      {vc.village.name}: {vc.quantity_kg} kg
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-end">
                <div className="flex-grow">
                  <label htmlFor={`quantity-${item._id}`} className="block text-sm font-medium mb-1">
                    Quantity (kg):
                  </label>
                  <input
                    type="number"
                    id={`quantity-${item._id}`}
                    className="form-control"
                    min="0.1"
                    max={item.total_quantity_kg}
                    step="0.1"
                    defaultValue="1"
                  />
                </div>
                <button
                  className="btn btn-primary ml-2"
                  onClick={() => {
                    const quantityInput = document.getElementById(`quantity-${item._id}`)
                    const quantity = parseFloat(quantityInput.value)
                    
                    if (quantity <= 0) {
                      toast.error('Quantity must be greater than 0')
                      return
                    }
                    
                    if (quantity > item.total_quantity_kg) {
                      toast.error(`Only ${item.total_quantity_kg} kg available`)
                      return
                    }
                    
                    handleCropSelect(item.crop, quantity)
                    toast.success(`${quantity} kg of ${item.crop} added to order`)
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Complete Your Order</h2>
            
            <div className="mb-4">
              <h3 className="font-bold mb-2">Selected Items:</h3>
              <ul className="mb-4">
                {selectedCrops.map((item) => (
                  <li key={item.crop} className="flex justify-between items-center mb-2">
                    <span>
                      {item.crop} - {item.quantity_kg} kg
                    </span>
                    <button
                      className="text-red-500"
                      onClick={() => handleRemoveCrop(item.crop)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handlePlaceOrder}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={address}
                  onChange={handleOrderFormChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                  City
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  value={city}
                  onChange={handleOrderFormChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">
                  Postal Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="postalCode"
                  name="postalCode"
                  value={postalCode}
                  onChange={handleOrderFormChange}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
                  Country
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  name="country"
                  value={country}
                  onChange={handleOrderFormChange}
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowOrderForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={orderLoading}
                >
                  {orderLoading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerPortal