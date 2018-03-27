import Vue from 'vue'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import store from '../store'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/features/login/index'
import Register from '@/features/register/index'
import MapIndex from '@/features/map/pages/index'

Vue.use(Router)
let router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: 'map'
    },
    {
      path: '/map',
      name: 'map',
      component: MapIndex
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    }
  ]
})

// 同步store和路由
sync(store, router)

export default router
