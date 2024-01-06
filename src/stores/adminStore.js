import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import adminApi from './../apis/admin'
import { useAlert } from './../utils/alert'
import { useStatusStore } from './statusStore'
import { useOrderStore } from './orderStore'

export const useAdminStore = defineStore('admin', () => {
  
  const { showAlert } = useAlert()
  const showItemModal = ref(false)
  const activeProducts = ref([])
  const nonActiveProducts = ref([])
  const modalType = ref('addItem')
  const errorMessage = ref(null)
  const initialCategory = ref(null)
  const updateProduct = ref(null)
  const statusStore = useStatusStore()
  const orderStore = useOrderStore()
  const { isProcessing, isLoading } = storeToRefs(statusStore)
  const { orders } = storeToRefs(orderStore)

  const formData = ref({
    name: '',
    description: '',
    image: '',
    categoryId: '',
    price: '',
    active: true,
  })

  const getItems = async () => {
    try {

      const products = await adminApi.getProducts() 

      activeProducts.value = []
      nonActiveProducts.value = []

      products.forEach((product) => {

        if (product.active) {
          activeProducts.value.push(product)
        } else {
          nonActiveProducts.value.push(product)
        }
      })

    } catch (error) {
      throw error.message
    } finally {
      isLoading.value = false
    }
  }


  const addOrUpdateItem = async (form) => {
    try {

      const newForm = new FormData(form)
      isProcessing.value = true

      if (modalType.value === 'addItem') {
        const { product, message } = await adminApi.postProduct(newForm)

        if (product) {
          showAlert('success', message).then(() => {
            activeProducts.value = [product, ...activeProducts.value]
          })
          toggleModal()
        }
      } else {

        const { product, message } = await adminApi.updateProduct({
          productId: updateProduct.value.id,
          formData: newForm
      })
        
        if (product) {
          showAlert('success', message).then(() => {
            activeProducts.value = activeProducts.value.map((activeProduct) =>
            activeProduct.id === product.id ? product : activeProduct
          )
          })

          
          
          toggleModal()
        }
      }
    } catch (error) {
      throw { code: error.code, message: error.message }
    } finally {
      isProcessing.value = false
    }
  }


  const toggleActive = async (productId, status) => {
    try {
      isProcessing.value = true
      const { product } = await adminApi.updateProductStatus(productId, !status)  

      if (status) {
        nonActiveProducts.value.push(product)
        activeProducts.value = activeProducts.value.filter(product => product.id !== productId)

      } else {
        activeProducts.value.push(product)
        nonActiveProducts.value = nonActiveProducts.value.filter(product => product.id !== productId)
      }

    } catch (error) {
      throw { code: error.code, message: error.message }
    } finally {
      isProcessing.value = false
    }
  }

 

  const deleteItem = async (productId) => {
    try {
      isProcessing.value = true

      await adminApi.deleteProduct(productId)
      nonActiveProducts.value = nonActiveProducts.value.filter(
        (product) => product.id !== productId
      )
    } catch (error) {
      errorMessage.value = error.message
    } finally {
      isProcessing.value = false
    }
  }


  const toggleModal = (id) => {
    showItemModal.value = !showItemModal.value

    if (showItemModal.value && id) {
      modalType.value = 'updateItem'
      updateProduct.value = activeProducts.value.find(
        (product) => product.id === id
      )

      Object.keys(formData.value).forEach((fieldName) =>
        fieldName === 'categoryId'
          ? (formData.value[fieldName] = updateProduct.value.category.id)
          : (formData.value[fieldName] = updateProduct.value[fieldName])
      )
    } else {
      modalType.value = 'addItem'
      Object.keys(formData.value).forEach((fieldName) =>
        fieldName === 'categoryId'
          ? (formData.value[fieldName] = initialCategory)
          : (formData.value[fieldName] = null)
      )
    }
  }

  const getAdminOrders = async () => {
    try {
      const response = await adminApi.getAdminOrders()
      
      if (response.status === 'success') {
        orders.value = response.data.orders
      }

      return response
    } catch (error) {
      errorMessage.value = error.message
    } 
  }

  return {
    showItemModal,
    activeProducts,
    nonActiveProducts,
    errorMessage,
    initialCategory,
    updateProduct ,
    modalType,
    formData,
    getItems,
    addOrUpdateItem,
    toggleActive,
    deleteItem,
    toggleModal,
    getAdminOrders
  }
})