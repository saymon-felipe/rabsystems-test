<template>
    <div>
        <form action="generate_payment" @submit.prevent="generatePayment()">
            <form action="insert_payment" @submit.prevent="insertPayment()" id="insert-payment-form">
                <div class="form-group">
                    <select name="payment_method" id="payment-method" required>
                        <option value="">-- Método de pagamento --</option>
                        <option value="pix">Pix</option>
                        <option value="boleto">Boleto</option>
                        <option value="transferencia">Transferência</option>
                    </select>
                </div>
                <div class="form-group">
                    <RabsystemsCurrencyInput propPlaceholder="R$ 0,00" propName="payment_value" propId="price-input" propRequired="required" />
                </div>
                <div class="payment-submit">
                    <button type="submit" class="btn primary">
                        Inserir pagamento
                    </button>
                </div>
            </form>
            <div class="payment-informations-container">
                <div class="payment-informations">
                    <h5>Preço inicial</h5>
                    <p>{{ initialPrice }}</p>
                </div>
                <div class="payment-informations">
                    <h5>Valor pago</h5>
                    <p>{{ payValue }}</p>
                </div>
                <div class="payment-informations">
                    <h5>Restante</h5>
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
            this.calculatePayment(this.payValue);
        },
        calculatePayment: function (paymentValue) {
            this.computedPayValue = this.returnOnlyNumbers(paymentValue);
            this.computedInitialPrice = this.returnOnlyNumbers(this.order.price);
            this.computedRest = this.calculateRest(this.computedPayValue, this.computedInitialPrice);
            let formatedRest = this.formateRest(this.computedRest);
            this.rest = formatedRest;
            
        },
        validatePayment: function () {
            $(".response").removeClass("error");
            this.response = "";
            if (this.computedRest != 0) {
                this.isValidValue = false;
                $(".response").addClass("error");
                this.response = "Pagamento inválido";
                return false;
            } else {
                return true;
            }
        },
        formateRest: function (rest) {
            let value = rest.toString();
            let floatValue = "00";
            if (value.length <= 2) {
                if (value.length != 0) {
                    floatValue = value;
                }
                if (value.length == 1) {
                    floatValue = "0" + value;
                }
                value = "0";
            } else {
                floatValue = value.slice(-2);
                value = value.slice(0, -2);
                if (value.length > 3) {
                    let newValue = "";
                    for (let i = 0; i < value.length; i++) {
                        let currentCharacter = value[i];
                        if (i == value.length - 3 || i == value.length - 7 || i == value.length - 10) {
                            if (i == value.length - 7 || i == value.length - 10) {
                                newValue += currentCharacter + ".";
                            } else {
                                newValue += "." + currentCharacter;
                            }
                        } else {
                            newValue += currentCharacter;
                        }
                    }
                    value = newValue;
                }
            }
            let finalNumber = "R$ " + value + "," + floatValue;
            return finalNumber;
        },
        calculateRest: function (payValue, initialPrice) {
            let calc = parseInt(initialPrice) - parseInt(payValue);
            return calc;
        },
        generatePayment: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();
            if (this.validatePayment()) {
                api.patch("/orders/generate_payment", self.data, {
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(function (response) {
                    self.response = response.data.message;
                    self.$emit("success", true);
                })
                .catch(function (error) {
                    console.log(error)
                })
            } else {
                console.log("Pagamento inválido")
            }
        },
        returnOnlyNumbers: function (string) {
            let newString = string.replace("R$", "").replace(".", "").replace(".", "").replace(".", "").replace(",", "");
            return newString;
        }
    },
    mounted: function () {
        this.initialPrice = this.order.price;
    },
    components: { RabsystemsCurrencyInput }
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