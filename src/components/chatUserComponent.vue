<template>
    <div class="chat-user-list-container" v-on:click="openChat(user.id)">
        <div class="user-img-container">
            <img :src="user.profile_photo" class="avatar-pp online" />
            <div class="user-status" :class="user.user_status"></div>
        </div>
        <span>{{ user.name }}</span>
        <span class="new-message-label pulseRed" v-if="returnNewMessagesLabel(newMessages, user.id) != 0">{{ returnNewMessagesLabel(newMessages, user.id) }}</span>
    </div>
</template>
<script>
export default {
    props: ["user", "newMessages"],
    name: "chatUserComponent",
    methods: {
        openChat: function (user_id) {
            this.$emit("open_chat", user_id);
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
    },
    mounted() {
        console.log(this.newMessages)
    },
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
</style>