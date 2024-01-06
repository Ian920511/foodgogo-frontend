import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import userApi from './../apis/users'
import { useAlert } from './../utils/alert'
import { useStatusStore } from './statusStore'
import { useProductStore } from './productStore'

export const useUserStore = defineStore('user', ()=> {

  const { showAlert } = useAlert()
  const statusStore = useStatusStore()
  const productStore = useProductStore()
  const { isProcessing } = storeToRefs(statusStore)
  const { reviews } = storeToRefs(productStore)
  const favorites = ref([])
  const isAuthenticated = ref(localStorage.getItem('token') !== null)
  const currentUser = ref({
        id: '',
        name: '',
        email: '',
        tel: '',
        address: '',
        isAdmin: false,
        cartId: ''
      })

  const token = ref('')    
    
  const findCurrentUser =  async () => {
    try {
      const { data } = await userApi.getCurrentUser()

      if (data.status === 'error') {
        throw new Error(data.message)
      }

      const { id, name, email, tel, address, isAdmin, cart } = data

      setCurrentUser({ id, name, email, tel, address, isAdmin, cartId: cart.id })

      } catch (error) {
        revokeAuthentication()
        throw error.message
      }
    }

  const setCurrentUser = (user) => {
    Object.assign(currentUser.value, user)
    isAuthenticated.value = true
    token.value = localStorage.getItem('token')
  }

  const revokeAuthentication = () => {
    currentUser.value = {}
    isAuthenticated.value = false
    token.value = '',
    localStorage.removeItem('token')
  }

  const getFavorites = async () => {
    try {
      const response = await userApi.getFavorites()

      favorites.value = response.data.favorites
      
    } catch (error) {
      throw error.message
    }
  }

  const addFavorite = async (productId) => {
    try {
      isProcessing.value = true

      const favorite = favorites.value.find((product => product.productId === productId))

      if (favorite) {
        return showAlert('warning', '已追蹤此商品')
      } else {
        const { status, message, data } = await userApi.addFavorite(productId)

        if (status === 'success') {
          favorites.value = [{ ...data.newFavorite }, ...favorites.value]
        }

        return { status, message }
      }
    } catch (error) {
      throw error.message
    } finally {
      isProcessing.value = false
    }
  }

  const removeFavorite = async (productId) => {
    try {
      isProcessing.value = true

      const { status, message } = await userApi.removeFavorite(productId)
      
      if (status === 'success') {
        favorites.value = favorites.value.filter(
          (product) => product.productId !== productId.productId
        )
      }
      
      return { status, message }

    } catch (error) {
      throw error.message
    } finally {
      isProcessing.value = false
    }
  }

  const addReview = async (productId, comment, rating) => {
    try {
      isProcessing.value = true

      const response = await userApi.addReview(productId, comment, rating)

      return response

    } catch (error) {
      throw error.message
    } finally {
      isProcessing.value = false
    }
  }

  const removeReview = async (reviewId) => {
    try {
      isProcessing.value = true

      const { status, message } = await userApi.removeReview({ reviewId })

      if (status === 'success') {
          reviews.value = reviews.value.filter(
            (review) => review.id !== reviewId
          )
        }

        return  { status, message }

    } catch (error) {
      throw error.message
    } finally {
      isProcessing.value = false
    }
  }


  return {
    isAuthenticated,
    currentUser,
    findCurrentUser,
    setCurrentUser,
    revokeAuthentication,
    token,
    favorites,
    getFavorites,
    addFavorite,
    removeFavorite,
    addReview,
    removeReview
  }
})
  
