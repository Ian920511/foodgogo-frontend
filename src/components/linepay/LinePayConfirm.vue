<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import linePayApi from './../../apis/linepay';
import { useAlert } from './../../utils/alert';

const router = useRouter();
const route = useRoute();
const { showAlert } = useAlert();

onMounted(async () => {
  const { transactionId, orderId } = route.query

  if (transactionId && orderId) {
    try {
      const response = await linePayApi.LinePayConfirm(transactionId, orderId)
      
      if (response.status === 'success') {
        showAlert('success', response.message)
        
      } else {
        showAlert('error', response.message)
      } 

      router.push({ name: 'OrderView' })

    } catch (error) {
      console.error(error)
      showAlert('error', '付款失敗，請重新選購')

      router.push({ name: 'ProductList' })
    }
  }
})

</script>

<template>
  <div class="payment-confirmation-container d-flex align-items-center justify-content-center">
    <h1 class="text-center">付款確認中</h1>
  </div>
</template>

<style scoped>
.payment-confirmation-container {
  height: 60vh;
}
</style>