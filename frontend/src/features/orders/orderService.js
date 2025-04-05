import axios from 'axios'

const API_URL = '/api/orders/'

// Create new order
const createOrder = async (orderData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, orderData, config)
  return response.data
}

// Get user orders
const getMyOrders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL + 'myorders', config)
  return response.data
}

// Get all orders (admin)
const getOrders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)
  return response.data
}

// Get order by ID
const getOrderById = async (orderId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL + orderId, config)
  return response.data
}

// Update order status
const updateOrderStatus = async (orderId, status, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(
    API_URL + orderId + '/status',
    { status },
    config
  )
  return response.data
}

// Get orders by farmer ID
const getOrdersByFarmer = async (farmerId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL + `farmer/${farmerId}`, config)
  return response.data
}

const orderService = {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByFarmer,
}

export default orderService