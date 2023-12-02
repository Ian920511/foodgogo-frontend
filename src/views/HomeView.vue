<script setup>
import { RouterView } from 'vue-router'
import FoodSection from '../components/home/FoodSection.vue';
import SideBar from './../components/home/SideBar.vue'
</script>

<template>
  <main>
      <FoodSection/>
      <section class="d-flex px-4 py-3">
        <SideBar />
        <RouterView />
      </section>
    </main>
</template>