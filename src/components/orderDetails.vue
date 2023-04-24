<template>
    <section class="order-details">
        <div class="loading-page" v-if="loading"></div>
        <div class="error-page" v-if="error != null">{{ error }}</div>
        <div class="page-title">
            <h1 class="rabsystems-font">{{ $t("order_details.order_details") }}</h1>
        </div>
        <div class="order-details-container">
            <div class="order-more-options" v-if="order.order_status != 4 && $root.havePermission && haveActions">
                <i class="fas fa-ellipsis-h" v-on:click="toggleAdmin()"></i>
            </div>
            <div class="order-actions-admin-wrapper" v-if="show_admin" v-on:click="hideAdmin('.order-actions-admin')"></div>
            <div class="order-actions-admin" v-if="$root.havePermission">
                <ul>
                    <li v-if="order.price == 0" v-on:click="insertPrice()">{{ $t("order_details.enter_price") }}</li>
                    <li v-if="order.price != 0 && order.was_paid == 0" v-on:click="generatePayment()">{{ $t("order_details.generate_payment") }}</li>
                    <li v-if="order.price != 0 && order.invoice_has_generated == ''" style="display: none;">Gerar nota fiscal</li>
                </ul>
            </div>
            <div class="animation-progress"></div>
            <div class="order-details-animation">
                <div class="animation-line">
                    <div class="canceled" style="display: none;" :title="$t('order_details.canceled')">
                        <lottie-player src="https://assets4.lottiefiles.com/packages/lf20_zx4v6jjx.json"  background="transparent"  speed="1" loop autoplay></lottie-player>
                    </div>
                    <div class="animation-step" :title="$t('order_details.waiting_answer')">
                        <div class="step-icon" id="waiting-response">
                            <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_8d1e22ya.json"  background="transparent"  speed="1" loop autoplay></lottie-player>
                        </div>
                    </div>
                    <div class="animation-step" :title="$t('order_details.waiting_payment')">
                        <div class="step-icon" id="waiting-payment">
                            <lottie-player src="https://assets9.lottiefiles.com/packages/lf20_4q43fuco.json"  background="transparent"  speed="1" loop autoplay></lottie-player>
                        </div>
                    </div>
                    <div class="animation-step" :title="$t('order_details.in_progress')">
                        <div class="step-icon" id="in-progress">
                            <lottie-player src="https://assets6.lottiefiles.com/packages/lf20_aspfe0ly.json"  background="transparent"  speed="1" loop autoplay></lottie-player>
                        </div>
                    </div>
                    <div class="animation-step" :title="$t('order_details.done')">
                        <div class="step-icon" id="finished">
                            <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_obseqf6i.json"  background="transparent"  speed="1" loop autoplay></lottie-player>
                        </div>
                    </div>
                </div>
            </div>
            <div class="order-details-informations">
                <table class="order">
                    <tr class="order-head">
                        <td>{{ $t("order_details.id") }}</td>
                        <td>
                            {{ $t("order_details.date") }}
                        </td>
                        <td>{{ $t("order_details.service") }}</td>
                        <td>
                            {{ $t("order_details.price") }}
                        </td>
                    </tr>
                    <tr class="order-table-details">
                        <td><strong>#</strong>{{ order.order_id }}</td>
                        <td>{{ getMomentExtended(order.create_date) }}</td>
                        <td>{{ returnOrderService(order.service) }}</td>
                        <td><strong>R$</strong>: {{ order.price == 0 ? "--,--" : order.price }}</td>
                    </tr>
                </table>
                <div class="order-description">
                    <h1>{{ $t("order_details.order_description") }}</h1>
                    <p>{{ order.order_description }}</p>
                </div>
            </div>
            <div class="order-details-buttons">
                <button v-on:click="talkWithCompany()" id="talk-with-company" v-if="order.order_status != 4">{{ $t("order_details.talk_with") }} {{ $root.havePermission ? order.user_name : "RABSYSTEMS" }}</button>
                <button v-on:click="confirm_action = 'finished'; openConfirmationModal()" v-if="order.order_status == 2 && $root.havePermission" id="finish-order">NOTIFICAR COMO CONCLUÍDO</button>
                <button v-on:click="confirm_action = 'cancel'; openConfirmationModal()" id="cancel-order" v-if="order.order_status != 4 && order.order_status != 3">CANCELAR PEDIDO</button>
                <router-link to="/my-orders" id="return">VOLTAR</router-link>
            </div>
        </div>
        <modal v-if="showModal" :title="modalTitle" :buttonTitle="modalButtonTitle" :button2Title="modalButtonTitle2" @closeModal="closeThisModal()" @submitEvent="submitFunction()">
            <insertPriceModalContent v-if="showInsertPrice" :order="order" @success="changePriceSuccess()" />
            <generatePaymentModalContent v-if="showGeneratePayment" :order="order" @success="generatePaymentSuccess()" />
        </modal>
        <div class="confirmation-modal">
            <h1>Tem certeza que deseja confirmar esta ação?</h1>
            <p>Uma vez confirmada a ação é irreversível</p>
            <div class="confirm-buttons">
                <button v-on:click="confirmAction(confirm_action)">CONFIRMAR</button>
                <button v-on:click="closeConfirmationModal()">CANCELAR</button>
            </div>
        </div>
        <div class="overlay" v-on:click="closeConfirmationModal()"></div>
        <rabsystemsChat :order="order" @closeChat="closeChatComponent()" v-if="showChat" userProp="" />
    </section>
