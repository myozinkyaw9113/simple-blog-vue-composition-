<template>
    <div>
        <h1 class="text-2xl text-black font-bold mb-5">Vue Composition1</h1>

        <div class="mb-5">

            <router-link class="mr-3 text-xl underline" :to="{ name: 'Home' }">Home</router-link>

            <router-link class="mr-3 text-xl underline" :to="{ name: 'VueComposition1' }">composition1</router-link>

            <router-link class="mr-3 text-xl underline" :to="{ name: 'VueComposition2' }">composition2</router-link>

        </div>

        <button class="px-4 py-1 bg-red-500 focus:bg-red-300 border-2 border-red-500 text-white rounded-md"  
            @click="flash('Hello Composition1')"
        >
        Alert
        </button>
    </div>
</template>

<script setup>
import useFlash from '@/composables/useFlash.js'

let { flash } = useFlash()

</script>