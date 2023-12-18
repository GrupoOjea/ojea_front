import { createRouter, createWebHistory } from 'vue-router';
import Register from './components/Login/Register.vue';
import Home from './components/Login/Home.vue';
import Login from './components/Login/Login.vue';
import NewPassword from './components/Login/NewPassword.vue';
import ResetPassword from './components/Login/ResetPassword.vue';
import Search from './components/Search/Search.vue';
import NavbarCompany from './components/Navbar/NavbarCompany.vue';
import ProfileCompany from './components/Profile/ProfileCompany.vue';
import FormJob from './components/Form/FormJob.vue';
import Jobs from './components/Jobs/Jobs.vue';
import Interaction from './components/Interaction/Interaction.vue';
import RegisterUser from './components/Login/RegisterUser.vue';
import SearchUser from './components/Search/SearchUser.vue';
import ProfileUser from './components/Profile/ProfileUser.vue';
import MyJobs from './components/Jobs/MyJobs.vue';
import Carrusel from './components/Jobs/Carrusel.vue';
import SearchAdmin from './components/Search/SearchAdmin.vue';
import NavbarAdmin from './components/Navbar/NavbarAdmin.vue';
import ManageJob from './components/Admin/ManageJob.vue';
import ManageProfile from './components/Admin/ManageProfile.vue';
import RegisterCompany from './components/Admin/RegisterCompany.vue';
import RegisterAdmin from './components/Admin/RegisterAdmin.vue';
import Dashboard from './components/Dashboard/DashboardCompany.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/carrusel',
    name: 'Carrusel',
    component: Carrusel,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
  },
  {
    path: '/new-password',
    name: 'NewPassword',
    component: NewPassword,
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: { requiresAuth: true },
  },
  {
    path: '/navbar-company',
    name: 'NavbarCompany',
    component: NavbarCompany,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile-company',
    name: 'ProfileCompany',
    component: ProfileCompany,
    meta: { requiresAuth: true },
  },
  {
    path: '/form-job',
    name: 'FormJob',
    component: FormJob,
    meta: { requiresAuth: true },
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: Jobs,
    meta: { requiresAuth: true },
  },
  {
    path: '/interaction/:id',
    name: 'interaction',
    component: Interaction,
    meta: { requiresAuth: true },
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/register-user/:id',
    name: 'register-user',
    component: RegisterUser,
    meta: { requiresAuth: true },
  },
  {
    path: '/search-user',
    name: 'search-user',
    component: SearchUser,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile-user',
    name: 'profile-user',
    component: ProfileUser,
    meta: { requiresAuth: true },
  },
  {
    path: '/my-jobs',
    name: 'MyJobs',
    component: MyJobs,
    meta: { requiresAuth: true },
  },{
    path: '/navbar-admin',
    name: 'NavbarAdmin',
    component: NavbarAdmin,
    meta: { requiresAuth: true },
  },{
    path: '/search-admin',
    name: 'search-admin',
    component: SearchAdmin,
    meta: { requiresAuth: true },
  },{
    path: '/manage-profile',
    name: 'ManageProfile',
    component: ManageProfile,
    meta: { requiresAuth: true },
  },{
    path: '/manage-job',
    name: 'ManageJob',
    component: ManageJob,
    meta: { requiresAuth: true },
  },{
    path: '/register-company/:id',
    name: 'RegisterCompany',
    component: RegisterCompany,
    meta: { requiresAuth: true },
  },{
    path: '/register-admin',
    name: 'RegisterAdmin',
    component: RegisterAdmin,
    meta: { requiresAuth: true },
  },{
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },{
    path: '/:catchAll(.*)',
    redirect: '/', // o a donde quieras que se redirija cuando la ruta no existe
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('isAuthenticated') !== 'true') {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
