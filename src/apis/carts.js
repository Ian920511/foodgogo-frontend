import { apiHelper } from './../utils/axios'

export default {
  async getCartItem() {
    try {
      const response = await apiHelper.get('/carts')

      return response.data.data.cart.cartItem
    } catch(error) {
      throw error.response.data
    }
  },

  async addCartItem({ productId, quantity }) {
    try {
      const response = await apiHelper.post('/carts', { productId, quantity })

      return response.data
    } catch(error) {
      throw error.response.data
    }
  },

  async updateCartItem({ quantity, cartItemId }) {
    try {
      const response = await apiHelper.patch(`/carts/${cartItemId}`, {
        quantity
      })

      return response.data
    } catch(error) {
      throw error.response.data
    }
  },

  async deleteCartItem({ cartItemId }) {
    try {
      const response = await apiHelper.delete(`/carts/${cartItemId}`)

      return response.data
    } catch(error) {
      throw error.response.data
    }
  }
}