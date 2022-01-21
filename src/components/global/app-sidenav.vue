<template>
  <div>
    <v-dialog scrollable max-width="500px" v-model="logout_dialog">
      <v-card>
        <v-card-title class="ls-1 error">
          <span>تسجيل الخروج</span>
        </v-card-title>
        <v-divider class="mb-4"></v-divider>
        <v-card-text class="text-subtitle-1">
          هل تريد بالفعل تسجيل الخروج؟
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="logout_dialog = false"
            class="text-capitalize"
            large
            outlined
            color="error"
            >رجوع</v-btn
          >
          <v-btn
            @click="logout()"
            color="error"
            class="text-capitalize px-6"
            large
            >تسجيل الخروج</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- z-index: 999;  -->
    <v-navigation-drawer
      :right="$vuetify.lang.current == 'ar'"
      v-model="$store.state.options['drawer']"
      :temporary="!$store.state.options['fixed_sidenav']"
      app
      :mini-variant="$store.state.options['mini_variant']"
      overflow
      width="330"
      mini-variant-width="80"
      dark
      height="100%"
    >
      <template v-slot:img>
        <v-img
          height="100%"
          :gradient="
            `135deg, rgba(${
              $store.getters.isFullApp ? '13, 0, 255' : '20, 167, 76'
            }, 0.${isDark ? '3' : '5'}),  rgba(${
              $store.getters.isFullApp ? '13, 0, 255' : '20, 167, 76'
            }, 0.${isDark ? '3' : '5'})`
          "
          :src="require('@/assets/landing/bg/9.jpg')"
        ></v-img>
      </template>
      <vue-custom-scrollbar
        :style="
          `height: 100%; width: ${
            $store.state.options['mini_variant'] ? '80' : '330'
          }px; padding-bottom: 85px`
        "
        :settings="$store.state.options.scrollbar_settings"
      >
        <v-container
          class="text-center"
          v-if="!$store.state.options['mini_variant']"
        >
          <div class="mb-3">
            <v-avatar tile size="70px">
              <v-img :src="require('@/assets/inapp/logo.png')" contain></v-img>
            </v-avatar>
          </div>
          <div :class="`text-h5 white--text`">
            <!-- <span class="">
              {{ $store.getters.isFullApp ? "السجلات" : "الوحدات" }}</span
            > -->
            <span class=""> منظومة فرع الافراد </span>
          </div>
        </v-container>
        <v-divider v-if="!$store.state.options['mini_variant']"></v-divider>
        <v-list-item color="primary" two-line v-if="$store.state.currentUser">
          <!-- :to="'/u/' + $store.state.currentUser.userId" -->
          <v-list-item-avatar>
            <v-img
              :src="
                $store.state.currentUser.avatar
                  ? $store.state.currentUser.avatar
                  : require('@/assets/inapp/user-placeholder.jpg')
              "
            >
              <template v-slot:placeholder>
                <v-layout fill-height align-center justify-center ma-0>
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-layout>
              </template>
            </v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              class="boldOnLang"
              v-html="$store.state.currentUser.realName"
            ></v-list-item-title>
            <v-list-item-subtitle
              v-html="getLang(`sidebar.sections.${userSection}._self`)"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider v-if="$store.state.currentUser"></v-divider>
        <v-list-item>
          <v-list-item-title
            class="boldOnLang"
            v-if="!$store.state.options['mini_variant']"
          ></v-list-item-title>
          <v-btn
            :class="
              `float-right ${
                $store.state.options['mini_variant'] ? 'rotateY' : ''
              }`
            "
            icon
            @click="
              $store.state.options['mini_variant'] = !$store.state.options[
                'mini_variant'
              ]
            "
          >
            <v-icon class="rotateOnLang">mdi-keyboard-backspace</v-icon>
          </v-btn>
        </v-list-item>
        <v-list>
          <template v-for="item in sidenav_items">
            <v-list-group
              v-if="item.type == 'group' && item.children"
              :key="item.text"
              v-model="item.model"
              :prepend-icon="item.icon"
              color="white"
              active-class="primary"
            >
              <template v-slot:activator>
                <v-list-item-title
                  class="boldOnLang"
                  v-html="getLang('sidebar.' + item.text)"
                ></v-list-item-title>
              </template>
              <template v-for="(child, i) in item.children">
                <v-list-item
                  v-if="!child.sections || child.sections.includes(userSection)"
                  ripple
                  :key="i"
                  :to="child.href"
                  :target="child.targetBlank ? '_blank' : '_self'"
                  :rel="child.targetBlank ? 'noopener' : ''"
                  exact
                  :class="
                    $route.fullPath == child.href
                      ? 'primary white--text font-weight-bold'
                      : ''
                  "
                  tag="label"
                  :for="'id_' + child.control"
                >
                  <v-list-item-action v-if="child.icon">
                    <v-icon
                      :class="child.class == 'primary' ? 'white--text' : ''"
                      >{{ isAdmin() ? " " : child.icon }}</v-icon
                    >
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title
                      class="boldOnLang"
                      :class="child.class == 'primary' ? 'white--text' : ''"
                    >
                      {{
                        item.noTranslate
                          ? child.text
                          : getLang("sidebar." + child.text)
                      }}
                    </v-list-item-title>
                    <!-- This one -->
                    <v-list-item-subtitle
                      class="boldOnLang"
                      v-text="child.desc"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-switch
                    v-if="child.control == 'langs'"
                    :id="'id_' + child.control"
                    v-show="
                      child.control && !$store.state.options['mini_variant']
                    "
                    style="flex: none !important"
                    v-model="changeLocale"
                  ></v-switch>
                  <v-switch
                    v-else-if="child.control == 'night_mode'"
                    :id="'id_' + child.control"
                    style="flex: none !important"
                    v-model="$vuetify.theme.dark"
                  ></v-switch>
                  <v-switch
                    v-else
                    :id="'id_' + child.control"
                    v-show="
                      child.control && !$store.state.options['mini_variant']
                    "
                    style="flex: none !important"
                    v-model="$store.state.options[child.control]"
                  ></v-switch>
                </v-list-item>
              </template>
            </v-list-group>
            <v-divider
              v-else-if="item.type == 'divider'"
              class="my-2"
              :key="item.text"
            ></v-divider>
            <v-list-item
              :class="$route.fullPath == item.href ? 'primary white--text' : ''"
              ripple
              exact
              :to="item.href"
              :target="item.targetBlank ? '_blank' : '_self'"
              :rel="item.targetBlank ? 'noopener' : ''"
              v-else-if="item.type == 'single' && !item.click"
              :key="item.text"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title
                  class="boldOnLang"
                  v-html="getLang('sidebar.' + item.text)"
                ></v-list-item-title>
                <v-list-item-subtitle
                  class="boldOnLang"
                  v-text="item.desc"
                ></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action
                v-if="
                  item.text == 'messenger' &&
                    $store.state.notifications.unSeenMsgsCounter > 0
                "
              >
                <v-chip color="error">{{
                  $store.state.notifications.unSeenMsgsCounter
                }}</v-chip>
              </v-list-item-action>
              <v-list-item-action-text v-if="item.new">
                <v-chip color="primary" small>New</v-chip>
              </v-list-item-action-text>
            </v-list-item>
            <v-list-item
              color="primary"
              ripple
              exact
              :to="item.href"
              :target="item.targetBlank ? '_blank' : '_self'"
              :rel="item.targetBlank ? 'noopener' : ''"
              v-else-if="item.type == 'single' && item.click"
              @click="runFun(item.click)"
              :key="item.text"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title
                  class="boldOnLang"
                  v-html="getLang('sidebar.' + item.text)"
                ></v-list-item-title>
                <v-list-item-subtitle
                  class="boldOnLang"
                  v-text="item.desc"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
        <v-footer dir="rtl" padless fixed color="transparent">
          <!-- class="text-center align-center justify-center align-items-center" -->
          <v-list
            class="py-0"
            :light="!$vuetify.theme.dark"
            style="width: 100%"
          >
            <v-list-item
              :class="`grey ${$vuetify.theme.dark ? 'darken-3' : 'lighten-3'}`"
            >
              <v-list-item-content v-if="!$store.state.options['mini_variant']">
                <v-list-item-title class="boldOnLang">
                  السيرفر:
                  <span class="font-weight-normal">
                    {{ $store.state.current_server }}
                  </span>
                </v-list-item-title>
                <v-list-item-subtitle>
                  الإصدار:
                  {{ $store.state.app_version }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn fab small @click="changeTheme(!$vuetify.theme.dark)">
                  <v-icon small>mdi-invert-colors</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <!-- <div>
          v{{ $store.state.app_version }}
          <span v-if="!$store.state.options['mini_variant']">
            - Server: {{ $store.state.current_server }}</span
          >
        </div> -->
        </v-footer>
      </vue-custom-scrollbar>
    </v-navigation-drawer>
  </div>
</template>

<style lang="scss"></style>

<script>
let sidenav_items = require("@/components/items/sidenav-items.js");
export default {
  name: "app-sidenav",
  created() {
    for (const key in sidenav_items) {
      if (key == "seperator") continue;
      if (!this.$store.getters.isFullApp) {
        sidenav_items[key] = sidenav_items[key].filter(i => !i.onlySegelat);
      }
    }
  },
  mounted() {
    this.preventDefaultInstall();
    this.fetchSidenavItems();
  },
  data: () => ({
    logout_dialog: false,
    install_app_dialog: false,
    deferredPrompt: null,
    sidenav_items: [],
    user_section: "",
    sections_icons: [
      "mdi-shield-star-outline",
      "mdi-file-document-edit-outline",
      "mdi-account",
      "mdi-account-box-multiple-outline",
      "mdi-account-question-outline",
      "mdi-movie"
    ]
  }),
  computed: {
    isDark() {
      return this.$vuetify.theme.dark;
    },
    userSection() {
      return this.$store.state.currentUser.section;
    }
  },
  methods: {
    request_logout() {
      this.$set(this, "logout_dialog", true);
    },
    openWebsites() {},
    runFun(fun) {
      return this[fun]();
    },
    fetchSidenavItems() {
      this.$set(this, "sidenav_items", []);
      let user = this.$store.state.currentUser,
        section = user ? user.section : null,
        // role = user ? user.role : null,
        searcher = "_" + section,
        item_group = function(children = [], sec = 0, icon = "") {
          if (children.length)
            return {
              type: "group",
              children,
              icon,
              text: `sections.${sec}._self`,
              model: false
            };
          return {};
        };
      this.$set(this, "user_section", searcher);
      this.sidenav_items.push(...sidenav_items.header);
      // this.sidenav_items.push(sidenav_items.seperator(1));
      if (!this.$store.getters.isFullApp) {
        for (const key in sidenav_items) {
          if (key == "seperator") continue;
          if (key == "footer") continue;
          if (key == "header") continue;
          let items = sidenav_items[key] ? sidenav_items[key] : [];
          items.forEach(item => {
            if (item.type == "group") {
              this.sidenav_items.push(
                item_group(
                  item.value,
                  item.key,
                  this.sections_icons[item.key]
                    ? this.sections_icons[item.key]
                    : ""
                )
              );
            } else {
              this.sidenav_items.push(item);
            }
          });
        }
      } else if (section != null) {
        if (this.isAdmin()) {
          for (let i = 0; i < 5; i++) {
            if (i == 0 && searcher !== "_0") {
              continue;
            }
            let new_list_group = [],
              items = sidenav_items[`_${i}`] ? sidenav_items[`_${i}`] : [],
              groups_found = [];
            if (i == 1 && sidenav_items._12) {
              this.sidenav_items.push(...sidenav_items._12);
            }
            items.forEach(item => {
              if (item.type == "group") {
                groups_found.push(item);
              } else {
                new_list_group.push(item);
              }
            });
            this.sidenav_items.push(
              item_group(
                new_list_group,
                i,
                this.sections_icons[i] ? this.sections_icons[i] : ""
              )
            );
            groups_found.forEach(group => {
              this.sidenav_items.push(
                item_group(
                  group.value,
                  group.key,
                  this.sections_icons[group.key]
                    ? this.sections_icons[group.key]
                    : ""
                )
              );
            });
          }
        } else {
          let items = sidenav_items[searcher] ? sidenav_items[searcher] : [];
          items.forEach(item => {
            if (item.type == "group") {
              this.sidenav_items.push(
                item_group(
                  item.value,
                  item.key,
                  this.sections_icons[item.key]
                    ? this.sections_icons[item.key]
                    : ""
                )
              );
            } else {
              this.sidenav_items.push(item);
            }
          });
          // this.sidenav_items.push(...sidenav_items[searcher]);
          // switch (searcher) {
          //   case "_4":
          //     this.sidenav_items.push(
          //       item_group(
          //         sidenav_items[`_5`],
          //         5,
          //         this.sections_icons[5] ? this.sections_icons[5] : ""
          //       )
          //     );
          //     break;
          //   default:
          //     break;
          // }
        }
      }
      // this.sidenav_items.push(sidenav_items.seperator(2));
      this.sidenav_items.push(...sidenav_items.footer);
    },
    preventDefaultInstall() {
      let $this = this;
      window.addEventListener("beforeinstallprompt", e => {
        e.preventDefault();
        $this.deferredPrompt = e;
      });
    },
    async install_app() {
      let $this = this;
      if ($this.deferredPrompt) {
        $this.deferredPrompt.prompt();
        $this.deferredPrompt.userChoice.then(function(choiceResult) {
          if (choiceResult.outcome === "accepted") {
            $this.deferredPrompt = null;
            $this.install_app_dialog = false;
          } else {
            $this.deferredPrompt = null;
          }
        });
      }
    },
    getData: function(data = "") {
      if (data) {
        let returner;
        returner =
          this.$store.state["userProfile"] &&
          this.$store.state["userProfile"][data]
            ? this.$store.state["userProfile"][data]
            : "";
        return returner ? returner : "- -";
      } else {
        return false;
      }
    }
  }
};
</script>
