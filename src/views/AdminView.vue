<script setup>
import { defineAsyncComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from './../stores/userStore'
import { useAdminStore } from './../stores/adminStore'


import { useAlert } from './../utils/alert'

const router = useRouter()
const userStore = useUserStore()
const adminStore = useAdminStore()

const { isAuthenticated, currentUser } = storeToRefs(userStore)
const { showItemModal } = storeToRefs(adminStore)

const { showAlert } = useAlert()

const ItemForm = defineAsyncComponent(() =>
  import('./../components/admin/ItemForm.vue')
)
const AdminList = defineAsyncComponent(() =>
  import('./../components/admin/AdminList.vue')
)


onMounted(() => {
  if (!isAuthenticated.value || !currentUser.value?.isAdmin ) {
    const title = !isAuthenticated.value
      ? '請先登入才能使用功能'
      : '沒有使用該頁面的權限'

    showAlert('error', title)

    return router.replace({ name: 'ProductList' })
  }
})

</script>

<template>
  <main v-if="isAuthenticated && currentUser.isAdmin" class="px-10 py-12">
    <ItemForm v-if="showItemModal" />
    <AdminList :active="true" />
    <AdminList :active="false" />
  </main>
</template>