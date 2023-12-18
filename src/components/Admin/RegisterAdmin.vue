<template>
  <div>
    <NavbarAdmin> </NavbarAdmin>
  </div>
  <div class="card my-list" style="margin: 15px">
    <div class="card-body">
      <h4>Crear Perfil Empresa</h4>
    </div>
  </div>
  <div class="container">
    <div class="row justify-content-center align-items-center vh-102">
      <div class="col-md-8">
        <div class="card card-form">
          <div class="card-body">
            <div class="back-button-container">
              <button @click="goBack" class="back-button"><i class="fa-solid fa-arrow-left"></i></button>
            </div>
            <h2 class="form-title">Crear cuenta</h2>
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <label for="exampleInputEmail1" class="form-label">Email</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                  v-model="emailCreate" />
              </div>
              <div class="form-group">
                <label for="exampleInputPassword1" class="form-label">Contraseña</label>
                <div class="input-group">
                  <input :type="passwordFieldType" class="form-control" id="exampleInputPassword1" v-model="passCreate" />
                  <div class="input-group-append">
                    <button type="button" class="btn btn-transparent eye-button" @click="togglePasswordVisibility">
                      <i :class="['fas', passwordFieldType === 'password' ? 'fa-eye' : 'fa-eye-slash']"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="exampleInputPassword2" class="form-label">Confirmar Contraseña</label>
                <div class="input-group">
                  <input :type="passwordFieldType" class="form-control" id="exampleInputPassword2"
                    v-model="passCreateConfirm" />
                  <div class="input-group-append">
                    <button type="button" class="btn btn-transparent eye-button" @click="togglePasswordVisibility">
                      <i :class="['fas', passwordFieldType === 'password' ? 'fa-eye' : 'fa-eye-slash']"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <button type="submit" class="btn btn-primary btn-buscar">Crear</button>
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
import { callApiAxios } from '../../services/axios.ts';
import NavbarAdmin from '../Navbar/NavbarAdmin.vue';

export default {
    data() {
        return {
            emailCreate: '',
            passCreate: '',
            passCreateConfirm: '',
            passwordFieldType: 'password'
        };
    },
    mounted() {
    if (localStorage.getItem('isAuthenticated') !== 'true' || localStorage.getItem('tipo_perfil') !== '3') {
      this.$router.push({ name: 'Login' });
      return;
    }
    },
    methods: {
        togglePasswordVisibility() {
            this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
        },
        async createAccount(emailCreate, passCreate, confirmPassword) {
            if (passCreate !== confirmPassword) {
                Swal.fire({
                    title: 'Error',
                    text: 'Las contraseñas no coinciden',
                    icon: 'error'
                });
                return;
            }
            if (!emailCreate || !passCreate || !confirmPassword) {
                Swal.fire({
                    title: 'Error',
                    text: 'Por favor, completa todos los campos',
                    icon: 'error'
                });
                return;
            }
            let responseAxios = await callApiAxios('post', this.$baseURL + '/login/create', {
                'tipo_perfil': 2,
                'email': emailCreate.toLowerCase(),
                'clave': passCreate,
            });
            if (responseAxios.status == '202') {
                Swal.fire({
                    title: 'Error',
                    text: 'El usuario ingresado ya existe',
                    icon: 'error'
                });
            }
            if (responseAxios.status == '201') {
                localStorage.setItem('id', responseAxios.data.id);
                localStorage.setItem('isAuthenticated', 'true');
                Swal.fire({
                    title: 'Éxito',
                    text: 'Usuario Creado Correctamente',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.$router.push(`/register-company/${responseAxios.data.id}`);
                    }
                });
            }
        },
        submitForm() {
            this.createAccount(this.emailCreate, this.passCreate, this.passCreateConfirm);
        },
        goBack() {
            this.$router.push('/manage-profile');
        }
    },
    components: { NavbarAdmin }
}
</script>

<style scoped>
.card-form {
  background-color: #f8f9fa;
  border: none;
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
}

.back-button-container {
  position: absolute;
  top: 20px;
  left: 20px;
}

.back-button {
  background-color: transparent;
  color: #000000;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.eye-button {
  color: inherit;
  transition: color 0.2s ease;
}

.eye-button:hover {
  color: #6d63ffa9;
}

.btn-buscar {
  background-color: #6d63ff;
}

.btn-buscar:hover {
  background-color: #6d63ffa9;
}
.form-group {
  margin-bottom: 20px;
}
</style>
