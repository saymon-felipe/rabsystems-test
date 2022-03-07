<template>
    <main class="main-body" id="home">
        <section class="main-content">
            <div class="text-presentation">
                <h1 class="rabsystems-font">Rabsystems</h1>
                <div class="text-presentation-carousel">
                    <h4>Manutenção de Computadores</h4>
                    <h4>Sistemas para internet</h4>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
export default {
    name: 'homeComponent'
}
</script>

<style scoped>

    .main-body {
        padding-top: 9rem;
        width: 100vw;
        height: calc(100vh - 10rem);
        position: relative;
        background-image: linear-gradient(140deg, var(--gray-high-2), var(--blue-high-2));
    }

    .main-content {
        margin-top: 3rem;
        padding: 2rem 5rem;
    }

    .text-presentation h1, .text-presentation h4 {
        transition: transform 0.4s, opacity 0.4s;
    }

    .text-presentation h1 {
        font-size: 5rem;
        font-weight: 600;
        letter-spacing: 7px;
        animation-duration: 1.5s;
        animation-name: transformText;
        animation-fill-mode: forwards;
        animation-timing-function: ease-in-out;
        animation-iteration-count: 1;
    }

    .text-presentation h4 {
        font-size: 2.5rem;
        font-weight: 400;
        letter-spacing: 3px;
        animation-name: transformTextCarousel;
        animation-duration: 20.5s;
        position: absolute;
        animation-fill-mode: forwards;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        visibility: hidden;
    }

    .text-presentation h4:nth-child(1) {
        animation-delay: 1.5s;
    }

    .text-presentation h4:nth-child(2) {
        animation-delay: 11.5s;
    }

    @keyframes transformText {
        0% {
            transform: translateX(-10vw);
            opacity: 0;
        }
        30% {
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes transformTextCarousel {
        0% {
            transform: translateX(-10vw);
            opacity: 0;
            visibility: visible;
        }
        10% {
            transform: translateX(0);
            opacity: 1;
        }
        40% {
            transform: translateX(0);
            opacity: 1;
        }
        50% {
            transform: translateX(10vw);
            opacity: 0;
            visibility: hidden;
        }
        100% {
            transform: translateX(-10vw);
        }
    }

    .text-presentation-carousel {
        position: relative;
    }

    @media (max-width: 635px) {
        .text-presentation h1 {
            font-size: 3rem!important;
        }

        .text-presentation h4 {
            font-size: 1.5rem!important;
        }
    }

    @media (max-width: 450px) {
        .main-content {
            padding: 2rem;
        }
    }

    @media (max-width: 367px) {
        .main-content {
            padding: 1rem;
            margin-top: 0;
        }

        .text-presentation h1 {
            font-size: 1.5rem!important;
        }

        .text-presentation h4 {
            font-size: 1rem!important;
        }
    }

</style>