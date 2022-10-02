<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
import products from "@/data/products.json";

import { useProductStore } from './stores/ProductStore.js'
import { useCartStore } from './stores/CartStore.js'
const productStore = useProductStore()
productStore.fill() 
const cartStore = useCartStore()

</script>

<template>
  <div class="container">
    <TheHeader />
    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <ProductCard
        v-for="product in productStore.products"
        :key="product.name"
        :product="product"
        @addToCart="cartStore.addItems($event, product)"
      />
    </ul>
  </div>
</template>
