import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import PlanningLayout from '@/components/PlanningLayout'
import AllPlanning from '@/components/AllPlanning'
import GeneratePlanning from '@/components/GeneratePlanning'
import DetailsPlanning from '@/components/DetailsPlanning'
import Alerte from '@/components/Alerte'
import Formation from '@/components/Formation'
import ListeModule from '@/components/ModuleD/ListeModule'
import ListeFormation from '@/components/FormationD/ListeFormation'
import InfoFormation from '@/components/FormationD/InfoFormation'

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
      path: '/alerte',
      name: 'Alerte',
      component: Alerte
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
    }
  ]
})
