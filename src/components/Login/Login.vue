<template>
<div class="content" style="margin: 25px">
  <loading v-model:active="isLoading"
                 :can-cancel="true"
                 :is-full-page="fullPage"/>
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
                <input type="password" class="form-control" id="password"  v-model="passwordLogin"> 
                
              </div>
              
              <div class="d-flex mb-5 align-items-center">
  
                <span class="ml-auto">
                  <router-link to="/reset-password">¿Olvidó su clave?</router-link>
                  </span> 
              </div>

              <button type="submit" class="btn btn-block btn-primary"  @click="login(emailLogin, passwordLogin)">Ingresar</button>
    
            </form>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  </div>
</template>
<script>
import {callApiAxios} from '../../services/axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
export default {
  
  data() {
    return {
      isLoading: false,
      fullPage: true,
      emailLogin:'',
      passwordLogin:'',
    };
  },
  components: {
  Loading
  },

  mounted() {
  

  },
  methods: {

  async login(email, pass){
    this.isLoading = true;
    let responseAxios = await callApiAxios('post','http://localhost:3000/login/session',{
      'email':email,
      'clave':pass,
    });
    this.isLoading = false;
    console.log(responseAxios.data)
    if(responseAxios.status == '201'){
      let {token, estado, estatus_registro, tipo_perfil, nombre, id} = responseAxios.data

      if(responseAxios.data.estado == 0){
        localStorage.setItem('id', id)
        localStorage.setItem('estado', estado)
        localStorage.setItem('tipo', tipo_perfil)

        if(tipo_perfil == 2){ 
          const getInformationCompany = await callApiAxios('get',`http://localhost:3000/company/${id}`,{});
          let id_company = getInformationCompany.data.id
          localStorage.setItem('id_company', id_company)
        }

        console.log(id)
        this.$router.push('/search');
      }
      else{
        localStorage.setItem('estado', estado)
        localStorage.setItem('estatus_registro', estatus_registro)
        localStorage.setItem('tipo_perfil', tipo_perfil)
        localStorage.setItem('token', token)
        localStorage.setItem('nombre', nombre)
        this.setLocalStorage();
      }
  
    }
  },
    
  setLocalStorage() {
    // Establece un objeto en el almacenamiento local
    const data = { name: 'ejemplo', age: 30 };
    localStorage.setItem('data', JSON.stringify(data));

    // Espera 1 hora antes de borrar el objeto del almacenamiento local
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



