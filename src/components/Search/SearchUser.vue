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
          <button type="button" class="btn btn-custom" @click="getSearcher(dataSearcher, dataWhere)">Buscar</button>
        </div>
      </div>
    </div>

    <div class="card my-list" style="margin: 15px" v-if="showCard">
      <ul class="list-group list-group-flush">
        <li class="list-group-item no-hover" style="background-color: #5c5b5b; color: white;">
          <div style="display: flex; justify-content: space-between;">
            <span>Buscaste: {{ dataSearcher }}</span>
            <span>{{ dataLength }} resultados</span>
          </div>
        </li>
      </ul>
      <ul class="list-group list-group-flush" v-for="(item, index) in dataSearch" :key="index">
        <li class="list-group-item my-list" @click="item.onClick">
          <b>{{ item.cargo }} - {{ item.nombre }}</b>
          <br>
          {{ item.aptitudes }}
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
      id_profile: {},
    };
  },
  components: {
    Loading,
    NavbarUser
  },

  async mounted() {
    if (localStorage.getItem('isAuthenticated') !== 'true' || localStorage.getItem('tipo_perfil') !== '1') {
      this.$router.push({ name: 'Login' });
      return;
    }
    const id = localStorage.getItem('id');
    const response = await callApiAxios('get', this.$baseURL + `/profile/${id}`, {});
    console.log("Datos persona", response.data.id)
    this.id_profile = response.data.id;
  },

  methods: {
    async getSearcher(dataSearcher, dataWhere) {
      try {
        let responseAxios = await callApiAxios("post", this.$baseURL + "/jobs/search", {
          buscador: dataSearcher,
          donde: dataWhere
        });

        if (responseAxios.status == 201) {
          this.dataSearch = responseAxios.data;
          this.dataLength = this.dataSearch.length;
          this.showCard = true;
          console.log(this.dataSearch)

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

    async createPostulation(type, item) {
      console.log("ID DEL PERFIL", this.id_profile)
      console.log("ID DEL job", item.id)
      try {
        const response = await callApiAxios('post', this.$baseURL + '/postulation/create', {
          tipo_empleo: type,
          estado: 1, // debes establecer el estado aquí,
          fecha_creacion: new Date(),
          fk_persona: this.id_profile, // debes establecer la persona aquí,
          fk_empleo: item.id // debes establecer el empleo aquí
        });

        if (response.status !== 201) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        Swal.fire(
          'Éxito',
          'La postulación se ha creado con éxito',
          'success'
        )

        return response.data;
      } catch (error) {
        console.error(error);
        Swal.fire(
          'Error',
          'Hubo un problema al crear la postulación',
          'error'
        )
      }
    },


    async showDetails(item) {
      console.log("Aqui viene el los Datos del Item", item);
      const id = localStorage.getItem('id');
      // Obtén los datos del perfil
      let profileResponse = await callApiAxios("get", this.$baseURL + `/profile/${id}`, {});
      if (
        profileResponse.status != 200 ||
        Object.values(profileResponse.data).some(value => value === null) ||
        profileResponse.data.habilidades.some(h => h.id_skill === null || h.sub_habilidad === null || h.habilidad_principal === null)
      ) {
        Swal.fire('Error', 'Por favor, completa tu perfil antes de postular o guardar este empleo.', 'error');
        return;
      }

      // Obtén los datos de la educación
      let educationResponse = await callApiAxios("get", this.$baseURL + `/education/get/${id}`, {});
      if (educationResponse.status != 200 || educationResponse.data.length === 0) {
        Swal.fire('Error', 'Por favor, completa tus datos de educación antes de postular o guardar este empleo.', 'error');
        return;
      }
      console.log("Aqui viene el los Datos del Item", item);
      Swal.fire({
        width: '1400px',
        heightAuto: false,
        html: `
      <div class="data-box">
        <h2>${item.cargo}</h2>
        <p>${item.nombre}. ${item.comuna}, ${item.region}, Chile (${item.modalidad})</p>
        <br>
        <p><i class="fa-solid fa-business-time"></i> Experiencia Requerida: ${item.experiencia} año</p>
        <p><i class="fa-solid fa-suitcase"></i> Jornada: ${item.jornada}</p>
        <p><i class="fa-solid fa-square-check"></i> Aptitudes: ${item.aptitudes}</p>
      </div>
      <div style="margin-top: 20px;" class="data-box">
        <h3>Descripción:</h3>
        <p>${item.descripcion}</p>
      </div>
    `,
        confirmButtonText: 'Guardar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => this.createPostulation(2, item), // para 'Guardar'
        showDenyButton: true,
        denyButtonText: 'Solicitar',
        denyButtonAriaLabel: 'Solicitar'
      }).then((result) => {
        if (result.isDenied) {
          this.createPostulation(1, item); // para 'Solicitar'
        }
      })
    }

  },
};
</script>

<style scoped>
/* Personalización de los botones */
.btn-custom {
  background-color: #ffb347;
  /* color de fondo */
  color: black;
  /* color de texto */
  border: none;
  /* eliminar el borde */
}

.btn-custom:hover {
  background-color: #ffcc99;
  /* color de fondo al pasar el mouse */
  color: black;
  /* color de texto al pasar el mouse */
}

.btn-custom:active {
  background-color: #ffcc99;
  /* color de fondo al hacer clic */
  color: black;
  /* color de texto al hacer clic */
  box-shadow: none;
  /* eliminar la sombra al hacer clic */
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

.list-group-item.my-list:hover {
  background: linear-gradient(to right, #ffb347, #ffcc99);
}
</style>

