<template>
    <div class="container">
        <headerComponent />
        <slot />
        <footerComponent />
    </div>
</template>

<script>
import headerComponent from "../components/header.vue";
import footerComponent from "../components/footer.vue";

export default {
    name: 'siteTemplate',
    components: {
        headerComponent,
        footerComponent
    }
}
</script>

<style scoped>

</style>