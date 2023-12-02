<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from './../../stores/userStore'
import { useProductStore } from './../../stores/productStore'
import { useCartStore } from './../../stores/cartStore'
import { useAlert } from './../../utils/alert'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const productStore = useProductStore()
const cartStore = useCartStore()
const { isAuthenticated } = storeToRefs(userStore)
const { product, errorMessage } = storeToRefs(productStore)
const { getProduct } = productStore
const { addCartItem } = cartStore
const { showAlert } = useAlert()

onMounted(async () => {
  await getProduct(route.params.productId)
})

const addItem = async (productId) => {
  try {
    if (!isAuthenticated.value) {
      return showAlert('error', '請先註冊或登入才能使用功能')
    }
    const { status, message } = await addCartItem({ productId, quantity: 1})
    if (status === 'success') {
      showAlert('success', message)
    }
  } catch (error) {
    showAlert('error', error)
  }
}
</script>

<template>
  <section class="container my-5">
    <h3 class="mb-4 font-weight-bold text-dark">商品詳細資料</h3>
    <p v-if="errorMessage" class="text-center text-danger">
      {{ errorMessage }}
    </p>
    <div v-if="product" class="row justify-content-center">
      <div class="col-md-6">
        <img :src="product.image" :alt="product.name" class="img-fluid mb-3"
          style="max-width: 100%; height: auto; box-shadow: 0 .5rem 1rem rgba(0,0,0,.15);" />
      </div>
      <div class="col-md-6">
        <h4 class="mb-3 font-weight-bold text-info">
          商品名稱： {{ product.name }}
        </h4>
        <p class="mb-2">商品分類： {{ product.category.name }}</p>
        <p class="mb-2">商品敘述： {{ product.description }}</p>
        <p class="mb-4">商品單價： NT$ {{ product.price }}</p>
        <div class="d-flex justify-content-between">
          <button class="btn btn-primary" @click="addItem(product.id)">
            加入購物車
          </button>
          <button class="btn btn-outline-secondary" @click="router.go(-1)">
            返回
          </button>
        </div>
      </div>
    </div>
  </section>
</template>