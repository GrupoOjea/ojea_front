<template>
  <div>
    <NavbarCompany></NavbarCompany>
    <Loading v-model:active="isLoading" :can-cancel="true" :is-full-page="fullPage"></Loading>
  </div>
  <div class="card" style="margin: 15px">
    <div class="card-body">
      <h4>Interacción</h4>
      <p>Personas que postularon a este empleo ({{ postulado }})</p>
      <p>Personas que guardaron este empleo ({{ guardado }})</p>
    </div>
  </div>

  <div class="card" style="margin: 15px">
    <ul class="list-group list-group-flush">
      <li class="list-group-item" v-for="job in jobs" :key="job.id">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <b>{{ job.texto_habilidades }}</b>
            <br>
            {{ job.titulo }} - {{ job.institucion }}
            <br>
            {{ job.comuna }}, {{ job.region }}
          </div>
          <div>
            <button class="btn btn-link icon-button" @click="showViewModal()">
              <i class="fa-regular fa-file"></i>
            </button>
            <button class="btn btn-link icon-button" @click="showPdfModal()">
              <i class="fa-regular fa-file-pdf"></i>
            </button>
            <button class="btn btn-link icon-button ml-2" @click="showSendMailModal(job)">
              <i class="fa-regular fa-envelope"></i>
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
  
<script>
import Swal from 'sweetalert2';
import NavbarCompany from './../Navbar/NavbarCompany.vue';
import { callApiAxios } from '../../services/axios.ts';
import pdfFile from '@/assets/pdf/formulario_cv.pdf';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

export default {
  data() {
    return {
      jobs: [],
      selectedJob: null,
      jobId: null,
      postulado: null,
      guardado: null,
      isLoading: false,
    };
  },
  components: {
    Loading,
    NavbarCompany
  },
  async mounted() {
    // Comprobar si el usuario está autenticado
    if (localStorage.getItem('isAuthenticated') !== 'true' || localStorage.getItem('tipo_perfil') !== '2') {
      this.$router.push({ name: 'Login' });
      return;
    }
    this.jobId = Number(this.$route.params.id);
    this.jobs = await this.getInformation();
    this.getPostulation();
  },
  methods: {

    async getPostulation() {
      let responseAxios = await callApiAxios("get", `http://localhost:3000/postulation/${this.jobId}`, {});
      if (responseAxios.status == 200) {
        this.postulado = responseAxios.data.postulado;
        this.guardado = responseAxios.data.guardado;
        return responseAxios.data;
      } else {
        console.log("algo salió mal");
      }
    },

    async getInformation() {
      let responseAxios = await callApiAxios("get", `http://localhost:3000/postulation/information/${this.jobId}`, {});
      if (responseAxios.status == 200) {
        console.log(responseAxios.data)
        return responseAxios.data;
      } else {
        console.log("algo salió mal");
      }
    },

    showViewModal() {
      const job = this.jobs[0];
      Swal.fire({
        width: '800px',
        title: 'Ver Detalle ',
        html: `
        <table class="job-table" style="margin: auto;">
        <tr><td style="text-align: right;"><b>Telefono:</b></td><td style="text-align: left;"> ${job.telefono}</td></tr>
        <tr><td style="text-align: right;"><b>Región:</b></td><td style="text-align: left;"> ${job.region}</td></tr>
        <tr><td style="text-align: right;"><b>Comuna:</b></td><td style="text-align: left;"> ${job.comuna}</td></tr>
        <tr><td style="text-align: right;"><b>Profesion:</b></td><td style="text-align: left;"> ${job.profesion}</td></tr>
        <tr><td style="text-align: right;"><b>Institucion:</b></td><td style="text-align: left;"> ${job.institucion}</td></tr>
        <tr><td style="text-align: right;"><b>Titulo:</b></td><td style="text-align: left;"> ${job.titulo}</td></tr>
        <tr><td style="text-align: right;"><b>Aptitudes:</b></td><td style="text-align: left;"> ${job.texto_habilidades}</td></tr>
      </table>
        `,
      })
    },

    async showSendMailModal(job) {
      this.isLoading = true;

      let datos = {
        "email": "emerzon.melo@inacapmail.cl",
        "body_email": "hola",
        "email_empresa": "atech@gmail.com",
        "nombre_empresa": "Atech",
        "cargo": "Programador junior"
      }

      try {
        let respuestaAxios = await callApiAxios("post", `http://localhost:3000/postulation/send`, datos);

        if (respuestaAxios.status === 201) {
          Swal.fire(
            '¡Éxito!',
            'Correo enviado correctamente',
            'success'
          )
        }
      } catch (error) {
        console.log('Hubo un error al enviar el correo', error);
        Swal.fire(
          'Error',
          'Hubo un error al enviar el correo',
          'error'
        )
      } finally {
        this.isLoading = false;
      }
    },


    showPdfModal() {
      Swal.fire({
        title: 'PDF',
        html: `<embed src="${pdfFile}" type="application/pdf" width="100%" height="500px" />`,
        width: '80%',
        showCloseButton: true,
        showConfirmButton: false,
        customClass: {
          content: 'pdf-modal-content',
        },
      });
    },

  }
};
</script>
  
<style scoped>
.icon-button {
  color: black;
}
</style>

<style>
.job-table td {
  padding-left: 20px;
  padding-bottom: 24px;
}
</style>