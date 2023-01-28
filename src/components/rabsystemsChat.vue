<template>
    <div class="rabsystems-chat">
        <div class="loading-wrapper" v-if="loading">
            <div class="loading-frame"></div>
        </div>
        <div class="chat-header" v-if="!loading">
            <div class="destiny-user">
                <div class="user-img-container">
                    <img :src="order_user.profile_photo" class="avatar-p">
                    <div class="user-status" :class="order_user.user_status"></div>
                </div>
                <h5>{{ order_user.name }}</h5>
            </div>
            <div class="header-icons">
                <i class="fas fa-window-minimize" id="chat-minimize" v-on:click="toggleChat()"></i>
                <i class="fas fa-times" v-on:click="closeChat()"></i>
            </div>
        </div>
        <div class="chat-body" v-if="!loading">
            <div class="messages-container">
                <div class="message-wrapper" v-for="message in messages" :key="message.message_id" :class="message.reference_message_id != 0 ? 'with-reply' : ''">
                    <div class="replied-message" v-if="message.reference_message_id != 0" :class="message.sender_id == $root.user.id ? 'out' : 'in'">
                        <div class="replied-message-inner" v-on:click="goToReferencedMessage(message.reference_message_id)">
                            <div class="replied-message-header">
                                <h5>{{ message.reference_message_sender_id == $root.user.id ? 'Você' : message.reference_message_sender_name }}</h5>
                                <span>{{ formatDate(message.reference_message_send_date) }}</span>
                            </div>
                            <div class="replied-message-body">
                            <span v-html="message.reference_message_content"></span> 
                            </div>
                        </div>
                    </div>
                    <div class="message" :id="'message-' + message.message_id" :class="message.sender_id == $root.user.id ? 'out' : 'in'">
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
                        <div class="message-actions" v-on:click="openMessageOptionsContainer('#message-' + message.message_id)">
                            <span>...</span>
                        </div>
                        <div class="message-actions-container">
                            <ul>
                                <li v-on:click="replyMessage(message)">Responder</li>
                            </ul>
                        </div>
                    </div>
                    <div class="new-messages-indicator">
                        <span>Novas mensagens</span>
                    </div>
                </div>
            </div>
            <div class="message-options-wrapper" v-if="messageOptionsOpened" v-on:click="closeMessageOptionsContainer()"></div>
        </div>
        <div class="chat-footer">
            <div class="reply-message-container" v-if="replyMessageObj.reference_message_id != null">
                <div class="reply-message-header">
                    <i class="fas fa-times" v-on:click="clearReplyMessage()"></i>
                </div>
                <div class="reply-message-body">
                    <span class="reply-message-sender-name">{{ replyMessageObj.reference_message_sender_id == $root.user.id ? "Você" : replyMessageObj.reference_message_sender_name }}</span>
                    <span v-html="replyMessageObj.reference_message_content" class="reply-message"></span>
                </div>
            </div>
            <textarea name="message" id="message-input" rows="1" v-on:keydown="countRows($event)" v-on:keyup="countRows($event, true)" :disabled="loading"></textarea>
            <div class="input-icons">
                <i class="fas fa-location-arrow" v-on:click="sendMessage()"></i>
            </div>
        </div>
        <audio src="../assets/audio/new_message_alert.mp3" id="message-audio" preload="auto"></audio>
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
            loading: true,
            messageOptionsOpened: false,
            replyMessageObj: {
                reference_message_id: null,
                reference_message_sender_id: null,
                reference_message_content: "",
                reference_message_send_date: "",
                reference_message_sender_name: ""
            },
            firstTimeOpeningChat: true
        }
    },
    methods: {
        blinkCurrentMessageWrapper: function (messageWrapper) {
            messageWrapper.css("background", "var(--blue-high-2)");
            setTimeout(() => {
                messageWrapper.css("background", "transparent");
            }, 400)
        },
        goToReferencedMessage: function (referenced_message_id) {
            let messages = $(".message");
            for (let i = 0; i < messages.length; i++) {
                let currentMessage = $(messages[i]);
                let currentMessageId = currentMessage.attr("id").split("-")[1];
                
                if (currentMessageId == referenced_message_id) {
                    let bodyHeight = $(".messages-container").height();
                    let scrollHeight = $(".messages-container").prop("scrollHeight");
                    let currentMessagePosition = Math.floor(Math.abs(currentMessage.offset().top)) + Math.floor(bodyHeight) + 350;
                    
                    if (Math.abs(currentMessage.offset().top - bodyHeight) > bodyHeight - 100) {
                        $(".messages-container").animate({
                            scrollTop: scrollHeight - currentMessagePosition
                        }, 1000);
                        setTimeout(() => {
                            this.blinkCurrentMessageWrapper(currentMessage.parent());
                        }, 1000)    
                    } else {
                        this.blinkCurrentMessageWrapper(currentMessage.parent());
                    }
                }
            }
        },
        clearReplyMessage: function () {
            this.replyMessageObj = {
                reference_message_id: null,
                reference_message_content: "",
                reference_message_send_date: "",
                reference_message_sender_name: ""
            }
        },
        setMessageOptionsPosition: function (messageElement, chatBodyElement, messageOptionsContainer) {
            let positions = messageElement.offset();
            if (positions.top > chatBodyElement.height()) {
                messageOptionsContainer.css("bottom", "90%");
            }
        },
        closeMessageOptionsContainer: function () {
            let messagesOptionsContainer = $(".message-actions-container");
            this.messageOptionsOpened = false;
            messagesOptionsContainer.hide();
        },
        openMessageOptionsContainer: function (message_element_id) {
            let message = $(message_element_id);
            let chatBody = $(".chat-body");
            let messageOptionsContainer = $(message_element_id + " .message-actions-container");
            this.messageOptionsOpened = true;
            this.setMessageOptionsPosition(message, chatBody, messageOptionsContainer);
            messageOptionsContainer.show();
        },
        returnReplyMessage: function (message) {
            let replyMessage = {
                reference_message_id: message.message_id,
                reference_message_content: message.message,
                reference_message_send_date: message.send_date,
                reference_message_sender_name: message.sender_name,
                reference_message_sender_id: message.sender_id
            }

            return replyMessage;
        },
        replyMessage: function (message) {
            this.replyMessageObj = "";
            this.replyMessageObj = this.returnReplyMessage(message);
            $("#message-input").focus();
            this.closeMessageOptionsContainer();
        },
        returnMessageTargetObject: function (message) {
            let targetId = message.target_id;
            let targetType = message.target_type;
            let returnText = "";
            if (targetType == "order") {
                returnText = `<a href="/order-details/${targetId}">Compra ${targetId}</a>`
            }
            return returnText;
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
            
            api.post("/messages/last_chat", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(response){
                if (response.data.obj.have_new_messages) {
                    self.fillMessages(true);
                }
            }).catch(function(error){
                console.log(error);
            })
            .then(function () {
                if ($(".rabsystems-chat").is(":visible")) {
                    setTimeout(() => {
                        self.lastChat();
                    }, 10 * 1000)
                }
            })
        },
        playNewMessageAudio: function () {
            let audioElement = $("#message-audio")[0];
            if (audioElement != undefined) {
                audioElement.play();
            }
        },
        viewMessage: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();
            let sender_id = self.order_user.id;

            if (!self.$root.havePermission) {
                sender_id = self.$root.rabsystemsUser.id;
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
            }
        },
        checkIfMyMessagesHaveBeenViewed: function () {
            let notViewed = false;
            for (let i = 0; i < this.messages.length; i++) {
                let currentMessage = this.messages[i];
                if (currentMessage.view_date == '""' ) {
                    notViewed = true;
                }
            }
            if (notViewed) {
                this.fillMessages();
            }
        },
        checkViewMessage: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();
            let sender_id = self.order_user.id;

            if (!self.$root.havePermission) {
                sender_id = self.$root.rabsystemsUser.id;
            }
            let data = {
                sender_id: sender_id
            }
            api.post("/messages/check_view_my_messages", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function (response) {
                let viewedMessages = response.data.returnObj.viewedMessages;
                if (viewedMessages) {
                    self.checkIfMyMessagesHaveBeenViewed();
                } 
                if ($(".rabsystems-chat").is(":visible")) {
                    setTimeout(() => {
                        self.checkViewMessage();
                    }, 10 * 1000)
                }  
            })
        },
        setLastChatReceived: function (last_chat_received_id) {
            localStorage.setItem("last_chat_received", last_chat_received_id);
        },
        getLastChatReceived: function() {
            let lastChatReceived = localStorage.getItem("last_chat_received");
            return lastChatReceived;
        },
        showNewMessagesIndicator: function (last_chat_received_id) {
            let newMessageIndicator = $("#message-" + last_chat_received_id).parent().find(".new-messages-indicator");
            newMessageIndicator.show();
        },
        fillMessages: function (from_last_chat = false) {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();
            let order_id = "";
            let user_id;
            let lastChatReceived = self.getLastChatReceived();

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
                self.messages = response.data.obj;
                let lastMessage = self.messages[self.messages.length - 1];
                if (lastMessage.message_id != lastChatReceived && lastMessage.sender_id != self.$root.user.id && self.firstTimeOpeningChat) {
                    setTimeout(() => {
                        self.goToReferencedMessage(lastChatReceived);
                        self.showNewMessagesIndicator(lastChatReceived);
                    }, 30)
                }
                if (self.firstTimeOpeningChat) {
                    self.firstTimeOpeningChat = false;
                }
                $("#message-input").focus();
                setTimeout(() => {
                    self.setLastChatReceived(lastMessage.message_id);
                    self.checkMessageContentHeight();
                    self.viewMessage();
                    if (from_last_chat) {
                        self.playNewMessageAudio();
                    }
                }, 20);
            }).catch(function(error){
                console.log(error);
            })
        },
        getOrderUser: function () {
            let self = this;
            let requestedUserId;

            if (self.order == undefined) {
                requestedUserId = self.userProp.id;
            } else {
                requestedUserId = self.order.user_owner;
            }

            api.get("/user/get_order_user/" + requestedUserId)
            .then(function(response){
                self.order_user = response.data.obj.user;
                self.loading = false;
                if ($(".rabsystems-chat").is(":visible")) {
                    setTimeout(() => {
                        self.getOrderUser();
                    }, 30 * 1000);
                }
            })  
        },
        toggleChat: function (programatic = false) {
            let chat = $(".rabsystems-chat");
            let chatHeader = $(".chat-header");
            let minimizeIcon = $("#chat-minimize");
            
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
            let self = this;
            let input = $("#" + event.target.id);
            let length = input.val().length;
            let keycode = event.keyCode;

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

            if (this.replyMessageObj.reference_message_id != null) {
                data["reference_message_id"] = this.replyMessageObj.reference_message_id;
                data["reference_message_content"] = this.replyMessageObj.reference_message_content;
                data["reference_message_send_date"] = this.replyMessageObj.reference_message_send_date;
                data["reference_message_sender_name"] = this.replyMessageObj.reference_message_sender_name;
                data["reference_message_sender_id"] = this.replyMessageObj.reference_message_sender_id;
            } else {
                data["reference_message_id"] = 0;
                data["reference_message_content"] = "";
                data["reference_message_send_date"] = "";
                data["reference_message_sender_name"] = "";
                data["reference_message_sender_id"] = 0;
            }

            if (self.$root.havePermission) {
                data["receiver_id"] = self.order_user.id;
                data["receiver_name"] = self.order_user.name;
                data["receiver_photo"] = self.order_user.profile_photo;
                data["sender_photo"] = self.$root.rabsystemsUser.profile_photo;
                data["sender_name"] = self.$root.rabsystemsUser.name;
                data["sender_id"] = self.$root.rabsystemsUser.id;
            } else {
                data["receiver_id"] = self.$root.rabsystemsUser.id;
                data["receiver_name"] = self.$root.rabsystemsUser.name;
                data["receiver_photo"] = self.$root.rabsystemsUser.profile_photo;
                data["sender_photo"] = self.order_user.profile_photo;
                data["sender_name"] = self.order_user.name;
                data["sender_id"] = self.order_user.id;
            }

            $(".new-messages-indicator").hide(); //Esconder todos os indicadores de nova mensagem

            api.post("/messages", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(){
                self.fillMessages();
                self.clearReplyMessage();
                $("#message-input").attr("rows", 1);
            }).catch(function(error){
                console.log(error);
            })
        }
    },
    mounted() {
        setTimeout(() => {
            this.getOrderUser();
            this.lastChat();
            this.fillMessages();
            this.checkViewMessage();
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
        width: 60vw;
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
        overflow: hidden;
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
        position: relative;
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
        margin: 0.5rem 1rem;
        background: var(--gray-high-2);
        padding: 5px 10px;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        position: relative;
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
        width: 65%;
    }

        .destiny-user h5 {
            width: calc(100% - 1px);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            text-align: left;
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

    .message-wrapper:hover .message-actions {
        display: flex;
    }

    .message-actions {
        position: absolute;
        right: -35px;
        font-size: 25px;
        font-weight: 600;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        bottom: 0;
        top: 0;
        margin: auto;
        /*display: flex;*/
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--black);
        display: none;
    }

        .message-actions:hover {
            background: var(--gray-high-2);
        }

        .message-actions span {
            margin-top: -14px;
        }

    .message-actions-container {
        position: absolute;
        right: 0;
        background: var(--white);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        padding: .3rem;
        border-radius: 10px;
        z-index: 999;
        display: none;
    }

        .message-actions-container ul {
            list-style: none;
            margin: 0;
        }

            .message-actions-container ul li {
                cursor: pointer;
                padding: .3rem;
                margin: 2px 0;
                color: var(--black);
            }

                .message-actions-container ul li:hover {
                    background: var(--gray-high-2);
                }

    .message-options-wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }

    .message-wrapper {
        transition: all 0.4s;
        padding: 0.1rem 0;
    }

    .reply-message-container {
        position: absolute;
        bottom: 100%;
        left: 0;
        background: var(--white);
        height: fit-content;
        max-height: 200px;
        width: 100%;
        padding: .5rem;
        border-radius: 10px 10px 0 0;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    }

    .reply-message-header {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 5px;
    }

        .reply-message-header i {
            cursor: pointer;
        }

    .reply-message-body {
        background: var(--gray-high-2);
        height: calc(100% - 20px);
        padding: .5rem;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
    }

    .reply-message-sender-name {
        color: var(--purple);
    }

    .reply-message {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;  
        overflow: hidden;
    }
    .replied-message {
        width: 90%;
        margin: 0.5rem 1rem;
        margin-bottom: -18px;
        padding: .4rem;
        border-radius: 10px 10px 0 0;
        background: var(--gray-high-2);
        padding-bottom: 1rem;
        box-shadow: 0 0 15px rgb(0 0 0 / 30%);
    }

    .replied-message-header {
        display: flex;
        align-items: center;
    }

        .replied-message-header h5 {
            font-size: 15px;
            font-weight: 700;
            margin-right: 0.5rem !important;
        }

        .replied-message-header span {
            font-size: 13px;
        }

    .replied-message-inner {
        padding: .4rem;
        border-radius: 5px;
        background: var(--white);
        color: var(--black);
        cursor: pointer;
    }

    .new-messages-indicator {
        margin: 1rem auto 0;
        text-align: center;
        color: var(--blue-low);
        font-weight: 500;
        position: relative;
        display: none;
    }

        .new-messages-indicator span {
            background: var(--white);
            padding: 0 10px;
            position: relative;
            z-index: 3;
        }

        .new-messages-indicator:before {
            left: 20px;
        }

        .new-messages-indicator:after {
            right: 20px;
        }

        .new-messages-indicator:before, .new-messages-indicator:after {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto;
            width: 23%;
            height: 1px;
            background: var(--blue-low);
        }

    @media (max-width: 928px) {
        .message-actions {
            display: none !important;
        }

        .message, .replied-message {
            margin: .5rem auto;
        }

        .replied-message {
            margin-bottom: -18px;
        }
    }
</style>