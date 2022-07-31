import { createRouter as createVueRouter, createWebHashHistory, createWebHistory, Router } from "vue-router";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import SearchResults from '../views/SearchResults.vue'
import ViewPost from '../views/ViewPost.vue'
import { createAuthGuard } from "@auth0/auth0-vue";
import { App } from 'vue';

export function createRouter(app: App): Router {
  return createVueRouter({
    routes: [
      {
        path: "/",
        name: "home",
        component: Home
      },
      {
        path: "/profile",
        name: "profile",
        component: Profile,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: "/search-results",
        name: "search-results",
        component: SearchResults,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: "/view-post",
        name: "view-post",
        component: ViewPost,
        beforeEnter: createAuthGuard(app)
      }
    ],
    history: createWebHistory()
  })
}
