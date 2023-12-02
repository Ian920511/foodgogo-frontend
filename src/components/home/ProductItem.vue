<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import  { useUserStore } from './../../stores/userStore'
import { useCartStore } from './../../stores/cartStore'
import { useAlert } from './../../utils/alert'

defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const { isAuthenticated } = storeToRefs(userStore)
const { addCartItem } = cartStore
const { showAlert } = useAlert()


const handleShowDetail = (id) => {
  router.push({ name: 'ProductDetail', params: { productId: id } })
}

const addItem = async (productId) => {
  try {
    if (!isAuthenticated.value) {
      return showAlert('error','請先註冊或登入才能使用功能')
    }

    const { status, message } = await addCartItem({ productId, quantity: 1 })
    if (status === 'success') {
      showAlert('success', message)
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
      <p class="card-text text-lg font-weight-bold text-info">NT$ {{ product.price }}</p>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" @click="addItem(product.id)">
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