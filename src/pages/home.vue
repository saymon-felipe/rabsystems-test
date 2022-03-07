<template>
    <siteTemplate>
        <div class="principal">
            <homeComponent />
            <aboutComponent />
            <servicesComponent />
            <contactComponent />
        </div>
    </siteTemplate>
</template>

<script>
import siteTemplate from "../templates/siteTemplate.vue";
import homeComponent from "../components/home.vue";
import aboutComponent from "../components/about.vue";
import servicesComponent from "../components/services.vue"
import contactComponent from "../components/contact.vue"

export default {
    name: 'homePage',
    components: {
        homeComponent,
        siteTemplate,
        aboutComponent,
        servicesComponent,
        contactComponent
    }
}
</script>

<style scoped>

    .principal {
        margin-top: 5rem;
    }

</style>