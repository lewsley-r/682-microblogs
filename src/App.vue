<template>
  <div id="app" class="d-flex flex-column h-100">
    <nav-bar />
    <div class="container flex-grow-1">
      <error />
      <div class="mt-5">
        <router-view />
      </div>
    </div>
    <footer class="bg-light text-center p-3">
      <p>
        Project created by
        <a href="https://github.com/lewsley-r">Ronan Lewsley</a>
      </p>
    </footer>
  </div>
</template>

<script>
import NavBar from "./components/NavBar";
import Error from "./components/Error";
import { useUserStore } from './stores/users'
import { usePostsStore } from './stores/posts';


export default {
  components: {
    NavBar,
    Error
  },
  data(){
    return{
      userStore: useUserStore(),
      postsStore: usePostsStore()
    }
  },
  mounted(){
    this.userStore.getToken()
    this.postsStore.getAllPosts()
  }
 
};
</script>
