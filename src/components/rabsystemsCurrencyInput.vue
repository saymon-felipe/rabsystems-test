<template>
    <div class="rabsystems-currency-input-container">
        <input type="text" :name="propName" :id="propId" :placeholder="propPlaceholder" :required="propRequired" v-on:keydown="checkKey($event)" v-on:keyup="processKey($event)">
    </div>
</template>
<script>
import $ from 'jquery';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "rabsystemsCurrencyInput",
    props: ["propPlaceholder", "propName", "propId", "propRequired"],
    mixins: [globalMethods],
    data() {
        return {
            inputValue: "R$ 0,00",
            enteredValue: "",
            invalidKeyPressed: false,
            fullSizeReached: false
        }
    },
    methods: {
        checkKey: function (event) {
            let regex = /[0-9]|\./;
            let key = event.key;
            if (key == "Backspace") {
                this.removeNumber();
            }
            if (this.enteredValue.length == 14) {
                event.preventDefault();
                this.fullSizeReached = true;
            } else {
                this.fullSizeReached = false;
            }
            if (!regex.test(key) && key != "Backspace") {
                event.preventDefault();
                this.invalidKeyPressed = true;
            } else {
                this.invalidKeyPressed = false;
            }
        },
        processKey: function (event) {
            event.preventDefault();
            if (!this.invalidKeyPressed) {
                let key = event.key;
                let keyCode = event.keyCode;
                if (keyCode == 8) {
                    this.removeNumber();
                } else {
                    if (!this.fullSizeReached) {
                        this.insertNumber(key);
                    }
                }
            }
        },
        insertNumber: function (key) {
            this.enteredValue += key;
            this.processCharacter();
        },
        removeNumber: function () {
            this.enteredValue = this.enteredValue.slice(0, -1);
            this.processCharacter();
        },
        processCharacter: function () {
            let input = $("#" + this.propId);
            input.val(this.inputValue);
            
            let value = this.enteredValue;
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
            this.inputValue = "R$ " + value + "," + floatValue;
            input.val(this.inputValue);
        }
    }
}
</script>
<style scoped>
.rabsystems-currency-input-container, .rabsystems-currency-input-container input {
    width: 100%;
}
</style>