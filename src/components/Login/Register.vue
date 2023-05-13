<template>

  <form style="margin: 15px" @submit.prevent="submitForm">
    <div class="mb-3">
      <label for="exampleInputEmail1" class="form-label">Email</label>
      <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model = "emailCreate">
    </div>
    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">Contresaña</label>
      <input type="password" class="form-control" id="exampleInputPassword1" v-model = "passCreate">
    </div>
    <button type="submit" class="btn btn-primary" @click="createAccount(emailCreate, passCreate)">Guardar</button>
  </form>
  
</template>

<script>

import {callApiAxios} from '../../services/axios.ts';

  export default {
    data() {
      return {
        emailCreate: null,
        passCreate: null
      };
    },
    components: {
      
    },
    mounted() {
      
    },
    methods: {
      async createAccount(emailCreate, passCreate){

        let responseAxios = await callApiAxios('post','http://localhost:3000/login/create',{
          'tipo_perfil':1,
          'email':emailCreate,
          'clave':passCreate,
        });

        if(responseAxios.status == '202'){
          alert("Usuario ya existe")
        }
        if(responseAxios.status == '201'){
          alert("Usuario insertado");
        }

      }
    }
  };
</script>