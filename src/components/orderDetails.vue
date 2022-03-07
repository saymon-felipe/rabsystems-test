<template>
    <section class="order-details" :style="!loading ? 'overflow-y: hidden;' : ''">
        <div class="loading-page" v-if="loading"></div>
        <div class="error-page" v-if="error != null">{{ error }}</div>
        <div class="page-title">
            <h1 class="rabsystems-font">Detalhes do pedido</h1>
        </div>
        <div class="order-details-container">
            <div class="animation-progress"></div>
            <div class="order-details-animation">
                <div class="animation-line">
                    <div class="canceled" style="display: none;" title="Cancelado">
                        <lottie-player src="https://assets4.lottiefiles.com/packages/lf20_zx4v6jjx.json"  background="transparent"  speed="1" loop autoplay></lottie-player>
                    </div>
                    <div class="animation-step" title="Aguardando resposta">
                        <div class="step-icon" id="waiting-response">
                            <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_8d1e22ya.json"  background="transparent"  speed="1" loop autoplay></lottie-player>
                        </div>
                    </div>
                    <div class="animation-step" title="Aguardando pagamento">
                        <div class="step-icon" id="waiting-payment">
                            <lottie-player src="https://assets9.lottiefiles.com/packages/lf20_4q43fuco.json"  background="transparent"  speed="1" loop autoplay></lottie-player>
                        </div>
                    </div>
                    <div class="animation-step" title="Em progresso">
                        <div class="step-icon" id="in-progress">
                            <lottie-player src="https://assets6.lottiefiles.com/packages/lf20_aspfe0ly.json"  background="transparent"  speed="1" loop autoplay></lottie-player>
                        </div>
                    </div>
                    <div class="animation-step" title="Concluído">
                        <div class="step-icon" id="finished">
                            <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_obseqf6i.json"  background="transparent"  speed="1" loop autoplay></lottie-player>
                        </div>
                    </div>
                </div>
            </div>
            <div class="order-details-informations">
                <table class="order">
                    <tr class="order-head">
                        <td>Id</td>
                        <td>
                            Data
                        </td>
                        <td>Serviço</td>
                        <td>
                            Preço
                        </td>
                    </tr>
                    <tr class="order-table-details">
                        <td><strong>#</strong>{{ order.id }}</td>
                        <td>{{ getMomentExtended(order.create_date) }}</td>
                        <td>{{ order.service }}</td>
                        <td><strong>R$</strong>: {{ order.price == 0 ? "--,--" : order.price }}</td>
                    </tr>
                </table>
                <div class="order-description">
                    <h1>Descrição do pedido</h1>
                    <p>{{ order.order_description }}</p>
                </div>
            </div>
            <div class="order-details-buttons">
                <button v-on:click="talkWithCompany()" id="talk-with-company" v-if="order.order_status != 4">FALE COM {{ rabsystemsUser.id == user.id ? order.user_name : "A RABSYSTEMS" }}</button>
                <button v-on:click="confirm_action = 'finished'; openConfirmationModal()" v-if="order.order_status == 2" id="finish-order">NOTIFICAR COMO CONCLUÍDO</button>
                <button v-on:click="confirm_action = 'cancel'; openConfirmationModal()" id="cancel-order" v-if="order.order_status != 4">CANCELAR PEDIDO</button>
                <router-link to="/my-orders" id="return">VOLTAR</router-link>
            </div>
        </div>
        <div class="confirmation-modal">
            <h1>Tem certeza que deseja confirmar esta ação?</h1>
            <p>Uma vez confirmada a ação é irreversível</p>
            <div class="confirm-buttons">
                <button v-on:click="confirmAction(confirm_action)">CONFIRMAR</button>
                <button v-on:click="closeConfirmationModal()">CANCELAR</button>
            </div>
        </div>
        <div class="overlay" v-on:click="closeConfirmationModal()"></div>
        <rabsystemsChat :order="order" :user="user" />
    </section>
</template>

<script>
import $ from 'jquery';
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';
import moment from 'moment';
import rabsystemsChat from './rabsystemsChat.vue';

export default {
    name: "orderDetails",
    mixins: [globalMethods],
    components: {
        rabsystemsChat
    },
    data() {
        return {
            order: {},
            confirm_action: "",
            loading: false,
            error: null,
            user: {},
            rabsystemsUser: {}
        }
    },
    methods: {
        loadUser: function () {
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();

            api.get("/user/get_user", {
                headers: {
                        Authorization: jwt
                    }
            })
            .then(function(response){
                self.user = response.data.response.user;
            }).catch(function(error){
                console.log(error);
            })
        },
        getRabsystemsUser: function () {
            let self = this;
            api.get("/user/get_rabsystems_user")
            .then(function(response){
                self.rabsystemsUser = response.data.response.user;
            }).catch(function(error){
                console.log(error);
            })
        },
        getOrder: function (param) {
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();

            api.get("/orders/" + param, {
                headers: {
                        Authorization: jwt
                    }
            })
            .then(function(response){
                self.order = response.data.response.order;
                self.loading = false;
                self.findProgressAnimation();
            }).catch(function(error){
                if (error.response.data) {
                    self.error = error.response.data.error;
                }
            })
        },
        getMomentExtended: function (date) {
            moment.locale("pt-br");
            return moment(date).format('LLLL');
        },
        findProgressAnimation: function () {
            let container = $(".animation-progress"), self = this, status = self.order.order_status;

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
            console.log("Concluir ordem")
        },
        cancelOrder: function () {
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();
            
            api.patch("/orders/" + self.$route.params.id, {order_status: 4}, {
                headers: {
                        Authorization: jwt
                    }
            })
            .then(function(response){
                console.log(response.data)
            }).catch(function(error){
                console.log(error);
            })

            console.log("Cancelar ordem")
        },
        talkWithCompany: function (order) {
            this.openChatComponent(order)
        }
    },
    mounted() {
        this.getOrder(this.$route.params.id);
        this.loadUser();
        this.getRabsystemsUser();
    }
}
</script>

<style scoped>
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
        position: absolute;
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
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        z-index: 3;
    }

        .confirmation-modal .confirm-buttons {
            display: flex;
            flex-wrap: wrap;
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

</style>