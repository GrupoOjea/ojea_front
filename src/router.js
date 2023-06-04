import { createRouter, createWebHistory } from 'vue-router'
import Register from './components/Login/Register.vue'
import Home from './components/Login/Home.vue'
import Login from './components/Login/Login.vue'
import NewPassword from './components/Login/NewPassword.vue'
import ResetPassword from './components/Login/ResetPassword.vue'
import Search from './components/Search/Search.vue'
import NavbarCompany from './components/Navbar/NavbarCompany.vue'
import ProfileCompany from './components/Profile/ProfileCompany.vue'
import FormJob from './components/Form/FormJob.vue'
import Jobs from './components/Jobs/Jobs.vue'
import Interaction from './components/Interaction/Interaction.vue'
import RegisterPeople from './components/Login/RegisterPeople.vue' 
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
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/navbar-company',
    name: 'NavbarCompany',
    component: NavbarCompany
  },
  {
    path: '/profile-company',
    name: 'ProfileCompany',
    component: ProfileCompany
  },
  {
    path: '/form-job',
    name: 'FormJob',
    component: FormJob
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: Jobs
  },
  {
    path: '/interaction/:id',
    name: 'interaction',
    component: Interaction
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/register-user/:id',
    name: 'register-user',
    component: RegisterPeople
  }
 
 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
