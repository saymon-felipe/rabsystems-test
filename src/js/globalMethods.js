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
            this.checkAndSetJwt();
        },
        checkAndSetJwt: function() {
            let interval = setInterval(() => {
                let jwt = this.getJwtInLocalStorage();
                if (jwt != null) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
                    this.$root.jwtLoaded = true;
                    clearInterval(interval);
                }
            }, 100)
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
        toggleResponsiveFilter: function () {
            if ($(".responsive-filter-container").is(":visible")) {
                $(".responsive-filter-container").css("opacity", 0);
                $(".responsive-filter-wrapper").hide();
                
                setTimeout(() => {
                    $(".responsive-filter-container").hide();
                }, 400);
            } else {
                $(".responsive-filter-container").show();
                $(".responsive-filter-wrapper").show();
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
        sortDataOrder: function (sortType, sortId, responsive = false) {
            let element = $("#" + sortId);
            this.sortType = sortType;
            this.toggleSortStatusOrder(sortType, element, responsive);
        },
        returnRelativeTime: function (date) {
            return moment(date).fromNow();
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
        getMoment: function (date) {
            return moment(date).fromNow();
        },
        getMomentExtended: function (date) {
            return moment(date).format('LLLL');
        },
        toggleSortStatusOrder: function (sortType, element, responsive) {
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
            })
        },
        checkIfUserIsAuthenticated: function () {
            return new Promise((resolve, reject) => {
                let self = this;
                let jwt = "Bearer " + self.getJwtInLocalStorage();

                if (jwt == "Bearer null") {
                    if (window.location.pathname.indexOf("/login") == -1) {
                        self.logoutUser();
                    }
                } else {
                    let user_out = $("body").hasClass("hidden");
                    api.post("/user/check_jwt", {user_out: user_out}, {
                        headers: {
                            Authorization: jwt
                        }
                    })
                    .then(function(response){
                        self.setJwtInLocalStorage(response.data.new_token);
                        console.log("Authenticated user. JWT check in " + new Date());
                        if (response.data.user.incomplete_registration == "true") {
                            if (self.$route.path != "/complete-registration") {
                                self.$router.push("/complete-registration");
                            }
                        } else {
                            if (window.location.pathname == "/login") {
                                self.$router.push('/my-orders');
                            }
                        }
                        
                        resolve();
                    }).catch(function(){
                        console.log("Unauthenticated user. JWT check in " + new Date());
                        self.logoutUser();
                    }).then(() => {
                        setTimeout(() => {
                            self.checkIfUserIsAuthenticated();
                        },  20 * 1000); // Repetição da função a cada 20 segundos
                    })
                }
            })
        },
        returnOrderService: function (service) {
            let returnService = "";
            switch (service) {
                case "website-design":
                    returnService = this.$i18n.t("my_orders.site_design");
                    break;
                case "traffic-management":
                    returnService = this.$i18n.t("my_orders.traffic_management");
                    break;
                case "web-maintenance":
                    returnService = this.$i18n.t("my_orders.web_maintenance");
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
        },
        viewPhoto: function (img_url = "") {
            if (img_url != "") {
                this.preview_photo = img_url;
            }
            $(".view-photo-container").css("display", "flex");
            setTimeout(() => {
                $(".overlay").show();
                $(".view-photo-container").css("opacity", 1).css("transform", "translateY(0)");
            }, 10);
        },
        closePhotoContainer: function () {
            $(".view-photo-container").css("opacity", 0).css("transform", "translateY(-100px)");
            
            setTimeout(() => {
                $(".overlay").hide();
                $(".view-photo-container").hide();
            }, 400);
        },
        hideSendPhotoContainer: function () {
            this.closeThisModal();
            this.resetModalVariables();
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