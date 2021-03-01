import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { Locales } from "@/i18n/locales";
import en from "../i18n/en.json"
import fr from "../i18n/fr.json";
import cn from "../i18n/cn.json";
import HomeView from '@/views/HomeView.vue'
import ShopOrderView from "@/views/ShopOrderView.vue";
import ProfileView from "@/views/ProfileView.vue";
import SignInView from "@/views/SignInView.vue";
import AddrBookView from "@/views/AddrBookView.vue";
import { getLocalStorage } from "@/common/settingTools";
import RestaurantListView from "@/views/RestaurantListView.vue";
import PaymentView from "@/views/PaymentView.vue";
import PaymentSuccessView from "@/views/PaymentSuccessView.vue";
import OrderListView from "@/views/OrderListView.vue";
import PaymentFailView from "@/views/PaymentFailView.vue";
import OrderDetailView from "@/views/OrderDetailView.vue";
import CouponListView from "@/views/CouponListView.vue";

export const messages = {
  [Locales.EN]: en,
  // [Locales.FR]: fr,
  [Locales.CN]: cn
};

//获取浏览器缓存
export const defaultLocale = getLocalStorage().defaultLocale
// console.log(getLocalStorage().sessionUser)
// console.log(getLocalStorage().sessionAddress)
// console.log(getLocalStorage().sessionCityId)
// console.log(getLocalStorage().sessionLatLng)

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/shopOrder',
    name: 'ShopOrderView',
    component: ShopOrderView,
    props: true
  },
  {
    path: '/profile',
    name: 'ProfileView',
    component: ProfileView
  },
  {
    path: '/signIn',
    name: 'SignInView',
    component: SignInView
  },
  {
    path: '/restaurants',
    name: 'RestaurantListView',
    component: RestaurantListView,
    props: true
  },
  {
    path: '/paymentSuccess',
    name: 'PaymentSuccessView',
    component: PaymentSuccessView,
    props: true
  },
  {
    path: '/paymentFail',
    name: 'PaymentFailView',
    component: PaymentFailView,
    props: true
  },
  {
    path: '/addrBook',
    name: 'AddrBook',
    component: AddrBookView,
    props: true
  },
  {
    path: '/payment',
    name: 'PaymentView',
    component: PaymentView,
    props: true
  },
  {
    path: '/orderList',
    name: 'OrderListView',
    component: OrderListView
  },
  {
    path: '/orderDetail',
    name: 'OrderDetailView',
    component: OrderDetailView,
    props: true
  },
  {
    path: '/couponList',
    name: 'CouponListView',
    component: CouponListView,
    props: true
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
