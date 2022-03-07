<template>
    <section class="login">
        <div class="login-container">
            <h1 class="rabsystems-font">LOGIN</h1>
            <form action="login" @submit.prevent="login()">
                <div class="input-group">
                    <input class="input" type="email" name="email" id="email" placeholder="Email" required>
                </div>
                <div class="input-group">
                    <input class="input" type="password" name="password" id="password" placeholder="Senha" required>
                </div>
                <input type="submit" id="submit" value="LOGIN">
            </form>
            <div class="go-to-register">
                <span>Não é cadastrado? </span>
                <router-link to="/register">Registre-se</router-link>
            </div>
            <div class="response" :class="responseClass">{{ message }}</div>
        </div>
    </section>
</template>

<script>
import $ from 'jquery';
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "login",
    mixins: [globalMethods],
    data() {
        return {
            message: "",
            responseClass: ""
        }
    },
    methods: {
        login: function () {
            let self = this;

            let data = $("form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            api.post("/user/login", data)
            .then(function(response){
                $("#submit").attr("disabled", false);

                self.message = response.data.response.message;
                self.responseClass = "success";

                self.setJwtInLocalStorage(response.data.response.token);

                if (response.data.response.incomplete_registration == "true") {
                    self.$router.push('/complete-registration');
                } else {
                    self.$router.push('/my-orders');
                }
                self.$router.go();
            }).catch(function(error){
                if (error) {
                    $("#submit").attr("disabled", false);
                    self.message = "Erro no login";
                    self.responseClass = "error";
                }
            })
        }
    }
}
</script>

<style scoped>
    .go-to-register {
        display: flex;
        align-items: center;
        align-self: flex-start;
        margin-top: 1rem;
        margin-left: .5rem;
    }

        .go-to-register span {
            margin-right: .5rem;
        }
    
    .login {
        width: 100vw;
        height: 100vh;
        background: var(--white);
        background-image: url('../assets/img/logo-completa.png');
        background-repeat: no-repeat;
        background-size: 300px;
        background-position-x: center;
        background-position-y: 1rem;
    }

    form {
        width: 100%;
    }

    .login-container {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 50vw;
        max-width: 700px;
        height: 50vh;
        max-height: 600px;
        background: var(--gray-high);
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
        padding: 1rem;
        transition: all 0.4s;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

        .login-container h1 {
            font-size: 1.6rem;
            margin-bottom: 1rem;
        }

    .input-group {
        width: 100%;
        height: 40px;
        margin: .5rem 0;
    }

    .input {
        width: 100%;
        height: 100%;
        border-radius: 7px;
        border: 1px solid var(--gray-high);
        padding: .3rem 1rem;
        font-size: 1.2rem;
    }

    input[type="submit"] {
        width: 100%;
        height: 40px;
        border-radius: 7px;
        border: none;
        background: var(--blue);
        color: var(--white);
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.4s;
    }

        input[type="submit"]:hover {
            background: var(--blue-low);
        }

    @media (max-width: 938px) {
        .login-container {
            width: 80vw;
        }
    }

    @media (max-width: 435px) {
        .login {
            background-size: 200px;
        }

        .login-container {
            width: 92vw;
        }

        .input, input[type="submit"] {
            font-size: 1rem;
        }
    }
</style>