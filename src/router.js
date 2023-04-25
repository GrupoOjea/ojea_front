import { createRouter, createWebHistory } from 'vue-router'
import Register from './components/Login/Register.vue'
import Home from './components/Login/Home.vue'
import Login from './components/Login/Login.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router