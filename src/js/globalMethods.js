import $ from 'jquery';
//import api from '../configs/api.js';

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