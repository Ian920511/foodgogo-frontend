<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOrderStore } from './../../stores/orderStore'
import { useCartStore } from './../../stores/cartStore'
import { useStatusStore } from './../../stores/statusStore'
import { useAlert } from './../../utils/alert'
import CartItem from './CartItem.vue'
import SpinnerLoading from './../spinner/SpinnerLoading.vue'

const router = useRouter()
const orderStore = useOrderStore()
const cartStore = useCartStore()
const { getCartItems } = cartStore
const { cartItems, totalPrice, errorMessage } = storeToRefs(cartStore)
const statusStore = useStatusStore()
const { isLoading } = storeToRefs(statusStore)
const { postOrder } = orderStore
const { showAlert } = useAlert()

onMounted(async () => {
  try {
    await getCartItems()
    
  } catch (error) {
    showAlert('error', error)
    return router.replace({ name: 'ProductList' })
  }
})

const submitOrder = async () => {
  const text = `總金額：NT$ ${totalPrice.value}`

  showAlert('info', `確定要結帳嗎? ${text} 元`, true).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await postOrder()
        
        if (response.data.status === 'success') {
          cartItems.value = []

          const paymentUrl = response.data.data.paymentUrl
          window.location.href = paymentUrl

        } else {
          showAlert('error', '期待您再次消費' )
        }
        
      } catch (error) {
        showAlert('error', '下訂單失敗，請稍後再試' )
      }
    }
    return
  })
}

</script>

<template>
    <section class="container my-5">
      <SpinnerLoading v-if="isLoading" />
      <template v-else>
        <div class="row">
          <div class="col">
            <h3 class="mb-4 font-weight-bold d-flex align-items-center">
              購物車
            </h3>
          </div>
        </div>
        <p v-if="errorMessage" class="text-center text-danger">
          {{ errorMessage }}
        </p>
        <div v-if="cartItems && cartItems.length">
          <table class="table">
            <thead>
              <tr>
                <th class="text-center">刪除</th>
                <th class="text-center">圖片</th>
                <th class="text-center">名稱</th>
                <th class="text-center">單價</th>
                <th class="text-center">庫存</th>
                <th class="text-center">數量</th>
                <th class="text-center">總計</th>
              </tr>
            </thead>
            <tbody>
              <CartItem v-for="cartItem in cartItems" :key="cartItem.id" :cartItem="cartItem" />
            </tbody>
          </table>
        </div>
        <p v-else class="text-center">
          購物車內沒有商品
        </p>
        <div class="text-right mt-4">
          <p class="font-weight-bold h4">總金額： NT$ {{ totalPrice }}</p>
          <button class="btn btn-warning mt-3 px-5" :disabled="!cartItems.length" @click="submitOrder">
            結帳
          </button>
        </div>
      </template>
    </section>
</template>