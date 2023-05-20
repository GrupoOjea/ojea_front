<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
      <img src="../../images/Logo_OJEA.png" alt="Ojea">
     </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
          </li>
        </ul>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <router-link
              :class="{ active: isActiveRoute('/login') }"
              to="/login" class="nav-link">Iniciar sesión
            </router-link>
          </li>
          <!--li class="nav-item">
            <router-link
              :class="{ active: isActiveRoute('/register') }"
              to="/register" class="nav-link">Registrarse
            </router-link>
          </li-->
        </ul>
      </div>
    </div>
  </nav>
</template>
  
<script>
export default {
  components: {
  },
  methods:{
    closeSession(){
      localStorage.clear();
      this.$router.push('/login');
    },
    isActiveRoute(route) {
      return this.$route.path === route;
    },
  }
}
</script>

<style scoped>
.dropdown-item {
  white-space: normal;
  word-wrap: break-word;
}

.dropdown-item.active {
  font-weight: bold;
  background-color: #01203f;
}

.navbar-brand img {
      height: 50px;
    }
</style>
