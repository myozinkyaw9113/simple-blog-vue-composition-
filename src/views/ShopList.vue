<template>

  <div class="bg-white py-12">

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <div class="lg:text-center">

        <div class="flex items-center">

          <h2 class="font-semibold text-3xl font-bold  text-indigo-600 sm:text-4xl">{{ app_name }}</h2> 

          <span class="mx-14"></span>

          <div>
            
            <button v-if="isAddItem" @click="addItem(false)" type="button" class="rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Cancel</button>
            
            <button v-else type="button" @click="addItem(true)" class="rounded-md border border-transparent bg-indigo-600 p-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Add item</button> 
            
          </div>

        </div>

        <div class="shadow mt-7 py-5 border-2 border-indigo-100">

          <form v-if="isAddItem" @submit.prevent="saveItem" class="m-2 p-3 rounded-md">

            <div class="flex items-center">

              <div>
                
                <label for="email" class="text-lg font-medium text-gray-700">Item : </label>
                
                <input type="text" v-model="newItem" class="p-2 rounded-md border-indigo-300 border-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Add a new item" />
              
              </div>

              <div class="mx-1">

                <input id="priority" type="checkbox" v-model="newItemHighPriority">

                <label class="text-lg font-medium text-gray-700 cursor-pointer" for="priority">High Priority</label>

              </div>

              <div>

                <button :disabled="newItem.length < 5" @click="saveItem" type="button" class="rounded-md border border-transparent bg-indigo-600 p-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save item</button>

              </div>

            </div>

              <p class="mt-3">{{ charactercount }} / 400</p>

          </form>


          <p v-if="items.length" class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">

            <ul>

              <li v-for="item in reverseItems" 
              @click="toggle(item)"
              :key="item.id"
              class="cursor-pointer"
              :class="{
                'line-through' : item.purchased,
                'text-amber-500' : item.hightPriority
                }"
              >
              {{ item.id }}. {{ item.label }}
              </li>

            </ul>

          </p>
          
          <p v-else class="my-10 text-xl font-bold underline bg-indigo-100 py-2">
            No items in the list !
            <button type="button" @click="increment" class="ml-5 rounded-full border border-transparent bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              {{ state.count }}
            </button>
          </p>

        </div>
      
      </div>

    </div>

  </div>

</template>

<script setup>
import { ref, computed, reactive } from 'vue';
const app_name = ref('Shopping List App')

const items = ref([
  // {id : 1, label : 'To buy Milk', purchased : false, hightPriority : true},
  // {id : 2, label : 'To buy food', purchased : false, hightPriority : false},
  // {id : 3 , label : 'To buy cookies', purchased : true, hightPriority : true}
])
const newItem = ref('')
const newItemHighPriority = ref(false)
const isAddItem = ref(false)
const charactercount = computed(() => newItem.value.length)
const reverseItems = computed(() => [...items.value].reverse())
const saveItem = () => {
  if (newItem.value ==='') {
    alert('No value detected !')
    return
  }
  items.value.push({ id : items.value.length+1, label : newItem.value, hightPriority : newItemHighPriority.value })
  newItem.value = ''
  newItemHighPriority.value = ''
}
const addItem = (e) => {
  isAddItem.value = e
  newItem.value = ""
}
const toggle = (item) => {
  item.purchased = ! item.purchased
}
const state = reactive({count:0})
const increment = () => {
  state.count++
}
</script>