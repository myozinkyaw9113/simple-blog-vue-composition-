<template>
    <div>
        <div v-if="countries.length">
            <ListComponent :list="countries" :listname="listname" />
        </div>
        <div v-else>
            {{ error }}
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import ListComponent from '../../components/list/ListComponent.vue'
export default {

    name: "CountryList",

    components : { ListComponent },

    setup() {
        const listname = ref('Country List');
        const countries = ref([]);
        const error = ref(null);
        const load = async () => {
            try {
                let data = await fetch("http://localhost:3000/countries");
                if (!data.ok) {
                    throw Error("No country data available");
                }
                countries.value = await data.json();
                // console.log(countries.value);
            }
            catch (err) {
                error.value = err.message;
            }
        };

        load()

        return { countries, error, load, listname };
    },
    components: { ListComponent }
}
</script>

<style>

</style>