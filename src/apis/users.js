import { apiHelper } from './../utils/axios'

export default {
  async getCurrentUser() {
    try {
      const response = await apiHelper.get('/get_current_user')

      return response.data
    } catch(error) {
      throw error.response.data
    }
  },

  async getFavorites() {
    try {
      const response = await apiHelper.get('/favorite')

      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  async addFavorite({ productId }) {
    try {
      const response = await apiHelper.post(`/favorite/${productId}`)

      return response.data
    } catch (error) {
      throw error.response.data
    }
  },

  async removeFavorite({ productId }) {
    try {
      const response = await apiHelper.delete(`/favorite/${productId}`)

      return response.data
    } catch (error) {
      throw error.response.data
    }
  }
}