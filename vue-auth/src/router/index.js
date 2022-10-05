import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/page/auth/Register.vue'
import Login from '../views/page/auth/Login.vue'
import Home from '../views/page/Home.vue'
import NotFound from '../views/page/NotFound.vue'
import { authStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import Api from '@/util/Api'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/:NotFound(.*)*',
      component: NotFound,
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  authStore().token = token
  console.log(token)
  console.log('hi wa lone lay')
  Api.puller('/test')
  .then(res => {
    // test
  })
  .catch(err => {
    authStore().removeToken()
    router.push({name:'login'})
  })
  if (!token && to.name !== 'login') {
    next({name : 'login'})
  } else if (token && to.name == 'login') {
    next({name : 'home'})
  } else {
    next()
  }
})

export default router
