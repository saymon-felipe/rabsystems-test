<template>
    <div class="rabsystems-chat">
        <div class="chat-header" :style="rabsystemsUser.id == user.id ? 'padding: .7rem;' : ''">
            <div class="destiny-user">
                <div class="user-img-container">
                    <img v-if="rabsystemsUser.id != user.id" :src="order_user.profile_photo" class="avatar-p">
                    <div class="user-status" v-if="rabsystemsUser.id != user.id" :class="rabsystemsUser.is_online == 'true' ? 'online' : ''"></div>
                </div>
                <h5>{{ rabsystemsUser.id == user.id ? 'Mensagens' : 'Rabsystems'}}</h5>
            </div>
            <div class="header-icons">
                <i class="fas fa-window-minimize" id="chat-minimize" v-on:click="toggleChat()"></i>
                <i class="fas fa-times" v-on:click="closeChat()"></i>
            </div>
        </div>
        <div class="chat-body">
            <div class="owner-inbox" v-if="rabsystemsUser.id == user.id">
                <aside class="opened-chats custom-scroll">
                    <div class="user-chat">
                        <img :src="rabsystemsUser.profile_photo" class="avatar-pp">
                        <div class="user-status-p" :class="rabsystemsUser.is_online == 'true' ? 'online' : ''"></div>
                    </div>
                    <div class="user-chat">
                        <img :src="rabsystemsUser.profile_photo" class="avatar-pp">
                        <div class="user-status-p" :class="rabsystemsUser.is_online == 'true' ? 'online' : ''"></div>
                    </div>
                    <div class="user-chat">
                        <img :src="rabsystemsUser.profile_photo" class="avatar-pp">
                        <div class="user-status-p" :class="rabsystemsUser.is_online == 'true' ? 'online' : ''"></div>
                    </div>
                    <div class="user-chat">
                        <img :src="rabsystemsUser.profile_photo" class="avatar-pp">
                        <div class="user-status-p" :class="rabsystemsUser.is_online == 'true' ? 'online' : ''"></div>
                    </div>
                    <div class="user-chat">
                        <img :src="rabsystemsUser.profile_photo" class="avatar-pp">
                        <div class="user-status-p" :class="rabsystemsUser.is_online == 'true' ? 'online' : ''"></div>
                    </div>
                    <div class="user-chat">
                        <img :src="rabsystemsUser.profile_photo" class="avatar-pp">
                        <div class="user-status-p" :class="rabsystemsUser.is_online == 'true' ? 'online' : ''"></div>
                    </div>
                    <div class="user-chat">
                        <img :src="rabsystemsUser.profile_photo" class="avatar-pp">
                        <div class="user-status-p" :class="rabsystemsUser.is_online == 'true' ? 'online' : ''"></div>
                    </div>
                    <div class="user-chat">
                        <img :src="rabsystemsUser.profile_photo" class="avatar-pp">
                        <div class="user-status-p" :class="rabsystemsUser.is_online == 'true' ? 'online' : ''"></div>
                    </div>
                    <div class="user-chat">
                        <img :src="rabsystemsUser.profile_photo" class="avatar-pp">
                        <div class="user-status-p" :class="rabsystemsUser.is_online == 'true' ? 'online' : ''"></div>
                    </div>
                    <div class="user-chat">
                        <img :src="rabsystemsUser.profile_photo" class="avatar-pp">
                        <div class="user-status-p" :class="rabsystemsUser.is_online == 'true' ? 'online' : ''"></div>
                    </div>
                </aside>
            </div>
            <div class="user-inbox">
                <div class="message" :class="message.sender_id == user.id ? 'out' : 'in'" v-for="message in messages" :key="message.message_id">
                    <div class="message-header">
                        <h5>{{ message.sender_name }}</h5>
                        <span>{{ formatDate(message.send_date) }}</span>
                        <div class="view-icon">
                            <i class="fas fa-check"></i>
                            <i class="fas fa-check"></i>
                        </div>
                    </div>
                    <div class="message-body">{{ message.message }}</div>
                </div>
            </div>
        </div>
        <div class="chat-footer">
            <textarea name="message" id="message-input" rows="1" v-on:keydown="countRows($event)" v-on:keyup="countRows($event, true)"></textarea>
            <div class="input-icons">
                <i class="fas fa-location-arrow" v-on:click="sendMessage()"></i>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import moment from 'moment';
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "rabsystemsChat",
    props: ['order', 'user'],
    mixins: [globalMethods],
    data() {
        return {
            messages: [
                /*{
                    message_id: 1,
                    sender_id: 3,
                    sender_name: "Saymon",
                    receiver_id: 4,
                    message: "Lorem ipsum dolor sit amet, consectetur adpiscing elit. Lorem ipsum dolor sit amet, consectetur adpiscing elit.",
                    send_date: moment().format()
                },
                {
                    message_id: 2,
                    sender_id: 4,
                    sender_name: "Rabudinha",
                    receiver_id: 3,
                    message: "Lorem ipsum dolor sit amet, consectetur adpiscing elit. Lorem ipsum dolor sit amet, consectetur adpiscing elit.",
                    send_date: moment().format()
                }*/
            ],
            order_user: {},
            rabsystemsUser: {}
        }
    },
    methods: {
        getRabsystemsUser: function () {
            let self = this;
            api.get("/user/get_rabsystems_user")
            .then(function(response){
                self.rabsystemsUser = response.data.response.user;
            }).catch(function(error){
                console.log(error);
            })
            .then(function () {
                setTimeout(() => {
                    self.getRabsystemsUser();
                }, 20 * 1000);
            });
        },
        getOrderUser: function () {
            let self = this;
            console.log(self.order.user_owner)
            api.get("/user/get_order_user/" + self.order.user_owner)
            .then(function(response){
                self.order_user = response.data.response.user;
                console.log(self.order_user)
            }).catch(function(error){
                console.log(error);
            })
        },
        toggleChat: function (programatic = false) {
            let chat = $(".rabsystems-chat"), chatHeader = $(".chat-header"), minimizeIcon = $("#chat-minimize");
            
            if (chat.css("height") == "65px" || programatic) {
                chat.css("width", "50vw").css("min-width", "250px");
                setTimeout(() => {
                    chat.css("height", "80vh").css("min-height", "500px");
                    minimizeIcon.removeClass("fa-window-maximize").addClass("fa-window-minimize").css("margin-top", "-5px");
                    chatHeader.css("border-radius", "10px 10px 0 0");
                }, 600);
            } else {
                chat.css("height", "65px").css("min-height", "65px");
                minimizeIcon.removeClass("fa-window-minimize").addClass("fa-window-maximize").css("margin-top", 0);
                chatHeader.css("border-radius", "10px");
                setTimeout(() => {
                    chat.css("width", "280px").css("min-width", "280px");
                }, 600);
            }
        },
        closeChat: function () {
            let chat = $(".rabsystems-chat"), self = this;

            chat.css("opacity", 0);
            setTimeout(() => {
                self.toggleChat(true);
                chat.hide();
            }, 600);
        },
        formatDate: function (date) {
            moment.locale("pt-br");
            let current_date = moment(moment().format()).unix(), previous_date = moment(date).unix();

            if ((current_date - previous_date) > 86400) { // Se a diferença de tempo for maior que um dia, formata com a data extensa se não formata apenas com o horario
                return moment.unix(previous_date).format("ll");
            }

            return moment.unix(previous_date).format("LT");
        },
        countRows: function (event, keyup = false) {
            let input = $("#" + event.target.id), length = input.val().length, keycode = event.keyCode, self = this;
            if (keycode == 13) {
                if (keyup) {
                    if(event.shiftKey){
                        $(input).val($(input).val() + '\n'); // shift + enter = Quebra linha
                        $(input).scrollTop(10000000);
                        return;
                    }
                    self.sendMessage();
                }
                event.preventDefault();
            }

            if (length <= 30) {
                input.attr("rows", 1);
            } else if (length > 30 && length <= 60) {
                input.attr("rows", 2);
            } else if (length > 60 && length <= 90) {
                input.attr("rows", 3);
            } else {
                input.attr("rows", 4);
            }
        },
        sendMessage: function () {
            let input = $("#message-input"), message = input.val(), self = this//, jwt = "Bearer " + self.getJwtInLocalStorage();
            input.val("");
            console.log(self.order)
            let data = {
                message: message,
                send_date: moment().format()
            }
            if (self.rabsystemsUser.id == self.user.id) {
                data["receiver_id"] = self.order.user_owner;
                data["receiver_name"] = self.order.user_name;
            } else {
                data["receiver_id"] = self.rabsystemsUser.id;
                data["receiver_name"] = self.rabsystemsUser.name;
            }

            console.log(data)

            /*api.post("/messages", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(response){
                console.log(response.data)
            }).catch(function(error){
                console.log(error);
            })*/
        }
    },
    mounted() {
        this.getRabsystemsUser();
        setTimeout(() => {
            this.getOrderUser();
        }, 400);
    }
}
</script>

