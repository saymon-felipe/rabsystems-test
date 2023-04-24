<template>
    <div class="insert-price">
        <form action="insert_price" @submit.prevent="changePrice()" id="price-form">
            <div class="form-group">
                <label for="price-input">Valor</label>
                <rabsystemsCurrencyInput propPlaceholder="R$ 0,00" propName="price" propId="price-input" propRequired="required" />
            </div>
            <div class="form-group">
                <label for="new-order-description">Atualização de requisito</label>
                <textarea name="order_description" id="new-order-description" v-model="order.order_description" cols="30" rows="7" placeholder="Digite a mensagem para o cliente..." required></textarea>
            </div>
            <input type="submit" class="hidden-submit" id="submit-informations-form" />
        </form>
        <p class="response">{{ response }}</p>
    </div>    
</template>
<script>
import $ from 'jquery';
import rabsystemsCurrencyInput from "./rabsystemsCurrencyInput.vue";
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "insertPriceModalContent",
    mixins: [globalMethods],
    props: ["order"],
    data() {
        return {
            response: ""
        }
    },
    methods: {
        changePrice: function () {
            let data = $("#price-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            let self = this;
            let responseElement = $(".response");
            responseElement.removeClass("error");
            self.response = "";
            data["order_id"] = self.order.order_id;
            data["price"] = this.returnFloatNumber(data["price"]).replace(".", ",");
            
            api.patch("/orders/change_price", data)
            .then(function(response){
                let message = response.data.message;
                self.response = message;
                self.$emit("success", true);
            }).catch(function(error){
                responseElement.addClass("error");
                self.response = error;
            })
        }
    },
    components: {
        rabsystemsCurrencyInput
    }
}
</script>
<style scoped>
</style>