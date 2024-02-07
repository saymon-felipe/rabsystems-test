<template>
    <div class="tutorial-component">
        <div class="tutorial-container">
            <p><strong>Tutorial</strong></p>
            <p>{{ steps[current_step].text }}</p>
            <div class="tutorial-footer">
                <button class="btn primary" v-on:click="goToNextStep()">{{ current_step + 1 == steps.length ? "Terminar tutorial" : "Próximo" }}</button>
                <span>{{ current_step + 1 }}/{{ steps.length }}</span>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "tutorialComponent",
    mixins: [globalMethods],
    props: ["steps"],
    data() {
        return {
            current_step: 0,
            call_next: false
        }
    },
    methods: {
        hideContainer: function () {
            let container = $(".tutorial-container");

            container.css("opacity", 0);
        },
        findPosition: function () {
            let container = $(".tutorial-container");
            let step = this.steps[this.current_step];
            
            if (step.target_element == "") {
                container.css({
                    top: 0,
                    left: 0
                });

                return;
            };

            let targetElement = $("#" + step.target_element);

            var elementTop = targetElement.length > 0 ? targetElement.offset().top : 0;
            var elementRight = targetElement.length > 0 ? targetElement.offset().left + targetElement.outerWidth() : 0;

            container.css({
                top: elementTop - container.outerHeight() - 100,
                left: elementRight - container.outerWidth()
            });
        },
        showContainer: function () {
            let container = $(".tutorial-container");

            container.css("opacity", 1);
        },
        goToNextStep: function (programatic_navigation = false, array_position = 0) {

            if (array_position != 0) {
                this.current_step = array_position;
            }

            let currentStep = this.steps[this.current_step];

            if (currentStep.final == 1) {
                this.closeTutorial();
                return;
            }

            this.hideContainer();

            setTimeout(() => {
                if (currentStep.navigate_to != "" && !programatic_navigation) {
                    this.$router.push(currentStep.navigate_to);
                }
                
                this.current_step++;

                if (programatic_navigation) {
                    this.call_next = false;
                }

                setTimeout(() => {
                    this.findPosition();
                    this.showContainer();
                }, 1)
            }, 400)
        },
        closeTutorial: function () {
            this.hideContainer();

            setTimeout(() => {
                $(".tutorial-component").hide();
                this.concludeTutorial();
            }, 400)
        },
        concludeTutorial: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();

            api.post("/utils/conclude_tutorial", {
                headers: {
                    Authorization: jwt
                }
            })
        },
        findStepPosition: function () {
            let urlPath = window.location.pathname;
            let position = this.steps.findIndex(obj => obj.navigate_to == urlPath);

            this.goToNextStep(true, position);
        },
        checkUrl: function () {
            let urlPath = window.location.pathname;
            let currentStepForceRedir = this.steps[this.current_step].force_redir;

            if (urlPath.indexOf(currentStepForceRedir) == -1) {
                this.$router.push(currentStepForceRedir);
            }
        }
    },
    mounted: function () {
        this.showContainer();
        this.findPosition();

        setInterval(() => {
            this.checkUrl();
        }, 50)
    }
}
</script>
<style scoped>
.tutorial-footer {
    display: flex;
    align-items: center;  
    justify-content: flex-end;  
}

button {
    margin-right: 0.8rem;
}

.tutorial-container {
    background: var(--white);
    border-radius: 7px;
    z-index: 10;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: fit-content;
    height: fit-content;
    padding: 1rem;
    min-width: 280px;
    max-width: 350px;
    transition: opacity 0.4s;
    opacity: 0;
    border: 1px solid var(--gray-high);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

p {
    font-size: 1.1rem;
}
</style>