import { apiHelper } from './../utils/axios'

export default {
  async getCategories () {
    try {
      const response = await apiHelper.get(`/categories`)
      return response.data.data.categories
    } catch (error) {
      throw error.response.data
    }
  }
}