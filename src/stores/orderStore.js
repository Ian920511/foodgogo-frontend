import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import orderApi from './../apis/orders'
import { useCartStore } from './cartStore' 

export const useOrderStore = defineStore('order', ()=> {

  const orders = ref([])
  const orderDetails = ref([])
  const errorMessage = ref(null)
  const cartStore = useCartStore()
  const { cartItems } = storeToRefs(cartStore)


  const getOrders = async () => {
    try {
      const response = await orderApi.getOrders()
      
      if (response.status === 'success') {
        orders.value = response.data.orders
      } 
    } catch (error) {
      errorMessage.value = error.message
    } 
  }

  const getOrderDetails = async ({ orderId }) => {
    try {
      const response = await orderApi.getOrder({ orderId })
      
      if (response.status === 'success') {
        return response
      }
    } catch (error) {
      errorMessage.value = error.message
    }
  }

  const postOrder = async () => {
    if (!cartItems.value) {
      errorMessage.value = '購物車無商品'
      return
    }

    try {
      const orderItems = cartItems.value.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))

      const response = await orderApi.postOrder({ items: orderItems })
      
      return response
    } catch (error) {
      errorMessage.value = error.message
    }
  }

  return {
    orderDetails,
    orders,
    errorMessage,
    getOrderDetails,
    getOrders,
    postOrder
  }
})