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
      path: '/linepay/confirm',
      name: 'PaymentConfirmation',
      component: () => import('./../views/LinePayView.vue')
    },
    {
      path: '/admin',
      name: 'AdminView',
      component: () => import('./../views/AdminView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'ProductList' }
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   if (to.path === '/orders' && (to.query.transactionId || to.query.orderId)) {
//     next({ path: '/orders',  replace: true });
//   } else {
//     next();
//   }
// })

export default router
