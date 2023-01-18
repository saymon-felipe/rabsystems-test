<template>
    <div class="conference-page">
        <div class="ongoing-conferences">
            <div class="page-title">
                <h1 class="rabsystems-font">Conferências em andamento</h1>
            </div>
            <div class="rooms-in-conference">
                <roomsComponent v-for="(room, index) in rooms" v-bind:key="index" :room="room" />
                <div class="no-rooms" v-if="rooms.length == 0">
                    <p>Sem conferências em andamento</p>
                </div>
            </div>
        </div>
        <div class="create-a-conference">
            <router-link class="btn primary" to="/rooms/create">
                Iniciar uma conferência
            </router-link>
        </div>
    </div>
</template>
<script>
import roomsComponent from "./roomsComponent.vue";
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "conferencePage",
    mixins: [globalMethods],
    data() {
        return {
            rooms: []
        }
    },
    methods: {
        returnRooms: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();

            api.get("/rooms", { headers: { Authorization: jwt } }).then(function (response) {
                self.rooms = response.data.returnObj;
                setTimeout(() => {
                    self.returnRooms();
                }, 20 * 1000);
            })
        }
    },
    mounted: function () {
        this.returnRooms();
    },
    components: {
        roomsComponent
    }
}

</script>
<style scoped>
.conference-page {
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
    .conference-page {
        width: 100%;
    }
}

.create-a-conference {
    margin-top: 2rem;
}

.no-rooms p {
    font-size: 24px;
    font-weight: 500;
}

.rooms-in-conference {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
}
</style>