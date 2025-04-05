import axios from 'axios'

const API_URL = '/api/villages/'

// Get all villages
const getVillages = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

// Create new village
const createVillage = async (villageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, villageData, config)
  return response.data
}

const villageService = {
  getVillages,
  createVillage,
}

export default villageService