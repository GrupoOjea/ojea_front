<template>
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
        <button type="button" class="btn btn-primary" @click="jobsDefault(dataSearcher, dataWhere)">Buscar</button>
      </div>
    </div>
  </div>

  <div class="card" style="margin: 15px" v-if="showCard">
    <ul class="list-group list-group-flush">
      <li
        class="list-group-item"
        style="background-color: #5c5b5b; color: white;"
      >
        Empleos que quizás te puedan interesar ({{ dataLength }})
      </li>
    </ul>
    <ul
      class="list-group list-group-flush"
      v-for="(item, index) in dataSearch"
      :key="index"
    >
      <li class="list-group-item">
        <b>Python, Nest, MySQL</b>
        <br />
        Ingeniero en informatica
        <li class="list-group-item">
    <b>{{ item.texto_habilidades }}</b>
    <br>
    {{ item.titulo }} - {{ item.institucion }}
    <br>
    {{ item.comuna }}, {{ item.region }}
  </li>
      </li>
    </ul>
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
      this.jobsDefault();
    },
    methods: {
      async jobsDefault(dataSearcher, dataWhere) {
        let responseAxios = await callApiAxios("get", "http://localhost:3000/profile/get", {
          buscador: dataSearcher ,
          donde: dataWhere,
        });
        console.log("Respuesta completa:", responseAxios); // Agrega esta línea
        console.log("Que entrega", dataSearcher, responseAxios);
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
