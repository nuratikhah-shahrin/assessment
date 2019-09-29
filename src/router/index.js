import Vue from 'vue'
import Router from 'vue-router'
import GithubSearch from '@/components/GithubSearch'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GithubSearch',
      component: GithubSearch
    }
  ]
})
