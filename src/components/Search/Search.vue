<template>
  <div class="container">
  <div class="row mt-5">
  <div class="row mt-5">
    
    <div class="col-4 text-center">
      <input type="text" class="form-control" placeholder="Buscar cargo o Persona">
    </div>
    <div class="col-4  text-center">
      <input type="text" class="form-control" placeholder="¿Donde?">
    </div>
    <div class="col-4">
      <button type="button" class="btn btn-primary" @click=" ">Buscar</button>
    </div>
    </div>
  </div>
  </div>

</template>

<script>

  export default {
    data() {
      return {
       
      };
    },
    components: {
      
    },
    mounted() {
      
    },
    methods: {

      async searchPerson(smsToken){
        let responseAxios = await callApiAxios('get','',{
          
        });
        
        
        
      }
    }
  };
</script>