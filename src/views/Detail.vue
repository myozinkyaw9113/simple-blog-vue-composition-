<template>

    <div v-if="error">{{ error }}</div>

    <div v-if="post" class="post-style">

        <h1>{{ post.title }}</h1>

        <p class="desc text-lg">{{ post.description }}</p>

        <span class="tag" v-for="tag in post.tags" :key="tag">#{{ tag }}</span>

    </div>

</template>

<script>
import getPost from './../composables/getPost'

export default {
    name : 'Detail',

    props : ['id'],

    setup(props) {
        
        const { post, error, load } = getPost(props.id)

        load()

        return { post, error }

    }
}
</script>