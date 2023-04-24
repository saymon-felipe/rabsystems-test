import $ from 'jquery';
import moment from 'moment';
import api from '../configs/api.js';

export const globalMethods = {
    methods: {
        logoutUser: function () {
            let self = this;
            self.removeJwtInLocalStorage();
            self.removeEmailInSessionStorage();
            self.$router.push("/login");
            self.$router.go();
        },
        submitFunction: function () {
            $("#submit-informations-form").click();
        },
        setEmailInSessionStorage: function (email) {
            sessionStorage.setItem("email", email);
        },
        getEmailInSessionStorage: function () {
            return sessionStorage.getItem("email");
        },
        removeEmailInSessionStorage: function () {
            sessionStorage.removeItem("email");
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
        },
        showResponsiveFilter: function () {
            if ($(".responsive-filter-container").is(":visible")) {
                $(".responsive-filter-container").css("opacity", 0);
                
                setTimeout(() => {
                    $(".responsive-filter-container").hide();
                }, 400);
            } else {
                $(".responsive-filter-container").show();
                setTimeout(() => {
                    $(".responsive-filter-container").css("opacity", 1);
                }, 10);
            }
        },
        filterOrders: function (sortType, sortOrder) {
            let newOrders = [];
            switch (sortType) {
                case "date":
                if (sortOrder == "up") {
                        newOrders = this.orders.sort((order1, order2) => (order1.create_date < order2.create_date) ? 1 : (order1.create_date > order2.create_date) ? -1 : 0);
                    } else {
                        newOrders = this.orders.sort((order1, order2) => (order1.create_date < order2.create_date) ? -1 : (order1.create_date > order2.create_date) ? 1 : 0);
                    }
                    break;
                case "price":
                    if (sortOrder == "up") {
                        newOrders = this.orders.sort((order1, order2) => (order1.price < order2.price) ? 1 : (order1.price > order2.price) ? -1 : 0);
                    } else {
                        newOrders = this.orders.sort((order1, order2) => (order1.price < order2.price) ? -1 : (order1.price > order2.price) ? 1 : 0);
                    }
                    break;
                case "status":
                    if (sortOrder == "up") {
                        newOrders = this.orders.sort((order1, order2) => (order1.order_status < order2.order_status) ? -1 : (order1.order_status > order2.order_status) ? 1 : 0);
                    } else {
                        newOrders = this.orders.sort((order1, order2) => (order1.order_status < order2.order_status) ? 1 : (order1.order_status > order2.order_status) ? -1 : 0);   
                    }
                    break;
                
                
                default: 
                    return;
            }
            this.orders = newOrders;
        },
        sortData: function (sortType, sortId, responsive = false) {
            let element = $("#" + sortId);
            this.sortType = sortType;
            this.toggleSortStatus(sortType, element, responsive);
        },
        resetFilters: function () {
            let elements = $(".sort-button");
            elements.each((index, item) => {
                let currentItem = $(item);
                let iElement = currentItem.find("i");
                iElement.removeClass("fa-sort-up");
                iElement.addClass("fa-sort-down");
                iElement.css("margin-top", "-7px");
                currentItem.attr("sortStatus", "down").attr("indexEl", index);
            })
        },
        toggleSortStatus: function (sortType, element, responsive) {
            let status = element.attr("sortStatus");
            let iElement;

            if (!responsive) {
                iElement = element.find("i");
            }

            this.resetFilters();

            if (status == "down") {
                this.sortStatus = "up";
                element.attr("sortStatus", "up");
                if (!responsive) {
                    iElement.removeClass("fa-sort-down");
                    iElement.addClass("fa-sort-up");
                    iElement.css("margin-top", "7px");
                }
                this.filterOrders(sortType, this.sortStatus);
            } else if (status == "up") {
                this.sortStatus = "down";
                element.attr("sortStatus", "down");
                if (!responsive) {
                    iElement.removeClass("fa-sort-up");
                    iElement.addClass("fa-sort-down");
                    iElement.css("margin-top", "-7px");
                }
                this.filterOrders(sortType, this.sortStatus);
            } else {
                return;
            }
        },
        setNewLanguage: function (language) {
            let localeLanguage = language;
            if (localeLanguage == "") {
                localeLanguage = navigator.language.split("-")[0];
            }
            this.$i18n.locale = localeLanguage;
            this.setNewLanguageInLocalStorage(localeLanguage);
            moment.locale(localeLanguage);
        },
        setNewLanguageInLocalStorage: function (language) {
            localStorage.setItem("lang", language);
        },
        excludePhoto: function (from_upload = false) {
            let self = this;

            api.patch("/user/exclude_photo", "")
            .then(function(response){
                if (!from_upload) {
                    location.reload();
                } else {
                    self.response = response.data.message;
                }
            }).catch(function(error){
                console.log(error);
            })
        },
        validateCpfInput: function (event) {
            let target = $("#" + event.target.id);
            let keycode = event.keyCode;

            if (!(keycode == 8 || keycode == 46)) {
                if (target.val().length < 11) {
                    if (!(keycode >= 48 && keycode <= 57 || keycode >= 96 && keycode <= 105)) {
                        event.preventDefault();
                        return;
                    }
                } else {
                    event.preventDefault();
                    return;
                }
            }
        },
        disableInputs: function () {
            $(".input-group input").attr("disabled", "disabled");
            $(".input-group select").attr("disabled", "disabled");
        },
        validateName: function (event) {
            let keycode = event.keyCode;

            if (keycode >= 48 && keycode <= 57 || keycode >= 96 && keycode <= 105) {
                event.preventDefault();
                return;
            }
        },
        formatCpf: function (event) {
            let target = $("#" + event.target.id), newValue = "";

            if (target.val().length == 11) {
                for (let i in target.val()) {
                    if (i == 3 || i == 6) {
                        newValue += "." + target.val()[i];
                    } else if (i == 9) {
                        newValue += "-" + target.val()[i];
                    } else {
                        newValue += target.val()[i];
                    }
                }

                target.val(newValue);
            }
        },
        restoreCpf: function (event) {
            let target = $("#" + event.target.id);

            if (target.val().length < 14) {
                target.val(target.val().replace(".", "").replace(".", "").replace("-", ""));
            }
        },
        getTelInputValue: function() { // Pega o valor do input removendo caracteres especiais e espaço para submit do formulário.
            let ddi = $(".current-flag-container .flag-item").attr("ddi");
            let number = $("#tel-input").val().replace("(", "").replace(")", "").replace("-", "").replace(" ", '').replace(" ", '');

            if (number == "") {
                return;
            }

            return `${ddi}${number}`;
        },
        validaCep: function (event) {
            let target = $("#" + event.target.id);
            let keycode = event.keyCode;

            if (!(keycode == 8 || keycode == 46)) {
                if (target.val().length >= 8) {
                    event.preventDefault();
                    return;
                }
            }         
        },
        refreshJwt: function () {
            let self = this;

            api.post("/user/refresh_jwt", "")
            .then(function(response){
                let refreshedToken = response.data.returnObj.token;
                self.setJwtInLocalStorage(refreshedToken);
            }).catch(function(error){
                console.log(error);
            })
        },
        checkIfUserIsAuthenticated: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();
            if (window.location.pathname != "/register") {
                if (jwt == "Bearer null") {
                    self.logoutUser();
                } else {
                    let user_out = $("body").hasClass("hidden");
                    api.post("/user/check_jwt", {user_out: user_out})
                    .then(function(response){
                        console.log("Authenticated user. JWT check in " + new Date());
                        if (response.data.user.incomplete_registration == "true") {
                            if (self.$route.path != "/complete-registration") {
                                self.$router.push("/complete-registration");
                            }
                        } else {
                            if (window.location.pathname == "/login") {
                                setTimeout(() => {
                                    self.$router.push('/my-orders');
                                }, 2 * 1000)
                            }
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
        returnOrderService: function (service) {
            let returnService = "";
            switch (service) {
                case "site":
                    returnService = this.$i18n.t("my_orders.site");
                    break;
                case "web-system":
                    returnService = this.$i18n.t("my_orders.web_system");
                    break;
                case "web-design":
                    returnService = this.$i18n.t("my_orders.web_design");
                    break;
                }
            return returnService;
        },
        returnFloatNumber(string) {
            let replacedString = string.toString();
            if (replacedString.indexOf("R$ ") != -1) {
                replacedString = replacedString.replace("R$ ", "");
            }
            let formattedNumber = parseFloat(replacedString.replace(",", "."));
            return formattedNumber.toFixed(2);
        }
    },
    data() {
        return {
            user_id: null,
            showChat: false,
            sortStatus: "up",
            sortType: "status"
        }
    }
}