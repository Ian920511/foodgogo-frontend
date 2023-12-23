import { apiHelper } from './../utils/axios'

export default {
  async getProducts() {
    try {
      const response = await apiHelper.get(`/admin/products/`)

      return response.data.data.products
    } catch (error) {
      throw error.response.data
    }
  },

  async getOrders() {
    try {
      const response = await apiHelper.get(`/admin/orders/`)

      return response.data.data.orders
    } catch (error) {
      throw error.response.data
    }
  },

  async postProduct(formData) {
    try {

      const response = await apiHelper.post(`/admin/products/`, formData)

      const { message } = response.data

      return { ...response.data.data, message }
    } catch (error) {
      throw error.response.data
    }
  },

  async updateProduct({ productId, formData }) {
    try {

      const response = await apiHelper.put(`/admin/products/${productId}`, formData)

      const { message } = response.data

      return { ...response.data.data, message }
    } catch (error) {
      throw error.response.data
    }
  },

  async updateProductStatus(productId, status) {
    try {
      const response = await apiHelper.patch(
        `/admin/products/${productId}?active=${status}`
      )

      return response.data.data
    } catch (error) {
      throw error.response.data
    }
  },


  async deleteProduct(productId) {
    try {
      const response = await apiHelper.delete(`/admin/products/${productId}`)

      return response.data
    } catch (error) {
      throw error.response.data
    }
  },
}