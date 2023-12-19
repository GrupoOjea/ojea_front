<template>
  <div class="background-image">
    <div>
      <NavbarAdmin></NavbarAdmin>
      <Loading v-model:active="isLoading" :can-cancel="true" :is-full-page="fullPage"></Loading>
    </div>

    <div class="card my-list" style="margin: 15px">
      <div class="card-body">
        <h4>Administrar Perfiles</h4>
      </div>
    </div>

    <div class="card my-list" style="margin: 15px">
      <ul class="list-group list-group-flush">
        <li class="list-group-item my-list" v-for="profile in profiles" :key="profile.id">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <!-- Muestra el nombre de la empresa si está presente; de lo contrario, muestra nombre y apellido -->
              <b>{{ profile.nombre_empresa || `${profile.nombre} ${profile.apellido}` }}</b> | {{ profile.email }}
              <p>
                {{ profile.estatus_registro === '1' ? 'Activa' : 'Bloqueada' }} |
                <!-- Muestra el tipo de perfil según el número -->
                <span class="perfil-tipo">{{ getPerfilTipo(profile.tipo_perfil) }}</span>
              </p>
            </div>
            <button class="btn btn-link icon-button ml-2" @click="showEditModal(profile)">
              <i class="fa-regular fa-pen-to-square"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>


  </div>
</template>


<script>
import Swal from 'sweetalert2';
import NavbarAdmin from '../Navbar/NavbarAdmin.vue';
import { callApiAxios } from '../../services/axios.ts';
import Loading from 'vue-loading-overlay';

export default {
  data() {
    return {
      profiles: [],
      selectedJob: null,
      isLoading: true,
      showTooltips: false
    };
  },
  components: {
    Loading,
    NavbarAdmin
  },
  async mounted() {
    if (localStorage.getItem('isAuthenticated') !== 'true' || localStorage.getItem('tipo_perfil') !== '3') {
      this.$router.push({ name: 'Login' });
      return;
    }
    await this.fetchData(1);
  },
  methods: {
    redirectTo(page, id) {
      window.location.href = page + '/' + id;
    },

    async showEditModal(profile) {
  const { value: formValues } = await Swal.fire({
    width: '800px',
    title: 'Editar Perfil',
    html:
      '<div class="swal2-row">' +
      '<input type="checkbox" id="swal-input-change-pass" class="swal2-checkbox">' +
      '<label for="swal-input-change-pass" class="swal2-checkbox-label"> Cambiar contraseña</label>' +
      '</div>' +
      '<div class="swal2-row" id="swal-password-row" style="display: none;">' +
      '<input id="swal-input10" type="password" class="swal2-input" placeholder="Nueva contraseña">' +
      '</div>' +
      '<div class="swal2-row">' +
      '<label for="swal-input11" class="swal2-input-label">Tipo de Perfil:</label>' +
      '<select id="swal-input11" class="swal2-input">' +
      '<option value="1" ' + (profile.tipo_perfil === 1 ? 'selected' : '') + '>Persona</option>' +
      '<option value="2" ' + (profile.tipo_perfil === 2 ? 'selected' : '') + '>Empresa</option>' +
      '<option value="3" ' + (profile.tipo_perfil === 3 ? 'selected' : '') + '>Administrador</option>' +
      '</select>' +
      '</div>' +
      '<div class="swal2-row">' +
      '<label for="swal-input12" class="swal2-input-label">Estado de Registro:</label>' +
      '<select id="swal-input12" class="swal2-input">' +
      '<option value="1" ' + (profile.estatus_registro === 'activo' ? 'selected' : '') + '>Activo</option>' +
      '<option value="4" ' + (profile.estatus_registro !== 'activo' ? 'selected' : '') + '>Bloqueado</option>' +
      '</select>' +
      '</div>',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Actualizar',
    cancelButtonText: 'Cancelar',
    didOpen: () => {
      document.getElementById('swal-input-change-pass').onchange = () => {
        const passwordRow = document.getElementById('swal-password-row');
        passwordRow.style.display = document.getElementById('swal-input-change-pass').checked ? 'block' : 'none';
      };
    },
    preConfirm: () => {
      const changePassword = document.getElementById('swal-input-change-pass').checked;
      const newPassword = document.getElementById('swal-input10').value;
      const tipoPerfil = document.getElementById('swal-input11').value;
      const estatusRegistro = document.getElementById('swal-input12').value;

      if (changePassword && !newPassword) {
        Swal.showValidationMessage("Por favor, ingresa la nueva contraseña.");
        return false;
      }
      return { changePassword, newPassword, tipoPerfil, estatusRegistro };
    }
  });

  if (formValues) {
    // Si el cambio de contraseña fue confirmado y se proporcionó una nueva contraseña
    if (formValues.changePassword && formValues.newPassword) {
      const confirmation = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Estás a punto de cambiar la contraseña.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cambiarla!',
        cancelButtonText: 'No, cancelar'
      });

      if (!confirmation.isConfirmed) {
        return; // Si el usuario cancela, detiene la ejecución adicional
      }
      // Proceder a cambiar la contraseña
      profile.contraseña = formValues.newPassword;
    }

    if (!profile.id || typeof profile.id !== 'number') {
      Swal.fire('Error', 'El ID del perfil no es válido o está ausente.', 'error');
      return;
    }
    // Actualizar el resto de los valores}
    profile.tipo_perfil = parseInt(formValues.tipoPerfil);
    profile.estatus_registro = formValues.estatusRegistro;
    

    // Llamada a la API para actualizar el perfil
    try {
      const responseAxios = await callApiAxios("put", this.$baseURL + `/admin/update`, profile);
      if (responseAxios.status === 200) {
        Swal.fire('Actualizado', 'El perfil ha sido actualizado.', 'success');
      } else {
        Swal.fire('Error', 'Hubo un problema al actualizar el perfil.', 'error');
      }
    } catch (error) {
      console.error('Error en la llamada a la API:', error);
      Swal.fire('Error', 'Hubo un problema con la petición al servidor.', 'error');
    }
  }
}
,


    async fetchData() {
      try {
        let responseAxios = await callApiAxios("get", this.$baseURL + `/admin`, {});
        if (responseAxios.status === 200) {
          this.profiles = responseAxios.data; // Asigna los datos a la variable jobs
        } else {
          console.log("Algo salió mal");
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false; // Establece isLoading como falso para indicar que se han cargado los datos
      }
    },
    getPerfilTipo(tipo) {
    switch (tipo) {
      case 1:
        return 'Persona';
      case 2:
        return 'Empresa';
      case 3:
        return 'Administrador';
      default:
        return 'Desconocido';
    }
  }


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
