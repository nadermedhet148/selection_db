<template>
  <v-dialog
    v-show="
      $store.state.vue_webrtc.callers.user1.userId &&
        $store.state.vue_webrtc.callers.user2.userId
    "
    persistent
    max-width="900"
    scrollable
    :fullscreen="fullscreen"
    v-model="$store.state.vue_webrtc.callers.model"
  >
    <!-- When an audio or video request is recieved -->
    <v-card class="call-card" style="min-height: 80vh">
      <v-card-title>
        مكالمة
        {{
          $store.state.vue_webrtc.callers.media == "video" ? "فيديو" : "صوتية"
        }}
        {{ $store.state.vue_webrtc.shareScreen ? " + مشاركة شاشتك" : "" }}
        {{
          $store.state.vue_webrtc.otherShareScreen ? "+ مشاركة شاشة أحدهم" : ""
        }}
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn
            depressed
            fab
            @click="$store.state.vue_webrtc.callers.model = false"
          >
            <v-icon>mdi-window-minimize</v-icon>
          </v-btn>
          <v-btn depressed fab @click="fullscreen = !fullscreen">
            <v-icon
              >mdi-window-{{ fullscreen ? "restore" : "maximize" }}</v-icon
            >
          </v-btn>
          <div
            class="d-inline-block"
            v-if="
              $store.state.vue_webrtc.callers.inCall &&
                ($store.state.vue_webrtc.callers.media == 'video' ||
                  $store.state.vue_webrtc.shareScreen ||
                  $store.state.vue_webrtc.otherShareScreen)
            "
          >
            <span
              style="width: 150px"
              class="d-inline-block text-center"
              dir="ltr"
            >
              {{ modifiedCounter }}
            </span>
            <v-btn color="error" fab outlined @click="endCall()">
              <v-icon>mdi-phone-off</v-icon>
            </v-btn>
          </div>
        </v-card-actions>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-0 ma-0" style="position: relative">
        <v-btn
          :disabled="!$store.state.vue_webrtc.callers.inCall"
          fab
          absolute
          style="top: 15px"
          right
          @click="
            $store.state.vue_webrtc.settings_drawer = !$store.state.vue_webrtc
              .settings_drawer
          "
        >
          <v-icon>mdi-cog</v-icon>
        </v-btn>
        <settings-drawer></settings-drawer>
        <v-layout
          flex-center
          align-center
          text-center
          align-items-center
          justify-center
          fill-height
          :class="`call-center-div fullscreen-${fullscreen}`"
        >
          <div
            v-if="
              $store.state.vue_webrtc.callers.user1.userId &&
                $store.state.vue_webrtc.callers.user2.userId
            "
            v-show="
              ($store.state.vue_webrtc.callers.media != 'video' &&
                !$store.state.vue_webrtc.otherShareScreen &&
                !$store.state.vue_webrtc.shareScreen) ||
                !$store.state.vue_webrtc.callers.inCall
            "
          >
            <v-card-text class="text-h5 mb-7">
              <div>
                <v-avatar style="border: 2px solid grey" size="150">
                  <v-img
                    :src="
                      $store.state.vue_webrtc.callers.user2.info.avatar
                        ? $store.state.vue_webrtc.callers.user2.info.avatar
                        : require('@/assets/inapp/user-placeholder.jpg')
                    "
                  ></v-img>
                </v-avatar>
              </div>
              <div class="mt-5 mb-2">
                <div v-if="$store.state.vue_webrtc.callers.inCall">
                  {{
                    $store.state.vue_webrtc.callers.user2.info.degree
                      ? `${$store.state.vue_webrtc.callers.user2.info.degree} / `
                      : ``
                  }}
                  {{ $store.state.vue_webrtc.callers.user2.info.realName }}
                </div>
                <div v-else>
                  {{ isCaller ? "جارِ الإتصال" : "مكالمة من" }}
                  {{
                    $store.state.vue_webrtc.callers.user2.info.degree
                      ? `${isCaller ? "بال" : "ال"}${
                          $store.state.vue_webrtc.callers.user2.info.degree
                        } / `
                      : `${isCaller ? "بـ" : ""}`
                  }}
                  {{ $store.state.vue_webrtc.callers.user2.info.realName }}
                </div>
              </div>
              <div
                v-show="!$store.state.vue_webrtc.callers.inCall"
                class="text-subtitle-1"
              >
                {{
                  isCaller
                    ? "برجاء الإنتظار حتى يتم الرد"
                    : "بإمكانك ضغط الزر الأساسي للرد, أو الأحمر للرفض"
                }}
              </div>
            </v-card-text>
            <div>
              <v-btn
                color="primary"
                x-large
                fab
                @click="acceptCallRequest"
                :disabled="isCaller || $store.state.vue_webrtc.callers.inCall"
              >
                <v-icon>mdi-phone</v-icon>
              </v-btn>
              <span style="width: 140px" class="d-inline-block" dir="ltr">
                {{ modifiedCounter }}
              </span>
              <v-btn color="error" x-large fab outlined @click="endCall()">
                <v-icon>mdi-phone-off</v-icon>
              </v-btn>
            </div>
          </div>
          <!-- v-if="$store.state.vue_webrtc.callers.media == 'audio' || $store.state.vue_webrtc.callers.inCall" -->
          <v-card
            v-show="
              ($store.state.vue_webrtc.callers.media == 'video' ||
                $store.state.vue_webrtc.otherShareScreen ||
                $store.state.vue_webrtc.shareScreen) &&
                $store.state.vue_webrtc.callers.inCall
            "
            raised
            :class="`remote-stream-card fullscreen-${fullscreen}`"
            :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3'"
          >
            <video
              v-show="
                ($store.state.vue_webrtc.callers.media == 'video' ||
                  $store.state.vue_webrtc.otherShareScreen ||
                  $store.state.vue_webrtc.shareScreen) &&
                  $store.state.vue_webrtc.callers.inCall
              "
              playsinline
              muted
              autoplay
              id="remote-stream"
              ref="remote-stream"
            ></video>
          </v-card>
        </v-layout>
        <!-- v-show="$store.state.vue_webrtc.callers.media == 'video'" -->
        <v-card class="all-streams-card pa-0" raised>
          <v-layout
            fill-height
            flex-center
            align-center
            align-content-center
            justify-center
          >
            <vue-webrtc
              v-if="
                $store.state.vue_webrtc.callers.user1.userId &&
                  $store.state.vue_webrtc.callers.user2.userId &&
                  $store.state.vue_webrtc.callers.media &&
                  $store.state.vue_webrtc.callers.media.length > 0
              "
              :roomId="$store.state.vue_webrtc.roomId"
              :socketURL="$store.state.vue_webrtc.socketURL"
              :cameraHeight="$store.state.vue_webrtc.cameraHeight"
              :autoplay="$store.state.vue_webrtc.autoplay"
              :screenshotFormat="$store.state.vue_webrtc.screenshotFormat"
              :enableAudio="$store.state.vue_webrtc.enableAudio"
              :enableVideo="$store.state.vue_webrtc.enableVideo"
              :enableLogs="$store.state.vue_webrtc.enableLogs"
              :stunServer="$store.state.vue_webrtc.stunServer"
              :turnServer="$store.state.vue_webrtc.turnServer"
              ref="webrtc"
            ></vue-webrtc>
          </v-layout>
          <!-- @opened-room=""
            @joined-room=""
            @left-room=""
            @share-started=""
            @share-stopped="" -->
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import io from "socket.io-client";
window.io = io;
export default {
  name: "webrtc-call",
  components: {
    VueWebrtc: () => import("@/components/items/webrtc.vue"),
    SettingsDrawer: () => import("@/components/global/webrtc/settings.vue")
  },
  mounted() {},
  data: () => ({
    fullscreen: false
  }),
  computed: {
    isCaller() {
      let isCaller =
        this.$store.state.vue_webrtc._callers.caller ==
        this.$store.state.sockets.myId;
      return isCaller;
    },
    modifiedCounter() {
      let counter = this.$store.state.vue_webrtc.counter,
        measuredTime = new Date(null);
      measuredTime.setSeconds(counter);
      let MHSTime = measuredTime.toISOString().substr(11, 8),
        MHSTime_with_spaces = MHSTime.replace(/:/g, " : ");
      return `${MHSTime_with_spaces}`;
    },
    roomId: {
      get() {
        return this.$store.state.vue_webrtc.roomId;
      },
      set(v) {
        return v;
      }
    },
    expanded_stream: {
      get() {
        return this.$store.state.vue_webrtc.expanded_stream;
      },
      set(v) {
        return v;
      }
    }
  },
  watch: {
    expanded_stream(v) {
      console.log("expanded_stream Changed: " + v);
      if (v && v.length > 0) {
        this.expandVideo(v);
      }
    },
    roomId(v) {
      console.log("roomId Changed: " + v);
      if (
        v &&
        v.length > 0 &&
        v !== "default_roomId" &&
        v !== undefined &&
        v !== "undefined"
      ) {
        this.$nextTick(() => {
          let intVal = setInterval(() => {
            this.$nextTick(() => {
              this.runWebrtc();
            });
            clearInterval(intVal);
          }, 2000);
        });
      }
    }
  },
  methods: {
    runWebrtc() {
      this.$refs.webrtc.join();
    },
    stopWebrtc() {
      this.$refs.webrtc.leave();
    },
    acceptCallRequest() {
      this.$set(
        this.$store.state.vue_webrtc,
        "roomId",
        this.$store.state.vue_webrtc.roomId_request
      );
      this.$socket.client.emit("vue_webrtc_request_accepted", {
        socketId: this.$store.state.vue_webrtc._callers.caller
      });
      this.$set(this.$store.state.vue_webrtc.callers, "inCall", true);
      this.callTimeCounter();
    },
    callTimeCounter() {
      this.$set(this.$store.state.vue_webrtc, "counter", 0);
      if (this.$store.state.vue_webrtc.timeCounter) {
        clearInterval(this.$store.state.vue_webrtc.timeCounter);
      }
      this.$nextTick(() => {
        this.$store.state.vue_webrtc.timeCounter = setInterval(() => {
          this.$store.state.vue_webrtc.counter++;
        }, 1000);
      });
    },
    endCall(noRepeat = false) {
      if (!noRepeat) {
        this.$socket.client.emit(
          "endCall",
          this.$store.state.vue_webrtc.callers
        );
      }
      this.stopWebrtc();
      this.$set(this.$store.state.vue_webrtc, "roomId", "default_roomId");
      this.$set(this.$store.state.vue_webrtc, "roomId_request", "");
      this.$set(this.$store.state.vue_webrtc, "expanded_stream", null);
      this.$set(this.$store.state.vue_webrtc, "settings_drawer", null);
      this.$set(this.$store.state.vue_webrtc.callers, "user1", {});
      this.$set(this.$store.state.vue_webrtc.callers, "user2", {});
      this.$set(this.$store.state.vue_webrtc.callers, "model", false);
      this.$set(this.$store.state.vue_webrtc.callers, "inCall", false);
      this.$set(this.$store.state.vue_webrtc.callers, "media", "");
      this.$set(this.$store.state.vue_webrtc.callers, "constraints", {});
      this.$set(this.$store.state.vue_webrtc._callers, "caller", "");
      this.$set(this.$store.state.vue_webrtc._callers, "callee", "");
      if (this.$store.state.vue_webrtc.timeCounter) {
        clearInterval(this.$store.state.vue_webrtc.timeCounter);
      }
      this.$set(this.$store.state.vue_webrtc, "timeCounter", null);
      this.$set(this.$store.state.vue_webrtc, "counter", 0);
    }
  },
  sockets: {
    vue_webrtc_request_accepted() {
      // Caller
      this.$set(this.$store.state.vue_webrtc.callers, "inCall", true);
      this.callTimeCounter();
      if (this.$store.state.vue_webrtc.shareScreen) {
        this.$refs.webrtc.shareScreen();
      }
    },
    endCall(x) {
      this.endCall(true);
    },
    calleeBusy(x) {
      // The other guy is in call
      this.endCall(true);
      this.showError("لا يمكنك الإتصال به في الوقت الحالي, لديه مكالمة.");
    }
  }
};
</script>
