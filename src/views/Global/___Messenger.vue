<template>
  <div>
    <v-card>
      <v-card-title>الخيارات</v-card-title>
      <v-divider></v-divider>
      <v-card-actions class="px-4">
        <span class="pe-4">التحكم: </span>
        <v-autocomplete
          label="مدخل الصوت"
          :items="enumerateDevices.audioinputs"
          item-text="label"
          return-object
          v-model="enumerateDevices.audioinput"
          style="max-width: 200px"
        ></v-autocomplete>
        <v-autocomplete
          label="مخرج الصوت"
          :items="enumerateDevices.audiooutputs"
          item-text="label"
          return-object
          v-model="enumerateDevices.audiooutput"
          style="max-width: 200px"
        ></v-autocomplete>
        <v-autocomplete
          label="مدخل الصورة"
          :items="enumerateDevices.videoinputs"
          item-text="label"
          return-object
          v-model="enumerateDevices.videoinput"
          style="max-width: 200px"
        ></v-autocomplete>
        <v-btn @click="getMedia" outlined color="primary" class="ms-4">
          فتح المداخل
        </v-btn>
        <v-btn @click="shareScreen" outlined color="primary">
          مشاركة الشاشة
        </v-btn>
      </v-card-actions>
      <v-card-actions class="px-4">
        <span class="pe-4">الأجهزة المتصلة: </span>
        <div v-if="connected.length == 0">
          <i class="grey--text">لا يوجد...</i>
        </div>
        <div v-else>
          <template v-for="(con, i) in connected">
            <v-btn :key="i" @click="callUser(con)" text v-text="con"></v-btn>
          </template>
        </div>
      </v-card-actions>
    </v-card>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>أنت</v-card-title>
          <v-card-text>
            <video
              download
              playsinline
              controls
              autoplay
              muted
              ref="local-video"
            ></video>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>الشخص الآخر</v-card-title>
          <v-card-text>
            <video
              download
              playsinline
              autoplay
              controls
              id="remote-video"
              ref="remote-video"
            ></video>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-dialog v-model=""></v-dialog> -->
  </div>
</template>

