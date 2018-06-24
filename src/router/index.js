import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import PlanningLayout from '@/components/PlanningLayout'
import Planning from '@/components/Planning'
import Formation from '@/components/Formation'
import ListeModule from '@/components/ModuleD/ListeModule'
import InfoModule from '@/components/ModuleD/InfoModule'
import ListeFormation from '@/components/FormationD/ListeFormation'
import InfoFormation from '@/components/FormationD/InfoFormation'

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
    },
    {
      path: '/listeModule',
      name: 'ListeModule',
      component: ListeModule
    },

    {
      path: '/infoModule/:id',
      name: 'InfoModule',
      component: InfoModule
    },

    {
      path: '/listeFormation',
      name: 'ListeFormation',
      component: ListeFormation
    },

    {
      path: '/infoFormation/:id',
      name: 'InfoFormation',
      component: InfoFormation
    },
  ]
})
