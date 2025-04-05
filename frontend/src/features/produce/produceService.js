import axios from 'axios'

const API_URL = '/api/produce/'

// Get all produce
const getProduce = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

// Get produce by farmer
const getProduceByFarmer = async (farmerId) => {
  const response = await axios.get(API_URL + `farmer/${farmerId}`)
  return response.data
}

// Create new produce
const createProduce = async (produceData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, produceData, config)
  return response.data
}

const produceService = {
  getProduce,
  getProduceByFarmer,
  createProduce,
}

export default produceService