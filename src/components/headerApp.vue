<template>
    <header>
        <div class="header-container">
            <div class="site-logo">
                <router-link to="/my-orders" style="background: none;">
                    <img src="../assets/img/logo-completa.png" :alt="$t('header.rabsystems_icon')" class="site-logo-img-big" />
                    <img src="../assets/img/icone.png" :alt="$t('header.rabsystems_icon')" class="site-logo-img-small" />
                </router-link>
            </div>
            <div class="header-informations-container">
                <div class="chat-container" v-on:click="toggleChatList()">
                    <i class="fas fa-comment"></i>
                    <div class="new-message-label" v-if="newMessagesLength != 0">
                        {{ newMessagesLength }}
                    </div>
                </div>
                <ChatList :user="$root.user" :rabsystemsUser="$root.rabsystemsUser" :newMessages="newMessages" />
                <div class="chat-wrapper" v-on:click="toggleChatList()"></div>
                <div class="no-responsive-header" v-on:click="showMoreOptions()" :title="$t('header.open_menu')">
                    <nav class="header">
                        <div class="home-user">
                            <div class="user-avatar">
                                <img :src="$root.user.profile_photo" class="avatar-p">
                            </div>
                            <h5>{{ $t("header.greetings") }}, <span class="user-name">&nbsp;{{ $root.user.name }}</span></h5>
                        </div>
                    </nav>  
                    <div class="more-options-container" title="">
                        <ul>
                            <li v-on:click="goToAdmin()" v-if="$root.havePermission">Admin</li>
                            <li v-on:click="goToTimeMachine()" v-if="$root.havePermission">Máquina do tempo</li>
                            <li v-on:click="logoutUser()" class="logout-user-button">{{ $t("header.exit") }}</li>
                        </ul>
                    </div>
                    <div class="leave-app-wrapper" v-on:click="showMoreOptions()"></div>
                </div>
            </div>
        </div>
        <aside class="vertical-menu">
            <div class="vertical-menu-icon" v-on:click="expandVerticalMenu()">
                <i class="fas fa-bars"></i>
            </div>
            <div class="vertical-menu-list">
                <router-link class="link" to="/my-orders">{{ $t("header.my_orders") }}</router-link>
                <router-link class="link" to="/financial">{{ $t("header.financial") }}</router-link>
                <router-link class="link" to="/rooms" style="display: none;">{{ $t("header.conferences") }}</router-link>
                <router-link class="link" to="/profile" @click.native="$router.go()">{{ $t("header.my_profile") }}</router-link>
                <router-link class="link" to="/support">{{ $t("header.support") }}</router-link>
            </div>
            <div class="vertical-menu-footer">
                <img src="../assets/img/icone-preto.png" class="icon-footer">
                <div class="copyrigth">
                    <h6>&copy; {{ year }} - Rabsystems</h6>
                </div>
            </div>
        </aside>
        <audio src="../assets/audio/message_notification.ogg" id="notification-audio" preload="auto"></audio>
    </header>
</template>
<script>
import $ from 'jquery';
import { globalMethods } from '../js/globalMethods';
import ChatList from "./ChatList.vue";
import api from '../configs/api.js';

