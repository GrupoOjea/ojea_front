<template>
  <nav class="navbar navbar-expand-lg navbar-light navbar-c">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="../../images/Logo_OJEA1.png" alt="Ojea">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/search-user"><i
                class="fa-solid fa-magnifying-glass icon-lupa" style="color: #0a0a0a;"></i> Buscar Empleos</a>
          </li>
        </ul>

        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
              aria-expanded="false" style="margin-right: 15px; color: #0a0a0a;">
              {{ nombre }}</a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-c" aria-labelledby="navbarDropdown">
              <li>
                <router-link :class="{ active: isActiveRoute('/profile-user') }" to="/profile-user"
                  class="dropdown-item">Mi perfil
                </router-link>
              </li>
              <li>
                <router-link :class="{ active: isActiveRoute('/my-jobs') }" to="/my-jobs" class="dropdown-item">Mis
                  Empleos
                </router-link>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
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
export default {
  data() {
    return {
      nombre: 'No tiene usuario Persona'
    };
  },
  components: {},
  async mounted() {
    if (localStorage.getItem('isAuthenticated') !== 'true' || localStorage.getItem('tipo_perfil') !== '1') {
      this.$router.push({ name: 'Login' });
      return;
    }
    try {
      const nombreFromStorage = localStorage.getItem('nombre');
      if (nombreFromStorage) {
        this.nombre = nombreFromStorage;
      }
    } catch (error) {
      console.error('Error en loginCompany:', error);
    }
  },
  methods: {
    closeSession() {
      localStorage.clear();
      localStorage.removeItem('isAuthenticated');
      this.$router.push('/');
    },
    isActiveRoute(route) {
      return this.$route.path === route;
    },
  },
};
</script>

<style scoped>
.navbar-brand img {
  max-height: 50px;
  width: auto;
  object-fit: contain;
}

.dropdown-menu {
  max-width: 100vw;
  overflow-x: auto;
  background: linear-gradient(to right, #ffb347, #ffcc99);
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-size: large;
  font-weight: 700;
}

.dropdown-item {
  white-space: pre-wrap;
  color: #0a0a0a;
}

.dropdown-item:hover {
  background-color: #ffcc9980;
  color: #ffffff;
}

.dropdown-menu .active {
  background-color: #ffcc99;
  color: #ffffff;
}

.icon-lupa {
  margin-right: 10px;
}

.navbar-c {
  background: linear-gradient(to right, #ffb347, #ffcc99);
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-size: large;
  font-weight: 700;
}

.dropdown-c {
  background: linear-gradient(to right, #ffb347, #ffcc99);
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-size: large;
  font-weight: 700;
}
</style>
