<template>

  <div class="nav">
    <div>
      <router-link :to="{ name: 'ShopList' }">Shop List</router-link>
    </div>
   <div>
      <router-link :to="{ name: 'CountryList' }">Products List</router-link>
   </div>
   <div>
      <router-link :to="{ name: 'Reactive' }">Reactive</router-link>
   </div>
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
