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
            <h5 v-if="job.tipo_empleo == 1">Postulado</h5>
            <h5 v-else-if="job.tipo_empleo == 2">Guardado</h5>
            <p>{{ job.titulo }} - {{ job.institucion }}</p>
            <p>{{ job.comuna }}, {{ job.region }}</p>
          </div>

          <div>
            <button class="btn btn-link icon-button" v-if="job.tipo_empleo == 1" @click="showViewModal(job.id)">
              <i class="fa-regular fa-file"></i>
            </button>
            <button class="btn btn-link icon-button" v-else-if="job.tipo_empleo == 2" @click="showSavedJobModal(job.id)">
              <i class="fa-regular fa-file"></i>
            </button>
            <!--button class="btn btn-link icon-button ml-2" @click="showSendMailModal(job)">
              <i class="fa-regular fa-envelope"></i>
            </button-->
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
      postulados: [],
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
    this.jobs = await this.getInformationAll();
    this.getPostulation();
  },
  methods: {

    async getPostulation() {
      let responseAxios = await callApiAxios("get", this.$baseURL + `/postulation/${this.jobId}`, {});
      if (responseAxios.status == 200) {
        this.postulado = responseAxios.data.postulado;
        this.guardado = responseAxios.data.guardado;
        return responseAxios.data;
      } else {
        console.log("algo salió mal");
      }
    },

    async getInformationAll() {
      let responseAxios = await callApiAxios("get", this.$baseURL + `/postulation/information/all/${this.jobId}`, {});
      if (responseAxios.status == 200) {
        console.log(responseAxios.data)
        return responseAxios.data;
      } else {
        console.log("algo salió mal");
      }
    },

    async showViewModal(id) {
      let responseAxios = await callApiAxios("get", this.$baseURL + `/postulation/information/${id}`, {});
      if (responseAxios.status == 200) {
        console.log(responseAxios.data)
        this.postulados = responseAxios.data;
      } else {
        console.log("algo salió mal");
      }
      const job = this.postulados[0];
      Swal.fire({
        width: '900px',
        title: 'Ver información',
        html: `
        <style>
        .job-table { width: 100%; }
        .job-table td { padding: 0.5em; }
        .job-table .aptitudes-td { 
          max-width: 650px; /* Ajusta según sea necesario */
          overflow-wrap: break-word;
        }
        @media (max-width: 600px) {
          .job-table { font-size: 0.8em; }
          .job-table .aptitudes-td { max-width: none; }
        }
      </style>
      <br>
      <table class="job-table" style="margin: auto;">
        <tr><td style="text-align: right;"><b>Región:</b></td><td style="text-align: left;"> ${job.region}</td></tr>
        <tr><td style="text-align: right;"><b>Comuna:</b></td><td style="text-align: left;"> ${job.comuna}</td></tr>
        <tr><td style="text-align: right;"><b>Profesion:</b></td><td style="text-align: left;"> ${job.titulo}</td></tr>
        <tr><td style="text-align: right;"><b>Institucion:</b></td><td style="text-align: left;"> ${job.institucion}</td></tr>
        <tr><td style="text-align: right;"><b>Aptitudes:</b></td><td class="aptitudes-td" style="text-align: left;"> ${job.habilidades}</td></tr>
      </table>
        `,
        showCloseButton: true,
        showDenyButton: true,
        confirmButtonText: 'En proceso de seleccion',
        denyButtonText: 'Rechazar',
        reverseButtons: false
      }).then(async (result) => {
        let estado;
        let estadoMensaje;
        if (result.isConfirmed) {
          estado = 2; // En proceso de seleccion
          estadoMensaje = 'en proceso de selección';
        } else if (result.isDenied) {
          estado = 3; // Rechazado
          estadoMensaje = 'rechazado';
        } else {
          return; // Salir si se presionó el botón de cerrar o se presionó escape
        }
        const body = {
          id: job.id,
          estado: estado
        };
        try {
          const responseAxios = await callApiAxios('put', this.$baseURL + '/postulation/update-state', body);
          if (responseAxios.status === 200) {
            Swal.fire('¡Éxito!', `Estado de la postulación actualizado a ${estadoMensaje} con éxito.`, 'success');
          } else {
            Swal.fire('¡Error!', 'Hubo un error al actualizar el estado de la postulación.', 'error');
          }
        } catch (error) {
          Swal.fire('¡Error!', 'Hubo un error al actualizar el estado de la postulación.', 'error');
        }
      })
    },

    async showSavedJobModal(id) {
      let responseAxios = await callApiAxios("get", this.$baseURL + `/postulation/information/${id}`, {});
      if (responseAxios.status == 200) {
        console.log(responseAxios.data)
        this.postulados = responseAxios.data;
      } else {
        console.log("algo salió mal");
      }
      const job = this.postulados[0];
      Swal.fire({
    width: '1000px',
    title: 'Ver información',
    html: `
      <style>
        .job-table { width: 100%; }
        .job-table td { padding: 0.5em; }
        .job-table .aptitudes-td { 
          max-width: 650px; /* Ajusta según sea necesario */
          overflow-wrap: break-word;
        }
        @media (max-width: 600px) {
          .job-table { font-size: 0.8em; }
          .job-table .aptitudes-td { max-width: none; }
        }
      </style>
      <br>
      <table class="job-table" style="margin: auto;">
        <tr><td style="text-align: right;"><b>Región:</b></td><td style="text-align: left;"> ${job.region}</td></tr>
        <tr><td style="text-align: right;"><b>Comuna:</b></td><td style="text-align: left;"> ${job.comuna}</td></tr>
        <tr><td style="text-align: right;"><b>Profesion:</b></td><td style="text-align: left;"> ${job.titulo}</td></tr>
        <tr><td style="text-align: right;"><b>Institucion:</b></td><td style="text-align: left;"> ${job.institucion}</td></tr>
        <tr><td style="text-align: right;"><b>Aptitudes:</b></td><td class="aptitudes-td" style="text-align: left;"> ${job.habilidades}</td></tr>
      </table>
    `,
    showCloseButton: true,
    confirmButtonText: ' <i class="fa fa-thumbs-up"></i> Perfil Interesante',
  }).then(async (result) => {
    let estado;
    if (result.isConfirmed) {
      estado = 4;
    } else {
      return; // Salir si se canceló el modal
    }
    const body = {
      id: job.id,
      estado: estado
    };
    try {
      const responseAxios = await callApiAxios('put', this.$baseURL + '/postulation/update-state', body);
      if (responseAxios.status === 200) {
        Swal.fire('¡Éxito!', `Has marcado este perfil como interesante.`, 'success');
      } else {
        Swal.fire('¡Error!', 'Hubo un error al marcar el perfil como interesante.', 'error');
      }
    } catch (error) {
      Swal.fire('¡Error!', 'Hubo un error al marcar el perfil como interesante.', 'error');
    }
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
        let respuestaAxios = await callApiAxios("post", this.$baseURL + `/postulation/send`, datos);

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