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
            <a class="nav-link active" aria-current="page" href="/search">Buscar profesional</a>
          </li>
        </ul>

        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="margin-right: 15px;">
              {{nombre}}</a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
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
              <li>
                <router-link
                  :class="{ active: isActiveRoute('/interaction') }"
                  to="/interaction" class="dropdown-item">Interaccion
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item" href="#" @click="closeSession">Cerrar sesión</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
  
<script>
import { callApiAxios } from '../../services/axios';
export default {
  data() {
      return {
        nombre: 'No tiene usuario empresa'

        };
    },
  components: {
  },
  async mounted() {
    try {
      const nombreFromStorage = localStorage.getItem('nombre');
      if (nombreFromStorage) {
        this.nombre = nombreFromStorage;
      }
    } catch (error) {
      console.error('Error en loginCompany:', error);
    }
  },
  methods:{
    closeSession(){
      localStorage.clear();
      this.$router.push('/');
    },
    isActiveRoute(route) {
      return this.$route.path === route;
    },
  }
}
</script>

<style scoped>


.dropdown-menu {
  max-width: 100vw;  
  overflow-x: auto;  
}

.dropdown-item {
  white-space: pre-wrap; 
}

.navbar-brand img {
      height: 50px;
    }
</style>
