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
                class="fa-solid fa-pen position-absolute top-0 end-0 me-2 mt-2"
                style="cursor: pointer"
                @click="showEditModal"
              ></i>
              <h5 class="card-title">{{ dataCompany.nombre }}</h5>
              <p class="card-text">{{ dataCompany.rubro }}</p>
              <br />
              <p class="card-text">
                <i class="fa-solid fa-phone"></i> {{ dataCompany.telefono }}
              </p>
              <p class="card-text">
                <i class="fa-solid fa-location-dot"></i> {{ dataCompany.region }},
                {{ dataCompany.comuna }}
              </p>
              <p class="card-text">
                <i class="fa-solid fa-earth-americas"></i> {{ dataCompany.pagina_web }}
              </p>
              <br />
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card  h-100 my-list">
            <div class="card-body position-relative">
              <i
                class="fa-solid fa-pen position-absolute top-0 end-0 me-2 mt-2"
                style="cursor: pointer"
                @click="showDescriptionModal"
              ></i>
              <h5 class="card-title">Acerca de</h5>
              <p class="card-text">{{ dataCompany.descripcion }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Swal from 'sweetalert2';
import { callApiAxios } from '../../services/axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import NavbarCompany from './../Navbar/NavbarCompany.vue';

  export default {
    data() {
      return {
        dataCompany: {},
        
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

      async showEditModal() {
      const { value: formValues } = await Swal.fire({
        title: 'Editar Empresa',
        html:
        '<div class="swal2-row">' +
        '<label for="swal-input1">Nombre:</label>' +
        '<input id="swal-input1" class="swal2-input" value="' + this.dataCompany.nombre + '">' +
        '</div>' +
        '<div class="swal2-row">' +
        '<label for="swal-input2">Rubro:</label>' +
        '<input id="swal-input2" class="swal2-input" value="' + this.dataCompany.rubro + '">' +
        '</div>' +
        '<div class="swal2-row">' +
        '<label for="swal-input3">Teléfono:</label>' +
        '<input id="swal-input3" class="swal2-input" value="' + this.dataCompany.telefono + '">' +
        '</div>' +
        '<div class="swal2-row">' +
        '<label for="swal-input4">Región:</label>' +
        '<input id="swal-input4" class="swal2-input" value="' + this.dataCompany.region + '">' +
        '</div>' +
        '<div class="swal2-row">' +
        '<label for="swal-input5">Comuna:</label>' +
        '<input id="swal-input5" class="swal2-input" value="' + this.dataCompany.comuna + '">' +
        '</div>' +
        '<div class="swal2-row">' +
        '<label for="swal-input6">Página Web:</label>' +
        '<input id="swal-input6" class="swal2-input" value="' + this.dataCompany.pagina_web + '">' +
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
          ]
        }
      })
      
      if (formValues) {
        this.dataCompany.nombre = formValues[0]
        this.dataCompany.rubro = formValues[1]
        this.dataCompany.telefono = formValues[2]
        this.dataCompany.region = formValues[3]
        this.dataCompany.comuna = formValues[4]
        this.dataCompany.pagina_web = formValues[5]
        let responseAxios = await this.updateCompany();
      }
    },

    showDescriptionModal() {
      Swal.fire({
        title: 'Editar Descripción',
        input: 'textarea',
        inputValue: this.dataCompany.descripcion,
        inputPlaceholder: 'Ingrese la nueva descripción de la empresa...',
        inputAttributes: {
          autocapitalize: 'off',
          class: 'description-textarea'
        },
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        customClass: {
          input: 'description-textarea'
        },
        heightAuto: true, 
        inputValidator: (value) => {
          if (!value) {
            return '¡Necesitas escribir algo!'
          }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.dataCompany.descripcion = result.value;
          this.updateCompany();
        }
      })
    },

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
        
        let responseAxios = await callApiAxios("put", `http://localhost:3000/company/update`, {
          id: this.dataCompany.id,
          nombre: this.dataCompany.nombre,
          run: this.dataCompany.run,
          telefono: this.dataCompany.telefono,
          region: this.dataCompany.region,
          comuna: this.dataCompany.comuna,
          rubro: this.dataCompany.rubro,
          pagina_web: this.dataCompany.pagina_web,
          descripcion: this.dataCompany.descripcion,
          tipo_plan: this.dataCompany.tipo_plan,
          fecha_creacion: this.dataCompany.fecha_creacion,
          fecha_modificacion: new Date().toISOString(),
          fk_login: this.dataCompany.fk_login,
        });
        if (responseAxios.status == 200) {
            Swal.fire('Actualizado', 'La empresa ha sido actualizada.', 'success');
          return responseAxios.status;
        } else {
          Swal.fire('Error', 'Hubo un problema al actualizar la empresa.', 'error');
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

<style>
.description-textarea {
  height: auto;
  min-height: 300px;
  resize: none;
  overflow: hidden;
}
.swal2-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.swal2-row label {
  margin-right: 1rem;
}
</style>