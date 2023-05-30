<template>
  <div class="background-image">
  <div>
    <NavbarCompany></NavbarCompany>
  </div>
   
  <div class="card my-list" style="margin: 15px">
    <div class="card-body">
      <h4>Empleos publicados</h4>
    </div>
  </div>

  <div class="card my-list" style="margin: 15px">
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
          <div>
            <button class="btn btn-link icon-button" @click="redirectTo('/interaction', job.id)" title="Redireccionar">
              <i class="fa-solid fa-chart-line"></i>
            </button>
            <button class="btn btn-link icon-button" @click="showViewModal(job)" title="Ver">
              <i class="fa-regular fa-file"></i>
            </button>
            <button class="btn btn-link icon-button ml-2" @click="showEditModal(job)" title="Editar">
              <i class="fa-regular fa-pen-to-square"></i>
            </button>
            
          </div>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import Swal from 'sweetalert2';
import NavbarCompany from './../Navbar/NavbarCompany.vue';
import {callApiAxios} from '../../services/axios.ts';

export default {
  data() {
    return {
      jobs: [],
      selectedJob: null,
    };
  },
  components: {
    NavbarCompany
  },
  async mounted() {
    this.jobs = await this.fetchData(1);  
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
      '<option value="1">A plazo</option>' +
      '<option value="2">Indefinido</option>' +
      '</select>' +
      '</div>' +
      '<div class="swal2-row">' +
      '<label for="swal-input6" class="swal2-input-label">Jornada:</label>' +
      '<select id="swal-input6" class="swal2-input">' +
      '<option value="1">Jornada completa</option>' +
      '<option value="2">Part time</option>' +
      '</select>' +
      '</div>' +
      '<div class="swal2-row">' +
      '<label for="swal-input9" class="swal2-input-label">Años de experiencia:</label>' +
      '<input id="swal-input9" class="swal2-input" type="number" min="0" max="50" value="' + job.experiencia + '">' +
      '</div>'+
      '<div class="swal2-row">' +
      '<label for="swal-input7" class="swal2-input-label">Modalidad:</label>' +
      '<select id="swal-input7" class="swal2-input">' +
      '<option value="1">Hibrido</option>' +
      '<option value="2">Presencial</option>' +
      '<option value="3">Teletrabajo</option>' +
      '</select>' +
      '</div>' +
      '<div class="swal2-row">' +
      '<label for="swal-input8">Aptitudes:</label>' +
      '<input id="swal-input8" class="swal2-input" value="' + job.aptitudes + '">' +
      '</div>' ,
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
            document.getElementById('swal-input9').value,
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
        job.experiencia = parseInt(formValues[8])
        let responseAxios = await callApiAxios("put", `http://localhost:3000/jobs/update`, job);
            if (responseAxios.status == 200) {
              Swal.fire('Actualizado', 'El trabajo ha sido actualizado.', 'success');
            } else {
              Swal.fire('Error', 'Hubo un problema al actualizar el trabajo.', 'error');
            }
      }
},

    async fetchData(id) {
      let responseAxios = await callApiAxios("get", `http://localhost:3000/jobs/company/${id}`, {});
      if (responseAxios.status == 200) {
        return responseAxios.data;
      } else {
        console.log("algo salió mal");
      }
    },
  }
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

.icon-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.icon-button:hover::before {
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


.swal2-row *, .swal2-row *:before, .swal2-row *:after {
  box-sizing: border-box;
}

.job-table td {
  padding-left: 20px; 
  padding-bottom: 24px;
}

</style>
