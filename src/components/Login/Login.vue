<template>
  <div class="content" style="margin: 25px">
    <button @click="goBack" class="back-button"><i class="fa-solid fa-arrow-left"></i></button>
    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="fullPage" />
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <img src="../../images/undraw_remotely_2j6y.svg" alt="Image" class="img-fluid">
        </div>
        <div class="col-md-6 contents">
          <div class="row justify-content-center">
            <div class="col-md-8">
              <div class="mb-4">
                <h3>Inicia sesión</h3>
              </div>
              <form @submit.prevent="submitForm">
                <div class="form-group first">
                  <label for="email">Correo</label>
                  <input type="text" class="form-control" id="email" v-model="emailLogin">

                </div>
                <div class="form-group last mb-4">
                  <label for="password">Clave</label>
                  <input type="password" class="form-control" id="password" v-model="passwordLogin">

                </div>

                <div class="d-flex mb-5 align-items-center">

                  <span class="ml-auto">
                    <router-link to="/reset-password">¿Olvidó su clave?</router-link>
                  </span>
                </div>

                <button type="submit" class="btn btn-block btn-primary btn-login"
                  @click="login(emailLogin, passwordLogin)">Ingresar</button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>
<script>
import Swal from 'sweetalert2';
import { callApiAxios } from '../../services/axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
export default {

  data() {
    return {
      isLoading: false,
      fullPage: true,
      emailLogin: '',
      passwordLogin: '',
    };
  },
  components: {
    Loading
  },

  mounted() {


  },
  methods: {

    goBack() {
      this.$router.push('/');
    },

    async login(email, pass) {
      this.isLoading = true;
      
      if (!email || !pass) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Por favor, ingrese datos válidos.',
        });
        this.isLoading = false;
        return;
      }

      let responseAxios = await callApiAxios('post', 'http://localhost:3000/login/session', {
        'email': email,
        'clave': pass,
      });
      this.isLoading = false;
      if (responseAxios.status == '201') {
        let { token, estado, estatus_registro, tipo_perfil, nombre, id } = responseAxios.data

        if (estado == 0) {
          localStorage.setItem('id', id);
          localStorage.setItem('estado', estado);
          localStorage.setItem('tipo', tipo_perfil);

          if (tipo_perfil == 1) {
            try {
              const getPersonInformation = await callApiAxios('get', `http://localhost:3000/profile/${id}`, {});
              console.log(getPersonInformation)
              if (getPersonInformation && getPersonInformation.data && Object.keys(getPersonInformation.data).length > 0) {
                console.log(getPersonInformation.data)
                this.$router.push('/search-user');
              } else {
                this.$router.push(`/register-user/${responseAxios.data.id}`);
              }
            } catch (error) {
              console.log('Error en la llamada a la API:', error);
            }
          }else if (tipo_perfil == 2) {
            try {
              const getInformationCompany = await callApiAxios('get', `http://localhost:3000/company/${id}`, {});
              if (getInformationCompany && getInformationCompany.data) {
                let id_company = getInformationCompany.data.id;
                let nombre = getInformationCompany.data.nombre;
                localStorage.setItem('id_company', id_company);
                localStorage.setItem('nombre', nombre);
                this.$router.push('/search');
              } else {
                console.log("La respuesta de la API no tiene el formato esperado");
              }
            } catch (error) {
              console.log('Error en la llamada a la API:', error);
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El usuario ingresado no tiene perfil de empresa ni de tipo uno.',
            });
          }
        } else if (!token) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El usuario no fue encontrado o la contraseña es incorrecta.',
          });
          return;
        } else {
          this.$router.push('/search-user');
          localStorage.setItem('estado', estado);
          localStorage.setItem('estatus_registro', estatus_registro);
          localStorage.setItem('tipo_perfil', tipo_perfil);
          localStorage.setItem('token', token);
          localStorage.setItem('nombre', nombre);
          this.setLocalStorage();
        }
      }
    },

    setLocalStorage() {
      const data = { name: 'ejemplo', age: 30 };
      localStorage.setItem('data', JSON.stringify(data));

      setTimeout(() => {
        localStorage.removeItem('data');
        localStorage.clear();
        alert("Session caducada")
        window.location.reload();

        // Agrega una notificación o mensaje para informar al usuario que se ha borrado el objeto del almacenamiento local
      }, 3600000); // 1 hora = 3600000 milisegundos
    }

  },
};
</script>

<style scoped>
.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  z-index: 1000;
}

.back-button:hover {
  background-color: #eee;
}

.btn-login {
  background-color: #6d63ff;
}

.btn-login:hover {
  background-color: #6d63ffa9;

}
</style>


