<template>
    <div>
        <div class="loading-app" v-if="loadingUsers">
            <div class="loading-wrapper" v-if="loadingUsers">
                <div class="loading-frame"></div>
            </div>
        </div>
        <div class="app-container" v-if="!loadingUsers">
            <div class="container">
                <headerAppComponent />
                <router-view path="$router.key"></router-view>
            </div>
        </div>
    </div>  
</template>

<script>
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';
import headerAppComponent from "../components/headerApp.vue";
import $ from "jquery";
import moment from 'moment';

export default {
    name: 'appPage',
    mixins: [globalMethods],
    components: {
        headerAppComponent
    },
    data() {
        return {
            loadingUsers: true,
            user: {},
            rabsystemsUser: {},
            havePermission: false,
            newMessages: []
        }
    },
    methods: {
        checkPermission: function () {
            if (this.$root.rabsystemsUser.id == this.$root.user.id) {
                this.$root.havePermission = true;
            }
        },
        checkData: function () {
            if (this.$root.rabsystemsUser != undefined && this.$root.user != undefined) {
                this.loadingUsers = false;
                this.checkPermission();
                this.setNewLanguage(this.$root.user.language);
            } else {
                setTimeout(() => {
                    this.checkData();
                }, 10)
            }
        },
        requireUser: async function() { // Função retorna o usuário pelo id.
            let self = this;
            if (self.$route.path != "/login" && self.$route.path != "/register") {
                self.$root.user = await api.get("/user/get_user").then(res => res.data.response.user);
            }
        },
        getRabsystemsUser: function (recursive = false) {
            let self = this;
            self.requireUser();
            api.get("/user/get_rabsystems_user?with_last_message=true")
            .then(function(response){
                self.$root.rabsystemsUser = response.data.obj.user;
                if (recursive) {
                    setTimeout(() => {
                        self.getRabsystemsUser(true);
                    }, 10 * 1000);
                }
            })
        },
        
        isDefaultPhoto: function (url) {
            if (url.indexOf("/public/") != -1) {
                if ($(".view-photo").length) {
                    $(".view-photo").hide();
                }
            }
        }
   },
   mounted() {
        moment.locale("pt-br");
        setTimeout(() => {
            this.checkIfUserIsAuthenticated();
            this.getRabsystemsUser(true);
            this.checkData();
        }, 20);
   },
}
</script>

<style scoped>
    .container {
        width: calc(100vw - 225px);
        position: absolute;
        right: 0;
        top: 2.8rem;
        height: calc(100% - 45px);
        overflow: hidden;
        padding: 1.3rem;
    }

    @media (max-width: 876px) {
        .container {
            width: 100%;
            left: 0;
        }
    }
</style>