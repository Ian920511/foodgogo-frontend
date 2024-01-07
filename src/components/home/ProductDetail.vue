<script setup>
import { onMounted, computed, ref, watch  } from 'vue'
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
const { isAuthenticated, currentUser, favorites } = storeToRefs(userStore)
const { product, errorMessage, reviews } = storeToRefs(productStore)
const { getFavorites, addFavorite, removeFavorite, addReview, removeReview } = userStore
const { getProduct } = productStore
const { addCartItem } = cartStore
const { showAlert } = useAlert()
const isFavorited = ref(false)
const text = ref('')
const rating = ref('')

onMounted(async () => {
  await getProduct(route.params.productId)

  if (isAuthenticated.value) {
    await getFavorites()
  }
})

watch(favorites, (newFavorites) => {
  isFavorited.value = newFavorites.some((favorite) => 
  favorite.product.id === route.params.productId)
}, { immediate: true })


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

      isFavorited.value = false
    } else {
      const { status, message } = await addFavorite({ productId })

      if (status === 'success') {
        const newFavorite = { product }
        favorites.value.push(newFavorite)


        showAlert('success', message)
      }

      isFavorited.value = true
    }

  } catch (error) {
    showAlert('error', error)
  }
}

const handlePostReview = async () => {
  try {
    const productId = route.params.productId

    if (!text.value) {
      return showAlert('error', '評論必須輸入內容')
    }

    if (!rating.value) {
      return showAlert('error', '評論必須輸入等級')
    }
    
    const response = await addReview({ productId, comment: text.value, rating: rating.value })

    const newReview = {
      ...response.data.data.review,
      user: {
        username:  currentUser.value.name
      }
    }

    reviews.value = [newReview, ...reviews.value]

  } catch (error) {
    showAlert('error', error)
  }

}

const handleRemoveReview = (reviewId) => {

  showAlert('warning', '確定要刪除此評論嗎?', true).then((result) => {
    if (result.isConfirmed) {

      return removeReview(reviewId)
    }
    return
  })
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
          <button class="btn m-2" :disabled="isProcessing" 
          :class="isFavorited ? 'btn-danger' : 'btn-primary'"
          @click="toggleFavorite(product.id)">
              {{ isFavorited ? '取消追蹤' : '加入追蹤' }}
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

      <div v-if='reviews && reviews.length' >
        <blockquote class="blockquote mb-0" v-for="review in reviews" :key="review.id">
          <button
            v-if="currentUser.isAdmin"
            type="button"
            @click="handleRemoveReview(review.id)"
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
      <p v-else class="text-center">
        目前沒有評論
      </p>
    </div>

    <div class="form-group">
      <label for="rating">rating</label>
      <select id="rating" v-model.number="rating" class="form-control" name="rating" required>
        <option value="" disabled selected>Enter rating</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
    <form>
      <div class="form-group mb-4">
        <label for="text">留下評論：</label>
        <textarea
          v-model="text"
          class="form-control"
          rows="3"
          name="text"
        />
      </div>
      <div class="d-flex align-items-center justify-content-between">
        <button
          type="button"
          class="btn btn-primary mr-0"
          @click="handlePostReview()"
        >
          Submit
        </button>
      </div>
    </form>
  </section>
</template>