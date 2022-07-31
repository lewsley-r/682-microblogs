<template>
  <div>
    <h1 class="homeTitle">Most Recent Posts</h1>
    <div v-for="post in this.posts" v-bind:key="post.id">
      <Post :PostID="post.PostID" :OwnerName="post.NameOfOWner" :OwnerOrg="post.OwnerOrganisation" :ImgUrl="post.ImgUrl" :PostContent="post.PostContent" :UserID="post.UserID" :Liked="post.isLiked"></Post>
    </div>
    
    <hr />
    <home-content />
  </div>
</template>

<script>
import Post from "../components/Post";
import HomeContent from "../components/HomeContent";
import { usePostsStore } from '@/stores/posts';

export default {
  name: "home",
  components: {
    Post,
    HomeContent,
  },
   data(){
    return{
      postsStore: usePostsStore()
    }
  },
  computed: {
    posts(){
      return this.postsStore.posts.slice(0,6)
    }
  } 
};
</script>

<style lang="css" scoped>
.next-steps .fa-link {
    margin-right: 5px;
}
.homeTitle{
  text-align: center;
}
</style>
