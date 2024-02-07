<template>
    <section class="profile" v-on:click="hideDetailsContainer($event)">
        <div class="page-title">
            <h1 class="rabsystems-font">{{ $t("my_profile.my_profile") }}</h1>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-12">
                <aside class="profile-container">
                    <div class="row">
                        <div class="col-lg-12 col-6 user-image">
                            <img :src="$root.user.profile_photo" class="profile-image" v-on:click="showDetailsContainer()">
                            <div class="photo-change-details">
                                <ul>
                                    <li v-on:click="viewPhoto()" class="view-photo" v-if="!defaultPhoto">{{ $t("my_profile.see_photo") }}</li>
                                    <li v-on:click="showSendPhotoContainer()">{{ $t("my_profile.send_picture") }}</li>
                                    <li v-on:click="excludePhoto()" class="view-photo" v-if="!defaultPhoto">{{ $t("my_profile.delete_photo") }}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-lg-12 col-6">
                            <h1>{{ $root.user.name }}</h1>
                            <button v-on:click="changeProfileFunc()" id="change-profile">{{ $t("my_profile.edit_profile") }}</button>
                            <div class="action-buttons">
                                <button v-on:click="cancelChangeProfile()" id="close-change-profile" class="close-change-profile">
                                    <i class="fas fa-times"></i>
                                </button>
                                <button v-on:click="submitButton()" id="save-change-profile" class="save-change-profile">
                                    <i class="fas fa-check"></i>
                                </button>
                                <div class="loading"></div>
                            </div>
                            <div class="response">{{ response }}</div>
                        </div>
                    </div>
                </aside>
            </div>
            <div class="col-lg-8 col-md-12">
                <div class="form-container">
                    <form action="change-profile">
                        <div class="row">
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="name">{{ $t("my_profile.name") }}</label>
                                    <input type="text" name="name" id="name" v-on:keydown="validateName($event)" v-model="$root.user.name" maxlength="45" required>
                                </div>
                            </div> 
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                <label for="tel-input">{{ $t("my_profile.phone") }}</label>
                                <div class="rabsystems-input">
                                    <div class="flag-input">
                                        <div class="current-flag-container"></div>
                                        <div class="flag-list"></div>
                                    </div>
                                    <input type="tel" name="tel" id="tel-input" v-model="$root.user.tel" required>
                                </div>
                            </div>
                            </div> 
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="cpf">{{ $t("my_profile.identification_number") }}</label>
                                    <input type="text" name="cpf" id="cpf" v-on:keydown="validateCpfInput($event)" v-on:focusout="formatCpf($event)" v-on:keyup="restoreCpf($event)" v-model="$root.user.cpf">
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="street">{{ $t("my_profile.street") }}</label>
                                    <input type="text" name="street" id="street" v-model="$root.user.street" required>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="number">{{ $t("my_profile.house_number") }}</label>
                                    <input type="number" name="number" id="number" v-model="$root.user.number" required>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="complement">{{ $t("my_profile.complement") }}</label>
                                    <input type="text" name="complement" id="complement" v-model="$root.user.complement" required>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="cep">{{ $t("my_profile.zip_code") }}</label>
                                    <input type="number" name="cep" id="cep" v-on:keydown="validaCep($event)" v-model="$root.user.cep" required>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="district">{{ $t("my_profile.district") }}</label>
                                    <input type="text" name="district" id="district" v-model="$root.user.district" required>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="city">{{ $t("my_profile.city") }}</label>
                                    <input type="text" name="city" id="city" v-model="$root.user.city" required>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12" v-if="$i18n.locale != 'pt'">
                                <div class="input-group">
                                    <label for="country">{{ $t("my_profile.state") }}</label>
                                    <input type="text" name="state" id="state" v-model="$root.user.state" required>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12" v-if="$i18n.locale == 'pt'">
                                <div class="input-group">
                                    <label for="state">{{ $t("my_profile.state") }}</label>
                                    <select name="state" id="state" v-model="$root.user.state" required>
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
                                    <label for="country">{{ $t("my_profile.country") }}</label>
                                    <input type="text" name="country" id="country" v-model="$root.user.country" required>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="country">{{ $t("my_profile.language") }}</label>
                                    <select name="language" id="language" v-model="$root.user.language" required>
                                        <option value="">-- {{ $t("my_profile.language") }} --</option>
                                        <option value="pt">{{ $t("my_profile.portuguese") }}</option>
                                        <option value="en">{{ $t("my_profile.english") }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="view-photo-container">
            <i class="fas fa-times" v-on:click="closePhotoContainer()"></i>
            <img :src="$root.user.profile_photo">
        </div>
        <modal v-if="showModal" :title="modalTitle" buttonTitle="" button2Title="" @closeModal="closeThisModal()" @submitEvent="submitFunction()">
            <sendPhotoModalContent @success="hideSendPhotoContainer()" sendType="user_photo" />
        </modal>
        <div class="overlay" v-on:click="closePhotoContainer()"></div>
    </section>
</template>

<script>
import $ from 'jquery';
import { globalMethods } from '../js/globalMethods';
import api from '../configs/api.js';
import modal from "./modal.vue";
import sendPhotoModalContent from "./sendPhotoModalContent.vue";

export default {
    name: "profile",
    mixins: [globalMethods],
    components: {
        modal,
        sendPhotoModalContent
    },
    data() {
        return {
            changeProfile: false,
            defaultPhoto: false,
            response: null,
            showModal: false,
            modalTitle: ""
        }
    },
    watch: {
        showModal: function () {
            if (this.showModal) {
                this.showDetailsContainer();
            } else {
                this.hideDetailsContainer();
            }
        }
    },
    methods: {
        isDefaultPhoto: function (url) {
            if (url.indexOf("/public/") != -1) {
                if ($(".view-photo").length) {
                    $(".view-photo").hide();
                }
            }
        },
        enableInputs: function () {
            let self = this;

            self.changeProfile = true;
            $(".input-group input").attr("disabled", false);
            $(".input-group select").attr("disabled", false);
        },
        changeProfileFunc: function () {
            let self = this;
            let editButton = $("#change-profile");
            let closeButton = $("#close-change-profile");
            let saveButton = $("#save-change-profile");

            editButton.attr("disabled", "disabled").css("opacity", 0);

            setTimeout(() => {
                editButton.hide();
                closeButton.css("display", "flex");
                saveButton.css("display", "flex");

                setTimeout(() => {
                    closeButton.css("opacity", 1);
                    saveButton.css("opacity", 1);

                    self.enableInputs();
                }, 10);
            }, 400);
        },
        cancelChangeProfile: function () {
            let self = this;
            let editButton = $("#change-profile");
            let closeButton = $("#close-change-profile");
            let saveButton = $("#save-change-profile");

            closeButton.css("opacity", 0);
            saveButton.css("opacity", 0);

            setTimeout(() => {
                closeButton.hide();
                saveButton.hide();
                editButton.show();

                setTimeout(() => {
                    editButton.attr("disabled", false).css("opacity", 1);
                    self.disableInputs();
                }, 10);
            }, 400);
        },
        submitButton: function () {
            let self = this;

            self.reloadInputs(false);
            self.response = "";

            setTimeout(() => {
                let data = $("form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                    obj[item.name] = item.value;
                    return obj;
                }, {});

                data["tel"] = self.getTelInputValue();

                let empty = false;
                for (let i in data) {
                    if (data[i] == "" && i != "cpf") {
                        empty = true;
                        self.response = "Não pode haver campos vazios!";
                    }
                }
                
                if (!empty) {
                    if ($("#tel-input").attr("is_valid") == "true") {
                        let jwt = "Bearer " + self.getJwtInLocalStorage();

                        $(".loading").show();
                        
                        api.patch("/user/update_user", data, {
                            headers: {
                                    Authorization: jwt
                                }
                        })
                        .then(function(){
                            console.log("Updated user in " + new Date());
                            self.reloadInputs(true);
                        }).catch(function(error){
                            console.log(error);
                        }).then(function () {
                            self.setNewLanguage(data["language"]);
                            self.cancelChangeProfile();
                            $(".loading").hide();
                        })
                    } else {
                        self.response = "Verifique os campos!";
                    }
                }
            }, 30);
        },
        reloadInputs: function (disable) {
            $("#cpf").focus();
            setTimeout(() => {
                $("#cpf").blur();
                setTimeout(() => {
                    $("#tel-input").focus();
                    setTimeout(() => {
                        $("#tel-input").blur();
                        if (disable) {
                            this.disableInputs();
                        }
                    }, 10);
                }, 10);
            }, 10);
        },
        showDetailsContainer: function () {
            if ($(".photo-change-details").is(":visible")) {
                $(".photo-change-details").css("opacity", 0);
                setTimeout(() => {
                    $(".photo-change-details").hide();
                }, 400);
            } else {
                $(".photo-change-details").show();
                setTimeout(() => {
                    $(".photo-change-details").css("opacity", 1);
                }, 10);
            }
        },
        hideDetailsContainer: function (event) {
            if (event.target.nodeName != "IMG" && event.target.nodeName != "LI") {
                $(".photo-change-details").css("opacity", 0);
                setTimeout(() => {
                    $(".photo-change-details").hide();
                }, 400);
            }
        },
        showSendPhotoContainer: function () {
            this.showModal = true;
            this.fillModalVariables(this.$i18n.t("my_profile.send_picture"), "", "");
        },
        checkDefaultPhoto: function () {
            let profile_photo = this.$root.user.profile_photo;
            let is_default = false;
            if (profile_photo.indexOf("/public/default-user-image.png") != -1) {
                is_default = true;
            }
            this.defaultPhoto = is_default;
        },
    },
    mounted() {
        this.checkDefaultPhoto();
        this.reloadInputs(true);
    }
}
</script>

