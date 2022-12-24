<template>
    <header>
        <div class="header-container">
            <div class="site-logo">
                <router-link to="/my-orders" style="background: none;">
                    <img src="../assets/img/logo-completa.png" alt="Icone rabsystems" class="site-logo-img">
                </router-link>
            </div>
            <div class="header-informations-container">
                <div class="chat-container" v-on:click="toggleChatList()">
                    <i class="fas fa-comment"></i>
                </div>
                <ChatList />
                <div class="no-responsive-header" v-on:click="showMoreOptions()" title="Abrir menu">
                    <nav class="header">
                        <div class="home-user">
                            <div class="user-avatar">
                                <img :src="user.profile_photo" class="avatar-p">
                            </div>
                            <h5>Olá, <span class="user-name">&nbsp;{{ user.name }}</span></h5>
                        </div>
                    </nav>  
                    <div class="more-options-container" title="">
                        <ul>
                            <li v-on:click="logoutUser()">Sair</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <aside class="vertical-menu">
            <div class="vertical-menu-icon" v-on:click="expandVerticalMenu()">
                <i class="fas fa-bars"></i>
            </div>
            <div class="vertical-menu-list">
                <router-link class="link" to="/my-orders" @click.native="$router.go()">Meus pedidos</router-link>
                <router-link class="link" to="/financial" @click.native="$router.go()">Financeiro</router-link>
                <router-link class="link" to="/profile" @click.native="$router.go()">Meu perfil</router-link>
                <router-link class="link" to="/support" @click.native="$router.go()">Suporte</router-link>
            </div>
            <div class="vertical-menu-footer">
                <img src="../assets/img/icone-preto.png" class="icon-footer">
                <div class="copyrigth">
                    <h6>&copy; 2022 - Rabsystems</h6>
                </div>
            </div>
        </aside>
    </header>
</template>

<script>
import $ from 'jquery';
import { globalMethods } from '../js/globalMethods';
import ChatList from "./ChatList.vue";

export default {
    name: "headerApp",
    mixins: [globalMethods],
    data() {
        return {
            expanded: false
        }
    },
    components: {
        ChatList
    },
    methods: {
        toggleChatList: function () {
            let element = $(".chat-container-list");
            if (element.is(":visible")) {
                this.closeChatList(element);
            } else {
                this.openChatList(element);
            }
        },
        closeChatList: function (element) {
            element.css("transform", "translateX(400px)");
            setTimeout(() => {
                element.hide();
            }, 400);
        },
        openChatList: function (element) {
            element.show();
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

            if (container.is(":visible")) {
                container.css("opacity", 0);

                setTimeout(() => {
                    container.hide();
                }, 400);
            } else {
                container.show();

                setTimeout(() => {
                    container.css("opacity", 1);
                }, 10);
            }
        }
    }
}
</script>

<style scoped>
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
        margin-right: 2rem;
        font-size: 1.5rem;
        cursor: pointer;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.4s;
    }

        .chat-container:hover {
            background: var(--gray-high-2);
        }

    .header-container {
        padding: 1rem 0;
        width: 90%;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
    }

    .site-logo {
        margin-right: 3rem;
    }
    
    .site-logo-img {
        max-width: 200px;
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
        }

    .user-name {
        text-align: left;
        display: block;
        max-width: 100px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
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

        .user-avatar {
            margin: 0 !important;
        }

        .site-logo-img {
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
        bottom: calc(5vh - 105px);
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
        transition: all 0.4s;
        opacity: 0;
        display: none;
        right: 0;
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

    @media (max-width: 1064px) {
        .site-logo-img {
            max-width: 150px;
        }

        .vertical-menu {
            bottom: -90px;
        }
    }

    @media (max-width: 876px) {
        .header-container {
            justify-content: space-between;
            width: 80% !important;
        }

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

    @media (max-width: 439px) {
        .responsive-header-container {
            padding: 1.3rem;
        }
    }

</style>