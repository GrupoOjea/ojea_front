<template>
  <div class="container d-flex flex-column" v-if="showResetpass">
    <div class="row align-items-center justify-content-center
      min-vh-100 g-0">
      <div class="col-12 col-md-8 col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="mb-4  text-center">
              <h3>
                <i class="fa fa-lock fa-4x"></i>
              </h3>
              <h5>¿Has olvidado tu contraseña?</h5>
              <p class="mb-2">Ingrese su correo electrónico registrado
              </p>
            </div>
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <input type="email" id="email" class="form-control" name="email" v-model="emailReset"
                  placeholder="Introduce tu correo electrónico" required="">
              </div>
              <div class="mb-3 d-grid">
                <button type="submit" class="btn btn-primary" @click="resetPassword(emailReset)">Restablecer
                  contraseña</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container d-flex flex-column" v-if="showSmsToken">
    <div class="row align-items-center justify-content-center
      min-vh-100 g-0">
      <div class="col-12 col-md-8 col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="mb-4  text-center">
              <h3>
                <i class="fa fa-envelope fa-4x"></i>
              </h3>
              <h5>Ingresar sms enviado a su correo {{ emailReset }}</h5>
            </div>
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <input type="text" maxlength="6" id="smsToken" class="form-control" name="smsToken" v-model="smsToken"
                  placeholder="Introduce codigo sms" required="">
              </div>
              <div class="mb-3 d-grid">
                <button type="submit" class="btn btn-primary" @click="validateSms(smsToken)">Validar sms</button>
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
      smsToken: '',
      emailReset: '',
      showResetpass: true,
      showSmsToken: false,

    };
  },
  components: {

  },

  mounted() {


  },
  methods: {

    async resetPassword(email) {
      try {
        const response = await callApiAxios('put', this.$baseURL + '/login/forgot-password', {
          email: email,
        });

        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Correo enviado',
            text: 'Se ha enviado un correo electrónico con las instrucciones para restablecer tu contraseña.',
          });
          this.showSmsToken = true;
          this.showResetpass = false;
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El correo electrónico ingresado no está registrado. Por favor, verifica tu correo electrónico e inténtalo de nuevo.',
          });
        } else {
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un problema al restablecer la contraseña. Por favor, inténtalo de nuevo más tarde.',
          });
        }
      }
    },
    async validateSms(smsToken) {
      try {
        let responseAxios = await callApiAxios('post', this.$baseURL + '/login/valid-sms', {
          'smstoken': smsToken,
        });
        console.log(responseAxios);
        if (responseAxios.status === 201) {
          console.log("ENTRA ACA")
          localStorage.setItem('smstoken', smsToken);
          Swal.fire({
            icon: 'success',
            title: 'Código válido',
            text: 'El código ingresado es válido. Ahora puedes proceder a cambiar tu contraseña.',
          }).then(() => {
            this.$router.push('/new-password');
          });
        }

      } catch (error) {
        if (error.response && error.response.status != 201) {
          Swal.fire({
            icon: 'error',
            title: 'Código inválido',
            text: 'El código ingresado es inválido. Por favor, verifica tu correo y vuelve a validar el código.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un problema al validar el código. Por favor, inténtalo de nuevo más tarde.',
          });
        }
      }
    },
  }
};
</script>