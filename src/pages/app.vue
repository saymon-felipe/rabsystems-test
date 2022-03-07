<template>
    <appTemplate>
        <div class="container">
            <router-view path="$router.key"></router-view>
        </div>
    </appTemplate>
</template>

<script>
import appTemplate from "../templates/appTemplate.vue";

export default {
    name: 'appPage',
    components: {
        appTemplate
    }
}
</script>

<style scoped>
    .container {
        width: calc(100vw - 225px);
        position: absolute;
        right: 0;
        top: 2.8rem;
        height: calc(100% - 45px);
        overflow: hidden;
        padding: 1.3rem;
    }

    @media (max-width: 876px) {
        .container {
            width: 100%;
            left: 0;
        }
    }
</style>