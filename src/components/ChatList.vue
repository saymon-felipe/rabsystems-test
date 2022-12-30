<template>
    <div class="chat-container-list">
        <div class="chat-list-header">
            <h1 v-if="havePermission">Clientes</h1>
            <h1 v-if="!havePermission">Rabsystems</h1>
        </div>
        <div class="chat-list-body">
            <div class="loading-wrapper" v-if="loadingUsers">
                <div class="loading-frame"></div>
            </div>
            <div class="chat-users" v-if="userList.length != 0 && !loadingUsers">
                <chatUserComponent v-for="(userItem, index) in userList" v-bind:key="index" :user="userItem" @open_chat="openChatFunction(userItem)" />
            </div>
        </div>
        <rabsystemsChat v-if="showChat" :userProp="currentChatUser" @closeChat="closeChatComponent()" />
    </div>
</template>
<script>
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';
import chatUserComponent from "./chatUserComponent.vue";
import rabsystemsChat from "./rabsystemsChat.vue";

export default {
    name: "ChatList",
    mixins: [globalMethods],
    data() {
        return {
            userList: [],
            havePermission: false,
            loading: true,
            loadingUser: true,
            loadingRabsystemsUser: true,
            loadingUsers: true,
            showChat: false,
            currentChatUser: {}
        }
    },
    watch: {
        user: function () {
            this.loadingUser = false;
            this.isLoadingOnlyUsers();
        },
        rabsystemsUser: function () {
            this.loadingRabsystemsUser = false;
            this.isLoadingOnlyUsers();
        }
    },
    methods: {
        openChatFunction: function (user) {
            this.currentChatUser = user;
            this.openChatComponent();
        },
        isLoadingOnlyUsers: function () {
            if (!this.loadingUser && !this.loadingRabsystemsUser) {
                this.checkPermission();
                this.checkUsersChatList();
            }
        },
        checkPermission: function () {
            if (this.user.id == this.rabsystemsUser.id) {
                this.havePermission = true;
            }
        },
        checkUsersChatList: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();
            if (!self.havePermission) {
                self.userList.push(self.rabsystemsUser);
                self.loadingUsers = false;
                return;
            }

            api.post("/user/return_all_users", "", {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function (response) {
                self.loadingUsers = false;
                self.userList = response.data.users_list;
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    },
    components: {
        chatUserComponent,
        rabsystemsChat
    }
}
</script>
<style scoped>
.chat-container-list {
    background: var(--white);
    position: fixed;
    top: 100px;
    right: 0;
    min-width: 230px;
    max-width: 600px;
    width: 25vw;
    height: calc(100% - 100px);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    transition: all 0.4s;
    transform: translateX(400px);
    display: none;
}

.chat-list-header {
    border-bottom: 1px solid var(--gray-high);
    text-align: center;
    padding: 10px 7px 4px;
}

    .chat-list-header h1 {
        font-size: 22px;
    }

.chat-list-body {
    height: calc(100% - 50px);
    padding: 1rem;
    position: relative;
}
</style>