import { apiHelper } from './../utils/axios'

export default {
  async login ( { email, password } ) {
    try {
      const response = await apiHelper.post('/login', {
        email,
        password
      })

      const { message } = response.data

      return { ...response.data.data, message} 
    } catch (error) {
      throw error.response.data
    }
  },

  async register (data) {
    try {
      const response = await apiHelper.post('/register', data)

      return response.data
    } catch (error) {
      throw error.response.data
    }
  }
}