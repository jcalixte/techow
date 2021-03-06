import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/board/:boardId',
    name: 'BoardView',
    props: true,
    component: () =>
      import(/* webpackChunkName: "board-view" */ '../views/BoardView.vue')
  },
  {
    path: '/board/:boardId/quality',
    name: 'BoardQuality',
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "board-quality" */ '../views/BoardQuality.vue'
      )
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
