<template>
    <div class="support-chat">
        <div class="pending-chat-list">
            <div class="pending-user" v-for="user in pendingUsers" v-on:click="chatWith(user.uuid, user.name)">
                <span>{{ user.name }}</span>
                <div class="new_messages" v-if="user.new_messages"></div>
            </div>
        </div>
        <div class="chat-container">
            <div class="chat-header" v-if="init_chat && !ended2">
                <img src="https://rabsystems-api.herokuapp.com/public/default-user-image.png" class="avatar-pp">
                <div class="target-name">
                    {{ selectedTargetName }}
                </div>
                <button class="btn primary" v-on:click="closeChat()">Concluir suporte</button>
            </div>
            <div class="chat-body">
                <div class="connection-ended" v-if="ended && !ended2">
                    <p class="text-center" style="color: gray; font-size: 17px; margin-top: 2rem;">Conexão encerrada. Usuário desconectou!</p>
                </div>
                <div class="connection-ended" v-if="ended2 && !ended">
                    <p class="text-center" style="color: gray; font-size: 17px; margin-top: 2rem;">Atendimento encerrado!</p>
                </div>
                <div class="chat-init" v-if="!init_chat && !ended">
                    <div class="chat-init-text">
                        <p style="font-size: 1.7rem; font-weight: 600;">Central de mensagens</p>
                        <p>Usuários que estiverem aguardando conexão aparecerão na lista de usuarios</p>
                    </div>
                </div>
                <div class="chat-messages" v-if="init_chat && !ended">
                    <div class="message" v-for="(message, index) in messages" :key="index" :class="!message.uuid ? 'out' : 'in'">
                        <div class="message-header">
                            <div class="sender-name">{{ message.sender_name }}</div>
                            <div class="send-time">{{ returnRelativeTime(message.send_date) }}</div>
                        </div>
                        <div class="message-body">{{ message.message }}</div>
                    </div>
                </div>
                <div class="chat-input" v-if="init_chat && !ended">
                    <input type="text" name="message" id="send-message" v-model="input_message_value" placeholder="Digite uma mensagem" @keyup.enter="sendMessage()" :disabled="connecting">
                    <i class="fas fa-paper-plane" title="Enviar mensagem" v-on:click="sendMessage()"></i>
                </div>
            </div>
        </div>
        <audio src="../assets/audio/message_notification.ogg" id="message-audio" preload="auto"></audio>
    </div>
</template>
<script>
import { globalMethods } from '../js/globalMethods.js';
import moment from 'moment';
import api from "../configs/api.js";
import $ from 'jquery';

export default {
    name: "supportChat",
    mixins: [globalMethods],
    data() {
        return {
            ended: false,
            response: "",
            uuid: 'rs_support_master_key:4882',
            targetUuid: "",
            ws: null,
            input_message_value: "",
            sender_name: "",
            init_chat: false,
            ended2: false,
            messages: [],
            selectedTargetName: "",
            pendingUsers: []
        }
    },
    methods: {
        playNewMessageAudio: function () {
            let audioElement = $("#message-audio")[0];
            if (audioElement != undefined) {
                audioElement.play().catch(() => {});
            }
        },
        closeChat: function () {
            this.ended2 = true;
            this.ws.send(JSON.stringify({ type: "close", target_uuid: this.targetUuid }));
        },
        chatWith: function (uuid, name) {
            this.ended2 = false;
            this.targetUuid = uuid;
            this.ws.send(JSON.stringify({ type: 'connect', target_uuid: this.targetUuid }));
            this.selectedTargetName = name;
            this.init_chat = true;
            this.selectUser(uuid);
        },
        async connectToChat() {
            let replacedUrlApi = api.defaults.baseURL.replace("http://", "").replace("https://", "");
            let replacedWs = api.defaults.baseURL.indexOf("https") != -1 ? 'wss' : 'ws';

            this.ws = new WebSocket(replacedWs + '://' + replacedUrlApi + "?uuid=" + this.uuid + "&name=" + this.sender_name);

            this.ws.onopen = () => {
                this.connecting = false;
            };

            this.ws.onmessage = (event) => {
                let data = JSON.parse(event.data);

                if (data.type == "message") {
                    if (data.sender_uuid != this.targetUuid) {
                        this.markUserAsHavingNewMessages(data.sender_uuid);
                        this.playNewMessageAudio();
                    }
                    
                    if (data.sender_uuid == this.targetUuid) {
                        this.messages.push(data.message);
                    }                    
                } else if (data.type == "load_connections") {
                    this.pendingUsers = data.users.map(user => ({
                        ...user
                    }));
                    this.playNewMessageAudio();
                } else if (data.type == "load_messages") {
                    this.messages = data.messages;
                    setTimeout(() => {
                        $(".chat-messages").scrollTop(9999999999);
                    }, 10)
                } else if (data.type == "disconnected") {
                    this.ended = true;
                    this.$router.go();
                }
            };

            this.ws.onclose = () => {
                this.ended = true;
            };

            setInterval(() => {
                this.ws.send(JSON.stringify({ type: 'heartbeat' }));
            }, 25000);
        },
        selectUser(uuid) {
            const user = this.pendingUsers.find(user => user.uuid === uuid);
            if (user) {
                user.new_messages = false;
            }
        },
        markUserAsHavingNewMessages(uuid) {
            const user = this.pendingUsers.find(user => user.uuid === uuid);
            if (user) {
                user.new_messages = true;
            }
        },
        sendMessage: function () {
            let newMessage = {
                sender_name: "Rabsystems",
                send_date: moment(),
                sender: true,
                message: this.input_message_value
            }

            if (this.input_message_value.trim() != "" && this.ws) {
                this.messages.push(newMessage);
                this.input_message_value = "";
                this.ws.send(JSON.stringify({ type: "message", uuid: this.uuid, target_uuid: this.targetUuid, message: newMessage }));
                setTimeout(() => {
                    $(".chat-messages").scrollTop(9999999999);
                }, 10)
            }
        }
    },
    mounted: function () {
        this.connectToChat();
    },
    beforeUnmount() {
        this.ws.close();
    }
}
</script>
<style scoped>

