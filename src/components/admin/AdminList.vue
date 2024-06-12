<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAdminStore } from './../../stores/adminStore'
import { useStatusStore } from './../../stores/statusStore'
import { useAlert } from './../../utils/alert'
import adminProduct from './AdminProduct.vue'
import SpinnerLoading from './../spinner/SpinnerLoading.vue'


const router = useRouter()
const adminStore = useAdminStore()
const { toggleModal, getItems } = adminStore
const { activeProducts, nonActiveProducts, errorMessage } =
  storeToRefs(adminStore)
const statusStore = useStatusStore()
const { isLoading } = storeToRefs(statusStore)
const { showAlert } = useAlert()

const props = defineProps(['active'])
const title = props.active ? '上架' : '下架'
const tableHeader = props.active ? '下架' : '刪除'
const products = props.active ? activeProducts : nonActiveProducts


onMounted(async () => {
  try {
    await getItems()
  
  } catch (error) {
    showAlert('error', error)
    return router.replace({ name: 'ProductList' })
  }
})
</script>

<template>
  <section :class="{ 'mt-4': active }">
    <SpinnerLoading v-if="isLoading" />
    <template v-else>
      <h3 :class="{ 'mt-12': !active }" class="mb-3 text-center font-weight-bold">
        {{ title }}商品清單

        <button v-if="active" class="btn btn-warning float-right" 
        @click="toggleModal()">
          新增上架商品
        </button>
      </h3>

      <p v-if="errorMessage" class="text-danger text-center">
        {{ errorMessage }}
      </p>

      <div class="table-responsive container">
        <table class="table" v-if="products && products.length">
          <thead>
            <tr>
              <th class="w-10" scope="col">{{ tableHeader }}</th>
              <th class="w-15" scope="col">商品圖片</th>
              <th class="w-20" scope="col">商品名稱</th>
              <th class="w-25" scope="col">商品描述</th>
              <th class="w-15" scope="col">商品單價</th>
              <th class="w-15" scope="col">商品庫存</th>
              <th class="w-15" scope="col">{{ active ? '更新' : '上架' }}商品</th>
            </tr>
          </thead>
          <tbody>
            <adminProduct v-for="product in products" :key="product.id" :active="active" :product="product" />
          </tbody>
        </table>
      </div>

      <p v-if=" products && !products.length" class="text-center">
        沒有{{ title }}商品
      </p>
    </template>
  </section>
</template>