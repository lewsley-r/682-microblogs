import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-vue';


export const useUserStore = defineStore('users', {
    state: () => {
        return {
            currentRole: 'Reader'
        }
    },
    actions: {
        getToken() {
            axios.post('https://dev-d68s3iwj.eu.auth0.com/oauth/token', {
                "client_id": "GuQN6NppqOixC0PmVw06nI8Ck6kvtvJK",
                "client_secret": "3UnxL25EuvZ6ZUYBCtPTgQM7R6hznGoNXqeSV9ojPKIUgPhgqo-RUk095JkNbA92",
                "audience": "https://dev-d68s3iwj.eu.auth0.com/api/v2/", "grant_type": "client_credentials"
            },
                {
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                .then(function (response) {
                    localStorage.setItem('token', response.data.access_token);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        roleCheck() {
            const auth0 = useAuth0();
            
            axios.get(`https://dev-d68s3iwj.eu.auth0.com/api/v2/users/${auth0.user.value.sub}/roles`, {headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }})
            .then(function (response) {
                if (response.data[0]){
                    this.currentRole = response.data[0].name
                }
             
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
        }
    },
    getters: {

    },
})
