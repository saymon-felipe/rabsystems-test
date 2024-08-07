<template>
    <div class="mail-queue">
        <table>
            <thead>
                <tr>
                    <th class="text-start">Título email</th>
                    <th class="text-start">Destinatário</th>
                    <th>Remetente</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in mailQueue" v-bind:key="index">
                    <td class="text-ellipsis text-start" :title="item.subject_name">{{ item.subject_name }}</td>
                    <td class="text-start">{{ item.receiver_email }}</td>
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

export default {
    name: "returnMailQueue",
    data() {
        return {
            mailQueue: []
        }
    },
    methods: {
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