<style scoped>

    .out {
        background: var(--purple) !important;
        color: var(--white);
    }

    .in .view-icon {
        display: none;
    }

    .rabsystems-chat {
        position: fixed;
        bottom: 3rem;
        right: 3rem;
        margin: auto;
        width: 50vw;
        min-width: 250px;
        max-width: 800px;
        height: 80vh;
        min-height: 500px;
        max-height: 1000px;
        background: var(--white);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        transition: all 0.6s ease-in-out;
        opacity: 0;
        display: none;
    }

    .chat-header {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        background: var(--purple);
        border-radius: 10px 10px 0 0;
        padding: 1.5rem .7rem;
        position: relative;
        z-index: 3;
    }

    .header-icons {
        margin-right: .5rem;
        display: flex;
        align-items: center;
    }

        .header-icons i {
            cursor: pointer;
            color: var(--white);
            font-size: 1.2rem;
        }

        .header-icons i:nth-child(1) {
            margin-right: 1.2rem;
            margin-top: -5px;
        }

    .chat-body {
        height: calc(100% - 98px);
    }

    .chat-footer {
        border-radius: 0 0 10px 10px;
        width: 100%;
        background: var(--purple);
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: center;
        padding: .5rem;
    }

        .chat-footer textarea {
            border: none;
            border-radius: 10px 0 0 10px;
            width: calc(100% - 55px);
            resize: none;
            min-height: 40px;
            max-height: 100px;
        }

    .input-icons {
        position: absolute;
        right: .5rem;
        background: var(--white);
        height: calc(100% - 1rem);
        width: 55px;
        border-radius: 0 10px 10px 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

        .input-icons i {
            cursor: pointer;
        }

        .input-icons i:nth-child(1) {
            font-size: 1.3rem;
            transform: rotate(45deg);
        }

    .message {
        width: 90%;
        margin: .5rem auto;
        background: var(--gray-high-2);
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    }

    .message-header {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }

        .message-header h5 {
            font-size: 1.1rem;
            font-weight: 700;
            margin-right: 10px !important;
        }

        .message-header span {
            margin-right: 10px !important;
        }

    .view-icon {

    }

        .view-icon i {
            font-size: .9rem;
        }

        .view-icon i:nth-child(2) {
            margin-left: -7px;
        }

    .destiny-user {
        display: flex;
        align-items: center;
        color: var(--white);
        position: absolute;
        left: 1rem;
    }

    .user-img-container {
        background: var(--white);
        border-radius: 50%;
        margin-right: 1rem;
        position: relative;
    }

    .user-status, .user-status-p {
        width: 17px;
        height: 17px;
        border-radius: 50%;
        border: 2px solid var(--purple);
        background: var(--gray-high);
        position: absolute;
        bottom: -2px;
        right: -2px;
    }

    .online {
        background: var(--green);
    }

    .owner-inbox {
        height: 100%;
    }

    .opened-chats {
        width: 20%;
        height: 100%;
        max-width: 70px;
        box-shadow: 5px 0 7px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
    }

    .user-chat {
        position: relative;
        width: 40px;
        margin: .5rem 0;
        cursor: pointer;
    }

    .user-status-p {
        width: 13px;
        height: 13px;
        border: 2px solid var(--white);
    }
</style>