export default {
    name: "headerApp",
    mixins: [globalMethods],
    data() {
        return {
            expanded: false,
            newMessages: [],
            newMessagesLength: null,
            firstTime: true,
            year: null
        }
    },
    components: {
        ChatList
    },
    mounted: function () {
        this.checkNewMessages();

        let now = new Date();
        this.year = now.getFullYear();
    },
    methods: {
        goToTimeMachine: function () {
            this.$router.push("/time-machine")
        },
        goToAdmin: function () {
            this.$router.push("/admin");
        },
        playNotificationAudio: function () {
            let audioElement = $("#notification-audio")[0];
            audioElement.play();
        },
        checkNewMessages: function () {
            let self = this
            let jwt = "Bearer " + self.getJwtInLocalStorage();
            
            api.get("/messages/have_new_messages", {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(response){
                self.newMessages = response.data.obj.newMessagesGroup;
                if (self.firstTime) {
                    self.firstTime = false;
                    self.newMessagesLength = response.data.obj.length;
                    if (self.newMessagesLength > 0) {
                        self.playNotificationAudio();
                    }
                } else if (self.newMessagesLength != response.data.obj.length) {
                    self.newMessagesLength = response.data.obj.length;
                    if (self.newMessagesLength > 0) {
                        self.playNotificationAudio();
                    }
                }
                setTimeout(() => {
                    self.checkNewMessages();
                }, 10 * 1000)
            }).catch(function(error){
                console.log(error);
            })
        },
        toggleChatList: function () {
            let element = $(".chat-container-list");
            let chatWrapper = $(".chat-wrapper");
            if (element.is(":visible")) {
                this.closeChatList(element, chatWrapper);
            } else {
                this.openChatList(element, chatWrapper);
            }
        },
        closeChatList: function (element, chatWrapper) {
            element.css("transform", "translateX(100%)");
            setTimeout(() => {
                element.hide();
                chatWrapper.hide();
            }, 400);
        },
        openChatList: function (element, chatWrapper) {
            element.show();
            chatWrapper.show();
            setTimeout(() => {
                element.css("transform", "translateX(0)")
            }, 10)
        },
        expandVerticalMenu: function () {
            let self = this;

            if (self.expanded) {
                $(".vertical-menu").css("transform", "translateX(-100%)");
                $(".vertical-menu-icon").removeClass("opacity-1");
                self.expanded = false;
                return;
            } 

            $(".vertical-menu").css("transform", "translateX(0)");
            $(".vertical-menu-icon").addClass("opacity-1");
            self.expanded = true;
        },
        showMoreOptions: function () {
            let container = $(".more-options-container");
            let moreOptionsWrapper = $(".leave-app-wrapper");

            if (container.is(":visible")) {
                container.css("opacity", 0);

                setTimeout(() => {
                    container.hide();
                    moreOptionsWrapper.hide();
                }, 400);
            } else {
                container.show();
                moreOptionsWrapper.show();

                setTimeout(() => {
                    container.css("opacity", 1);
                }, 10);
            }
        }
    }
}
</script>

<style scoped>

    .leave-app-wrapper {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
        display: none;
    }

    header {
        background: var(--white);
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        z-index: 4;
        box-shadow: 0 0 5px rgba(0,0,0,0.5);
    }

    .header-informations-container {
        display: flex;
        align-items: center;
    }

    .chat-container {
        margin-right: 1rem;
        font-size: 1.5rem;
        cursor: pointer;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.4s;
        position: relative;
        color: var(--black);
    }

        .chat-container:hover {
            background: var(--gray-high-2);
        }

        .chat-container .new-message-label {
            position: absolute;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            background: var(--red);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 600;
            color: var(--white);
            bottom: 5px;
            right: 2px;
        }

    .header-container {
        padding: 1rem;
        width: 100%;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
    }

    .site-logo {
        margin-right: 3rem;
    }
    
    .site-logo-img-big {
        max-width: 200px;
    }

    .site-logo-img-small {
        max-width: 40px;
        display: none;
    }

    .home-user {
        display: flex;
        align-items: center;
    }

        .home-user h5 {
            font-size: 1.2rem;
            font-weight: 500;
            text-align: center;
            display: flex;
            color: var(--black);
        }

    .user-name {
        text-align: left;
        display: block;
    }

    @media (max-width: 735px) {
        .home-user h5 {
            font-size: .9rem;
        }
    }

    @media (max-width: 466px) {
        .home-user {
            flex-direction: column;
        }

            .home-user h5 {
                display: none;
            }

        .user-avatar {
            margin: 0 !important;
        }

        .site-logo-img-big {
            max-width: 120px !important;
        }
    }

    @media (max-width: 353px) {
        .home-user h5 {
            font-size: .8rem;
        }
    }

    .no-responsive-header {
        position: relative;
        cursor: pointer;
    }

    .more-options-container {
        background: var(--white);
        border-radius: 10px;
        padding: .5rem;
        width: 200px;
        position: absolute;
        top: 116%;
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
        transition: all 0.4s;
        opacity: 0;
        display: none;
        right: 0;
        z-index: 3;
    }

        .more-options-container ul {
            list-style: none;
            width: 100%;
            height: 100%;
            margin: 0;
        }

            .more-options-container ul li {
                width: 100%;
                height: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.4s;
                font-size: 1.1rem;
                color: var(--black);
            }

                .more-options-container ul li:hover {
                    background: var(--gray-high-2);
                }

                .more-options-container ul li a {
                    color: var(--black);
                }

    .user-avatar {
        margin-right: 1rem;
    }

    .vertical-menu {
        position: fixed;
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
        background: var(--white);
        height: 100%;
        padding: 2rem 1rem;
        bottom: -102px;
        transition: transform 0.5s;
    }

        .vertical-menu .vertical-menu-list {
            list-style: none;
            margin-top: 3rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

            .vertical-menu .vertical-menu-list .link {
                margin: .3rem 0;
                padding: .7rem 0;
                min-width: 12rem;
                cursor: pointer;
                transition: all 0.5s;
                text-align: center;
                color: var(--black);
            }

                .vertical-menu .vertical-menu-list .link:hover {
                    background: var(--gray-high);
                }

    .link {
        color: var(--black);
        width: 100%;
        height: 100%;
        font-weight: 600;
        font-size: 1.1rem;
    }

    .vertical-menu-footer {
        position: absolute;
        bottom: 7rem;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
    }

    .vertical-menu-icon {
        display: none;
        position: absolute;
        right: -3.2rem;
        top: 1rem;
        cursor: pointer;
        background: var(--white);
        padding: 1rem;
        border-radius: 0 10px 10px 0;
        opacity: 0.5;
        transition: opacity 0.4s;
    }

        .vertical-menu-icon:hover {
            opacity: 1;
        }

        .vertical-menu-icon i {
            font-size: 1.5rem;
            transition: all 0.5s;
        }  
        
    .opacity-1 {
        opacity: 1;
    }

    .copyrigth {
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 2rem;
    }

        .copyrigth h6 {
            font-size: .9rem;
        }

    .icon-footer {
        width: 40px;
        margin: auto;
    }

    .chat-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: none;
        z-index: 2;
    }

    @media (max-width: 1064px) {
        .site-logo-img-big {
            max-width: 150px;
        }

        .vertical-menu {
            bottom: -90px;
        }
    }

    @media (max-width: 876px) {

        .vertical-menu {
            transform: translateX(-100%);
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
        }

        .vertical-menu-icon {
            display: block;
            box-shadow: 5px 0 5px rgba(0,0,0,0.1);
        }

        .link {
            font-size: 1rem;
        }

        .copyrigth h6 {
            font-size: .8rem;
        }

        .icon-footer {
            width: 35px;
        }
    }

    @media (max-width: 482px) {
        .responsive-header-container {
            padding: 1.3rem;
        }

        .site-logo-img-small {
            display: block;
        }

        .site-logo-img-big {
            display: none;
        }
    }

</style>