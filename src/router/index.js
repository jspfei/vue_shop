import Vue from 'vue'
import Router from 'vue-router'
import LoginIn from '@/components/LoginIn'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LoginIn',
      component: LoginIn
    }
  ]
})
