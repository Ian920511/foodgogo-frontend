import { apiHelper } from './../utils/axios'

export default {
  async getProduct(productId) {
    try {
      const response = await apiHelper.get(`/products/${productId}`)

      return response.data.data.product
    } catch (error) {
      throw error.response.data
    }
  },

  async getProducts({ keyword, categoryId, max, orderBy }) {
    try {
      const searchParams = new URLSearchParams({ keyword, categoryId, max, orderBy })

      const response = await apiHelper.get(`/products?${searchParams.toString()}`)

      return response.data.data.products

    } catch (error) {
      throw error.response.data
    }
  }
}