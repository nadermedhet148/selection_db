<template>
  <div>
    <v-hover>
      <template v-slot:default="{ hover }">
        <v-card
          v-if="!loading"
          class="overflow-visible"
          :height="header_height"
          color="grey darken-3"
          raised
        >
          <!-- rgba(46, 123, 201, .5), rgba(46, 123, 181, .5) -->
          <v-img
            class="align-end overflow-visible"
            aspect-ratio="1"
            gradient="-45deg, rgba(0, 0, 0, .7), rgba(0, 0, 0, .5)"
            :src="require('@/assets/landing/bg/18.jpg')"
            :height="header_height"
          >
            <div style="position: absolute; top: 15px; left: 15px; z-index: 1">
              <v-scale-transition>
                <v-btn v-if="hover" icon dark>
                  <v-icon>mdi-camera</v-icon>
                </v-btn>
              </v-scale-transition>
            </div>
            <div
              style="position: absolute; bottom: 15px; left: 30px; z-index: 1"
            >
              <v-menu transition="slide-y-transition">
                <template v-slot:activator="{ on }">
                  <v-btn
                    rounded
                    depressed
                    v-on="on"
                    :color="
                      conscripte.stateIdCurrent == '1' ? 'success' : 'error'
                    "
                    class="font-weight-bold"
                  >
                    {{
                      conscripte.stateIdCurrent == "1"
                        ? "بالخدمة"
                        : "منتهي خدمته"
                    }}
                    <v-icon class="ms-4">
                      {{
                        conscripte.stateIdCurrent == "1"
                          ? "mdi-check-bold"
                          : "mdi-close"
                      }}
                    </v-icon>
                  </v-btn>
                </template>
                <div>
                  <v-list min-width="200">
                    <v-subheader>
                      حالة الفرد
                    </v-subheader>
                    <v-divider></v-divider>
                    <v-list-item-group
                      v-model="conscripte.stateIdCurrent"
                      mandatory
                    >
                      <template
                        v-for="(state, i) in ['بالخدمة', 'منتهي خدمته']"
                      >
                        <v-list-item :value="i + 1" :key="i">
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="state"
                            ></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-list-item-group>
                  </v-list>
                </div>
              </v-menu>
            </div>
            <div class="px-4">
              <v-row class="py-0 my-0" style="transform: translate(0, 35px)">
                <v-col class="align-self-center py-0" cols="auto">
                  <v-avatar
                    style="transform: translate(-15px, 10px); border: 4px solid white !important"
                    size="150"
                    color="white"
                  >
                    <v-img
                      :src="
                        conscripte.image
                          ? conscripte.image
                          : require('@/assets/inapp/user-placeholder.jpg')
                      "
                    ></v-img>
                  </v-avatar>
                </v-col>
                <v-col class="align-self-center py-0">
                  <v-hover v-model="hovers.name">
                    <template>
                      <v-card-title class="text-h6 grey--text text--lighten-5">
                        <v-badge color="transparent" v-model="hovers.name">
                          <template v-slot:badge>
                            <v-btn
                              x-small
                              @click="test()"
                              color="primary"
                              fab
                              dark
                            >
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                          <span>
                            {{
                              conscripte.degree && conscripte.degree.degreeType
                                ? conscripte.degree.degreeType
                                : "--"
                            }}
                          </span>
                        </v-badge>
                        <span class="mx-2">/</span>
                        <v-badge color="transparent" v-model="hovers.name">
                          <template v-slot:badge>
                            <v-btn
                              x-small
                              @click="test()"
                              color="primary"
                              fab
                              dark
                            >
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                          <span>
                            {{
                              conscripte.fullName ? conscripte.fullName : "--"
                            }}
                          </span>
                        </v-badge>
                      </v-card-title>
                    </template>
                  </v-hover>
                  <v-card-subtitle
                    class="text-body-1 grey--text text--lighten-5 pt-2"
                  >
                    <div class="text-right" dir="ltr">
                      <div v-if="conscripte.militaryId.length !== 13">
                        {{ conscripte.militaryId }}
                      </div>
                      <div v-else>
                        <span class="ls-3">
                          {{ conscripte.militaryId.substring(0, 4) }}
                        </span>
                        <span class="ls-3">
                          {{ conscripte.militaryId.substring(4, 6) }}
                        </span>
                        <span class="ls-3">
                          {{ conscripte.militaryId.substring(6, 8) }}
                        </span>
                        <span class="ls-3">
                          {{ conscripte.militaryId.substring(8, 10) }}
                        </span>
                        <span class="ls-3">
                          {{ conscripte.militaryId.substring(10, 12) }}
                        </span>
                        <span class="ls-3">
                          {{ conscripte.militaryId.substring(12, 13) }}
                        </span>
                      </div>
                    </div>
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </div>
          </v-img>
        </v-card>
      </template>
    </v-hover>
  </div>
</template>

<script>
export default {
  name: "profile-header",
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    conscripte: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    header_height: "300",
    hovers: {
      name: false
    }
  }),
  methods: {
    test() {
      console.log("Test");
    }
  }
};
// خدمات طبية - امداد وتموين
</script>
