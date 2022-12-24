<template>
    <div class="chat-container-list">
        <h1>chat lateral</h1>
    </div>
</template>
<script>
export default {
    name: "ChatList"
}
</script>
<style scoped>
.chat-container-list {
    background: var(--white);
    position: fixed;
    top: 100px;
    right: 0;
    min-width: 230px;
    max-width: 600px;
    width: 25vw;
    height: calc(100% - 100px);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 1rem;
    transition: all 0.4s;
    transform: translateX(400px);
    display: none;
}
</style>