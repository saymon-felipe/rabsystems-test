<template>
    <div class="chat-user-list-container" v-on:click="openChat(user.id)">
        <div class="user-img-container">
            <img :src="user.profile_photo" class="avatar-pp" />
            <div class="user-status" :class="user.user_status"></div>
        </div>
        <div class="user-informations-container">
            <span>{{ user.name }}</span>
            <div class="last-message-container" v-if="user.message != null">
                <span class="sender-name">{{ user.sender_id == $root.user.id ? "Você" : user.sender_name }}:</span> <span class="message-content" v-html="user.message"></span> <span class="message-send-date">{{ returnSendDate(user.send_date) }}</span>
            </div>
        </div>
        <span class="new-message-label pulseRed" v-if="returnNewMessagesLabel(newMessages, user.id) != 0">{{ returnNewMessagesLabel(newMessages, user.id) }}</span>
    </div>
</template>
<script>
import moment from 'moment';

export default {
    props: ["user", "newMessages"],
    name: "chatUserComponent",
    methods: {
        openChat: function (user_id) {
            this.$emit("open_chat", user_id);
        },
        returnSendDate: function (send_date) {
            let current_time = moment(send_date).fromNow();
            return current_time;
        },
        returnNewMessagesLabel: function (newMessagesArray, userId) {
            let newMessagesText = 0;
            for (let i = 0; i < newMessagesArray.length; i++) {
                let currentMessageArray = newMessagesArray[i];
                if (currentMessageArray[0].sender_id == userId) {
                    newMessagesText = currentMessageArray.length;
                }
            }
            return newMessagesText;
        }
    }
}
</script>
<style scoped>
.chat-user-list-container {
    cursor: pointer;
    margin: 10px 0;
    padding: 1rem;
    display: flex;
    align-items: center;
    position: relative;
}

    .chat-user-list-container:first-child {
        margin-top: 0;
    }

    .chat-user-list-container:hover {
        background: var(--gray-high-2);
    }

    .chat-user-list-container span {
        font-weight: 500;
    }

.user-img-container {
    position: relative;
}

.user-status {
    border: 2px solid var(--white);
    position: absolute;
    bottom: 0;
    right: 0;
}

.new-message-label {
    position: absolute;
    right: 0;
    top: 3px;
    background: var(--red);
    color: var(--white);
    font-size: 14px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.user-informations-container {
    padding-left: 10px;
    width: calc(100% - 45px);
}

.last-message-container {
    display: flex;
}

.sender-name {
    font-size: 13px;
}

.sender-name, .message-send-date {
    flex-grow: auto;
}

.message-content {
    flex-grow: 1;
    font-size: 12px;
    font-weight: 400 !important;
    display: block;
    margin: 0 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.message-send-date {
    font-size: 12px;
    font-weight: 600 !important;
    white-space: nowrap;
}
</style>