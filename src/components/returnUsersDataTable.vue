<template>
    <div class="datatable-users">
        <div class="select-or-deselect" v-if="showSelect">
            <p v-on:click="selectAll()">Selecionar todos</p>
            <p v-on:click="descelectAll()">Descelecionar todos</p>
        </div>
        <div class="filters-container">
            <div class="input-group">
                <label for="name">Nome:</label>
                <input type="text" name="name" id="name" v-model="filters.name" @input="filter()">
            </div>
            <div class="input-group">
                <label for="email">Email:</label>
                <input type="text" name="email" id="email" v-model="filters.email" @input="filter()">
            </div>
            <div class="input-group">
                <label for="origin">Origem:</label>
                <select name="origin" id="origin" v-model="filters.origin" @change="filter()">
                    <option value="">* Qualquer *</option>
                    <option value="user">Usuário</option>
                    <option value="lead">Lead</option>
                    <option value="lead_excel">Lead importado</option>
                </select>
            </div>
            <div class="input-group">
                <label for="accept-newsletter">Aceita newsletter?</label>
                <select name="accept_newsletter" id="accept-newsletter" v-model="filters.accept_newsletter" @change="filter()">
                    <option value="">* Qualquer *</option>
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                </select>
            </div>
            <div class="input-group">
                <label for="marker">Marcador</label>
                <select name="marker" id="marker" v-model="filters.marker" @change="filter()">
                    <option value="">* Qualquer *</option>
                    <option value="Prospecção inicial">Prospecção inicial</option>
                    <option value="Negociação">Negociação</option>
                    <option value="Cliente">Cliente</option>
                </select>
            </div>
        </div>
        <table>
            <thead>
                <th v-if="showSelect">&nbsp;</th>
                <th>Id</th>
                <th class="text-start pl-5">Usuário</th>
                <th>Origem</th>
                <th>Marcador</th>
                <th>Aceita newsletter?</th>
                <th>Idioma</th>
            </thead>
            <tbody>
                <tr v-for="(item, index) in newsletterUsersCopy" v-bind:key="index" :id="'user-' + index" :userEmail="item.email" v-on:click="checkThis('user-' + index, item.accept_newsletter, $event)">
                    <td v-if="showSelect">
                        <input type="checkbox" :id="'select-item-' + index" v-on:click="checkThis('user-' + index, item.accept_newsletter, $event)">
                    </td>
                    <td>{{ item.id }}</td>
                    <td class="d-flex pl-5">
                        <div class="user-container">
                            <img :src="item.profile_photo" class="avatar-pp" />
                            <p class="user-name">{{ item.name }}</p>
                        </div>
                    </td>
                    <td>
                        {{ item.origin == "lead" ? "Lead site" : item.origin == "lead_excel" ? "Lead importado" : "Usuário" }}
                    </td>
                    <td>
                        {{ item.marker }}
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
            <button type="button" class="btn primary" v-on:click="selectUsers()">Enviar</button>
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
            newsletterUsers: [],
            newsletterUsersCopy: [],
            filters: {
                name: "",
                email: "",
                origin: "",
                accept_newsletter: "",
                marker: ""
            }
        }
    },
    methods: {
        filter: function () {
            if (this.filters.name.trim() == "" && this.filters.email.trim() == "" && this.filters.origin.trim() == "" && this.filters.accept_newsletter.trim() == "" && this.filters.marker.trim() == "") {
                this.newsletterUsersCopy = this.newsletterUsers;
                return;
            }

            this.newsletterUsersCopy = this.newsletterUsers.filter(user => {
                const nameMatch = user.name.toLowerCase().indexOf(this.filters.name.toLowerCase()) !== -1 || this.filters.name.trim() == "";
                const emailMatch = user.email.toLowerCase().indexOf(this.filters.email.toLowerCase()) !== -1 || this.filters.email.trim() == "";
                const originMatch = this.filters.origin == user.origin || this.filters.origin == "";
                const acceptNewsletterMatch = this.filters.accept_newsletter.trim() == "" || this.filters.accept_newsletter == user.accept_newsletter.toString();
                const markerMatch = this.filters.marker.trim() == "" || this.filters.marker == user.marker;

                return nameMatch && emailMatch && originMatch && acceptNewsletterMatch && markerMatch;
            });

            this.descelectAll();
        },
        checkThis: function (id, accept_newsletter, event) {
            let element = $("#" + id);
            let input = element.find("input");

            if (accept_newsletter == 0) {
                event.preventDefault();

                if (!confirm("Esse usuário não aceita newsletter. \n\nDeseja continuar?")) {
                    return;
                }
            }

            if (input.is(":checked")) {
                input.prop("checked", false);
            } else {
                input.prop("checked", true);
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
            api.post("/newsletter/return_all_users", self.filters)
            .then(function(response){
                self.newsletterUsers = response.data.returnObj;
                self.newsletterUsersCopy = response.data.returnObj;
                
                setTimeout(() => {
                    self.filter();
                }, 1)
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