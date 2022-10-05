<template>
  <div>
    <!-- {{ items.data }} -->
    <label for="select_menu" class="block text-sm font-medium text-gray-700">{{ menu_name }}</label>
    <select v-model="selectedValue" id="select_menu" class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
        <option selected disabled value>Choose a plan</option>
        <option v-for="item in items" :key="item.id" :value="item.id">{{ item.name }}</option>
    </select>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {

    name : 'SelectMenu',

    emits:['selected'],

    props : ['menu_name','items'],

    setup(props,{emit}) {
        
      // console.log(props)

      const selectedValue = ref("");

      watch(selectedValue,(newValue,oldValue)=>{

        emit('selected',newValue, oldValue);
        
      })

      return {
        selectedValue
      }

    }
}

</script>