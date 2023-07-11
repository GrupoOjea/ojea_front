<template>
    <div class="carousel-container">
        <div ref="splide" class="splide my-theme">
            <div class="splide__track">
                <ul class="splide__list">
                    <li v-for="slide in slides" :key="slide.id" class="splide__slide">
                        <h3>{{ slide.nombre }} {{ slide.id }}</h3>
                        <p>{{ slide.descripcion }}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
  
<script>
import Splide from '@splidejs/splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import '@splidejs/splide/dist/css/splide.min.css';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { callApiAxios } from "../../services/axios";

export default {
    name: 'SplideComponent',
    data() {
        return {
            dataSearch: [],
            slides: [
                { id: 1, nombre: 'Slide ', descripcion: 'Descripción del Slide 1' },
                { id: 2, nombre: 'Slide ', descripcion: 'Descripción del Slide 2' },
                { id: 3, nombre: 'Slide ', descripcion: 'Descripción del Slide 3' },
                { id: 4, nombre: 'Slide ', descripcion: 'Descripción del Slide 4' },
                { id: 5, nombre: 'Slide ', descripcion: 'Descripción del Slide 5' },
                { id: 6, nombre: 'Slide ', descripcion: 'Descripción del Slide 6' },
                { id: 7, nombre: 'Slide ', descripcion: 'Descripción del Slide 7' },
                { id: 8, nombre: 'Slide ', descripcion: 'Descripción del Slide 8' },
                { id: 9, nombre: 'Slide ', descripcion: 'Descripción del Slide 9' },
                { id: 10, nombre: 'Slide ', descripcion: 'Descripción del Slide 10' },
                { id: 11, nombre: 'Slide ', descripcion: 'Descripción del Slide 11' },
                { id: 12, nombre: 'Slide ', descripcion: 'Descripción del Slide 12' },
                { id: 13, nombre: 'Slide ', descripcion: 'Descripción del Slide 13' },
                { id: 14, nombre: 'Slide  ', descripcion: 'Descripción del Slide 14' },
            ],
        };
    },
    mounted() {
        this.initSplide();
        this.getSlidesData();
    },
    methods: {
        initSplide() {
            const splide = new Splide(this.$refs.splide, {
                type: 'loop',
                drag: 'free',
                focus: 'center',
                perPage: 3,
                autoScroll: {
                    speed: 1,
                },
            });

            splide.mount({ AutoScroll });
        },
        async getSlidesData() {
            try {
                const response = await callApiAxios("post", this.$baseURL + "/jobs/search", {
                    buscador: 'd',
                    donde: '',
                });
                this.dataSearch = response.data;
            } catch (error) {
                console.log("Error al obtener los datos de la API:", error);
            }
        }
    },
};

</script>
  
<style scoped>
.carousel-container {
    display: flex;
    justify-content: center;
    /* Centra el carrusel horizontalmente */
    padding: 20px;
    /* Ajusta el espacio alrededor del carrusel */
}

.my-theme .splide__slide {
    background-color: #fafafa;
    color: #333;
    border: 1px solid #ccc;
    width: 200px;
    height: 200px;
    margin: 20px;
}

.my-theme .splide__slide.is-active {
    background: linear-gradient(to top, #91a7ff, #5f76ff);
    color: #fff;
}

.my-theme .splide__arrow {
    background-color: #ccc;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    z-index: 1;
    /* Asegura que las flechas estén por encima del carrusel */
}

.my-theme .splide__arrow--prev {
    left: -50px;
}

.my-theme .splide__arrow--next {
    right: -50px;
}

.my-theme .splide__pagination {
    background-color: #eee;
}

.my-theme .splide__pagination__page.is-active {
    background-color: #f00;
}

/* Estilos adicionales para limitar el ancho del carrusel */
.my-theme .splide__track {
    max-width: 660px;
    /* Ajusta el ancho máximo deseado */
    margin: 0 auto;
    /* Centra el carrusel dentro del contenedor */
}
</style>
  