<template>
    <section class="profile" v-on:click="hideDetailsContainer($event)">
        <div class="page-title">
            <h1 class="rabsystems-font">Meu perfil</h1>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-12">
                <aside class="profile-container">
                    <div class="row">
                        <div class="col-lg-12 col-6 user-image">
                            <img :src="$root.user.profile_photo" class="profile-image" v-on:click="showDetailsContainer()">
                            <div class="photo-change-details">
                                <ul>
                                    <li v-on:click="viewPhoto()" class="view-photo" v-if="!defaultPhoto">Ver foto</li>
                                    <li v-on:click="showSendPhotoContainer()">Enviar foto</li>
                                    <li v-on:click="excludePhoto()" class="view-photo" v-if="!defaultPhoto">Excluir foto</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-lg-12 col-6">
                            <h1>{{ $root.user.name }}</h1>
                            <button v-on:click="changeProfileFunc()" id="change-profile">Editar perfil</button>
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
                                    <label for="name">Nome</label>
                                    <input type="text" name="name" id="name" v-on:keydown="validateName($event)" v-model="$root.user.name" maxlength="30" required>
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
                                    <input type="tel" name="tel" id="tel-input" v-model="$root.user.tel" required>
                                </div>
                            </div>
                            </div> 
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="cpf">Cpf</label>
                                    <input type="text" name="cpf" id="cpf" v-on:keydown="validateCpfInput($event)" v-on:focusout="formatCpf($event)" v-on:keyup="restoreCpf($event)" v-model="$root.user.cpf" required>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="street">Rua</label>
                                    <input type="text" name="street" id="street" v-model="$root.user.street" required>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="number">Numero</label>
                                    <input type="number" name="number" id="number" v-model="$root.user.number" required>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="complement">Complemento</label>
                                    <input type="text" name="complement" id="complement" v-model="$root.user.complement" required>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="cep">Cep</label>
                                    <input type="number" name="cep" id="cep" v-on:keydown="validaCep($event)" v-model="$root.user.cep" required>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="district">Bairro</label>
                                    <input type="text" name="district" id="district" v-model="$root.user.district" required>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="city">Cidade</label>
                                    <input type="text" name="city" id="city" v-model="$root.user.city" required>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="input-group">
                                    <label for="state">Estado</label>
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
                                    <label for="country">País</label>
                                    <input type="text" name="country" id="country" v-model="$root.user.country" required>
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
        <div class="upload">
            <div class="send">
                <form class="send-photo" method="post" enctype="multipart/form-data">
                    <div class="input-file-custom">
                        <label for="photo" id="upload-button">
                            <i class="fas fa-cloud-upload-alt"></i>
                            Upload
                        </label>
                        <span>JPG, PNG</span>
                    </div>
                    <h6 class="file-name"></h6>
                    <input type="file" name="photo" id="photo" @change.prevent="sendPhoto($event)" title="Envie uma foto nos formatos PNG ou JPG">
                    <button type="button" id="send-photo-button" class="save-button">Enviar foto</button>
                </form>
            </div>
            <div class="response font-small">{{ modalResponse }}</div>
            <div class="photo-preview">
                <img class="image-preview" alt="Pré visualização da foto">
            </div>
            <button>Remover foto</button>
            <div class="loading"></div>
        </div>
        <div class="overlay" v-on:click="closePhotoContainer(); hideSendPhotoContainer()"></div>
    </section>
</template>

<script>
import $ from 'jquery';
import { globalMethods } from '../js/globalMethods';
import api from '../configs/api.js';

