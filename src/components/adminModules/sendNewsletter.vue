<template>
    <div class="send-newsletter">
        <p class="page-title page-title-left">Selecione os usuários para o qual deseja enviar</p>
        <div class="select-users-container  animate__animated">
            <returnUsersDataTable :showSelect="true" @submit_users="storeUserEmails($event)" />
        </div>
    </div>
</template>
<script>
import returnUsersDataTable from "../returnUsersDataTable.vue";
import $ from 'jquery';

export default {
    name: "sendNewsletter",
    data() {
        return {
            userEmails: []
        }
    },
    methods: {
        storeUserEmails: function (obj) {
            let selectUsersContainer = $(".select-users-container");
            selectUsersContainer.addClass("animate__backOutLeft");
            this.userEmails = obj;
            console.log(this.userEmails)
        }
    },
    components: {
        returnUsersDataTable
    }
}
</script>
<style scoped>
</style>