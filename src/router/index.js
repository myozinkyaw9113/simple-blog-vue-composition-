import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Detail from '../views/Detail.vue'
import ShopList from '../views/ShopList.vue'
import CountryList from '../views/country/CountryList.vue'
import PiniaFundamentals from '../views/pinia/PiniaFundamentals.vue';

const routes =  [
  {
    path: '/',
    name: 'ome',
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
    path: '/pinia-fundamentals',
    name: 'PiniaFundamentals',
    component: PiniaFundamentals,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
