import "whatwg-fetch";
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueLocalStorage from "vue-localstorage";
import adapter from "webrtc-adapter";
import axios from "axios";
import VueAxios from "vue-axios";
window.adapter = adapter;
Vue.use(VueLocalStorage, {
  name: "ls",
  bind: true
});
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";
let servers = {
    local: "127.0.0.1",
    remote: "192.9.201.77",
    home: "192.168.1.5",
    hostednetwork: "192.168.137.1",
    moqadem: "192.9.201.30",
    hotspot: "169.254.219.1",
    nozom: "192.9.201.15"
  },
  serverLink = `http://${servers.moqadem}:8082`;
Vue.mixin({
  data: () => ({
    serverLink
  })
});
let socket = io(serverLink);
Vue.use(VueSocketIOExt, socket);
// import WebRTC from "vue-webrtc";
// Vue.use(WebRTC);
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@openfonts/cairo_arabic";
import "@mdi/font/css/materialdesignicons.css";

import { mask } from "vue-the-mask"; // Note: I have modified this module core in 'node_modules' folder.
Vue.directive("mask", mask);

// Vue moment gives us a human readable time ago like " 3 minutes ago "
Vue.use(require("vue-moment"));

// Custom scrollbar
import vueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";

Vue.component("vue-custom-scrollbar", vueCustomScrollbar);

// Charts
import VueApexCharts from "vue-apexcharts";
Vue.component("apexChart", VueApexCharts);

// App fab for each page
Vue.component("app-fab", () => import("@/components/global/app-fab.vue"));

// Military Advanced Printer and Table
Vue.component("military-printer", () =>
  import("@/components/items/military_printer/index.vue")
);
Vue.component("printer-menu", () =>
  import("@/components/items/military_printer/printer-menu.vue")
);
Vue.component("military-table", () =>
  import("@/components/items/military_table/index.vue")
);

// Table Header Groups && Filters
Vue.component("table-header-groups", () =>
  import("@/components/global/table/header-groups.vue")
);
Vue.component("table-header-filters", () =>
  import("@/components/global/table/header-filters.vue")
);
Vue.component("table-bulider", () =>
  import("@/components/global/table/table-bulider.vue")
);
// Vue.component("table-header-filters-old", () =>
//   import("@/components/global/table/header-filters-old.vue")
// );
Vue.component("table-footer-filters", () =>
  import("@/components/global/table/footer-filters.vue")
);

// Scrollbar
Vue.component("perfect-scrollbar", () => import("vue-perfect-scrollbar"));

// dynamic-links like Facebook and Social Apps
Vue.component("dynamic-link", () => import("@/components/items/dynamic-link"));

// Import Custom Sass (SCSS)
import "@/scss/main.scss";

// Mixins
import "@/mixin/index.js";

// Server Mixins
import "@/server-sequelize/sender";

// upload mixins
import "@/plugins/upload.js";

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

let app;
if (!app) {
  app = new Vue({
    async created() {
      this.api("server/is-webwin-opened", { noAsync: true })
        .then(({ data: isWebwinOpened }) => {
          this.$store.commit("setWebwinOpened", isWebwinOpened);
          if (isWebwinOpened) {
            this.$router.push("/websites");
          }
          let ls_user = this.$ls.get("currentUser"),
            user = ls_user ? JSON.parse(ls_user) : null;
          if (user) {
            this.api("tables/users/sign_in", {
              username: user.username,
              password: user.password
            })
              .then(record => {
                let data = record.data;
                if (record.ok && data && data.isVisible) {
                  this.$set(this.$store.state, "currentUser", record.data);
                  // this.fetchUnseenMsgs();
                }
                this.hidePreloader();
              })
              .catch(error => {
                this.hidePreloader();
                this.showError(error);
              });
          } else {
            this.hidePreloader();
          }
        })
        .catch(error => {
          console.log(error);
          this.hidePreloader();
        })
        .finally(async () => {
          /**
           * -----------------------------------
           * Turn on Firewall and add some rules
           * -----------------------------------
           */
          // let x = await this.api("server/firewall");
          console.log(x);
        });
    },
    async mounted() {
      this.getAppDefaults();
      let appProps = await this.api("global/get_all", {
        table: "appProps"
      });
      let appPropsFixed = {};
      appProps.data.forEach(prop => {
        appPropsFixed[prop.property] = {
          value: prop.value,
          defaultValue: prop.defaultValue
        };
      });
      // console.log(appPropsFixed);
      this.$set(this.$store.state, "appProps", appPropsFixed);
      let current_server = await this.api("server/name", { noAsync: true });
      this.$set(this.$store.state, "current_server", current_server.data);
    },
    data: {
      // themes,
    },
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount("#app");
}
window.appVue = app;
window.onunload = e => {
  var isSaved = localStorage.getItem("saveLogin");
  if (!isSaved || isSaved == "false") {
    localStorage.removeItem("currentUser");
  }
};
