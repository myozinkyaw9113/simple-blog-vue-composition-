<template>

  <div class="nav">

    <router-link class="mr-3" :to="{ name: 'ShopList' }">Shop List</router-link>
    
    <router-link class="mr-3" :to="{ name: 'CountryList' }">Products List</router-link>

    <router-link class="mr-3" :to="{ name: 'Reactive' }">Reactive</router-link>

    <router-link class="mr-3" :to="{ name: 'VueOption1' }">Vue Option1</router-link>

    <router-link class="mr-3" :to="{ name: 'VueComposition1' }">Vue Composition1</router-link>

  </div>

  <div>

    <!-- <div v-if="error">{{ error }}</div> -->

    <div v-if="posts.length">
      <PostList :posts="posts" />
    </div>
    <div v-else>
      Loading...
    </div>

  </div>

</template>

<script>
import PostList from '../components/PostList.vue'
import getPosts from './../composables/getPosts'

export default {

  name : 'HomeView',

  components : { PostList },

  setup() {

    const { posts, error, load } = getPosts()

    load()

    return { posts, error }

  }
  
}

</script>
