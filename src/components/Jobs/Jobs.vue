<template>
  <div class="background-image">
    <div>
      <NavbarCompany></NavbarCompany>
      <Loading v-model:active="isLoading" :can-cancel="true" :is-full-page="fullPage"></Loading>
    </div>

    <div class="card my-list" style="margin: 15px">
      <div class="card-body">
        <h4>Empleos publicados</h4>
      </div>
    </div>

    <div v-if="jobs.length === 0 && !isLoading" class="card my-list" style="margin: 15px">
      <div class="card-body">
        <h5>No tienes ningún empleo publicado.</h5>
        <router-link :to="{ path: '/form-job' }" class="btn btn-primary">
          ¿Quieres publicar?
        </router-link>
      </div>
    </div>
    
    <div v-else class="card my-list" style="margin: 15px">
      <ul class="list-group list-group-flush">
        <li class="list-group-item my-list" v-for="job in jobs" :key="job.id">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <b>{{ job.nombre }}</b>
              <br>
              {{ job.cargo }}
              <br>
              {{ job.comuna }} ({{ job.modalidad }})
            </div>
            <div class="button-container" @mouseover="showTooltips = true" @mouseleave="showTooltips = false">
              <button class="btn btn-link icon-button" @click="redirectTo('/interaction', job.id)">
                <i class="fa-solid fa-chart-line"></i>
              </button>
              <button class="btn btn-link icon-button" @click="showViewModal(job)">
                <i class="fa-regular fa-file"></i>
              </button>
              <button class="btn btn-link icon-button ml-2" @click="showEditModal(job)">
                <i class="fa-regular fa-pen-to-square"></i>
              </button>
            </div>
          </div>
        </li>
      </ul>
      <div v-show="showTooltips" class="tooltip">Interacción</div>
      <div v-show="showTooltips" class="tooltip">Ver Trabajo</div>
      <div v-show="showTooltips" class="tooltip">Editar</div>
    </div>
  </div>
</template>


<script>
import Swal from 'sweetalert2';
import NavbarCompany from './../Navbar/NavbarCompany.vue';
import { callApiAxios } from '../../services/axios.ts';
import Loading from 'vue-loading-overlay';

