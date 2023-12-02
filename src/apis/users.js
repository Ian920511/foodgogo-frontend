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
}