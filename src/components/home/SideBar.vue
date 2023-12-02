<script setup>
import { onMounted,  ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from './../../stores/productStore'

const productStore = useProductStore()
const { getCategories, setSearchResult } = productStore
const { categories, searchQuery } = storeToRefs(productStore)

onMounted(async () => {
  await getCategories()
})

const max = ref(1000)
const amountError = ref(null)

const handleFilterAmount = () => {
  if (
    max.value < 0 ||
    isNaN(max.value)
  ) {
    amountError.value = '請輸入合理的價格'
  } else {
    amountError.value = null
    searchQuery.value = { max }
    setSearchResult('amount')
  }
}

const handleFilterCategory = (categoryId) => {
  searchQuery.value = { categoryId }
  setSearchResult('category')
}
</script>

<template>
  <aside class="col-md-2">
    <div>
      <h3 class="mb-4 font-weight-bold text-primary">篩選</h3>

      <p class="mb-2 font-weight-semibold text-secondary">分類</p>
      <div class="mb-4">
        <span v-for="category in categories" :key="category.id" class="d-block cursor-pointer mb-1 category-item"
          @click="handleFilterCategory(category.id)">
          {{ category.name }}
        </span>
      </div>

      <p class="mb-2 font-weight-semibold text-secondary">金額上限</p>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text">NT$</span>
        </div>
        <input type="text" class="form-control" v-model="max" />
        <div class="input-group-append">
          <button class="btn btn-outline-primary" type="button" @click="handleFilterAmount">
            搜尋
          </button>
        </div>
      </div>

      <p v-if="amountError" class="text-danger">
        {{ amountError }}
      </p>
    </div>
  </aside>
</template>

<style>
.category-item:hover {
  font-size: 1.25em;
  cursor: pointer;
}
</style>