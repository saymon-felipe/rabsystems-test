<template>
    <div class="modal-wrapper">
        <div class="modal-container">
            <div class="modal-header">
                <h4>{{ title }}</h4>
                <i class="fas fa-times" v-on:click="closeModal()"></i>
            </div>
            <div class="modal-body">
                <slot />
            </div>
            <div class="modal-footer" v-if="buttonTitle != ''">
                <button v-on:click="emitSubmitEvent()" class="btn primary">{{ buttonTitle }}</button>&nbsp;&nbsp;&nbsp;
                <button v-on:click="closeModal()" class="btn secondary" v-if="button2Title != ''">{{ button2Title }}</button>
            </div>
        </div>
        <div class="modal-overlay" v-on:click="closeModal()"></div>
    </div>
</template>
<script>
import $ from 'jquery';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "modal",
    mixins: [globalMethods],
    props: ['title', 'buttonTitle', 'button2Title'],
    methods: {
        closeModal: function () {
            this.$emit("closeModal");
        },
        showModal: function () {
            let modalContainer = $(".modal-container");
            modalContainer.css("transform", "translateY(0)");
        },
        emitSubmitEvent: function () {
            this.$emit("submitEvent");
        }
    },
    mounted: function () {
        setTimeout(() => {
            this.showModal();
        }, 10);
    }
}
</script>
<style scoped>
.modal-wrapper {
    width: 100%;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 120px;
    z-index: 2;
}

.modal-overlay {
    z-index: 1;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: black;
    opacity: 0.3;
    cursor: pointer;
}

.modal-container {
    position: relative;
    z-index: 2;
    height: 80vh;
    width: 70%;
    max-width: 900px;
    max-height: 1000px;
    background: var(--white);
    border-radius: 10px;
    color: var(--black);
    padding: 1rem;
    margin-left: -249px;
    transition: all 0.4s;
    transform: translateY(-100px);
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding-top: 0;
    border: none;
}

    .modal-header i {
        font-size: 25px;
        cursor: pointer;
    }

.modal-body {
    overflow-y: auto;
    min-height: calc(100% - 95px);
}

.modal-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    border: none;
}
</style>