<template>
  <div> <NavbarCompany> </NavbarCompany></div>
  <div class="card" style="margin: 15px">
    <div class="card-body">
      <h4>Empleos publicados</h4>
    </div>
  </div>

  <div class="card" style="margin: 15px">
    <ul class="list-group list-group-flush">
      
      <li class="list-group-item">
        <b>Titulo</b>
        
        <br>
        Descripcion
        <br>
        Descripcion
      </li>

    </ul>
  </div>
  
</template>

<script>

  import NavbarCompany from './../Navbar/NavbarCompany.vue'
  import {callApiAxios} from '../../services/axios.ts';

  export default {
    data() {
      return {
       
      };
    },
    components: {
      NavbarCompany
    },
    mounted() {
      
    },
    methods: {
      
    }
  };
</script>