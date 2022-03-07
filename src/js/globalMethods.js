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
            let chat = $(".rabsystems-chat");

            chat.show();
            setTimeout(() => {
                chat.css("opacity", 1);
            }, 10);
        },
        removeJwtInLocalStorage: function (from_logout_button) {
            if (!from_logout_button) {
                this.logoutUser();
            }
            localStorage.removeItem("rabsystems_jwt");
        },
        logoutUser: function (from_logout_button) {
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();
            api.patch("/user/logout", "", {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function () {
                self.removeJwtInLocalStorage(from_logout_button);
                self.$router.push("/login");
            })
            .catch(function (error) {
                console.log(error)
            })
        },
    },
    data() {
        return {
            rabsystems_owner_id: 3
        }
    }
}