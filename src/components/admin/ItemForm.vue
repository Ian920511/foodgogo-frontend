<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminStore } from './../../stores/adminStore'
import { useStatusStore } from './../../stores/statusStore'
import { useProductStore } from './../../stores/productStore'

const productStore = useProductStore()
const adminStore = useAdminStore()
const statusStore = useStatusStore()
const { isProcessing } = storeToRefs(statusStore)
const { addOrUpdateItem, toggleModal } = adminStore
const { formData, modalType } = storeToRefs(adminStore)
const { categories } = storeToRefs(productStore)
const { getCategories } = productStore


const errorMessage = ref(null)

onMounted(async () => {
  await getCategories()
})

const handleFileChange = (event) => {
  const files = event.target.files

  if (files.length === 0) {
    formData.value.image = ''
  } else {
    const imageURL = window.URL.createObjectURL(files[0])

    formData.value.image = imageURL

  }
  
}

const handleSubmit = async (event) => {
  try {
    const form = event.target

    await addOrUpdateItem(form)

  } catch (error) {
    errorMessage.value = error.message;
  }
}

</script>


<template>
  <div class="container">
    <form class="my-2 my-lg-0 mx-auto" @submit.stop.prevent="handleSubmit">
      <h2 class="pb-3 text-center">
          {{ modalType === 'updateItem' ? '更新' : '新增' }}上架商品
      </h2>
      <div class="form-group">
        <label for="name">Name</label>
        <input id="name" v-model="formData.name" type="text" class="form-control" name="name" placeholder="Enter name"
          required>
      </div>

      <div class="form-group">
        <label for="categoryId">Category</label>
        <select id="categoryId" class="form-control" name="categoryId" v-model="formData.categoryId" required>
          <option value="" selected disabled>
            --請選擇--
          </option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="price">Price</label>
        <input id="price" v-model="formData.price" type="number" class="form-control" placeholder="Enter price" name="price">
      </div>

      <div class="form-label-group mb-3">
        <label for="role">Status</label>
        <select id="status" name="status" class="form-control" v-model="formData.active" required>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" class="form-control" rows="3" name="description" v-model="formData.description" />
      </div>

      <div class="form-group">
        <label for="image">Image</label>
        <img v-if="formData.image" :src="formData.image" class="d-block img-thumbnail mb-3" width="200" height="200">

        <input id="image" type="file" name="image" accept="image/*" class="form-control-file" @change="handleFileChange">
      </div>

      <p v-if="errorMessage" class="mb-4 text-center text-danger">
          {{ errorMessage }}
      </p>

      <button type="submit" class="btn btn-primary mr-2" 
        :disabled="isProcessing" >
          {{ modalType === 'updateItem' ? '更新' : '新增' }}商品
      </button>

      <button type="button" class="btn btn-primary" @click="toggleModal" >
            關閉
      </button>

    </form>
  </div>
</template>