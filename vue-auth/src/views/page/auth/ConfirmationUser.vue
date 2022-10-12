<template>
  <h1>Confrimation Code Page</h1>   
  <div class="flex justify-center items-center gap-2 mt-5" ref="otpInput">
    <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email Code</label>
        <input type="tel" class="w-10 h-10 border rounded-md text-center"
        v-for="(l, index) in length" :key="index" maxlength="1" ref="otpRefs"
        @keyup="handleInput($event)" @paste="handlePaste($event)" 
        @keyup.delete="handleDelete($event)">
    </div>
        
<div>
    <label for="phone" class="block text-sm font-medium text-gray-700 ml-5">Phone Code</label>

    <input type="tel" class="w-10 h-10 border rounded-md text-center"
    v-for="(l, index) in length" :key="index" maxlength="1" ref="otpRefsPhone"
    @keyup="handleInput2($event)" @paste="handlePaste2($event)" 
    @keyup.delete="handleDelete($event)">
</div>
<button type="button" class="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" @click="submit">Submit</button>
    </div>
</template>

<script>                
import { reactive, ref } from '@vue/reactivity'
import Api from "@/util/Api.js";

export default {
    setup(){
        // let data = reactive({
        //     mail : localStorage.getItem('mail'),
        //     phone : localStorage.getItem('phone')
        // });

        function submit(){  
            Api.poster('/confirmation',{
                mail : localStorage.getItem('mail'),
                phone : localStorage.getItem('phone'),
                mail_code : otp.value,
                phone_code: otpPhone.value,
            }).then(
                localStorage.removeItem('mail'),
                localStorage.removeItem('phone'),
                alert('Register Comletet')
            )
            .catch(
                alert('')
            )
        }

        let length = ref(6);
        let otp = ref(null);
        let otpRefs = ref([]);
        let otpPhone = ref(null);
        let otpRefsPhone = ref([]);

        function handleInput(e) {
            const input = e.target;
            otp.value = otpRefs?.value.map((i) => i.value || "").join("");
            if (input.nextElementSibling && input.value) {
                input.nextElementSibling.focus();
                input.nextElementSibling.select();
            } else {
                input.blur()
            }
        }

        function handlePaste(e) {
            const input = e.target;
            const paste = Array.from(e.clipboardData.getData("text"));
            otpRefs.value.map((i, index) => {
                i.value = paste[index] || "";
            });
            otpRefs.value[length.value - 1].focus();
        }

        function handleDelete(e) {
            const input = e.target;
            if (input.previousElementSibling) {
                input.previousElementSibling.focus();
                input.previousElementSibling.select();
            }
        }

        function handleInput2(e) {
            const input = e.target;
            console.log(otpRefsPhone.value);
            otpPhone.value = otpRefsPhone?.value.map((i) => i.value || "").join("");
            if (input.nextElementSibling && input.value) {
                input.nextElementSibling.focus();
                input.nextElementSibling.select();
            } else {
                input.blur()
            }
        }

        function handlePaste2(e) {
            const input = e.target;
            const paste = Array.from(e.clipboardData.getData("text"));
            otpRefsPhone.value.map((i, index) => {
                i.value = paste[index] || "";
            });
            otpRefsPhone.value[length.value - 1].focus();
        }

        function handleDelete2(e) {
            const input = e.target;
            if (input.previousElementSibling) {
                input.previousElementSibling.focus();
                input.previousElementSibling.select();
            }
        }

        return {
            length,
            otp,
            otpRefs,
            otpPhone,
            otpRefsPhone,
            handleInput,
            handlePaste,
            handleDelete,
            handleInput2,
            handlePaste2,
            handleDelete2,
            submit
        }   
    }
}
</script>