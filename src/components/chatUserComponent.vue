<template>
    <div class="chat-user-list-container" v-on:click="openChat(user.id)">
        <div class="user-img-container">
            <img :src="user.profile_photo" class="avatar-pp online" />
            <div class="user-status" :class="user.user_status"></div>
        </div>
        <div class="user-informations-container">
            <span>{{ user.name }}</span>
            <div class="last-message-container" v-if="user.message != null">
                <span class="sender-name">{{ user.sender_id == $root.user.id ? "Você" : user.sender_name }}:</span> <span class="message-content">{{ user.message }}</span> <span class="message-send-date">{{ returnSendDate(user.send_date) }}</span>
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
    padding: 7px;
    display: flex;
    align-items: center;
    position: relative;
}

    .chat-user-list-container:hover {
        background: var(--gray-high-2);
    }

    .chat-user-list-container img {
        margin-right: .7rem;
    }

    .chat-user-list-container span {
        font-weight: 500;
    }

.user-img-container {
    width: 40px;
}

.user-status {
    border: 2px solid var(--white);
}

.new-message-label {
    position: absolute;
    right: 0;
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
    width: 100%;
}

.last-message-container {
    display: flex;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.sender-name {
    font-size: 13px;
}

.message-content {
    font-size: 12px;
    font-weight: 400 !important;
    display: block;
    margin: 0 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: calc(80% - 80px);
}

.message-send-date {
    font-size: 12px;
    font-weight: 600 !important;
    white-space: nowrap;
}

@media (max-width: 544px) {
    .message-content {
        max-width: calc(80% - 125px);
    }
}
</style>