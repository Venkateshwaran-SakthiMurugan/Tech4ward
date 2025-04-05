import axios from 'axios'

const API_URL = '/api/inventory/'

// Get all inventory
const getInventory = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

// Get inventory by village
const getInventoryByVillage = async (villageId) => {
  const response = await axios.get(API_URL + `village/${villageId}`)
  return response.data
}

// Get top contributing villages
const getTopVillages = async () => {
  const response = await axios.get(API_URL + 'stats/top-village')
  return response.data
}

const inventoryService = {
  getInventory,
  getInventoryByVillage,
  getTopVillages,
}

export default inventoryService