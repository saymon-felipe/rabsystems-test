<template>
    <div class="container">
        <headerAppComponent />
        <slot />
    </div>
</template>

<script>
import headerAppComponent from "../components/headerApp.vue";
import { globalMethods } from '../js/globalMethods';
import api from '../configs/api.js';
import $ from 'jquery';
import moment from 'moment';

export default {
    name: 'siteTemplate',
    mixins: [globalMethods],
    components: {
        headerAppComponent
    },
    methods: {
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
        }, 20);
    }
}

</script>

<style scoped>

</style>