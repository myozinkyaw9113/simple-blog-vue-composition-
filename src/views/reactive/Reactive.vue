<template>
    <div>

        <h1>Reactive</h1>

        <div>
            <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
            <select v-model="country" id="country" name="country" class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                <option disabled value="">Select a country</option>
                <option v-for="country in countries" :key="country.name">{{ country.name }}</option>
            </select>
        </div>

    </div>
</template>

<script> 
import { reactive, ref } from 'vue'
import Axios from 'axios'
export default {

    name : 'Reactive',

    setup() {
        const countries = ref([])
        const states = ref([])

        const country = ref('');

        // country
        Axios.get('https://countriesnow.space/api/v0.1/countries/states')
        // Axios.get('https://countriesnow.space/api/v0.1/countries/states')
        // Axios.get('https://countriesnow.space/api/v0.1/countries/flag/images')
        .then((res) => {
            console.log(res.data.data)
            countries.value = res.data.data
            
            countries.value.map((state) => {
                
            })
        })
        .catch((err) => {
            console.log(err)
        })


        return {
            countries,
            country,
            states
        }
    }

}
</script>

<style>

</style>