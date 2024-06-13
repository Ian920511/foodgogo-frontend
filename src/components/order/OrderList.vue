<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOrderStore } from './../../stores/orderStore'
import { useAdminStore } from './../../stores/adminStore'
import { useStatusStore } from './../../stores/statusStore'
import { useUserStore } from './../../stores/userStore'
import { useAlert } from './../../utils/alert'
import SpinnerLoading from './../spinner/SpinnerLoading.vue'
import moment from 'moment'

const router = useRouter()
const orderStore = useOrderStore()
const adminStore = useAdminStore()
const userStore = useUserStore()
const { orderDetails, errorMessage, orders } = storeToRefs(orderStore)
const { currentUser } = storeToRefs(userStore)
const statusStore = useStatusStore()
const { isLoading, isProcessing } = storeToRefs(statusStore)
const { getAdminOrders } = adminStore
const { getOrderDetails, getOrders } = orderStore
const { showAlert } = useAlert()
const currentOrderId = ref(null)
const buyer = ref(null)

onMounted(async () => {
  
  try {
    if (!currentUser.value.isAdmin) {    
      await getOrders()
    } else {
      await getAdminOrders()
    }

  } catch (error) {
    showAlert('error', error)
    
    return router.replace({ name: 'ProductList' })
  } finally {
    isLoading.value = false
  }
})

const toggleOrderDetails = async (orderId) => {
  try {
    isProcessing.value = true

    if (currentOrderId.value === orderId) {
      currentOrderId.value = null
      return
    }

    if (currentUser.value.isAdmin) {
      const selectedOrder  = orders.value.filter((one) => {
        return one.id === orderId
      })
      buyer.value = selectedOrder[0].user
    }

    
    const detailResponse = await getOrderDetails({ orderId })
    
    orderDetails.value = detailResponse.data.order.orderDetail
    currentOrderId.value = orderId

  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isProcessing.value = false
  }
}

</script>

<template>
  <section class="container my-5">
    <SpinnerLoading v-if="isLoading" />
    <template v-else>
      <div class="row">
        <div class="col">
          <h3 class="mb-4 font-weight-bold d-flex align-items-center">
            訂單
          </h3>
        </div>
      </div>
      <p v-if="errorMessage" class="text-center text-danger">
        {{ errorMessage }}
      </p>
      <div v-if="orders && orders.length">
        <table class="table" v-for="order in orders" :key="order.id">
          <thead>
            <tr>
              <th>訂單編號</th>
              <th>日期</th>
              <th>總價</th>
              <th>詳細</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ order.id }}</td>
              <td>{{ moment(order.createdAt).format('L') }}</td>
              <td>{{ order.totalPrice }}</td>
              <td>
                <button class="btn btn-primary mt-3 px-5" @click="toggleOrderDetails(order.id)">
              展開
                </button>
              </td>
            </tr>
            <tr v-if="currentOrderId === order.id" >
              <td colspan="4">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th colspan="2" class="text-center">商品名稱</th>
                      <th>購買價格</th>
                      <th>數量</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="detail in orderDetails" :key="detail.id">
                      <td colspan="2" class="text-center">{{ detail.product.name }}</td>
                      <td>{{ detail.priceAtTime }}</td>
                      <td>{{ detail.quantity }}</td>
                    </tr>
                    <tr v-if="currentUser.isAdmin ">
                      <th>買家姓名</th>
                      <th>買家email</th>
                      <th>買家電話</th>
                      <th>買家地址</th>
                    </tr>
                    <tr v-if="currentUser.isAdmin"> 
                      <td>{{ buyer.username }}</td>
                      <td>{{ buyer.email }}</td>
                      <td>{{ buyer.tel }}</td>
                      <td>{{ buyer.address }}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-center">
        沒有訂單
      </p>
    </template>
  </section>
</template>