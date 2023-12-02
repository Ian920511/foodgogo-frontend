import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import orderApi from './../apis/orders'
import { useCartStore } from './cartStore' 

export const useOrderStore = defineStore('order', ()=> {

  const orderDetails = ref([])
  const orderDetail = ref(null)
  const errorMessage = ref(null)
  const cartStore = useCartStore()
  const { cartItems } = storeToRefs(cartStore)


  const getOrderDetails = async () => {
    try {
      const response = await orderApi.getOrders()
      if (response.data.status === 'success') {
        orderDetails.value = response.data.orders;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      errorMessage.value = error.message
    } 
  }

  const getOrderDetail = async (id) => {
    try {
      const response = await orderApi.getOrder(id)
      if (response.data.status === 'success') {
        orderDetail.value = response.data.order;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      errorMessage.value = error.message
    }
  }

  const postOrder = async () => {
    if (!cartItems.value) {
      errorMessage.value = '購物車無商品';
      return;
    }

    try {
      const orderItems = cartItems.value.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));

      const response = await orderApi.postOrder({ items: orderItems })
      
      return response
    } catch (error) {
      errorMessage.value = error.message
    }
  }

  return {
    orderDetails,
    orderDetail,
    errorMessage,
    getOrderDetails,
    getOrderDetail,
    postOrder
  }
})