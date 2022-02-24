import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";
import ar from "@/langs/ar";
import en from "@/langs/en";
import VuetifyConfirm from "vuetify-confirm";

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    dark: false,
    themes: {
      light: {
        primary: "#1BF2A3",
        secondary: "#424242",
        sidenav: "#F29422",
        // anchor: "#1976D2",
        accent: "#643DF2",
        error: "#D955B5",
        info: "#F25252",
        success: "#4CAF50",
        warning: "#D955B5",
        // Editions
        white: "#F8F8FF",
        girly: "#F764b2"
      },
      dark: {
        primary: window.isFullApp === "true" ? "#00b0f0" : "#1acf5f", // #FFFF00 - #ff6c07
        sidenav: window.isFullApp === "true" ? "#00b0f0" : "#1acf5f",
        secondary: "#CACACA",
        // anchor: "#FFFF00",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
        // Editions
        white: "#F8F8FF", // 000000
        girly: "#F764b2",
        black: "#000000"
      }
    }
  },
  lang: {
    locales: { ar, en },
    current: "ar"
  },
  rtl: true,
  icons: {
    iconfont: "mdi"
  }
});

Vue.use(VuetifyConfirm, {
  vuetify,
  buttonTrueText: "موافق",
  buttonFalseText: "رجوع",
  color: "success",
  icon: "warning",
  title: "Warning",
  width: 350,
  property: "$confirm"
});

export default vuetify;
