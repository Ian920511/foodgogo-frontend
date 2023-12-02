import { ref } from 'vue'
import { defineStore } from 'pinia'
import adminApi from './../apis/admin'
import { useAlert } from './../utils/alert'


export const useAdminStore = defineStore('admin', () => {
  
  const { showAlert } = useAlert()
  const showItemModal = ref(false)
  const activeProducts = ref([])
  const nonActiveProducts = ref([])
  const modalType = ref('addItem')
  const errorMessage = ref(null)
  const initialCategory = ref(null)
  const updateProduct = ref(null)

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
    }
  }


  const addOrUpdateItem = async (form) => {
    try {

      const newForm = new FormData(form)


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
    }
  }


  const toggleActive = async (productId, status) => {
    try {

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
    }
  }

 

  const deleteItem = async (productId) => {
    try {
      await adminApi.deleteProduct(productId)
      nonActiveProducts.value = nonActiveProducts.value.filter(
        (product) => product.id !== productId
      )
    } catch (error) {
      errorMessage.value = error.message
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
    toggleModal
  }
})