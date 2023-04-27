import { createRouter, createWebHistory } from 'vue-router'
import Register from './components/Login/Register.vue'
import Home from './components/Login/Home.vue'
import Login from './components/Login/Login.vue'
import NewPassword from './components/Login/NewPassword.vue'
import ResetPassword from './components/Login/ResetPassword.vue'
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
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/new-password',
    name: 'NewPassword',
    component: NewPassword
  }
 
 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
