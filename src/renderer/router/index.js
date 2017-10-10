import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index-page',
      component: require('@/components/Index').default
    },
    {
      path: '/user',
      name: 'user-page',
      component: require('@/components/User')
    },
    {
      path: '/list',
      name: 'list-page',
      component: require('@/components/Game/Game28List')
    },
    {
      path: '/model',
      name: 'model-page',
      component: require('@/components/Game/Model')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})