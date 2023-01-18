<template>
    <div class="room-container">
        <h1 class="room-name">{{ room_name }}</h1>
        <div id="room-content"></div>
    </div>
</template>
<script>
import api from '../configs/api';
import { globalMethods } from '../js/globalMethods';
import $ from 'jquery';

export default {
    name: "room",
    mixins: [globalMethods],
    data() {
        return {
            room_name: "",
            meeting_id: null,
            api: {}
        }
    },
    methods: {
        getUrlInformations: function () {
            this.meeting_id = this.$route.params.meeting_id;
            this.room_name = new URLSearchParams(window.location.search).get("rn");
            this.requireJitsi();
            this.enterRoom();
        },
        enterRoom: function () {
            let self = this;
            let jwt = "Bearer " + this.getJwtInLocalStorage();
            let data = {
                meeting_id: this.meeting_id
            }

            api.post("/rooms/enter_room", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then((response) => {
                self.pingMeeting();
                console.log(response.data.message);
            })
        },
        requireJitsi: function () {
            const domain = 'meet.jit.si';
            const options = {
                roomName: this.room_name,
                width: "100%",
                height: "100%",
                parentNode: document.querySelector('#room-content'),
                lang: 'pt-br',
                devices: {
                    audioInput: '<deviceLabel>',
                    audioOutput: '<deviceLabel>',
                    videoInput: '<deviceLabel>'
                },
            };
            this.api = new window.JitsiMeetExternalAPI(domain, options);
        },
        pingMeeting: function () {
            let self = this;
            let jwt = "Bearer " + this.getJwtInLocalStorage();
            let data = {
                meeting_id: this.meeting_id
            }

            api.post("/rooms/ping_meeting", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function (response) {
                console.log(response.data.message);
                if ($("#room-content").is(":visible")) {
                    setTimeout(() => {
                        self.pingMeeting();
                    }, 15 * 1000)   
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
.room-container {
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
    .room-container {
        width: 100%;
    }
}

#room-content {
    height: calc(100% - 80px);
}
</style>