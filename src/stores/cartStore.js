import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import cartApi from './../apis/carts'
import { useAlert } from './../utils/alert'
import { useStatusStore } from './statusStore'

export const useCartStore = defineStore('cart', ()=> {

  const { showAlert } = useAlert()
  const cartItems = ref([])
  const errorMessage = ref(null)
  const statusStore = useStatusStore()
  const { isProcessing, isLoading } = storeToRefs(statusStore)

  const totalPrice = computed(() => {
    return cartItems.value.length
      ? cartItems.value.reduce((acc, item) => {
          return (acc += item.quantity * item.product.price)
        }, 0)
      : 0
  })

  const cartItemsPrice = computed(() => {
    return cartItems.value.length
      ? cartItems.value.reduce((acc, item) => {
          return (acc += item.quantity)
        }, 0)
      : 0
  })

  const getCartItems = async () => {
    try {
      cartItems.value = await cartApi.getCartItem()
    } catch (error) {
      throw error.message
    } finally {
      isLoading.value = false
    }
  }

  const addCartItem = async (productId, quantity) => {
    try {
      isProcessing.value = true

      if (quantity < 1) {
          return showAlert('warning', '數量不能小於1')
        }

      const { status, message, data } = await cartApi.addCartItem(productId, quantity)
      

      if (status === 'success') {
        const cartItem = cartItems.value.find(
          (cartItem) => cartItem.product.id === productId
        )
        if (cartItem) {
          cartItem.quantity = quantity
        } else {
          cartItems.value = [{ ...data.cartItem }, ...cartItems.value]
        }

        return { status, message }
      }
    } catch (error) {
      throw error.message
    } finally {
      isProcessing.value = false
    }
  }

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      const cartItem = cartItems.value.find((item) => item.id === cartItemId)

      if (quantity < 1 || isNaN(quantity)) {
        cartItem.quantity = 1
      } else {
        cartItem.quantity = quantity
      }

      await cartApi.updateCartItem({ cartItemId: cartItem.id, quantity: cartItem.quantity })
    } catch (error) {
      errorMessage.value = error.message
    }
  }

  const deleteCartItem = async (cartItemId) => {
    try {
      const { status } = await cartApi.deleteCartItem({ cartItemId })
      if (status === 'success') {
        cartItems.value = cartItems.value.filter(
          (cartItem) => cartItem.id !== cartItemId
        )
      }
    } catch (error) {
      errorMessage.value = error.message
    }
  }

  return {
    cartItems,
    errorMessage,
    totalPrice,
    cartItemsPrice,
    getCartItems,
    addCartItem,
    updateCartItem,
    deleteCartItem
  }
})