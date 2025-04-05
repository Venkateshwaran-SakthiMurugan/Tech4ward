import axios from 'axios'

const API_URL = '/api/users/'

// Register user
const register = async (userData) => {
  try {
    console.log('Sending registration request:', { ...userData, password: '[REDACTED]' });

    const response = await axios.post(API_URL, userData);

    if (response.data) {
      console.log('Registration successful, saving user data to localStorage');
      localStorage.setItem('user', JSON.stringify(response.data));
    } else {
      console.error('Registration response missing data');
      throw new Error('Registration failed: No data received from server');
    }

    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data?.message || error.message);
    throw error;
  }
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}

const authService = {
  register,
  login,
  logout,
}

export default authService