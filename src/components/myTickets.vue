<template>
    <section class="my-tickets">
        <div class="page-title">
            <h1 class="rabsystems-font">{{ $t("my_tickets.my_tickets") }}</h1>
        </div>
        <div class="row">
            <div class="col-12">
                <table class="order-list">
                    <tr class="order-list-head">
                        <td>{{ $t("my_tickets.id") }}</td>
                        <td>{{ $t("my_tickets.subject") }}</td>
                        <td>{{ $t("my_tickets.description") }}</td>
                        <td>{{ $t("my_tickets.contact_type") }}</td>
                        <td>{{ $t("my_tickets.request_date") }}</td>
                        <td>{{ $t("my_tickets.status") }}</td>
                    </tr>
                    <tr class="empty" v-if="tickets.length == 0">
                        <td>{{ $t("my_orders.empty_orders") }}</td>
                    </tr>
                    <tr>
                        <td>
                            <div class="orders-list">
                                <div :id="'ticket-' + ticket.id" v-for="(ticket, index) in tickets" :key="index">
                                    <router-link class="order" :to="'/ticket-details/' + ticket.id">
                                        <td class="order-date">#{{ ticket.id }}</td>
                                        <td class="order-date" :title="ticket.subject"><strong>{{ ticket.subject }}</strong></td>
                                        <td class="order-date" :title="ticket.description">{{ ticket.description }}</td>
                                        <td class="order-date" :title="ticket.contact_type">{{ ticket.contact_type }}</td>
                                        <td class="order-date" :title="getMomentExtended(ticket.request_date)">{{ getMoment(ticket.request_date) }}</td>
                                        <td class="order-date" :title="getTicketStatus(ticket.status)">{{ getTicketStatus(ticket.status) }}</td>
                                    </router-link>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </section>
</template>
<script>
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';
import moment from 'moment';

export default {
    name: "myTickets",
    mixins: [globalMethods],
    data() {
        return {
            tickets: []
        }
    },
    methods: {
        getTicketStatus: function (status) {
            let text;

            switch (status) {
                case 1:
                    text = this.$i18n.t("my_tickets.finished");
                    break;
                case 2: 
                    text = this.$i18n.t("my_tickets.canceled");
                    break;
                default:
                    text = this.$i18n.t("my_tickets.in_progress");
                    break;
            }

            return text;
        },
        getMoment: function (date) {
            return moment(date).fromNow();
        },
        getMomentExtended: function (date) {
            return moment(date).format('LLLL');
        },
        getTickets: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();

            api.get("/support/my_tickets", {
                headers: {
                    Authorization: jwt
                }
            }).then((response) => {
                self.tickets = response.data.returnObj;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.getTickets();
    }
}
</script>
<style scoped>

    .my-tickets {
        width: calc(100% - 225px);
        height: 100%;
        padding: 1rem;
        text-align: center;
        background: var(--white);
        position: absolute;
        right: 0;
    }

    @media (max-width: 876px) {
        .my-tickets {
            width: 100%;
        }
    }

    .orders-list {
        overflow-y: auto;
        height: 71vh;
    }

.order-list {
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
            width: 76vw;
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