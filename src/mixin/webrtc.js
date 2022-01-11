import Vue from "vue";
Vue.mixin({
  methods: {
    expandVideo(id) {
      let leftVideo = document.getElementById(id),
        rightVideo = document.getElementById("remote-stream"),
        stream,
        fps = 0;
      rightVideo.srcObject = null;
      if (leftVideo.captureStream) {
        stream = leftVideo.captureStream(fps);
      } else if (leftVideo.mozCaptureStream) {
        stream = leftVideo.mozCaptureStream(fps);
      } else {
        this.showError("حدث خطأ أثناء فتح الفيديو في المساحة الكبيرة.");
        stream = null;
      }
      rightVideo.srcObject = stream;
    },
    getMyStream() {
      let id = this.$store.state.vue_webrtc.myStreamId,
        leftVideo = document.getElementById(id),
        stream,
        fps = 0;
      if (leftVideo.captureStream) {
        stream = leftVideo.captureStream(fps);
      } else if (leftVideo.mozCaptureStream) {
        stream = leftVideo.mozCaptureStream(fps);
      } else {
        stream = null;
      }
      console.log(id);
      console.log(stream);
      return stream;
    },
    beginRecording() {
      // Record every call
      let options = { mimeType: "video/webm;codecs=vp9,opus" },
        stream,
        id = this.$store.state.vue_webrtc.myStreamId,
        leftVideo = document.getElementById(id),
        fps = 0;
      if (leftVideo.captureStream) {
        stream = leftVideo.captureStream(fps);
      } else if (leftVideo.mozCaptureStream) {
        stream = leftVideo.mozCaptureStream(fps);
      } else {
        stream = null;
      }
      console.log(stream);
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: "video/webm;codecs=vp8,opus" };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: "video/webm" };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = { mimeType: "" };
          }
        }
      }
      this.$set(this.$store.state.vue_webrtc, "records", []);
      try {
        this.$store.state.vue_webrtc.mediaRecorder = new MediaRecorder(
          stream,
          options
        );
      } catch (e) {
        console.log("Exception while creating MediaRecorder:");
        console.log(e);
        return;
      }
      this.$store.state.vue_webrtc.mediaRecorder.onstop = event => {};
      this.$store.state.vue_webrtc.mediaRecorder.ondataavailable = this.handleDataAvailable;
      this.$store.state.vue_webrtc.mediaRecorder.start();
    },
    handleDataAvailable(event) {
      console.log("Found data...");
      if (event.data && event.data.size > 0) {
        this.$store.state.vue_webrtc.records.push(event.data);
        console.log("Data size is good");
      }
    },
    endRecording() {
      this.$store.state.vue_webrtc.mediaRecorder.stop();
      let data = this.$store.state.vue_webrtc.records,
        blobData = new Blob(data, {
          type: "video/webm"
        }),
        objectData = window.URL.createObjectURL(blobData);
      this.$socket.client.emit("saveBuffer", {
        dir: "records/video",
        data,
        blobData,
        objectData
      });
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = objectData;
      a.download = "test.webm";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(objectData);
      }, 100);
    }
  }
});
