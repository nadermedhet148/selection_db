<template>
  <div>
    <div v-if="loading">
      <v-progress-linear indeterminate height="10"></v-progress-linear>
    </div>
    <div v-else>
      <div v-if="restarting" class="text-center">
        <v-progress-circular
          size="250"
          color="primary"
          :value="Math.floor((restartCounter * 100) / restartMaxCounter)"
        >
          <div class="text-h3">
            {{ restartMaxCounter - restartCounter }}
          </div>
        </v-progress-circular>
      </div>
      <div v-else>
        <v-row>
          <template v-for="(item, i) in videoList">
            <v-col v-if="item.type == 'remote'" cols="6" lg="4" :key="i">
              <v-card>
                <v-card-title class="break-word text-center">
                  <span v-if="item.device">
                    {{ item.device.name }}
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn
                    icon
                    @click="openMsgDialoge(item.streamId, item.device)"
                  >
                    <v-icon>mdi-message</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="item.device"
                    icon
                    @click="openDeviceConfig(item.device)"
                  >
                    <v-icon>mdi-cog</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-subtitle class="mt-1" v-if="item.extra">
                  <template v-for="(ip, ii) in item.extra.ips">
                    <v-chip :key="ii">
                      {{ ip }}
                    </v-chip>
                  </template>
                </v-card-subtitle>
                <v-card-text class="px-0">
                  <v-card tile flat @click="openFullscreen(item)">
                    <video
                      autoplay
                      playsinline
                      ref="videos"
                      muted
                      :id="item.id"
                    ></video>
                  </v-card>
                  <div class="mt-1 px-4" v-if="item.extra && item.extra.uptime">
                    <v-icon class="me-2">mdi-clock-outline</v-icon>
                    مفتوح
                    {{ new Date(item.extra.uptime) | moment("from", "now") }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </div>
    </div>
    <div v-if="fullscreenVideo.model">
      <v-dialog
        v-model="fullscreenVideo.model"
        fullscreen
        persistent
        scrollable
      >
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-btn @click="fullscreenVideo.model = false" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <video autoplay playsinline id="fullscreen-video"></video>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <v-dialog v-model="deviceConfig.model" max-width="450" scrollable>
      <v-card :loading="deviceConfig.loading" :disabled="deviceConfig.loading">
        <v-card-title>
          تعديل بيانات الجهاز
          <v-spacer></v-spacer>
          <v-btn icon @click="deviceConfig.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-text-field
            @keypress.enter="updateDeviceConfig()"
            filled
            label="اسم الجهاز"
            hide-details
            v-model="deviceConfig.item.name"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            large
            outlined
            color="primary"
            class="px-6"
            v-text="'رجوع'"
            @click="deviceConfig.model = false"
          ></v-btn>
          <v-btn
            large
            color="primary"
            class="px-6"
            v-text="'حفظ الجهاز'"
            @click="updateDeviceConfig()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="msgDialoge.model" max-width="700" scrollable>
      <v-card :loading="msgDialoge.loading" :disabled="msgDialoge.loading">
        <v-card-title>
          ارسال رسالة الى : {{ msgDialoge.deviceName }}
          <v-spacer></v-spacer>
          <v-btn icon @click="msgDialoge.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-text-field
            label="العنوان"
            hint="في حال ترك العنوان فارغ, سيتم كتابة 'تنبيه'"
            persistent-hint
            filled
            v-model="msgDialoge.item.msg.title"
          ></v-text-field>
          <v-textarea
            label="نص الرسالة"
            hint="اضغط Enter لإضافة سطر جديد"
            persistent-hint
            filled
            rows="1"
            auto-grow
            v-model="msgDialoge.item.msg.msg"
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            large
            outlined
            color="primary"
            class="px-6"
            v-text="'رجوع'"
            @click="msgDialoge.model = false"
          ></v-btn>
          <v-btn
            large
            color="primary"
            class="px-6"
            v-text="'ارسال'"
            @click="sendMsg()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
video {
  // height: calc(100% - 10px);
  // width: 100%;
  height: 100%;
  width: 100%;
}
</style>

<script>
import io from "socket.io-client";
window.io = io;
import RTCMultiConnection from "rtcmulticonnection";
require("adapterjs");
export default {
  name: "DeviceScreen",
  components: {},
  data: () => ({
    model: false,
    loading: true,
    restarting: false,
    restartCounter: 0,
    restartMaxCounter: 15,
    rtcmConnection: null,
    videoList: [],
    roomId: "admin-eye-screen-sharing",
    fullscreenVideo: {
      model: false
    },
    deviceConfig: {
      item: {},
      model: false,
      loading: false
    },
    msgDialoge: {
      item: {
        id: "",
        deviceName: "",
        msg: { title: "", msg: "", type: "info" }
      },
      model: false,
      loading: false
    }
  }),
  mounted() {
    this.init();
    this.$nextTick(() => {
      let intVal = setInterval(() => {
        this.join();
        clearInterval(intVal);
      }, 3000);
    });
  },
  methods: {
    restart() {
      this.$set(this, "restartCounter", 0);
      this.$set(this, "restarting", true);
      this.leave();
      this.$nextTick(() => {
        let intVal = setInterval(() => {
          this.$set(this, "restartCounter", this.restartCounter + 1);
          if (this.restartCounter == this.restartMaxCounter) {
            this.join();
            clearInterval(intVal);
          }
        }, 1000);
      });
    },
    openDeviceConfig(device) {
      // console.log(device);
      this.$set(this.deviceConfig, "model", true);
      this.$set(this.deviceConfig, "item", { ...device });
    },
    openMsgDialoge(id, device) {
      this.$set(this.msgDialoge, "model", true);
      this.$set(this.msgDialoge.item, "id", id);
      this.$set(this.msgDialoge.item, "deviceName", device ? device.name : "");
    },
    updateDeviceConfig() {
      let device = { ...this.deviceConfig.item };
      this.$set(this.deviceConfig, "loading", true);
      this.api(`global/update_one`, {
        table: "devices",
        where: {
          id: device.id
        },
        update: {
          name: device.name
        }
      })
        .then(x => {
          let index = this.videoList.findIndex(
            v => v.device && v.device.id && v.device.id == device.id
          );
          this.$set(this.videoList[index].device, "name", device.name);
          this.$set(this.deviceConfig, "model", false);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$set(this.deviceConfig, "loading", false);
        });
    },
    sendMsg() {
      this.$set(this.msgDialoge, "loading", true);
      let stream = this.msgDialoge.item;
      console.log(stream);
      this.$socket.client.emit("showMsgFromAdmin", stream);
      this.$set(this.msgDialoge, "loading", false);
      this.$set(this.msgDialoge.item, "msg", {
        title: "",
        msg: "",
        type: "info"
      });
      this.$set(this.msgDialoge, "model", false);
    },
    openFullscreen(item) {
      this.$set(this.fullscreenVideo, "model", true);
      this.$nextTick(() => {
        let intVal = setInterval(() => {
          let distination = document.getElementById("fullscreen-video"),
            source = document.getElementById(item.id);
          distination.srcObject = source.srcObject;
          clearInterval(intVal);
        }, 500);
      });
    },
    async init() {
      let that = this,
        webrtc = this.$store.state.vue_webrtc,
        {
          data: { width, height }
        } = await this.api("server/screen-size", {
          noAsync: true
        });
      this.rtcmConnection = new RTCMultiConnection();
      this.rtcmConnection.screenHeight = Number(height);
      this.rtcmConnection.screenWidth = Number(width);
      this.rtcmConnection.socketMessageEvent = "admin-eye-screen-sharing";
      this.rtcmConnection.socketURL = webrtc.socketURL;
      this.rtcmConnection.autoCreateMediaElement = false;
      this.rtcmConnection.enableLogs = webrtc.enableLogs;
      this.rtcmConnection.session = {
        screen: true,
        oneway: true
      };
      this.rtcmConnection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
      };
      if (webrtc.stunServer !== null || webrtc.turnServer !== null) {
        this.rtcmConnection.iceServers = [];
      }
      if (webrtc.stunServer !== null) {
        this.rtcmConnection.iceServers.push({
          urls: webrtc.stunServer
        });
      }
      if (webrtc.turnServer !== null) {
        var parse = webrtc.turnServer.split("%");
        var username = parse[0].split("@")[0];
        var password = parse[0].split("@")[1];
        var turn = parse[1];
        this.rtcmConnection.iceServers.push({
          urls: turn,
          credential: password,
          username: username
        });
      }
      this.rtcmConnection.onstream = async function(stream) {
        console.log(stream);
        let found = that.videoList.find(video => {
          return video.id == stream.streamid;
        });
        if (found === undefined) {
          let extra = stream.extra;
          if (extra) {
            extra.ips = [];
            Object.keys(extra).forEach(key => {
              if (key.includes("ip_")) {
                extra.ips.push(extra[key]);
              }
            });
          }
          let deviceDetails = extra.mac
            ? await that.api("global/get_or_create", {
                table: "devices",
                where: {
                  mac: extra.mac
                }
              })
            : { data: [null] };
          let video = {
            id: stream.streamid,
            streamId: stream.extra.socketId,
            muted: stream.type === "local",
            type: stream.type,
            extra,
            device: deviceDetails.data[0]
          };
          that.videoList.push(video);
        }
        setTimeout(function() {
          if (that.$refs.videos) {
            for (var i = 0, len = that.$refs.videos.length; i < len; i++) {
              if (that.$refs.videos[i].id === stream.streamid) {
                that.$refs.videos[i].srcObject = stream.stream;
                break;
              }
            }
          }
        }, 1000);
      };
      this.rtcmConnection.onstreamended = function(stream) {
        var newList = [];
        that.videoList.forEach(function(item) {
          if (item.id !== stream.streamid) {
            newList.push(item);
          }
        });
        that.videoList = newList;
      };
    },
    join() {
      var that = this;
      if (this.rtcmConnection) {
        this.rtcmConnection.mediaConstraints.audio = false;
        this.rtcmConnection.mediaConstraints.video = false;
        this.rtcmConnection.session.audio = false;
        this.rtcmConnection.session.video = false;
        this.rtcmConnection.openOrJoin(
          this.roomId,
          function(isRoomExist, roomid) {
            that.$set(that, "restarting", false);
            that.$set(that, "loading", false);
          },
          function(error) {
            console.log(error);
          }
        );
      }
    },
    leave() {
      if (this.rtcmConnection) {
        this.rtcmConnection.attachStreams.forEach(function(localStream) {
          localStream.stop();
        });
        this.videoList = [];
        // this.rtcmConnection.leave();
      }
      // this.$emit("sharing-stopped", this.roomId);
    },
    loadScreen() {
      this.$set(this, "model", true);
      this.$socket.client.emit("forceShareScreen", this.roomId);
    }
  },
  sockets: {
    forceShareScreenAccepted() {
      this.join();
    }
  }
};
</script>
