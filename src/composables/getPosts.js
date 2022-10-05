import { ref } from '@vue/reactivity'
import blog from '../data/db.json'

const getPosts = () => {
    const posts = ref([])

    const error = ref(null)
    
    const load = async () => {
      try {
        posts.value  = blog.posts
      }
      catch(err) {
        error.value = err.message
      }
    }

    return { posts, error, load }
}

export default getPosts