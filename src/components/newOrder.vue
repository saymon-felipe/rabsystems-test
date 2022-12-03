<template>
    <section class="new-order">
        <div class="new-order-title">
            <h1 class="rabsystems-font">Novo pedido</h1>
        </div>
        <div class="new-order-form">
            <form action="new-order" @submit.prevent="submitNewOrderForm()">
                <div class="form-header">
                    <div class="form-input">
                        <select name="service" id="service" required>
                            <option value="">-- Tipo de serviço --</option>
                            <option value="Formatação">Formatação de computador</option>
                            <option value="Manutenção">Manutenção de computador</option>
                            <option value="Sistema WEB">Criação ou manutenção de sistema WEB</option>
                        </select>
                    </div>
                </div>
                <h5 class="error">Pedidos ainda não serão realizados pois o sistema está em beta.</h5>
                <div class="form-body">
                    <textarea name="description" id="description" maxlength="5000" placeholder="Descrição" required></textarea>
                </div>
                <input type="submit" value="Enviar">
            </form>
            <div class="loading"></div>
        </div>
    </section>
</template>

<script>
import $ from 'jquery';
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "newOrder",
    mixins: [globalMethods],
    methods: {
        submitNewOrderForm: function () {
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();

            $(".loading").show();

            let data = $("form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            api.post("/orders", data, {
                headers: {
                        Authorization: jwt
                    }
            })
            .then(function(){
                //self.$router.push("/my-orders");
                //self.$router.go();
            }).catch(function(error){
                console.log(error);
            }).then(function () {
                $(".loading").hide();
            })
        }
    }
}
</script>

<style scoped>

    .new-order {
        width: calc(100% - 225px);
        height: 100%;
        padding: 1rem;
        text-align: center;
        background: var(--white);
        position: absolute;
        right: 0;
        overflow-y: scroll;
    }

    @media (max-width: 876px) {
        .new-order {
            width: 100%;
        }
    }

    .new-order-title {
        margin: 1.5rem 0;
    }

        .new-order-title h1 {
            font-size: 1.8rem;
        }

    form {
        max-width: 1200px;
        margin: auto;
    }

    .form-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .form-body {
        margin-top: 1rem;
    }

    textarea, input, select {
        border-radius: 10px;
        border: 1px solid var(--gray);
        padding: 0 1rem;
        font-family: Arial, Helvetica, sans-serif;
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
        cursor: pointer;
        background: var(--purple);
        border-radius: 10px;
        color: var(--white);
        font-size: 1.1rem;
        padding: .7rem 1.3rem;
        line-height: 1;
    }

        input[type="submit"]:hover {
            background: var(--purple-low);
        }

    .form-input {
        margin: .5rem 1rem;
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