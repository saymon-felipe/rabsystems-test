<template>
    <div class="chat-user-list-container" v-on:click="openChat(user.id)">
        <img :src="user.profile_photo" class="avatar-pp">
        <span>{{ user.name }}</span>
    </div>
</template>
<script>
export default {
    props: ["user"],
    name: "chatUserComponent",
    methods: {
        openChat: function (user_id) {
            this.$emit("open_chat", user_id);
        }
    },
    mounted: function () {
        console.log(this.user)
    }
}
</script>
<style scoped>
.chat-user-list-container {
    cursor: pointer;
    margin: 10px 0;
    padding: 7px;
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
</style>