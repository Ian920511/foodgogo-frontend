import { apiHelper } from './../utils/axios'

export default {
  async getOrder({ orderId }) {
    try {
      const response = await apiHelper.get(`/orders/${orderId}`)

      return response.data.data.order
    } catch (error) {
      throw error.response.data
    }
  },

  async getOrders() {
    try {
      const response = await apiHelper.get(`/orders`)

      return response.data.data.orders
    } catch (error) {
      throw error.response.data
    }
  },

  async postOrder() {
    try {
      const response = await apiHelper.post('/orders')

      return response
    } catch (error) {
      throw error.response.data
    }
  }
}