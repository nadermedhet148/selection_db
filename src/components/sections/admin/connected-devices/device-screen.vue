<template>
  <div>
    <v-dialog v-model="model" scrollable fullscreen persistent>
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="(model = false), leave()" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout
            align-center
            align-content-center
            justify-center
            fill-height
            v-if="loading"
          >
            <v-progress-circular color="primary" indeterminate size="300">
              <div>
                جارِ الإتصال بالجهاز
              </div>
            </v-progress-circular>
          </v-layout>
          <div v-else>
            <template v-for="(item, i) in videoList">
              <video
                :key="i"
                v-if="item.type == 'remote'"
                autoplay
                playsinline
                ref="videos"
                :muted="item.muted"
                :id="item.id"
              ></video>
            </template>
          </div>
        </v-card-text>
        <v-card-actions></v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
video {
  // height: calc(100% - 10px);
  // width: 100%;
  height: 100px;
  width: 100px;
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
    rtcmConnection: null,
    videoList: [],
    roomId: ""
  }),
  mounted() {
    this.init();
  },
  methods: {
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
      this.rtcmConnection.onstream = function(stream) {
        let found = that.videoList.find(video => {
          return video.id == stream.streamid;
        });
        if (found === undefined) {
          let video = {
            id: stream.streamid,
            muted: stream.type === "local",
            type: stream.type
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
      }
      this.$emit("sharing-stopped", this.roomId);
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
