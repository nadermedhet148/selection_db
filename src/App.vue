<template>
  <div>
    <websites-layout
      v-if="
        $route.fullPath.includes('/websites') && $store.state.isWebwinOpened
      "
    ></websites-layout>
    <main-layout v-else></main-layout>
    <v-overlay :value="updating" opacity="0.9">
      <v-progress-circular
        :rotate="360"
        :size="300"
        :value="loading"
        color="primary"
      >
        <h1>{{ loading / 20 }}</h1>
      </v-progress-circular>

      <h1 style="text-align:center;margin-top:20px">يتم الان تحديث المنظومة</h1>
      <p style="text-align:center;margin-top:20px">برجاء الانتظار</p>
    </v-overlay>
  </div>
</template>

<script>
let { ipcRenderer } = window.require("electron");

export default {
  name: "App",
  components: {
    MainLayout: () => import("@/layouts/main.vue")
  },
  async mounted() {
    await this.getAppConfig();
    this.forceUpdate();
    //  this.fixUnits(); //only use it to set unitid from webunit
  },
  data: () => ({
    updating: false,
    loading: 100
  }),
  methods: {
    async fixUnits() {
      let webUnits = await this.api("global/get_all", {
        table: "webUnits",
        include: [
          {
            model: "units",
            required: true
          }
        ]
      });
      let Cons = await this.api("global/get_all", {
        table: "conscriptes",
        where: {
          degreeId: {
            $in: [2, 3, 5, null]
          },
          $or: [
            {
              militaryId: { $like: "______52%" }
            },
            { militaryId: { $like: "______66%" } },
            { militaryId: { $like: "______04%" } },
            { militaryId: { $like: "______77%" } },
            { militaryId: { $like: "______88%" } },
            { militaryId: { $like: "______18%" } }
          ],
          unitId: {
            $eq: null
          },
          webUnitId: {
            $ne: null
          }
        }
      });
      if (Cons.data && Cons.data.length) {
        for (const iterator of Cons.data) {
          let logger = await this.api("global/update_one", {
            table: "conscriptes",
            where: {
              militaryId: iterator.militaryId
            },
            update: {
              unitId: webUnits.data.find(wu => wu.id == iterator.webUnitId)
                ? webUnits.data.find(wu => wu.id == iterator.webUnitId).unitId
                : null
            }
          });
          console.log(logger);
        }
      }
      console.log("cons", Cons);
      console.log("WU", webUnits);
    },
    async getAppConfig() {
      let appConfigs = await this.api("global/get_all", {
        table: "appConfig"
      });
      if (appConfigs.data && appConfigs.data.length > 0) {
        appConfigs.data.forEach(el => {
          this.$store.state.appConfig[el.property] = el.value;
        });
      }
    },
    async forceUpdate() {
      if (this.$store.state.appConfig.version > this.$store.state.app_version) {
        this.updating = true;
        let maxTime = 5000;
        let currentTime = 0;
        let interv = setInterval(() => {
          if (currentTime == maxTime) {
            clearInterval(interv);
          } else {
            this.loading -= 20;
            currentTime += 1000;
          }
        }, 1000);
        setTimeout(() => {
          this.openExternal(this.$store.state.app_path);
          ipcRenderer.send("force-close");
        }, maxTime);
      }
      if (this.$store.state.appConfig.version < this.$store.state.app_version) {
        //db version < app current version
        await this.api("global/update_one", {
          table: "appConfig",
          where: {
            property: "version"
          },
          update: {
            value: this.$store.state.app_version
          }
        });
      }
    }
  }
};
</script>
