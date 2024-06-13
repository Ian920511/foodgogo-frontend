<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import  { useUserStore } from './../../stores/userStore'
import { useCartStore } from './../../stores/cartStore'
import { useStatusStore } from './../../stores/statusStore'
import { useAlert } from './../../utils/alert'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  }
})

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const statusStore = useStatusStore()
const { isProcessing } = storeToRefs(statusStore)
const { isAuthenticated, favorites } = storeToRefs(userStore)
const { addFavorite, removeFavorite } = userStore
const { addCartItem } = cartStore
const { showAlert } = useAlert()
const favoritesLoaded = ref(false)

const isFavorited = computed(() => {
  return isAuthenticated.value && props.product &&
     favorites.value.some((favorite) => favorite.product.id === props.product.id)
})

onMounted(async () => {
  if (!favorites.value.length) {
    await userStore.getFavorites()
  }
  favoritesLoaded.value = true
})


const handleShowDetail = (id) => {
  router.push({ name: 'ProductDetail', params: { productId: id } })
}

const addItem = async (productId) => {
  try {
    if (!isAuthenticated.value) {
      return showAlert('error','請先登入才能使用功能')
    }

    const { status, message } = await addCartItem({ productId, quantity: 1 })
    if (status === 'success') {
      showAlert('success', message)
    }
  } catch (error) {
    showAlert('error', error)
  }
}

const toggleFavorite = async (productId) => {
  try {
    if (!isAuthenticated.value) {
      return showAlert('error', '請先登入才能使用功能')
    }

    if (isFavorited.value) {
      const { status, message } = await removeFavorite({ productId })

      if (status === 'success') {
        favorites.value = favorites.value.filter(fav => fav.product.id !== productId)

        showAlert('success', message)
      }
      
    } else {
      const { status, message } = await addFavorite({ productId })

      if (status === 'success') {
        const newFavorite = { product: props.product }
        favorites.value.push(newFavorite)

        showAlert('success', message)
      }

    }

  } catch (error) {
    showAlert('error', error)
  }
}

</script>

<template>
  <div class="card">
    <img class="card-img-top" :src="product.image" :alt="product.name" @click="handleShowDetail(product.id)"
      style="height: 240px; object-fit: cover;" />
    <div class="card-body">
      <h5 class="card-title mb-1">{{ product.name }}</h5>
      <p class="card-text text-lg font-weight-bold text-info">NT$ {{ product.price }} </p>
      <p class="card-text text-lg font-weight-bold">庫存 {{ product.stock }}</p>
      <div class="d-flex justify-content-end">
        <button class="btn m-1" :disabled="isProcessing" 
        :class="isFavorited ? 'btn-danger' : 'btn-primary'"
        @click="toggleFavorite(product.id)">
            {{ isFavorited ? '取消追蹤' : '加入追蹤' }}
          </button>
        <button class="btn btn-primary m-1" :disabled="isProcessing" @click="addItem(product.id)">
          加入購物車
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.card-img-top {
  height: 240px;
  object-fit: cover;
}

</style>