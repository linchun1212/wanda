import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import MintUI from "mint-ui";
import "mint-ui/lib/style.css";
import "./assets/css/unit.css";
import axios from "axios";
import VueAxios from "vue-axios";

import "./assets/font-awesome-4.7.0/css/font-awesome.css";

Vue.use(VueAxios, axios);
Vue.use(MintUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
