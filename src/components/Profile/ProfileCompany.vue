<template>
  <div>
    <NavbarCompany></NavbarCompany>
  </div>
  <div class="card" style="margin: 26px">
    <div class="card-body">
      <h4>Mi perfil</h4>
    </div>
  </div>

  <div class="row row d-flex align-items-stretch" style="margin: 15px">
    <div class="col-sm-6">
      <div class="card h-100">
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
            @click="editing.info = !editing.info"
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
      <div class="card  h-100">
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
            @click="editing.about = !editing.about"
          ></i>
          <h5 class="card-title">Acerca de</h5>
          <p class="card-text" v-if="!editing.about">{{ dataCompany.descripcion }}</p>
          <textarea v-else class="form-control" v-model="dataCompany.descripcion"></textarea>
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
        //const id = this.$route.params.id;
        //console.log(id);
        let responseAxios = await callApiAxios('get', `http://localhost:3000/company/16`, {});

        this.isLoading = false;
        if (responseAxios.status == 200) {
          this.dataCompany = responseAxios.data;
        } else {
          return console.log("todo mal");
        }
      },
    },
  };
</script>