</template>
<script>
import $ from 'jquery';
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';
import moment from 'moment';
import rabsystemsChat from './rabsystemsChat.vue';
import modal from "./modal.vue";
import insertPriceModalContent from "./insertPriceModalContent.vue";
import generatePaymentModalContent from "./generatePaymentModalContent.vue";

export default {
    name: "orderDetails",
    mixins: [globalMethods],
    components: {
        rabsystemsChat,
        modal,
        insertPriceModalContent,
        generatePaymentModalContent
    },
    watch: {
        showModal: function () {
            if (this.showModal == false) {
                this.toggleAdmin(true);
            }
        }
    },
    data() {
        return {
            order: {},
            confirm_action: "",
            loading: false,
            error: null,
            showChat: false,
            show_admin: false,
            showInsertPrice: false,
            showGeneratePayment: false,
            showModal: false,
            modalTitle: "",
            modalButtonTitle: "",
            modalButtonTitle2: "",
            submitPrice: false,
            haveActions: false
        }
    },
    methods: {
        checkActions: function () {
            if (this.order.price == "" || (this.order.price != 0 && this.order.was_paid == 0)) {
                this.haveActions = true;
            } else {
                this.haveActions = false;
            }
        },
        generatePayment: function () {
            this.showModal = true;
            this.showGeneratePayment = true;
            this.fillModalVariables(this.$i18n.t("order_details.generate_payment"), this.$i18n.t("order_details.save"), this.$i18n.t("order_details.cancel"));
        },
        insertPrice: function () {
            this.showModal = true;
            this.showInsertPrice = true;
            this.fillModalVariables(this.$i18n.t("order_details.enter_value"), this.$i18n.t("order_details.save"), this.$i18n.t("order_details.cancel"));
        },
        showAdmin: function (className) {
            let container = $(className);
            container.show();
            setTimeout(() => {
                this.show_admin = true;
                container.css("opacity", 1);
            }, 10);
        },
        hideAdmin: function (className) {
            let container = $(className);
            container.css("opacity", 0);
            setTimeout(() => {
                this.show_admin = false;
                container.hide();
            }, 400);
        },
        toggleAdmin: function (forceClose = false) {
            let adminClass = ".order-actions-admin";
            if (forceClose) {
                this.hideAdmin(adminClass);
            }
            let container = $(adminClass);
            if (container.is(":visible")) {
                this.hideAdmin(adminClass);
                return;
            }
            this.showAdmin(adminClass);
        },
        changePriceSuccess: function () {
            this.closeThisModal();
            this.getOrder(this.$route.params.id);
            this.resetModalVariables();
            this.resetModalContentVariables();
        },
        generatePaymentSuccess: function () {
            this.closeThisModal();
            this.getOrder(this.$route.params.id);
            this.resetModalVariables();
            this.resetModalContentVariables();
        },
        resetModalContentVariables: function () {
            this.showInsertPrice = false;
            this.showGeneratePayment = false;
        },
        getOrder: function (param) {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();

            api.get("/orders/" + param, {
                headers: {
                        Authorization: jwt
                    }
            })
            .then(function(response){
                self.order = response.data.obj.order;
                self.loading = false;
                self.findProgressAnimation();
                self.checkActions();
            }).catch(function(error){
                if (error.data) {
                    self.error = error.data.message;
                }
            })
        },
        getMomentExtended: function (date) {
            return moment(date).format('LLLL');
        },
        findProgressAnimation: function () {
            let container = $(".animation-progress");
            let self = this;
            let status = self.order.order_status;

            switch (status) {
                case 0:
                    container.addClass("animation-25");
                    break;
                case 1:
                    container.addClass("animation-50");
                    break;
                case 2:
                    container.addClass("animation-75");
                    break;
                case 3:
                    container.addClass("animation-100");
                    break;
                case 4:
                    $(".animation-step").hide();
                    $(".canceled").show();
                    container.css("background", "var(--red)").addClass("animation-100");
                    break;
            }
        },
        openConfirmationModal: function () {
            $(".overlay").show();
            $(".confirmation-modal").css("display", "flex");
            
            setTimeout(() => {
                $(".confirmation-modal").css("transform", "translateY(0)").css("opacity", 1);
            }, 10);
        },
        closeConfirmationModal: function (confirm = "") {
            $(".confirmation-modal").css("transform", "translateY(-200px)").css("opacity", 0);

            setTimeout(() => {
                $(".overlay").hide();
                $(".confirmation-modal").hide();
                if (confirm) {
                    this.$router.push("/my-orders");
                }
            }, 400);
        },
        confirmAction: function (confirm_var) {
            let self = this, confirm = false;

            switch (confirm_var) {
                case "finished": 
                    self.finishOrder();
                    confirm = true;
                    break;
                case "cancel":
                    self.cancelOrder();
                    confirm = true;
                    break;
            }

            self.closeConfirmationModal(confirm);
            return self.confirm_action;
        },
        finishOrder: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();
            let data = {
                order_status: 3,
                type: "concluded"
            }
            api.patch("/orders/" + self.$route.params.id, data, {
                headers: {
                    Authorization: jwt
                }
            })
        },
        cancelOrder: function () {
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();
            let data = {
                type: "cancel",
                order_status: 4
            }
            api.patch("/orders/" + self.$route.params.id, data, {
                headers: {
                        Authorization: jwt
                    }
            })
        },
        talkWithCompany: function () {
            this.openChatComponent();
        }
    },
    mounted() {
        this.getOrder(this.$route.params.id);
    }
}
</script>

