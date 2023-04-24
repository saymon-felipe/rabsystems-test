<template>
    <div>
        <form action="generate_payment" @submit.prevent="generatePayment()">
            <form action="insert_payment" @submit.prevent="insertPayment()" id="insert-payment-form">
                <div class="form-group">
                    <select name="payment_method" id="payment-method" required>
                        <option value="">-- {{ $t("order_details.payment_method") }} --</option>
                        <option value="pix">Pix</option>
                        <option value="boleto">{{ $t("order_details.ticket") }}</option>
                        <option value="transferencia">{{ $t("order_details.transfer") }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <RabsystemsCurrencyInput propPlaceholder="R$ 0,00" propName="payment_value" propId="price-input" propRequired="required" />
                </div>
                <div class="payment-submit">
                    <button type="submit" class="btn primary">
                        {{ $t("order_details.enter_payment") }}
                    </button>
                </div>
            </form>
            <div class="payment-informations-container">
                <div class="payment-informations">
                    <h5>{{ $t("order_details.initial_price") }}</h5>
                    <p>{{ initialPrice }}</p>
                </div>
                <div class="payment-informations">
                    <h5>{{ $t("order_details.amount_paid") }}</h5>
                    <p>{{ payValue }}</p>
                </div>
                <div class="payment-informations">
                    <h5>{{ $t("order_details.remaining") }}</h5>
                    <p>{{ rest }}</p>
                </div>
            </div>
            <p class="response">{{ response }}</p>
            <input type="submit" class="hidden-submit" id="submit-informations-form" />
        </form>
    </div>
</template>
<script>
import $ from 'jquery';
import RabsystemsCurrencyInput from './rabsystemsCurrencyInput.vue';
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "generatePaymentModalContent",
    props: ["order"],
    mixins: [globalMethods],
    data() {
        return {
            response: "",
            initialPrice: "R$ 0,00",
            payValue: "R$ 0,00",
            computedInitialPrice: 0,
            computedPayValue: 0,
            computedRest: 0,
            rest: "R$ 0,00",
            data: {}
        }
    },
    methods: {
        insertPayment: function () {
            this.data = $("#insert-payment-form").serializeArray().reduce(function (obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            this.data["order_id"] = this.order.order_id;
            this.payValue = this.data['payment_value'];
            this.data["payment_value"] = this.returnFloatNumber(this.data["payment_value"]).replace(".", ",");
            this.calculatePayment(this.payValue);
        },
        calculatePayment: function (paymentValue) {
            this.computedPayValue = this.returnFloatNumber(paymentValue);
            this.computedInitialPrice = this.returnFloatNumber(this.returnFloatNumber(this.order.price) - this.returnFloatNumber(this.order.price_paid));
            this.computedRest = this.calculateRest(this.computedInitialPrice, this.computedPayValue);
            let formatedRest = this.formateRest(this.computedRest);
            this.rest = formatedRest;
            
        },
        formateRest: function (rest) {
            let parts = rest.toFixed(2).toString().split('.');

            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

            let value = "R$ " + parts.join(",");
            return value;
        },
        calculateRest: function (initialPrice, payValue) {
            let calc = parseFloat(initialPrice) - parseFloat(payValue);
            return calc;
        },
        generatePayment: function () {
            let self = this;
            api.patch("/orders/generate_payment", self.data)
            .then(function (response) {
                self.response = response.data.message;
                self.$emit("success", true);
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    },
    mounted: function () {
        this.initialPrice = "R$ " + (this.returnFloatNumber(this.order.price) - this.returnFloatNumber(this.order.price_paid)).toFixed(2).replace(".", ",");
    },
    components: { 
        RabsystemsCurrencyInput 
    }
}
</script>
<style>
.payment-submit {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
}

.payment-informations-container {
    margin-top: 1rem;
}

.payment-informations {
    width: fit-content;
    text-align: left;
}
</style>