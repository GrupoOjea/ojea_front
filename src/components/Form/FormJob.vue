<template>
  <div class="background-image">
  <div> <NavbarCompany> </NavbarCompany></div>
  <div class="card my-list" style="margin: 15px">
    <div class="card-body">
      <h4>Publicar empleo</h4>
    </div>
  </div>
  <div class="card my-list" style="margin: 15px">
    <div class="card-body">
      <form>
        <div class="form-row">

          <div class="mb-3">
            <label for="inputCargo" class="form-label">Cargo</label>
            <input type="text" class="form-control" id="inputCargo" v-model = "cargoTxt">
          </div>

          <div class="mb-3">
            <label for="inputContrato" class="form-label">Tipo de contrato</label>
            <select id="inputContrato" class="form-control" v-model="contratoSelect">
              <option value="1">A plazo</option>
              <option value="2">Indefinido</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="inputJornada" class="form-label">Jornada</label>
            <select id="inputJornada" class="form-control" v-model="jornadaSelect">
              <option value="1">Jornada completa</option>
              <option value="2">Part time</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="inputExperiencia" class="form-label">Años de experiencia</label>
            <select v-model="experienciaSelect" id="inputExperiencia" class="form-control">
              <option disabled value="">Selecciona una opción...</option>
              <option v-for="i in 51" :key="i" :value="i - 1">{{ i - 1 }}</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="inputModalidad" class="form-label">Modalidad</label>
            <select id="inputModalidad" class="form-control" v-model="modalidadSelect">
              <option value="1">Hibrido</option>
              <option value="2">Presencial</option>
              <option value="3">Teletrabajo</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Aptitudes</label>
            <input type="text" class="form-control" id="inputAptitudes" v-model = "aptitudesTxt">
          </div>

          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Descripción</label>
            <input type="text" class="form-control" id="inputDescripcion" v-model = "descripcionTxt">
          </div>

        </div>
        <br>
        <button type="submit" class="btn btn-primary"  @click="createJob(cargoTxt, contratoSelect, jornadaSelect, experienciaSelect, modalidadSelect, aptitudesTxt, descripcionTxt)">Finalizar</button>
      </form>
    </div>
  </div>
</div>
</template>

<script>
  
  import NavbarCompany from './../Navbar/NavbarCompany.vue'
  import {callApiAxios} from '../../services/axios.ts';

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
      
    },
    methods: {
      
      async createJob(cargoTxt, contratoSelect, jornadaSelect, experienciaSelect, modalidadSelect, aptitudesTxt, descripcionTxt){
        
        try {
          const id_company = parseInt(localStorage.getItem('id_company'));
          const responseAxios = await callApiAxios('post','http://localhost:3000/jobs/create',{
            'cargo': cargoTxt,
            'contrato': contratoSelect,
            'jornada': jornadaSelect,
            'experiencia': experienciaSelect,
            'modalidad': modalidadSelect,
            'aptitudes': aptitudesTxt,
            'descripcion': descripcionTxt,
            'fk_empresa': id_company
          });
          
          if (responseAxios.status == 201) {
            window.alert("Registro insertado exitosamente");
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
  background-color: #f8f8f8d5;
}
</style>