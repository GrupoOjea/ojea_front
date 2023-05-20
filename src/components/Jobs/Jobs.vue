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
            <button class="btn btn-link icon-button" @click="showViewModal(job)">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn btn-link icon-button ml-2" @click="showEditModal(job)">
              <i class="fa-solid fa-pen"></i>
            </button>
            
          </div>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import Swal from 'sweetalert2'
import NavbarCompany from './../Navbar/NavbarCompany.vue'
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
    showViewModal(job) {
      Swal.fire({
        title: 'Ver Trabajo',
        html: `
      <p><b>Nombre:</b> ${job.nombre}</p>
      <p><b>Región:</b> ${job.region}</p>
      <p><b>Comuna:</b> ${job.comuna}</p>
      <p><b>Cargo:</b> ${job.cargo}</p>
      <p><b>Contrato:</b> ${job.contrato}</p>
      <p><b>Jornada:</b> ${job.jornada}</p>
      <p><b>Modalidad:</b> ${job.modalidad}</p>
      <p><b>Aptitudes:</b> ${job.aptitudes}</p>`,
      })
    },
    async showEditModal(job) {
      const { value: formValues } = await Swal.fire({
        title: 'Editar Trabajo',
        html:
      '<label for="swal-input1">Nombre:</label>' +
      '<input id="swal-input1" class="swal2-input" value="' + job.nombre + '">' +
      
      '<label for="swal-input2">Región:</label>' +
      '<input id="swal-input2" class="swal2-input" value="' + job.region + '">' +
      
      '<label for="swal-input3">Comuna:</label>' +
      '<input id="swal-input3" class="swal2-input" value="' + job.comuna + '">' +
      
      '<label for="swal-input4">Cargo:</label>' +
      '<input id="swal-input4" class="swal2-input" value="' + job.cargo + '">' +
      
      '<label for="swal-input5">Contrato:</label>' +
      '<input id="swal-input5" class="swal2-input" value="' + job.contrato + '">' +
      
      '<label for="swal-input6">Jornada:</label>' +
      '<input id="swal-input6" class="swal2-input" value="' + job.jornada + '">' +
      
      '<label for="swal-input7">Modalidad:</label>' +
      '<input id="swal-input7" class="swal2-input" value="' + job.modalidad + '">' +
      
      '<label for="swal-input8">Aptitudes:</label>' +
      '<input id="swal-input8" class="swal2-input" value="' + job.aptitudes + '">',
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
</style>