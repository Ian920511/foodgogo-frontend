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
const { isAuthenticated } = storeToRefs(userStore)
const { showAlert } = useAlert()

onMounted(() => {
  if (!isAuthenticated.value ) {
    showAlert('error', '請先登入才能使用功能' )
    return router.replace({ name: 'ProductList' })
  }
})

</script>

<template>
  <main v-if= "isAuthenticated" class="px-10 py-12">
    <CartList />
  </main>
</template>