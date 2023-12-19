<template>
    <div class="background-image">
        <div v-if="navPerfil">
            <NavbarUser> </NavbarUser>
            <Loading v-model:active="isLoading" :can-cancel="true" :is-full-page="fullPage"></Loading>
        </div>

        <div class="card card-margin">
            <div class="card-body">
                <div class="profile-header">
                    <button @click="goBack" class="back-button"><i class="fa-solid fa-arrow-left"></i></button>
                    <h4>Mi perfil</h4>
                </div>
            </div>
        </div>

        <div class="row row-margin">

            <div class="col-sm-6">
                <div class="card h-100">
                    <i class="fa-solid fa-pen-to-square icon-pen" @click="editPersonalData"></i>
                    <div class="card-body card-body-custom">
                        <h4>{{ userProfile.nombre }} {{ userProfile.apellido }}</h4>
                        <h5>{{ userProfile.profesion }}</h5>

                        <br><br>
                        <p class="info-line"><span class="info-label">Edad:</span> <span class="info-data">{{
                            userProfile.edad
                        }}</span></p>
                        <p class="info-line"><span class="info-label">Teléfono:</span> <span class="info-data">{{
                            userProfile.telefono }}</span></p>
                        <p class="info-line"><span class="info-label">Región:</span> <span class="info-data">{{
                            userProfile.region }}</span></p>

                        <p class="info-line"><span class="info-label">Comuna:</span> <span class="info-data">{{
                            userProfile.comuna }}</span></p>
                    </div>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="row">

                    <div class="col-sm-12 mb-3">
                        <div class="card h-100">
                            <div class="card-body">
                                <h4>Educación</h4>
                                <br>
                                <div class="education-item" v-for="(edu, index) in education" :key="index">
                                    <i class="fa-solid fa-pen-to-square icon-pen-edit" @click="editEducation(edu.id)"></i>
                                    <p style="font-weight: bold" v-if="edu.institucion">{{ edu.institucion }}</p>
                                    <p v-if="edu.titulo">{{ edu.titulo }}</p>
                                    <p v-if="edu.mes_inicio && edu.ano_inicio && edu.mes_fin && edu.ano_fin">
                                        {{ `${edu.mes_inicio} ${edu.ano_inicio} - ${edu.mes_fin} ${edu.ano_fin}` }}
                                    </p>
                                </div>
                                <i class="fa-solid fa-plus icon-plus" @click="addEducation"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12">
                        <div class="card h-100">
                            <i class="fa-solid fa-plus icon-plus" @click="addSkills"></i>
                            <div class="card-body">
                                <h4>Habilidades</h4>
                                <br>
                                <div v-if="groupedSkills" v-for="(habilidades, habilidadPrincipal) in groupedSkills"
                                    :key="habilidadPrincipal" class="habilidad-container">
                                    <h5>{{ habilidadPrincipal }}</h5>
                                    <div class="sub-habilidades">
                                        <div v-for="(habilidad, index) in habilidades" :key="index"
                                            class="sub-habilidad-container">
                                            <p class="sub-habilidad">
                                                {{ habilidad.sub_habilidad }}
                                            </p>
                                            <i class="fa-solid fa-xmark icon-delete"
                                                @click="deleteSubSkill(habilidad.id_skill)"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
import regionesData from "@/utils/region_comuna.json";
import carrerasData from "@/utils/carreras.json";
import institucionData from "@/utils/institucion.json";
import Loading from 'vue-loading-overlay';

