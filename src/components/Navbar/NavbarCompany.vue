<template>
  <nav class="navbar navbar-expand-lg navbar-light navbar-c">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
      <img src="../../images/Logo_OJEA1.png" alt="Ojea">
     </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/search"><i class="fa-solid fa-magnifying-glass icon-lupa" style="color: #0a0a0a;"></i>  Buscar profesional</a>
          </li>
        </ul>

        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Mi cuenta
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link
                  :class="{ active: isActiveRoute('/profile-company') }"
                  to="/profile-company" class="dropdown-item">Mi perfil
                </router-link>
              </li>
              <li>
                <router-link
                  :class="{ active: isActiveRoute('/jobs') }"
                  to="/jobs" class="dropdown-item">Empleos publicados
                </router-link>
              </li>
              <li>
                <router-link
                  :class="{ active: isActiveRoute('/form-job') }"
                  to="/form-job" class="dropdown-item">Publicar empleo
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item" href="#" @click="closeSession">Cerrar sesión</a>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <router-link to="/register" class="nav-link"></router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link"></router-link>
          </li>
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
      max-height: 50px;
       width: auto;
        object-fit: contain;
    }

.icon-lupa {
      margin-right: 10px;
}

.navbar-c {
  background-color: #6d63ffa9;
   font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-size: large;
     font-weight: 700;
  
}
</style>
