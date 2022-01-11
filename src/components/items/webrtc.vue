<template>
  <div class="video-list">
    <v-slide-group
      v-model="$store.state.vue_webrtc.expanded_stream"
      mandatory
      show-arrows
    >
      <template v-for="item in videoList">
        <v-slide-item
          :value="item.id"
          :key="item.id"
          v-slot:default="{ active, toggle }"
        >
          <v-card height="90" width="120" @click="toggle" tile>
            <video
              autoplay
              playsinline
              ref="videos"
              :height="cameraHeight"
              :muted="item.muted"
              :id="item.id"
            ></video>
          </v-card>
        </v-slide-item>
      </template>
    </v-slide-group>
  </div>
</template>

<script>
import RTCMultiConnection from "rtcmulticonnection";
require("adapterjs");
export default {
  name: "vue-webrtc",
  components: {
    RTCMultiConnection
  },
  data: () => ({
    rtcmConnection: null,
    localVideo: null,
    videoList: [],
    canvas: null,
    shareScreenStreamId: "",
    screenSharedByAdmin: false
  }),
  computed: {
    audioInput: {
      get() {
        return this.$store.state.vue_webrtc.mediaDevices.audioinput;
      },
      set(v) {
        return v;
      }
    },
    // audioOutput: {
    //   get() {
    //     return this.$store.state.vue_webrtc.mediaDevices.audiooutput;
    //   },
    //   set(v) {
    //     return v;
    //   }
    // },
    videoInput: {
      get() {
        return this.$store.state.vue_webrtc.mediaDevices.videoinput;
      },
      set(v) {
        return v;
      }
    },
    enable_Audio: {
      get() {
        return this.$store.state.vue_webrtc.enableAudio;
      },
      set(v) {
        return v;
      }
    },
    enable_Video: {
      get() {
        return this.$store.state.vue_webrtc.enableVideo;
      },
      set(v) {
        return v;
      }
    },
    share_Screen: {
      get() {
        return this.$store.state.vue_webrtc.shareScreen;
      },
      set(v) {
        return v;
      }
    }
  },
  watch: {
    enable_Audio(v) {
      if (this.$store.state.vue_webrtc.callers.inCall) {
        this.leave();
        this.$set(this.$store.state.vue_webrtc, "enableAudio_disabled", true);
        this.$nextTick(() => {
          let intVal = setInterval(() => {
            this.$nextTick(() => {
              this.join();
            });
            clearInterval(intVal);
          }, 3000);
        });
      }
    },
    enable_Video(v) {
      if (this.$store.state.vue_webrtc.callers.inCall) {
        this.leave();
        this.$set(this.$store.state.vue_webrtc, "enableVideo_disabled", true);
        this.$nextTick(() => {
          let intVal = setInterval(() => {
            this.$nextTick(() => {
              this.join();
            });
            clearInterval(intVal);
          }, 3000);
        });
      }
    },
    share_Screen(v) {
      if (this.$store.state.vue_webrtc.callers.inCall) {
        this.$set(this.$store.state.vue_webrtc, "shareScreen_disabled", true);
        if (v === true) {
          this.shareScreen();
        } else {
          this.stopShareScreen();
        }
      }
    },
    audioInput(v) {
      if (v && v.length > 0 && this.$store.state.vue_webrtc.callers.inCall) {
        this.leave();
        this.$nextTick(() => {
          let intVal = setInterval(() => {
            this.$nextTick(() => {
              this.join();
            });
            clearInterval(intVal);
          }, 2000);
        });
      }
    },
    videoInput(v) {
      if (v && v.length > 0 && this.$store.state.vue_webrtc.callers.inCall) {
        this.leave();
        this.$nextTick(() => {
          let intVal = setInterval(() => {
            this.$nextTick(() => {
              this.join();
            });
            clearInterval(intVal);
          }, 2000);
        });
      }
    }
    // audioOutput(sinkId) {
    //   if (
    //     sinkId &&
    //     sinkId.length > 0 &&
    //     this.$store.state.vue_webrtc.callers.inCall
    //   ) {
    //     let videoList = this.videoList;
    //     videoList.forEach(element => {
    //       if (typeof element.sinkId !== "undefined") {
    //         element
    //           .setSinkId(sinkId)
    //           .then(() => {
    //             // console.log(`Success, audio output device attached: ${sinkId}`);
    //           })
    //           .catch(error => {
    //             let errorMessage =
    //               "عفواً, غير قادر على تحويل مسار الصوت الى المخرج الذي قمت بتحديده.";
    //             if (error.name === "SecurityError") {
    //               errorMessage = `عفواً, حدثت مشكلة أمنية أثناء الإتصال بمخرج الصوت الذي قمت بتحديده. الرجاء ابلاغ قسم النظم.`;
    //             }
    //             this.showError(errorMessage);
    //           });
    //       } else {
    //         this.showError(
    //           "عفواً, تحتاج لتحديث إصدار الـ Netframework لتحويل مجرى الصوت الى المخرج الذي اخترته."
    //         );
    //       }
    //     });
    //   }
    // }
  },
  props: {
    roomId: {
      type: String,
      default: "public-room"
    },
    socketURL: {
      type: String,
      default: "https://rtcmulticonnection.herokuapp.com:443/"
    },
    cameraHeight: {
      type: [Number, String],
      default: 160
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    screenshotFormat: {
      type: String,
      default: "image/jpeg"
    },
    enableAudio: {
      type: Boolean,
      default: true
    },
    enableVideo: {
      type: Boolean,
      default: true
    },
    enableLogs: {
      type: Boolean,
      default: false
    },
    stunServer: {
      type: String,
      default: null
    },
    turnServer: {
      type: String,
      default: null
    }
  },
  sockets: {
    admin_openUserScreen(adminSocketId) {
      if (this.screenSharedByAdmin) {
        this.$socket.client.emit("admin_openUserScreen_rejected", {
          reason: "شاشة هذا المستخدم مفتوحة بالفعل من قبل أحد الأدمنز.",
          adminSocketId
        });
      } else {
        this.shareScreen(true);
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let that = this;
      this.rtcmConnection = new RTCMultiConnection();
      this.rtcmConnection.socketURL = this.socketURL;
      this.rtcmConnection.autoCreateMediaElement = false;
      this.rtcmConnection.enableLogs = this.enableLogs;
      this.rtcmConnection.session = {
        audio: this.enableAudio,
        video: this.enableVideo
      };
      this.rtcmConnection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: this.enableAudio,
        OfferToReceiveVideo: this.enableVideo
      };
      if (this.stunServer !== null || this.turnServer !== null) {
        this.rtcmConnection.iceServers = []; // clear all defaults
      }
      if (this.stunServer !== null) {
        this.rtcmConnection.iceServers.push({
          urls: this.stunServer
        });
      }
      if (this.turnServer !== null) {
        var parse = this.turnServer.split("%");
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
          return video.id === stream.streamid;
        });
        console.log(stream);
        if (found === undefined) {
          let video = {
            id: stream.streamid,
            muted: stream.type === "local"
          };

          that.videoList.push(video);

          if (stream.type === "local") {
            that.localVideo = video;
            that.$set(that.$store.state.vue_webrtc, "myStreamId", video.id);
            that.$set(that.$store.state.vue_webrtc, "myStream", stream.stream);
          }
        }

        setTimeout(function() {
          for (var i = 0, len = that.$refs.videos.length; i < len; i++) {
            if (that.$refs.videos[i].id === stream.streamid) {
              that.$refs.videos[i].srcObject = stream.stream;
              break;
            }
          }
        }, 1000);

        that.$emit("joined-room", stream.streamid);
        that.requestAllConnectedSockets();
      };
      this.rtcmConnection.onstreamended = function(stream) {
        var newList = [];
        that.videoList.forEach(function(item) {
          if (item.id !== stream.streamid) {
            newList.push(item);
          }
        });
        that.videoList = newList;
        that.$emit("left-room", stream.streamid);
        that.requestAllConnectedSockets();
      };
      // Custom event
      that.rtcmConnection.onUserStatusChanged = function(
        event = {},
        dontWriteLogs = true
      ) {
        that.rtcmConnection.socket.emit("getWebrtcSockets", {
          webrtcUserid: that.rtcmConnection.userid,
          userId: that.$store.state.currentUser.userId
        });
        that.requestAllConnectedSockets();
      };
    },
    // Custom Methods
    // addConnectedSocket(userid, addToTop = false) {
    //   if (!this.$store.state.rtc_sockets.connected.includes(userid)) {
    //     if (addToTop) {
    //       this.$store.state.rtc_sockets.connected.unshift(userid);
    //     } else {
    //       this.$store.state.rtc_sockets.connected.push(userid);
    //     }
    //   }
    // },
    requestAllConnectedSockets(isCreator = false) {
      let myId = this.rtcmConnection.userid;
      // this.$set(
      //   this.$store.state.rtc_sockets,
      //   "connected",
      //   this.rtcmConnection.peers.getAllParticipants()
      // );
      // this.addConnectedSocket(myId, true);
      this.$set(this.$store.state.rtc_sockets, "myId", myId);
      if (isCreator) {
        this.$set(this.$store.state.rtc_sockets, "creatorId", myId);
      }
    },
    stopShareScreen() {
      let shareScreenStreamId = this.shareScreenStreamId,
        that = this;
      if (shareScreenStreamId && shareScreenStreamId.length > 0) {
        this.rtcmConnection.attachStreams.forEach(function(localStream) {
          if (localStream.id == shareScreenStreamId) {
            localStream.stop();
            that.$set(that, "shareScreenStreamId", "");
          }
        });
      }
    },
    // Original Methods
    join() {
      var that = this;
      if (this.rtcmConnection) {
        this.rtcmConnection.mediaConstraints.audio = this.enableAudio
          ? this.audioInput
            ? {
                deviceId: {
                  exact: this.audioInput
                }
              }
            : true
          : false;
        this.rtcmConnection.mediaConstraints.video = this.enableVideo
          ? this.videoInput
            ? {
                deviceId: {
                  exact: this.videoInput
                }
              }
            : true
          : false;
        this.rtcmConnection.session.audio = this.enableAudio;
        this.rtcmConnection.session.video = this.enableVideo;
        this.rtcmConnection.openOrJoin(this.roomId, function(
          isRoomExist,
          roomid
        ) {
          if (
            isRoomExist === false &&
            that.rtcmConnection.isInitiator === true
          ) {
            that.$emit("opened-room", roomid);
            that.requestAllConnectedSockets(true);
          } else {
            that.requestAllConnectedSockets();
          }
          if (that.$store.state.vue_webrtc.shareScreen) {
            that.$nextTick(() => {
              let intVal = setInterval(() => {
                that.$nextTick(() => {
                  that.shareScreen();
                });
                clearInterval(intVal);
              }, 3000);
            });
          }
          // that.$nextTick(() => {
          //   let intVal = setInterval(() => {
          //     that.$nextTick(() => {
          //       that.beginRecording();
          //     });
          //     clearInterval(intVal);
          //   }, 2000);
          // });
        });
      }
    },
    leave() {
      if (this.rtcmConnection) {
        this.rtcmConnection.attachStreams.forEach(function(localStream) {
          localStream.stop();
        });
        this.videoList = [];
        // this.rtcmConnection.close();
        // this.$set(this, "rtcmConnection", null);
        // this.$nextTick(() => {
        //   this.init();
        // });
        // this.rtcmConnection.socket.emit("disconnectMe");
        // this.endRecording();
      }
    },
    capture() {
      return this.getCanvas().toDataURL(this.screenshotFormat);
    },
    getCanvas() {
      let video = this.getCurrentVideo();
      if (video !== null && !this.ctx) {
        let canvas = document.createElement("canvas");
        canvas.height = video.clientHeight;
        canvas.width = video.clientWidth;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
      }
      const { ctx, canvas } = this;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas;
    },
    getCurrentVideo() {
      if (this.localVideo === null) {
        return null;
      }
      for (var i = 0, len = this.$refs.videos.length; i < len; i++) {
        if (this.$refs.videos[i].id === this.localVideo.id)
          return this.$refs.videos[i];
      }
      return null;
    },
    shareScreen(byAdmin = false) {
      let that = this,
        isSharedByAdmin = byAdmin,
        streamEndedEvent = "ended",
        addStreamStopListener = function(stream, callback) {
          streamEndedEvent = "ended";
          if ("oninactive" in stream) {
            streamEndedEvent = "inactive";
          }
          stream.addEventListener(
            streamEndedEvent,
            function() {
              callback();
              callback = function() {};
            },
            false
          );
        },
        onGettingSteam = function(stream) {
          that.rtcmConnection.addStream(stream);
          that.$set(that, "shareScreenStreamId", stream.id);
          that.$set(
            that.$store.state.vue_webrtc,
            "shareScreen_disabled",
            false
          );
          if (isSharedByAdmin) {
            that.$set(that, "screenSharedByAdmin", true);
          }
          that.$emit("share-started", stream.streamid);

          addStreamStopListener(stream, function() {
            console.log("Stream Stopped");
            if (isSharedByAdmin) {
              that.$set(that, "screenSharedByAdmin", false);
            }
            that.rtcmConnection.removeStream(stream.streamid);
            that.$emit("share-stopped", stream.streamid);
          });
        },
        getDisplayMediaError = function(error) {
          console.log(error);
          console.log("Media error: " + JSON.stringify(error));
        };
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720
            }
          }
        })
        .then(stream => {
          onGettingSteam(stream);
        }, getDisplayMediaError)
        .catch(getDisplayMediaError);
    }
  }
};
</script>
