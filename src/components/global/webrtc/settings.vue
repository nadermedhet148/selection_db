<template>
  <v-navigation-drawer
    v-model="$store.state.vue_webrtc.settings_drawer"
    right
    temporary
    absolute
    width="400"
  >
    <v-card tile flat height="100%">
      <v-card-title class="py-0 ps-0">
        <v-row>
          <v-col class="py-0">
            <v-tabs v-model="tab">
              <template v-for="(item, i) in tabs">
                <v-tab class="font-weight-bold ls-0 text-body-1" :key="i">
                  {{ item }}
                </v-tab>
              </template>
            </v-tabs>
          </v-col>
          <v-col cols="auto" class="py-0">
            <v-btn
              class="mt-1"
              fab
              small
              depressed
              @click="$store.state.vue_webrtc.settings_drawer = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pt-0">
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <div>
              <v-list>
                <template v-for="(item, i) in settings.enables">
                  <v-list-item class="px-0" :key="i">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="item.desc"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-checkbox
                        v-model="$store.state.vue_webrtc[item.value]"
                      ></v-checkbox>
                    </v-list-item-action>
                  </v-list-item>
                </template>
              </v-list>
              <v-autocomplete
                label="من يستطيع دعوة آخرين"
                :items="settings.who_invites"
                v-model="$store.state.vue_webrtc.settings.who_invites"
                persistent-hint
                hint="تحديد من يمكنه إضافة أشخاص آخرين الى المحادثة"
                class="mb-4"
              ></v-autocomplete>
              <v-autocomplete
                label="مدخل الصوت"
                :items="$store.state.vue_webrtc.mediaDevices.audioinputs"
                item-text="label"
                item-value="deviceId"
                v-model="$store.state.vue_webrtc.mediaDevices.audioinput"
                persistent-hint
                hint="تحديد مصدر الصوت الذي يتم بثه للآخرين"
                class="mb-4"
              ></v-autocomplete>
              <!-- <v-autocomplete
                label="مخرج الصوت"
                :items="$store.state.vue_webrtc.mediaDevices.audiooutputs"
                item-text="label"
                item-value="deviceId"
                v-model="$store.state.vue_webrtc.mediaDevices.audiooutput"
              ></v-autocomplete> -->
              <v-autocomplete
                label="مدخل الفيديو"
                :items="$store.state.vue_webrtc.mediaDevices.videoinputs"
                item-text="label"
                item-value="deviceId"
                v-model="$store.state.vue_webrtc.mediaDevices.videoinput"
                persistent-hint
                hint="تحديد مصدر الفيديو الذي يتم بثه للآخرين"
              ></v-autocomplete>
            </div>
          </v-tab-item>
          <v-tab-item>
            <v-list>
              <template v-for="(user, i) in $store.state.users">
                <v-list-item
                  :key="`${user.userId}_${i}`"
                  v-if="
                    $store.state.rtc_sockets._connected[user.userId] &&
                      (!search || user.realName.includes(search))
                  "
                >
                  <v-list-item-avatar>
                    <v-img
                      :src="
                        user.avatar
                          ? user.avatar
                          : require('@/assets/inapp/user-placeholder.jpg')
                      "
                    ></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="user.realName"
                    ></v-list-item-title>
                    <v-list-item-subtitle>
                      <!-- <div
                        v-if="
                          $store.state.rtc_sockets._connected[user.userId] ==
                            $store.state.rtc_sockets.creatorId
                        "
                      >
                        منشئ الشات
                      </div> -->
                      <v-btn
                        @click="
                          admin().openUserScreen(
                            $store.state.sockets._connected[user.userId]
                          )
                        "
                        v-if="
                          user.userId !== $store.state.currentUser.userId &&
                            user.section !== 0
                        "
                        small
                        text
                        v-text="'فتح شاشته'"
                      ></v-btn>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action-text class="text-end">
                    <div></div>
                  </v-list-item-action-text>
                </v-list-item>
                <v-divider
                  :key="i + '_d'"
                  v-if="
                    $store.state.rtc_sockets._connected[user.userId] &&
                      $store.state.users.length > i + 1 &&
                      (!search || user.realName.includes(search))
                  "
                ></v-divider>
              </template>
            </v-list>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <!-- <v-card-actions class="px-4">
        <v-btn class="px-4 ls-0" color="primary" large @click="applySettings">
          تطبيق التعديلات
        </v-btn>
        <v-btn class="px-4 ls-0" color="primary" outlined large>
          عودة للإفتراضي
        </v-btn>
      </v-card-actions> -->
    </v-card>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "webrtc-call-settings",
  data: () => ({
    tab: null,
    tabs: ["الخيارات", "المشاركين"],
    settings: {
      who_invites: [
        {
          text: "أنا فقط",
          value: "only_me"
        },
        {
          text: "الجميع",
          value: "everyone"
        }
      ],
      enables: [
        {
          text: "فتح الصوت",
          value: "enableAudio",
          desc: "السماح لجميع المشاركين بسماع صوتي"
        },
        {
          text: "فتح الفيديو",
          value: "enableVideo",
          desc: "السماح لجميع المشاركين برؤية ما تعرضه الكاميرا"
        },
        {
          text: "فتح الشاشة",
          value: "shareScreen",
          desc: "مشاركة شاشتي مع الآخرين"
        }
      ]
    },
    search: ""
  }),
  methods: {
    applySettings() {
      let { constraints } = this.$store.state.vue_webrtc.callers,
        {
          audioinputs,
          audioinput,
          audiooutputs,
          audiooutput,
          videoinputs,
          videoinput
        } = this.$store.state.vue_webrtc.mediaDevices;
      // if (audioinput) {
      //   this.switchAudio(audioinput.deviceId);
      // }
      // if (videoinput) {
      //   this.switchVideo(videoinput.deviceId);
      // }
    },
    switchAudio(id) {
      // navigator.mediaDevices
      //   .getUserMedia({
      //     audio: {
      //       deviceId: {
      //         exact: id
      //       }
      //     }
      //   })
      //   .then(stream => {
      //     let audioTrack = stream.getAudioTracks()[0],
      //       sender = this.$store.state.vue_webrtc.peerConnection
      //         .getSenders()
      //         .find(function(s) {
      //           return s.track.kind == audioTrack.kind;
      //         });
      //     console.log(sender);
      //     if (sender) {
      //       sender.replaceTrack(audioTrack);
      //     }
      //   })
      //   .catch(error => {
      //     console.warn(error);
      //   });
    },
    switchVideo(id) {
      // navigator.mediaDevices
      //   .getUserMedia({
      //     video: {
      //       deviceId: {
      //         exact: id
      //       }
      //     }
      //   })
      //   .then(stream => {
      //     let videoTrack = stream.getVideoTracks()[0],
      //       sender = this.$store.state.vue_webrtc.peerConnection
      //         .getSenders()
      //         .find(function(s) {
      //           return s.track.kind == videoTrack.kind;
      //         });
      //     console.log(sender);
      //     if (sender) {
      //       sender.replaceTrack(videoTrack);
      //     }
      //   })
      //   .catch(error => {
      //     console.warn(error);
      //   });
    }
  }
};
</script>
