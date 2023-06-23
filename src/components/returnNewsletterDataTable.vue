<template>
    <div class="select-newsletter">
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
                <tr v-for="(item, index) in newsletterModels" v-bind:key="index" class="newsletter-model" :id="'newsletter-' + index" v-on:click="selectThisNewsletterModel(item.id, 'newsletter-' + index)">
                    <td class="item-id" v-on:click="selectThisNewsletter(item)">{{ item.id }}</td>
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
import api from '../configs/api.js';
import $ from 'jquery';

export default {
    name: "returnNewsletterDataTable",
    props: ["edit", "returnClick"],
    data() {
        return {
            newsletterModels: []
        }
    },
    methods: {
        selectThisNewsletterModel: function (id, elementId) {
            if (this.returnClick) {
                let elements = $(".newsletter-model");
                elements.each((index, item) => {
                    let currentElement = $(item);
                    currentElement.removeClass("item-selected");
                })
                let element = $("#" + elementId);
                element.addClass("item-selected");
                this.$emit("select_newsletter", id);
            }
        },
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
        selectThisNewsletter: function (obj) {
            if (this.edit == "false") {
                return;
            }
            this.$emit("edit_newsletter", obj);
        }
    },
    mounted: function () {
        this.returnNewsletterModels();
    }
}
</script>
<style scoped>
.item-id {
    cursor: pointer;
}

.item-id:hover {
    text-decoration: underline;
}
</style>