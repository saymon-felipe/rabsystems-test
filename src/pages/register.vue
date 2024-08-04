<template>
    <div>
        <section class="logo-background">
            <div class="glass-container">
                <h1 class="rabsystems-font">{{ $t("register.register") }}</h1>
                <form action="login" @submit.prevent="register()">
                    <div class="input-group">
                        <input class="input" type="email" name="email" id="email" :placeholder="$t('register.email')" v-on:focusout="validateEmailInput($event)" required>
                    </div>
                    <div class="input-group">
                        <input class="input" type="password" name="password" id="password" :placeholder="$t('register.password')" required>
                    </div>
                    <div class="input-group">
                        <input class="input" type="password" id="repeat-password" :placeholder="$t('register.repeat_password')" required>
                    </div>
                    <input type="submit" :value="$t('register.register_button')" id="submit">
                </form>
                <div class="go-to-login">
                    <span>{{ $t("register.already_registered") }} </span>
                    <router-link to="/login">{{ $t("register.sign_in") }}</router-link>
                </div>
                <div class="response" :class="responseClass">{{ message }}</div>
            </div>
        </section>
        <hexBackground />
    </div>
</template>

<script>
import $ from 'jquery';
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';
import hexBackground from "../components/hexBackground.vue";

export default {
    name: "register",
    mixins: [globalMethods],
    data() {
        return {
            message: "",
            responseClass: ""
        }
    },
    methods: {
        register: function () {
            let self = this;

            $("#submit").attr("disabled", "disabled");
            self.message = "";
            self.responseClass = "";

            let data = $("form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            if ($("#password").val() != $("#repeat-password").val()) {
                self.message = self.$i18n.t("register.password_not_same");
                self.responseClass = "error";
                return;
            }

            api.post("/user/register", data)
            .then(function(response){
                $("#submit").attr("disabled", false);
                self.setEmailInSessionStorage(data["email"]);
                self.message = response.data.message;
                self.responseClass = "success";
                self.$router.push('/login');
                self.$router.go();
            }).catch(function(error){
                if (error) {
                    $("#submit").attr("disabled", false);
                    self.message = self.$i18n.t("register.registration_error");
                    self.responseClass = "error";
                }
            })
        },
        validateEmailInput: function (event) {
            let target = $("#" + event.target.id), emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (!emailRegex.test(target.val())) {
                target.addClass("invalid-value");
            } else {
                target.removeClass("invalid-value");
            }
        },
    },
    components: {
        hexBackground
    }
}
</script>

<style scoped>
    .go-to-login {
        display: flex;
        align-items: center;
        align-self: flex-start;
        margin-top: 1rem;
        margin-left: .5rem;
    }

        .go-to-login span {
            margin-right: .5rem;
        }

    form {
        width: 100%;
    }

    .glass-container h1 {
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
        .register-container {
            width: 80vw;
        }
    }

    @media (max-width: 435px) {
        .register {
            background-size: 200px;
        }

        .register-container {
            width: 92vw;
        }

        .input, input[type="submit"] {
            font-size: 1rem;
        }
    }
</style>