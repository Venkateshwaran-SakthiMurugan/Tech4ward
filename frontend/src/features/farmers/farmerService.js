import axios from 'axios'

const API_URL = '/api/farmers/'

// Get all farmers
const getFarmers = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

// Get farmers by village
const getFarmersByVillage = async (villageId) => {
  const response = await axios.get(API_URL + `village/${villageId}`)
  return response.data
}

// Create new farmer
const createFarmer = async (farmerData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, farmerData, config)
  return response.data
}

const farmerService = {
  getFarmers,
  getFarmersByVillage,
  createFarmer,
}

export default farmerService