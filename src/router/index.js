import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Detail from '../views/Detail.vue'
import ShopList from '../views/ShopList.vue'
import CountryList from '../views/country/CountryList.vue'
import Reactive from '../views/reactive/Reactive.vue'
import VueOption1 from '../views/vueOption/VueOption1.vue'
import VueOption2 from '../views/vueOption/VueOption2.vue'
import VueComposition1 from '../views/vueComposition/VueComposition1.vue'
import VueComposition2 from '../views/vueComposition/VueComposition2.vue'

const routes =  [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/posts/:id',
    name: 'Detail',
    component: Detail,
    props: true,
  },
  {
    path: '/shop-list',
    name: 'ShopList',
    component: ShopList,
  },
  {
    path: '/country-list',
    name: 'CountryList',
    component: CountryList,
  },
  {
    path: '/reactive',
    name: 'Reactive',
    component: Reactive,
  },
  {
    path: '/vue-option1',
    name: 'VueOption1',
    component: VueOption1,
  },
  {
    path: '/vue-option2',
    name: 'VueOption2',
    component: VueOption2,
  },
  {
    path: '/vue-composition1',
    name: 'VueComposition1',
    component: VueComposition1,
  },
  {
    path: '/vue-composition2',
    name: 'VueComposition2',
    component: VueComposition2,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
