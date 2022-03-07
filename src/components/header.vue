<template>
    <header>
        <div class="header-container">
            <div class="site-logo">
                <a href="#home">
                    <img src="../assets/img/icone.png" alt="Icone rabsystems" class="site-logo-img">
                </a>
            </div>
            <i class="fas fa-bars responsive-header" v-on:click="openResponsiveMenu()"></i>
            <div class="no-responsive-header">
                <nav class="header">
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">Quem somos</a></li>
                        <li><a href="#services">Serviços</a></li>
                        <li><a href="#contact">Contato</a></li>
                    </ul>
                </nav>  
                <div class="header-buttons">
                    <router-link to="/login" class="header-button">Entrar</router-link>
                    <router-link to="/register" class="header-button">Cadastro</router-link>
                </div>
            </div>
        </div>
        <div class="responsive-header-container">
            <nav class="header">
                <ul>
                    <li><a href="#home" v-on:click="closeResponsiveMenu()">Home</a></li>
                    <li><a href="#about" v-on:click="closeResponsiveMenu()">Quem somos</a></li>
                    <li><a href="#services" v-on:click="closeResponsiveMenu()">Serviços</a></li>
                    <li><a href="#contact" v-on:click="closeResponsiveMenu()">Contato</a></li>
                </ul>
            </nav>  
            <div class="header-buttons">
                <router-link to="/login" class="header-button">Entrar</router-link>
                <router-link to="/register" class="header-button">Cadastro</router-link>
            </div>
        </div>
        <div class="overlay" v-on:click="closeResponsiveMenu()"></div>
    </header>
</template>

<script>
import $ from 'jquery';

export default {
    name: "headerComponent",
    methods: {
        openResponsiveMenu: function () {
            $(".responsive-header-container").css("transform", "translateX(0)");
            $(".overlay").show();
        },
        closeResponsiveMenu: function () {
            $(".responsive-header-container").css("transform", "translateX(100%)");

            setTimeout(() => {
                $(".overlay").hide();
            }, 500);
        }
    }
}
</script>

<style scoped>

    header {
        background: var(--white);
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        z-index: 3;
        box-shadow: 0 0 5px rgba(0,0,0,0.5);
    }

    .header-container {
        padding: 1rem 0;
        width: 90%;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: relative;
    }

    .site-logo {
        margin-right: 3rem;
    }

    .no-responsive-header {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .header ul {
        list-style: none;
        display: flex;
        align-items: center;
        margin-right: 10rem;
        margin-bottom: 0;
    }

        .header ul li {
            margin: 0 1rem;
        }

            .header ul li a {
                color: var(--black);
                font-size: 1.3rem;
                transition: opacity 0.4s;
            }

                .header ul li a:hover {
                    opacity: 0.7;
                }

    .site-logo-img {
        max-width: 50px;
    }

    .header-buttons {
        display: flex;
         align-items: center;
         justify-content: center;
    }

    .header-buttons .header-button {
        border: none;
        font-size: 1rem;
        padding: .7rem 1.3rem;
        border-radius: 10px;
        cursor: pointer;
        margin: 0 .5rem;
    }

    .header-buttons .header-button:nth-child(1) {
        background: transparent;
        border: 2px solid var(--blue);
        color: var(--blue);
        transition: all 0.4s;
    }

        .header-buttons .header-button:nth-child(1):hover {
            background: var(--blue);
            color: var(--white);
        }

    .header-buttons .header-button:nth-child(2) {
        background: var(--purple);
        border: 2px solid var(--purple);
        color: var(--white);
        transition: all 0.4s;
    }

        .header-buttons .header-button:nth-child(2):hover {
            background: var(--purple-low);
            border: 2px solid var(--purple-low);
            color: var(--white);
        }

    .responsive-header {
        display: none;
        position: absolute;
        right: 0;
        font-size: 2rem;
        cursor: pointer;
    }

    .responsive-header-container {
        position: fixed;
        top: 0;
        right: 0;
        background: white;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1rem 3rem;
        z-index: 3;
        transform: translateX(100%);
        transition: transform .5s;
    }

    .responsive-header-container ul {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0!important;
    }

        .responsive-header-container ul li {
            margin: .7rem;
        }

            .responsive-header-container ul li a {
                font-size: 1.7rem!important;
            }

    .responsive-header-container .header-buttons {
        display: flex;
        flex-direction: column;
        margin-top: 2rem;
    }

        .responsive-header-container .header-button {
            font-size: 1.3rem!important;
            padding: .7rem 1.3rem;
            margin: .7rem 0;
        }


    @media (max-width: 1064px) {
        .site-logo-img {
            max-width: 40px;
        }

        .header ul li a {
            font-size: 1rem;
        }

        .header-buttons button {
            font-size: .8rem;
            padding: .5rem 1.1rem;
            margin: 0 .3rem;
        }

        .header ul {
            margin-right: 7rem;
        }
    }

    @media (max-width: 876px) {
        .responsive-header {
            display: flex;
        }

        .no-responsive-header {
            display: none;
        }

        .header-container {
            justify-content: space-between;
            width: 70%;
        }
    }

    @media (max-width: 439px) {
        .responsive-header-container {
            padding: 1.3rem;
        }

        .responsive-header-container ul li a {
            font-size: 1.3rem!important;
        }

        .responsive-header-container .header-buttons button {
            font-size: .8rem!important;
            padding: .5rem 1.1rem;
            margin: .5rem 0;
        }
    }

</style>