<template>
    <section class="contact" id="contact">
            <h2 class="rabsystems-font">Fale conosco</h2>
        <div class="contact-container">
            <form action="contact" @submit.prevent="sendContactForm()">
                <div class="row mb-2">
                    <div class="col-12 col-md-4">
                        <div class="form-input">
                            <input type="text" name="name" id="name" placeholder="Nome" required>
                        </div>
                    </div>
                    <div class="col-12 col-md-4">
                        <div class="form-input">
                            <div class="rabsystems-input">
                                <div class="flag-input">
                                    <div class="current-flag-container"></div>
                                    <div class="flag-list"></div>
                                </div>
                                <input type="tel" name="tel" id="tel-input" required>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4">
                        <div class="form-input">
                            <select name="contact-option" id="contact-option" required>
                                <option value="">-- Assunto --</option>
                                <option value="information">Informações</option>
                                <option value="services">Serviços</option>
                                <option value="other">Outros</option>
                            </select>
                        </div>
                    </div>
                </div> 
                <div class="form-body">
                    <textarea name="description" id="description" maxlength="5000" placeholder="Descrição" required></textarea>
                </div>
                <input type="submit" value="Enviar">
            </form>
            <div class="loading"></div>
            <div class="response"></div>
        </div>
    </section>
</template>

<script>
import $ from 'jquery';

export default {
    name: "contactComponent",
    methods: {
        sendContactForm: function () {
            let input = $("#tel-input");
            
            $(".response").removeClass("error").html("");
            $(".loading").show();

            if (input.attr("is_valid") == "true") {
                let data = $("form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                    obj[item.name] = item.value;
                    return obj;
                }, {});

                setTimeout(() => {
                    $(".loading").hide();
                    console.log(data)
                }, 500);
            } else {
                $(".loading").hide();
                $(".response").addClass("error").html("Verifique o número de telefone!");
            }
        }
    }
}
</script>

<style scoped>
    .contact {
        background: var(--white);
        text-align: center;
        padding: 4rem 1rem;
    }

    h2.rabsystems-font {
        margin-bottom: 1rem;
        font-size: 2rem;
        font-weight: 500;
    }

    .contact-container {
        width: 80%;
        margin: auto;
        margin-top: 2rem;
    }

        .contact-container p {
            font-size: 1.2rem;
            line-height: 1.5;
        }

    @media (max-width: 449px) {
        .contact-container p {
            font-size: 1rem;
        }
    }

    form {
        max-width: 1200px;
        margin: auto;
    }

    textarea {
        padding: .8rem 1rem;
        width: 100%;
        min-height: 300px;
        max-height: 700px;
    }

    input, select {
        height: 40px;
    }

    input[type="submit"] {
        margin-top: 1rem;
        background: var(--purple);
        color: var(--white);
        font-size: 1.1rem;
    }

        input[type="submit"]:hover {
            background: var(--purple-low);
        }

    .form-input {
        margin: .5rem 0;
    }

    @media (max-width: 718px) {
        .form-input, input, select {
            width: 100%;
        }

        .form-input {
            margin: 0.5rem 0;
        }
    }

    @media (max-width: 449px) {
        input[type="submit"] {
            font-size: .9rem;
        }

        .contact-container {
            width: 90%; 
        }
    }
</style>