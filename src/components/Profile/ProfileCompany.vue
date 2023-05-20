<template>
  <div class="background-image">
  <div>
    <NavbarCompany></NavbarCompany>
    <Loading v-model:active="isLoading"
                 :can-cancel="true"
                 :is-full-page="fullPage"></Loading>
  </div>
  <div class="card my-list" style="margin: 26px">
    <div class="card-body">
      <h4>Mi perfil</h4>
    </div>
  </div>
  <div class="container-fluid-a">
  <div class="row align-items-stretch" style="margin: 15px" v-if="!isLoading && Object.keys(dataCompany).length !== 0">
      <div class="col-sm-6">
        <div class="card h-100 my-list">
          <div class="card-body text-center position-relative">
            <i
              v-if="!editing.info"
              class="fa-solid fa-pen position-absolute top-0 end-0 me-2 mt-2"
              style="cursor: pointer"
              @click="editing.info = !editing.info"
            ></i>
            <i
              v-else
              class="fa-solid fa-check position-absolute top-0 end-0 me-1 mt-1"
              style="cursor: pointer"
              @click="editing.info = !editing.info; updateCompany()"
            ></i>
            <h5 class="card-title" v-if="!editing.info">{{ dataCompany.nombre }}</h5>
            <input v-else type="text" class="form-control" v-model="dataCompany.nombre" />
            <p class="card-text" v-if="!editing.info">{{ dataCompany.rubro }}</p>
            <input v-else type="text" class="form-control" v-model="dataCompany.rubro" />
            <br />
            <p class="card-text" v-if="!editing.info">
              <i class="fa-solid fa-phone"></i> {{ dataCompany.telefono }}
            </p>
            <input v-else type="text" class="form-control" v-model="dataCompany.telefono" />
            <p class="card-text" v-if="!editing.info">
              <i class="fa-solid fa-location-dot"></i> {{ dataCompany.region }},
              {{ dataCompany.comuna }}
            </p>
            <input v-else type="text" class="form-control" v-model="dataCompany.region" />
            <input v-else type="text" class="form-control" v-model="dataCompany.comuna" />
            <p class="card-text" v-if="!editing.info">
              <i class="fa-solid fa-earth-americas"></i> {{ dataCompany.pagina_web }}
            </p>
            <input v-else type="text" class="form-control" v-model="dataCompany.pagina_web" />
            <br />
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="card  h-100 my-list">
          <div class="card-body position-relative">
            <i
              v-if="!editing.about"
              class="fa-solid fa-pen position-absolute top-0 end-0 me-2 mt-2"
              style="cursor: pointer"
              @click="editing.about = !editing.about"
            ></i>
            <i
              v-else
              class="fa-solid fa-check position-absolute top-0 end-0 me-2 mt-2"
              style="cursor: pointer"
              @click="editing.about = !editing.about; updateCompany()"
            ></i>
            <h5 class="card-title">Acerca de</h5>
            <p class="card-text" v-if="!editing.about">{{ dataCompany.descripcion }}</p>
            <textarea v-else class="form-control" v-model="dataCompany.descripcion"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import { callApiAxios } from '../../services/axios';
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/css/index.css';
  import NavbarCompany from './../Navbar/NavbarCompany.vue';

  export default {
    data() {
      return {
        dataCompany: {},
        isLoading: false,
        fullPage: true,
        editing: {
          info: false,
          about: false
        }
      };
    },
    components: {
      Loading,
      NavbarCompany,
    },
    mounted() {
      this.getCompany();
    },
    methods: {
      async getCompany() {
        this.isLoading = true;
        const id = localStorage.getItem('id');
        let responseAxios = await callApiAxios('get', `http://localhost:3000/company/${id}`, {});

        this.isLoading = false;
        if (responseAxios.status == 200) {
          this.dataCompany = responseAxios.data;
        } else {
          return console.log("todo mal");
        }
      },
      async updateCompany() {
        const id_company = localStorage.getItem('id_company');
      let responseAxios = await callApiAxios("put", `http://localhost:3000/company/update`, {});

      if (responseAxios.status == 200) {
        return responseAxios.data;
      } else {
        console.log("algo salió mal");
      }
    },
    },
  };
</script>

<style scoped>
.icon-button {
  color: black;
}

.background-image{
  background-image: url('../../images/undraw_remotely_2j6y.svg');
   background-size: cover;
   background-repeat: no-repeat;
   
}

.color-table{
  background-color: rgba(17, 68, 112, 0.397);
}

.my-list{
  background-color: #f8f8f886;
}

.container-fluid-a {
  height: 78vh;
}

.row {
  height: 100%;
}

.card {
  height: 100%;
}

</style>