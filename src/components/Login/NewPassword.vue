<template>
  <div class="container d-flex flex-column" v-if="showPassword">
    <div class="row align-items-center justify-content-center
      min-vh-100 g-0">
      <div class="col-12 col-md-8 col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <div>
            </div>
            <div class="mb-4  text-center">
              <h3>
                <i class="fa fa-lock fa-4x"></i>
              </h3>
            </div>
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <input type="text" id="newPassword" class="form-control" name="newpassword" v-model="newpassword"
                  placeholder="Nueva contraseña" required="">
              </div>
              <div class="mb-3">
                <input type="text" id="newpassRepit" class="form-control" name="passRepit" v-model="newpasswordRepit"
                  placeholder="Repetir contraseña" required="">
              </div>
              <div class="mb-3 d-grid">
                <button type="submit" class="btn btn-primary"
                  @click="newPassword(newpassword, newpasswordRepit)">Restablecer contraseña</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container d-flex flex-column" v-if="showExito">
    <div class="row align-items-center justify-content-center
      min-vh-100 g-0">
      <div class="col-12 col-md-8 col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <div>
            </div>
            <div class="mb-4  text-center">
              <h3>
                <i class="fa fa-lock fa-4x"></i>
              </h3>
            </div>
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <h3>Tu clave ha sido cambiada con exitooooooooo!!!</h3>
              </div>
              <div class="mb-3 d-grid">
                <button type="submit" class="btn btn-primary">Restablecer contraseña</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { callApiAxios } from '../../services/axios';
export default {

  data() {
    return {
      newpassword: '',
      newpasswordRepit: '',
      showPassword: true,
      showExito: false
    };
  },

  components: {

  },

  mounted() {


  },
  methods: {

    async newPassword(pass1, pass2) {
      if (pass1 === pass2) {
        const smstokenexample = localStorage.getItem('smstoken');
        try {
          let responseAxios = await callApiAxios('put', this.$baseURL + '/login/new-password', {
            'newpassword': pass2,
            'smstoken': smstokenexample,
          });

          if (responseAxios.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Cambio de contraseña exitoso',
              text: 'Tu contraseña ha sido cambiada exitosamente.',
            }).then(() => {
              this.$router.push('/login');
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Hubo un problema al cambiar tu contraseña. Por favor, inténtalo de nuevo más tarde.',
            });
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un problema al cambiar tu contraseña. Por favor, inténtalo de nuevo más tarde.',
          });
        }
      } else {
        this.newpassword = '';
        this.newpasswordRepit = '';
      }
    }
  },
};
</script>

