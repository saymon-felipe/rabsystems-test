<template>
    <div class="wait-room-container">
        <div class="page-title">
            <h1 class="rabsystems-font">Sala de espera</h1>
        </div>      
        <div class="wait-room">
            <p class="wait-warning">Você está na fila de espera para entrar na sala</p>
            <p class="verifying-text">Verificando se sua entrada foi permitida em... <span>{{ wait_seconds }}</span></p>
            <button class="btn primary" v-on:click="returnToHome()">Desistir</button>
        </div>
    </div>
</template>
<script>
import api from '../configs/api';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "waitToEnterRoom",
    mixins: [globalMethods],
    data() {
        return {
            meeting_id: "",
            room_name: "",
            wait_seconds: "0"
        }
    },
    methods: {
        returnToHome: function () {
            this.$router.push("/rooms");
        },
        getUrlInformations: function () {
            this.meeting_id = this.$route.params.meeting_id;
            this.room_name = new URLSearchParams(window.location.search).get("rn");
            this.checkIfRoomIsValid();
        },
        returnToConference: function () {
            this.$router.push("/room/" + this.meeting_id + "?rn=" + this.room_name);
        },
        checkIfRoomIsValid: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();
            let data = {
                meeting_id: self.meeting_id
            }

            api.post("/rooms/return_room_by_meeting_id", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then((response) => {
                if (!self.$root.havePermission && response.data.returnObj.room.room_visible_to_others != 1) {
                    self.$router.push("/rooms");
                    return;
                } else {
                    self.checkIfRequestIsAccepted();
                }
            })
            .catch(() => {
                self.$router.push("/rooms");
            })
        },
        countSeconds: function () {
            this.wait_seconds = 5;
            let interval = setInterval(() => {
                this.wait_seconds--;
                if (this.wait_seconds == 0) {
                    clearInterval(interval);
                }
            }, 1000);
        },
        checkIfRequestIsAccepted: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();
            let data = {
                meeting_id: self.meeting_id
            }

            api.post("/rooms/request_accepted", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then((response) => {
                if (response.data.returnObj.request_accepted) {
                    self.returnToConference();
                } else {
                    self.countSeconds();
                    setTimeout(() => {
                        self.checkIfRequestIsAccepted();
                    }, 5 * 1000);
                }
                if (response.data.returnObj.denied_permission) {
                    self.$router.push("/rooms");
                }
            })
        }
    },
    mounted: function () {
        this.getUrlInformations();
    }
}
</script>
<style scoped>
.wait-room-container {
    width: calc(100% - 225px);
    height: 100%;
    padding: 1rem;
    padding-top: 2rem;
    text-align: center;
    background: var(--white);
    position: absolute;
    right: 0;
}

@media (max-width: 876px) {
    .wait-room-container {
        width: 100%;
    }
}

.wait-warning {
    font-size: 21px;
    font-weight: 500;
}

.verifying-text {
    font-size: 18px;
}

    .verifying-text span {
        font-weight: 600;
    }
</style>