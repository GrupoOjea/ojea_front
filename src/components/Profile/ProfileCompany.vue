<template>
  <div> <NavbarCompany> </NavbarCompany></div>
  <div class="card" style="margin: 26px">
    <div class="card-body">
      <h4>Mi perfil</h4>
    </div>
  </div>

  <div class="row" style="margin: 15px">
    <div class="col-sm-6">
      <div class="card">
        <div class="card-body text-center">
          <h5 class="card-title">{{ dataCompany.nombre }}</h5>
          <p class="card-text">{{ dataCompany.rubro }}</p>
          <br>
          <p class="card-text"><i class="fa-solid fa-phone"></i> {{ dataCompany.telefono }}</p>
          <p class="card-text"><i class="fa-solid fa-location-dot"></i> {{ dataCompany.region }}, {{ dataCompany.comuna }}</p>
          <p class="card-text"><i class="fa-solid fa-earth-americas"></i> {{ dataCompany.pagina_web }}</p>
          <br>
        </div>
      </div>
    </div>
    <div class="col-sm-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Acerca de</h5>
          <p class="card-text">{{ dataCompany.descripcion }}</p>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>

  import {callApiAxios} from '../../services/axios';
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/css/index.css';
  import NavbarCompany from './../Navbar/NavbarCompany.vue'

  export default {
    data() {
      return {
        dataCompany: {},
        isLoading: false,
        fullPage: true,
      };
    },
    components: {
      Loading,
      NavbarCompany
    },
    mounted() {
      this.getCompany();
    },
    methods: {
      async getCompany(){
        this.isLoading = true;
        //const id = this.$route.params.id;
        //console.log(id);
        let responseAxios = await callApiAxios('get',`http://localhost:3000/company/16`,{});

        this.isLoading = false;
        if(responseAxios.status == 200){
          this.dataCompany = responseAxios.data;
        }
        else{
          return console.log("todo mal");
        }
      }
    }
  };
</script>