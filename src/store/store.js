import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import { city } from "./modules/city";
import { cinema } from "./modules/cinema";

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    city,
    cinema
  }
});
