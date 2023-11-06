<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="bg-warning">
    <div class="container-fluid p-5 px-md-10 text-center">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <router-link :to="{ name: 'ProductList' }">
            <img class="w-25" src="../../assets/logo.jpg" alt="logo" />
          </router-link>
        </div>
        <div>
          <h3 class="text-lg font-weight-bold">關於我們</h3>
          <ul class="mt-1">
            <li>品牌故事</li>
            <li>加入我們</li>
            <li>隱私權政策</li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-weight-bold">關注我們</h3>
          <ul class="mt-1">
            <li><a href="#" class="text-decoration-none text-reset">Line</a></li>
            <li><a href="#" class="text-decoration-none text-reset">Facebook</a></li>
            <li><a href="#" class="text-decoration-none text-reset">Instagram</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-weight-bold">顧客服務</h3>
          <ul class="mt-1">
            <li>常見問題</li>
            <li>運送服務方式</li>
            <li>退換貨政策</li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-weight-bold">聯絡我們</h3>
          <ul class="mt-1">
            <li>週一至週日</li>
            <li>AM 10:30 - 14:30</li>
            <li>PM 17:00 - 22:30</li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>