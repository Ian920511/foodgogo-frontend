import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'ProductList',
          component: () => import('./../components/home/ProductList.vue'),
        },
        {
          path: 'product/:productId',
          name: 'ProductDetail',
          component: () => import('./../components/home/ProductDetail.vue'),
        }
      ]
    },
    {
      path: '/cart',
      name: 'CartView',
      component: () => import('./../views/CartView.vue')
    },
    {
      path: '/orders',
      name: 'OrderView',
      component: () => import('./../views/OrderView.vue')
    },
    {
      path: '/admin',
      name: 'AdminView',
      component: () => import('./../views/AdminView.vue')
    }
  ]
})

export default router
