<template>
    <div class="mail-queue">
        <p class="page-title page-title-left">Fila de emails</p>
        <returnMailQueue />
    </div>
</template>
<script>
import returnMailQueue from "../returnMailQueue.vue";

export default {
    name: "mailQueue",
    components: {
        returnMailQueue
    }
}
</script>
<style scoped>
</style>