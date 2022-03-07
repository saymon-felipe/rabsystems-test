<template>
    <section class="services" id="services">
        <div class="services-title">
            <h2 class="rabsystems-font">Nossos Serviços</h2>
        </div>
        <div class="services-container">
            <ul>
                <li>
                    <div class="service-item" v-on:click="toggleExtenderInformation('systemCreation')">
                        <div class="link">
                            <div class="service-header">
                                <h4>Criação de sistemas para WEB</h4>
                            </div>
                            <div class="service-body">
                            <p>
                                    Desde o mais simples site até sistemas completos para internet.
                            </p>
                            <p v-if="systemCreation">
                                    Desde o mais simples site até sistemas completos para internet.
                            </p>
                            </div>
                            <div class="service-footer">
                                <button>Consulte disponibilidade</button>
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="service-item" v-on:click="toggleExtenderInformation('computerFormatting')">
                        <div class="link">
                            <div class="service-header">
                                <h4>Formatação e manutenção de computadores</h4>
                            </div>
                            <div class="service-body">
                                <p>
                                    Fazemos manutenção básica ex: Limpeza, troca de pasta térmica. Também formatamos e deixamos seu computador como novo.
                                </p>
                                <p v-if="computerFormatting">
                                    Fazemos manutenção básica ex: Limpeza, troca de pasta térmica. Também formatamos e deixamos seu computador como novo.
                                </p>
                            </div>
                            <div class="service-footer">
                                <h4>R$: 79,99 + encargos</h4>
                            </div>
                        </div>
                    </div>
                </li>
                <li style="display: none;">
                    <div class="service-item" v-on:click="toggleExtenderInformation('computerAssembly')">
                        <div class="link">
                            <div class="service-header">
                                <h4>Montagem de computadores</h4>
                            </div>
                            <div class="service-body">
                                <p>Montamos um PC sob medida para atender suas necessidades e também instalamos o sistema operacional desejado.</p>
                                <p v-if="computerAssembly">Montamos um PC sob medida para atender suas necessidades e também instalamos o sistema operacional desejado.</p>
                            </div>
                            <div class="service-footer">
                                <button>Fazer avaliação</button>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
export default {
    name: "servicesComponent",
    data() {
        return {
            computerAssembly: false,
            computerFormatting: false,
            systemCreation: false
        }
    },
    methods: {
        toggleExtenderInformation: function (service) {
            let self = this;
            self.resetServicesVariables();

            switch (service) {
                case "systemCreation":
                    self.systemCreation = true;
                    break;
                case "computerFormatting":
                    self.computerFormatting = true;
                    break;
                case "computerAssembly":
                    self.computerAssembly = true;
                    break;
            }
        },
        resetServicesVariables: function () {
            let self = this;

            self.computerAssembly = false;
            self.computerFormatting = false;
            self.systemCreation = false;
        }
    }
}
</script>

<style scoped>

    .services {
        position: relative;
        background-image: linear-gradient(140deg, var(--gray-high-2), var(--blue-high-2));
        padding: 3.5rem 1rem;
    }

    .services-title {
        margin-bottom: 1rem;
        text-align: center;
    }

        .services-title h2 {
            font-size: 2rem;
        }

    .services-container {
        width: 80%;
        margin: auto;
        max-width: 1200px;
        margin-top: 2rem;
    }

    .services-container ul {
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }

    .service-item {
        border: 3px solid var(--white);
        border-radius: 10px;
        margin: 1rem .5rem;
        cursor: pointer;
        transition: all 0.3s;
        text-align: center;
    }

        .service-item .link {
            padding: 2rem 2rem 6rem 2rem;
            max-width: 350px;
            min-height: 300px;
            position: relative;
        }

        .service-item:hover {
            background: var(--white);
        }

    .service-header h4 {
        font-size: 1.3rem;
        margin-bottom: 1rem;
        color: var(--black)!important;
    }

    .service-body p {
        margin-bottom: 1rem;
        color: var(--black)!important;
    }

    .service-footer {
        position: absolute;
        bottom: 10%;
        left: 0;
        right: 0;
    }

        .service-footer h4 {
            font-size: 1.1rem;
            color: var(--black)!important;
        }

        .service-footer button {
            font-size: 1.1rem;
            padding: .7rem 1.3rem;
            background: var(--purple);
            border: none;
            border-radius: 10px;
            color: var(--white);
            cursor: pointer;
            transition: all 0.4s;
        }

            .service-footer button:hover {
                background: var(--purple-low);
            }

    @media (max-width: 449px) {
        .service-header h4 {
            font-size: 1.1rem;
            margin-bottom: .5rem;
        }

        .service-body p {
            font-size: .9rem;
        }

        .service-footer button {
            font-size: .9rem;
            padding: .7rem 1.3rem;
        }

        .service-item {
            width: 80vw;
        }
    }


    @media (max-width: 330px) {
        .service-footer {
            bottom: 5%;
        }
    }

    @media (max-width: 290px) {
        .service-footer button {
            white-space: break-spaces;
            width: 80%;
        }
    }

</style>