<template>
  <!--div class="background-image"-->
    <div>
      <NavbarCompany> </NavbarCompany>
    </div>

    <!-- Inicio del iframe de Grafana -->
    <iframe v-if="grafanaUrl" :src="grafanaUrl" width="100%" height="800" frameborder="0"></iframe>
    <!-- Fin del iframe de Grafana -->

  <!--/div-->
</template>


<script>
import NavbarCompany from './../Navbar/navbarcompany.vue'
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
      idCompany: null,
      grafanaUrl: '',
    };
  },
  components: {
    Loading,
    NavbarCompany,
  },

  mounted() {
    // Comprobar si el usuario está autenticado
    if (localStorage.getItem('isAuthenticated') !== 'true' || localStorage.getItem('tipo_perfil') !== '2') {
      this.$router.push({ name: 'Login' });
      return;
    }

    this.fetchCompanyID();

    this.getSearcher();
  },
  methods: {
    fetchCompanyID() {
      const id = localStorage.getItem('id_company');
      if (id) {
        this.idCompany = id; 
        this.grafanaUrl = `http://52.7.205.254:3000/d/cdd2f87e-5513-4b28-8b36-d526a4ab1bf2/dashboard-ojea?orgId=1&var-empresa=${this.idCompany}&kiosk&refresh=5s`;
      } else {
        console.error('No company ID found');
      }
    },
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
