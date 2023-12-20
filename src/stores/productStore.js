import { ref, computed  } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore, storeToRefs } from 'pinia'
import productApi from './../apis/products'
import categoriesApi from './../apis/categories'
import { useStatusStore } from './statusStore'

export const useProductStore = defineStore('product', ()=> {
  const router = useRouter()
  const products = ref([])
  const product = ref(null)
  const searchQuery = ref('')
  const searchResult = ref(null)
  const categories = ref([])
  const errorMessage = ref(null)
  const orderBy = ref('createdAt')
  const statusStore = useStatusStore()
  const { isLoading } = storeToRefs(statusStore)

  const sortedProduct = computed(() => {
    if (orderBy.value === 'priceAsc') {
      return searchResult.value.slice().sort((a, b) => a.price - b.price)
    } else if (orderBy.value === 'priceDesc') {
      return searchResult.value.slice().sort((a, b) => b.price - a.price)
    } else {
      return searchResult.value
    }
  })

  const getProducts = async (filterQuery) => {
    try {

      if (filterQuery) {
        searchResult.value = await productApi.getProducts(filterQuery)
      }
      products.value = await productApi.getProducts({ orderBy: orderBy.value })
      searchResult.value = products.value

    } catch (error) {
      errorMessage.value = error.message
    } finally {
      isLoading.value = false
    }
  }

  const getProduct = async (id) => {
    try {
      product.value = await productApi.getProduct(id)
 
    } catch (error) {
      errorMessage.value = error.message
    } finally {
      isLoading.value = false
    }
  }

  const getCategories = async () => {
    try {
      categories.value = await categoriesApi.getCategories()
      
    } catch (error) {
      errorMessage.value = error.message
    }
  }

  const setSearchResult = (searchType) => {
    if (searchType === 'keyword') {
      if (!searchQuery.value) {
        searchResult.value = products.value;
        orderBy.value = 'createdAt';
      } else {
        searchResult.value = products.value.filter(product =>
          product.name.includes(searchQuery.value)
        );
      }
    } else if (searchType === 'amount') {
      searchResult.value = products.value.filter(
        product => product.price <= searchQuery.value.max
      );
    } else if (searchType === 'category') {
      searchResult.value = products.value.filter(
        product => product.category.id === searchQuery.value.categoryId
      );
    }

    const query = searchType === 'keyword' ? { keyword: searchQuery.value, orderBy: orderBy.value } : { ...searchQuery.value, orderBy: orderBy.value }
    
    router.replace({
      name: 'ProductList',
      query
    });
    searchQuery.value = ''
  }

  return {
    products,
    product,
    searchQuery,
    searchResult,
    categories,
    errorMessage,
    orderBy,
    sortedProduct,
    getProducts,
    getProduct,
    getCategories,
    setSearchResult,
  }
})