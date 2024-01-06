<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAlert } from './../../utils/alert'
import { storeToRefs } from 'pinia'
import { useUserStore } from './../../stores/userStore'
import { useStatusStore } from './../../stores/statusStore'
import { useProductStore } from './../../stores/productStore'
import authorizationApi from './../../apis/authorization'

const router = useRouter()
const userStore = useUserStore()
const statusStore = useStatusStore()
const { isProcessing } = storeToRefs(statusStore)
const { isAuthenticated, currentUser, favorites }  = storeToRefs(userStore)
const productStore = useProductStore()
const { getFavorites } = userStore
const { setSearchResult, getProducts } = productStore
const { searchQuery } = storeToRefs(productStore)

const isLoginMode = ref(true)
const loginEmail = ref('')
const loginPassword = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const passwordConfirm = ref('')
const username  = ref('')
const tel = ref('')
const address = ref('')
const errorMessage = ref(null)
const showModal = ref(false)
const { showAlert } = useAlert()

const toggleModal = () => {
  showModal.value = !showModal.value

  errorMessage.value = null
}

const toggleLoginRegister = () => {
  isLoginMode.value = !isLoginMode.value

  errorMessage.value = null
}


const handleLogin = async () => {
  try {

    isProcessing.value = true

    if (!loginEmail.value || !loginPassword.value) { 
      throw new Error('請輸入信箱和密碼')
    } 

    const response = await authorizationApi.login({
      email: loginEmail.value,
      password: loginPassword.value
    })

    localStorage.setItem('token', response.token)
    userStore.setCurrentUser(response.user)

    toggleModal()

    showAlert('success', '登入成功')

    await getFavorites()
    
  } catch (error) {
    
    errorMessage.value = error.message
  } finally {
    isProcessing.value = false
  }
}

const handleRegister = async () => {
  try {

    isProcessing.value = true
    
    if (!registerEmail.value || !registerPassword.value || !passwordConfirm.value || !address.value || !tel.value || !username.value) {
      throw new Error('請填寫註冊需要的資訊');
    }

    if (registerPassword.value !== passwordConfirm.value) {
      throw new Error('兩次輸入密碼不同');
    }

    await authorizationApi.register({
      email: registerEmail.value,
      password: registerPassword.value,
      address: address.value,
      tel: tel.value,
      username: username.value,
      confirmPassword: passwordConfirm.value
    })

    showAlert('success', '註冊成功')

    toggleLoginRegister()

  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isProcessing.value = false
  }
}


const logout = () => {
  favorites.value = []

  userStore.revokeAuthentication()

  showAlert('success', '登出成功')

  router.replace({ name: 'ProductList' })
}

const handleReset = async () => {
  searchQuery.value = ''
  router.replace({ name: 'ProductList' });
  await getProducts()
}

</script>



<template>
  <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #ffffff;">
    <router-link class="navbar-brand" @click.prevent="handleReset" :to="{ name: 'ProductList' }">
      <img src="../../assets/logo.jpg" alt="Logo" style="height: 80px;">
    </router-link>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <form class="form-inline my-2 my-lg-0 mx-auto">
        <input class="form-control mr-sm-2" type="search" placeholder="您想找什麼？" aria-label="Search" v-model="searchQuery"
          style="width: 300px;">
        <button class="btn btn-outline-dark my-2 my-sm-0" @click.prevent="setSearchResult('keyword')">搜索</button>
      </form>

      <button class="btn btn-dark my-2 my-sm-0 mr-3" @click="router.push({ name: 'OrderView' })">
            訂單
      </button>
      
      <button v-if="currentUser.isAdmin" class="btn btn-dark my-2 my-sm-0 mr-3" 
      @click="router.push({ name: 'AdminView' })">
            後臺管理
          </button>
      <div v-else class="relative">
        <button class="btn btn-dark my-2 my-sm-0 mr-3" @click="router.push({ name: 'CartView' })">
          購物車
        </button>
      </div>
  
      <button class="btn btn-dark my-2 my-sm-0"  @click="isAuthenticated ? logout() : toggleModal()">
        {{ isAuthenticated ? '登出' : '登入' }}
      </button>
    </div>
  </nav>

  <div v-if="showModal" class="modal show" id="authModal" tabindex="-1" role="dialog" aria-labelledby="authModalLabel" aria-hidden="true" style="display: block;">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="authModalLabel">{{ isLoginMode ? '登入' : '註冊' }}</h5>
          <button type="button" class="close" @click="showModal = false" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p v-if="errorMessage" class="text-center text-danger">{{ errorMessage }}</p>
          <form v-if="isLoginMode" @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="email">信箱:</label>
              <input type="email" class="form-control" id="email" v-model="loginEmail" required>
            </div>
            <div class="form-group">
              <label for="password">密碼:</label>
              <input type="password" class="form-control" id="password" v-model="loginPassword" required>
            </div>
            <div class="form-group form-check">
              <input type="checkbox" class="form-check-input" id="rememberMe">
              <label class="form-check-label" for="rememberMe">記住我</label>
            </div>
              <button type="submit" :disabled="isProcessing" class="btn btn-primary">登入</button>
          </form>
          <form v-else @submit.prevent="handleRegister">
            <div class="form-group">
                <label for="reg-email">信箱:</label>
                <input type="email" class="form-control" id="reg-email" v-model="registerEmail" required>
              </div>
              <div class="form-group">
                <label for="reg-password">密碼:</label>
                <input type="password" class="form-control" id="reg-password" v-model="registerPassword" required>
              </div>
              <div class="form-group">
                <label for="password-confirm">確認密碼:</label>
                <input type="password" class="form-control" id="password-confirm" v-model="passwordConfirm" required>
              </div>
              <div class="form-group">
                  <label for="username">姓名:</label>
                  <input type="text" class="form-control" id="username" v-model="username" required>
              </div>
              <div class="form-group">
                  <label for="address">地址:</label>
                  <input type="text" class="form-control" id="address" v-model="address" required>
              </div>
              <div class="form-group">
                  <label for="tel">電話:</label>
                  <input type="text" class="form-control" id="tel" v-model="tel" required>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="isProcessing" >註冊</button>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="toggleLoginRegister">
            {{ isLoginMode ? '沒有帳號？註冊' : '已有帳號？登入' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  
</template>