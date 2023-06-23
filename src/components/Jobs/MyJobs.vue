<template>
    <div class="background-image">
        <div v-if="navPerfil">
            <NavbarUser> </NavbarUser>
        </div>

        <div class="card card-margin">
            <div class="card-body">
                <div class="profile-header">
                    <button @click="goBack" class="back-button"><i class="fa-solid fa-arrow-left"></i></button>
                    <h4>Mis Empleos</h4>
                </div>
            </div>
        </div>

        <div class="row row-margin">

            <div class="col-sm-6">
                <div class="card h-100">
                    <div class="card-body">
                        <h4 class="centered-title">Guardado</h4>
                        <br>
                        <div class="job-container" v-for="(job, index) in savedJobs" :key="index">
                            <div class="job-item">
                                <h5>{{ job.cargo }}</h5>
                                <p>{{ job.nombre }}</p>
                                <p>{{ job.comuna }} ({{ job.modalidad }})</p>
                            </div>

                            <div class="dropdown dropdown-button">
                                <button class="btn btn-link dropdown-toggle my-dropdown-toggle" type="button" id="dropdownMenuButton"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fas fa-list"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                    <li><button class="dropdown-item" @click="solicitar(job)">Solicitar</button></li>
                                    <li><button class="dropdown-item" @click="dejarDeGuardar(job)">Dejar de Guardar</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Para trabajos solicitados -->
            <div class="col-sm-6">
                <div class="card h-100">
                    <div class="card-body">
                        <h4 class="centered-title">Solicitado</h4>
                        <br>
                        <div class="job-item" v-for="(job, index) in requestedJobs" :key="index">
                            <h5>{{ job.cargo }}</h5>
                            <p>{{ job.nombre }}</p>
                            <p>{{ job.comuna }} ({{ job.modalidad }})</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { callApiAxios } from '../../services/axios.ts';
import NavbarUser from './../Navbar/NavbarUser.vue';
import Swal from 'sweetalert2';

export default {
    components: {
        NavbarUser
    },
    data() {
        return {
            navPerfil: true,
            savedJobs: [],
            requestedJobs: [],
            id_profile: {},
        };
    },
    async mounted() {
        if (localStorage.getItem('isAuthenticated') !== 'true' || localStorage.getItem('tipo_perfil') !== '1') {
            this.$router.push({ name: 'Login' });
            return;
        }
        const id = localStorage.getItem('id');
        try {
            const responseProfile = await callApiAxios('get', this.$baseURL + `/profile/${id}`, {});
            console.log("Datos persona", responseProfile.data.id)
            this.id_profile = responseProfile.data.id;

            const response = await callApiAxios('get', this.$baseURL + `/postulation/my-jobs/${this.id_profile}`, {});
            const jobs = response.data;
            console.log(jobs);

            this.savedJobs = jobs.filter(job => job.tipo_empleo === 2);
            this.requestedJobs = jobs.filter(job => job.tipo_empleo === 1);

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    },
    methods: {
        async solicitar(job) {
            let data = {
                tipo_empleo: 1,
                id: job.id,
                fk_empleo: job.fk_empleo
            };
            let responseAxios = await callApiAxios("put", this.$baseURL + `/postulation/update`, data);
            if (responseAxios.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Hecho!',
                    text: 'Solicitud realizada con éxito',
                }).then(() => {
                    window.location.reload();
                });
            }
        },
        async dejarDeGuardar(job) {
            let data = {
                tipo_empleo: 0,
                id: job.id,
                fk_empleo: job.fk_empleo
            };
            let responseAxios = await callApiAxios("put", this.$baseURL + `/postulation/update`, data);
            if (responseAxios.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Hecho!',
                    text: 'Has dejado de guardar el trabajo con éxito',
                }).then(() => {
                    window.location.reload();
                });
            }
        },
        goBack() {
            this.$router.push('/search-user');
        }
    }
}
</script>
<style scoped>
.job-container {
    position: relative;
}
.job-item {
    margin-bottom: 1em; 
}
.job-item p {
    margin: 0; 
    padding: 0;
    line-height: 1.5;
}
.dropdown-button {
    position: absolute;
    right: 0;
    top: 0;
}
.my-dropdown-toggle::after {
    border-top-color: #ffb347 !important;
}
.dropdown-button .fas {
  color: #FFCC99;
}

.back-button {
    background-color: transparent;
    color: #000000;
    border: none;
    font-size: 24px;
    cursor: pointer;
    background-color: transparent;
    margin-right: 10px;
}

.profile-header {
    display: flex;
    align-items: center;
}

.card-margin {
    margin: 26px;
}

.row-margin {
    margin: 15px;
}
.centered-title {
    text-align: center;
}

</style>