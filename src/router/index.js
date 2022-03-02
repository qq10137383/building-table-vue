import Vue from 'vue'
import Router from 'vue-router'
import BuildingTableDemo from '@/views/BuildingTableDemo'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: BuildingTableDemo
  }]
})
