<template>
    <div class="time-machine">
        <div class="page-title">
            <h1 class="rabsystems-font">Máquina do tempo</h1>
        </div>
        <div class="send-container" v-if="showSend">
            <p class="presentation-text">Use esse utilitário para enviar uma mensagem sua para o seu eu do futuro, pode falar o quanto quiser e até enviar alguma imagem ou audio.</p>
            <div class="time-machine-container">
                <form @submit.prevent="sendMessageToFuture()">
                    <div class="input-group">
                        <label for="title">Título</label>
                        <input type="text" name="title" id="title" required maxlength="30">
                    </div>
                    <div class="input-group">
                        <label for="release-date">Data de lançamento</label>
                        <input type="date" name="release_date" id="release-date" required :min="tomorrow">
                    </div>
                    <div class="input-group">
                        <label for="description">Descrição</label>
                        <textarea name="description" id="description" cols="30" rows="10" required maxlength="5000"></textarea>
                    </div>
                    <div class="media">
                        <div class="images">
                            <p>Imagens</p>
                            <div class="inner">
                                <img v-for="(image, index) in images" v-bind:key="index" :src="image.source" v-on:click="viewPhoto(image.source)" />
                                <i class="fas fa-plus" v-on:click="showSendPhotoContainer()" title="Adicionar fotos"></i>
                            </div>
                        </div>
                        <div class="audios" v-if="false">
                            <p>Audios</p>
                            <div class="inner">
                                <audio v-for="(audio, index) in audios" v-bind:key="index" controls :src="audio.source"></audio>
                                <i class="fas fa-plus" v-on:click="uploadAudio()" title="Adicionar videos"></i>
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn primary">Enviar para o futuro</button>
                </form>
                <div class="view-photo-container">
                    <i class="fas fa-times" v-on:click="closePhotoContainer()"></i>
                    <img :src="preview_photo">
                </div>
                <modal v-if="showModal" :title="modalTitle" buttonTitle="" button2Title="" @closeModal="closeThisModal()" @submitEvent="submitFunction()">
                    <sendPhotoModalContent @success="hideSendPhotoContainer(); storeUploadedImage($event)" sendType="time_machine_photo" />
                </modal>
                <div class="overlay" v-on:click="closePhotoContainer()"></div>
            </div>
        </div>
        <div class="view-container" v-if="showAll">
            <p>Mensagens do passado</p>
            <div class="past-messages">
                <div class="past-message" v-for="(message, index) in pastMessages" v-bind:key="index" :style="message.opened == 1 ? 'border: 1px solid var(--green)' : ''" v-on:click="openMessage(message)">
                    <p>{{ message.title }}</p>
                    <p v-if="message.opened == 0">Será aberta {{ returnRelativeDate(message.release_date) }}</p>
                    <p v-if="message.opened == 1">Mensagem aberta {{ returnRelativeDate(message.openDate) }}</p>
                </div>
            </div>
            <button type="button" v-on:click="showSendMessageContainer()" class="btn primary">Enviar uma mensagem para o futuro</button>
        </div>
        <div class="view-message" v-if="viewMessage">
            <div class="return">
                <i class="fas fa-chevron-left" v-on:click="returnToViewMessages()"></i>
            </div>
            <div class="message">
                <p>{{ messageToView.title }}</p>
                <p>{{ messageToView.description }}</p>
                <p>Enviada em {{ returnDate(messageToView.releaseDate) }}</p>
                <p v-if="messageToView.open_date != ''">Mensagem visualizada em {{ returnDate(messageToView.open_date) }}</p>
                <div class="message-images">
                    <img :src="image" v-for="(image, index) in messageToView.images" v-bind:key="index" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import modal from "./modal.vue";
import sendPhotoModalContent from "./sendPhotoModalContent.vue";
import { globalMethods } from '../js/globalMethods';
import $ from 'jquery';
import api from '../configs/api.js';
import moment from 'moment';

