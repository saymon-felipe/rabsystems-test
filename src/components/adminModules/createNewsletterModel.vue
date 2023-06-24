<template>
    <div class="create-newsletter-model">
        <form id="create-newsletter-form" @submit.prevent="createNewsletter()">
            <div class="form-group">
                <label for="newsletter-name">Nome:</label>
                <input type="text" v-model="name" name="name" id="newsletter-name" required>
            </div>
            <div class="form-group">
                <label for="newsletter-description">Descrição:</label>
                <input type="text" v-model="description" name="description" id="newsletter-description" required>
            </div>
            <div class="form-group">
                <label for="newsletter-subject-name">Título do email:</label>
                <input type="text" v-model="subject_name" name="subject_name" id="newsletter-subject-name" required>
            </div>
            <div class="ck-editor">
                <ckeditor v-model="newsletter_html"></ckeditor>
            </div>
            <div class="form-group">
                <label>Marcadores</label>
                <div class="div-marcadores">
                    <label for="special-date">Data comemorativa.</label>
                    <input type="radio" v-model="type" value="special-date" name="type" id="special-date" required>
                </div>
                <div class="div-marcadores">
                    <label for="informative">Informativo.</label>
                    <input type="radio" v-model="type" value="informative" name="type" id="informative" required>
                </div>
                <div class="div-marcadores">
                    <label for="marketing">Marketing.</label>
                    <input type="radio" v-model="type" value="marketing" name="type" id="marketing" required>
                </div>
            </div>
            <div class="submit-buttons">
                <button type="button" class="btn secondary">Cancelar</button>
                <button type="submit" class="btn primary">{{ editObj != null ? "Alterar newsletter" : "Criar newsletter" }}</button>
            </div>
        </form>
    </div>
</template>
<script>
import $ from 'jquery';
import api from '../../configs/api.js';

export default {
    name: "createNewsletterModel",
    props: ["editObj"],
    data() {
        return {
            newsletter_html: "",
            name: "",
            description: "",
            subject_name: "",
            type: null
        }
    },
    methods: {
        fillFieldsIfEdit() {
            if (this.editObj == null) {
                return;
            }
            this.name = this.editObj.name;
            this.description = this.editObj.description;
            this.newsletter_html = this.editObj.html;
            this.subject_name = this.editObj.subject_name;
            this.type = this.editObj.type;
        },
        createNewsletter: function () {
            let self = this;
            let data = $("#create-newsletter-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});
            data["html"] = this.newsletter_html;

            let path = "create_model";
            
            if (this.editObj != null) {
                path = "edit_model";
                data["id"] = this.editObj.id;
            }

            api.post("/newsletter/" + path, data)
            .then(function(){
                self.$emit("model_changed");
            }).catch(function(error){
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.fillFieldsIfEdit();
    }
}
</script>
<style scoped>
.ck-editor {
    margin: 1rem 0;
}

.div-marcadores {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
}

    .div-marcadores label {
        white-space: nowrap;
        margin-left: 10px;
    }

.submit-buttons {
    display: flex;
    margin-top: 1rem;
    flex-direction: row-reverse;
}

    .submit-buttons button {
        margin: 0 5px;
    }
</style>