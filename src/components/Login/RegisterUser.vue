<template>
  <div class="container">
    <div class="row justify-content-center align-items-center vh-100">
      <div class="col-md-6">
        <div class="card card-form">
          <div class="card-body">
            <div class="back-button-container">
              <button @click="goBack" class="back-button"><i class="fa-solid fa-arrow-left"></i></button>
            </div>
            <h2 class="form-title">Completa tus datos personales</h2>
            <form style="margin: 15px" @submit.prevent="submitForm">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="nameInput" class="form-label">Nombre</label>
                  <input type="text" class="form-control" id="nameInput" v-model="nameCamelCase" />
                </div>

                <div class="col-md-6 mb-3">
                  <label for="surnameInput" class="form-label">Apellido</label>
                  <input type="text" class="form-control" id="surnameInput" v-model="surnameCamelCase" />
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
                  <label for="professionInput" class="form-label">Profesión</label>
                  <select class="form-control" id="professionInput" v-model="profession">
                    <option disabled value="">Selecciona una Profesión</option>
                    <option v-for="carrera in carreras" :key="carrera.nombre" :value="carrera.nombre">
                      {{ carrera.nombre }}
                    </option>
                  </select>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="dobInput" class="form-label">Fecha de Nacimiento</label>
                  <input type="date" class="form-control" id="dobInput" v-model="birthDate" @change="calculateAge"
                    :max="minBirthDate" />
                </div>

                <div class="col-md-6 mb-3">
                  <label for="ageInput" class="form-label">Edad</label>
                  <input type="number" class="form-control" id="ageInput" v-model="age" min="0" disabled />
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
              </div>

              <div class="d-flex justify-content-center mt-4">
                <button type="submit" class="btn btn-primary btn-enviar">Enviar</button>
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

export default {
  data() {
    return {
      name: '',
      surname: '',
      phone: '',
      age: '',
      profession: '',
      regiones: regionesData.regiones,
      region: '',
      comunas: [],
      comuna: '',
      birthDate: '',
      carreras: carrerasData.carreras,
    }
  },
   mounted() {
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.getItem('tipo_perfil')
  },
  methods: {
    updateComunas() {
      const regionData = this.regiones.find(regionData => regionData.region === this.region);
      this.comunas = regionData ? regionData.comunas : [];
    },
    async submitForm() {
      if (
        !this.name ||
        !this.surname ||
        !this.phone ||
        !this.profession ||
        !this.birthDate ||
        !this.region ||
        !this.comuna
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, completa todos los campos.',
        });
        return;
      }

      const id = localStorage.getItem('id');
      try {
        let responseAxios = await callApiAxios('post', 'http://localhost:3000/profile/create', {
          'nombre': this.name,
          'apellido': this.surname,
          'edad': this.age,
          'profesion': this.profession,
          'telefono': '+56' + this.phone,
          'region': this.region,
          'comuna': this.comuna,
          'fk_login': parseInt(id),
        });

        if (responseAxios.status == 201) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('tipo_perfil', 1)
          localStorage.setItem('nombre', this.name + ' ' + this.surname);
          Swal.fire({
            icon: 'success',
            title: '¡Buen trabajo!',
            text: 'Datos creados correctamente.',
          }).then((result) => {
            if (result.value) {
              localStorage.setItem('isAuthenticated', 'true');
              this.$router.push('/search-user');
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
    calculateAge() {
      let today = {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      };

      let birthDate = {
        day: new Date(this.birthDate).getDate(),
        month: new Date(this.birthDate).getMonth() + 1,
        year: new Date(this.birthDate).getFullYear()
      };

      if (today.month < birthDate.month || (today.month == birthDate.month && today.day < birthDate.day)) {
        this.age = today.year - birthDate.year - 1;
      } else {
        this.age = today.year - birthDate.year;
      }
    },
    toCamelCase(str) {
      return str.toLowerCase().replace(/(^| )(\w)/g, function (x) {
        return x.toUpperCase();
      });
    },
    goBack() {
      this.$router.push('/');
    }
  },
  computed: {
    minBirthDate() {
      let date = new Date();
      date.setFullYear(date.getFullYear() - 18);
      return date.toISOString().split("T")[0];
    },
    nameCamelCase: {
      get() {
        return this.name;
      },
      set(value) {
        this.name = this.toCamelCase(value);
      }
    },
    surnameCamelCase: {
      get() {
        return this.surname;
      },
      set(value) {
        this.surname = this.toCamelCase(value);
      }
    }
  }
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
