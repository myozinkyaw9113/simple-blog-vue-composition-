<template>

    <div class="post-style mb-5">

        <router-link :to="{ name: 'Detail', params: { id: post.id } }">
            <h1>{{ post.title }}</h1>
        </router-link>

        <p class="desc text-lg">{{ snippet }}</p>

        <span class="tag" v-for="tag in post.tags" :key="tag">#{{ tag }}</span>

    </div>
  
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {

    name : 'SinglePost',

    props : ['post'],

    setup(props) {

        const snippet = computed(() => {
            return props.post.description.substring(0, 20) + '...'
        })

        return { snippet }

    },

}
</script>