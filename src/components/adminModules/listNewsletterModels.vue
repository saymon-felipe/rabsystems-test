<template>
    <div class="list-newsletter-models">
        <p class="page-title">Modelos de newsletter</p>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Tipo</th>
                    <th>Data de criação</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in newsletterModels" v-bind:key="index">
                    <td class="item-id" v-on:click="editThisNewsletter(item)">{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.description }}</td>
                    <td>{{ returnItemType(item.type) }}</td>
                    <td>{{ returnFormattedTime(item.create_date) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import moment from 'moment';
import api from '../../configs/api.js';

export default {
    name: "listNewsletterModels",
    data() {
        return {
            newsletterModels: [],
            editNewsletterId: null,
            editNewsletter: false
        }
    },
    methods: {
        returnNewsletterModels: function () {
            let self = this;
            api.get("/newsletter/return_models")
            .then(function(response){
                self.newsletterModels = response.data.obj;
            }).catch(function(error){
                console.log(error);
            })
        },
        returnFormattedTime: function (time) {
            let formattedTime = moment(time).format("DD/MM/YYYY");
            return formattedTime;
        },
        returnItemType: function (type) {
            switch (type) {
                case "special-date":
                    return "Data comemorativa";
                case "informative":
                    return "Informativo";
                case "marketing":
                    return "Marketing";
            }
        },
        editThisNewsletter: function (obj) {
            this.$emit("edit_newsletter", obj);
        }
    },
    mounted: function () {
        this.returnNewsletterModels();
    }
}
</script>
<style scoped>
table {
    width: 100%;
}

table tr td {
    padding: 5px;
}

table tr td:hover {
    background: var(--gray-high-3);
}

.item-id {
    cursor: pointer;
}
</style>