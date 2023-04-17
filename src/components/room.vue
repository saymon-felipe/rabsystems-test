<template>
    <div class="room-container">
        <div class="room-header">
            <div class="space" v-if="room.pending_participants.length == 0">&nbsp;</div>
            <div class="pending_users" v-if="room.pending_participants.length != 0">
                <div class="single-pending-participant" v-if="room.pending_participants.length == 1">
                    <img :src="room.pending_participants[0].profile_photo" class="avatar-pp" />
                    <p>
                        <span class="pending-user-name">{{ room.pending_participants[0].name }}</span> 
                        {{ $t("room.want_enter") }}
                    </p>
                    <div class="approve-deny-icons">
                        <i class="fas fa-thumbs-up approve-icon" :title="$t('room.approve_participant')" v-on:click="approveUser(room.pending_participants[0].user_id)"></i>
                        <i class="fas fa-thumbs-down deny-icon" :title="$t('room.decline_participant')" v-on:click="denyUser(room.pending_participants[0].user_id)"></i>
                    </div>
                </div>
                <div class="more-pending-participants" v-if="room.pending_participants.length > 1">
                    <span class="pulseRed">&nbsp;</span>
                    <p>
                        <span class="pending-user-name">
                            {{ room.pending_participants[0].name }}
                            <span v-html="$t('room.other_participants', { length: room.pending_participants.length - 1 })"></span>
                        </span>
                    </p>
                    <div class="manage-pending-participants">
                        <i class="fas fa-users-cog manage-pending-participants-icon" v-on:click="toggleManagePendingParticipantsContainer()" :title="$t('room.manage_requests')"></i>
                        <div class="pending-participants-container">
                            <div class="pending-participant-item" v-for="(user, index) in room.pending_participants" v-bind:key="index">
                                <img :src="user.profile_photo" class="avatar-pp" />
                                <span>{{ user.name }}</span>
                                <div class="approve-deny-icons">
                                    <i class="fas fa-thumbs-up approve-icon" :title="$t('room.approve_participant')" v-on:click="approveUser(user.user_id)"></i>
                                    <i class="fas fa-thumbs-down deny-icon" :title="$t('room.decline_participant')" v-on:click="denyUser(user.user_id)"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="room-controls">
                <!--<div class="invite-users" title="Convidar usuários para a conferência" v-on:click="inviteUsers()">
                    <i class="fas fa-users"></i>
                </div>-->
                <div class="room-visibility" v-if="$root.havePermission" :title="$t('room.turn_room_visible')" v-on:click="changeRoomVisibility()">
                    <i class="fas fa-eye-slash"></i>
                </div>
                <div class="toggle-lock-room unlock" :title="$t('room.lock_room')" v-on:click="lockUnlockRoom()">
                    <i class="fas fa-unlock"></i>
                </div>
                <div class="leave-button" :title="$t('room.turn_off_call')" v-on:click="leaveRoom()">
                    <i class="fas fa-power-off"></i>
                </div>
            </div>
        </div>
        <div class="room-name-container" v-if="!is_new_window">
            <h1 class="room-name">{{ room_name }}</h1>
            <i class="fas fa-external-link-alt open-conference-in-new-window-icon" :title="$t('room.external_conference')" v-on:click="openConferenceInNewWindow()"></i>
        </div>
        <modal v-if="showModal" :title="modalTitle" :buttonTitle="modalButtonTitle" :button2Title="modalButtonTitle2" @closeModal="closeThisModal()" @submitEvent="submitFunction()">
            <inviteUsersModalContent v-if="showInviteUsers" @success="closeThisModal()" />
        </modal>
        <div id="room-content"></div>
    </div>
</template>
<script>
import api from '../configs/api';
import { globalMethods } from '../js/globalMethods';
import $ from 'jquery';
import inviteUsersModalContent from "./inviteUsersModalContent.vue";
import modal from "./modal.vue";

