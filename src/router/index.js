import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import PlanningLayout from '@/components/PlanningLayout'
// import Planning from '@/components/Planning'
import Formation from '@/components/Formation'
import Alerte from '@/components/Alerte'
import ListeModule from '@/components/ModuleD/ListeModule'
import InfoModule from '@/components/ModuleD/InfoModule'
import ListeFormation from '@/components/FormationD/ListeFormation'
import InfoFormation from '@/components/FormationD/InfoFormation'
import Calendar from '@/components/Calendar'
import AllPlanning from '@/components/AllPlanning'
import DetailsPlanning from '@/components/DetailsPlanning'
import GeneratePlanning from '@/components/GeneratePlanning'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/planning',
      name: 'AllPlannings',
      component: AllPlanning
    },
    {
      path: '/planning/:id',
      component: PlanningLayout,
      children: [
        {
          path: '',
          name: 'GeneratePlanning',
          component: GeneratePlanning
        },
        {
          path: 'details/:idCalendar',
          name: 'DetailsPlanning',
          component: DetailsPlanning
        }
      ]
    },
    // {
    //   path: '/planning/:id',
    //   name: 'PlanningLayout',
    //   component: PlanningLayout,
    //   children: [
    //     {
    //       path: 'planning',
    //       name: 'Planning',
    //       component: Planning
    //     }
    //   ]
    // },
    // {
    //   path: '/planning',
    //   name: 'PlanningLayout',
    //   component: PlanningLayout,
    //   children: [
    //     {
    //       path: ':id',
    //       name: 'Planning',
    //       component: Planning
    //     },
    //     {
    //       path: '',
    //       name: 'AllPlanning',
    //       component: AllPlanning
    //     }
    //   ]
    // },
    {
      path: '/formation',
      name: 'Formation',
      component: Formation
    },
    {
      path: '/alerte',
      name: 'Alerte',
      component: Alerte
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
    {
      path: '/test',
      name: 'test',
      component: Calendar
    }
  ]
})
