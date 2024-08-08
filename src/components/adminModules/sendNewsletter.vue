<template>
    <div class="send-newsletter">
        <div class="select-newsletter-container animate__animated">
            <p class="page-title page-title-left">Selecione um modelo de newsletter</p>
            <returnNewsletterDataTable :edit="false" :returnClick="true" @select_newsletter="selectNewsletter($event)" />
            <div class="submit-container">
                <button type="button" v-if="selectedNewsletter != null" class="btn primary" v-on:click="storeNewsletterModel()">Selecionar modelo</button>
            </div>
        </div>
        <div class="select-users-container animate__animated">
            <p class="page-title page-title-left">Selecione os usuários para o qual deseja enviar</p>
            <returnUsersDataTable :showSelect="true" @submit_users="storeUserEmails($event)" />
        </div>
        <p class="response"></p>
        <div class="loading"></div>
    </div>
</template>
<script>
import returnUsersDataTable from "../returnUsersDataTable.vue";
import returnNewsletterDataTable from '../returnNewsletterDataTable.vue';
import api from '../../configs/api.js';
import $ from 'jquery';

export default {
    name: "sendNewsletter",
    data() {
        return {
            userEmails: [],
            selectedNewsletter: null,
            selectedNewsletterType: null
        }
    },
    methods: {
        storeNewsletterModel: function () {
            let selectNewsletterContainer = $(".select-newsletter-container");
            let selectUsersContainer = $(".select-users-container");
            selectNewsletterContainer.addClass("animate__backOutLeft");
            setTimeout(() => {
                selectNewsletterContainer.hide();
                selectUsersContainer.show();
                setTimeout(() => {
                    selectUsersContainer.addClass("animate__backInRight");
                }, 10)
            }, 400)
        },
        selectNewsletter: function (event) {
            this.selectedNewsletter = event.id;
            this.selectedNewsletterType = event.type;
        },
        storeUserEmails: function (obj) {
            let self = this;
            let selectUsersContainer = $(".select-users-container");
            let loadingContainer = $(".loading");
            selectUsersContainer.removeClass("animate__backInRight");
            selectUsersContainer.addClass("animate__backOutLeft");
            self.userEmails = obj;
            loadingContainer.show();

            let data = {
                users: self.userEmails,
                newsletter_id: self.selectedNewsletter,
                mail_type: self.selectedNewsletterType
            }
            
            api.post("/newsletter/mail_queue", data)
            .then(function(){
                self.$emit("submitMailQueue");
            }).catch(function(error){
                console.log(error);
            })
        }
    },
    components: {
        returnUsersDataTable,
        returnNewsletterDataTable
    }
}
</script>
<style scoped>

.select-users-container, .mail-queue {
    display: none;
}
</style>