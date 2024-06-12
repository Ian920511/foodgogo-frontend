<script setup>
import { useAdminStore } from './../../stores/adminStore'
import { useAlert } from './../../utils/alert'


defineProps(['active', 'product'])

const adminStore = useAdminStore()
const { toggleModal, toggleActive, deleteItem } = adminStore
const { showAlert } = useAlert()

const handleRemoveProduct = (id) => {
  showAlert('warning', '確定要刪除商品嗎?', true).then((result) => {
    if (result.isConfirmed) {
      return deleteItem(id)
    }
    return
  })
}


</script>


<template>
  <tr class="text-center">
    <td>
      <button v-if="!active" class="btn btn-danger btn-sm" :disabled="isProcessing" 
      @click="handleRemoveProduct(product.id)">刪除
      </button>
      <button v-if="active" class="btn btn-success btn-sm"
      :disabled="isProcessing" 
      @click="toggleActive(product.id, active)"> 下架
      </button>
      
    </td>
    <td>
      <img :src="product.image" class="img-fluid" style="height: 100px; width: auto;" />
    </td>
    <td>{{ product.name }}</td>
    <td>{{ product.description }}</td>
    <td>NT$ {{ product.price }}</td>
    <td>{{ product.stock }}</td>
    <td>
      <button v-if="!active" class="btn btn-primary btn-sm" :disabled="isProcessing" 
      @click="toggleActive(product.id, active)"> 上架
      </button>
      <button v-else class="btn btn-primary btn-sm" 
      @click="toggleModal(product.id)">
        更新
      </button>
    </td>
  </tr>

</template>