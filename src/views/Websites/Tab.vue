<template>
  <div style="height: 100%; width: 100%">
    <!-- <div>
      <pre>
        {{ items.unitsPasswords.model }}
      </pre>
    </div> -->
    <v-layout
      fill-height
      align-center
      justify-center
      align-content-center
      v-if="tab.isNewTab"
    >
      <v-flex lg8>
        <v-container>
          <div class="mb-16">
            <v-card tile flat class="text-center">
              <v-card-title class="text-h4 d-block mb-4 primary--text">
                <v-badge
                  class="default-badge with-padding"
                  color="warning black--text large"
                  content="( من داخل متصفح فرع السجلات )"
                >
                  الشبكة العسكرية
                </v-badge>
              </v-card-title>
              <v-card-subtitle class="line-height-x1 text--primary">
                <div>
                  هذه باقة بالمواقع المتاحة على الشبكة العسكرية
                </div>
                <div>
                  اضغط على أي واحدة منها لفتحها
                  <div
                    v-if="tries"
                    style="color:red;font-weight:bold;font-size:20px;margin-top:15px"
                  >
                    عدد المحاولات {{ tries }}
                  </div>
                </div>
              </v-card-subtitle>
            </v-card>
          </div>
          <v-row justify="center">
            <template v-for="(website, i) in websites">
              <v-col
                v-if="!website.adminOnly || isAdmin()"
                :key="i"
                cols="6"
                xl="4"
              >
                <v-card>
                  <v-card-title class="primary white--text">
                    {{ website.title }}
                  </v-card-title>
                  <v-card-text class="pt-6">
                    <div v-if="website.desc">
                      {{ website.desc }}
                    </div>
                    <div v-if="website.customLogin">
                      <!-- <div v-if="items[website.customLogin.items].userText"> -->
                      <div v-if="false">
                        <!-- Already logged in -->
                        متصل : "
                        {{ items[website.customLogin.items].userText }} (
                        {{ items[website.customLogin.items].userType }} ) "
                      </div>
                      <div>
                        <v-autocomplete
                          :label="website.customLogin.label"
                          :hint="website.customLogin.hint"
                          filled
                          :item-text="website.customLogin.itemText"
                          :items="items[website.customLogin.items].items"
                          :loading="items[website.customLogin.items].loading"
                          return-object
                          v-model="items[website.customLogin.items].model"
                          persistent-hint
                        ></v-autocomplete>
                      </div>
                    </div>
                  </v-card-text>
                  <v-card-actions class="px-4">
                    <v-btn
                      v-if="website.customLogin"
                      large
                      color="primary"
                      outlined
                      @click="
                        runFun(
                          website.customLogin.method,
                          items[website.customLogin.items] &&
                            items[website.customLogin.items].userText
                        )
                      "
                      class="px-6"
                    >
                      تسجيل الدخول
                    </v-btn>
                    <v-btn
                      v-else
                      large
                      color="primary"
                      outlined
                      class="px-6"
                      @click="openWebsite(i)"
                    >
                      فتح الموقع
                    </v-btn>
                  </v-card-actions>
                  <v-layout
                    v-if="
                      website.customLogin &&
                        items[website.customLogin.items].loginLoading
                    "
                    style="position: absolute; z-index: 99; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5)"
                    fill-height
                    align-center
                    justify-center
                    align-content-center
                  >
                    <v-progress-circular
                      color="white"
                      indeterminate
                    ></v-progress-circular>
                  </v-layout>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-container>
      </v-flex>
    </v-layout>
    <div v-else style="height: 100%; width: 100%">
      <div
        style="height: 100%; width: 100%"
        ref="website_tab"
        v-if="websites[selectedWebsite]"
      >
        <component
          @close-website="closeWebsite"
          @logout-s2-website="logoutS2Website"
          @start-loading="updateLoading(true)"
          @stop-loading="updateLoading(false)"
          :s2-user="items.unitsPasswords.model"
          :blacklist="blacklist"
          :our-username="ourUsername"
          :is="websites[selectedWebsite].component"
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
let loadView = view => {
  return function(resolve) {
    require([`@/views/Websites/Sites/${view}.vue`], resolve);
  };
};
export default {
  name: "WebsitesTab",
  async mounted() {
    await this.getUnitsPasswords();
    await this.getBlacklist();
    // await this.checkS2WebsiteLogin();
  },
  props: {
    tab: {
      type: Object,
      default: () => {}
    },
    indexTab: {
      type: Number,
      default: -1
    }
  },
  data: () => ({
    selectedWebsite: -1,
    ourUsername: "",
    blacklist: [],
    tries: 0,
    timeOut: null,
    items: {
      unitsPasswords: {
        items: [],
        loading: false,
        loginLoading: false,
        model: {},
        userText: "",
        userType: ""
      }
    },
    websites: [
      {
        title: "المنظومة 2 س",
        // url: "http://1.33.1.150/segelat",
        customLogin: {
          method: "loginToS2Website",
          items: "unitsPasswords",
          itemText: "unitText",
          hint: "من فضلك حدد اسم المستخدم الذي تريد تسجيل الدخول به",
          label: "المستخدم"
        },
        component: loadView("s2")
      },
      {
        title: "موقع المعلومات",
        // url: "",
        component: loadView("shabakaWebsite")
      },
      // {
      //   title: "التحكم بوحدة التخزين",
      //   adminOnly: true,
      //   component: loadView("storageDevice")
      // },
      {
        title: "منظومة تبادل الملفات",
        desc: "** تحت الإنشاء **",
        adminOnly: true,
        component: loadView("fileSharing")
      }
    ]
  }),
  methods: {
    runFun(fun, param) {
      if (this[fun]) {
        return this[fun](param);
      }
    },
    updateLoading(isLoading = false) {
      let webview = this.$refs.website_tab.getElementsByTagName("webview"),
        title = "";
      if (webview && webview[0]) {
        title = webview[0].getTitle();
      }
      this.$emit("update-loading", {
        loading: isLoading,
        index: this.indexTab,
        title
      });
    },
    async loginToS2Website(isLoggedIn = false) {
      // let isLoggedInOk = await this.checkS2WebsiteLogin();
      if (isLoggedIn) {
        // if (isLoggedInOk) {
        //   this.openWebsite(0);
        //   return;
        // } else {
        this.showError(
          "عفواً, لقد قمت بتسجيل الخروج. من فضلك قم بتسجيل الدخول مجدداً"
        );
        this.$set(this.items.unitsPasswords, "userText", "");
        this.$set(this.items.unitsPasswords, "userType", "");
        return;
        // }
      }
      this.tries++;
      if (this.tries > 50) {
        this.showError(
          "لا يمكن الاتصال في الوقت الحالى اعد المحاولة في وقت لاحق"
        );
        this.tries = 0;
        clearTimeout(timeOut);
        setLoading(false);
        return;
      }
      let { password, username } = this.items.unitsPasswords.model
          ? this.items.unitsPasswords.model
          : {},
        that = this,
        token = "",
        xhttpToken = new XMLHttpRequest(),
        xhttpLogin = new XMLHttpRequest(),
        setLoading = isLoading => {
          that.$set(that.items.unitsPasswords, "loginLoading", isLoading);
        },
        errorLog = () => {
          // that.showError(
          //   "تعذر الإتصال بالشبكة العسكرية, من فضلك تحقق من وصول سلك النت للجهاز وتحقق من تشغيل الشبكة في غرفة الحاسب"
          // );
          //clearTimeout(timeOut);
          setLoading(false);
        };
      if (!username) {
        this.showError("من فضلك قم بتحديد مستخدم لتسجيل الدخول");
        return;
      }
      setLoading(true);
      xhttpToken.onreadystatechange = function() {
        if (this.responseText.includes("Service Unavailable")) {
          this.showError(
            "لا يمكن الاتصال بسيرفر ادارة السجلات في الوقت الحالي اعد المحاولة في وقت لاحق"
          );
          clearTimeout(timeOut);
          setLoading(false);
          return;
        }
        if (this.readyState == 4 && this.status == 200) {
          let html = document.createElement("html");
          html.innerHTML = this.responseText;
          html.hidden = true;
          let token_inputs = html.getElementsByTagName("input");
          if (
            token_inputs["__RequestVerificationToken"] &&
            token_inputs["__RequestVerificationToken"].value
          ) {
            token = token_inputs["__RequestVerificationToken"].value;

            if (xhttpLogin == null) {
              console.log("xhttpLogin: ", xhttpLogin);
              return;
            }
            xhttpLogin.open(
              "post",
              "http://1.33.1.150/segelat/Home/Login",
              true
            );
            xhttpLogin.setRequestHeader(
              "Content-type",
              "application/x-www-form-urlencoded"
            );
            xhttpLogin.send(
              `UserName=${username}&Password=${password}&__RequestVerificationToken=${token}`
            );
          } else {
            // errorLog(
            //   "تعذر الإتصال بالشبكة العسكرية, من فضلك تحقق من وصول سلك النت للجهاز وتحقق من تشغيل الشبكة في غرفة الحاسب"
            // );
          }
        }
      };
      xhttpToken.onerror = errorLog;
      xhttpToken.ontimeout = errorLog;
      xhttpToken.open("get", "http://1.33.1.150/segelat/Home/login/", true);
      xhttpToken.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttpToken.send();
      let navigateToS2 = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log("clear");
          clearTimeout(timeOut);
          if (this.responseText.includes("المستخدم الحالي")) {
            /**
             * @TODO use TimeInterval Instead of timeout
             */
            // let notification = new Notification("الشبكة العسكرية فتحت", {
            //   dir: "rtl",
            //   lang: "AR",
            //   icon: require("@/assets/logo.png"),
            //   requireInteraction: true,
            //   body: "الشبكة العسكرية فتحت"
            // });
            // notification.onclick = () => {};
            // notification.onerror = () => {};
            // notification.onclose = () => {};
            // notification.onshow = () => {};

            that.openWebsite(0);
          } else {
            // error
            errorLog("الشبكة تعمل ولكن لم يتم تسجيل الدخول");
            // errorLog(
            //   "تعذر الإتصال بالشبكة العسكرية, من فضلك تحقق من وصول سلك النت للجهاز وتحقق من تشغيل الشبكة في غرفة الحاسب"
            // );
          }
        }
      };
      xhttpLogin.onreadystatechange = navigateToS2;
      xhttpLogin.onerror = errorLog;
      xhttpLogin.ontimeout = errorLog;

      let timeOut = setTimeout(() => {
        xhttpToken = null;
        xhttpLogin = null;
        that.loginToS2Website();
      }, 5000);
    },
    checkS2WebsiteLogin() {
      return new Promise((success, failure) => {
        let xhttp = new XMLHttpRequest(),
          that = this,
          setLoading = isLoading => {
            that.$set(that.items.unitsPasswords, "loginLoading", isLoading);
          },
          errorLog = () => {
            // that.showError(
            //   "تعذر الإتصال بالشبكة العسكرية, من فضلك تحقق من وصول سلك النت للجهاز وتحقق من تشغيل الشبكة في غرفة الحاسب"
            // );
            success(false);
          };
        setLoading(true);
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            clearTimeout(timeOut);
            setLoading(false);
            if (this.responseText.includes("المستخدم الحالي")) {
              let html = document.createElement("html");
              html.innerHTML = this.responseText;
              html.hidden = true;
              let infoList = html.getElementsByClassName("info-list")[0],
                userText = infoList.children[0].children[1].innerHTML,
                userType = infoList.children[1].children[1].innerHTML;
              that.$set(that.items.unitsPasswords, "userText", userText);
              that.$set(that.items.unitsPasswords, "userType", userType);
              if (userText == "قيادة قوات حرس الحدود" && userType == "سـلاح") {
                // Our username
                that.$set(that.items.unitsPasswords, "model", {
                  username: that.ourUsername
                });
              }
              success(true);
            } else {
              success(false);
            }
          }
        };
        xhttp.onerror = errorLog;
        xhttp.ontimeout = errorLog;
        xhttp.open("get", "http://1.33.1.150/segelat/", true);
        xhttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        xhttp.send();
      });
    },
    logoutS2Website() {
      let xhttp = new XMLHttpRequest(),
        that = this,
        errorLog = () => {
          // that.showError(
          //   "تعذر الإتصال بالشبكة العسكرية, من فضلك تحقق من وصول سلك النت للجهاز وتحقق من تشغيل الشبكة في غرفة الحاسب"
          // );
        };
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          that.hideCurrentTab();
        }
      };
      xhttp.onerror = errorLog;
      xhttp.ontimeout = errorLog;
      xhttp.open("get", "http://1.33.1.150/segelat/Home/Logout", true);
      xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp.send();
    },
    openWebsite(index) {
      this.$set(this, "selectedWebsite", index);
      let intval = setInterval(() => {
        this.$set(this.tab, "isNewTab", false);
        clearInterval(intval);
      }, 100);
    },
    hideCurrentTab() {
      this.$emit("hide-current-tab");
    },
    closeWebsite() {
      console.log("Closed Website");
      this.$set(this, "selectedWebsite", -1);
      let intval = setInterval(() => {
        this.$set(this.tab, "isNewTab", true);
        clearInterval(intval);
      }, 100);
    },
    async getBlacklist() {
      let that = this;
      that.$set(that, "blacklist", []);
      return new Promise((success, failure) => {
        that
          .api("global/get_all", {
            table: "websiteBlacklists"
          })
          .then(blacklist => {
            let items = blacklist.data;
            that.$set(that, "blacklist", items);
            success(true);
          })
          .catch(error => {
            console.log(error);
            // that.showError(
            //   "عفواً, حدث خطأ أثناء تحميل الصفحة. الرجاء اعلام قسم النظم"
            // );
            success(true);
          });
      });
    },
    async getUnitsPasswords() {
      let that = this;
      this.$set(this.items.unitsPasswords, "loading", true);
      return new Promise((success, failure) => {
        that
          .api("global/get_all", {
            table: "webUnitsPasswords",
            order: [["unitText", "ASC"]]
          })
          .then(units => {
            let items = units.data,
              ourUser = items.find(f => f.isOurUsername),
              ourUsername = ourUser.username;
            that.$set(that, "ourUsername", ourUsername);
            that.$set(that.items.unitsPasswords, "items", items);
            success(true);
          })
          .catch(error => {
            console.log(error);
            that.showError(
              "عفواً, تعذر تحميل باسوردات الوحدات من قاعدة البيانات"
            );
            success(true);
          })
          .finally(() => {
            that.$set(that.items.unitsPasswords, "loading", false);
          });
      });
    }
  }
};
</script>
