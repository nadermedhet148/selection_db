<template>
  <div>
    <v-dialog v-model="dialog" persistent width="300">
      <v-card color="primary" dark v-for="(val, key, i) in files" :key="i">
        <v-btn class="justify-center" @click="terminate" icon>X</v-btn>
        <v-card-text>
          جاري التحميل...
          <v-progress-linear
            :value="val.perc"
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- <v-app-bar bottom v-model="model" fixed>
      <v-btn icon @click="terminate()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-chip-group dir="ltr">
        <template v-for="(val, key, i) in files">
          <v-chip
            style="height: 56px; border-radius: 0px;"
            :key="i"
            @click="
              val.perc >= 100
                ? openExternal(val.path)
                : showSnackbar('لم ينته التحميل بعد')
            "
          >
            <div>
              {{ key }}
              <v-progress-linear
                v-if="val.perc < 100"
                height="6"
                :value="val.perc"
              ></v-progress-linear>
            </div>
          </v-chip>
        </template>
      </v-chip-group>
    </v-app-bar> -->
  </div>
</template>

<script>
let { ipcRenderer } = window.require("electron");
export default {
  name: "DownloadManager",
  mounted() {
    this.listener();
  },
  data: () => ({
    files: {},
    model: false,
    dialog: false
  }),
  methods: {
    listener() {
      let that = this;

      ipcRenderer.on("download-start", () => {
        that.$set(that, "dialog", true);
      });

      ipcRenderer.on("download-progress", (event, x) => {
        if (x.state === "interrupted") {
          this.$set(this, "dialog", false);
          this.showError("خطآ اثثناء التحميل");
          console.log("interrupted____");
        }

        that.$set(that.files, x.filename, {
          perc: x.perc,
          path: x.path,
          state: x.state
        });

        if (x.perc == 100) {
          console.log("done");
          this.$set(this, "dialog", false);
          this.$set(this, "files", {});
          console.log("files");
          console.log(this.files);
        }
      });
    },
    terminate() {
      ipcRenderer.send("download-exit", { exit: true });
      this.$set(this, "dialog", false);
      this.$set(this, "files", {});
    }
  }
};
</script>
