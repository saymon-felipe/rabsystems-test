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
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();
            if (self.$route.path != "/login" && self.$route.path != "/register") {
                self.$root.user = await api.get("/user/get_user", { headers: { Authorization: jwt } }).then(res => res.data.response.user);
            }
        },
        getRabsystemsUser: function (recursive = false) {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();
            self.requireUser();
            api.get("/user/get_rabsystems_user?with_last_message=true", {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(response){
                self.$root.rabsystemsUser = response.data.obj.user;
                if (recursive) {
                    setTimeout(() => {
                        self.getRabsystemsUser(true);
                    }, 10 * 1000);
                }
            }).catch(function(error){
                console.log(error);
            })
        },
        checkIfUserIsAuthenticated: function () {
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();
            if (window.location.pathname != "/login" && window.location.pathname != "/register") {
                if (jwt == "Bearer null") {
                    self.logoutUser();
                } else {
                    let user_out = $("body").hasClass("hidden");
                    api.post("/user/check_jwt", {user_out: user_out}, {
                        headers: {
                                Authorization: jwt
                            }
                    })
                    .then(function(response){
                        console.log("Authenticated user. JWT check in " + new Date());
                        if (response.data.user.incomplete_registration == "true") {
                            if (self.$route.path != "/complete-registration") {
                                self.$router.push("/complete-registration");
                            }
                        } else {
                            setTimeout(() => {
                                self.checkIfUserIsAuthenticated();
                            }, 60 * 1000); // Repetição da função a cada 20 segundos
                        }
                    }).catch(function(){
                        console.log("Unauthenticated user. JWT check in " + new Date());
                        self.logoutUser();
                    })
                }
            }
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