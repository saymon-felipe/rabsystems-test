<template>
    <div class="create-room">
        <div class="page-title">
            <h1 class="rabsystems-font">{{ $t("create_room.create_room") }}</h1>
        </div>      
        <div class="room-informations">
            <form @submit.prevent="createRoomFunction()">
                <input type="text" id="room-name" :placeholder="$t('create_room.enter_room_name')" required>
                <button type="submit" class="btn primary">{{ $t("create_room.create_room") }}</button>
            </form>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "createRoom",
    mixins: [globalMethods],
    methods: {
        createRoomFunction: function () {
            let self = this;
            let roomName = $("#room-name").val();
            let meeting_id = Math.random().toString().replace("0.", "");
            let creator_id = this.$root.user.id;
            let jwt = "Bearer " + this.getJwtInLocalStorage();

            let data = {
                meeting_id: meeting_id,
                room_name: roomName,
                creator_id: creator_id
            }

            api.post("/rooms/create", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function () {
                api.post("/rooms/enter_room", data, {
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(() => {
                    self.$router.push("/room/" + meeting_id + "?rn=" + roomName);
                })
            })
        }
    }
}
</script>
<style scoped>
.create-room {
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
    .create-room {
        width: 100%;
    }
}

.room-informations {
    max-width: 500px;
    margin: auto;
}

.room-informations button {
    width: 100%;
    margin-top: .5rem;
}
</style>