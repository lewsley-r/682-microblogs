<template>
  <div v-if="isAuthenticated">
    <div v-if="isLoading == false" class="uk-card uk-card-default uk-card-body">
      <button class="reactions uk-icon-button" type="button" uk-toggle="target: #modal-sentiment" @click="analyseSentiment">
        <span uk-icon="code" uk-tooltip="Analyse Sentiment"></span>
      </button>
      <button class="reactions uk-icon-button" type="button" uk-toggle="target: #modal-image" @click="analyseImage()">
        <span uk-icon="image" uk-tooltip="Analyse Blog Image"></span>
      </button>
      <!-- Analysis Modals -->
      <div id="modal-sentiment" class="uk-flex-top" uk-modal>
          <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical" v-if="sentiment">
              <button class="uk-modal-close-default" type="button" uk-close></button>
              <h2>Sentiment Results</h2>
              <label>Neutral: {{sentiment.confidenceScores.neutral}}</label>
              <progress class="uk-progress" :value="sentiment.confidenceScores.neutral"></progress>
              <label>Positive: {{sentiment.confidenceScores.positive}}</label>
              <progress class="uk-progress" :value="sentiment.confidenceScores.positive"></progress>
              <label>Negative: {{sentiment.confidenceScores.negative}}</label>
              <progress class="uk-progress" :value="sentiment.confidenceScores.negative"></progress>
              <h3>Result: {{sentiment.sentiment}}</h3>
          </div>
      </div>
      <div id="modal-image" class="uk-flex-top" uk-modal>
        <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical" v-if="imageResults">
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <h2>Image Results</h2>
          <h3>Final Result: {{imageResults.description.captions[0].text}}</h3>
          <h4>Confidence: {{imageResults.description.captions[0].confidence.toFixed(2)*100}} %</h4>
          <progress class="uk-progress" :value="imageResults.description.captions[0].confidence"></progress>
          <h2>Other Suggestions</h2>
          <div v-for="tag in imageResults.tags" v-bind:key="tag.id">
            <p>Name: {{tag.name}},  Confidence: {{tag.confidence.toFixed(2)*100}}%</p>
            <progress class="uk-progress" :value="tag.confidence"></progress>
          </div>
        </div>
      </div>

      <h3>{{ OwnerName }}</h3>
      <h5>{{ OwnerOrg }}</h5>
      <img :src="ImgUrl" alt="microblog-photo" max-height="100px">
      <p>{{ PostContent }}</p>
      <small>{{ UserID }}</small>
      <a class="reactions uk-icon-button" @click="viewPost()">
        <span uk-icon="file-text" uk-tooltip="View Post"></span>
      </a>
    </div>
    <div v-else-if="this.isLoading == true">
      <div uk-spinner="ratio: 5" id="loadingSpinner"></div>
    </div>
  </div>
  <div v-else>
    <h5 id="loginNotice">
      Login to see the latest blogs!
    </h5>
  </div>
</template>

<script>
import { usePostsStore } from '@/stores/posts';
import { useAuth0 } from '@auth0/auth0-vue';


export default {
  name: "Post",
  props: ['PostID', 'OwnerName', 'OwnerOrg', 'ImgUrl', 'PostContent', 'UserID'],
  setup() {
    const auth0 = useAuth0();
    
    return {
      isAuthenticated: auth0.isAuthenticated,
      user: auth0.user,
    }
  },

  data(){
    return{
      postsStore: usePostsStore(),
      isLoading: false
      
    }
  },
  // mounted(){
  
  // },
  computed: {
    sentiment() {
      return this.postsStore.currentSentimentResults
    },
    imageResults() {
      return this.postsStore.currentImageResults
    }
  },
  methods: {
    viewPost() {
      this.postsStore.getPostLikes(this.PostID)
      this.postsStore.getPostComments(this.PostID)
      this.isLoading = true
      this.postsStore.$patch((state) => {
        state.currentPost = {'id': this.PostID, 'userId': this.UserID, 'ownerName': this.OwnerName, 'ownerOrg': this.OwnerOrg, 'imgUrl': this.ImgUrl, 'postContent': this.PostContent}
      })
      setTimeout(() => { this.$router.push('/view-post')
                         this.isLoading = false;  }, 2000)
    },
    analyseSentiment() {
      this.postsStore.analyseSentiment(this.PostContent)
    },
    analyseImage() {
      this.postsStore.analyseBlogImage(this.ImgUrl)
    }
  }
};
</script>
<style scoped>
  .uk-card{
    width: 60vw;
    height: fit-content;
    margin: 5vw;
    float: left;
  }
  .uk-grid>* {
    margin-right: 10vw;
  }
  .uk-grid{
    margin-left: 4vw;
  }

  /* .uk-icon{
  
  } */

  .reactions{
    float: right;
  }

  #loadingSpinner{
    margin-left: 28vw;
  }

  #loginNotice{
    margin-top: 10vh;
    text-align: center;
  }


</style>
