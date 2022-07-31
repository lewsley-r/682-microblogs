<template>
  <div class="nav-container mb-3">
    <nav class="navbar navbar-expand-md navbar-light bg-light">
      <div class="container">
        <img src="/logo_transparent.png" style="height:200px; border-radius: 10em; padding: 1vh ; margin-top:2.5vh">
     

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <li v-if="isAuthenticated">
              <form v-on:submit.prevent class="uk-search">
                  <input v-model="searchQuery" class="uk-search-input" type="search" @keyup.enter="searchByUser()" placeholder="Search Blogs by Owner's name..">
              </form>
            </li>
          </ul>
          <ul class="navbar-nav d-none d-md-block">
            <li v-if="!isAuthenticated && !isLoading" class="nav-item">
              <button
                id="qsLoginBtn"
                class="btn btn-primary btn-margin"
                @click.prevent="login"
              >Login</button>
            </li>
            
            <li class="nav-item dropdown" v-if="isAuthenticated">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="profileDropDown"
                data-toggle="dropdown"
              >
                <img
                  :src="user.picture"
                  alt="User's profile picture"
                  class="nav-user-profile rounded-circle"
                  width="50"
                />
              </a>
              <div class="dropdown-menu dropdown-menu-right">
                <div class="dropdown-header">{{ user.name }}</div>
                <router-link to="/profile" class="dropdown-item dropdown-profile">
                  <font-awesome-icon class="mr-3" icon="user" />Profile
                </router-link>
                <a id="qsLogoutBtn" href="#" class="dropdown-item" @click.prevent="logout">
                  <font-awesome-icon class="mr-3" icon="power-off" />Log out
                </a>
              </div>
            </li>
          </ul>

          <ul class="navbar-nav d-md-none" v-if="!isAuthenticated && !isLoading">
            <button id="qsLoginBtn" class="btn btn-primary btn-block" @click="login">Log in</button>
          </ul>

          <ul
            id="mobileAuthNavBar"
            class="navbar-nav d-md-none d-flex"
            v-if="isAuthenticated"
          >
            <li class="nav-item">
              <span class="user-info">
                <img
                  :src="user.picture"
                  alt="User's profile picture"
                  class="nav-user-profile d-inline-block rounded-circle mr-3"
                  width="50"
                />
                <h6 class="d-inline-block">{{ user.name }}</h6>
              </span>
            </li>
            <li>
              <font-awesome-icon icon="user" class="mr-3" />
              <router-link to="/profile">Profile</router-link>
            </li>

            <li>
              <font-awesome-icon icon="power-off" class="mr-3" />
              <a id="qsLogoutBtn" href="#" class @click.prevent="logout">Log out</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { useAuth0 } from '@auth0/auth0-vue';
import { usePostsStore } from '@/stores/posts';

export default {
  name: "NavBar",
  setup() {
    const auth0 = useAuth0();
    
    return {
      isAuthenticated: auth0.isAuthenticated,
      isLoading: auth0.isLoading,
      user: auth0.user,
      login() {
        auth0.loginWithRedirect();
      },
      logout() {
        auth0.logout({
          returnTo: window.location.origin
        });
      }
    }
  },
  data(){
    return{
      searchQuery: null,
      postsStore: usePostsStore()
    }
  },
  methods: {
    searchByUser(){
      this.postsStore.$patch((state) => {
        state.filterPosts = []
      })
      var post;
      for (post in this.postsStore.posts){
        if(this.postsStore.posts[post].NameOfOWner.includes(this.searchQuery)){
          this.postsStore.$patch((state) => {
            state.filterPosts.push(this.postsStore.posts[post])
          })
        }
        if(parseInt(post)+1 == this.postsStore.posts.length){
          this.$router.push('/search-results')
        }
      }
    }
  }

};
</script>

<style>
.uk-search .uk-search-input{
  border: 2px solid grey;
  border-radius: 0.5em;
  float: right;
}
#mobileAuthNavBar {
  min-height: 125px;
  justify-content: space-between;
}
</style>
