import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/products',
          name: 'ProductList',
          component: () => import('../views/ProductList.vue'),
        },
        {
          path: '/products/:productId',
          name: 'ProductDetail',
          component: () => import('../views/ProductDetail.vue'),
        }
      ]
    },
    {
      path: '/cart',
      name: 'CartView',
      component: () => import('../views/CartView.vue')
    },
    {
      path: '/orders',
      name: 'OrderView',
      component: () => import('../views/OrderView.vue')
    },
    {
      path: '/admin',
      name: 'AdminView',
      component: () => import('../views/AdminView.vue')
    }
  ]
})

export default router
