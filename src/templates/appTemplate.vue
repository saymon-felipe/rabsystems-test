<template>
    <div class="container">
        <headerAppComponent :user="user" />
        <slot />
    </div>
</template>

<script>
import headerAppComponent from "../components/headerApp.vue";
import { globalMethods } from '../js/globalMethods';
import api from '../configs/api.js';
import $ from 'jquery';

export default {
    name: 'siteTemplate',
    mixins: [globalMethods],
    data() {
        return {
            user: {}
        }
    },
    components: {
        headerAppComponent
    },
    methods: {
        checkIfUserIsAuthenticated: function () {
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();
            if (self.$router.history.current.path != "/login" && self.$router.history.current.path != "/register") {
                if (jwt == "Bearer null") {
                    self.$router.push("/login");
                } else {
                    api.get("/user/check_jwt", {
                        headers: {
                                Authorization: jwt
                            }
                    })
                    .then(function(response){
                        console.log("Authenticated user. JWT check in " + new Date());
                        if (response.data.response.user.incomplete_registration == "true") {
                            if (self.$route.path != "/complete-registration") {
                                self.$router.push("/complete-registration");
                            }
                        }
                    }).catch(function(){
                        console.log("Unauthenticated user. JWT check in " + new Date());
                        self.remo
                        self.$router.push("/login");
                    }).then(function () {
                        setTimeout(() => {
                            self.checkIfUserIsAuthenticated();
                        }, 20 * 1000); // Repetição da função a cada 20 segundos
                    })
                }
            }
        },
        loadUser: function () {
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();

            if (self.$route.path != "/login" && self.$route.path != "/register") {
                api.get("/user/get_user", {
                    headers: {
                            Authorization: jwt
                        }
                })
                .then(function(response){
                    self.user = response.data.response.user;
                    self.isDefaultPhoto(self.user.profile_photo);
                }).catch(function(error){
                    console.log(error);
                })
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
    beforeMount() {
        this.loadUser();
    },
    mounted() {
        this.checkIfUserIsAuthenticated();
    }
}
</script>

<style scoped>

</style>