<style scoped>
    .container {
        padding-bottom: 3rem !important;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 2;
        /*display: block;*/
    }
    
    .confirmation-modal {
        background: var(--white);
        width: 90vw;
        height: 80vh;
        max-width: 700px;
        max-height: 600px;
        position: fixed;
        border-radius: 10px;
        transition: all 0.4s;
        transform: translateY(-200px);
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        opacity: 0;
        top: 0;
        bottom: -10vh;
        left: 0;
        right: 0;
        margin: auto;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        z-index: 3;
    }

        .confirmation-modal .confirm-buttons {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }

        .confirmation-modal button {
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            margin: 1rem;
            transition: all 0.4s;
        }

        .confirmation-modal button:nth-child(1) {
            background: var(--purple);
            color: var(--white);
        }

            .confirmation-modal button:nth-child(1):hover {
                background: var(--purple-low);
            }

        .confirmation-modal button:nth-child(2):hover {
            background: var(--gray-high);
        }

    .order-details {
        width: calc(100% - 225px);
        height: 95%;
        padding: 1rem;
        text-align: center;
        background: var(--white);
        position: absolute;
        right: 0;
        overflow-x: hidden;
    }

    @media (max-width: 876px) {
        .order-details {
            width: 100%;
        }
    }

    .order-details-container {
        margin-top: 2rem;
        max-width: 45rem;
        display: inline-block;
        border-radius: 2rem;
        padding: 1.2rem;
        width: 100%;
        height: 120px;
        position: relative;
    }

    .animation-progress {
        background: var(--blue-high-2);
        border-radius: 2rem;
        transition: all 0.5s;
        width: 0;
        height: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        margin: auto;
    }

    #waiting-response {
        height: 70%;
    }

    .order-details-animation {
        width: 100%;
        height: 100%;
    }

    .animation-25 {
        width: 25%;
    }

    .animation-50 {
        width: 50%;
    }

    .animation-75 {
        width: 75%;
    }

    .animation-100 {
        width: 100%;
    }

    .animation-0 {
        width: 0%;
    }

    .animation-line {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 100%;
        height: 100%;
    }

    .animation-step {
        font-size: 3rem;
        width: 25%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .step-icon, .canceled {
        height: 100%;
        display: flex;
    }

    .order-details-informations {
        margin-top: 3rem;
    }

    .order {
        width: 100%;
    }

    .order-head td {
        font-weight: 700;
        font-size: 1.3rem;
    }

    .order-table-details {
        width: 100%;
    }

        .order-table-details td {
            width: 25%;
            padding-top: 1rem;
        }

    @media (max-width: 500px) {
        .order-table-details {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: auto;
            font-size: 1.3rem;
        }

        .order-head {
            display: none;
        }

            .order-table-details td {
                width: 100%;
            }

        .order-details-container {
            height: 90px;
        }
    }

    .order-details-buttons {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        margin-top: 3rem;
    }

        .order-details-buttons button, .order-details-buttons #return, .order-details-buttons #talk-with-company {
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            margin: 1rem;
            transition: all 0.4s;
            color: var(--black);
            background: var(--gray-high-2);
        }

        .order-details-buttons #finish-order {
            background: var(--purple);
            color: var(--white);
        }

            .order-details-buttons #finish-order:hover {
                background: var(--purple-low);
            }

        .order-details-buttons #cancel-order:hover, .order-details-buttons #return:hover {
            background: var(--gray-high);
        }

        .order-details-buttons #talk-with-company {
            background: var(--green);
            color: var(--white);
        }

            .order-details-buttons #talk-with-company:hover {
                background: var(--green-low);
            }

    .order-description {
        margin-top: 3rem;
    }

        .order-description h1 {
            font-size: 1.4rem;
            font-weight: 700;
        }

    .order-more-options, .order-actions-admin {
        position: absolute;
    }

    .order-more-options {
        right: 0;
        top: -40px;
        font-size: 30px;
        cursor: pointer;
    }

    .order-actions-admin-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }

    .order-actions-admin {
        top: 0;
        right: 0;
        background: var(--white);
        z-index: 2;
        border-radius: 10px;
        padding: .3rem;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        transition: all 0.4s;
        opacity: 0;
        display: none;
    }

        .order-actions-admin ul {
            list-style-type: none;
            margin: 0;
        }

            .order-actions-admin ul li {
                margin: 5px 0;
                cursor: pointer;
                padding: .3rem;
            }

                .order-actions-admin ul li:hover {
                    background: var(--gray-high);
                }

</style>