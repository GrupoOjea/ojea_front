import { createRouter, createWebHistory } from 'vue-router'
import Register from './components/Login/Register.vue'
import Home from './components/Login/Home.vue'
import Login from './components/Login/Login.vue'
import { Search } from '@mui/icons-material'


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
    path: '/search',
    name: 'Search',
    component: Search
  }
 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router