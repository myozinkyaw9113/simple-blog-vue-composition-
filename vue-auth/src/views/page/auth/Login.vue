<template>
<div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" action="#" method="POST">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1">
              <input id="email" name="email" v-model="form.email" type="email" autocomplete="email" required="" class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1">
              <input id="password" name="password" v-model="form.password" type="password" autocomplete="current-password" required="" class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
            </div>
          </div>

          <div>
            <button @click.prevent="formSubmit" type="submit" class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Sign in</button>
          </div>
        </form>
        </div>
      </div>
    </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import Api from "@/util/Api.js";
import { authStore } from '@/stores/auth.js';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

export default {

    name : 'Login',

    setup() {
      const router = useRouter();
        const form = reactive({
          email: 'test@test.com',
          password: 'secret',
        })
        
        function formSubmit(){
          Api.poster('/login', form).then((res)=>{
            authStore().setToken(res.data.data.token)
            router.push({ name : 'home' })
          })
          .catch(
            (err) => console.log(err)
          );
        }
        const { token } = storeToRefs(authStore());

        // onMounted(
        //   () => {
        //     if(token.value){
        //       router.push({ name: "home" })
        //     }
        //   }
        // )
        
        return {
            form,
            token,
            formSubmit  
        }

    }

}
</script>

<style>

</style>