<template>
    <div class="rabsystems-chat">
        <div class="loading-wrapper" v-if="loading">
            <div class="loading-frame"></div>
        </div>
        <div class="chat-header" v-if="!loading">
            <div class="destiny-user">
                <div class="user-img-container">
                    <img :src="rabsystemsUser.id == user.id ? order_user.profile_photo : rabsystemsUser.profile_photo" class="avatar-p">
                    <div class="user-status" :class="current_status"></div>
                </div>
                <h5>{{ rabsystemsUser.id == user.id ? order_user.name : rabsystemsUser.name}}</h5>
            </div>
            <div class="header-icons">
                <i class="fas fa-window-minimize" id="chat-minimize" v-on:click="toggleChat()"></i>
                <i class="fas fa-times" v-on:click="closeChat()"></i>
            </div>
        </div>
        <div class="chat-body" v-if="!loading">
            <div class="messages-container">
                <div class="message" :id="'message-' + message.message_id" :class="message.sender_id == user.id ? 'out' : 'in'" v-for="message in messages" :key="message.message_id">
                    <div class="message-header">
                        <h5>{{ message.sender_name }}</h5>
                        <span>{{ formatDate(message.send_date) }}</span>
                        <div class="view-icon" :class='message.view_date.length != 2 ? "viewed" : ""'>
                            <i class="fas fa-check"></i>
                            <i class="fas fa-check"></i>
                        </div>
                    </div>
                    <div class="message-body"> 
                        <span v-html="message.message"></span>
                        <p v-if="message.target_type != ''" v-html="returnMessageTargetObject(message)" class="message-target"></p>
                    </div>
                    <span class="show-more" v-on:click="expandMessage('#message-' + message.message_id)">Ver mais</span>
                    <span class="show-less" v-on:click="contractMessage('#message-' + message.message_id)">Ver menos</span>
                </div>
            </div>
        </div>
        <div class="chat-footer">
            <textarea name="message" id="message-input" rows="1" v-on:keydown="countRows($event)" v-on:keyup="countRows($event, true)" :disabled="loading"></textarea>
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
    props: ['order', 'userProp'],
    mixins: [globalMethods],
    data() {
        return {
            messages: [],
            order_user: {},
            rabsystemsUser: {},
            first: true,
            current_status: "",
            loading: true
        }
    },
    methods: {
        returnMessageTargetObject: function (message) {
            let targetId = message.target_id;
            let targetType = message.target_type;
            let returnText = "";
            if (targetType == "order") {
                returnText = `<a href="/order-details/${targetId}">Compra ${targetId}</a>`
            }
            return returnText;
        },
        findCurrentStatus: function () {
            let self = this;
            if (self.rabsystemsUser.id == self.user.id) {
                console.log(self.order_user)
                if (self.order_user.user_status == 'online') {
                    self.current_status = "online";
                } else if (self.order_user.user_status == "out") {
                    self.current_status = "user-out";
                } else {
                    self.current_status = "";
                }
            } else {
                if (self.rabsystemsUser.user_status == 'online') {
                    self.current_status = "online";
                } else if (self.rabsystemsUser.user_status == "out") {
                    self.current_status = "user-out";
                } else {
                    self.current_status = "";
                }
            }
        },
        checkMessageContentHeight: function () {
            let messages = $(".message");
            let container = $(".messages-container");

            messages.each((index) => {
                let currentMessage = messages[index];
                let text = $("#" + currentMessage.getAttribute("id") + " .message-body span");
                let showMore = $("#" + currentMessage.getAttribute("id") + " .show-more");
                if (text[0].offsetHeight > 72) {
                    showMore.show();
                }
            })

            container.scrollTop(9999999);
        },
        expandMessage: function (id_message) {
            let message = $(id_message);
            let body = message.find(".message-body");
            let showMore = message.find(".show-more");
            let showLess = message.find(".show-less");
            body.css("-webkit-line-clamp", "initial").css("max-height", "inherit");
            showMore.hide();
            showLess.show();
        },
        contractMessage: function (id_message) {
            let message = $(id_message);
            let body = message.find(".message-body");
            let showMore = message.find(".show-more");
            let showLess = message.find(".show-less");
            body.css("-webkit-line-clamp", "3").css("max-height", 72);
            showMore.show();
            showLess.hide();
        },
        lastChat: function () {
            let self = this
            let jwt = "Bearer " + self.getJwtInLocalStorage();
            let order_id = "";
            if (this.order != undefined) {
                order_id = self.order.order_id;
            }
            let data = {
                order_id: order_id
            }
            
            api.post("/messages/have_new_messages", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(response){
                if (response.data.response.have_new_messages) {
                    self.fillMessages();
                }
            }).catch(function(error){
                console.log(error);
            })
            .then(function () {
                setTimeout(() => {
                    self.lastChat();
                }, 10 * 1000)
            })
        },
        viewMessage: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();
            let sender_id = self.order_user.id;

            if (self.rabsystemsUser.id != self.user.id) {
                sender_id = self.rabsystemsUser.id
            }

            if ($(".rabsystems-chat").is(":visible") && $(".messages-container").height() > 0) {
                let data = {
                    view_date: moment().format(),
                    sender_id: sender_id
                }
                api.post("/messages/view_messages", data, {
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(function () {
                    self.fillMessages(true);
                })
                .catch(function (error) {
                    console.log(error);
                })
            }
        },
        fillMessages: function (only_fill = false) {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();
            let order_id = "";
            let user_id;
            if (this.order != undefined) {
                user_id = self.order.user_owner;
                order_id = self.order.order_id;
            } else {
                user_id = self.userProp.id;
            }
            let data = {
                order_id: order_id,
                user_id: user_id
            };
            
            api.post("/messages/return_messages", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(response){
                self.messages = response.data.response.messages;
                setTimeout(() => {
                    self.checkMessageContentHeight();
                    setTimeout(() => {
                        if (!only_fill) {
                            self.viewMessage(true);
                        }
                    }, )
                }, 20);
            }).catch(function(error){
                console.log(error);
            })
        },
        getOrderUser: function () {
            let self = this;
            if (self.order == undefined) {
                self.order_user = self.userProp;
                self.loading = false;
                self.findCurrentStatus();
            } else {
                api.get("/user/get_order_user/" + self.order.user_owner)
                .then(function(response){
                    self.order_user = response.data.response.user;
                    self.findCurrentStatus();
                    self.loading = false;
                    setTimeout(() => {
                        self.getOrderUser();
                    }, 30 * 1000);
                })  
            }
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
                    chat.css("width", "260px").css("min-width", "260px");
                }, 600);
            }
        },
        closeChat: function () {
            let chat = $(".rabsystems-chat");
            let self = this;

            chat.css("opacity", 0);
            setTimeout(() => {
                self.toggleChat(true);
                chat.hide();
                self.$emit("closeChat", true);
            }, 600);
        },
        formatDate: function (date) {
            let previous_date = moment(date).unix();

            return moment.unix(previous_date).fromNow();
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
            let self = this;
            let input = $("#message-input");
            let message = input.val();
            let jwt = "Bearer " + self.getJwtInLocalStorage();

            input.val("");

            if (message.trim() == "") {
                return;
            }

            let data = {
                message: message,
                send_date: moment().format()
            }

            data["order_id"] = 0;

            if (self.order != undefined) {
                data["order_id"] = self.order.order_id;
            }

            if (self.rabsystemsUser.id == self.user.id) {
                data["receiver_id"] = self.order_user.id;
                data["receiver_name"] = self.order_user.name;
                data["receiver_photo"] = self.order_user.profile_photo;
                data["sender_photo"] = self.rabsystemsUser.profile_photo;
                data["sender_name"] = self.rabsystemsUser.name;
                data["sender_id"] = self.rabsystemsUser.id;
            } else {
                data["receiver_id"] = self.rabsystemsUser.id;
                data["receiver_name"] = self.rabsystemsUser.name;
                data["receiver_photo"] = self.rabsystemsUser.profile_photo;
                data["sender_photo"] = self.order_user.profile_photo;
                data["sender_name"] = self.order_user.name;
                data["sender_id"] = self.order_user.id;
            }
            api.post("/messages", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(){
                self.fillMessages();
                $("#message-input").attr("rows", 1);
            }).catch(function(error){
                console.log(error);
            })
        }
    },
    mounted() {
        setTimeout(() => {
            this.getRabsystemsUser(true);
            this.getOrderUser();
            this.lastChat();
            this.fillMessages();
        }, 400);
    }
}
</script>

<style scoped>

    .viewed {
        color: var(--blue);
    }

    .out {
        background: var(--purple) !important;
        color: var(--white);
    }

    .in .view-icon {
        display: none;
    }

    .rabsystems-chat {
        position: fixed;
        bottom: 10px;
        right: 10px;
        margin: auto;
        width: 50vw;
        min-width: 260px;
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
        height: calc(100% - 123px);
        overflow: hidden;
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

    .messages-container {
        height: 100%;
        overflow-y: scroll;
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
        margin: .7rem auto;
        background: var(--gray-high-2);
        padding: 5px 10px;
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

    .message-body {
        text-align: left;
        overflow: hidden;
        width: 100%;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical; 
        word-break: break-word;
        /*max-height: 72px;*/
    }

    .show-more, .show-less {
        display: none;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
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

    .user-out {
        background: var(--orange);
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