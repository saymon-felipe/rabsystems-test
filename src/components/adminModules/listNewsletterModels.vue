<template>
    <div class="list-newsletter-models">
        <p class="page-title page-title-left">Modelos de newsletter</p>
        <returnNewsletterDataTable @edit_newsletter="editThisNewsletter($event)" />
    </div>
</template>
<script>
import returnNewsletterDataTable from "../returnNewsletterDataTable.vue";

export default {
    name: "listNewsletterModels",
    methods: {
        editThisNewsletter: function (obj) {
            this.$emit("edit_newsletter", obj);
        }
    },
    components: {
        returnNewsletterDataTable
    }
    
}
</script>
<style scoped>

</style>