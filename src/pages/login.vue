<template>
    <div>
        <section class="logo-background">
        <div class="glass-container">
            <h1 class="rabsystems-font">{{ $t("login.login") }}</h1>
            <form action="login" @submit.prevent="login()">
                <div class="input-group">
                    <input class="input" type="email" name="email" id="email" :placeholder="$t('login.email')" required>
                </div>
                <div class="input-group">
                    <input class="input" type="password" name="password" id="password" :placeholder="$t('login.password')" required>
                </div>
                <input type="submit" id="submit" :value="$t('login.login')">
            </form>
            <div class="go-to-register">
                <span>{{ $t("login.not_registered") }} </span>
                <router-link to="/register">{{ $t("login.register") }}</router-link>
            </div>
            <div class="loading-frame" v-if="loading"></div>
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
    name: "login",
    mixins: [globalMethods],
    data() {
        return {
            message: "",
            responseClass: "",
            loading: false
        }
    },
    methods: {
        login: function () {
            let self = this;

            let data = $("form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            self.loading = true;

            api.post("/user/login", data)
            .then(function(response){
                $("#submit").attr("disabled", false);

                self.loading = false;
                self.message = response.data.message;
                self.responseClass = "success";

                self.setJwtInLocalStorage(response.data.obj.token);
                self.setEmailInSessionStorage(data["email"]);
                
                if (response.data.obj.incomplete_registration == "true") {
                    self.$router.push('/complete-registration');
                } else {
                    self.$router.push('/my-orders');
                }
            }).catch(function(error){
                if (error) {
                    self.loading = false;
                    $("#submit").attr("disabled", false);
                    self.message = self.$i18n.t("login.login_error");
                    self.responseClass = "error";
                }
            })
        },
        disableInputs: function () {
            let emailElement = $("#email");
            let passwordElement = $("#password");
            emailElement.attr("disabled", "disabled");
            passwordElement.attr("disabled", "disabled");
        },
        autoLogin: function () {
            let jwt = this.getJwtInLocalStorage();
            $("#email").val(this.getEmailInSessionStorage());
            if (jwt != null) {
                this.disableInputs();
                this.loading = true;
                this.checkIfUserIsAuthenticated();
            }
        }
    },
    components: {
        hexBackground
    },
    mounted: function () {
        this.autoLogin();
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

    .loading-frame {
        width: 40px;
        height: 40px;
        margin-top: 1rem;
    }

    .loading-frame::after {
        border: 7px solid var(--purple);
        border-top: 7px solid var(--purple);
        border-left: 7px solid var(--purple);
        border-right: 7px solid var(--purple);
        border-bottom: 7px solid transparent;
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