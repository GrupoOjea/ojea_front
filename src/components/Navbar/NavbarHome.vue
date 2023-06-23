<template>
  <nav class="navbar">
    <div class="container">
      <a class="navbar-brand" href="#">
        <img src="../../images/Logo_OJEA.png" alt="Ojea">
      </a>
      <div class="navbar-logo">
        <h1 class="navbar-logo-text">OJEA</h1>
      </div>
      <div class="navbar-nav">
        <div class="nav-item">
          <router-link :class="{ active: isActiveRoute('/register') }" to="/register" class="nav-link">
            <i class="fas fa-user-plus"></i> Crear cuenta
          </router-link>
        </div>
        <div class="nav-item">
          <router-link :class="{ active: isActiveRoute('/login') }" to="/login" class="nav-link">
            <i class="fas fa-sign-in-alt"></i> Iniciar sesión
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  components: {},
  methods: {
    closeSession() {
      localStorage.clear();
      this.$router.push('/login');
    },
    isActiveRoute(route) {
      return this.$route.path === route;
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #91a7ff, #5f76ff);
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.navbar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: "Arial", sans-serif;
  /* Cambiar la fuente aquí */
}

.navbar-brand img {
  height: 50px;
}

.navbar-nav {
  display: flex;
  flex-direction: row;
}

.nav-item {
  margin-left: 20px;
}

.nav-link {
  display: flex;
  align-items: center;
  color: #ffffff;
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  transform: scale(1.05);
}

.nav-link i {
  margin-right: 10px;
}
</style>
