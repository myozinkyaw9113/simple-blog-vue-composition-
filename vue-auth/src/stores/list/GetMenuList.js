import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/util/Api.js";

export const useGetMenuList = defineStore('GetMenuList', {

    state: () => {
        return {
            items : [],
        }
    },

    actions: {
        
        async getList() {
            await Api.puller('/plans')
            .then(response => {
                console.log(response.data);
                this.items = response.data.data;
            })
            .catch(error => console.log(error))
        }
        
    },
})