import Vue from "vue";
let { ipcRenderer, webFrame } = window.require("electron");
let server = ipcRenderer;

Vue.mixin({
  methods: {
    getRandom(min = 1111111111111, max = 9999999999999) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    /**
     * create the object that will be sent to
     * the backend
     * for mounting a specific network device
     * @param {String} drivePath
     * @param {String} driveLetter
     * @param {String} username
     * @param {String} password
     */
    connectDevice(drivePath, username, password) {
      return this.uploadApi("connect", {
        drivePath,
        username,
        password
      });
    },

    /**
     * create the object that will be sent to
     * the backend
     * for unmounting a specific network device
     * @param {String} driveLetter
     */
    async disconnectDevice(drivePath) {
      return this.uploadApi("disconnect", {
        drivePath
      });
    },

    /**
     * Creating Image
     * by base64 code
     *
     * @param {String} base64
     * @param {String} path
     */
    createImage(base64, path) {
      return this.uploadApi("createImage", {
        base64,
        path
      });
    },
    /**
     * create the object that will be sent to
     * the backend with the file
     * @param {String} file
     * @param {String} newPath
     */
    upload(oldPath, newPath) {
      return this.uploadApi("upload", {
        oldPath,
        newPath
      });
    },
    async getImage(path) {
      let img = "";
      await this.uploadApi("getImage", {
        path
      })
        .then(response => {
          img = response.data;
        })
        .catch(err => {
          if (err.error) {
            this.showError(err.error);
          }
          console.log(err);
          return false;
        });
      return img;
    },
    /**
     * for sending the object of request and api
     * @param {String} request. have three request types =>  [mount, unmount, upload]
     * @param {Object} params
     *
     * @returns {Promise}
     */
    uploadApi(request, params) {
      return new Promise((success, failure) => {
        let req_id = this.getRandom();
        server.send("upload-send-api", [request, params, req_id]);
        return server.on(`upload-reply-api-${req_id}`, (event, response) => {
          if (
            response &&
            response.ok == true // done
          ) {
            success(response);
          }
          failure(response); // failed -_-
        });
      });
    },
    testmixin() {
      console.log("test ya ragel");
    }
  }
});
