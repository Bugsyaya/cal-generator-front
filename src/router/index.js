import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import PlanningLayout from '@/components/PlanningLayout'
import Planning from '@/components/Planning'
import Formation from '@/components/Formation'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/planning/:id',
      name: 'PlanningLayout',
      component: PlanningLayout,
      children: [
        {
          path: 'planning',
          name: 'Planning',
          component: Planning
        }
      ]
    },
    {
      path: '/formation',
      name: 'Formation',
      component: Formation
    }
  ]
})
