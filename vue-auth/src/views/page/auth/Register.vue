<template>
    <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
            <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        </div>
        
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form class="space-y-6" action="#" method="POST">
                    <div>
                        <label for="company_name" class="block text-sm font-medium text-gray-700">Company Name</label>
                        <div class="mt-1">
                            <input id="company_name" name="company_name" v-model="form.company_name" type="text" required="" class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <select-menu menu_name="Choose a plan" :items="items" @selected="choosePlan"></select-menu> 

                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Your Name</label>
                        <div class="mt-1">
                            <input id="name" name="name" v-model="form.name" type="text" autocomplete="name" required="" class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                        <div class="mt-1">
                            <input id="email" name="email" v-model="form.email" type="email" autocomplete="email" required="" class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <div>
                        <label for="login_phone" class="block text-sm font-medium text-gray-700">Login phone</label>
                        <div class="mt-1">
                            <input id="login_phone" name="emalogin_phoneil" v-model="form.login_phone" type="number" autocomplete="login_phone" required="" class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
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
                        <button @click.prevent="register" type="submit" class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import { storeToRefs } from 'pinia';
    import { computed, onMounted, reactive, ref } from 'vue';
    import SelectMenu from '../../../components/SelectMenu.vue'
    import { useGetMenuList } from '../../../stores/list/GetMenuList'   
    import { useRouter } from 'vue-router';
    import { authStore } from '@/stores/auth.js';
    import Api from "@/util/Api.js"

    export default {
        
        name : 'Register',

        components : {
            'select-menu' : SelectMenu
        },
        
        setup() {
            const { items } = storeToRefs(useGetMenuList());
            const { getList } =  useGetMenuList();

            getList();
            const router=useRouter();
            const form = reactive({})

            function choosePlan(value)
            {
                form.plan_id = value
            }

            function register()
            {
                Api.poster('/register',form)
                .then((res)=>{
                    localStorage.setItem('phone',form.login_phone)
                    localStorage.setItem('mail',form.email)
                    router.push({name: "confirmationUser"})
                })
                .catch(
                    (err) => console.log(err)
                );
            }
            const { token } = storeToRefs(authStore());

            // onMounted(
            //     () => {
            //         if(token.value){
            //             router.push({ name: "home" })
            //         }
            //     }
            // )
            
            return {
                form,
                items,
                choosePlan,
                register
            }
            
        }
        
    }
</script>