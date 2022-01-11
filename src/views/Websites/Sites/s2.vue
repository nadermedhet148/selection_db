<template>
  <div style="height: 100%; width: 100%">
    <webview
      ref="webview"
      style="height: 100%; width: 100%"
      :src="url"
    ></webview>
  </div>
</template>

<script>
export default {
  name: "S2Website",
  props: {
    s2User: {
      type: Object,
      default: () => ({})
    },
    ourUsername: {
      type: String,
      default: ""
    },
    blacklist: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    this.init();
  },
  data: () => ({
    url: "http://1.33.1.150/segelat"

    // blacklist: {
    //   excludedForOurUsername: ["http://1.33.1.150/segelat/Archef/Edit/1"],
    //   list: [
    //     "http://1.33.1.150/segelat/Archef/Edit/1",
    //     "http://1.33.1.150/segelat/Home/ChangePassword"
    //   ]
    // }
  }),
  methods: {
    init() {
      let webview = this.$refs.webview,
        that = this,
        blacklist = this.blacklist,
        ourUsername = this.ourUsername,
        s2User = this.s2User,
        currentUsername = s2User.username,
        isBlacklisted = url => {
          let returner = false;
          blacklist.forEach(el => {
            if (url.toLowerCase().includes(el.url.toLowerCase())) {
              if (
                el.isDisabled ||
                (currentUsername == ourUsername && el.isExcludedForOurUsername)
              ) {
                // اللينك محظور فعلاً, لكنه متاح باليوزرنيم بتاعنا
                // أو تم تعطيل حظره
                // وبالتالي هنعديها ومش هتعتبره محظور
              } else {
                returner = el.msg ? el.msg : "غير مصرح لك الدخول لهذه الصفحة";
              }
            }
          });
          return returner;
        };
      webview.addEventListener("will-navigate", event => {
        let url = event.url;

        console.log(event.url);
        if (
          url.toLowerCase().includes("/login") ||
          url.toLowerCase().includes("/logout")
        ) {
          that.$emit("logout-s2-website");
        }
        // Blocked URLs
        let blacklistMsg = isBlacklisted(url);
        if (blacklistMsg) {
          webview.stop();
          // webview.loadURL(that.url);
          // that.showError(blacklistMsg); // Moqadem Ahmed asked to not show any errors
        }
      });
      webview.addEventListener("did-start-loading", async () => {
        that.$emit("start-loading");
      });
      webview.addEventListener("did-stop-loading", async () => {
        that.$emit("stop-loading");
        let url = webview.getURL();
        await webview.insertCSS(
          `
          .disabled-item {
            pointer-events: none;
            filter: opacity(0.5);
          }
          //button[onclick="location.href='/segelat/Home/ChangePassword'"] {
            //pointer-events: none;
            //filter: opacity(0.5);
          //}
          `
        );
        // if (s2User.username !== "5520000000") {
        //   await webview.insertCSS(
        //     `
        //     a[href="/segelat/Archef/Edit/1"] {
        //       pointer-events: none;
        //       filter: opacity(0.5);
        //     }
        //     `
        //   );
        // }
        await webview.executeJavaScript(
          `{
            let anchors = document.getElementsByTagName('a');
            [...anchors].forEach(el => { el.setAttribute("target","")})
            }
          `
        );

        // webview.setZoomLevel(0.5);
        webview.setZoomFactor(1.1);
      });
    }
  }
};
</script>
