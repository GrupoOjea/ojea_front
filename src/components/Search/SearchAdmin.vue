<template>
  <div class="background-image">
    <div>
      <NavbarAdmin> </NavbarAdmin>
      <Loading v-model:active="isLoading" :can-cancel="true" :is-full-page="fullPage"></Loading>
    </div>
    <div class="container">
      <div class="row mt-5">
        <div class="col-4 text-center">
          <input id="search" name="search" v-model="dataSearcher" type="text" class="form-control"
            placeholder="Buscar persona por aptitudes, institución o título" />
        </div>
        <div class="col-4 text-center">
          <input id="where" name="where" v-model="dataWhere" type="text" class="form-control" placeholder="¿Donde?" />
        </div>
        <div class="col-4">
          <button type="button" class="btn btn-primary btn-buscar"
            @click="getSearcher(dataSearcher, dataWhere)">Buscar</button>
        </div>
      </div>
    </div>


    <div class="card my-list" style="margin: 15px" v-if="showCard">
      <ul class="list-group list-group-flush">
        <li class="list-group-item my-list" style="background-color: #5c5b5b; color: white;">
          Personas que quizás te puedan interesar ({{ dataLength }})
        </li>
      </ul>
      <ul class="list-group list-group-flush" v-for="(item, index) in dataSearch" :key="index">

        <li class="list-group-item my-list">
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
import { callApiAxios } from "../../services/axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import NavbarAdmin from '../Navbar/NavbarAdmin.vue';

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
    NavbarAdmin
},

  mounted() {
    // Comprobar si el usuario está autenticado
    if (localStorage.getItem('isAuthenticated') !== 'true' || localStorage.getItem('tipo_perfil') !== '3') {
      this.$router.push({ name: 'Login' });
      return;
    }

    this.getSearcher();
  },
  methods: {
    async getSearcher(dataSearcher, dataWhere) {
      let responseAxios = await callApiAxios("get", this.$baseURL + "/profile/get", {
        buscador: dataSearcher,
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
  background-color: #6d63ff;
}

.btn-buscar:hover {
  background-color: #6d63ffa9;

}

.background-image {
  background-image: url('../../images/undraw_remotely_2j6y.svg');
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
  min-height: 100%;
}

.my-list {
  background-color: #f8f8f886;
}
</style>
