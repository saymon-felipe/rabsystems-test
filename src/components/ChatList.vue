<template>
    <div class="chat-container-list">
        <div class="chat-list-header">
            <h1 v-if="$root.havePermission">Clientes</h1>
            <h1 v-if="!$root.havePermission">Rabsystems</h1>
        </div>
        <div class="chat-list-body">
            <div class="loading-wrapper" v-if="loadingUsers">
                <div class="loading-frame"></div>
            </div>
            <div class="chat-users" v-if="userList.length != 0 && !loadingUsers && !reloadUsers">
                <div class="user-component" v-for="(userItem, index) in userList" v-bind:key="index">
                    <chatUserComponent :user="userItem" @open_chat="openChatFunction(userItem)" :newMessages="newMessages" v-if="userItem.incomplete_registration != 'true'" />
                </div>
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
    props: ["newMessages"],
    mixins: [globalMethods],

    data() {
        return {
            userList: [],
            loadingUsers: true,
            showChat: false,
            currentChatUser: {},
            reloadUsers: false
        }
    },
    watch: {
        newMessages: function () {
            this.resetUsersList();
        }
    },
    methods: {
        openChatFunction: function (user) {
            this.currentChatUser = user;
            this.openChatComponent();
        },
        checkUsersChatList: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();
            if (!self.$root.havePermission) {
                self.userList = [];
                let jwt = "Bearer " + self.getJwtInLocalStorage();
                api.get("/user/get_rabsystems_user?with_last_message=true", {
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(function(response){
                    self.userList.push(response.data.obj.user);
                    self.loadingUsers = false;
                    self.resetUsersList();
                }).catch(function(error){
                    console.log(error);
                })
                return;
            }

            api.post("/user/return_all_users?return_recent_messages=true", "", {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function (response) {
                self.userList = response.data.users_list;
                self.loadingUsers = false;
                self.resetUsersList();
                setTimeout(() => {
                    self.checkUsersChatList();
                }, 10 * 1000)
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        resetUsersList: function () {
            self.reloadUsers = true;
            setTimeout(() => {
                self.reloadUsers = false;
            }, 1)
        }
    },
    mounted: function () {
        this.checkUsersChatList();
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
    width: 80vw;
    height: calc(100% - 100px);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    transition: all 0.4s;
    transform: translateX(50vw);
    display: none;
    z-index: 999;
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

@media (max-width: 372px) {
    .chat-list-body {
        padding: 0.5rem;
    }
}
</style>