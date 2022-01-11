<template>
  <div>
    <v-app-bar
      fixed
      app
      :color="$vuetify.theme.dark ? '#363636' : 'white'"
      tile
      style="z-index: 99"
    >
      <v-app-bar-nav-icon
        @click.stop="
          $store.state.options['drawer'] = !$store.state.options['drawer']
        "
      >
      </v-app-bar-nav-icon>
      <!-- <v-toolbar-title v-text="$store.state.router_title"></v-toolbar-title> -->
      <v-toolbar-title
        v-text="
          $store.state.routes &&
          $store.state.routes[$store.state.current_route] &&
          $store.state.routes[$store.state.current_route].meta &&
          $store.state.routes[$store.state.current_route].meta.title
            ? $store.state.routes[$store.state.current_route].meta.title
            : 'صفحة غير محددة'
        "
      ></v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn depressed tile @click="goForwardHistory()">
        للأمام
      </v-btn> -->
      <v-menu
        transition="slide-y-transition"
        bottom
        offset-y
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" depressed tile>
            حجم الصفحة
            <v-icon class="ms-2">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-sheet width="300" class="pt-14 pb-5 px-4">
          <div>
            <v-slider
              hide-details
              color="primary"
              min="0.7"
              max="1.3"
              step="0.05"
              thumb-label="always"
              v-model="currentZoomFactor"
              @change="setZoomFactor(currentZoomFactor)"
            ></v-slider>
          </div>
        </v-sheet>
        <!-- <v-list>
          <template v-for="(zoom, i) in zooms">
            <v-list-item :key="i" @click="setZoomFactor(zoom.value)">
              <v-list-item-content>
                <v-list-item-title v-text="zoom.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list> -->
      </v-menu>
      <v-btn depressed tile @click="$router.back()">
        عودة
      </v-btn>
      <v-btn depressed tile @click="goThere('/')">
        الصفحة الرئيسية
      </v-btn>

      <template v-slot:extension>
        <v-tabs v-model="$store.state.current_route" align-with-title>
          <template v-for="(r, i) in $store.state.routes">
            <!-- @click.stop="storeCurrentRoute(i)" -->
            <v-tab v-show="!r.isHidden" :key="i" class="ls-0" v-if="r">
              {{ r.meta && r.meta.title ? r.meta.title : r.name }}
            </v-tab>
            <v-btn
              v-show="!r.isHidden"
              icon
              small
              :key="`${i}_close`"
              v-if="r"
              @click="deleteRoute(i)"
            >
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-tabs>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "app-topnav",
  mounted() {
    this.setCurrentZoomFactor();
  },
  data: () => ({
    currentZoomFactor: "1.0",
    zooms: [
      {
        title: "صغير جداً",
        value: 0.75
      },
      {
        title: "صغير",
        value: 0.85
      },
      {
        title: "أصغر قليلاً",
        value: 0.9
      },
      {
        title: "الحجم الطبيعي",
        value: 1
      },
      {
        title: "أكبر قليلاً",
        value: 1.1
      },
      {
        title: "كبير",
        value: 1.2
      },
      {
        title: "كبير جداً",
        value: 1.3
      }
    ]
  }),
  computed: {
    current_route() {
      return this.$store.state.current_route;
    }
  },
  watch: {
    current_route() {
      this.fixRoutePath();
    }
  },
  methods: {
    setCurrentZoomFactor() {
      let zf = this.$ls.get("app_zoom_factor", 1);
      this.$set(this, "currentZoomFactor", zf);
    }
    // storeCurrentRoute(i){
    //   this.$store.state.current_route = i;
    // }
  }
};
</script>
