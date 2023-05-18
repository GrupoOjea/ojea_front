<template>
<div>
    <NavbarHome></NavbarHome>
  </div>
  <div class="full-screen-image">
    <img src="../../images/home.jpg" alt="Ojea">
  </div>
</template>

<script>
import NavbarHome from './../Navbar/NavbarHome.vue';

  export default {
    data() {
      return {
       
      };
    },
    components: {
      NavbarHome,
    },
    mounted() {
      
    },
    methods: {
      
    }
  };
</script>

<style scoped>
.full-screen-image {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden; 
}

.full-screen-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>