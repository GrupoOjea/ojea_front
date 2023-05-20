<template>
  <div class="background-image">
  <div> <NavbarCompany> </NavbarCompany></div>
  <div class="container">
    <div class="row mt-5">
      <div class="col-4 text-center">
        <input
          id="search"
          name="search"
          v-model="dataSearcher"
          type="text"
          class="form-control"
          placeholder="Buscar persona por aptitudes, institución o título"
        />
      </div>
      <div class="col-4 text-center">
        <input
          id="where"
          name="where"
          v-model="dataWhere"
          type="text"
          class="form-control"
          placeholder="¿Donde?"
        />
      </div>
      <div class="col-4">
        <button type="button" class="btn btn-primary btn-buscar" @click="getSearcher(dataSearcher, dataWhere)">Buscar</button>
      </div>
    </div>
  </div>
  

  <div class="card" style="margin: 15px" v-if="showCard">
    <ul class="list-group list-group-flush">
      <li
        class="list-group-item"
        style="background-color: #5c5b5b; color: white;"
      >
        Personas que quizás te puedan interesar ({{ dataLength }})
      </li>
    </ul>
    <ul
      class="list-group list-group-flush"
      v-for="(item, index) in dataSearch"
      :key="index"
    >

      <li class="list-group-item">
        <b>{{ item.texto_habilidades }}</b>
        <br>
        {{ item.titulo }} - {{ item.institucion }}
        <br>
        {{ item.comuna }}, {{ item.region }}
      </li>

    </ul>
  </div>
</div>
</template>

<script>
  import NavbarCompany from './../Navbar/NavbarCompany.vue'
  import { callApiAxios } from "../../services/axios";
  import Loading from "vue-loading-overlay";
  import "vue-loading-overlay/dist/css/index.css";

  export default {
    data() {
      return {
        dataSearcher: "",
        dataWhere: "",
        isLoading: false,
        fullPage: true,
        dataSearch: null,
        dataLength: 0,
        showCard: false,
      };
    },
    components: {
      Loading,
      NavbarCompany
    },

    mounted() {
      this.getSearcher();
    },
    methods: {
      async getSearcher(dataSearcher, dataWhere) {
        let responseAxios = await callApiAxios("get", "http://localhost:3000/profile/get", {
          buscador: dataSearcher ,
          donde: dataWhere,
        });

        if (responseAxios.status == 200) {
          this.dataSearch = responseAxios.data;
          this.dataLength = this.dataSearch.length;
          this.showCard = true;
        } else {
          console.log("algo salió mal");
        }
      },
    },
  };
 </script>

<style scoped>
.btn-buscar {
  background-color: #6d63ffa9;
  
}

.btn-buscar:hover {
  background-color: #6d63ff;
  
}

.background-image{
  background-image: url('../../images/undraw_remotely_2j6y.svg');
   background-size: cover;
   background-repeat: no-repeat;
}

.color-table{
  background-color: rgba(17, 68, 112, 0.397);
}
</style>
