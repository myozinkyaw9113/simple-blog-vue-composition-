import { onMounted, ref } from 'vue'
import { defineStore } from 'pinia'

export const authStore = defineStore('authStore',()=>{
    /*
        variable
    */
   const token = ref(null)

   /*
        method
   */
  const setToken = (authToken) => {
    localStorage.setItem('token', authToken);
    token.value = authToken
  }

  const getToken = () => {
    token.value = localStorage.getItem('token');
    return localStorage.getItem('token')
  }

  const removeToken = () => {
    token.value = "",
    localStorage.removeItem('token');
  }

  onMounted(()=>getToken());

  return {
    token,
    setToken,
    getToken,
    removeToken
  }
});