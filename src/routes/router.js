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
import changeProfile from '../components/changeProfile.vue';
import register from '../pages/register.vue';
import complete_registration from '../pages/complete_registration.vue';

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
                path: '/change-profile',
                component: changeProfile
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