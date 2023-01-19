<template>
    <div class="room-container">
        <div class="pending_users" v-if="room.pending_participants.length != 0">
            <img :src="room.pending_participants[0].profile_photo" class="avatar-pp">
            <p>
                <span class="pending-user-name">{{ room.pending_participants[0].name }}</span> 
                deseja entrar na sala
            </p>
            <div class="approve-deny-icons">
                <i class="fas fa-thumbs-up approve-icon" title="Aprovar participante" v-on:click="approveUser(room.pending_participants[0].user_id)"></i>
                <i class="fas fa-thumbs-down deny-icon" title="Recusar participante" v-on:click="denyUser(room.pending_participants[0].user_id)"></i>
            </div>
        </div>
        <h1 class="room-name">{{ room_name }}</h1>
        <div class="room-controls">
            <div class="room-visibility" v-if="$root.havePermission" title="Tornar sala visível para todos" v-on:click="changeRoomVisibility()">
                <i class="fas fa-eye-slash"></i>
            </div>
            <div class="toggle-lock-room unlock" title="Trancar a sala" v-on:click="lockUnlockRoom()">
                <i class="fas fa-unlock"></i>
            </div>
            <div class="leave-button" title="Desligar a chamada">
                <i class="fas fa-power-off"></i>
            </div>
        </div>
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
            api: {},
            room_visible: false,
            room_locked: false,
            room: {
                pending_participants: []
            }
        }
    },
    methods: {
        approveUser: function (user_id) {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();

            let data = {
                meeting_id: this.meeting_id,
                request_user_id: user_id
            }

            api.post("/rooms/approve_user", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then((response) => {
                console.log(response.data.message);
                self.pingMeeting(false);
            })
        },
        denyUser: function (user_id) {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();

            let data = {
                meeting_id: this.meeting_id,
                request_user_id: user_id
            }

            api.post("/rooms/deny_user", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then((response) => {
                console.log(response.data.message);
                self.pingMeeting(false);
            })
        },
        changeLockUnlockButtonStyle: function (lock) {
            let container = $(".toggle-lock-room");
            let element = container.find("i");
            if (lock) {
                element.attr("title", "Destrancar a sala");
                element.removeClass("fa-unlock");
                element.addClass("fa-lock");
                container.removeClass("unlock");
                container.addClass("lock");
            } else {
                element.attr("title", "Trancar a sala");
                element.removeClass("fa-lock");
                element.addClass("fa-unlock");
                container.removeClass("lock");
                container.addClass("unlock");
            }
        },
        lockUnlockRoom: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();

            let data = {
                meeting_id: this.meeting_id
            }
            this.room_locked = !this.room_locked;

            if (this.room_locked) {
                this.changeLockUnlockButtonStyle(true);

                api.post("/rooms/lock", data, {
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(function (response) {
                    console.log(response.data.message);
                })
            } else {
                this.changeLockUnlockButtonStyle(false);

                api.post("/rooms/unlock", data, {
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(function (response) {
                    console.log(response.data.message);
                })
            }
        },
        changeRoomVisibilityStyle: function (visible) {
            let element = $(".room-visibility i");
            if (visible) {
                element.attr("title", "Tornar sala invisível para todos");
                element.removeClass("fa-eye-slash");
                element.addClass("fa-eye");
            } else {
                element.attr("title", "Tornar sala visível para todos");
                element.removeClass("fa-eye");
                element.addClass("fa-eye-slash");
            }
        },
        changeRoomVisibility: function () {
            this.room_visible = !this.room_visible;
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();

            let data = {
                meeting_id: this.meeting_id
            }
            if (this.room_visible) {
                this.changeRoomVisibilityStyle(true);

                api.post("/rooms/show_room", data, {
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(function (response) {
                    console.log(response.data.message);
                })
            } else {
                this.changeRoomVisibilityStyle(false);

                api.post("/rooms/hide_room", data, {
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(function (response) {
                    console.log(response.data.message);
                })
            }
        },
        checkIfHavePermissionGranted: function () {
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
                    self.initRoom();
                } else {
                    self.redirectToWaitPage();
                }
            })
        },
        requireMeetingPermissionToEnter: function () {
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
                }
                if (response.data.returnObj.hasCreator || response.data.returnObj.room.locked_room != 1) {
                    self.initRoom();
                } else {
                    self.checkIfHavePermissionGranted();
                }
            })
            .catch((error) => {
                console.log(error);
                self.$router.push("/rooms");
            })
        },
        initRoom: function () {
            this.requireJitsi();
            this.enterRoom();
        },
        getUrlInformations: function () {
            this.meeting_id = this.$route.params.meeting_id;
            this.room_name = new URLSearchParams(window.location.search).get("rn");
            this.requireMeetingPermissionToEnter();
        },
        redirectToWaitPage: function () {
            let url = "/rooms/wait/" + this.meeting_id + "?rn=" + this.room_name;
            let jwt = "Bearer " + this.getJwtInLocalStorage();
            let data = {
                meeting_id: this.meeting_id
            }

            api.post("/rooms/request_enter", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then(() => {
                this.$router.push(url);
            })
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
        pingMeeting: function (recursive = true) {
            let self = this;
            let jwt = "Bearer " + this.getJwtInLocalStorage();
            let data = {
                meeting_id: this.meeting_id
            }

            if ($("#room-content").is(":visible")) {
                api.post("/rooms/ping_meeting", data, {
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(function (response) {
                    self.room = response.data.returnObj.currentRoom;
                    if (response.data.returnObj.currentRoom.locked_room == 1) {
                        self.room_locked = true;
                        self.changeLockUnlockButtonStyle(true);
                    } else {
                        self.room_locked = false;
                        self.changeLockUnlockButtonStyle(false);
                    }
                    if (response.data.returnObj.currentRoom.room_visible_to_others == 1) {
                        self.room_visible = true;
                        self.changeRoomVisibilityStyle(true);
                    } else {
                        self.room_visible = false;
                        self.changeRoomVisibilityStyle(false);
                    }
                    console.log(response.data.message);
                    if (recursive) {
                        setTimeout(() => {
                            self.pingMeeting();
                        }, 15 * 1000)   
                    }
                })
            }
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

.room-controls {
    position: absolute;
    right: 1rem;
    top: 2.3rem;
    display: flex;
    align-items: center;
}

.room-controls i {
    font-size: 28px;
}

.lock {
    background: var(--orange);
}

    .lock:hover {
        background: var(--orange-2);
    }

.unlock {
    background: var(--green);
}

    .unlock:hover {
        background: var(--green-low);
    }

.leave-button {
    background: var(--red);
}

    .leave-button:hover {
        background: var(--red-low);
    }

.room-visibility {
    color: var(--black) !important;
    background: var(--blue-high);
}

    .room-visibility:hover {
        background: var(--blue);
    }

.toggle-lock-room, .leave-button, .room-visibility {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    padding: 7px 25px;
    border-radius: 25px;
    margin: 0 .5rem;
    cursor: pointer;
}

.pending_users {
    display: flex;
    align-items: center;
}

    .pending_users p {
        margin-left: .5rem;
        margin-bottom: 0;
    }

    .pending-user-name {
        font-weight: 500;
    }

.approve-deny-icons {
    margin: 0 .5rem;
}

    .approve-deny-icons i {
        font-size: 18px;
        margin: 0 5px;
        cursor: pointer;
    }

    .approve-icon {
        color: var(--green);
    }
        .approve-icon:hover {
            color: var(--green-low);
        }

    .deny-icon {
        color: var(--red);
    }

        .deny-icon:hover {
            color: var(--red-low);
        }
</style>