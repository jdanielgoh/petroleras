import Vue from 'vue'
import VueRouter from 'vue-router'
import VisTraslapes from '../views/VisTraslapes.vue'
import VisPetroleras from "../views/VisPetroleras.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/traslapes',
    name: 'VisTraslapes',
    component: VisTraslapes
  },
  {
    path: '/vispetroleras',
    name: 'VisPetroleras',
    component: VisPetroleras
  }
]
console.log(process.env.BASE_URL)
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