export default {
    name: "room",
    mixins: [globalMethods],
    components: {
        inviteUsersModalContent,
        modal,
    },
    data() {
        return {
            room_name: "",
            meeting_id: null,
            api: {},
            room_visible: false,
            room_locked: false,
            room: {
                pending_participants: []
            },
            is_new_window: false,
            userName: "",
            userAvatar: "",
            showInviteUsers: false,
            modalTitle: "",
            modalButtonTitle: "",
            modalButtonTitle2: "",
            showModal: false
        }
    },
    watch: {
        is_new_window: function () {
            if (this.is_new_window) {
                let container = $(".room-container");
                container.addClass("room-container-new-window");
                container.removeClass("room-container");
                document.title = this.$i18n.t("room.room") + this.room_name;
            }
        }
    },
    methods: {
        inviteUsers: function () {
            this.openInviteUsersModal();
        },
        openInviteUsersModal: function () {
            this.resetModalVariables();
            this.fillModalVariables(this.$i18n.t("room.invite_users"), "", "");
            this.showModal = true;
            this.showInviteUsers = true;
        },
        leaveRoom: function () {
            if (this.is_new_window) {
                window.close();
            } else {
                this.$router.push("/rooms");
            }
        },
        openConferenceInNewWindow: function () {
            window.open("/room_new_window/" + this.meeting_id + "?rn=" + this.room_name + "&new_window=true", "_blank", "toolbar=0,location=0,menubar=0");
            this.$router.push("/rooms");
        },
        toggleManagePendingParticipantsContainer: function () {
            let element = $(".pending-participants-container");
            if (element.is(":visible")) {
                element.hide();
            } else {
                element.show();
            }
        },
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
                element.attr("title", this.$i18n.t("room.unlock_room"));
                element.removeClass("fa-unlock");
                element.addClass("fa-lock");
                container.removeClass("unlock");
                container.addClass("lock");
            } else {
                element.attr("title", this.$i18n.t("room.lock_room"));
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
                element.attr("title", this.$i18n.t("room.turn_room_invisible"));
                element.removeClass("fa-eye-slash");
                element.addClass("fa-eye");
            } else {
                element.attr("title", this.$i18n.t("room.turn_room_visible"));
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
                if (!self.is_new_window) {
                    self.userName = self.$root.user.name;
                    self.userAvatar = self.$root.user.profile_photo;
                    if (response.data.returnObj.room.creator_id != self.$root.user.id && !self.$root.havePermission && response.data.returnObj.room.room_visible_to_others != 1) {
                        self.$router.push("/rooms");
                        return;
                    }
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
            let urlSearch = new URLSearchParams(window.location.search);
            this.meeting_id = this.$route.params.meeting_id;
            this.room_name = urlSearch.get("rn");
            this.is_new_window = urlSearch.get("new_window") != null ? urlSearch.get("new_window") : false;
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
        generateUniqueName: function () {
            let unique_name = "[Rabsystems] " + this.room_name;
            return unique_name;
        },
        requireJitsi: function () {
            const domain = 'meet.jit.si';
            const options = {
                roomName: this.generateUniqueName(),
                width: "100%",
                height: "100%",
                parentNode: document.querySelector('#room-content'),
                lang: this.$i18n.locale,
                devices: {
                    audioInput: '<deviceLabel>',
                    audioOutput: '<deviceLabel>',
                    videoInput: '<deviceLabel>'
                },
                configOverwrite: {
                    disableDeepLinking: true,
                    preferH264: false,
                    disableH264: true,
                    defaultLanguage: "en",
                    resolution: "",
                    channelLastN: 25,  //acima deste numero de participantes faz o desligamento do video dos outros fora os que estao falando
                    testing: {
                        enableFirefoxSimulcast: true
                    },
                    localRecording: {
                        disable: false,
                        notifyAllParticipants: true
                    },
                    toolbarButtons: [
                        'camera',
                        'chat',
                        'desktop',
                        'download',
                        'etherpad',
                        'feedback',
                        'filmstrip',
                        'fullscreen',
                        'highlight',
                        'invite',
                        'linktosalesforce',
                        'livestreaming',
                        'microphone',
                        'noisesuppression',
                        'participants-pane',
                        'profile',
                        'raisehand',
                        'recording',
                        'security',
                        'select-background',
                        'settings',
                        'shareaudio',
                        'sharedvideo',
                        'shortcuts',
                        'stats',
                        'tileview',
                        'toggle-camera',
                        'videoquality',
                        'whiteboard',
                    ]
                },
                interfaceConfigOverwrite: {
                    filmStripOnly: false,
                    VIDEO_LAYOUT_FIT: 'both',
                    DISABLE_TRANSCRIPTION_SUBTITLES: true,
                    DEFAULT_REMOTE_DISPLAY_NAME: 'Anônimo',
                    TOOLBAR_TIMEOUT: 5000,
                    TOOLBAR_ALWAYS_VISIBLE: false,
                    DEFAULT_LOCAL_DISPLAY_NAME: 'Você',
                    VERTICAL_FILMSTRIP: true,
                    INVITATION_POWERED_BY: false,
                    SETTINGS_SECTIONS: ['devices', 'language']
                }
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

.room-container-new-window {
    height: 100vh;
}

.room-container-new-window, .room-container {
    padding: 1rem;
    text-align: center;
    background: var(--white);
}
.room-container {
    width: calc(100% - 225px);
    position: absolute;
    right: 0;
    height: 100%;
    padding-top: 2rem;
}

@media (max-width: 876px) {
    .room-container {
        width: 100%;
    }
}

.room-container-new-window .room-header {
    margin-top: 0;
    margin-bottom: 1rem;
}

.room-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
}

.room-name-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

#room-content {
    height: calc(100% - 130px);
}

.room-container-new-window #room-content {
    height: calc(100% - 60px);
}

.room-controls {
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

.invite-users {
    color: var(--white);
    background: var(--purple);
}

    .invite-users:hover {
        background: var(--purple-low);
    }

.toggle-lock-room, .leave-button, .room-visibility, .invite-users {
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
    display: flex;
    align-items: center;
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

.single-pending-participant {
    display: flex;
    align-items: center;
}

.more-pending-participants {
    position: relative;
    padding-left: 1rem;
    display: flex;
    align-items: center;
}

.pulseRed::before {
    background: var(--red);
}

.pulseRed {
    left: 0;
    position: absolute;
}

.manage-pending-participants {
    position: relative;
}

.pending-participants-container {
    display: none;
}

.manage-pending-participants {
    margin-left: 1rem;
}

.manage-pending-participants-icon {
    font-size: 25px;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.4s;
}

    .manage-pending-participants-icon:hover {
        background: var(--gray-high-2);
    }

.pending-participants-container {
    position: absolute;
    background: var(--white);
    padding: .5rem;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

.pending-participant-item {
    display: flex;
    align-items: center;
    margin: 4px 0;
    cursor: pointer;
    padding: .5rem;
}

    .pending-participant-item:hover {
        background: var(--gray-high-2);
    }

    .pending-participant-item span {
        margin-left: .5rem;
        white-space: nowrap;
        width: 100px;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
    }

.open-conference-in-new-window-icon {
    cursor: pointer;
    font-size: 20px;
    margin-left: 1rem;
}
</style>