export default {
    name: "timeMachine",
    mixins: [globalMethods],
    components: {
        modal,
        sendPhotoModalContent
    },
    data() {
        return {
            showAll: true,
            viewMessage: false,
            messageToView: {},
            tomorrow: moment().add(1, 'day').format('YYYY-MM-DD'),
            pastMessages: [],
            showSend: false,
            showModal: false,
            modalTitle: "",
            preview_photo: "",
            audios: [],
            images: []
        }
    },
    methods: {
        returnToViewMessages: function () {
            this.resetContainers();
            this.showAll = true;
        },
        resetContainers: function () {
            this.showSend = false;
            this.showAll = false;
            this.viewMessage = false;   
        },
        postViewMessage: function (id) {
            let data = {
                id: id
            }
            api.patch("/utils/time_machine_view_message", data)
            .then((response) => {
                console.log(response.data)
            })
        },
        openMessage: function (message) {
            let now = moment();
            let messageReleaseDate = moment(message.release_date);
            
            if (now.isSameOrAfter(messageReleaseDate, 'day')) {
                this.resetContainers();
                this.messageToView = message;
                this.viewMessage = true;

                this.postViewMessage(message.id);
            } else {
                return;
            }
        },
        showSendMessageContainer: function () {
            this.resetContainers();
            this.showSend = true;
        },
        returnPastMessages: function () {
            let self = this;

            api.get("/utils/return_past_messages")
            .then((response) => {
                self.pastMessages = response.data.obj.messages;
            })
        },
        returnDate: function (releaseDate) {
            let date = moment(releaseDate).format("DD/MM/YYYY");
            return date;
        },
        returnRelativeDate: function (releaseDate) {
            let date = moment(releaseDate);
            return date.fromNow();
        },
        storeUploadedImage: function (image) {
            this.images.push(image);
        },
        showSendPhotoContainer: function () {
            this.showModal = true;
            this.fillModalVariables("Enviar foto", "", "");
        },
        sendMessageToFuture: function () {
            let self = this;
            let data = $("form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});
            data["images"] = this.images;

            api.post("/utils/time_machine_send_message", data)
            .then((response) => {
                console.log(response.data)
                self.resetContainers();
                self.showAll = true;
            })
        }
    },
    mounted: function () {
        this.returnPastMessages();
    }
}
</script>
<style scoped>
.time-machine {
        width: calc(100% - 225px);
        height: 95%;
        padding: 1rem;
        text-align: center;
        background: var(--white);
        position: absolute;
        right: 0;
        overflow-x: hidden;
    }

    @media (max-width: 876px) {
        .time-machine {
            width: 100%;
        }
    }

.presentation-text {
    font-size: 20px;
}

.input-group {
    width: 100%;
    margin: .5rem 0;
}

.images img {
    width: 200px;
    border-radius: 7px;
    cursor: pointer;
}

.media > div {
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
}

.media p {
    font-size: 20px;
    font-weight: 500;
    text-align: left;
    margin-bottom: .5rem;
}

.inner {
    display: flex;
    align-items: center;
    overflow-x: auto;
}

.inner img, .inner audio {
    margin: 0 .5rem;
}

.inner audio {
    min-width: 250px;
}

.inner i {
    font-size: 40px;
    margin-left: 2rem;
    cursor: pointer;
}

.view-container {
    text-align: left;
    margin-top: 2rem;
}

    .view-container > p {
        font-size: 23px;
        font-weight: 500;
    }

.past-messages {
    display: flex;
    align-items: center;
    overflow-x: auto;
}

.past-message {
    margin: 10px;
    border: 1px solid var(--gray-high);
    min-width: 160px;
    background: var(--gray-high-3);
    border-radius: 7px;
    padding: 10px;
    cursor: pointer;
    margin-bottom: 2rem;
}

    .past-message p:first-child {
        font-size: 20px;
        font-weight: 500;
    }

    .past-message p:nth-child(3) {
        color: var(--green);
    }

.return {
    display: flex;
}

    .return i {
        font-size: 30px;
        cursor: pointer;
    }

.message p:first-child {
    font-size: 30px;
    font-weight: 500;
}

.message p:nth-child(2) {
    font-size: 20px;
    font-style: italic;
}
.message p:nth-child(3) {
    margin-top: 3rem;
    font-size: 19px;
    font-weight: bold;
}

.message-images img {
    border-radius: 10px;
    margin: 10px;
}
</style>