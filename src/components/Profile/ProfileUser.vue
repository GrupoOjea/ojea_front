<template>
    <div class="background-image">
    <div v-if="navPerfil">
        <NavbarUser> </NavbarUser>
    </div>

    <div class="card card-margin">
        <div class="card-body">
            <h4>Mi perfil</h4>
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
                    <p class="info-line"><span class="info-label">Edad:</span> <span class="info-data">{{ userProfile.edad
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
                        <i class="fa-solid fa-pen-to-square icon-pen" @click="editEducation"></i>
                        <i class="fa-solid fa-plus icon-plus" @click="addEducation"></i>
                        <div class="card-body">
                            <h4>Educación</h4>
                            <br><br>
                            <p>{{ userProfile.institucion }}</p>
                            <p>{{ userProfile.titulo }}</p>
                            <p>{{ userProfile.mes_inicio }} - {{ userProfile.mes_fin }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="card h-100">
                        <i class="fa-solid fa-pen-to-square icon-pen" @click="editSkills"></i>
                        <i class="fa-solid fa-plus icon-plus" @click="addSkills"></i>
                        <div class="card-body">
                            <h4>Habilidades</h4>
                            <br>
                            <div v-for="(skill, index) in userProfile.habilidades" :key="index">
                                <div v-for="(habilidades, habilidadPrincipal) in formatSkills(skill.texto_habilidades)">
                                    <h5 v-html="habilidadPrincipal"></h5>
                                    <p v-html="habilidades"></p>
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
import habilidadesData from "@/utils/habilidades.json";
import institucionData from "@/utils/institucion.json";

export default {
    components: {
        NavbarUser

    },
    data() {
        return {
            navPerfil: true,
            userProfile: {},
            habilidadesData: habilidadesData,
            institucionData: []
        };
    },
    async mounted() {

        const id = localStorage.getItem('id');
        try {
            const response = await callApiAxios('get', `http://localhost:3000/profile/${id}`, {});
            this.userProfile = response.data;
            console.log(this.userProfile)
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
                    let responseAxios = await callApiAxios('put', `http://localhost:3000/profile/update`, result.value);
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

        generateOptions(data, valueField, textField) {
            return data.map(item => `<option value="${item[valueField]}">${item[textField]}</option>`).join('');
        },
        
        addEducation() {
            console.log(this.institucionData); 
  
  // Aquí estás buscando una institución específica.
  let selectedInstitucion = this.institucionData.find(institucion => institucion.institucion === 'Universidad de Chile');

  // Genera las opciones para las instituciones.
  let institucionOptions = this.generateOptions(this.institucionData, 'institucion', 'institucion');
  
  if (selectedInstitucion) {
    const carreraOptions = this.generateOptions(selectedInstitucion.carreras, 'nombre', 'nombre');
    
    Swal.fire({
      // Resto del código...
    }).then(result => {
      // Resto del código...
    });
  } else {
    console.error('No se encontró la institución "Universidad de Chile" en la data de instituciones.');
  }
            



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
                            <select id="newCarrera" class="swal2-input"></select>
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Mes de Inicio:</label>
                            <input type="text" id="newMesInicio" class="swal2-input" placeholder="Ingrese el mes de inicio">
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Año de Inicio:</label>
                            <input type="text" id="newAnoInicio" class="swal2-input" placeholder="Ingrese el año de inicio">
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Mes de Fin:</label>
                            <input type="text" id="newMesFin" class="swal2-input" placeholder="Ingrese el mes de fin">
                        </div>
                        <div class="swal2-row">
                            <label class="swal2-label">Año de Fin:</label>
                            <input type="text" id="newAnoFin" class="swal2-input" placeholder="Ingrese el año de fin">
                        </div>
                    </div>`,
                focusConfirm: false,
                didOpen: () => {
                    // Cuando se abre la alerta, configura el listener para el cambio de institución
                    document.getElementById('newInstitucion').addEventListener('change', function () {
                        // Encuentra la institución seleccionada
                        const selectedInstitucion = this.institucionData.find(institucion => institucion.institucion === this.value);

                        // Genera las opciones para las carreras de esta institución
                        const carreraOptions = this.generateOptions(selectedInstitucion.carreras, 'nombre', 'nombre');

                        // Actualiza el select de carreras con las nuevas opciones
                        document.getElementById('newCarrera').innerHTML = carreraOptions;
                    }.bind(this)); // Bind "this" to have access to the vue instance in the event listener

                    // Carga las carreras de la primera institución por defecto
                    if (this.institucionData.length > 0) {
                        const carreraOptions = this.generateOptions(this.institucionData[0].carreras, 'nombre', 'nombre');
                        document.getElementById('newCarrera').innerHTML = carreraOptions;
                    }
                },
                preConfirm: () => {
                    return {
                        institucion: document.getElementById('newInstitucion').value,
                        carrera: document.getElementById('newCarrera').value,
                        mes_inicio: document.getElementById('newMesInicio').value,
                        ano_inicio: document.getElementById('newAnoInicio').value,
                        mes_fin: document.getElementById('newMesFin').value,
                        ano_fin: document.getElementById('newAnoFin').value
                    }
                }
            }).then(result => {
                if (result.isConfirmed) {
                    // Aquí puedes realizar la acción para guardar la nueva educación
                    // const nuevaEducacion = result.value;
                    // Realizar acciones necesarias con la nueva educación
                }
            });
        },

        addSkills() {
            Swal.fire({
                width: '900px',
                title: 'Agregar Habilidades',
                html: `
                        <div class="swal2-content">
                        <div class="swal2-row">
                            <label class="swal2-label">Habilidad principal:</label>
                            <select id="mainSkill" class="swal2-input">
                            <option value="">Seleccione una habilidad</option>
                            ${habilidadesData.habilidades_informatica.map(habilidad => `<option value="${habilidad.nombre}">${habilidad.nombre}</option>`)}
                            </select>
                        </div>
                        <div class="swal2-row" id="subSkillsContainer" style="display: none;">
                            <label class="swal2-label">Subhabilidades:</label>
                            <div class="swal2-checkbox-container">
                            ${habilidadesData.habilidades_informatica[0].subhabilidades.map(subhabilidad => `
                                <input type="checkbox" id="${subhabilidad}" name="subSkills" value="${subhabilidad}">
                                <label for="${subhabilidad}">${subhabilidad}</label>
                            `).join('')}
                            </div>
                        </div>
                        </div>`,
                focusConfirm: false,
                didOpen: () => {
                    const mainSkillSelect = document.getElementById('mainSkill');
                    const subSkillsContainer = document.getElementById('subSkillsContainer');

                    mainSkillSelect.addEventListener('change', () => {
                        const selectedHabilidad = habilidadesData.habilidades_informatica.find(habilidad => habilidad.nombre === mainSkillSelect.value);

                        if (selectedHabilidad && selectedHabilidad.subhabilidades) {
                            const subhabilidadesOptions = selectedHabilidad.subhabilidades.map(subhabilidad => `
                            <input type="checkbox" id="${subhabilidad}" name="subSkills" value="${subhabilidad}">
                            <label for="${subhabilidad}">${subhabilidad}</label>
                            `).join("");
                            subSkillsContainer.innerHTML = subhabilidadesOptions;
                            subSkillsContainer.style.display = 'block';
                        } else {
                            subSkillsContainer.innerHTML = '';
                            subSkillsContainer.style.display = 'none';
                        }
                    });
                },
                preConfirm: () => {
                    const selectedSubSkills = Array.from(document.getElementsByName('subSkills'))
                        .filter(checkbox => checkbox.checked)
                        .map(checkbox => checkbox.value);

                    console.log('Habilidades seleccionadas:', selectedSubSkills);

                    return {
                        habilidadPrincipal: document.getElementById('mainSkill').value,
                        subhabilidades: selectedSubSkills.join(", ")
                    }
                }
            }).then(async result => {
                if (result.isConfirmed) {
                    const habilidadPrincipal = result.value.habilidadPrincipal;
                    const subhabilidades = result.value.subhabilidades;
                    console.log('Habilidades seleccionadas:', subhabilidades);
                    let responseAxios = await callApiAxios('post', `http://localhost:3000/skills/create`, {
                        'texto_habilidades': subhabilidades,
                        'fk_persona': this.userProfile.id,
                    });
                    if (responseAxios.status == 201) {
                        Swal.fire('Creado', 'Las habilidades han sido creadas.', 'success').then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire('Error', 'Hubo un problema al crear las habilidades.', 'error');
                    } V
                }
            });




        },

        editSkills() {
            const habilidadesPrincipales = habilidadesData.habilidades_informatica;
            const habilidadesExistentes = this.userProfile.habilidades.flatMap(h => h.texto_habilidades.split(',').map(habilidad => habilidad.trim()));

            const habilidadesHTML = habilidadesPrincipales.map(habilidadPrincipal => {
                const subhabilidadesSeleccionadas = habilidadPrincipal.subhabilidades.filter(subhabilidad =>
                    habilidadesExistentes.includes(subhabilidad)
                );

                if (subhabilidadesSeleccionadas.length === 0) {
                    return '';
                }

                const subhabilidadesHTML = habilidadPrincipal.subhabilidades.map(subhabilidad => {
                    const isChecked = habilidadesExistentes.includes(subhabilidad);
                    return `
        <input type="checkbox" id="${subhabilidad}" name="subSkills" value="${subhabilidad}" ${isChecked ? 'checked' : ''}>
        <label for="${subhabilidad}">${subhabilidad}</label>
      `;
                }).join('');

                return `
      <div class="swal2-row habilidad-grupo">
        <div>
          <h5 class="habilidad-titulo">${habilidadPrincipal.nombre}</h5>
        </div>
        <div class="swal2-checkbox-container">
          ${subhabilidadesHTML}
        </div>
      </div>
    `;
            }).join('');

            Swal.fire({
                width: '1100px',
                title: 'Editar Habilidades',
                html: `
      <div class="swal2-content">
        ${habilidadesHTML}
      </div>`,
                didOpen: () => {
                    const subSkillsContainer = document.getElementById('subSkillsContainer');
                    const subSkillsCheckboxes = subSkillsContainer.querySelectorAll('input[type="checkbox"]');

                    subSkillsCheckboxes.forEach(checkbox => {
                        if (habilidadesExistentes.includes(checkbox.value)) {
                            checkbox.checked = true;
                        } else {
                            checkbox.checked = false;
                        }
                    });
                },
                preConfirm: () => {
                    const selectedSubSkills = Array.from(document.getElementsByName('subSkills'))
                        .filter(checkbox => checkbox.checked)
                        .map(checkbox => checkbox.value);

                    return {
                        id: this.userProfile.id_skill,
                        texto_habilidades: selectedSubSkills.join(", ") || ""
                    };
                }
            }).then(async result => {
                if (result.isConfirmed) {
                    const subhabilidades = result.value.texto_habilidades;
                    console.log('Habilidades seleccionadas:', this.userProfile.id_skill, subhabilidades);
                    let responseAxios = await callApiAxios('put', `http://localhost:3000/skills/update`, {
                        id: this.userProfile.id_skill,
                        texto_habilidades: subhabilidades
                    });
                    if (responseAxios.status == 200) {
                        Swal.fire('Actualizado', 'Las habilidades han sido actualizadas.', 'success').then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire('Error', 'Hubo un problema al actualizar las habilidades.', 'error');
                    }
                }
            });
        }
        ,


        formatSkills(texto_habilidades) {
            if (!texto_habilidades) {
                return '';
            }

            let habilidadesExistentes = texto_habilidades.split(',').map(habilidad => habilidad.trim().toLowerCase());
            let habilidadesPrincipales = this.habilidadesData.habilidades_informatica;

            let habilidadesAgrupadas = habilidadesExistentes.reduce((groups, habilidad) => {
                let habilidadPrincipal = habilidadesPrincipales.find(habilidadPrincipal =>
                    habilidadPrincipal.subhabilidades.map(subhabilidad => subhabilidad.toLowerCase()).includes(habilidad)
                );
                let nombreHabilidadPrincipal = habilidadPrincipal ? `<b>${habilidadPrincipal.nombre}</b>` : 'Otras habilidades';

                if (!groups[nombreHabilidadPrincipal]) {
                    groups[nombreHabilidadPrincipal] = [];
                }
                groups[nombreHabilidadPrincipal].push(this.textTransform(habilidad));

                return groups;
            }, {});

            // Combina las habilidades en una cadena separada por comas.
            for (let group in habilidadesAgrupadas) {
                habilidadesAgrupadas[group] = habilidadesAgrupadas[group].join(', ');
            }

            return habilidadesAgrupadas;
        },
        textTransform(text) {
            return text.charAt(0).toUpperCase() + text.slice(1);
        },
    },
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
    right: 45px;
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

.background-image{
  background-image: url('../../images/undraw_remotely_2j6y.svg');
   background-size: cover;
   background-repeat: no-repeat;
   
}
</style>


