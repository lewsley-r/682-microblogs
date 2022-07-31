import { defineStore } from 'pinia'
import axios from 'axios'
import endpoints from '../../rest-endpoints.json'

export const usePostsStore = defineStore('posts', {
    state: () => {
        return {
            posts: [],
            filterPosts: [],
            restEndpoints: endpoints,
            blobBaseUrl: "https://microblogs.blob.core.windows.net",
            isPostLiked: false,
            currentPost: null,
            currentPostLikes: [],
            currentPostComments: [],
            currentSentimentResults: null,
            currentImageResults: null,
            myLikeId: null,

        }
    },
    actions: {
        getAllPosts() {
            axios.get(this.restEndpoints.endpoint.getAll)
            .then(function (response){
                if (response){
                    this.posts = response.data.ResultSets.Table1
                    var post;
                    for (post in this.posts) {
                        this.posts[post].ImgUrl = this.blobBaseUrl + this.posts[post].ImgUrl
                    }
                }
            }.bind(this))
            .catch(function (){
                alert("Unable to get Posts, please try again later.")
            })
        },
        getPostLikes(id) {
            axios.get(this.restEndpoints.endpoint.getPostLikes.replace('{id}', id))
            .then(function(response){
                if(response.data.ResultSets.Table1[0] != undefined){
                    this.currentPostLikes = response.data.ResultSets.Table1
                }
            }.bind(this))
            .catch(function(){
                alert('Could not Get post likes.')
            })
        },
        getPostComments(id){
            axios.get(this.restEndpoints.endpoint.getPostComments.replace('{id}', id))
            .then(function(response){
                if(response.data.ResultSets.Table1[0] != undefined){
                    this.currentPostComments = response.data.ResultSets.Table1
                }
            }.bind(this))
            .catch(function(){
                alert('Could not Get post comments. Please try reloading the page.')
            })
        },
        analyseSentiment(content){
            let formData = new FormData();
            formData.append("PostContent", content);
            axios.post(this.restEndpoints.endpoint.getPostSentiment, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then(function (response){
                this.currentSentimentResults = response.data[0]
                
            }.bind(this))
            .catch(function (){
                alert("Something's went wrong please try again.")
            })
        },
        analyseBlogImage(ImgUrl){
            let formData = new FormData()
            formData.append("imgUrl", ImgUrl)
            axios.post(this.restEndpoints.endpoint.getPostImageAnalytics, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"

                },
            }).then(function (response){
                console.log(response.data)
                this.currentImageResults = response.data
            }.bind(this))
            .catch(function (){
                alert("Something's went wrong please try again.")
            })
        },
        createPost(post) {
            let formData = new FormData();
            formData.append("UserID", post.userId)
            formData.append("File", post.file);
            formData.append("OwnerOrg", post.orgName);
            formData.append("OwnerName", post.ownerName);
            formData.append("PostContent", post.postContent);
            axios.post(this.restEndpoints.endpoint.createPost, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then(function (response){
                this.isPostLiked = true
                if(response.status == 200){
                    alert('Posted Successfully!')
                }
                
            }.bind(this))
            .catch(function (){
                alert("Something's went wrong please try again.")
            })
        },
        createPostLike(post) {
            let formData = new FormData()
            formData.append("UserID", post.userId);
            formData.append("OwnerName", post.ownerName);
            axios.post(this.restEndpoints.endpoint.createPostLike.replace('{id}', post.id), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then(function (response){
                if(response.status == 200){
                    alert('Post Liked Successfully!')
                }
            })

        },
        createPostComment(post){
            let formData = new FormData()
            formData.append("content", post.content)
            formData.append("UserID", post.userId);
            formData.append("OwnerName", post.ownerName);
            axios.post(this.restEndpoints.endpoint.createPostComment.replace('{id}', post.id), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then(function (response){
                if(response.status == 200){
                    this.currentPostComments.push({'CommentContent': post.content, 'CommentID': 0, 'OwnerName': post.ownerName, 'PostID': post.id  })
                    alert('Comment posted Successfully!')
                }
            }.bind(this))
        },
        removePostLike(){
            axios.delete(this.restEndpoints.endpoint.removePostLike.replace('{id}', this.myLikeId))
            .then(function (response){
                if(response.status == 200){
                    alert('Post Like removed Successfully!')
                }

            })
        }


        
    },
    getters: {
        
    },
})
