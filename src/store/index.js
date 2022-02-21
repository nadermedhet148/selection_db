import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let app_title = "منظومة معمل الانتقاء والتوجيه  حرس الحدود";
let root_ip = "192.9.201.30";
export default new Vuex.Store({
  state: {
    allowConscripteEdit: false,
    scraping: false,
    isWebwinOpened: null,
    routes: [],
    current_route: 0,
    app_version: window.app_version ? window.app_version : "0.0.0",
    root_ip: root_ip,
    root_path: "\\\\" + root_ip + "\\",
    app_path:
      "\\\\" +
      root_ip +
      "\\Projects ملفات المنظومة الجديدة\\Releases\\new_manzoma\\segelat.exe",
    currentUser: null,
    users: [],
    app_title: window.app_title ? window.app_title : app_title,
    router_title: "",
    router_obj: null,
    current_server: "x",
    sockets: {
      connected: {},
      _connected: {},
      myId: ""
    },
    notifications: {
      unSeenMsgsCounter: 0
    },
    rtc_sockets: {
      connected: {},
      _connected: {},
      myId: "",
      creatorId: "",
      managers: [],
      devices: {}
    },
    dbprocs: {
      model: false,
      procedureType: 0,
      situationType: 0,
      situationId: 0
    },
    vue_webrtc: {
      // Passed to Component
      roomId: "default_roomId",
      socketURL: "http://" + root_ip + ":8082/",
      cameraHeight: 90,
      autoplay: true,
      screenshotFormat: "image/jpeg",
      enableAudio: true,
      enableAudio_disabled: false,
      enableVideo: true,
      enableVideo_disabled: false,
      enableLogs: false,
      stunServer: "stun:" + root_ip + ":3478",
      turnServer: null,
      // Screen Share
      shareScreen: false,
      shareScreen_disabled: false,
      otherShareScreen: false,
      // For recording
      myStreamId: "",
      myStream: null,
      mediaRecorder: null,
      records: [],
      // Settings
      settings: {
        who_invites: "only_me"
      },
      // Other
      roomId_request: "",
      expanded_stream: null,
      settings_drawer: null,
      timeCounter: null,
      counter: 0,
      callers: {
        user1: {},
        user2: {},
        model: false,
        media: "",
        constraints: {},
        inCall: false
      },
      _callers: {
        caller: "",
        callee: ""
      },
      mediaDevices: {
        all: [],
        audioinputs: [],
        audiooutputs: [],
        videoinputs: [],
        // Selected Devices
        audioinput: null,
        audiooutput: null,
        videoinput: null
      }
    },
    update: {
      found: false,
      installed: false
    },
    appProps: {},
    appConfig: {},
    appError: {
      name: "",
      server: "",
      msg: "",
      model: false
    },
    appSuccess: {
      name: "",
      server: "",
      msg: "",
      model: false
    },
    appInfo: {
      name: "",
      server: "",
      msg: "",
      model: false,
      dateDialog: false
    },
    snackbar: {
      text: "",
      model: false,
      color: "default"
    },
    options: {
      drawer: null,
      about_drawer: null,
      fixed_sidenav: true,
      about_fixed_sidenav: true,
      mini_variant: false,
      currentTheme: "primary",
      scrollbar_settings: {
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false
      },
      dateFormat: {
        format: "####/##/##",
        placeholder: "سنة/شهر/يوم"
        // v-mask="`${$store.state.options.dateFormat.format}`"
        // :placeholder="
        //   `${$store.state.options.dateFormat.placeholder}`
        // "
      }
    },
    lightbox: {
      imgs: [],
      model: false,
      value: null
    },
    dafaterRootDir:
      "//" +
      root_ip +
      "/qyada_qwat_hrs_alhdwd/fra_alsjlat_qyada_qwat_hrs_alhdwd/ScanTree/16",

    tcUploadPath: ""
  },
  mutations: {
    hideRoute(state, index) {
      state.routes[index].isHidden = true;
    },
    setWebwinOpened(state, isOpened) {
      state.isWebwinOpened = isOpened;
    },
    setTcUploadPath(state, val) {
      state.tcUploadPath = val;
    },
    setRouterTitle(state, val) {
      state.router_title = val;
    },
    setRouterObj(state, val) {
      state.router_obj = val;
    },
    setNewRoute(state, val) {
      // console.log(val);
      let exists = state.routes.map(v => v.name).includes(val.name);
      if (exists) {
        let index = state.routes.findIndex(v => v.name == val.name);
        state.routes[index].fullPath = val.fullPath;
        state.routes[index].isHidden = false;
        // Delete all params
        if (
          state.routes[index].params &&
          Object.keys(state.routes[index].params).length > 0
        ) {
          Object.keys(state.routes[index].params).forEach((k, i) => {
            // delete state.routes[index].params[k];
            state.routes[index].params[k] = val.params[k];
          });
        }
        // if (val.params) {
        //   Object.keys(val.params).forEach((k, i) => {
        //     state.routes[index].params[k] = val.params[k];
        //   });
        // }
        // state.routes.splice(index, 1);
        // state.routes.push(val);
        // state.current_route = state.routes.length - 1;
        state.current_route = index;
      } else {
        state.routes.push({ ...val, isHidden: false });
        state.current_route = state.routes.length - 1;
      }
    }
  },
  getters: {
    getTcUploadPath(state) {
      return state.tcUploadPath;
    },
    getCurrUserId(state) {
      return state.currentUser.userId;
    },
    getCurrSection(state) {
      return state.currentUser.section;
    },
    isFullApp() {
      return window.isFullApp === "true";
    }
  },
  actions: {},
  modules: {}
});
