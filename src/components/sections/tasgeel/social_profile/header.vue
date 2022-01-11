<template>
  <div>
    <v-card dark>
      <v-img
        aspect-ratio="1"
        gradient="-45deg, rgba(0, 0, 0, .7), rgba(0, 0, 0, .5)"
        :src="require('@/assets/landing/bg/18.jpg')"
        height="200"
        class="overflow-visible"
      >
        <v-layout fill-height>
          <div style="width: 100%">
            <div class="text-end pt-3 pe-3">
              <v-btn icon>
                <v-icon>mdi-camera-image</v-icon>
              </v-btn>
            </div>
            <v-container
              :class="
                `align-self-end ${$vuetify.breakpoint.lgAndUp ? 'ps-8' : ''}`
              "
              style="transform: translate(0px, 30px)"
            >
              <v-row>
                <v-col cols="auto" class="align-self-end text-center">
                  <v-card
                    @click="lightbox([c_afrad.image])"
                    class="rounded-circle"
                    width="160"
                    height="160"
                    color="white"
                    elevation="4"
                  >
                    <v-layout
                      fill-height
                      align-center
                      align-content-center
                      justify-center
                    >
                      <v-avatar color="secondary" size="150">
                        <!-- 640W * 480H -->
                        <v-img
                          width="320"
                          height="240"
                          :src="c_afrad.image ? c_afrad.image : null"
                        ></v-img>
                      </v-avatar>
                    </v-layout>
                  </v-card>
                </v-col>
                <v-col
                  class="align-self-end"
                  style="transform: translate(0px, -5px)"
                >
                  <div>
                    <v-card-title v-text="c.fullName"></v-card-title>
                    <v-card-subtitle class="pt-2">
                      <div v-if="c.militaryId" class="text-right" dir="ltr">
                        <div v-if="c.militaryId.length !== 13">
                          <v-chip
                            label
                            color="transparent"
                            v-text="c.militaryId"
                          ></v-chip>
                        </div>
                        <div v-else>
                          <template
                            v-for="(part, i) in describeMilitaryId(
                              c.militaryId
                            )"
                          >
                            <v-tooltip :key="i" color="black" bottom>
                              <template v-slot:activator="{ on }">
                                <v-chip
                                  label
                                  color="transparent"
                                  v-on="on"
                                  v-text="part.value"
                                ></v-chip>
                              </template>
                              <span v-text="part.text"></span>
                            </v-tooltip>
                          </template>
                        </div>
                      </div>
                    </v-card-subtitle>
                  </div>
                  <div>
                    <v-tabs
                      v-model="params.section"
                      :light="!$vuetify.theme.dark"
                      :dark="$vuetify.theme.dark"
                    >
                      <template v-for="(tab, i) in tabs">
                        <v-tab
                          class="ls-0"
                          v-if="
                            tab.type && c.typeId && tab.type.includes(c.typeId)
                          "
                          :key="i"
                        >
                          {{ tab.text }}
                        </v-tab>
                      </template>
                    </v-tabs>
                    <v-divider
                      :light="!$vuetify.theme.dark"
                      :dark="$vuetify.theme.dark"
                    ></v-divider>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-layout>
      </v-img>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "social-profile-header",
  props: {
    id: {
      type: String,
      default: ""
    },
    rerun: {
      type: Boolean,
      default: false
    },
    tabs: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    rerun(v) {
      if (v === true) {
        this.loadConscripte();
      }
    }
  },
  mounted() {
    if (this.id) {
      this.loadConscripte();
    }
  },
  data: () => ({
    c: {},
    c_afrad: {},
    componentName: "social_profile"
  }),
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
  },
  methods: {
    describeMilitaryId: id => [
      {
        text: "سنة التجنيد",
        value: id.substring(0, 4)
      },
      {
        text: "منطقة التجنيد",
        value: id.substring(4, 5)
      },
      {
        text: "المؤهل",
        value: id.substring(5, 6)
      },
      {
        text: "كود السلاح",
        value: id.substring(6, 8)
      },
      {
        text: "مسلسل ( ترتيبه من منطقة التجنيد )",
        value: id.substring(8, 12)
      },
      {
        text: "مفتاح الرقم العسكري",
        value: id.substring(12, 13)
      }
    ],
    async loadConscripte() {
      let id = this.id,
        conscripte = await this.socialApi({
          id,
          attrs: [
            "militaryId",
            "fullName",
            "stateIdCurrent",
            "stateId",
            "typeId"
          ]
        });
      if (conscripte && conscripte.militaryId) {
        this.$set(this, "c", { ...conscripte });
      }
      let conscriptes_afrad = await this.afraadConscripte({
        where: { id },
        attrs: ["image", "relevantTele"]
      });
      if (conscriptes_afrad && conscriptes_afrad.length > 0) {
        let c_afrad = conscriptes_afrad[0];
        c_afrad.image = this.base64ToImg(c_afrad.image);
        c_afrad.phoneNumber = c_afrad.relevantTele
          ? c_afrad.relevantTele
              .split("")
              .filter(r => Number(r) == r)
              .join("")
          : "";
        this.$set(this, "c_afrad", c_afrad);
      }
    }
  }
};
</script>
