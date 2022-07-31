<template>
  <div v-if="this.store.currentRole == 'Creator'" class="uk-child-width-expand@s uk-text-center" uk-grid>
      <div>
          <div class="uk-card uk-card-default uk-card-body">
            <form v-on:submit.prevent>
              <fieldset class="uk-fieldset">
                <h1>MicroBlog</h1>
                <textarea class="uk-textarea" placeholder="Enter MicroBlog Post, 200 characters maximum" maxlength="200" v-model="postContent"></textarea>
                <div class="uk-margin">
                  <input class="uk-input" type="text" placeholder="Enter Organisation Name" v-model="orgName">
                </div>
                <div class="js-upload" uk-form-custom>
                    <input type="file" multiple v-on:change="onChangePhoto($event)">
                    <button class="uk-button uk-button-default" accept="image/png, image/gif, image/jpeg" type="button" tabindex="-1">Add a photo</button>
                    
                </div>
                <h4><label v-if="this.blogPhoto">File Name: {{this.blogPhoto.name}}</label></h4>
                <button class="uk-button uk-button-default uk-button-primary blogBtn" @click="submitForm">
                  Submit Blog
                </button>
              </fieldset>
            </form>
          </div>
      </div>
   
  </div>
  <div class="uk-child-width-expand@s uk-text-center" uk-grid>
     
      <div>
          <div class="uk-card uk-card-default uk-card-body">
            <div class="row align-items-center profile-header">
              <div class="col-md-2 mb-3">
                <img
                  :src="user?.picture"
                  alt="User's profile picture"
                  class="rounded-circle img-fluid profile-picture"
                />
              </div>
              <div class="col-md text-center text-md-left">
                <h2>{{ user?.name }}</h2>
                <p class="lead text-muted">{{ user?.email }}</p>
              </div>
          </div>
          </div>
      </div>
      <div>
        <div class="">
          <div class="js-upload" uk-form-custom>
                    <input type="file" multiple>
                    <button class="uk-button uk-button-default uk-button-primary" accept="image/png, image/gif, image/jpeg" type="button" tabindex="-1">
                      Change Profile Photo
                    </button>
                </div>
        </div>
      </div>
   
  </div>
  <div class="container">
    

    <div class="row">
      <pre v-highlightjs><code class="json">{{JSON.stringify(user, null, 2)}}</code></pre>
    </div>
  </div>
</template>

<script>
import { useAuth0 } from '@auth0/auth0-vue';
import { useUserStore } from '@/stores/users';
import { usePostsStore } from '@/stores/posts'

export default {
  name: "profile",
  setup() {
    const auth0 = useAuth0();
    const userStore = useUserStore();
    const postsStore = usePostsStore();
    
    return {
      user: auth0.user,
      store: userStore,
      postsStore: postsStore
    }
  },
  data(){
    return{
      blogPhoto: null,
      orgName: null,
      postContent: null,
    }
  },
  mounted(){
    this.store.roleCheck()
  },
  methods: {
    onChangePhoto(event){
      this.blogPhoto = (event.srcElement.files[0])
    },
    submitForm(){
      var microBlog = {
        'file': this.blogPhoto,
        'orgName': this.orgName,
        'postContent': this.postContent,
        'userId': this.user.sub,
        'ownerName': this.user.nickname
      }
      this.postsStore.createPost(microBlog)
    }
  }
};
</script>

<style scoped>
.blogBtn{
  margin: 1vh;
}
</style>

