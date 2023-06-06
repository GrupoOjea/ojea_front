<template>
  <div class="background-image">
    <div>
      <NavbarUser> </NavbarUser>
    </div>
    <div class="container">
      <div class="row mt-5">
        <div class="col-4 text-center">
          <input id="search" name="search" v-model="dataSearcher" type="text" class="form-control"
            placeholder="Buscar cargos o empresas" />
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
          <div style="display: flex; justify-content: space-between;">
            <span>Buscaste: {{ dataSearcher }}</span>
            <span>{{ dataLength }} resultados</span>
          </div>
        </li>
      </ul>
      <ul class="list-group list-group-flush" v-for="(item, index) in dataSearch" :key="index">
        <li class="list-group-item my-list" @click="item.onClick">
          <b>{{ item.aptitudes }}</b>
          <br>
          {{ item.cargo }} - {{ item.nombre }}
          <br>
          {{ item.comuna }}, {{ item.region }}
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
import NavbarUser from './../Navbar/NavbarUser.vue'
import { callApiAxios } from "../../services/axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import Swal from 'sweetalert2'

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
    NavbarUser
  },

  mounted() {
  },

  methods: {
    async getSearcher(dataSearcher, dataWhere) {
      try {
        let responseAxios = await callApiAxios("post", "http://localhost:3000/jobs/search", {
          buscador: dataSearcher,
          donde: dataWhere
        });

        if (responseAxios.status == 201) {
          this.dataSearch = responseAxios.data;
          this.dataLength = this.dataSearch.length;
          this.showCard = true;

          // Agregar el handler de click a cada item
          this.dataSearch.forEach(item => {
            item.onClick = () => this.showDetails(item);
          });
        } else {
          console.log("algo salió mal");
        }


      } catch (error) {
        if (error.response && error.response.status == 400) {
          console.log("Error:", error.response.data.message);
          // Aquí puedes mostrar un mensaje de error al usuario
        }
      }
    },

    showDetails(item) {
      Swal.fire({
        width: '1400px',
        heightAuto: false, // Agrega esta línea
        title: item.cargo,
        html: `
      <div>
        <p>${item.nombre}. ${item.comuna}, ${item.region}, Chile (${item.modalidad})</p>
        <div class="data-box">  <!-- Envuelve los datos con este div -->
          <p>Jornada: ${item.jornada} - ${item.experiencia}</p>
          <p>Aptitudes: ${item.aptitudes}</p>
        </div>
        <div style="margin-top: 20px;" class="data-box"> <!-- Y este -->
          <h3>Descripción:</h3>
          <p>${item.descripcion}</p>
        </div>
      </div>
    `,
        confirmButtonText: 'Guardar',
        showCancelButton: true,
        cancelButtonText: 'Solicitar',
      })
    },





  },
};
</script>

<style scoped>
/*.btn-buscar {
  background-color: #6d63ff;
}
.btn-buscar:hover {
  background-color: #6d63ffa9;
  
}

.background-image{
  background-image: url('../../images/undraw_remotely_2j6y.svg');
   background-size: cover;
   background-repeat: no-repeat;
   height: 100vh;
   min-height: 100%;
}

.my-list{
  background-color: #f8f8f886;
}**/
</style>

<style>
.swal2-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.swal2-row label {
  text-align: right;
}

.swal2-row *, .swal2-row *:before, .swal2-row *:after {
  box-sizing: border-box;
}

/* Añade estos estilos para el cuadro */
.data-box {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
}
</style>

