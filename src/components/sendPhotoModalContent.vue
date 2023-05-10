<template>
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
                <button type="button" id="send-photo-button" class="save-button">{{ $t("my_profile.send_picture") }}</button>
            </form>
        </div>
        <div class="response font-small">{{ modalResponse }}</div>
        <div class="photo-preview">
            <img class="image-preview" :alt="$t('my_profile.photo_preview')">
        </div>
        <button>{{ $t("my_profile.delete_photo") }}</button>
        <div class="loading"></div>
    </div>
</template>
<script>
import $ from 'jquery';
import { globalMethods } from '../js/globalMethods';
import api from '../configs/api.js';

export default {
    name: "sendPhotoModalContent",
    mixins: [globalMethods],
    props: ["sendType", "sendId"],
    data() {
        return {
            modalResponse: null
        }
    },
    methods: {
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
                self.modalResponse = this.$i18n.t("my_profile.unsupported_file_type");
            }
        },
        uploadPhoto: function (formData) {
            let self = this;

            if (this.sendType != "time_machine_photo") {
                self.excludePhoto(true);
            }

            self.modalResponse = "";
            $(".loading").show();

            let patch;

            if (this.sendType == "user_photo") {
                patch = "/user/change_photo";
            } else if (this.sendType == "time_machine_photo") {
                patch = "/utils/time_machine_send_photo";
            }

            api.patch(patch, formData)
            .then(function(response){
                let id = "";
                if (response.data.obj.image.id != undefined) {
                    id = response.data.obj.image
                }
                self.$emit("success", id);
                $(".loading").hide();
                if (self.sendType != "time_machine_photo") {
                    self.$router.go();
                }
            }).catch(function(error){
                self.modalResponse = self.$i18n.t("my_profile.file_too_large");
                console.log(error);
            })
        }
    }
}
</script>
<style scoped>
    .upload {
        height: 100%;
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
</style>