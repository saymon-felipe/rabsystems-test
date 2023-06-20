import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import appPage from "../pages/app.vue";
import myOrders from "../components/myOrders.vue";
import login from "../pages/login.vue";
import newOrder from "../components/newOrder.vue";
import financial from "../components/financial.vue";
import profile from '../components/profile';
import support from '../components/support.vue';
import orderDetails from '../components/orderDetails.vue';
import register from '../pages/register.vue';
import complete_registration from '../pages/complete_registration.vue';
import conferencePage from "../components/conferencePage.vue";
import createRoom from "../components/createRoom.vue";
import room from "../components/room.vue";
import waitToEnterRoom from "../components/waitToEnterRoom.vue";
import timeMachine from "../components/timeMachine.vue";
import admin from "../components/admin.vue";

const routes = [
    {
        path: "/room_new_window/:meeting_id",
        component: room
    },
    {
        path: '',
        redirect: '/login'
    },
    {
        path: '/app',
        component: appPage,
        children: [
            {
                path: '/my-orders',
                component: myOrders
            },
            {
                path: '/new-order',
                component: newOrder
            },
            {
                path: '/financial',
                component: financial
            },
            {
                path: '/rooms',
                component: conferencePage
            },
            {
                path: '/rooms/create',
                component: createRoom
            },
            {
                path: '/rooms/wait/:meeting_id',
                component: waitToEnterRoom
            },
            {
                path: "/room/:meeting_id",
                component: room
            },
            {
                path: '/profile',
                component: profile
            },
            {
                path: '/support',
                component: support
            },
            {
                path: '/order-details/:id',
                component: orderDetails
            },
            {
                path: "/time-machine",
                component: timeMachine
            },

            // ROTAS ADMIN
            {
                path: "/admin",
                component: admin
            }
            // ROTAS ADMIN

        ]
    },
    {
        path: '/register',
        component: register
    },
    {
        path: "/complete-registration",
        component: complete_registration
    },
    {
        path: '/login',
        component: login
    }
];

const router = new VueRouter({
    routes,
    mode: 'history'
});

export default router;