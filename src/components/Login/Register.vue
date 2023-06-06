<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <form style="margin: 15px; width: 50%;" @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Email</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="emailCreate" />
      </div>
      <div class="mb-3">
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
      <div class="mb-3">
        <label for="exampleInputPassword2" class="form-label">Confirmar Contraseña</label>
        <div class="input-group">
          <input :type="passwordFieldType" class="form-control" id="exampleInputPassword2" v-model="passCreateConfirm" />
          <div class="input-group-append">
            <button type="button" class="btn btn-transparent eye-button" @click="togglePasswordVisibility">
              <i :class="['fas', passwordFieldType === 'password' ? 'fa-eye' : 'fa-eye-slash']"></i>
            </button>
          </div>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" @click="createAccount(emailCreate, passCreate, passCreateConfirm)">Guardar</button>
    </form>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import {callApiAxios} from '../../services/axios.ts';
export default {
  data() {
    return {
      emailCreate: '',
      passCreate: '',
      passCreateConfirm: '',
      passwordFieldType: 'password'
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
  let responseAxios = await callApiAxios('post','http://localhost:3000/login/create',{
      'tipo_perfil':1,
      'email':emailCreate,
      'clave':passCreate,
    });

  if(responseAxios.status == '202'){
    Swal.fire({
      title: 'Error',
      text: 'Usuario ya existe',
      icon: 'error'
    })
  }
  if(responseAxios.status == '201'){
    localStorage.setItem('id', responseAxios.data.id);
    
    Swal.fire({
      title: 'Éxito',
      text: 'Usuario insertado',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        this.$router.push(`/register-user/${responseAxios.data.id}`);
      }
    })
  }
},
    submitForm() {
      this.createAccount(this.emailCreate, this.passCreate, this.passCreateConfirm);
    }
  }
}
</script>

<style scoped>
.eye-button {
  color: inherit;
  transition: color 0.2s ease;
}
.eye-button:hover {
  color: #727272;
}
</style>