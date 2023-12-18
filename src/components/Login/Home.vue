<template>
  <div id="home-page">
    <NavbarHome></NavbarHome>
    <br>
    <div class="jumbotron text-center text-white" id="welcome-section">
      <h1 class="display-4">¡Bienvenido a nuestra aplicación!</h1>
      <p class="lead">En nuestra aplicación, puedes Buscar el mejor empleo, de una forma segura.</p>
      <button class="btn btn-dark btn-lg mt-4" @click="goToSignUp">Comienza aquí</button>
    </div>
    <br><br>
    <h2 class="text-center mb-4">Trabajos Destacados Por OJEA</h2>
    <Carrusel></Carrusel>
    <div class="container my-5 text-white">
      <h2 class="text-center mb-4">Lo que nuestros usuarios están diciendo</h2>
      <div class="row">
        <div class="col-md-4">
          <div class="card bg-light">
            <div class="card-body">
              <blockquote class="blockquote mb-0">
                <p class="text-dark">"Este sitio web es asombroso!"</p>
                <footer class="blockquote-footer text-dark">Usuario A</footer>
              </blockquote>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-light">
            <div class="card-body">
              <blockquote class="blockquote mb-0">
                <p class="text-dark">"Realmente me ha ayudado."</p>
                <footer class="blockquote-footer text-dark">Usuario B</footer>
              </blockquote>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-light">
            <div class="card-body">
              <blockquote class="blockquote mb-0">
                <p class="text-dark">"No podría vivir sin esto!"</p>
                <footer class="blockquote-footer text-dark">Usuario C</footer>
              </blockquote>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="jumbotron text-center text-white" id="final-section">
      <h2>¿Listo para empezar?</h2>
      <button class="btn btn-dark btn-lg mt-4" @click="goToSignUp">Regístrate ahora</button>
    </div>
    <br><br>
    <footer class="footer bg-dark text-white text-center py-4 mt-5">
      <p>© 2023 OJEA. Todos los derechos reservados.</p>
      <p><a href="/contact">Contacto</a> | <a href="/terms">Términos y condiciones</a> | <a href="/privacy">Política de privacidad</a></p>
      <div>
        <a href="https://www.facebook.com/OJEA.CL" target="_blank"><i class="fab fa-facebook-f"></i></a>
        <a href="https://twitter.com/OJEA_CL" target="_blank"><i class="fab fa-twitter"></i></a>
        <a href="https://www.instagram.com/OJEA.CL/" target="_blank"><i class="fab fa-instagram"></i></a>
      </div>
    </footer>
  </div>
</template>

<script>
import NavbarHome from './../Navbar/NavbarHome.vue';
import Carrusel from './../Jobs/Carrusel.vue';

export default {
  data() {
    return {

    };
  },
  components: {
    NavbarHome,
    Carrusel
  },
  methods: {
    goToSignUp() {
      this.$router.push('/register');
      // Navegar al formulario de registro
    }
  }
};
</script>

<style scoped>
#home-page {
  background: linear-gradient(to left, #91a7ff, #5f76ff);
}

#final-section {
  background: none;
}

.card {
    border: none;
  }

  .footer a {
    color: white;
    margin: 0 1em;
  }

  .fab {
    margin: 0 0.5em;
    font-size: 1.5em;
  }
</style>
