import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router, {defaultLocale} from './router'
import {GlobalSettingPreference} from "@/GlobalSettingPreference";
import VueI18n from 'vue-i18n'
import en from "./i18n/en.json"
import fr from "./i18n/fr.json";
import cn from "./i18n/cn.json";
import {Service} from "@/api/Service";
import store from "@/store/store";
import {ENV} from "@/module/enum/ENV";
import * as VueGoogleMaps from 'vue2-google-maps'
import VueSmoothScroll from 'vue2-smooth-scroll'
import VueCarousel from 'vue-carousel';
import vClickOutside from 'v-click-outside'
import VueGtag from "vue-gtag";

//启动自动执行，判断现在处在开发环境还是测试环境之下
(function env() {
  let isLocalTest = window.location.href.includes(ENV.LOCAL_DEV) || window.location.href.includes("8080/")
    || window.location.href.includes("8081/") ;
  let isOnlineTest = window.location.href.includes(ENV.TEST_DEV);
  let isOnline = window.location.href.includes(ENV.RELEASE);
  let isSandBOX = window.location.href.includes(ENV.SB);
  if(isOnline){
    GlobalSettingPreference.getInstance().baseUrl = Service.RELEASE
    GlobalSettingPreference.getInstance().env = ENV.RELEASE
  }else if(isSandBOX){
    GlobalSettingPreference.getInstance().baseUrl = Service.SANDBOX
    GlobalSettingPreference.getInstance().env = ENV.SB
  }else if(isOnlineTest){
    GlobalSettingPreference.getInstance().baseUrl = Service.TEST
    GlobalSettingPreference.getInstance().env = ENV.TEST_DEV
  }else if(isLocalTest){
    GlobalSettingPreference.getInstance().baseUrl = Service.LOCAL
    GlobalSettingPreference.getInstance().env = ENV.LOCAL_DEV
    console.log("localTest")
  }else{
    GlobalSettingPreference.getInstance().baseUrl = Service.SANDBOX
    GlobalSettingPreference.getInstance().env = ENV.SB
  }

}());

Vue.use(vClickOutside)
Vue.use(VueCarousel);
Vue.use(VueSmoothScroll)

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCky-IvCGP8nIrbz8dfS-6x88CgCGWb2PI',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    // v: '3.26',
  },
})

Vue.use(VueI18n)
export const i18n = new VueI18n({
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {
    en, fr, cn
  }
})

Vue.config.productionTip = true
Vue.prototype.log = console.log

Vue.use(VueGtag, {
  config: { id: "AW-919930352" }
});

new Vue({
  i18n,
  store,
  router,
  render: h => h(App)
}).$mount('#app')






