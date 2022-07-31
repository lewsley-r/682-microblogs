<template>
   <div class="uk-child-width-1-2@m" uk-grid>
        <div class="uk-card uk-card-default uk-card-body">
            <h2>{{ post.ownerName }}</h2>
            <h5>{{ post.ownerOrg }}</h5>
            <img :src="post.imgUrl" alt="microblog-photo" max-height="100px">
            <p>{{ post.postContent }}</p>
            <small>{{ post.userId }}</small>
            <div v-if="isAuthenticated">
                <a v-if="isPostLiked == false" class="reactions uk-icon-button" @click="addLike()" uk-tooltip="Like the Post">
                <span uk-icon="happy"></span>
                </a>
                <a v-if="isPostLiked == true" class="reactions uk-icon-button" @click="delLike()" uk-tooltip="Remove Your Like from the Post">
                <span uk-icon="history"></span>
                </a>
            </div>
        </div>
        <div class="commentCard uk-card uk-card-default uk-card-body">
            <div class="uk-child-width-1-2@m" uk-grid>
                <div>  
                     <h2>
                        Comments
                    </h2>
                </div>
           
                <div>
                    <button class="uk-button uk-button-primary" type="button" uk-toggle="target: #modal-likes">View Likes</button>
                    <div id="modal-likes" uk-modal>
                        <div class="uk-modal-dialog uk-modal-body">
                            <button class="uk-modal-close-default" type="button" uk-close></button>
                            <h2 class="uk-modal-title">Likes</h2>
                            <div id="likeBox" v-for="like in this.likes" v-bind:key="like.id">
                                <h5>
                                    {{like.OwnerName}}
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
               
                <div class="uk-child-width-1-2@m" uk-grid>
                    <div>
                        <textarea v-model="comment"  class="uk-textarea" maxlength="200"></textarea>  
                    </div>         
                    <div id="submitPostCol">
                        <button class="subBtn uk-button uk-button-secondary" @click="addComment()">Submit Post</button>
                    </div>
                </div>

            </div>
            <div v-for="comment in comments" v-bind:key="comment.id" id="commentBox">
                <h3>{{comment.OwnerName}}</h3>
                <p>{{comment.CommentContent}}</p>
            </div>
        </div>


   </div>
</template>

<script>
import { usePostsStore } from '@/stores/posts'
import { useAuth0 } from '@auth0/auth0-vue'

export default {
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
            comment : null
            
        }
    },
    computed: {
        post(){
            return this.postsStore.currentPost
        },
        likes(){
            return this.postsStore.currentPostLikes
        },
        comments(){
            return this.postsStore.currentPostComments
        },
        isPostLiked(){
            var like;
            for (like in this.postsStore.currentPostLikes){
                if (this.postsStore.currentPostLikes[like].UserID == this.user.sub){
                     this.postsStore.$patch((state) => {
                        state.myLikeId = state.currentPostLikes[like].LikeID
                        state.isPostLiked = true
                    })
                }

            }
            return this.postsStore.isPostLiked
        
        },

    },
    methods: {
        addLike() {
            var post = {'id': this.post.id, 'userId': this.post.userId,'ownerName': this.post.ownerName}
            this.postsStore.createPostLike(post)
            this.postsStore.$patch((state) => {
                state.isPostLiked = true
            })

        },
        addComment() {
            var post = {'id': this.post.id, 'userId': this.post.userId, 'content': this.comment, 'ownerName': this.post.ownerName}
            this.postsStore.createPostComment(post)
            this.comment = null
        },
        delLike() {
            this.postsStore.removePostLike()
            var like;
            for (like in this.postsStore.currentPostLikes){
                if (this.postsStore.currentPostLikes[like].LikeID == this.postsStore.myLikeId){
                    this.postsStore.$patch((state) => {
                        state.currentPostLikes.splice(like, 1)
                        state.isPostLiked = false
                    })
                }
            }
            
            
        }
    }

}
</script>

<style scoped>
.commentCard{
    overflow-y: scroll;
    max-height: 60vh;
}
.reactions{
    float: right;
}

.subBtn{
    height: 10vh;
    margin-left: 2vw;
}
.uk-textarea{
    min-width: 20vw;
    min-height: 10vh;
}

.uk-grid{
    margin-bottom: 5vh;
}

.uk-modal-title{
    text-align: center;
}

#commentBox{
    border: 2px solid lightgray;
    padding: 1vh;
    margin: 1vh;
}

#likeBox{
    text-align: center;
    border: 2px solid lightgray;
    padding: 1vh;
    margin: 1vh;
}

#modalLikes{
    overflow-y: scroll;
    max-height: 50vh;
}

#submitPostCol{
    margin-left: 5vw;
    width: 25%;
}


</style>