<style scoped>
    .profile {
        width: calc(100% - 225px);
        height: 100%;
        padding: 1rem;
        text-align: center;
        background: var(--white);
        position: absolute;
        right: 0;
    }

    @media (max-width: 991px) {
        .profile-container {
            border-right: none !important;
            margin-bottom: 1rem;
        }

            .profile-container button {
                margin-top: 0 !important;
            }
    }

    @media (max-width: 876px) {
        .profile {
            width: 100%;
        }

        .profile-container {
            border-right: none;
            margin-bottom: 1rem;
        }

            .profile-container button {
                margin-top: 0 !important;
            }
    }

    .user-image {
        position: relative;
    }

    .photo-change-details {
        position: absolute;
        width: 120px;
        top: 103%;
        left: 0;
        right: 0;
        margin: auto;
        padding: .4rem;
        background: var(--white);
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        z-index: 2;
        opacity: 0;
        display: none;
        transition: all 0.4s;
    }

        .photo-change-details ul {
            list-style: none;
            margin: 0;
        }

            .photo-change-details ul li {
                cursor: pointer;
                padding: 4px;
            }

                .photo-change-details ul li:hover {
                    background: var(--gray-high);
                }

    .profile-container {
        border-right: 1px solid var(--gray-high);
        height: 100%;
    }

        .profile-container h1 {
            margin-top: 1rem;
            font-size: 1.7rem;
            font-weight: 500;
        }

        .profile-container p {
            font-size: 1rem;
        }

        .profile-container button {
            margin-top: 2rem;
            padding: .3rem 1rem;
            font-size: 1.1rem;
            border-radius: 7px;
            display: flex;
            margin: auto;
            border: none;
            background: var(--blue);
            color: var(--white);
            cursor: pointer;
            transition: all 0.4s;
        }

            .profile-container button:hover {
                background: var(--blue-low);
            }

    .profile-image {
        width: 200px;
        height: 200px;
        object-fit: cover;
        border-radius: 50%;
        cursor: pointer;
    }

    button.close-change-profile {
        background: var(--gray-high-3);
        /*display: flex;*/
        display: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        margin: auto;
        cursor: pointer;
        font-size: 1.2rem;
        color: var(--red);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        opacity: 0;
    }

        button.close-change-profile i{
            transition: font-size 0.4s;
        }

        button.close-change-profile:hover {
            background: var(--gray-high-2);
            box-shadow: 0 0 7px rgba(0, 0, 0, 0.1);
        }

        button.close-change-profile:hover i {
            font-size: 1.3rem;
        }

    button.save-change-profile {
        background: var(--green);
        /*display: flex;*/
        display: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        margin: auto;
        cursor: pointer;
        font-size: 1.2rem;
        color: var(--white);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    }

        button.save-change-profile i{
            transition: font-size 0.4s;
        }

        button.save-change-profile:hover {
            background: var(--green-low);
            box-shadow: 0 0 7px rgba(0, 0, 0, 0.1);
        }

        button.save-change-profile:hover i {
            font-size: 1.3rem;
        }

    .action-buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 200px;
        margin: auto;
        position: relative;
    }

    .action-buttons .loading {
        position: absolute;
        bottom: -100%;
        left: 0;
        right: 0;
        margin: auto;
    }

    @media (max-width: 540px) {
        .profile-image {
            width: 120px;
            height: 120px;
        }

        .profile-container h1 {
            margin-top: 0;
            font-size: 1.3rem;
        }

        .profile-container button {
            font-size: 1rem;
        }
    }

    @media (max-width: 342px) {
        .profile-image {
            width: 100px;
            height: 100px;
        }

        .profile-container h1 {
            margin-top: 0;
        }
    }

    .input-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 1rem;
        width: auto !important;
    }

    .form-container {
        overflow: hidden;
    }

    form {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        overflow-y: scroll;
        overflow-x: hidden;
        max-height: 500px;
        height: calc(40vh + 5vw);
    }
</style>