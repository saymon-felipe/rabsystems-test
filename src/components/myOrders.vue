<template>
    <section class="my-orders">
        <div class="page-title">
            <h1 class="rabsystems-font">{{ $t("my_orders.my_orders") }}</h1>
        </div>
        <table class="order-list">
            <tr class="order-list-head">
                <td>{{ $t("my_orders.name") }}</td>
                <td>{{ $t("my_orders.id") }}</td>
                <td class="sort-button" id="sort-by-date" v-on:click="sortData('date', 'sort-by-date')" sortStatus="down">
                    {{ $t("my_orders.date") }}
                    <i class="fas fa-sort-down sort-icon"></i>
                </td>
                <td>{{ $t("my_orders.service") }}</td>
                <td class="sort-button" id="sort-by-price" v-on:click="sortData('price', 'sort-by-price')" sortStatus="down">
                    {{ $t("my_orders.price") }}
                    <i class="fas fa-sort-down sort-icon"></i>
                </td>
                <td class="sort-button" id="sort-by-status"  v-on:click="sortData('status', 'sort-by-status')" sortStatus="down">
                    {{ $t("my_orders.status") }}
                    <i class="fas fa-sort-down sort-icon"></i>
                </td>
            </tr>
            <tr class="empty" v-if="orders.length == 0">
                <td>{{ $t("my_orders.empty_orders") }}</td>
            </tr>
            <div class="responsive-filter" v-on:click="showResponsiveFilter()">
                <i class="fas fa-filter" title="Filtrar por"></i>
                <div class="responsive-filter-container">
                    <ul>
                        <li class="sort-button" id="sort-by-date-responsive" v-on:click="sortData('date', 'sort-by-date-responsive', true)" sortStatus="down">{{ $t("my_orders.date") }}</li>
                        <li class="sort-button" id="sort-by-price-responsive" v-on:click="sortData('price', 'sort-by-price-responsive', true)" sortStatus="down">{{ $t("my_orders.price") }}</li>
                        <li class="sort-button" id="sort-by-status-responsive" v-on:click="sortData('status', 'sort-by-status-responsive', true)" sortStatus="down">{{ $t("my_orders.status") }}</li>
                    </ul>
                </div>
            </div>
            <tr>
                <td>
                    <div class="orders-list">
                        <div :id="'order-' + order.order_id" v-for="(order, index) in orders" :key="index">
                            <router-link class="order" :to="'/order-details/' + order.order_id">
                                <td class="notification" v-if="order.order_status != 4"></td>
                                <td class="order-name" :title="order.user_name"><strong>{{ order.user_name }}</strong></td>
                                <td class="order-id">#{{ order.order_id }}</td>
                                <td class="order-date" :title="getMomentExtended(order.create_date)">{{ getMoment(order.create_date) }}</td>
                                <td class="order-title" :title="returnOrderService(order.service)">{{ returnOrderService(order.service) }}</td>
                                <td class="order-price">{{ order.price == "" ? "--,--" : "R$ " + order.price }}</td>
                                <td :class="'order-status ' + findStatusClass(order.order_status)" :title="findStatus(order.order_status)">{{ findStatus(order.order_status) }}</td>
                            </router-link>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
        <router-link class="new-order" to="/new-order" v-if="!$root.havePermission">
            <i class="fas fa-plus-circle"></i>
            <h5>{{ $t("my_orders.new_order") }}</h5>
        </router-link>
        <audio src="../assets/audio/message_notification.ogg" id="notification-audio" preload="auto"></audio>
    </section>
</template>

