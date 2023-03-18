<template>
    <div>
        <div class="user-list">
            <div :class="'user-item-' + user.id" v-for="(user, index) in users" v-bind:key="index">
                <div class="user-container" v-if="user.incomplete_registration != 'true'">
                    <div class="user-informations">
                        <div class="user-img-container">
                            <img :src="user.profile_photo" class="avatar-p" />
                            <div class="user-status" :class="user.user_status"></div>
                        </div>
                        <p>{{ user.name }}</p>
                    </div>
                    <button class="btn primary invite-button" v-on:click="inviteUser(user.id)">Convidar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import api from '../configs/api';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "inviteUsersModalContent",
    mixins: [globalMethods],
    data() {
        return {
            users: []
        }
    },
    methods: {
        inviteUser: function (userId) {
            let button = $(".user-item-" + userId + " .invite-button");
            if (button.attr("disabled") == "disabled") {
                return;
            }

            button.attr("disabled", "disabled");
            button.html("Convite enviado");
            console.log(userId);
        },
        requireUsers: function () {
            let self = this;
            let jwt = "Bearer " + self.getJwtInLocalStorage();

            if (self.$root.havePermission) {
                api.post("/user/return_all_users", "", {
                    headers: {
                        Authorization: jwt
                    }
                })
                .then((response) => {
                    self.users = response.data.users_list;
                })
            } else {
                this.users.push(this.$root.rabsystemsUser);
            }
        }
    },
    mounted: function () {
        this.requireUsers();
    }
}
</script>
<style scoped>
.user-container {
    margin: 3px 0;
    padding: .5rem;
    justify-content: space-between;
}

    .user-container:hover {
        background: var(--gray-high-2);
    }

.user-container, .user-informations {
    display: flex;
    align-items: center;
}

    .user-informations p {
        margin: 0;
        font-weight: 500;
    }

.user-img-container {
    width: 50px;
}

.user-status {
    border: 2px solid var(--white);
}
</style>