<template>
  <div>
    <v-card id="webview-card" style="height: 100vh">
      <v-app-bar flat style="-webkit-app-region: drag">
        <div style="width: calc(100vw - 200px)">
          <v-card-actions>
            <v-chip-group mandatory center-active v-model="currentTab">
              <template v-for="(tab, i) in tabs">
                <div v-show="!tab.isHidden" style="position: relative" :key="i">
                  <v-chip
                    :value="i"
                    close-label="إغلاق التبويب"
                    outlined
                    style="-webkit-app-region: no-drag; width: 200px; height: 56px; border-radius: 0px"
                  >
                    <div
                      style="width: 155px; overflow: hidden; text-overflow: ellipsis;"
                    >
                      {{ tab.title }}
                      <v-progress-linear
                        v-if="tab.loading"
                        color="primary"
                        indeterminate
                      ></v-progress-linear>
                    </div>
                  </v-chip>
                  <v-btn
                    style="-webkit-app-region: no-drag; position: absolute; top: 50%; left: 5px; transform: translate(0%, -50%);"
                    icon
                    small
                    @click="hideTab(i)"
                  >
                    <v-icon small>mdi-close</v-icon>
                  </v-btn>
                </div>
              </template>
              <v-btn
                @click="addTab()"
                style="-webkit-app-region: no-drag"
                icon
                class="mt-3"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-chip-group>
          </v-card-actions>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          label="zoomIn"
          style="-webkit-app-region: no-drag"
          @click="zoomIn()"
        >
          <v-icon>
            mdi-magnify-close
          </v-icon>
        </v-btn>
        <v-btn
          icon
          label="zoomOut"
          style="-webkit-app-region: no-drag"
          @click="zoomOut()"
        >
          <v-icon>mdi-magnify-minus</v-icon>
        </v-btn>

        <v-btn
          style="-webkit-app-region: no-drag"
          @click="goWebsiteForward()"
          icon
        >
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn
          style="-webkit-app-region: no-drag"
          @click="goWebsiteBackward()"
          icon
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-divider class="mx-2" vertical></v-divider>
        <v-btn
          style="-webkit-app-region: no-drag"
          v-if="isAdmin()"
          @click="copyUrl()"
          icon
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
        <v-divider class="mx-2" vertical></v-divider>
        <v-btn
          style="-webkit-app-region: no-drag"
          @click="windowAction('minimize')"
          icon
        >
          <v-icon>mdi-window-minimize</v-icon>
        </v-btn>
        <v-btn
          style="-webkit-app-region: no-drag"
          @click="windowAction('maximize')"
          icon
        >
          <v-icon>mdi-window-{{ isMaximized ? "restore" : "maximize" }}</v-icon>
        </v-btn>
        <v-hover style="-webkit-app-region: no-drag">
          <template #default="{ hover }">
            <v-btn
              style="-webkit-app-region: no-drag"
              @click="windowAction('destroy')"
              icon
              :color="hover ? 'error' : 'default'"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-hover>
      </v-app-bar>
      <div style="height: calc(100% - 64px); width: 100%">
        <v-tabs-items
          style="height: 100%"
          class="pa-0 transparent"
          v-model="currentTab"
          :show-arrows="false"
          :show-arrows-on-hover="false"
          vertical
          touchless
        >
          <template v-for="(tab, i) in tabs">
            <v-tab-item
              style="height: 100%"
              v-if="tab"
              :key="i"
              ref="tabs"
              class="transparent pa-0"
            >
              <div v-if="!tab.isHidden" style="height: 100%">
                <websites-tab
                  @hide-current-tab="hideCurrentTab"
                  :tab="tab"
                  @update-loading="updateLoading"
                  :index-tab="i"
                ></websites-tab>
              </div>
            </v-tab-item>
          </template>
        </v-tabs-items>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "EdaratSegelat",
  components: {
    WebsitesTab: () => import("@/views/Websites/Tab.vue")
  },
  mounted() {
    this.addTab();
  },
  methods: {
    async windowAction(action) {
      await this.api("server/window-action", {
        action
      });
      if (action == "maximize") {
        this.$set(this, "isMaximized", !this.isMaximized);
      }
    },
    goWebsiteBackward() {
      let index = this.currentTab,
        tab = this.$refs.tabs[index],
        webview = tab.$el.getElementsByTagName("webview");
      if (webview && webview[0]) {
        let possible = webview[0].canGoBack();
        if (possible) {
          webview[0].goBack();
        }
      }
    },
    goWebsiteForward() {
      let index = this.currentTab,
        tab = this.$refs.tabs[index],
        webview = tab.$el.getElementsByTagName("webview");
      if (webview && webview[0]) {
        let possible = webview[0].canGoForward();
        if (possible) {
          webview[0].goForward();
        }
      }
    },
    copyUrl() {
      let index = this.currentTab,
        tab = this.$refs.tabs[index],
        webview = tab.$el.getElementsByTagName("webview");
      if (webview && webview[0]) {
        let url = webview[0].getURL();
        this.copyText(url);
        this.showSnackbar("تم نسخ الرابط");
      } else {
        this.showSnackbar("لا يوجد رابط لنسخه");
      }
    },
    hideTab(index) {
      let tabs = this.tabs;
      this.$set(this.tabs[index], "isHidden", true);
      if (tabs && tabs.filter(t => !t.isHidden).length == 0) {
        let intVal = setInterval(() => {
          this.addTab();
          clearInterval(intVal);
        }, 10);
      } else {
        this.fixTabIndex();
      }
    },
    hideCurrentTab() {
      let index = this.currentTab,
        tabs = this.tabs;
      this.$set(this.tabs[index], "isHidden", true);
      if (tabs && tabs.filter(t => !t.isHidden).length == 0) {
        let intVal = setInterval(() => {
          this.addTab();
          clearInterval(intVal);
        }, 10);
      } else {
        this.fixTabIndex();
      }
    },
    fixTabIndex() {
      let intval = setInterval(() => {
        let index = this.currentTab,
          tab = this.tabs[index],
          isHidden = tab.isHidden;
        if (isHidden) {
          // ? This condition will never happen
          let intval2 = setInterval(() => {
            let anyTabVisible = this.tabs.findIndex(t => !t.isHidden);
            this.$set(this, "currentTab", anyTabVisible);
            clearInterval(intval2);
          }, 100);
        } else {
          if (index !== this.currentTab) {
            this.$set(this, "currentTab", index);
          }
        }
        clearInterval(intval);
      }, 100);
    },
    addTab(tab) {
      let tabs = this.tabs;
      if (!tab) {
        tab = {
          title: "المواقع العسكرية",
          isNewTab: true,
          isHidden: false,
          loading: false
        };
      }
      this.$set(this.tabs, tabs.length, { ...tab });
      this.$set(this, "currentTab", tabs.length - 1);
      // let exists = tabs.map(v => v.url).includes(tab.url);
      // if (exists) {
      //   let index = tabs.findIndex(v => v.url == tab.url);
      //   tabs[index].isHidden = false;
      //   this.$set(this, "currentTab", index);
      // } else {
      //   this.$set(this.tabs, tabs.length, { ...tab, isHidden: false });
      //   this.$set(this, "currentTab", tabs.length - 1);
      // }
    },
    // updateLoading
    updateLoading(obj) {
      if (this.tabs[obj.index]) {
        this.$set(this.tabs[obj.index], "title", obj.title);
        this.$set(this.tabs[obj.index], "loading", obj.loading);
      }
      return true;
    },
    zoomIn() {
      this.currentZoomFactor = this.currentZoomFactor + 0.1;
      console.log("zoommIn");
      console.log(this.currentZoomFactor);
      this.setZoomFactor(this.currentZoomFactor);
    },
    zoomOut() {
      this.currentZoomFactor = this.currentZoomFactor - 0.1;
      console.log("zoommOut");
      console.log(this.currentZoomFactor);
      this.setZoomFactor(this.currentZoomFactor);
    }
  },
  data: () => ({
    model: true,
    isMaximized: true,
    tabs: [],
    currentTab: 0,
    currentZoomFactor: 1
  })
};
</script>

<style lang="scss" scoped>
#webview-dialog {
  //
}
</style>