export default {
    name: "profile",
    mixins: [globalMethods],
    data() {
        return {
            changeProfile: false,
            defaultPhoto: false,
            response: null,
            modalResponse: null
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
        getTelInputValue: function () { // Pega o valor do input removendo caracteres especiais e espaço para submit do formulário.
            let ddi = $(".current-flag-container .flag-item").attr("ddi");
            let number = $("#tel-input").val().replace("(", "").replace(")", "").replace("-", "").replace(" ", '').replace(" ", '');

            if (number == "") {
                return;
            }

            if (number.indexOf("+") != -1) {
                return `${number}`;
            }

            return `${ddi}${number}`;
        },
        validateCpfInput: function (event) {
            let target = $("#" + event.target.id);
            let keycode = event.keyCode;

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
        formatCpf: function (event) {
            let target = $("#" + event.target.id), newValue = "";

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
            }
        },
        restoreCpf: function (event) {
            let target = $("#" + event.target.id);

            if (target.val().length < 14) {
                target.val(target.val().replace(".", "").replace(".", "").replace("-", ""));
            }
        },
        disableInputs: function () {
            $(".input-group input").attr("disabled", "disabled");
            $(".input-group select").attr("disabled", "disabled");
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
                    setTimeout(() => {
                        location.reload();
                    }, 400);
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
                    if (data[i] == "") {
                        empty = true;
                        self.response = "Não pode haver campos vazios!";
                    }
                }
                if (!empty) {
                    if ($("#tel-input").attr("is_valid") == "true" && $("#cpf").val().length == 14) {
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
                            self.cancelChangeProfile();
                            $(".loading").hide();
                        })
                    } else {
                        self.response = "Verifique os campos!";
                    }
                }
            }, 30);
        },
        validaCep: function (event) {
            let target = $("#" + event.target.id);
            let keycode = event.keyCode;

            if (!(keycode == 8 || keycode == 46)) {
                if (target.val().length >= 8) {
                    event.preventDefault();
                    return;
                }
            }         
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
        viewPhoto: function () {
            $(".view-photo-container").css("display", "flex");
            setTimeout(() => {
                $(".overlay").show();
                $(".view-photo-container").css("opacity", 1).css("transform", "translateY(0)");
            }, 10);
        },
        closePhotoContainer: function () {
            $(".view-photo-container").css("opacity", 0).css("transform", "translateY(-100px)");
            
            setTimeout(() => {
                $(".overlay").hide();
                $(".view-photo-container").hide();
            }, 400);
        },
        showSendPhotoContainer: function () {
            $(".upload").show();

            setTimeout(() => {
                $(".upload").css("transform", "translateY(0)").css("opacity", 1);
            }, 10);
            
            $(".overlay").show();
        },
        resetPhotoInput: function () {
            $(".image-preview").attr("src", "");
            $(".photo-preview").css("display", "none");
            $('.file-name').html("").hide();
            $("#send-photo-button").hide();
            $("#photo").val("");
        },
        sendPhoto: function (event) {
            let formData = new FormData, self = this;

            $(".file-name").show();
            self.modalResponse = "";

            let filePath = $("#photo").val(); // Busca o nome o nome do arquivo e o exibe.
            let fileSplited = filePath.split('\\');
            let fileName = fileSplited[fileSplited.length - 1];
            $('.file-name').html(fileName);

            let file = event.target.files.item(0);

            if (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png") { // Se o arquivo tiver um desses formatos (PNG, JPG E JPEG), a imagem é exibida no modal e é permitida a requisição para o servidor, se não aparece a mensagem (arquivo não suportado).
                let adress = new FileReader();

                $("#send-photo-button").show();
                formData.set("user_imagem", file);
                adress.readAsDataURL(file);
                adress.onloadend = () => {
                    $(".image-preview").attr("src", adress.result);
                    $(".photo-preview").css("display", "flex");
                };

                $("#send-photo-button").on("click", () => {
                    self.uploadPhoto(formData); // Faz a requisição de upload de foto.
                });
            } else {
                $(".image-preview").attr("src", "");
                $(".photo-preview").css("display", "none");
                self.modalResponse = "Tipo de arquivo não suportado";
            }
        },
        uploadPhoto: function (formData) {
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();
            self.excludePhoto(true);

            self.modalResponse = "";
            $(".loading").show();

            api.patch("/user/change_photo", formData, {
                headers: {
                        Authorization: jwt
                    }
            })
            .then(function(){
                self.hideSendPhotoContainer();
                self.$router.go();
            }).catch(function(error){
                self.modalResponse = "Arquivo muito grande (limite 2mb)";
                console.log(error);
            }).then(function () {
                $(".loading").hide();
            })
        },
        hideSendPhotoContainer: function () {
            let self = this;
            $(".upload").css("transform", "translateY(-100px)").css("opacity", 0);
            
            setTimeout(() => {
                self.resetPhotoInput();
                $(".upload").hide();
                $(".overlay").hide();
            }, 400); 
        },
        excludePhoto: function (from_upload = false) {
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();

            api.patch("/user/exclude_photo", "", {
                headers: {
                        Authorization: jwt
                    }
            })
            .then(function(response){
                if (!from_upload) {
                    location.reload();
                } else {
                    self.response = response.data.message;
                }
            }).catch(function(error){
                console.log(error);
            })
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

    .view-photo-container, .upload {
        width: 80%;
        height: 90%;
        max-width: 800px;
        max-height: 600px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        background: var(--white);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        transition: all 0.4s;
        transform: translateY(-100px);
        opacity: 0;
        display: none;
        z-index: 4;
    }

        .view-photo-container i {
            align-self: flex-end;
            margin-bottom: 1rem;
            cursor: pointer;
        }

        .view-photo-container img {
            width: 100%;
            height: 100%;
            display: flex;
            object-fit: cover;
            border-radius: 10px;
        }

    @media (max-width: 600px) {
        .view-photo-container {
            width: 98%;
            justify-content: start;
            height: fit-content;
        }

        .view-photo-container img {
            height: 70%;
        }
    }

    @media (max-width: 390px) {
        .view-photo-container {
            margin-top: 0px;
        }
    }

    .send {
        display: flex;
        justify-content: center;
    }

    .send-photo {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: center;
        overflow: hidden;
        height: auto;
    }

    .upload button {
        display: none;
    }

    .input-file-custom {
        margin: 0 1rem;
    }

        .input-file-custom span {
            display: block;
            text-align: center;
        }

    #upload-button {
        background: var(--blue);
        color: white;
        border-radius: 5px;
        padding: 5px 20px;
        cursor: pointer;
    }

        #upload-button:hover {
            background: var(--blue-low);
        }

    .file-name {
        margin-right: 1rem;
        height: 34px;
        display: none;
        align-items: center;
        max-width: 15ch;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    input[type='file'] {
        display: none;
    }

    .save-button {
        padding: 5px 15px;
        text-align: center;
        background: var(--green);
        color: white;
        text-transform: uppercase;
        font-weight: 500;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

        .save-button:hover {
            background: var(--green-low);
        }

    .response {
        margin-top: 1rem;
        text-align: center;
        font-size: 1.3rem;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 2px;
        color: var(--red);
    }

    .font-small {
        font-size: .9rem!important;
    }

    .photo-preview {
        display: none;
        /*display: flex;*/
        align-items: center;
        justify-content: center;
        margin-top: 1rem;
        height: calc(100% - 130px);
        overflow: hidden;
    }

    .image-preview {
        width: 100%;
        max-height: 100%;
        border-radius: 10px;
        object-fit: contain;
    }

    .user-image {
        position: relative;
    }

    .photo-change-details {
        position: absolute;
        width: 120px;
        bottom: -45%;
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

    .page-title {
        margin: 1rem 0;
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