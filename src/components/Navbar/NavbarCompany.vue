<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Ojea</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"> 
            <a class="nav-link active" aria-current="page" href="#">Buscar profesional</a>
          </li>
        </ul>
       <ul class="nav navbar-nav pull-xs-right">
      <li class="nav-item">   
          <router-link to="/register" class="nav-link"></router-link>
      </li>
      <li class="nav-item">
         <router-link to="/login" class="nav-link"></router-link>
      </li>
  
     </ul>
        </div>
      </div>
  </nav>
  </template>
  
  <script>
  
  export default {
    components: {
     
     
    },
    methods:{
       closeSession(){
        localStorage.clear();
        this.$router.push('/login');
      }
  
    }
  }
  </script>
  
  