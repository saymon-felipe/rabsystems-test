import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import home from "../pages/home.vue";
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

const routes = [
    {
        path: '/',
        component: home
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
            }
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