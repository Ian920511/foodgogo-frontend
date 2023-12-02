<script setup>
import { RouterView } from 'vue-router'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import PageHeader from './components/header/PageHeader.vue'; 
import PageFooter from './components/footer/PageFooter.vue';


</script>

<template>
  <PageHeader />
  <RouterView />
  <PageFooter />
</template>

