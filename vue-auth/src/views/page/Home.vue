<template>
    <p>Home Page</p>
</template>

<script>
import { storeToRefs } from 'pinia';
import { authStore } from '@/stores/auth.js';

export default {
    
    setup() {
        const { token } = storeToRefs(authStore());

        // onMounted(
        //   () => {
        //     if(token == null){
        //       router.push({ name: 'login' })
        //     }
        //   }
        // )
        
        return {
            token
        }
    }

}

</script>