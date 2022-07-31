<template>
    <h1 class="searchTitle">Search Results</h1>
    <div v-for="post in this.posts" v-bind:key="post.id">
      <Post :OwnerName="post.NameOfOwner" :OwnerOrg="post.OwnerOrganisation" :ImgUrl="post.ImgUrl" :PostContent="post.PostContent" :UserID="post.UserID"></Post>
    </div>
    <div v-if="this.posts.length == 0">
        <h3 class="noResults">No Results match your search</h3>
    </div>
</template>

<script>
import { usePostsStore } from '@/stores/posts'
import Post from "../components/Post";

export default {
components: {
    Post,
  },
    data(){
        return{
            postsStore: usePostsStore()
        }
    },
    // mounted(){
        
    // },
    computed: {
        posts(){
            return this.postsStore.filterPosts
        }
    },
    methods:{

    }

}
</script>

<style>
.searchTitle{
    text-align: center;
}
.noResults{
    margin: 5vh;
    text-align: center;
}

</style>