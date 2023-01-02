import $ from 'jquery';
//import api from '../configs/api.js';

export const globalMethods = {
    methods: {
        logoutUser: function () {
            let self = this;
            self.removeJwtInLocalStorage();
            self.$router.push("/login");
            self.$router.go();
        },
        submitFunction: function () {
            $("#submit-informations-form").click();
        },
        setJwtInLocalStorage: function (jwt) {
            localStorage.setItem("rabsystems_jwt", jwt);
        },
        getJwtInLocalStorage: function () {
            return localStorage.getItem("rabsystems_jwt");
        },
        closeChatComponent: function () {
            this.showChat = false;
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
        closeThisModal: function () {
            let modal = $(".modal-container");
            modal.css("opacity", 0).css("transform", "translateY(-100px)");
            
            this.resetModalVariables();
            setTimeout(() => {
                this.showModal = false;
            }, 400);
        },
        resetModalVariables: function () {
            this.modalTitle = "";
            this.modalButtonTitle = "";
            this.modalButtonTitle2 = "";
        },
        fillModalVariables: function (modalTitle, buttonTitle, button2Title) {
            this.modalTitle = modalTitle;
            this.modalButtonTitle = buttonTitle;
            this.modalButtonTitle2 = button2Title;
        }
    },
    data() {
        return {
            user_id: null,
            showChat: false
        }
    }
}