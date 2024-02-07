<template>
    <section class="ticket">
        <div class="page-title">
            <h1 class="rabsystems-font">{{ $t("my_tickets.details") }}</h1>
        </div>
        <div class="order-details-container">
            <div class="order-details-informations">
                <table class="order">
                    <tr class="order-head">
                        <td>{{ $t("my_tickets.id") }}</td>
                        <td>{{ $t("my_tickets.subject") }}</td>
                        <td>{{ $t("my_tickets.contact_type") }}</td>
                        <td>{{ $t("my_tickets.request_date") }}</td>
                        <td>{{ $t("my_tickets.status") }}</td>
                    </tr>
                    <tr class="order-table-details">
                        <td>#{{ ticket.id }}</td>
                        <td :title="ticket.subject"><strong>{{ ticket.subject }}</strong></td>
                        <td :title="ticket.contact_type">{{ ticket.contact_type }}</td>
                        <td :title="getMomentExtended(ticket.request_date)">{{ getMoment(ticket.request_date) }}</td>
                        <td class="order-name" :title="getTicketStatus(ticket.status)">{{ getTicketStatus(ticket.status) }}</td>
                    </tr>
                </table>
                <div class="order-description">
                    <h1>{{ $t("my_tickets.description") }}</h1>
                    <p v-html="ticket.description"></p>
                </div>
                <div class="order-details-buttons">
                    <button v-on:click="finishTicket()" v-if="ticket.status == 0 && $root.havePermission" id="finish-ticket">{{ $t("my_tickets.finish") }}</button>
                </div>
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
            ticket: {}
        }
    },
    methods: {
        finishTicket: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();

            api.post("/support/my_tickets/finish_ticket/" + self.$route.params.id, {
                headers: {
                    Authorization: jwt
                }
            }).then(() => {
                self.$router.push("/requests");
            }).catch((error) => {
                console.log(error);
            })
        },
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
        getTicket: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();

            api.get("/support/my_tickets/" + self.$route.params.id, {
                headers: {
                    Authorization: jwt
                }
            }).then((response) => {
                self.ticket = response.data.returnObj;
                self.ticket.description = self.ticket.description.replace(/\\n/g, '<br>');
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.getTicket();
    }
}
</script>
<style scoped>
.ticket {
    width: calc(100% - 225px);
    height: 95%;
    padding: 1rem;
    text-align: center;
    background: var(--white);
    position: absolute;
    overflow-x: hidden;
    right: 0;
}

@media (max-width: 876px) {
    .ticket {
        width: 100%;
    }
}

.order-details-informations {
    margin-top: 3rem;
}

.order {
    width: 100%;
}

.order-head td {
    font-weight: 700;
    font-size: 1.3rem;
}

.order-table-details {
    width: 100%;
}

    .order-table-details td {
        width: 25%;
        max-width: 300px;
        padding-top: 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .order-description {
        margin-top: 3rem;
    }

        .order-description h1 {
            font-size: 1.4rem;
            font-weight: 700;
        }

        .order-description p {
            text-align: left;
            word-break: break-word;
        }

    .order-details-container {
        margin-top: 2rem;
        max-width: 75%;
        display: inline-block;
        border-radius: 2rem;
        padding: 1.2rem;
        position: relative;
    }

@media (max-width: 1200px) {

    .order-table-details td {
        max-width: 200px;
    }
}

@media (max-width: 876px) {
    .order-details-container {
        margin-top: 0;
        max-width: 100%;
        width: 100%;
    }

    .order-table-details td {
        max-width: 100px;
    }
}

@media (max-width: 500px) {
    .order-table-details {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: auto;
        font-size: 1.3rem;
    }

    .order-table-details td {
        max-width: 86vw;
    }

    .order-head {
        display: none;
    }

        .order-table-details td {
            width: 100%;
        }

    .order-details-container {
        height: 90px;
    }
}

.order-details-buttons {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        margin-top: 3rem;
    }

        .order-details-buttons button {
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            margin: 1rem;
            transition: all 0.4s;
            color: var(--black);
            background: var(--gray-high-2);
        }

        .order-details-buttons #finish-ticket {
            background: var(--purple);
            color: var(--white);
        }

            .order-details-buttons #finish-ticket:hover {
                background: var(--purple-low);
            }
</style>