<template>
    <div class="mail-queue">
        <table>
            <thead>
                <tr>
                    <th class="text-start">Título email</th>
                    <th class="text-start">Destinatário</th>
                    <td class="sort-button" id="sort-by-date" v-on:click="sortDataEmails('date', 'sort-by-date')" sortStatus="down">
                        <strong>Envio</strong>
                        <i class="fas fa-sort-down sort-icon"></i>
                    </td>
                    <th>Remetente</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in mailQueue" v-bind:key="index">
                    <td class="text-ellipsis text-start" :title="item.subject_name">{{ item.subject_name }}</td>
                    <td class="text-start">{{ item.receiver_email }}</td>
                    <td :title="getMomentExtended(item.send_date)">{{ getMoment(item.send_date) }}</td>
                    <td>{{ item.sender_name }}</td>
                    <td>
                        <div class="badge" :style="returnStatus(item.status, true)">
                            {{ returnStatus(item.status) }}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';
import $ from 'jquery';

export default {
    name: "returnMailQueue",
    mixins: [globalMethods],
    data() {
        return {
            mailQueue: []
        }
    },
    methods: {
        sortDataEmails: function (sortType, sortId, responsive = false) {
            let element = $("#" + sortId);
            this.sortType = sortType;
            this.toggleSortStatusEmails(sortType, element, responsive);
        },
        toggleSortStatusEmails: function (sortType, element, responsive) {
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
                this.filterEmails(sortType, this.sortStatus);
            } else if (status == "up") {
                this.sortStatus = "down";
                element.attr("sortStatus", "down");
                if (!responsive) {
                    iElement.removeClass("fa-sort-up");
                    iElement.addClass("fa-sort-down");
                    iElement.css("margin-top", "-7px");
                }
                this.filterEmails(sortType, this.sortStatus);
            } else {
                return;
            }
        },
        filterEmails: function (sortType, sortOrder) {
            let newEmails = [];
            switch (sortType) {
                case "date":
                if (sortOrder == "up") {
                    newEmails = this.mailQueue.sort((order1, order2) => (order1.send_date < order2.send_date) ? 1 : (order1.send_date > order2.send_date) ? -1 : 0);
                    } else {
                        newEmails = this.mailQueue.sort((order1, order2) => (order1.send_date < order2.send_date) ? -1 : (order1.send_date > order2.send_date) ? 1 : 0);
                    }
                    break;
                default: 
                    return;
            }
            this.mailQueue = newEmails;
        },
        getMailQueue: function () {
            let self = this;
            api.get("/newsletter/mail_queue")
            .then(function(response){
                self.mailQueue = response.data.obj;
                setTimeout(() => {
                    self.getMailQueue();
                }, 10 * 1000)
            }).catch(function(error){
                console.log(error);
            })
        },
        returnStatus: function (status, badge = false) {
            let colorBadge = "";
            let text = "";

            if (badge) {
                if (status == 0) {
                    colorBadge = "background: var(--gray-high-2); color: var(--black)";
                } else {
                    colorBadge = "background: var(--green-high); color: var(--green-low)"; 
                }
                return colorBadge;
            }

            if (status == 0) {
                    text = "Na fila";
                } else {
                    text = "Enviado"; 
                }
                return text;
        }
    },
    mounted: function () {
        this.getMailQueue();
    }
}
</script>
<style scoped>
</style>