export default {
  data() {
    return {
      jobs: [],
      selectedJob: null,
      isLoading: true,
      showTooltips: false,
      idCompany: false,
    };
  },
  components: {
    Loading,
    NavbarCompany
  },
  async mounted() {
    if (localStorage.getItem('isAuthenticated') !== 'true' || localStorage.getItem('tipo_perfil') !== '2') {
      this.$router.push({ name: 'Login' });
      return;
    }
    this.idCompany = localStorage.getItem('id_company');
    await this.fetchData(this.idCompany);
  },
  methods: {
    redirectTo(page, id) {
      window.location.href = page + '/' + id;
    },

    showViewModal(job) {
      Swal.fire({
        width: '800px',
        title: 'Ver Trabajo',
        html: `
        <table class="job-table" style="margin: auto;">
          <tr><td style="text-align: right;"><b>Nombre:</b></td><td style="text-align: left;"> ${job.nombre}</td></tr>
          <tr><td style="text-align: right;"><b>Región:</b></td><td style="text-align: left;"> ${job.region}</td></tr>
          <tr><td style="text-align: right;"><b>Comuna:</b></td><td style="text-align: left;"> ${job.comuna}</td></tr>
          <tr><td style="text-align: right;"><b>Cargo:</b></td><td style="text-align: left;"> ${job.cargo}</td></tr>
          <tr><td style="text-align: right;"><b>Contrato:</b></td><td style="text-align: left;"> ${job.contrato}</td></tr>
          <tr><td style="text-align: right;"><b>Jornada:</b></td><td style="text-align: left;"> ${job.jornada}</td></tr>
          <tr><td style="text-align: right;"><b>Modalidad:</b></td><td style="text-align: left;"> ${job.modalidad}</td></tr>
          <tr><td style="text-align: right;"><b>Aptitudes:</b></td><td style="text-align: left;"> ${job.aptitudes}</td></tr>
        </table>
        `,
      })
    },
    async showEditModal(job) {
      const { value: formValues } = await Swal.fire({
        width: '800px',
        title: 'Editar Trabajo',
        html:
          '<div class="swal2-row">' +
          '<input id="swal-input1" type="hidden" class="swal2-input" value="' + job.nombre + '">' +
          '</div>' +
          '<div class="swal2-row">' +
          '<label for="swal-input2">Región:</label>' +
          '<input id="swal-input2" class="swal2-input" value="' + job.region + '">' +
          '</div>' +
          '<div class="swal2-row">' +
          '<label for="swal-input3">Comuna:</label>' +
          '<input id="swal-input3" class="swal2-input" value="' + job.comuna + '">' +
          '</div>' +
          '<div class="swal2-row">' +
          '<label for="swal-input4">Cargo:</label>' +
          '<input id="swal-input4" class="swal2-input" value="' + job.cargo + '">' +
          '</div>' +
          '<div class="swal2-row">' +
          '<label for="swal-input5" class="swal2-input-label">Tipo de Contrato:</label>' +
          '<select id="swal-input5" class="swal2-input">' +
          '<option value="A plazo">A plazo</option>' +
          '<option value="Indefinido">Indefinido</option>' +
          '</select>' +
          '</div>' +
          '<div class="swal2-row">' +
          '<label for="swal-input6" class="swal2-input-label">Jornada:</label>' +
          '<select id="swal-input6" class="swal2-input">' +
          '<option value="Jornada completa">Jornada completa</option>' +
          '<option value="Part time">Part time</option>' +
          '</select>' +
          '</div>' +
          /*'<div class="swal2-row">' +
          '<label for="swal-input9" class="swal2-input-label">Años de experiencia:</label>' +
          '<input id="swal-input9" class="swal2-input" type="number" min="0" max="50" value="' + job.experiencia + '">' +
          '</div>' +*/
          '<div class="swal2-row">' +
          '<label for="swal-input7" class="swal2-input-label">Modalidad:</label>' +
          '<select id="swal-input7" class="swal2-input">' +
          '<option value="Hibrido">Hibrido</option>' +
          '<option value="Presencial">Presencial</option>' +
          '<option value="Teletrabajo">Teletrabajo</option>' +
          '</select>' +
          '</div>' +
          '<div class="swal2-row">' +
          '<label for="swal-input8">Aptitudes:</label>' +
          '<input id="swal-input8" class="swal2-input" value="' + job.aptitudes + '">' +
          '</div>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value,
            document.getElementById('swal-input3').value,
            document.getElementById('swal-input4').value,
            document.getElementById('swal-input5').value,
            document.getElementById('swal-input6').value,
            document.getElementById('swal-input7').value,
            document.getElementById('swal-input8').value,
            //document.getElementById('swal-input9').value,
          ]
        }
      })
      if (formValues) {
        job.nombre = formValues[0]
        job.region = formValues[1]
        job.comuna = formValues[2]
        job.cargo = formValues[3]
        job.contrato = formValues[4]
        job.jornada = formValues[5]
        job.modalidad = formValues[6]
        job.aptitudes = formValues[7]
        //job.experiencia = parseInt(formValues[8])
        let responseAxios = await callApiAxios("put", this.$baseURL + `/jobs/update`, job);
        if (responseAxios.status == 200) {
          Swal.fire('Actualizado', 'El trabajo ha sido actualizado.', 'success');
        } else {
          Swal.fire('Error', 'Hubo un problema al actualizar el trabajo.', 'error');
        }
      }
    },

    async fetchData(id) {
  try {
    let responseAxios = await callApiAxios("get", this.$baseURL + `/jobs/company/${id}`, {});
    if (responseAxios.status === 200) {
      this.jobs = responseAxios.data; // Asigna los datos a la variable jobs
    } else {
      console.log("Algo salió mal");
    }
  } catch (error) {
    console.log(error);
  } finally {
    this.isLoading = false; // Establece isLoading como falso para indicar que se han cargado los datos
  }
},


  }
};
</script>

<style scoped>
.icon-button {
  color: black;
}

.background-image {
  background-image: url('../../images/undraw_remotely_2j6y.svg');
  background-size: cover;
  background-repeat: no-repeat;
}

.color-table {
  background-color: rgba(17, 68, 112, 0.397);
}

.my-list {
  background-color: #f8f8f886;
}

.icon-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

/*.icon-button:hover::before {
  content: attr(title);
  position: absolute;
  top: -30px;
  right: 2%;
  transform: translateX(-50%);
  padding: 5px;
  background-color: #000;
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
}*/

.tooltip {
  background-color: red;
  color: white;
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px;
  background-color: #000;
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
}
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


.swal2-row *,
.swal2-row *:before,
.swal2-row *:after {
  box-sizing: border-box;
}

.job-table td {
  padding-left: 20px;
  padding-bottom: 24px;
}
</style>
