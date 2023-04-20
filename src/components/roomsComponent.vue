<template>
    <div class="room-component">
        <p class="room-name">{{ room.room_name }}</p>
        <div class="room-inner">
            <div class="room-participants">
                <div class="user-inner" v-for="(user, index) in room.participants" v-bind:key="index">
                    <img :src="user.profile_photo" v-if="index < 2" class="avatar-pp" :title="user.name" />
                </div>
            </div>
            <div class="more-users" v-if="room.participants.length > 2">
                +{{ room.participants.length - 2 }}
                <div class="more-users-tooltip">
                    <span v-for="(user, index) in excedeedUsers" v-bind:key="index">{{ user.name }}</span>
                </div>
            </div>
            <div class="room-actions">
                <i v-if="room.locked_room != 1" class="fas fa-video" :title="$t('conferences.join_conference')" v-on:click="enterRoom()"></i>
                <i v-if="room.locked_room == 1" class="fas fa-lock lock-icon" :title="$t('conferences.locked_room')" v-on:click="enterRoom()"></i>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "roomsComponent",
    props: ["room"],
    data() {
        return {
            excedeedUsers: []
        }
    },
    methods: {
        enterRoom: function () {
            let url = "/room/" + this.room.meeting_id + "?rn=" + this.room.room_name;
            this.$router.push(url);
        },
        checkExceededUsers: function (participants) {
            for (let i = 0; i < participants.length; i++) {
                let currentParticipant = participants[i];
                if (i > 1) {
                    this.excedeedUsers.push(currentParticipant);
                }
            }
        }
    },
    mounted: function () {
        this.checkExceededUsers(this.room.participants);
    }
}
</script>
<style scoped>
.room-component {
    border: 1px solid var(--gray-high);
    width: 40%;
    max-width: 700px;
    min-width: 200px;
    border-radius: 7px;
    height: 130px;
    padding: .5rem;
    margin: 5px;
    position: relative;
}

.room-actions {
    position: absolute;
    bottom: 0;
    right: 0;
}

.room-name {
    font-weight: 500;
}

.room-participants img {
    margin: 0 5px;
    box-shadow: 0 0 0 4px var(--blue-low);
}

.more-users {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--purple);
    color: var(--white);
    font-weight: 600;
    cursor: pointer;
}

.more-users {
    position: relative;
}

.more-users:hover .more-users-tooltip {
    display: block;
}

.more-users-tooltip {
    position: absolute;
    right: -150%;
    bottom: -50%;
    background: var(--gray-high-2);
    color: var(--black);
    display: none;
    padding: .3rem;
    border-radius: 7px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.more-users-tooltip span {
    display: block;
    margin: 3px 0;
}

.user-inner {
    width: fit-content;
}

.user-inner img {
    cursor: pointer;
}

.room-participants {
    display: flex;
    align-items: center;
}

.room-inner {
    display: flex;
    align-items: center;
    justify-content: center;
}

.lock-icon {
    color: var(--red);
}

.room-actions i {
    margin: 5px;
    cursor: pointer;
}
</style>