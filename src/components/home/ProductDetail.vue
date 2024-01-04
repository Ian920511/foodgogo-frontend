<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from './../../stores/userStore'
import { useProductStore } from './../../stores/productStore'
import { useStatusStore } from './../../stores/statusStore'
import { useCartStore } from './../../stores/cartStore'
import { useAlert } from './../../utils/alert'
import moment from 'moment'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const productStore = useProductStore()
const cartStore = useCartStore()
const statusStore = useStatusStore()
const { isProcessing } = storeToRefs(statusStore)
const { isAuthenticated, currentUser } = storeToRefs(userStore)
const { product, errorMessage, reviews } = storeToRefs(productStore)
const { getProduct } = productStore
const { addCartItem } = cartStore
const { showAlert } = useAlert()

onMounted(async () => {
  await getProduct(route.params.productId)
})

const fromNow = computed(() => (datetime) => {
  if (!datetime) {
    return '-';
  }
  return moment(datetime).fromNow();
})

const addItem = async (productId) => {
  try {
    if (!isAuthenticated.value) {
      return showAlert('error', '請先登入才能使用功能')
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
        <div class="d-flex justify-content-end">
          <button class="btn btn-primary m-2" :disabled="isProcessing" @click="addItem(product.id)">
              加入追蹤
            </button>
          <button class="btn btn-primary m-2" :disabled="isProcessing" @click="addItem(product.id)">
            加入購物車
          </button>
          <button class="btn btn-outline-secondary m-2" @click="router.go(-1)">
            返回
          </button>
        </div>
      </div>
    </div>
     <div>
      <h2 class="my-4">
        所有評論：
      </h2>

      <div>
        <blockquote class="blockquote mb-0" v-for="review in reviews" :key="review.id">
          <button
            v-if="currentUser.isAdmin"
            type="button"
            class="btn btn-danger float-right"
          >
            Delete
          </button>
          <h3>
              {{ review.user.username }}
          </h3>
          <p>{{ review.comment }}</p>
          <footer class="blockquote-footer">
            {{ fromNow(review.createdAt) }}
          </footer>
        </blockquote>
        <hr>
      </div>
    </div>
  </section>
</template>