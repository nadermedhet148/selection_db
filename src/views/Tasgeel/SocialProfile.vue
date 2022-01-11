<template>
  <div>
    <social-header :tabs="tabs" :id="params.id" :rerun="rerun"></social-header>
    <div style="transform: translate(0px, 100px)">
      <v-row>
        <v-col cols="12" md="8" lg="9">
          <!-- Tabs Container -->
          <v-tabs-items v-model="params.section">
            <template v-for="(tab, i) in tabs">
              <v-tab-item
                v-if="tab.type && c.typeId && tab.type.includes(c.typeId)"
                :key="i"
              >
                <keep-alive>
                  <component
                    :id="params.id"
                    :rerun="rerun"
                    :is="tab.component"
                  ></component>
                </keep-alive>
              </v-tab-item>
            </template>
          </v-tabs-items>
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <social-sidenav :id="params.id" :rerun="rerun"></social-sidenav>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
let loadView = function(name) {
  return function(resolve) {
    require([
      `@/components/sections/tasgeel/social_profile/${name}.vue`
    ], resolve);
  };
};
export default {
  name: "social-profile",
  components: {
    SocialHeader: loadView("header"),
    SocialSidenav: loadView("sidenav")
  },
  data: () => ({
    componentName: "social_profile",
    rerun: false, // re-run load functions in all nested components
    c: {},
    tabs: [
      {
        text: "الأساسية",
        component: loadView("main-data"),
        type: [1, 2]
      },
      {
        text: "العقوبات",
        type: [1, 2]
      },
      {
        text: "المحاكم",
        type: [1, 2]
      },
      {
        text: "الإصابات",
        type: [1, 2]
      },
      {
        text: "اللجان الطبية",
        type: [1, 2]
      },
      {
        text: "محو الأمية",
        type: [1]
      },
      {
        text: "الترقي والعزل",
        type: [1, 2]
      },
      {
        text: "السفر للخارج",
        type: [2]
      }
    ]
  }),
  mounted() {
    if (this.params.id) {
      this.loadConscripte();
    }
  },
  watch: {
    "params.id"(v) {
      if (v && v.length > 0) {
        this.loadConscripte();
      }
    }
  },
  methods: {
    async loadConscripte() {
      this.$set(this, "rerun", false);
      let id = this.params.id;
      let conscripte = await this.socialApi({
        id,
        attrs: ["militaryId", "typeId"]
      });
      if (conscripte && conscripte.militaryId) {
        // this.setRouterTitle(conscripte.fullName);
        console.log("Loaded Conscripte: " + conscripte.militaryId);
        this.$set(this, "c", { ...conscripte });
        this.$set(this, "rerun", true);
      } else {
        this.showError("تعذر احضار ملف الفرد من قاعدة البيانات.");
      }
    }
  },
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  }
};
</script>
