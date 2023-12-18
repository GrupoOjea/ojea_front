<template>
  <div class="background-image">
    <div>
      <NavbarCompany> </NavbarCompany>
    </div>
    <div class="card my-list" style="margin: 15px">
      <div class="card-body">
        <h4>Publicar empleo</h4>
      </div>
    </div>
    <div class="card my-list" style="margin: 15px">
      <div class="card-body">
        <form>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="inputCargo" class="form-label">Cargo</label>
              <input type="text" class="form-control" id="inputCargo" v-model="cargoTxt">
            </div>
            <div class="col-md-6 mb-3">
              <label for="inputContrato" class="form-label">Tipo de contrato</label>
              <select id="inputContrato" class="form-control" v-model="contratoSelect">
                <option value="A plazo">A plazo</option>
                <option value="Indefinido">Indefinido</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label for="inputJornada" class="form-label">Jornada</label>
              <select id="inputJornada" class="form-control" v-model="jornadaSelect">
                <option value="Jornada completa">Jornada completa</option>
                <option value="Part time">Part time</option>
              </select>
            </div>
            <!--div class="col-md-6 mb-3">
              <label for="inputExperiencia" class="form-label">Años de experiencia</label>
              <div class="d-flex align-items-center">
                <input type="range" class="form-control-range flex-grow-1 mr-2" id="inputExperiencia"
                  v-model="experienciaSelect" min="0" max="50">
                <input type="number" class="form-control w-auto" v-model="experienciaSelect" min="0" max="50">
              </div>
            </div-->

            <div class="col-md-6 mb-3">
              <label for="inputModalidad" class="form-label">Modalidad</label>
              <select id="inputModalidad" class="form-control" v-model="modalidadSelect">
                <option value="Hibrido">Hibrido</option>
                <option value="Presencial">Presencial</option>
                <option value="Teletrabajo">Teletrabajo</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label for="exampleInputEmail1" class="form-label">Aptitudes</label>
              <input type="text" class="form-control" id="inputAptitudes" v-model="aptitudesTxt">
            </div>
            <div class="col-12 mb-3">
              <label for="exampleInputEmail1" class="form-label">Descripción</label>
              <textarea class="form-control" id="inputDescripcion" v-model="descripcionTxt" rows="3"></textarea>
            </div>
          </div>
          <br>
          <button type="submit" class="btn btn-primary"
            @click.prevent="createJob(cargoTxt, contratoSelect, jornadaSelect, /*experienciaSelect,*/ modalidadSelect, aptitudesTxt, descripcionTxt)">Finalizar</button>
        </form>
      </div>
    </div>
  </div>
</template>




<script>
import Swal from 'sweetalert2';
import NavbarCompany from './../Navbar/NavbarCompany.vue'
import { callApiAxios } from '../../services/axios.ts';

export default {
  data() {
    return {
      cargoTxt: null,
      contratoSelect: null,
      jornadaSelect: null,
      experienciaSelect: null,
      modalidadSelect: null,
      aptitudesTxt: null,
      descripcionTxt: null
    };
  },
  components: {
    NavbarCompany
  },
  mounted() {
    // Comprobar si el usuario está autenticado
    if (localStorage.getItem('isAuthenticated') !== 'true' || localStorage.getItem('tipo_perfil') !== '2') {
      this.$router.push({ name: 'Login' });
      return;
    }

  },
  methods: {
    validateForm() {
      const fields = ['cargoTxt', 'contratoSelect', 'jornadaSelect', /*'experienciaSelect',*/ 'modalidadSelect', 'aptitudesTxt', 'descripcionTxt'];

      for (let field of fields) {
        if (!this[field]) {
          return false;
        }
      }

      return true;
    },

    async createJob(cargoTxt, contratoSelect, jornadaSelect, /*experienciaSelect,*/ modalidadSelect, aptitudesTxt, descripcionTxt) {
      event.preventDefault();
      if (!this.validateForm()) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor completa todos los campos antes de enviar.'
        });
        return;
      }
      try {
        const id_company = parseInt(localStorage.getItem('id_company'));
        const responseAxios = await callApiAxios('post', this.$baseURL + '/jobs/create', {
          'cargo': cargoTxt,
          'contrato': contratoSelect,
          'jornada': jornadaSelect,
          //'experiencia': parseInt(experienciaSelect),
          'modalidad': modalidadSelect,
          'aptitudes': aptitudesTxt,
          'descripcion': descripcionTxt,
          'fk_empresa': id_company
        });

        if (responseAxios.status == 201) {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Registro insertado exitosamente'
          }).then(() => {
            location.reload();
          });
        } else {
          console.log("Hubo un error al insertar el registro");
        }
      } catch (error) {
        console.log("Error al insertar el registro:", error);
      }

    }
  }
};
</script>

<style scoped>
/*.icon-button {
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
  background-color: #f8f8f8d5;
}*/
</style>