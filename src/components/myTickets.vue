<template>
    <section class="my-tickets">
        <div class="page-title">
            <h1 class="rabsystems-font">{{ $t("my_tickets.my_tickets") }}</h1>
        </div>
        <div class="row">
            <div class="col-12">
                
            </div>
        </div>
    </section>
</template>
<script>
export default {
    name: "myTickets"
}
</script>
<style scoped>
.my-tickets {
    width: calc(100% - 225px);
    height: 100%;
    padding: 1rem;
    text-align: center;
    background: var(--white);
    position: absolute;
    right: 0;
}

@media (max-width: 876px) {
    .my-tickets {
        width: 100%;
    }
}
</style>