<script>
import $ from 'jquery';
import moment from 'moment';
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "myOrders",
    mixins: [globalMethods],
    data() {
        return {
            orders: [],
            new_messages_notification_number: 0,
            first_check_message: true
        }
    },
    mounted: function () {
        this.returnOrders();
    },
    methods: {
        fillNewMessageNotification: function (order_list) {
            let play_audio = false;
            let audioElement = $("#notification-audio")[0];

            for (let i = 0; i < order_list.length; i++) {
                let notification_element = $("#order-" + order_list[i].order_id + " .notification");
                notification_element.attr("style", "display: flex !important");
                play_audio = true;
            }

            if (this.first_check_message) {
                this.new_messages_notification_number = order_list.length;
                this.first_check_message = false;
            }
            
            if ((this.first_check_message && play_audio) || (this.new_messages_notification_number != order_list.length && play_audio)) {
                this.new_messages_notification_number = order_list.length;
                if (audioElement != undefined) {
                    audioElement.play().catch(() => {});
                }
                play_audio = false;
            }
        },
        checkNewMessages: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();

            api.get("messages/check_order_new_message", {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function (response) {
                self.fillNewMessageNotification(response.data.message_list);
            })
        },
        getMoment: function (date) {
            return moment(date).fromNow();
        },
        getMomentExtended: function (date) {
            return moment(date).format('LLLL');
        },
        returnOrders: function () {
            let self = this;

            // Status: 0 = aguardando pagamento
            // Status: 1 = Aguardando resposta
            // Status: 2 = Em andamento
            // Status: 3 = Concluído
            // Status: 4 = Cancelado
            if (self.$root.user.id == undefined || self.$root.rabsystemsUser.id == undefined) {
                setTimeout(() => {
                    self.returnOrders();
                }, 100)
                return;
            }

            let endpoint = "/orders";

            if (self.$root.havePermission) {
                endpoint = "/orders/return_all_orders";
            }

            api.get(endpoint)
            .then(function(response){
                self.orders = response.data.obj.all_orders;
                self.checkNewMessages();
                self.filterOrders(self.sortType, self.sortStatus);
            }).catch(function(error){
                console.log(error);
            })
            
            setTimeout(() => {
                self.returnOrders();
                self.fillRelativeTime();
            }, 10 * 1000);
        },
        fillRelativeTime: function () {
            let self = this;
            for (let i in self.orders) {
                $("#order-" + self.orders[i].id + " .order-date").html(moment(self.orders[i].create_date).fromNow());
            }
        },
        findStatus: function (status) {
            switch (status) {
                case 0:
                    return this.$i18n.t("my_orders.waiting_answer");
                case 1:
                    return this.$i18n.t("my_orders.waiting_payment");
                case 2:
                    return this.$i18n.t("my_orders.in_progress");
                case 3:
                    return this.$i18n.t("my_orders.finished");
                case 4: 
                    return this.$i18n.t("my_orders.canceled");
            }
        },
        findStatusClass: function (status) {
            switch (status) {
                case 0:
                    return "waiting-answer";
                case 1:
                    return "pending-payment";
                case 2:
                    return "in-progress";
                case 3:
                    return "finished"
                case 4: 
                    return "canceled";
            }
        }
    }
}
</script>

<style scoped>
    .notification {
        /*display: flex;*/
        display: none !important;
        justify-content: center;
        align-items: center;
        position: relative;
    }

        .notification::before, .notification::after {
            content: "";
            top: 0;
            bottom: 0;
            left: -5px;
            right: 0;
            margin: auto;
            position: absolute;
            width: 12px;
            height: 12px;
        }

        .notification::before {
            animation-name: pulse;
            animation-duration: 2s;
            animation-iteration-count: infinite;
            animation-timing-function: ease;
            border-radius: 50%;
        }

        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 1px rgba(255, 55, 55, 0.836);
            }
            100% {
                box-shadow: 0 0 0 15px rgba(255, 55, 55, 0);
            }
        }

        .notification::after {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--red);
        }

    .my-orders {
        width: calc(100% - 225px);
        height: 100%;
        padding: 1rem;
        text-align: center;
        background: var(--white);
        position: absolute;
        right: 0;
    }

    @media (max-width: 876px) {
        .my-orders {
            width: 100%;
        }
    }

    .orders-list {
        overflow-y: auto;
        height: 71vh;
    }

    .new-order {
        color: var(--black);
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        width: 15rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.4s;
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1.5rem;
        cursor: pointer;
    }

        .new-order:hover {
            background: var(--gray-high);
        }

        .new-order i {
            font-size: 1.7rem;
            margin-right: 1.5rem;
        }

        .new-order h5 {
            font-size: 1.4rem;
            font-weight: 500;
        }

    .order-list-head td:nth-child(4) {
        width: 30%;
    }

    .order-list {
    margin-top: 2rem;
    width: 100%;
    height: 80%;
    position: relative;
}

.order-list-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: .5rem;
    padding: 0 1rem;
    font-weight: 600;
}

    .order-list-head td {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 15%;
    }

    .order-list-head td {
        width: 15%;
    }

.empty {
    padding: 1rem;
    height: 50px;
    background: var(--gray-high-2);
}

    .empty td {
        width: 100%;
        text-align: center;
    }

.order {
    background: var(--gray-high-3);
    color: #000 !important;
    padding: .8rem;
    border-bottom: 1px solid var(--gray-high);
    display: flex;
    justify-content: space-between;
}

    .order:hover {
        background: var(--gray-high-2);
    }

    .order td {
        text-align: center;
        display: block;
    }

.order:last-child {
    border: none;
}

.order-id {
    font-weight: 600;
    width: 15%;
}

.order-date, .order-status, .order-name {
    width: 15%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.order-title {
    text-decoration: underline;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 30%;
}

.order-price {
    width: 15%;
}

.order-status {
    width: 15%;
}

@media (max-width: 707px) {
    .order {
        display: flex;
        height: auto;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 2rem;
    }

        .order td {
            width: auto;
            margin: 1rem;
        }

    .order-list-head {
        display: none;
    }

    .responsive-filter {
        display: block;
        position: absolute;
        right: 1rem;
        top: -2.5rem;
        font-size: 1.5rem;
    }
}
</style>