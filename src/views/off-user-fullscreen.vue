<template>
  <div>
    <v-card class="s1-container" flat tile>
      <div class="bg-container">
        <v-carousel
          hide-delimiters
          hide-delimiter-background
          :show-arrows="false"
          height="100%"
          class="outer-linear"
          cycle
          interval="2000"
        >
          <template v-for="(img, i) in sliders">
            <v-carousel-item :value="i" :key="i">
              <v-img
                height="100%"
                width="100%"
                aspect-ratio="1"
                :src="require(`@/assets/landing/bg/${img}`)"
              >
              </v-img>
            </v-carousel-item>
          </template>
        </v-carousel>
        <div
          class="inner-linear"
          :style="
            `background: linear-gradient(30deg, rgba(18, 21, 37, 0.8), rgba(0, 0, 0, 0.51)) center center no-repeat`
          "
        ></div>
      </div>
      <v-layout fill-height align-center align-content-center justify-center>
        <v-container class="content-container">
          <v-row>
            <v-col cols="12">
              <v-card tile flat dark color="transparent">
                <v-card-subtitle class="pb-0" style="font-size: 18px">
                  حرس الحدود
                  {{ $store.getters.isFullApp ? " -  فرع الافراد" : "" }}
                </v-card-subtitle>
                <v-card-title
                  class="text-h4 break-word line-height-4 pt-0 mb-0 pb-0"
                >
                  منظومة فرع الافراد
                  <!-- {{ $store.getters.isFullApp ? "السجلات" : "الوحدات" }}
                  العسكرية -->
                </v-card-title>
                <v-card-text class="py-0">
                  <v-row>
                    <v-col>
                      <v-btn
                        :style="`opacity: ${step > 0 ? '1' : '0'}`"
                        @click="step = 0"
                        light
                        color="grey lighten-4"
                        rounded
                      >
                        <v-icon class="me-1"
                          >mdi-chevron-left mdi-rotate-180</v-icon
                        >
                        <span>عودة</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="7" md="6" lg="5" xl="3">
                      <v-tabs-items
                        dark
                        touchless
                        class="transparent"
                        v-model="step"
                      >
                        <v-tab-item class="transparent" :value="0">
                          <v-text-field
                            filled
                            label="اسم المستخدم"
                            :disabled="loading"
                            rounded
                            class="append-with-button"
                            prepend-inner-icon="mdi-face"
                            v-model="login.username"
                            persistent-hint
                            @keypress.enter="checkUsername()"
                            hint=" "
                          >
                            <template v-slot:append>
                              <v-btn
                                width="100"
                                :light="!loading"
                                color="grey lighten-4"
                                rounded
                                :disabled="loading"
                                :loading="loading"
                                @click="checkUsername()"
                                class="text-capitalize"
                              >
                                التالي
                                <span class="mx-1"></span>
                                <v-icon class="rotateOnLangNigative" small
                                  >mdi-keyboard-backspace</v-icon
                                >
                              </v-btn>
                            </template>
                            <template v-slot:message="{ message, key }">
                              <div :key="key">من فضلك أدخل اسم المستخدم</div>
                            </template>
                          </v-text-field>
                        </v-tab-item>
                        <v-tab-item class="transparent" :value="1">
                          <v-text-field
                            filled
                            label="كلمة المرور"
                            rounded
                            v-model="login.password"
                            :disabled="loading"
                            autofocus="true"
                            class="append-with-button"
                            prepend-inner-icon="mdi-lock"
                            @keypress.enter="checkPassword()"
                            persistent-hint
                            hint=" "
                            type="password"
                          >
                            <template v-slot:append>
                              <v-btn
                                width="120"
                                :light="!loading"
                                color="grey lighten-4"
                                rounded
                                :disabled="loading"
                                :loading="loading"
                                @click="checkPassword()"
                                class="text-capitalize"
                              >
                                دخول
                                <span class="mx-1"></span>
                                <v-icon class="rotateOnLangNigative" small
                                  >mdi-keyboard-backspace</v-icon
                                >
                              </v-btn>
                            </template>
                            <template v-slot:message="{ message, key }">
                              <div :key="key">من فضلك أدخل كلمة المرور</div>
                            </template>
                          </v-text-field>
                        </v-tab-item>
                      </v-tabs-items>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text class="pt-0">
                  <v-checkbox
                    class="pt-0 mt-0"
                    label="حفظ تسجيل الدخول"
                    v-model="login.saveLogin"
                    hint="إذا قمت بحفظ تسجيل الدخول, لن تحتاج لتسجيل الدخول المرة القادمة"
                    persistent-hint
                  ></v-checkbox>
                </v-card-text>
                <!-- <v-card-text class="pt-0">
                  * تم الإنتهاء من تطوير المنظومة الجديدة بتاريخ 01-06-2020 م .
                </v-card-text> -->
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-layout>
    </v-card>
  </div>
</template>

<style lang="scss">
.s1-container {
  height: 100vh;
  position: relative;
  .svg-container,
  .bg-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    .outer-linear,
    .inner-linear {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      &.outer-linear {
        z-index: 1;
      }
      &.inner-linear {
        z-index: 2;
      }
    }
  }
}
</style>

<script>
export default {
  name: "off-user-fullscreen",
  mounted() {},
  data: () => ({
    loading: false,
    slider: 0,
    sliders: [
      // "12.jpg", "6.jpg", "20.jpg", "24.jpg",
      "29.jpg"
      // "31.jpg"
    ],
    step: 0,
    login: {
      username: "",
      password: "",
      truePassword: "",
      saveLogin: false
    },
    user: null,
    bg_num_i: 0,
    bg_num: "24",
    bgs: ["6", "12", "20", "24"]
  }),
  computed: {},
  methods: {
    checkUsername() {
      this.$set(this, "loading", true);
      let { username } = this.login;
      this.api("tables/users/by_username", {
        username
      })
        .then(record => {
          let user = record.data;
          if (user.isVisible) {
            this.$set(this, "user", user);
            this.$set(this.login, "truePassword", user.password);
            this.$set(this, "step", 1);
          } else {
            this.showError("عفواً, تم حذف هذا المستخدم.");
          }
          this.$set(this, "loading", false);
        })
        .catch(error => {
          error.data = error.data ? error.data : "اسم المستخدم غير موجود";
          this.showError(error);
          this.$set(this, "loading", false);
        });
    },
    checkPassword() {
      this.$set(this, "loading", true);
      let { username, password, truePassword, saveLogin } = this.login;
      if (password == truePassword) {
        this.$set(this.$store.state, "currentUser", this.user);
        this.getSockets();
        // if (saveLogin) {
        this.$ls.set("currentUser", JSON.stringify(this.user));
        this.$ls.set("saveLogin", saveLogin);
        // }
        this.$set(this, "loading", false);
      } else {
        this.showError("كلمة المرور غير صحيحة");
        this.$set(this, "loading", false);
      }
    }
  }
};
</script>
