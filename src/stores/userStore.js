import { ref } from 'vue'
import { defineStore } from 'pinia'
import userApi from './../apis/users' 

export const useUserStore = defineStore('user', ()=> {
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

  return {
    isAuthenticated,
    currentUser,
    findCurrentUser,
    setCurrentUser,
    revokeAuthentication,
    token
  }
})
  
