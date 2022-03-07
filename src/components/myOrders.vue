<template>
    <section class="my-orders">
        <div class="page-title">
            <h1 class="rabsystems-font">Meus pedidos</h1>
        </div>
        <table class="order-list">
            <tr class="order-list-head">
                <td>Nome</td>
                <td>Id</td>
                <td>
                    Data
                    <i class="fas fa-sort-down"></i>
                </td>
                <td>Serviço</td>
                <td>
                    Preço
                    <i class="fas fa-sort-down"></i>
                </td>
                <td>
                    Status
                    <i class="fas fa-sort-down"></i>
                </td>
            </tr>
            <tr class="empty" v-if="orders.length == 0">
                <td>Você ainda não fez nenhum pedido</td>
            </tr>
            <div class="responsive-filter" v-on:click="showResponsiveFilter()">
                <i class="fas fa-filter" title="Filtrar por"></i>
                <div class="responsive-filter-container">
                    <ul>
                        <li>Data</li>
                        <li>Preço</li>
                        <li>Status</li>
                    </ul>
                </div>
            </div>
            <div class="orders-list">
                <div :id="'order-' + order.id" v-for="order in orders" :key="order.id">
                    <router-link class="order" :to="'/order-details/' + order.id">
                        <td class="order-name" :title="order.user_name"><strong>{{ order.user_name }}</strong></td>
                        <td class="order-id">#{{ order.id }}</td>
                        <td class="order-date" :title="getMomentExtended(order.create_date)">{{ getMoment(order.create_date) }}</td>
                        <td class="order-title" :title="order.service">{{ order.service }}</td>
                        <td class="order-price"><strong>R$</strong> {{ order.price == 0 ? "--,--" : order.price }}</td>
                        <td :class="'order-status ' + findStatusClass(order.order_status)" :title="findStatus(order.order_status)">{{ findStatus(order.order_status) }}</td>
                    </router-link>
                    
                </div>
            </div>
        </table>
        <router-link class="new-order" to="/new-order" v-if="rabsystemsUser.id != user.id">
            <i class="fas fa-plus-circle"></i>
            <h5>Novo pedido</h5>
        </router-link>
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
            user: {},
            rabsystemsUser: {}
        }
    },
    methods: {
        getRabsystemsUser: function () {
            let self = this;
            api.get("/user/get_rabsystems_user")
            .then(function(response){
                self.rabsystemsUser = response.data.response.user;
                self.loadUser();
            }).catch(function(error){
                console.log(error);
            })
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
                    self.returnOrders();
                }).catch(function(error){
                    console.log(error);
                })
            }
        },
        getMoment: function (date) {
            moment.locale("pt-br");
            return moment(date).fromNow();
        },
        getMomentExtended: function (date) {
            moment.locale("pt-br");
            return moment(date).format('LLLL');
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
        returnOrders: function () {
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();

            moment.locale("pt-br");
            // Status: 0 = aguardando pagamento
            // Status: 1 = Aguardando resposta
            // Status: 2 = Em andamento
            // Status: 3 = Concluído
            // Status: 4 = Cancelado

            if (self.user.id == self.rabsystemsUser.id) {
                api.get("/orders/return_all_orders", {
                    headers: {
                            Authorization: jwt
                        }
                })
                .then(function(response){
                    self.orders = response.data.response.all_orders;
                }).catch(function(error){
                    console.log(error);
                })
            } else {
                api.get("/orders", {
                    headers: {
                            Authorization: jwt
                        }
                })
                .then(function(response){
                    self.orders = response.data.response.all_orders;
                }).catch(function(error){
                    console.log(error);
                })
            }
            

            setInterval(() => {
                //self.returnOrders();
                self.fillRelativeTime();
            }, 60 * 1000);
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
                    return "Aguardando resposta";
                case 1:
                    return "Aguardando pagamento";
                case 2:
                    return "Em andamento";
                case 3:
                    return "Concluído"
                case 4: 
                    return "Cancelado";
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
    },
    mounted() {
        this.getRabsystemsUser();
    }
}
</script>

<style scoped>
    
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
        max-height: 52vh;
    }

    .responsive-filter {
        display: none;
        position: relative;
    }

    .responsive-filter-container {
        background: var(--white);
        padding: 0 2rem;
        border-radius: 7px;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        position: absolute;
        left: -550%;
        top: 0;
        display: none;
        opacity: 0;
        transition: all 0.4s;
    }

        .responsive-filter-container ul {
            list-style: none;
        }

            .responsive-filter-container ul li {
                display: flex;
                justify-content: center;
                font-size: 1.2rem;
                margin: 1rem 0;
            }

    .order-list {
        margin-top: 2rem;
        width: 100%;
        cursor: pointer;
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

            .order-list-head td i {
                margin-top: -7px;
                margin-left: 4px;
            }

        .order-list-head td {
            width: 15%;
        }

        .order-list-head td:nth-child(4) {
            width: 30%;
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
        height: 50px;
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