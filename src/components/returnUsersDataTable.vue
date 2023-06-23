<template>
    <div class="datatable-users">
        <div class="select-or-deselect" v-if="showSelect">
            <p v-on:click="selectAll()">Selecionar todos</p>
            <p v-on:click="descelectAll()">Descelecionar todos</p>
        </div>
        <table>
            <thead>
                <th v-if="showSelect">&nbsp;</th>
                <th>Id</th>
                <th>Usuário</th>
                <th>Aceita newsletter?</th>
                <th>Idioma</th>
            </thead>
            <tbody>
                <tr v-for="(item, index) in newsletterUsers" v-bind:key="index" :id="'user-' + index" :userEmail="item.email" v-on:click="checkThis('user-' + index)">
                    <td v-if="showSelect">
                        <input type="checkbox" :id="'select-item-' + index">
                    </td>
                    <td>{{ item.id }}</td>
                    <td>
                        <div class="user-container">
                            <img :src="item.profile_photo" class="avatar-pp" />
                            <p class="user-name">{{ item.name }}</p>
                        </div>
                    </td>
                    <td>
                        <div class="badge" :style="acceptNewsletter(item.accept_newsletter, true)">
                            {{ acceptNewsletter(item.accept_newsletter) }}
                        </div>
                    </td>
                    <td>{{ returnExtendedLanguage(item.language) }}</td>
                </tr>
            </tbody>
        </table>
        <div class="submit-container" v-if="showSelect">
            <button type="button" class="btn primary" v-on:click="selectUsers()">Selecionar</button>
        </div>
    </div>
</template>
<script>
import api from '../configs/api.js';
import $ from 'jquery';

export default {
    name: "returnUsersDataTable",
    props: ["showSelect"],
    data() {
        return {
            newsletterUsers: []
        }
    },
    methods: {
        checkThis: function (id) {
            let element = $("#" + id);
            let input = element.find("input");
            if (input.is(":checked")) {
                input.attr("checked", false);
            } else {
                input.attr("checked", true);
            }
        },
        descelectAll: function () {
            let checkBoxes = $("input[id*='select-item-'");
            checkBoxes.each((index, item) => {
                let currentItem = $(item);
                currentItem.attr("checked", false);
            })
        },
        selectAll: function () {
            let checkBoxes = $("input[id*='select-item-'");
            checkBoxes.each((index, item) => {
                let currentItem = $(item);
                currentItem.attr("checked", true);
            })
        },
        selectUsers: function () {
            let users = $("tr[id*='user-']");
            let userEmails = [];
            if (users.length == 0) {
                return;
            }
            users.each((index, item) => {
                let currentItem = $(item);
                let currentUserEmail = currentItem.attr("userEmail");
                if (currentItem.find("input[id*='select-item-']").is(":checked")) {
                    userEmails.push(currentUserEmail);
                }
            })
            if (userEmails.length == 0) {
                return;
            }
            this.$emit("submit_users", userEmails);
        },
        getNewsletterUsers: function () {
            let self = this;
            api.get("/newsletter/return_all_users")
            .then(function(response){
                self.newsletterUsers = response.data.obj.users_list;
            }).catch(function(error){
                console.log(error);
            })
        },
        returnExtendedLanguage: function (lang) {
            let langString = "N/D";

            switch (lang) {
                case "pt":
                    langString = "Português"
                    break;
                case "en":
                    langString = "Inglês";
                    break;
            }
            return langString;
        },
        acceptNewsletter: function (accept, badge = false) {
            let text = "";
            let colorBadge = "";

            if (badge) {
                if (accept == 1) {
                    colorBadge = "background: var(--green-high); color: var(--green-low)";
                } else {
                    colorBadge = "background: var(--red-high-2); color: var(--red-low)"; 
                }
                return colorBadge;
            }

            if (accept == 1) {
                text = "Sim";
            } else {
                text = "Não";
            }
            return text;
        }  
    },
    mounted: function () {
        this.getNewsletterUsers();
    }
}
</script>
<style scoped>

.user-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-name {
    margin: 0;
    font-weight: 500;
    margin-left: 10px;
}

.select-or-deselect {
    display: flex;
    align-items: center;
}

    .select-or-deselect p {
        font-size: 15px;
        font-weight: 600;
        text-decoration: underline;
        margin-right: 10px;
        cursor: pointer;
    }
</style>