.new_messages {
    width: 5px;
    height: 5px;
    background: red;
    border-radius: 50%;
    margin-left: 7px;
}

.chat-input input {
    padding-right: 45px !important;
}

.pending-chat-list {
    border: 1px solid var(--gray-high-2);
    border-radius: 10px;
}

.pending-user {
    white-space: nowrap;
    font-weight: 600;
    margin: 10px;
    cursor: pointer;
    max-width: 100px;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

    .pending-user:hover {
        background: var(--gray-high-2);
    }

.support-chat {
    width: calc(100% - 225px);
    height: 100%;
    padding: 1rem;
    padding-top: 3rem;
    text-align: center;
    background: var(--white);
    position: absolute;
    right: 0;
    display: flex;
}

@media (max-width: 876px) {
    .support-chat {
        width: 100%;
    }
}

@media (max-width: 585px) {
    .support-chat {
        flex-direction: column;
    }

    .pending-chat-list {
        margin: 0 !important;
        margin-bottom: 1rem !important;
    }

    .pending-user {
        max-width: 100%;
    }
}

.chat-header img, .target-name {
    margin-right: 10px;
}

.target-name {
    font-weight: 600;
}

.pending-chat-list {
    margin-right: 2rem;
}

main.section {
    padding-top: calc(12vh + 2rem);
}

.support-container {
    min-height: calc(100vh - 903px);
    margin-bottom: 1.4rem;
}

.talk-animation {
    width: calc(10rem + 10vw);
}

.chat-container {
    width: 100%;
    height: 80vh;
    max-height: 500px;
    display: flex;
    flex-direction: column;
    background: var(--white);
    border: 1px solid var(--input-gray-high);
    border-radius: 10px;
    padding: 1.2rem;
}

.chat-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
}

.chat-init-input form {
    display: flex;
}

    .chat-init-input input {
        margin-right: 7px;
    }

.chat-messages {
    height: 100%;
    overflow-y: auto;
    max-height: calc(36vh - 74px);
}

.chat-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

.message {
    background: var(--input-gray-high);
    border-radius: 7px;
    padding: .5rem;
    margin-bottom: .8rem;
}

.out {
    text-align: end;
    background: var(--purple);
    color: var(--white);
}

.chat-messages {
    height: 100%;
    max-height: 36vh;
    overflow-y: auto;
}

.message-header {
    display: flex;
}

    .message-header div:last-child {
        margin: 0 7px;
    }


.out .message-header {
    justify-content: flex-end;
}

.out .message-header div:last-child {
    margin-right: 0;
}

.out .message-body {
    text-align: right;
}

.message-body {
    margin-top: 10px;
    text-align: left;
}

.send-time {
    font-size: 13px;
    line-height: 194%;
}

.chat-input {
    position: relative;
}

    .chat-input i {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 1rem;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--input-gray-medium);
        cursor: pointer;
    }
</style>