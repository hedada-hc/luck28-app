import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index-page',
      component: require('@/components/Index')
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
      path: '/analysis/luck28',
      name: 'luck28-analysis',
      component: require('@/components/Game/AnalysisLuck28')
    },
    {
      path: '/analysis/luck16',
      name: 'luck16-analysis',
      component: require('@/components/Game/AnalysisLuck16')
    },
    {
      path: '/analysis/hg28',
      name: 'Hg28-analysis',
      component: require('@/components/Game/AnalysisHg28')
    },
    {
      path: '/analysis/pceggs28',
      name: 'Pceggs28-analysis',
      component: require('@/components/Game/AnalysisPceggs28')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})