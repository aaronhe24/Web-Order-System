import Vue from 'vue'
import Vuex from 'vuex'
import { Locales } from '@/i18n/locales';
import { defaultLocale } from "@/router";
import {i18n} from "@/main";

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    language: defaultLocale
  },

  mutations: {

    setLanguage: (state, lang: Locales) => {
      state.language = lang
      i18n.locale = state.language
      window.localStorage.setItem('language', state.language);
    }

  },

  actions: {
    SET_LANGUAGE(context, lang: Locales) {
      context.commit('setLanguage',lang);
    }
  },

  modules: {
  }

});