export default {
    components: {
        Loading,
        NavbarUser
    },
    data() {
        return {
            navPerfil: true,
            userProfile: {},
            skills: {},
            subSkills: {},
            education: {},
            institucionData: institucionData,
        };
    },
    async mounted() {
        if (localStorage.getItem('isAuthenticated') !== 'true' || localStorage.getItem('tipo_perfil') !== '1') {
            this.$router.push({ name: 'Login' });
            return;
        }
        const id = localStorage.getItem('id');
        try {
            const response = await callApiAxios('get', this.$baseURL + `/profile/${id}`, {});
            this.userProfile = response.data;
            console.log(this.userProfile)
            this.groupedSkills = this.userProfile.habilidades.reduce((acc, habilidad) => {
                if (habilidad.habilidad_principal) {
                    if (!acc[habilidad.habilidad_principal]) {
                        acc[habilidad.habilidad_principal] = [];
                    }
                    acc[habilidad.habilidad_principal].push(habilidad);
                }
                return acc;
            }, {});

            const responseSkills = await callApiAxios('get', this.$baseURL + `/skills/mainskills`, {});
            this.skills = responseSkills.data;
            console.log(this.skills)

            const responseEducation = await callApiAxios('get', this.$baseURL + `/education/get/${id}`, {});
            this.education = responseEducation.data;
            console.log(this.education)

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
        editPersonalData() {
            let carrerasOptions = carrerasData.carreras.map(carrera => `<option value="${carrera.nombre}" ${this.userProfile.profesion === carrera.nombre ? 'selected' : ''}>${carrera.nombre}</option>`).join("");
            let regionesOptions = regionesData.regiones.map(region => `<option value="${region.region}" ${this.userProfile.region === region.region ? 'selected' : ''}>${region.region}</option>`).join("");

            let regionSelected = regionesData.regiones.find(region => region.region === this.userProfile.region);

            let comunasOptions = '';
            if (regionSelected) {
                if (regionSelected.comunas.includes(this.userProfile.comuna)) {
                    comunasOptions = regionSelected.comunas.map(comuna => `<option value="${comuna}" ${this.userProfile.comuna === comuna ? 'selected' : ''}>${comuna}</option>`).join("");
                } else {
                    console.error('La comuna del perfil de usuario no coincide con las comunas de la región seleccionada');
                }
            }

            Swal.fire({
                width: '800px',
                title: 'Editar Datos Personales',
                html: `
                    <div class="swal2-content">
                        <div class="swal2-row">
                            <label class="swal2-label">Nombre:</label>
                            <input type="text" id="name" class="swal2-input swal-input-select" placeholder="Nombre" value="${this.userProfile.nombre}">
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Apellido:</label>
                            <input type="text" id="surname" class="swal2-input swal-input-select" placeholder="Apellido" value="${this.userProfile.apellido}">
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Profesión:</label>
                            <select id="profession" class="swal2-input swal-input-select">${carrerasOptions}</select>
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Edad:</label>
                            <input type="text" id="age" class="swal2-input swal-input-select" placeholder="Edad" value="${this.userProfile.edad}" readonly>
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Teléfono:</label>
                            <div style="display: flex;">
                                <input type="text" id="phonePrefix" class="swal2-input swal-input-select" value="+56" readonly style="width: 18%; margin-right: 5px;">
                                <input type="tel" id="phone" class="swal2-input swal-input-select" placeholder="Teléfono" value="${this.userProfile.telefono.slice(3)}" pattern="[0-9]{9}" maxlength="9" style="width: 85%;">
                            </div>
                        </div>
                                                            
                        <div class="swal2-row">
                            <label class="swal2-label">Región:</label>
                            <select id="region" class="swal2-input swal-input-select">${regionesOptions}</select>
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Comuna:</label>
                            <select id="comuna" class="swal2-input swal-input-select">${comunasOptions}</select>
                        </div>
                    </div>`,
                didOpen: (el) => {
                    let regionSelect = el.querySelector('#region');
                    let comunaSelect = el.querySelector('#comuna');

                    regionSelect.addEventListener('change', (e) => {
                        let selectedRegion = regionesData.regiones.find(region => region.region === e.target.value);

                        if (selectedRegion) {
                            let newComunasOptions = selectedRegion.comunas.map(comuna => `<option value="${comuna}">${comuna}</option>`).join("");
                            comunaSelect.innerHTML = newComunasOptions;
                        } else {
                            comunaSelect.innerHTML = '';
                        }
                    });
                },
                focusConfirm: false,
                preConfirm: () => {
                    let data = {
                        id: this.userProfile.id,
                        nombre: document.getElementById('name').value,
                        apellido: document.getElementById('surname').value,
                        profesion: document.getElementById('profession').value,
                        edad: parseInt(document.getElementById('age').value),
                        telefono: document.getElementById('phonePrefix').value + document.getElementById('phone').value,
                        region: document.getElementById('region').value,
                        comuna: document.getElementById('comuna').value,
                    }
                    console.log(data);
                    return data;
                }
            }).then(async result => {
                if (result.isConfirmed) {
                    let responseAxios = await callApiAxios('put', this.$baseURL + `/profile/update`, result.value);
                    console.log("status", responseAxios.status)
                    if (responseAxios.status == 200) {
                        Swal.fire('Actualizado', 'Los datos personales han sido actualizado.', 'success').then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire('Error', 'Hubo un problema al actualizar los datos personales.', 'error');
                    }
                }
            });
        },

        addEducation() {
            let institucionOptions = `<option disabled selected value="">Seleccione Universidad</option>` + this.institucionData.map(institucion => `<option value="${institucion.institucion}">${institucion.institucion}</option>`).join('');
            let date = new Date();
            let currentYear = date.getFullYear();
            let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            let monthOptions = `<option disabled selected value="">Seleccione Mes</option>` + Array.from({ length: 12 }, (_, i) => `<option value="${months[i]}">${months[i]}</option>`).join('');
            // Calcula el año en que el usuario cumplió 18
    const edadUsuario = this.userProfile.edad; // Suponiendo que este es el campo donde tienes la edad del usuario
    const anio18 = currentYear - edadUsuario + 18;

    let yearOptionsInicio = `<option disabled selected value="">Seleccione Año</option>` + 
        Array.from({ length: currentYear - anio18 + 1 }, (_, i) => `<option value="${anio18 + i}">${anio18 + i}</option>`).join('');
            //let yearOptionsInicio = `<option disabled selected value="">Seleccione Año</option>` + Array.from({ length: currentYear - 1950 + 1 }, (_, i) => `<option value="${1950 + i}">${1950 + i}</option>`).join('');
            let yearOptionsFin = `<option disabled selected value="">Seleccione Año</option>`;

            Swal.fire({
                width: '800px',
                title: 'Agregar Educación',
                html: `
                    <div class="swal2-content">
                        <div class="swal2-row">
                            <label class="swal2-label">Institución:</label>
                            <select id="newInstitucion" class="swal2-input">${institucionOptions}</select>
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Carrera:</label>
                            <select id="newCarrera" class="swal2-input">
                                <option value="">Seleccione Carrera</option>
                            </select>
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Mes de Inicio:</label>
                            <select id="newMesInicio" class="swal2-input">${monthOptions}</select>
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Año de Inicio:</label>
                            <select id="newAnoInicio" class="swal2-input">${yearOptionsInicio}</select>
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Mes de Fin:</label>
                            <select id="newMesFin" class="swal2-input">${monthOptions}</select>
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Año de Fin:</label>
                            <select id="newAnoFin" class="swal2-input">${yearOptionsFin}</select>
                        </div>
                    </div>`,
                focusConfirm: false,
                didOpen: () => {
                    document.getElementById('newInstitucion').addEventListener('change', (event) => {
                        let selectedInstitucion = this.institucionData.find(institucion => institucion.institucion === event.target.value);

                        let carreraOptions;
                        if (selectedInstitucion) {
                            carreraOptions = `<option disabled selected value="">Seleccione Carrera</option>` + selectedInstitucion.carreras.map(carrera => `<option value="${carrera}">${carrera}</option>`).join('');
                        } else {
                            carreraOptions = `<option disabled selected value="">Seleccione Carrera</option>`;
                        }

                        document.getElementById('newCarrera').innerHTML = carreraOptions;
                    });

                    document.getElementById('newAnoInicio').addEventListener('change', (event) => {
                        const selectedYear = parseInt(event.target.value);
                        const currentYear = new Date().getFullYear();
                        let yearOptionsFin = `<option disabled selected value="">Seleccione Año</option>`;

                        if (!isNaN(selectedYear)) {
                            yearOptionsFin = `<option disabled selected value="">Seleccione Año</option>` + Array.from({ length: 2050 - selectedYear + 1 }, (_, i) => `<option value="${selectedYear + i}">${selectedYear + i}</option>`).join('');
                        }

                        document.getElementById('newAnoFin').innerHTML = yearOptionsFin;
                    });
                },
                preConfirm: () => {
                    return {
                        institucion: document.getElementById('newInstitucion').value,
                        titulo: document.getElementById('newCarrera').value,
                        mes_inicio: document.getElementById('newMesInicio').value,
                        ano_inicio: parseInt(document.getElementById('newAnoInicio').value),
                        mes_fin: document.getElementById('newMesFin').value,
                        ano_fin: parseInt(document.getElementById('newAnoFin').value),
                        'fk_persona': this.userProfile.id
                    };
                }
            }).then(async result => {
                if (result.isConfirmed) {
                    let responseAxios = await callApiAxios('post', this.$baseURL + `/education/create`, result.value);
                    if (responseAxios.status === 201) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Operación exitosa!',
                            text: 'Los datos se han enviado correctamente.'
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Algo salió mal!',
                            text: 'Por favor, valida los datos e intenta nuevamente.'
                        });
                    }
                }
            });
        },

        editEducation(id) {
            console.log("Editing education with id:", id);
            let date = new Date();
            let currentYear = date.getFullYear();
            let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

            callApiAxios('get', this.$baseURL + `/education/get-edit/${id}`, {})
                .then((response) => {

                    let education = response.data[0];

                    console.log(this.institucionData);
                    console.log(education.institucion);

                    let institucionOptions = this.institucionData.map(institucion => {
                        const selected = education.institucion === institucion.institucion ? 'selected' : '';
                        return `<option value="${institucion.institucion}" ${selected}>${institucion.institucion}</option>`;
                    }).join('');

                    let selectedInstitucion = this.institucionData.find(institucion => institucion.institucion === education.institucion);

                    let carreraOptions = '';
                    if (selectedInstitucion && selectedInstitucion.carreras) {
                        carreraOptions = selectedInstitucion.carreras.map(carrera => {
                            const selected = education.titulo === carrera ? 'selected' : '';
                            return `<option value="${carrera}" ${selected}>${carrera}</option>`;
                        }).join('');
                    }

                    let monthOptionsInicio = months.map(month => {
                        const selected = education.mes_inicio === month ? 'selected' : '';
                        return `<option value="${month}" ${selected}>${month}</option>`;
                    }).join('');

                    let monthOptionsFin = months.map(month => {
                        const selected = education.mes_fin === month ? 'selected' : '';
                        return `<option value="${month}" ${selected}>${month}</option>`;
                    }).join('');

                    let yearOptionsInicio = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => {
                        const year = 1950 + i;
                        const selected = education.ano_inicio === year ? 'selected' : '';
                        return `<option value="${year}" ${selected}>${year}</option>`;
                    }).join('');

                    let yearOptionsFin = Array.from({ length: 2050 - education.ano_inicio + 1 }, (_, i) => {
                        const year = education.ano_inicio + i;
                        const selected = education.ano_fin === year ? 'selected' : '';
                        return `<option value="${year}" ${selected}>${year}</option>`;
                    }).join('');

                    Swal.fire({
                        width: '800px',
                        title: 'Editar Educación',
                        html: `
                    <div class="swal2-content">
                        <div class="swal2-row">
                            <label class="swal2-label">Institución:</label>
                            <select id="editInstitucion" class="swal2-input">${institucionOptions}</select>
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Carrera:</label>
                            <select id="editCarrera" class="swal2-input">${carreraOptions}</select>
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Mes de Inicio:</label>
                            <select id="editMesInicio" class="swal2-input">${monthOptionsInicio}</select>
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Año de Inicio:</label>
                            <select id="editAnoInicio" class="swal2-input">${yearOptionsInicio}</select>
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Mes de Fin:</label>
                            <select id="editMesFin" class="swal2-input">${monthOptionsFin}</select>
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Año de Fin:</label>
                            <select id="editAnoFin" class="swal2-input">${yearOptionsFin}</select>
                        </div>
                        <div class="swal2-row">
                            <button class="swal2-confirm swal2-styled swal2-confirm--red" id="deleteButton">Eliminar Educación</button>
                        </div>
                    </div>
                `,
                        confirmButtonText: 'Guardar',
                        showCancelButton: true,
                        didOpen: () => {
                            document.getElementById('editInstitucion').addEventListener('change', (e) => {
                                const selectedInstitucion = e.target.value;
                                let institucionData = this.institucionData.find(institucion => institucion.institucion === selectedInstitucion);

                                let carreraOptions = '';
                                if (institucionData && institucionData.carreras) {
                                    carreraOptions = institucionData.carreras.map(carrera => {
                                        return `<option value="${carrera}">${carrera}</option>`;
                                    }).join('');
                                }

                                document.getElementById('editCarrera').innerHTML = carreraOptions;
                            });

                            document.getElementById('deleteButton').addEventListener('click', () => {
                                Swal.fire({
                                    width: '800px',
                                    title: 'Eliminar Educación',
                                    text: '¿Estás seguro de que deseas eliminar esta educación?',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Sí, eliminar',
                                    cancelButtonText: 'Cancelar',
                                }).then(async (result) => {
                                    if (result.isConfirmed) {
                                        try {
                                            let responseAxios = await callApiAxios('delete', this.$baseURL + `/education/delete/${id}`, {});
                                            console.log("status", responseAxios.status);
                                            if (responseAxios.status == 200) {
                                                Swal.fire('Eliminado', 'Los datos de educación han sido eliminados.', 'success').then(() => {
                                                    window.location.reload();
                                                });
                                            } else {
                                                Swal.fire('Error', 'Hubo un problema al eliminar los datos de educación.', 'error');
                                            }
                                        } catch (error) {
                                            console.error("Error:", error);
                                            Swal.fire('Error', 'Hubo un problema al eliminar los datos de educación.', 'error');
                                        }
                                    }
                                });
                            });
                        },
                        preConfirm: () => {
                            return {
                                institucion: document.getElementById('editInstitucion').value,
                                titulo: document.getElementById('editCarrera').value,
                                mes_inicio: document.getElementById('editMesInicio').value,
                                ano_inicio: parseInt(document.getElementById('editAnoInicio').value),
                                mes_fin: document.getElementById('editMesFin').value,
                                ano_fin: parseInt(document.getElementById('editAnoFin').value),
                                'id': id
                            };
                        }
                    }).then(async (result) => {
                        if (result.value) {
                            console.log(result.value);

                            try {
                                let responseAxios = await callApiAxios('put', this.$baseURL + `/education/update`, result.value);
                                console.log("status", responseAxios.status);
                                if (responseAxios.status == 200) {
                                    Swal.fire('Actualizado', 'Los datos de educación han sido actualizados.', 'success').then(() => {
                                        window.location.reload();
                                    });
                                } else {
                                    Swal.fire('Error', 'Hubo un problema al actualizar los datos de educación.', 'error');
                                }
                            } catch (error) {
                                console.error("Error:", error);
                                Swal.fire('Error', 'Hubo un problema al actualizar los datos de educación.', 'error');
                            }
                        }
                    })
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        },

        addSkills() {
            const habilidadesExistentes = this.userProfile.habilidades.flatMap(h => h.sub_habilidad);
            Swal.fire({
                width: '900px',
                title: 'Agregar Habilidades',
                html: `
                    <div class="swal2-content">
                        <div class="swal2-row">
                            <label class="swal2-label">Habilidad principal:</label>
                            <select id="mainSkill" class="swal2-input">
                                <option value="">Seleccione una habilidad</option>
                                ${this.skills.map(habilidad => `<option value="${habilidad.habilidad_principal}" data-id="${habilidad.id}">${habilidad.habilidad_principal}</option>`)}
                            </select>
                        </div>
                    </div>`,
                focusConfirm: false,
                preConfirm: () => {
                    const mainSkillSelect = document.getElementById('mainSkill');
                    const selectedHabilidad = this.skills.find(habilidad => habilidad.habilidad_principal === mainSkillSelect.value);
                    return {
                        habilidadPrincipal: selectedHabilidad.habilidad_principal,
                        habilidadId: selectedHabilidad.id
                    }
                }
            }).then(async result => {
                if (result.isConfirmed) {
                    const habilidadPrincipal = result.value.habilidadPrincipal;
                    const habilidadId = result.value.habilidadId;

                    const responseSubSkills = await callApiAxios('get', this.$baseURL + `/skills/subskills/${habilidadId}`, {});
                    this.subSkills = responseSubSkills.data;

                    Swal.fire({
                        width: '900px',
                        title: 'Agregar Subhabilidades',
                        html: `
                            <div class="swal2-content">
                                <div class="swal2-row">
                                    <label class="swal2-label">Subhabilidades de ${habilidadPrincipal}:</label>
                                    <div class="swal2-checkbox-container">
                                        ${this.subSkills.map(subhabilidad => `
                                            <input type="checkbox" id="${subhabilidad.sub_habilidad}" name="subSkills" value="${subhabilidad.id}" ${habilidadesExistentes.includes(subhabilidad.sub_habilidad) ? 'checked' : ''}>
                                            <label for="${subhabilidad.sub_habilidad}">${subhabilidad.sub_habilidad}</label>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>`,
                        focusConfirm: false,
                        preConfirm: () => {
                            const selectedSubSkills = Array.from(document.getElementsByName('subSkills'))
                                .filter(checkbox => checkbox.checked && !habilidadesExistentes.includes(checkbox.id))
                                .map(checkbox => checkbox.value);

                            if (selectedSubSkills.length === 0) {
                                return new Promise((resolve, reject) => {
                                    reject();
                                    setTimeout(() => {
                                        Swal.close();
                                        Swal.fire('Info', 'No se realizó ningún cambio.', 'info');
                                    }, 200);
                                });
                            }

                            return {
                                habilidadPrincipal: habilidadPrincipal,
                                subhabilidades: selectedSubSkills
                            }
                        }
                    }).then(async result => {
                        if (result.isConfirmed) {
                            const subhabilidades = result.value.subhabilidades;

                            const createRequests = subhabilidades.map((fk_subhabilidad) => {
                                return callApiAxios('post', this.$baseURL + `/skills/create`, {
                                    'fk_subhabilidad': Number(fk_subhabilidad),
                                    'fk_persona': this.userProfile.id,
                                });
                            });

                            Promise.all(createRequests)
                                .then(responses => {
                                    const allSuccessful = responses.every(response => response.status === 201);
                                    if (allSuccessful) {
                                        Swal.fire('Creado', 'Las habilidades han sido creadas.', 'success').then(() => {
                                            window.location.reload();
                                        });
                                    } else {
                                        Swal.fire('Error', 'Hubo un problema al crear las habilidades.', 'error');
                                    }
                                }).catch(error => {
                                    console.error(error);
                                    Swal.fire('Error', 'Hubo un problema al crear las habilidades.', 'error');
                                });
                        }
                    });
                }
            });
        },


        async deleteSubSkill(id_skill) {
            console.log("ID de la subhabilidad seleccionada para eliminar: ", id_skill);
            try {
                let response = await callApiAxios('delete', this.$baseURL + `/skills/delete/${id_skill}`, {});
                if (response.status == 200) {
                    Swal.fire('Eliminado', 'La subhabilidad ha sido eliminada.', 'success').then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire('Error', 'Hubo un problema al eliminar la subhabilidad.', 'error');
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Hubo un problema al eliminar la subhabilidad.', 'error');
            }
        },

        formatSkills(textoHabilidades) {
            const habilidades = {};
            textoHabilidades.forEach((habilidad) => {
                if (!habilidades[habilidad.habilidad_principal]) {
                    habilidades[habilidad.habilidad_principal] = [];
                }
                habilidades[habilidad.habilidad_principal].push(habilidad.subhabilidad);
            });

            return habilidades;
        },

        filterHabilidades() {
            if (!this.userProfile.habilidades) {
                return [];
            }

            const habilidadesPrincipales = [];
            const filteredHabilidades = [];
            this.userProfile.habilidades.forEach(habilidad => {
                if (!habilidadesPrincipales.includes(habilidad.habilidad_principal)) {
                    habilidadesPrincipales.push(habilidad.habilidad_principal);
                    filteredHabilidades.push(habilidad);
                }
            });

            return filteredHabilidades;
        },
        textTransform(text) {
            return text.charAt(0).toUpperCase() + text.slice(1);
        },
        goBack() {
            this.$router.push('/search-user');
        }
    },
    computed: {
        filteredHabilidades() {
            return this.filterHabilidades();
        }
    }
};
</script>

<style scoped>
.card-margin {
    margin: 26px;
}

.row-margin {
    margin: 15px;
}

.icon-pen {
    position: absolute;
    top: 20px;
    right: 20px;
}

.icon-plus {
    position: absolute;
    top: 20px;
    right: 20px;
}

.card-body-custom {
    text-align: center;
    margin: 55px;
}

.info-line {
    margin-bottom: 10px;
    font-size: 16px;
    line-height: 1.5;
}

.info-label {
    font-weight: bold;
    color: #333;
}

.info-data {
    color: #666;
}

.habilidad-container {
    margin-bottom: 20px;
}

.sub-habilidades {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    /* Espacio entre habilidades */
}

.sub-habilidad {
    background: #ececec;
    /* Color de fondo de la sub-habilidad */
    padding: 5px 10px;
    border-radius: 5px;
    margin-right: 5px;
    margin-bottom: 5px;
}

.sub-habilidad-container {
    position: relative;
    display: flex;
    align-items: center;
    background: #ececec;
    /* Color de fondo de la sub-habilidad */
    padding: 5px 10px;
    border-radius: 5px;
    margin-right: 5px;
    margin-bottom: 5px;
}

.sub-habilidad-container:hover .icon-delete {
    display: block;
}

.icon-delete {
    display: none;
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
}

.education-item {
    position: relative;
}

.icon-pen-edit {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
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
</style>

<style>
.swal2-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.swal2-label {
    text-align: right;
    width: 40%;
}

.swal2-input,
.swal2-input.swal-input-select {
    width: 60%;
}

.swal2-checkbox-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.swal2-checkbox-container input[type="checkbox"] {
    display: none;
}

.swal2-checkbox-container label {
    display: inline-block;
    position: relative;
    padding-left: 25px;
    cursor: pointer;
}

.swal2-checkbox-container label::before {
    content: "";
    display: inline-block;
    position: absolute;
    left: 0;
    top: 2px;
    width: 18px;
    height: 18px;
    border: 2px solid #ccc;
    border-radius: 50%;
}

.swal2-checkbox-container label::after {
    content: "";
    display: none;
    position: absolute;
    left: 5px;
    top: 7px;
    width: 8px;
    height: 8px;
    background-color: #555;
    border-radius: 50%;
}

.swal2-checkbox-container input[type="checkbox"]:checked+label::after {
    display: block;
}

.habilidad-grupo {
    margin-bottom: 16px;
}

.habilidad-titulo {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
}

.swal2-column {
    display: flex;
    flex-direction: column;
}

.background-image {
    background-image: url('../../images/undraw_remotely_2j6y.svg');
    background-size: cover;
    background-repeat: no-repeat;

}
</style>