<script>
export default {
  name: "profile",
  mounted() {
    this.getSockets();
    this.init();
    this.createRTC();
    this.$nextTick(() => {
      let intVal = setInterval(() => {
        this.$nextTick(() => {
          this.createRTC();
        });
        clearInterval(intVal);
      }, 2000);
    });
  },
  data: () => ({
    connected: [],
    myId: "",
    RTCPeerConnection: null,
    RTCSessionDescription: null,
    peerConnection: null,
    isCalling: false,
    localStream: null,
    remoteStream: null,
    enumerateDevices: {
      all: [],
      audioinputs: [],
      audiooutputs: [],
      videoinputs: [],
      // Selected Devices
      audioinput: null,
      audiooutput: null,
      videoinput: null
    },
    time: 0,
    // Screen Sharing
    good: ""
  }),
  methods: {
    createRTC() {
      // this.getMedia();
      console.warn("Creating WebRTC Connection");
      if (this.peerConnection) {
        this.peerConnection.close();
      }
      this.$set(this, "peerConnection", null);
      const { RTCPeerConnection, RTCSessionDescription } = window;
      this.$set(this, "RTCPeerConnection", RTCPeerConnection);
      this.$set(this, "RTCSessionDescription", RTCSessionDescription);
      let servers = {
        local: "127.0.0.1",
        remote: "192.9.201.77",
        home: "192.168.1.7"
      };
      this.$set(
        this,
        "peerConnection",
        new RTCPeerConnection({
          iceServers: [
            {
              urls: [`stun:${servers.local}:3478`, `stun:${servers.local}:3479`]
            }
          ],
          iceCandidatePoolSize: 10
        })
      );
      if (this.time > 0) {
        this.peerConnection.addEventListener("signalingstatechange", x => {
          console.warn("signalingstatechange");
          console.log(x);
        });
        this.peerConnection.addEventListener("iceconnectionstatechange", x => {
          console.warn("iceconnectionstatechange");
          console.log(x);
        });
        this.peerConnection.addEventListener("connectionstatechange", x => {
          console.warn("connectionstatechange");
          console.log(x);
        });
        this.peerConnection.addEventListener("icecandidate", x => {
          console.warn("icecandidate");
          console.log(x);
        });
        this.peerConnection.addEventListener(
          "track",
          ({ streams: [stream] }) => {
            // this.remoteStream.addTrack(event.track, this.remoteStream);
            console.log("Remote Stream...");
            console.log(stream);
            // console.warn("Remote Stream [From Function]...");
            // console.log(stream);
            // console.warn("Remote Stream [From Data]...");
            // console.log(stream);
            const remoteVideo = document.getElementById("remote-video");
            if (remoteVideo) {
              remoteVideo.srcObject = stream;
            }
            // stream.getTracks().forEach(track => {
            //   this.peerConnection.addTrack(track, stream);
            // });
          }
        );
      }
      this.time++;
    },
    async init() {
      let cons = await navigator.mediaDevices.enumerateDevices();
      console.log(navigator.mediaDevices);
      this.$set(this.enumerateDevices, "all", cons);
      this.$set(
        this.enumerateDevices,
        "audioinputs",
        this.arr_obj_unique(
          cons.filter(c => c.kind == "audioinput"),
          "groupId"
        )
      );
      this.$set(
        this.enumerateDevices,
        "audiooutputs",
        this.arr_obj_unique(
          cons.filter(c => c.kind == "audiooutput"),
          "groupId"
        )
      );
      this.$set(
        this.enumerateDevices,
        "videoinputs",
        this.arr_obj_unique(
          cons.filter(c => c.kind == "videoinput"),
          "groupId"
        )
      );
      console.log(cons);
    },
    // Begin Screen Sharing Methods
    getScreenStream() {
      if (navigator.getDisplayMedia) {
        return navigator.getDisplayMedia({ video: true });
      } else if (navigator.mediaDevices.getDisplayMedia) {
        return navigator.mediaDevices.getDisplayMedia({ video: true });
      } else {
        return navigator.mediaDevices.getUserMedia({
          video: { mediaSource: "screen" }
        });
      }
    },
    stopScreenStream(e) {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;

      this.recording = window.URL.createObjectURL(
        new Blob(this.chunks, { type: "video/webm" })
      );
    },
    async shareScreen() {
      /**
       ** 1
       ** Get Media
       */
      let stream = await this.getScreenStream();
      stream.addEventListener("inactive", e => {
        console.log("Capture stream inactive - stop recording!");
        this.stopScreenStream(e);
      });
    },
    // ../End Screen Sharing Methods
    callUser(id) {
      // Caller
      console.warn("Connecting to user: " + id);
      this.peerConnection
        .createOffer()
        .then(offer => {
          // console.log("Offer Created");
          this.peerConnection
            .setLocalDescription(new this.RTCSessionDescription(offer))
            .then(() => {
              // console.log("Local Description has been set.");
              this.$socket.client.emit("callUser", {
                offer,
                to: id
              });
              // console.warn("User Called");
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getMedia() {
      let { audioinput, audiooutput, videoinput } = this.enumerateDevices;
      navigator.mediaDevices
        .getUserMedia({
          video: videoinput
            ? {
                deviceId: videoinput.deviceId
              }
            : false,
          audio: audioinput
            ? {
                deviceId: audioinput.deviceId
              }
            : false
        })
        .then(stream => {
          const localVideo = this.$refs["local-video"];
          // const remoteVideo = this.$refs["remote-video"];
          if (localVideo) {
            localVideo.srcObject = stream;
          }
          // if (remoteVideo) {
          //   remoteVideo.srcObject = this.remoteStream;
          // }
          stream.getTracks().forEach(track => {
            this.peerConnection.addTrack(track, stream);
          });
          console.log("Local Stream...");
          console.log(stream);
        })
        .catch(error => {
          console.warn(error);
        });
    },
    getSockets() {
      this.$socket.client.emit("getSockets", true);
    }
  },
  sockets: {
    callRequest(x) {
      // Callee
      this.peerConnection
        .setRemoteDescription(new this.RTCSessionDescription(x.offer))
        .then(() => {
          this.peerConnection
            .createAnswer()
            .then(answer => {
              this.peerConnection
                .setLocalDescription(new this.RTCSessionDescription(answer))
                .then(() => {
                  this.$socket.client.emit("callAccepted", {
                    answer,
                    to: x.from
                  });
                })
                .catch(error => {
                  console.log(error);
                });
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
    callCallbackAccepted(x) {
      // console.log("Answer Found");
      // console.log(x);
      this.peerConnection
        .setRemoteDescription(new this.RTCSessionDescription(x.answer))
        .then(() => {
          if (!this.isCalling) {
            this.callUser(x.from);
            this.$set(this, "isCalling", true);
            console.warn("Answer Made.");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    askForConnected() {
      this.getSockets();
    },
    updateConnected(data) {
      // console.log(data);
      let { activeSockets, webrtcActiveSockets } = data;
      this.$set(
        this,
        "connected",
        Object.keys(activeSockets).filter(s => s !== this.myId)
      );
    },
    getMyId(data) {
      // console.log(data);
      this.$set(this, "myId", data);
    }
  }
};
</script>
