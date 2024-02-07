<template>
    <section class="financial">
        <div class="page-title">
            <h1 class="rabsystems-font">{{ $t("financial.financial") }}</h1>
        </div>
        <div class="responsive-filter" v-on:click="toggleResponsiveFilter()">
            <i class="fas fa-filter" title="Filtrar por"></i>
            <div class="responsive-filter-container">
                <ul>
                    <li class="sort-button" id="sort-by-price-responsive" v-on:click="sortData('price', 'sort-by-price-responsive', true)" sortStatus="down">{{ $t("financial.price") }}</li>
                    <li class="sort-button" id="sort-by-status-responsive" v-on:click="sortData('status', 'sort-by-status-responsive', true)" sortStatus="down">{{ $t("financial.status") }}</li>
                </ul>
            </div>
        </div>
        <div class="responsive-filter-wrapper" v-on:click="toggleResponsiveFilter()"></div>
        <div class="charges-list">
            <table>
                <tr class="order-list-head">
                    <td>{{ $t("financial.id") }}</td>
                    <td class="sort-button" id="sort-by-price" v-on:click="sortData('price', 'sort-by-price')" sortStatus="down">
                        {{ $t("financial.price") }}
                        <i class="fas fa-sort-down sort-icon"></i>
                    </td>
                    <td class="sort-button" id="sort-by-status"  v-on:click="sortData('status', 'sort-by-status')" sortStatus="down">
                        {{ $t("financial.situation") }}
                        <i class="fas fa-sort-down sort-icon"></i>
                    </td>
                </tr>
                <tr class="empty" v-if="orders.length == 0">
                    <td>{{ $t("financial.dint_order") }}</td>
                </tr>
                <tr class="order" v-for="(order, index) in orders" :key="index">
                    <td class="order-id">#{{ order.order_id }}</td>
                    <td class="order-price">{{ order.price == 0 ? "--,--" : order.price }}</td>
                    <td class="buttons">
                        <button v-if="order.order_status == 0" v-on:click="payOrder(order.id)" :disabled="order.order_status == 0 ? 'disabled' : false">{{ $t("financial.pay") }}</button>
                        <h6 v-if="order.order_status != 0 && order.order_status != 4" class="finished">{{ $t("financial.paid") }}</h6>
                        <h6 v-if="order.order_status == 4" class="canceled">{{ $t("financial.canceled") }}</h6>
                    </td>
                </tr>
            </table>
        </div>
    </section>
</template>

<script>
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "financial",
    mixins: [globalMethods],
    data() {
        return {
            orders: []
        }
    },
    methods: {
        getOrders: function () {
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();

            api.get("/orders", {
                headers: {
                        Authorization: jwt
                    }
            })
            .then(function(response){
                self.orders = response.data.obj.all_orders;
            }).catch(function(error){
                console.log(error);
            })
        },
        payOrder: function (order_id) {
            console.log("Pay order: " + order_id);
        }
    },
    mounted() {
        this.getOrders();
    }
}
</script>

<style scoped>

    .empty {
        padding: 1rem;
        height: 50px;
        background: var(--gray-high-2);
    }

        .empty td {
            width: 100%;
            text-align: center;
        }

    .financial {
        width: calc(100% - 225px);
        height: 100%;
        padding: 1rem;
        text-align: center;
        background: var(--white);
        position: absolute;
        right: 0;
    }

    @media (max-width: 876px) {
        .financial {
            width: 100%;
        }
    }

    table {
        width: 100%;
    }

    .order-list-head {
        width: 100%;
        display: flex;
        margin: .5rem 0;
        font-weight: 600;
    }

        .order-list-head td {
            width: 33%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

    .order {
        background: var(--gray-high-3);
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        border-bottom: 1px solid var(--gray-high);
        cursor: pointer;
    }

        .order:last-child {
            border: none;
        }

        .order:hover {
            background: var(--gray-high-2);
        }

    .order-id {
        font-weight: 600;
    }

    .order-id, .order-price, .buttons {
        width: 33%;
        min-width: 7rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .buttons button {
        padding: .1rem .5rem;
        border-radius: 7px;
        border: none;
        cursor: pointer;
        background: var(--red);
        color: var(--white);
    }

        .buttons button:hover {
            background: var(--red-low);
        }

    .charges-list {
        overflow-y: auto;
        height: 80vh;
    }

    h6 {
        margin: 0;
    }

    @media (max-width: 436px) {
        .order {
            height: auto;
            padding: 1rem;
        }

        .order-id, .order-price, .buttons {
            margin: .4rem;
        }

        .order-list-head {
            display: none;
        }

        table {
            margin-top: 2rem;
        }

        .responsive-filter {
            display: block;
            position: absolute;
            top: 54px;
            right: 59px;            
            font-size: 1.5rem;
        }
    }
</style>