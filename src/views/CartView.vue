<script setup>
import { defineAsyncComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from './../stores/userStore'
import { useAlert } from './../utils/alert'

const CartList = defineAsyncComponent(() =>
  import('./../components/cart/CartList.vue')
)

const router = useRouter()
const userStore = useUserStore()
const { isAuthenticate, currentUser } = storeToRefs(userStore)
const { showAlert } = useAlert()

// onMounted(() => {
//   if (!isAuthenticate.value || !currentUser.value.isAdmin ) {
//     const title = !isAuthenticate.value
//       ? '請先註冊或登入才能使用功能'
//       : '沒有使用該頁面的權限'

//     showAlert('error', title)
//     return router.replace({ name: 'ProductList' })
//   }
// })
// v -if= "isAuthenticate && !currentUser.isAdmin "
</script>

<template>
  <main  class="px-10 py-12">
    <CartList />
  </main>
</template>