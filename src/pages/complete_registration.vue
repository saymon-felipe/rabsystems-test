<template>
    <div>
        <section class="logo-background">
            <div class="glass-container">
                <i class="fas fa-power-off logout-icon" v-on:click="logoutUser()"></i>
                <h1 class="rabsystems-font">{{ $t("complete_registration.complete_registration") }}</h1>
                <form id="complete-registration-form" @submit.prevent="complete_registration()">
                    <div class="row">
                        <div class="col-md-6 col-sm-12">
                            <div class="input-group">
                                <label for="name">{{ $t("complete_registration.name") }}</label>
                                <input type="text" name="name" id="name" v-on:keydown="validateName($event)" maxlength="45" required>
                            </div>
                        </div> 
                        <div class="col-md-6 col-sm-12">
                        <div class="input-group">
                                <label for="tel-input">{{ $t("complete_registration.phone") }}</label>
                                <div class="rabsystems-input">
                                    <div class="flag-input">
                                        <div class="current-flag-container"></div>
                                        <div class="flag-list"></div>
                                    </div>
                                    <input type="tel" name="tel" id="tel-input" required>
                                </div>
                            </div>
                        </div> 
                        <div class="col-md-6 col-sm-12">
                            <div class="input-group">
                                <label for="cpf">{{ $t("complete_registration.identification_number") }}</label>
                                <input type="text" name="cpf" id="cpf" v-on:keydown="validateCpfInput($event)" v-on:focusout="formatCpf($event)" v-on:keyup="restoreCpf($event)">
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12">
                            <div class="input-group">
                                <label for="street">{{ $t("complete_registration.street") }}</label>
                                <input type="text" name="street" id="street" required>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12">
                            <div class="input-group">
                                <label for="number">{{ $t("complete_registration.house_number") }}</label>
                                <input type="number" name="number" id="number" required>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12">
                            <div class="input-group">
                                <label for="complement">{{ $t("complete_registration.complement") }}</label>
                                <input type="text" name="complement" id="complement" required>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12">
                            <div class="input-group">
                                <label for="cep">{{ $t("complete_registration.zip_code") }}</label>
                                <input type="number" name="cep" id="cep" v-on:keydown="validaCep($event)" required>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12">
                            <div class="input-group">
                                <label for="district">{{ $t("complete_registration.district") }}</label>
                                <input type="text" name="district" id="district" required>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12">
                            <div class="input-group">
                                <label for="city">{{ $t("complete_registration.city") }}</label>
                                <input type="text" name="city" id="city" required>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12" v-if="$i18n.locale != 'pt'">
                            <div class="input-group">
                                <label for="country">{{ $t("complete_registration.state") }}</label>
                                <input type="text" name="state" id="state" required>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12" v-if="$i18n.locale == 'pt'">
                            <div class="input-group">
                                <label for="state">{{ $t("complete_registration.state") }}</label>
                                <select name="state" id="state" required>
                                    <option value="">----</option>
                                    <option value="AC">Acre</option>
                                    <option value="AL">Alagoas</option>
                                    <option value="AP">Amapá</option>
                                    <option value="AM">Amazonas</option>
                                    <option value="BA">Bahia</option>
                                    <option value="CE">Ceará</option>
                                    <option value="ES">Espírito Santo</option>
                                    <option value="GO">Goiás</option>
                                    <option value="MA">Maranhão</option>
                                    <option value="MT">Mato Grosso</option>
                                    <option value="MS">Mato Grosso do Sul</option>
                                    <option value="MG">Minas Gerais</option>
                                    <option value="PA">Pará</option>
                                    <option value="PB">Paraíba</option>
                                    <option value="PR">Paraná</option>
                                    <option value="PE">Pernambuco</option>
                                    <option value="PI">Piauí</option>
                                    <option value="RJ">Rio de Janeiro</option>
                                    <option value="RN">Rio Grande do Norte</option>
                                    <option value="RS">Rio Grande do Sul</option>
                                    <option value="RO">Rondônia</option>
                                    <option value="RR">Roraima</option>
                                    <option value="SC">Santa Catarina</option>
                                    <option value="SP">São Paulo</option>
                                    <option value="SE">Sergipe</option>
                                    <option value="TO">Tocantins</option>
                                    <option value="DF">Distrito Federal</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12">
                            <div class="input-group">
                                <label for="country">{{ $t("complete_registration.country") }}</label>
                                <input type="text" name="country" id="country" required>
                            </div>
                        </div>
                    </div>
                    <input type="submit" :value="$t('complete_registration.complete_registration_button')">
                </form>
                <div class="response"></div>
                <div class="loading"></div>
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
    name: "complete_registration",
    mixins: [globalMethods],
    methods: {
        complete_registration: function () {
            let self = this;

            $(".response").html("").removeClass("error");
            $(".loading").show();

            if ($("#tel-input").attr("is_valid") == "true") {
                let data = $("#complete-registration-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                    obj[item.name] = item.value;
                    return obj;
                }, {});

                data["tel"] = self.getTelInputValue();
                self.disableInputs();

                api.patch("/user/complete_registration", data, {
                    headers: {
                            Authorization: "Bearer " + self.getJwtInLocalStorage()
                        }
                })
                .then(function(){
                    $("#submit").attr("disabled", false);
                    $(".loading").hide();
                    self.enableInputs();
                    self.refreshJwt();
                    self.$router.push('/my-orders');
                }).catch(function(error){
                    if (error) {
                        $("#submit").attr("disabled", false);
                        self.message = this.$i18n.t("complete_registration.error_completing_registration");
                        self.responseClass = "error";
                    }
                })
            } else {
                $(".loading").hide();
                $(".response").html(this.$i18n.t("complete_registration.check_fields")).addClass("error");
            }
        },
        enableInputs: function () {
            $(".input-group input").attr("disabled", false);
            $(".input-group select").attr("disabled", false);
        }
    },
    components: {
        hexBackground
    }
}
</script>

<style scoped>
    form {
        width: 100%;
        margin: 1rem 0;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .loading {
        position: absolute;
        bottom: 6px;
    }

    .glass-container h1 {
        font-size: 1.6rem;
        margin-bottom: 1rem;
    }

    .input-group {
        width: 95%;
        height: 40px;
        margin: 1rem auto;
    }

    .input {
        width: 100%;
        height: 100%;
        border-radius: 7px;
        border: 1px solid var(--gray-high);
        padding: .3rem 1rem;
        font-size: 1.2rem;
    }

    .logout-icon {
        position: absolute;
        top: -10vh;
        right: 0;
        font-size: 2rem;
        cursor: pointer;
    }

    input[type="submit"] {
        width: 95%;
        margin: 2rem 0 0 14px;
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
        .complete-registration-container {
            width: 80vw;
        }
    }

    @media (max-width: 435px) {
        .complete-registration {
            background-size: 200px;
        }

        .complete-registration-container {
            width: 92vw;
        }

        .input, input[type="submit"] {
            font-size: 1rem;
        }

        .complete-registration {
            background-image: url('../assets/img/icone.png');
            background-size: 50px;
        }
    }
</style>