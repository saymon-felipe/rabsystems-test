<template>
    <footer>
        <div class="container">
            <div class="site-map">
                <h4>MAPA DO SITE</h4>
                <nav class="footer">
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">Quem somos</a></li>
                        <li><a href="#services">Serviços</a></li>
                        <li><a href="#contact">Contato</a></li>
                    </ul>
                </nav>  
            </div>
        </div>
        <div class="copyrigth">
            <h6>&copy; 2022 - Rabsystems</h6>
        </div>
    </footer>
</template>

<script>
export default {
    name: "footerComponent"
}
</script>

<style scoped>
    footer {
        padding: 3rem 3rem 1rem;
        width: 100vw;
        position: relative;
        background-image: linear-gradient(140deg, var(--gray-high-2), var(--blue-high-2));
    }

    .container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .site-map {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .footer ul {
        margin-top: 1rem;
        list-style: none;
        text-align: center;
    }

        .footer ul li {
            margin: 0 1rem;
        }

            .footer ul li a {
                color: var(--black);
                font-size: 1.3rem;
                transition: opacity 0.4s;
            }

                .footer ul li a:hover {
                    opacity: 0.7;
                }

    .copyrigth {
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 2rem;
    }
</style>