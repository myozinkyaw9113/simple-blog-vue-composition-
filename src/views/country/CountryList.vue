<template>
    <div>

        <div v-if="loading" class="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
            <div class="animate-pulse flex space-x-4">
                <div class="rounded-full bg-slate-700 h-10 w-10"></div>
                <div class="flex-1 space-y-6 py-1">
                <div class="h-2 bg-slate-700 rounded"></div>
                <div class="space-y-3">
                    <div class="grid grid-cols-3 gap-4">
                    <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div class="h-2 bg-slate-700 rounded col-span-1"></div>
                    </div>
                    <div class="h-2 bg-slate-700 rounded"></div>
                </div>
                </div>
            </div>
        </div>
        
        <div v-if="products.length">
            <ListComponent :list="products" :listname="listname" />
        </div>
        <div v-else>
            {{ error }}
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import ListComponent from '../../components/list/ListComponent.vue'
export default {

    name: "CountryList",

    components : { ListComponent },

    setup() {
        const listname = ref('Products   List');
        const loading = ref(true)
        const products = ref([]);
        const error = ref(null);
        const load = async () => {
            try {
                let data = await fetch("https://fakestoreapi.com/products");
                if (!data.ok) {
                    throw Error("No country data available");
                }
                products.value = await data.json();
                loading.value = ! loading.value
            }
            catch (err) {
                error.value = err.message;
            }
        };

        onMounted(() => {
            load()
        })

        return { products, error, load, listname, loading };
    },
    components: { ListComponent }
}
</script>

<style>

</style>