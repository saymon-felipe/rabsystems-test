<template>
    <div>
        <div class="loading-app" v-if="loading">
            <div class="loading-wrapper">
                <div class="loading-frame"></div>
            </div>
        </div>
        <div class="app-container" v-if="!loading">
            <div class="container">
                <headerAppComponent />
                <router-view path="$router.key"></router-view>
                <tutorialComponent :steps="steps" v-if="steps.length > 0" />
            </div>
        </div>
    </div>  
</template>

<script>
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';
import headerAppComponent from "../components/headerApp.vue";
import tutorialComponent from "../components/tutorialComponent.vue";
import $ from "jquery";
import moment from 'moment';

export default {
    name: 'appPage',
    mixins: [globalMethods],
    components: {
        headerAppComponent,
        tutorialComponent
    },
    data() {
        return {
            loading: true,
            user: {},
            rabsystemsUser: {},
            havePermission: false,
            newMessages: [],
            steps: []
        }
    },
    methods: {
        initSystemRequests: function () {
            let self = this;

            this.returnSteps();

            self.getRabsystemsUser(true).then(() => {
                self.checkPermission();
                self.loading = false;
            })
        },
        returnSteps: function () {
            let self = this;

            api.get("/utils/get_tutorial_steps")
            .then(function(response){
                self.steps = response.data.returnObj;
            })
        },
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
        requireUser: function() { // Função retorna o usuário pelo id.
            let self = this;
            return new Promise((resolve, reject) => {
                api.get("/user/get_user").then((res) => {
                    self.$root.user = res.data.response.user;
                    resolve();
                })
            })
        },
        getRabsystemsUser: function (recursive = false) {
            return new Promise((resolve, reject) => {
                let self = this;

                self.requireUser().then(() => {
                    api.get("/user/get_rabsystems_user?with_last_message=true")
                    .then(function(response){
                        self.$root.rabsystemsUser = response.data.obj.user;
                        if (recursive) {
                            setTimeout(() => {
                                self.getRabsystemsUser(true);
                            }, 10 * 1000);
                        }
                        resolve();
                    })
                })
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
        let self = this;

        this.checkIfUserIsAuthenticated().then(() => {
            let interval = setInterval(() => {
                if (self.$root.jwtLoaded) {
                    clearInterval(interval);

                    self.initSystemRequests();
                }
            }, 100)
        }).catch(() => {})
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