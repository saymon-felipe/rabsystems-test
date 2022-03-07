<template>
    <section class="about" id="about">
        <h2 class="rabsystems-font">Quem somos?</h2>
        <div class="about-container">
            <p>
                A Rabsystems é uma empresa que foi criada em 2021 para atender as demandas de criação de sistemas para internet e manutenção de computadores. A empresa reside em Curitiba porém oferece serviços online para todas as partes do mundo.
            </p>
            <p>
                Para conheçer nossos serviços <a href="#services">Clique aqui</a>.
            </p>
        </div>
    </section>
</template>

<script>
export default {
    name: "about"
}
</script>

<style scoped>

    .about {
        background: var(--white);
        text-align: center;
        padding: 2rem 1rem;
    }

    h2.rabsystems-font {
        font-size: 2rem;
        font-weight: 500;
    }

    .about-container {
        width: 80%;
        margin: auto;
        margin-top: 1rem;
    }

        .about-container p {
            font-size: 1.2rem;
            line-height: 1.5;
        }

        .about-container a {
            color: var(--blue-low);
        }

            .about-container a:hover {
                color: var(--blue-low-2);
            }

            .about-container a:active {
                color: var(--purple);
            }

    @media (max-width: 449px) {
        .about-container p {
            font-size: 1rem;
        }
    }

</style>