import $ from 'jquery';
import api from '../configs/api.js';

export const globalMethods = {
    methods: {
        setJwtInLocalStorage: function (jwt) {
            localStorage.setItem("rabsystems_jwt", jwt);
        },
        getJwtInLocalStorage: function () {
            return localStorage.getItem("rabsystems_jwt");
        },
        openChatComponent: function () {
            this.showChat = true;
            setTimeout(() => {
                let chat = $(".rabsystems-chat");
                chat.show();
                setTimeout(() => {
                    chat.css("opacity", 1);
                }, 10);
            }, 20);
        },
        removeJwtInLocalStorage: function () {
            localStorage.removeItem("rabsystems_jwt");
        },
        logoutUser: function () {
            let self = this
            api.patch("/user/logout", {user_id: self.user.id})
            .then(function () {
                self.removeJwtInLocalStorage();
                self.$router.push("/login");
                self.$router.go();
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        requireUser: async function() { // Função retorna o usuário pelo id.
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();
            if (self.$route.path != "/login" && self.$route.path != "/register") {
                self.user = await api.get("/user/get_user", { headers: { Authorization: jwt } }).then(res => res.data.response.user);
            }
        },
        getRabsystemsUser: function (recursive = false) {
            let self = this;
            api.get("/user/get_rabsystems_user")
            .then(function(response){
                self.rabsystemsUser = response.data.response.user;
                self.requireUser();
                if (recursive) {
                    setTimeout(() => {
                        self.getRabsystemsUser();
                    }, 30 * 1000);
                }
            }).catch(function(error){
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.getRabsystemsUser();
    },
    data() {
        return {
            user: {},
            rabsystemsUser: {},
            user_id: null,
            showChat: false
        }
    }
}