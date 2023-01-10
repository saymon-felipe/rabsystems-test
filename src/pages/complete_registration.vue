<template>
    <section class="complete-registration">
        <div class="complete-registration-container">
            <i class="fas fa-power-off logout-icon" v-on:click="logoutUser()"></i>
            <h1 class="rabsystems-font">COMPLETE O CADASTRO</h1>
            <form id="complete-registration-form" @submit.prevent="complete_registration()">
                <div class="row">
                    <div class="col-md-6 col-sm-12">
                        <div class="input-group">
                            <label for="name">Nome</label>
                            <input type="text" name="name" id="name" v-on:keydown="validateName($event)" maxlength="30" required>
                        </div>
                    </div> 
                    <div class="col-md-6 col-sm-12">
                    <div class="input-group">
                            <label for="tel-input">Telefone</label>
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
                            <label for="cpf">Cpf</label>
                            <input type="text" name="cpf" id="cpf" v-on:keydown="validateCpfInput($event)" v-on:focusout="formatCpf($event)" v-on:keyup="restoreCpf($event)" required>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="input-group">
                            <label for="street">Rua</label>
                            <input type="text" name="street" id="street" required>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="input-group">
                            <label for="number">Numero</label>
                            <input type="number" name="number" id="number" required>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="input-group">
                            <label for="complement">Complemento</label>
                            <input type="text" name="complement" id="complement" required>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="input-group">
                            <label for="cep">Cep</label>
                            <input type="number" name="cep" id="cep" v-on:keydown="validaCep($event)" required>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="input-group">
                            <label for="district">Bairro</label>
                            <input type="text" name="district" id="district" required>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="input-group">
                            <label for="city">Cidade</label>
                            <input type="text" name="city" id="city" required>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="input-group">
                            <label for="state">Estado</label>
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
                            <label for="country">País</label>
                            <input type="text" name="country" id="country" value="Brasil" required>
                        </div>
                    </div>
                </div>
                <input type="submit" value="COMPLETAR REGISTRO">
            </form>
            <div class="response"></div>
            <div class="loading"></div>
        </div>
    </section>
</template>

<script>
import $ from 'jquery';
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "complete_registration",
    mixins: [globalMethods],
    methods: {
        getTelInputValue: function() { // Pega o valor do input removendo caracteres especiais e espaço para submit do formulário.
            let ddi = $(".current-flag-container .flag-item").attr("ddi"), number = $("#tel-input").val().replace("(", "").replace(")", "").replace("-", "").replace(" ", '').replace(" ", '');

            if (number == "") {
                return;
            }

            return `${ddi}${number}`;
        },
        complete_registration: function () {
            let self = this;

            $(".response").html("").removeClass("error");
            $(".loading").show();

            if ($("#tel-input").attr("is_valid") == "true" && $("#cpf").val().length == 14) {
                let data = $("#complete-registration-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                    obj[item.name] = item.value;
                    return obj;
                }, {});

                data["tel"] = self.getTelInputValue();
                data["cpf"] = self.getCpf();
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
                    self.$router.push('/my-orders');
                }).catch(function(error){
                    if (error) {
                        $("#submit").attr("disabled", false);
                        self.message = "Erro ao completar o cadastro";
                        self.responseClass = "error";
                    }
                })
            } else {
                $(".loading").hide();
                $(".response").html("Verifique os campos!").addClass("error");
            }

            
        },
        validaCep: function (event) {
            let target = $("#" + event.target.id), keycode = event.keyCode;

            if (!(keycode == 8 || keycode == 46)) {
                if (target.val().length >= 8) {
                    event.preventDefault();
                    return;
                }
            }           
        },
        formatCpf: function (event) {
            let target = $("#" + event.target.id), newValue = "";

            target.removeClass("invalid-number");

            if (target.val().length == 11) {
                for (let i in target.val()) {
                    if (i == 3 || i == 6) {
                        newValue += "." + target.val()[i];
                    } else if (i == 9) {
                        newValue += "-" + target.val()[i];
                    } else {
                        newValue += target.val()[i];
                    }
                }

                target.val(newValue);
                return;
            }

            if (target.val().length < 14) {
                target.addClass("invalid-number");
            }
            
        },
        restoreCpf: function (event) {
            let target = $("#" + event.target.id);

            if (target.val().length < 14) {
                target.val(target.val().replace(".", "").replace(".", "").replace("-", ""));
            }
        },
        getCpf: function () {
            let cpf = $("#cpf").val()
            return cpf.replace(".", "").replace(".", "").replace("-", "");
        },
        validateCpfInput: function (event) {
            let target = $("#" + event.target.id), keycode = event.keyCode;

            if (!(keycode == 8 || keycode == 46)) {
                if (target.val().length < 11) {
                    if (!(keycode >= 48 && keycode <= 57 || keycode >= 96 && keycode <= 105)) {
                        event.preventDefault();
                        return;
                    }
                } else {
                    event.preventDefault();
                    return;
                }
            }
        },
        validateName: function (event) {
            let keycode = event.keyCode;

            if (keycode >= 48 && keycode <= 57 || keycode >= 96 && keycode <= 105) {
                event.preventDefault();
                return;
            }
        },
        disableInputs: function () {
            $(".input-group input").attr("disabled", "disabled");
            $(".input-group select").attr("disabled", "disabled");
        },
        enableInputs: function () {
            $(".input-group input").attr("disabled", false);
            $(".input-group select").attr("disabled", false);
        }
    }
}
</script>

<style scoped>
    .complete-registration {
        width: 100vw;
        height: 100vh;
        background: var(--white);
        background-image: url('../assets/img/logo-completa.png');
        background-repeat: no-repeat;
        background-size: 200px;
        background-position-x: center;
        background-position-y: 1rem;
    }

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

    .complete-registration-container {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 50vw;
        max-width: 700px;
        height: 70vh;
        max-height: 900px;
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

        .complete-registration-container h1 {
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