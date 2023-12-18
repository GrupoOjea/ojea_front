<template>
  <div class="container">
    <div class="row justify-content-center align-items-center vh-100">
      <div class="col-md-12">
        <div class="card card-form">
          <div class="card-body">
            <div class="back-button-container">
              <button @click="goBack" class="back-button"><i class="fa-solid fa-arrow-left"></i></button>
            </div>
            <h2 class="form-title">Datos de la Empresa</h2>
            <form style="margin: 15px" @submit.prevent="submitForm">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="nameInput" class="form-label">Nombre de la empresa</label>
                  <input type="text" class="form-control" id="nameInput" v-model="nameCamelCase" />
                </div>

                <div class="col-md-6 mb-3">
                  <label for="runInput" class="form-label">Run</label>
                  <input type="text" class="form-control" id="runInput" v-model="run" @input="validateRun" />
                </div>


                <div class="col-md-6 mb-3">
                  <label for="phoneInput" class="form-label">Teléfono</label>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="phonePrefix">+56</span>
                    </div>
                    <input type="tel" class="form-control" id="phoneInput" v-model="phone" aria-describedby="phonePrefix"
                      @input="validatePhoneInput" />
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="regionInput" class="form-label">Región</label>
                  <select class="form-control" id="regionInput" v-model="region" @change="updateComunas">
                    <option disabled value="">Selecciona una región</option>
                    <option v-for="regionData in regiones" :key="regionData.region" :value="regionData.region">
                      {{ regionData.region }}</option>
                  </select>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="comunaInput" class="form-label">Comuna</label>
                  <select class="form-control" id="comunaInput" v-model="comuna">
                    <option disabled value="">Selecciona una comuna</option>
                    <option v-for="comuna in comunas" :key="comuna" :value="comuna">{{ comuna }}</option>
                  </select>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="rubroInput" class="form-label">Rubro</label>
                  <input type="text" class="form-control" id="rubroInput" v-model="rubro" />
                </div>

                <div class="col-md-6 mb-3">
                  <label for="paginaWebInput" class="form-label">Página web</label>
                  <input type="text" class="form-control" id="paginaWebInput" v-model="paginaWeb" />
                </div>

                <div class="col-md-6 mb-3">
                  <label for="descripcionInput" class="form-label">Descripción</label>
                  <input type="text" class="form-control" id="descripcionInput" v-model="descripcion" />
                </div>

                <div class="col-md-6 mb-3">
                  <label for="tipoPlanInput" class="form-label">Tipo de plan</label>
                  <select class="form-control" id="tipoPlanInput" v-model="tipoPlan">
                    <option disabled value="">Selecciona un tipo de plan</option>
                    <option value="1">Silver</option>
                    <option value="2">Gold</option>
                    <option value="3">Platinum</option>
                    <option value="4">Diamond</option>
                  </select>
                </div>

              </div>

              <div class="d-flex justify-content-center mt-4">
                <button type="submit" class="btn btn-primary btn-enviar">Crear</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import regionesData from "@/utils/region_comuna.json"
import carrerasData from "@/utils/carreras.json";
import { callApiAxios } from '../../services/axios.ts';
import Swal from 'sweetalert2';
import NavbarAdmin from "../Navbar/NavbarAdmin.vue";

export default {
  data() {
    return {
      name: '',
      run: '',
      phone: '',
      regiones: regionesData.regiones,
      region: '',
      comunas: [],
      comuna: '',
      rubro: '',
      paginaWeb: '',
      descripcion: '',
      tipoPlan: '',
    };
  },
  mounted() {
    if (localStorage.getItem('isAuthenticated') !== 'true' || localStorage.getItem('tipo_perfil') !== '2') {
      this.$router.push({ name: 'Login' });
      return;
    }
    Swal.fire({
      title: 'Bienvenido',
      text: 'Como es tu primer ingreso, por favor completa los siguientes campos para poder continuar',
      icon: 'info',
      confirmButtonText: 'Entendido'
    });
  },
  methods: {
    updateComunas() {
      const regionData = this.regiones.find(regionData => regionData.region === this.region);
      this.comunas = regionData ? regionData.comunas : [];
    },
    async submitForm() {
      if (!this.name || !this.run || !this.phone || !this.region ||
        !this.comuna || !this.rubro || !this.descripcion || !this.paginaWeb ||
        !this.tipoPlan) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, completa todos los campos.',
        });
        return;
      }

      const id = localStorage.getItem('id');
      try {
        let responseAxios = await callApiAxios('post', this.$baseURL + '/company/create', {
          'nombre': this.name,
          'run': this.run,
          'telefono': this.phone,
          'region': this.region,
          'comuna': this.comuna,
          'rubro': this.rubro,
          'descripcion': this.descripcion,
          'pagina_web': this.paginaWeb,
          'tipo_plan': parseInt(this.tipoPlan),
          'fk_login': parseInt(id),
        });

        if (responseAxios.status == 201) {
          Swal.fire({
            icon: 'success',
            title: '¡Buen trabajo!',
            text: 'Datos creados correctamente.',
          }).then((result) => {
            if (result.value) {
              this.$router.push('/search');
            }
          });
        }
      } catch (error) {
        console.log('Error en la llamada a la API:', error);
      }
    },
    validatePhoneInput() {
      if (this.phone.length > 9) {
        this.phone = this.phone.slice(0, 9);
      }
      if (/[^0-9]/.test(this.phone)) {
        this.phone = this.phone.replace(/[^0-9]/g, "");
      }
    },
    toCamelCase(str) {
      return str.toLowerCase().replace(/(^| )(\w)/g, function (x) {
        return x.toUpperCase();
      });
    },
    goBack() {
      this.$router.push('/manage-profile');
      localStorage.setItem('isAuthenticated', 'false');
    },
    validateRun(event) {
      let value = event.target.value.replace(/[^0-9kK]+/g, '');
      value = value.replace(/[\.\-]/g, '');

      if (value.length > 9) {
        value = value.slice(0, 8) + value.slice(-1);
      }

      value = value
        .replace(/(\d{1,2})(\d{0,3})(\d{0,3})([kK0-9]?)$/, (_, p1, p2, p3, p4) => {
          return p1 + (p2 ? '.' + p2 : '') + (p3 ? '.' + p3 : '') + (p4 ? '-' + p4 : '');
        });

      event.target.value = value;
      this.run = value;
    }
  },
  computed: {
    nameCamelCase: {
      get() {
        return this.name;
      },
      set(value) {
        this.name = this.toCamelCase(value);
      }
    }
  },
  components: { NavbarAdmin }
}
</script>

<style scoped>
.card-form {
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
}

.btn-enviar {
  background-color: #6d63ff;
}

.btn-enviar:hover {
  background-color: #6d63ffa9;
}

.back-button-container {
  position: absolute;
  top: 20px;
  left: 20px;
}

.back-button {
  background-color: transparent;
  color: #000000;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
</style>
