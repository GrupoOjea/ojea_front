<template>
<div class="container d-flex flex-column" v-if="showResetpass">
  <div class="row align-items-center justify-content-center
      min-vh-100 g-0">
    <div class="col-12 col-md-8 col-lg-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="mb-4  text-center">
            <h3 >
            <i class="fa fa-lock fa-4x"></i>
            </h3>
            <h5>¿Has olvidado tu contraseña?</h5>
            <p class="mb-2">Ingrese su correo electrónico registrado
            </p>
          </div>
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <input type="email" id="email" class="form-control" name="email" v-model="emailReset" placeholder="Introduce tu correo electrónico"
                required="">
            </div>
            <div class="mb-3 d-grid">
            <button type="submit" class="btn btn-primary"  @click="resetPassword(emailReset)">Restablecer contraseña</button>
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
            <h3 >
            <i class="fa fa-envelope fa-4x"></i>
            </h3>
            <h5>Ingresar sms enviado a su correo {{emailReset}}</h5>
          </div>
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <input type="text" maxlength="6" id="smsToken" class="form-control" name="smsToken" v-model="smsToken" placeholder="Introduce codigo sms"
                required="">
            </div>
            <div class="mb-3 d-grid">
            <button type="submit" class="btn btn-primary"  @click="validateSms(smsToken)">Validar sms</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>

import {callApiAxios} from '../../services/axios';
export default {
  
  data() {
    return {
      smsToken:'',
      emailReset:'',
      showResetpass:true,
      showSmsToken:false,

    };
  },
  components: {

  },

  mounted() {
  

  },
  methods: {

    async resetPassword(email){
  
    let responseAxios = await callApiAxios('put','http://localhost:3000/login/forgot-password',{
      'email':email,
      });

      if(responseAxios.status == '200'){
         this.showSmsToken = true;
         this.showResetpass = false;
      }
     
    },
    async validateSms(smsToken){
    let responseAxios = await callApiAxios('post','http://localhost:3000/login/valid-sms',{
      'smstoken':smsToken,
      });
      console.log(responseAxios);
      if(responseAxios.status == '201'){
        localStorage.setItem('smstoken', smsToken)
        this.$router.push('/new-password')
      }
    },
    }
};
</script>