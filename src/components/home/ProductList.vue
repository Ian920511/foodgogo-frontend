<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProductStore } from './../../stores/productStore'
import { useUserStore } from './../../stores/userStore'
import { useStatusStore } from './../../stores/statusStore'
import ProductItem from './ProductItem.vue'
import SpinnerLoading from './../spinner/SpinnerLoading.vue'


const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const productStore = useProductStore()
const {
  products,
  searchResult,
  searchQuery,
  sortedProduct,
  errorMessage,
  orderBy
} = storeToRefs(productStore)
const statusStore = useStatusStore()
const { isLoading } = storeToRefs(statusStore)
const { favorites } = storeToRefs(userStore)
const { getProducts } = productStore
const currentTab = ref('products')

onMounted(async () => {
  if (Object.keys(route.query).includes('keyword')) {
    searchQuery.value = Object.values(route.query)[0]
  }
  orderBy.value = route.query.orderBy || 'createdAt'
  await getProducts({ ...route.query, orderBy: orderBy.value })
})

const handleChangeOrderBy = () => {
  router.replace({
    name: 'ProductList',
    query: { ...route.query, orderBy: orderBy.value }
  })
}
</script>

<template>
    <section class="container mt-3">
      <SpinnerLoading v-if="isLoading" />
      <template v-else>
        <ul class="nav nav-tabs mb-5">
          <li class="nav-item">
            <a class="nav-link " :class="{ active: currentTab === 'products' }" @click="currentTab = 'products'" style="cursor: pointer">上架商品</a>
          </li>
          <li class="nav-item">
            <a class="nav-link " :class="{ active: currentTab === 'favorites' }" @click="currentTab = 'favorites'" style="cursor: pointer">追蹤商品</a>
          </li>
        </ul>
        <div v-if="currentTab === 'products'" class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="font-weight-bold text-dark">上架商品</h3>
          <div style="width: 200px;">
            <select class="cursor-pointer form-control form-control-sm" v-model="orderBy" @change="handleChangeOrderBy"
              style="width: 100%;">
              <option value="createdAt">依上架時間排序</option>
              <option value="priceDesc">依金額高到低排序</option>
              <option value="priceAsc">依金額低到高排序</option>
            </select>
          </div>
        </div>
        <p v-if="errorMessage" class="text-center text-danger">
          {{ errorMessage }}
        </p>
        <div v-if="currentTab === 'products'">
          <div v-if="searchResult && searchResult.length" class="row">
            <div v-for="product in sortedProduct" :key="product.id" class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
              <ProductItem :product="product" />
            </div>
          </div>
          <p v-else-if="!searchResult && products && !products.length" class="text-center">
            目前沒有商品
          </p>
          <p v-else class="text-center">
            找不到搜尋結果
          </p>
        </div>
        <div v-else class="row">
          <div v-for="favorite in favorites" :key="favorite.id" class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
            <ProductItem :product="favorite.product" />
          </div>
          <p v-if="favorites.length === 0" class="text-center">
            還沒有追蹤任何商品
          </p>
        </div>
      </template>
    </section>
</template>