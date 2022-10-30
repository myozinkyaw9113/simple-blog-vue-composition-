<template>
    <div>
        <h1 class="text-2xl text-black font-bold mb-5">Vue Option1</h1>

        <div class="mb-5">

            <router-link class="mr-3 text-xl underline" :to="{ name: 'Home' }">Home</router-link>

            <router-link class="mr-3 text-xl underline" :to="{ name: 'VueOption1' }">option1</router-link>

            <router-link class="mr-3 text-xl underline" :to="{ name: 'VueOption2' }">option2</router-link>

        </div>

        <button class="px-4 py-1 bg-red-500 focus:bg-red-300 border-2 border-red-500 text-white rounded-md"  
            @click="alert(message)"
        >
        Alert
        </button>
    </div>
</template>

<script>
import alert from '@/mixins/alert.js';

export default {
    mixins : [alert],
    data() {
        return {
            message: "Hello Vue Option1 !",
        }
    },
}
</script>