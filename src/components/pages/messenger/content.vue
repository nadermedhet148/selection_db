<template>
  <div>
    <v-card tile flat :disabled="loading" class="messenger-content">
      <v-card-title>
        <div v-if="loading" style="width: 50%">
          <v-skeleton-loader type="heading" class="mb-4"></v-skeleton-loader>
          <v-skeleton-loader type="text" width="100"></v-skeleton-loader>
        </div>
        <div v-else>
          <div class="mb-2">
            <span
              v-if="user2 && user2.info && user2.info.realName"
              v-text="user2.info.realName"
            ></span>
          </div>
          <div class="body-2">
            <div
              v-if="$store.state.sockets._connected[selected_chat]"
              class="success--text"
            >
              <v-icon color="success" small>mdi-circle</v-icon>
              متصل الآن
            </div>
            <div v-else class="grey--text text--darken-1">
              <v-icon color="grey" small>mdi-circle</v-icon>
              غير متصل
            </div>
          </div>
        </div>
        <v-spacer></v-spacer>
        <div>
          <template v-for="(btn, i) in chatBtns">
            <v-tooltip
              v-if="!btn.authAdmin || (btn.authAdmin && isAdmin())"
              :key="i"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  class="ms-2"
                  v-on="on"
                  :loading="loading"
                  :disabled="
                    !user2[btn.disabled] ||
                      ($store.state.vue_webrtc.callers.user1.userId &&
                        $store.state.vue_webrtc.callers.user1.userId > 0 &&
                        $store.state.vue_webrtc.callers.user2.userId &&
                        $store.state.vue_webrtc.callers.user2.userId > 0)
                  "
                  fab
                  color="primary"
                  @click="
                    btn.action ? runFun(btn.action, [...btn.params]) : () => {}
                  "
                >
                  <v-icon v-text="btn.icon"></v-icon>
                </v-btn>
              </template>
              <span v-text="btn.text"></span>
            </v-tooltip>
          </template>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="messenger-content-msgs"
        ref="messenger-content-msgs"
        @scroll="msgsContainerScrolled"
      >
        <!-- <vue-custom-scrollbar
          :style="`height: 100%; width: auto;`"
          :settings="$store.state.options.scrollbar_settings"
        >
          <div> -->
        <v-layout
          v-if="loading || msgsLoading"
          fill-height
          align-center
          justify-center
        >
          <div class="text-center">
            <div>
              <v-progress-circular
                indeterminate
                color="primary"
                size="50"
              ></v-progress-circular>
            </div>
            <div class="mt-4 text--primary">
              جارِ التحميل...
            </div>
          </div>
        </v-layout>
        <div v-else>
          <div v-if="msgs.length > 0">
            <template v-for="(msg, i) in msgs">
              <v-hover :key="i">
                <template v-slot:default="{ hover }">
                  <div
                    style="position: relative"
                    :class="
                      `py-2 ${msg.sender == user1.userId ? 'text-end' : ''}`
                    "
                  >
                    <div>
                      <v-tooltip
                        :left="msg.sender !== user1.userId"
                        :right="msg.sender == user1.userId"
                      >
                        <template v-slot:activator="{ on }">
                          <v-chip
                            v-on="on"
                            style="max-width: 60%; white-space: pre-line; height: auto;"
                            large
                            :class="
                              `px-4 py-1 line-height-2 ${
                                (imgTypes.includes(msg.type) ||
                                  vidTypes.includes(msg.type)) &&
                                !msg.deleted
                                  ? 'transparent'
                                  : msg.sender == user1.userId
                                  ? `white--text ${
                                      $vuetify.theme.dark
                                        ? 'info darken-4'
                                        : 'primary'
                                    }`
                                  : `${
                                      $vuetify.theme.dark
                                        ? 'grey darken-3'
                                        : 'grey lighten-3'
                                    }`
                              }`
                            "
                          >
                            <div>
                              <div
                                v-if="msg.messengerChat"
                                :style="
                                  `background-color: rgba(${
                                    msg.sender == user1.userId ||
                                    $vuetify.theme.dark
                                      ? '0,0,0,0.5'
                                      : '255,255,255,1'
                                  }) !important; border-radius: 4px; border-${
                                    msg.sender == user1.userId
                                      ? 'left'
                                      : 'right'
                                  }: 6px solid ${
                                    msg.sender == user1.userId
                                      ? 'white'
                                      : $vuetify.theme.dark
                                      ? 'var(--v-info-lighten1)'
                                      : 'var(--v-primary-base)'
                                  } !important`
                                "
                                :class="
                                  `text-body-2 line-height-x1 py-1 mb-1 ${
                                    msg.sender == user1.userId
                                      ? `pe-4 ps-2`
                                      : `pe-2 ps-4 ${
                                          $vuetify.theme.dark
                                            ? 'grey darken-3'
                                            : 'grey lighten-3'
                                        }`
                                  }`
                                "
                              >
                                <div
                                  :class="
                                    msg.sender == user1.userId
                                      ? 'primary--text text--lighten-3'
                                      : 'primary--text'
                                  "
                                >
                                  {{
                                    msg.messengerChat.sender == user1.userId
                                      ? "أنت"
                                      : user2 && user2.info
                                      ? user2.info.realName
                                      : "الطرف الآخر"
                                  }}
                                </div>
                                <div v-if="msg.messengerChat.deleted">
                                  <i>
                                    -- تم حذف هذه الرسالة
                                    {{
                                      msg.messengerChat.deleteDate
                                        | moment("from", "now")
                                    }}
                                    --
                                  </i>
                                </div>
                                <div v-else>
                                  <div
                                    :dir="
                                      msg.sender == user1.userId ? 'ltr' : 'rtl'
                                    "
                                    v-if="
                                      imgTypes.includes(msg.messengerChat.type)
                                    "
                                  >
                                    <v-img
                                      width="150"
                                      :src="
                                        serverLink +
                                          '/save-files/messenger-chats/' +
                                          msg.messengerChat.path
                                      "
                                    ></v-img>
                                  </div>
                                  <div v-else>
                                    <v-icon
                                      :dark="
                                        msg.messengerChat.sender == user1.userId
                                      "
                                      v-if="msg.messengerChat.path"
                                    >
                                      mdi-file-document
                                    </v-icon>
                                    <span v-if="msg.messengerChat.fileSize">
                                      (
                                      {{
                                        msg.messengerChat.fileSize | fileSize
                                      }}
                                      )
                                    </span>
                                    <span>
                                      {{ msg.messengerChat.msg }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div v-if="msg.deleted">
                                <i>
                                  -- تم حذف هذه الرسالة
                                  {{ msg.deleteDate | moment("from", "now") }}
                                  --
                                </i>
                              </div>
                              <div v-else>
                                <div v-if="imgTypes.includes(msg.type)">
                                  <div>
                                    <v-img
                                      @click="
                                        lightbox(
                                          msgs.map(m =>
                                            imgTypes.includes(m.type) &&
                                            !m.deleted
                                              ? `${serverLink}/save-files/messenger-chats/${m.path}`
                                              : ''
                                          ),
                                          `${serverLink}/save-files/messenger-chats/${msg.path}`
                                        )
                                      "
                                      :width="
                                        msg.mediaWidth
                                          ? `${msg.mediaWidth}`
                                          : '300'
                                      "
                                      :src="
                                        serverLink +
                                          '/save-files/messenger-chats/' +
                                          msg.path
                                      "
                                    ></v-img>
                                  </div>
                                  <div>
                                    <v-slider
                                      hide-details
                                      min="300"
                                      max="800"
                                      v-model="msg.mediaWidth"
                                    ></v-slider>
                                  </div>
                                </div>
                                <div v-else-if="vidTypes.includes(msg.type)">
                                  <div>
                                    <video
                                      controls
                                      playsinline
                                      :autoplay="false"
                                      :width="
                                        msg.mediaWidth
                                          ? `${msg.mediaWidth}`
                                          : '400'
                                      "
                                      :src="
                                        serverLink +
                                          '/save-files/messenger-chats/' +
                                          msg.path
                                      "
                                    ></video>
                                  </div>
                                  <div>
                                    <v-slider
                                      hide-details
                                      min="300"
                                      max="800"
                                      v-model="msg.mediaWidth"
                                    ></v-slider>
                                  </div>
                                </div>
                                <div v-else>
                                  <v-icon
                                    :dark="msg.sender == user1.userId"
                                    v-if="msg.path"
                                  >
                                    mdi-file-document
                                  </v-icon>
                                  <span v-if="msg.fileSize">
                                    ( {{ msg.fileSize | fileSize }} )
                                  </span>
                                  <span>
                                    {{ msg.msg }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </v-chip>
                        </template>
                        <span v-if="msg.date">
                          {{ msg.date | moment("from", "now") }}
                        </span>
                      </v-tooltip>
                    </div>
                    <v-slide-y-reverse-transition>
                      <v-chip
                        :style="
                          `top: 50%; transform: translate(0%, -50%); position: absolute; ${
                            msg.sender !== user1.userId
                              ? 'left: 10px'
                              : 'right: 10px'
                          }`
                        "
                        v-if="hover && !msg.deleted"
                        class="transparent"
                        x-large
                      >
                        <v-btn
                          v-if="msg.sender == user1.userId || isAdmin()"
                          color="white"
                          light
                          fab
                          small
                          @click="deleteMsg(msg)"
                        >
                          <v-icon>
                            mdi-trash-can
                          </v-icon>
                        </v-btn>
                        <span
                          class="mx-1"
                          v-if="msg.sender == user1.userId || isAdmin()"
                        ></span>
                        <v-btn
                          color="white"
                          light
                          fab
                          small
                          @click="addReplyOn(msg)"
                        >
                          <v-icon>
                            mdi-chevron-down
                          </v-icon>
                        </v-btn>
                        <span v-if="msg.path" class="mx-1"></span>
                        <v-btn
                          v-if="msg.path"
                          color="white"
                          light
                          fab
                          small
                          @click="downloadFile(msg)"
                        >
                          <v-icon>
                            mdi-download
                          </v-icon>
                        </v-btn>
                      </v-chip>
                    </v-slide-y-reverse-transition>
                  </div>
                </template>
              </v-hover>
            </template>
          </div>
          <div v-else>
            <!-- No Messages Found -->
            <v-layout
              class="content-server-msg"
              fill-height
              align-center
              justify-center
            >
              <div class="text-center">
                <div>
                  <v-icon size="150" color="grey"
                    >mdi-facebook-messenger</v-icon
                  >
                </div>
                <div v-if="user2 && user2.info" class="mt-4">
                  بإمكانك إرسال رسالة ترحيب الى
                  {{ user2.info.degree ? `ال${user2.info.degree} / ` : " " }}
                  {{ user2.info.realName }}
                </div>
                <div>
                  لتبدأ محادثتك معه
                </div>
              </div>
            </v-layout>
          </div>
          <div v-if="isUser2Typing.length > 0">
            <div :class="`pt-2`">
              <v-chip
                style="max-width: 60%; white-space: pre-line; height: auto;"
                large
                :class="
                  `px-4 py-1 line-height-2 ${
                    $vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3'
                  }`
                "
              >
                <div>
                  <i>
                    {{ isAdmin() ? isUser2Typing : "يكتب الآن" }}
                  </i>
                </div>
              </v-chip>
            </div>
            <div>
              <span class="typing-loader"></span>
            </div>
          </div>
          <div v-if="new_msg.file">
            <div :class="`pt-2 text-end`">
              <v-chip
                style="max-width: 60%; white-space: pre-line; height: auto;"
                large
                :class="
                  `px-4 py-1 line-height-2 ${
                    $vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3'
                  }`
                "
              >
                <div>
                  <div dir="ltr">
                    {{ new_msg.file.name }}
                    (
                    {{ new_msg.file.size | fileSize }}
                    )
                  </div>
                  <div>
                    <v-progress-linear indeterminate></v-progress-linear>
                  </div>
                </div>
              </v-chip>
            </div>
          </div>
        </div>
        <!-- </div>
        </vue-custom-scrollbar> -->
      </v-card-text>
      <v-slide-y-reverse-transition>
        <div
          v-if="new_msg.replyOn.msg"
          style="width: 60%;"
          class="replyOn-container px-4"
        >
          <v-chip
            class="py-2"
            style="min-width: 200px; white-space: pre-line; height: auto"
          >
            <div class="secondary--text">
              <div>
                -- رد على رسالة --
                <v-btn
                  top
                  style="top: 2px"
                  fab
                  x-small
                  absolute
                  left
                  icon
                  @click="removeReplyOn()"
                >
                  <v-icon small>mdi-close</v-icon>
                </v-btn>
              </div>
              <v-divider class="my-1"></v-divider>
              <div>
                {{ new_msg.replyOn.msg | replyOnMsgFilter }}
              </div>
            </div>
          </v-chip>
        </div>
      </v-slide-y-reverse-transition>
      <v-divider></v-divider>
      <div>
        <v-layout align-center align-content-center justify-center fill-height>
          <v-text-field
            :loading="sendingMsg"
            filled
            hide-details
            placeholder="اكتب رسالة..."
            single-line
            v-model="new_msg.text"
            @keypress.enter="pushMsg"
          >
            <template v-slot:prepend-inner>
              <v-btn
                :disabled="new_msg.file ? true : false"
                fab
                class="mb-4 me-4"
                @click="
                  $refs.upload_file.$el.children[1].children[0].children[0].children[1].click()
                "
              >
                <v-icon>mdi-paperclip</v-icon>
              </v-btn>
              <v-file-input
                :disabled="new_msg.file ? true : false"
                ref="upload_file"
                class="d-none"
                v-model="new_msg.file"
                @change="msgFileChanged"
              >
              </v-file-input>
            </template>
            <template v-slot:append>
              <v-btn fab class="mb-4" @click="pushMsg">
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-layout>
      </div>
    </v-card>
    <!-- Dialogs -->
    <v-dialog v-model="deleteDialog.model" scrollable max-width="450">
      <v-card :loading="deleteDialog.loading" :disabled="deleteDialog.loading">
        <v-card-title class="error white--text">
          حذف رسالة
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          هل أنت متأكد من حذف الرسالة ؟
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            large
            class="px-6"
            outlined
            @click="deleteDialog.model = false"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            color="error"
            large
            class="px-6"
            @click="deleteMsg({}, true)"
            v-text="'حذف الرسالة'"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ../Dialogs -->
  </div>
</template>

<style lang="scss">
.messenger-content {
  height: calc(100vh - 64px - 50px);
  // overflow: hidden;
  .messenger-content-msgs {
    height: calc(100vh - 64px - 185.5px - 50px);
    overflow: auto;
    .content-server-msg {
      height: calc(100vh - 64px - 300px - 50px);
      overflow: auto;
    }
  }
  .replyOn-container {
    position: absolute;
    bottom: 95px;
  }
}
</style>

<script>
export default {
  name: "messenger-content",
  props: ["selected_chat"],
  mounted() {
    this.init();
  },
  filters: {
    replyOnMsgFilter(text) {
      let maxLength = 200;
      return text && text.length > maxLength
        ? text.substr(0, maxLength) + " ..."
        : text;
    }
  },
  watch: {
    selected_chat(v) {
      if (v) {
        this.init();
      }
    },
    isUser2Active(v) {
      if (v) {
        this.$set(
          this.user2,
          "socketId",
          this.$store.state.sockets._connected[this.selected_chat]
        );
        this.$nextTick(() => {
          let intVal = setInterval(() => {
            this.$nextTick(() => {
              this.getUser2Media();
            });
            clearInterval(intVal);
          }, 500);
        });
      } else {
        this.$set(this.user2, "socketId", "");
        this.$set(this.user2, "audio", false);
        this.$set(this.user2, "video", false);
        this.$set(this.user2, "mediaDevices", []);
      }
    },
    "new_msg.text"(v) {
      this.pushTyping();
    }
  },
  sockets: {
    saveBufferDone() {
      this.pushMsg({}, true);
    },
    recievedMsg(msg) {
      if (msg.user1 == this.selected_chat) {
        this.$set(this.msgs, this.msgs.length, msg);
        this.$set(this, "isUser2Typing", "");
        this.scrollDown();
      }
    },
    async unsetMsg(msgId) {
      let index = this.msgs.findIndex(m => m.id == msg.id);
      let date = await this.api("server/get-time");
      this.$set(this.msgs[index], "deleteDate", date.data);
      this.$set(this.msgs[index], "deleted", true);
    },
    user2Typing(typing) {
      if (typing.socketId == this.user2.socketId) {
        this.$set(this, "isUser2Typing", typing.text);
        this.scrollDown();
        let intVal = setInterval(() => {
          this.$nextTick(() => {
            let new_msg = this.isUser2Typing;
            if (new_msg == typing.text) {
              this.$set(this, "isUser2Typing", "");
            }
          });
          clearInterval(intVal);
        }, 10000);
      }
    },
    recievedUser2Media(x) {
      let { socketId, media } = x,
        user2SocketId = this.user2.socketId;
      if (socketId == user2SocketId) {
        this.$set(this.user2, "audio", media.audio);
        this.$set(this.user2, "video", media.video);
        this.$set(this.user2, "mediaDevices", media.devices);
      }
    }
  },
  methods: {
    async deleteMsg(msg, reallyDelete = false) {
      if (!reallyDelete) {
        this.$set(this.deleteDialog, "item", msg);
        this.$set(this.deleteDialog, "model", true);
        return;
      }
      msg = this.deleteDialog.item;
      this.$set(this.deleteDialog, "loading", true);
      let date = await this.api("server/get-time"),
        del = await this.api("global/update_one", {
          table: "messengerChats",
          where: {
            id: msg.id
          },
          update: {
            deleted: true,
            deleteDate: date.data
          }
        });
      let index = this.msgs.findIndex(m => m.id == msg.id),
        socketId = this.user2.socketId;
      this.$set(this.msgs[index], "deleteDate", date.data);
      this.$set(this.msgs[index], "deleted", true);
      this.$socket.client.emit("pullMsg", {
        socketId,
        msgId: msg.id
      });
      this.$set(this.deleteDialog, "loading", false);
      this.$set(this.deleteDialog, "model", false);
    },
    downloadFile(msg) {
      this.pushDownload(
        this.serverLink + "/save-files/messenger-chats/" + msg.path,
        msg.msg
      );
    },
    msgFileChanged(e) {
      if (e) {
        if (e.size / 1024 / 1024 > 100) {
          this.$set(this.new_msg, "file", null);
          this.showError(
            "عفواً, أقصى حجم للملف مسموح به هو 100MB في الوقت الحالي. لكي يعمل السيرفر بشكل جيد مع المستخدمين الآخرين"
          );
          return;
        }
        let reader = new FileReader(),
          username = this.$store.state.currentUser.username,
          splitter = e.name.includes(".") ? e.name.split(".") : false,
          ext = splitter ? splitter[splitter.length - 1] : "segelat",
          // filename = `${new Date()
          //   .toISOString()
          //   .substring(0, 10)}_${new Date().getTime()}_${username}.${ext}`
          filename = `${new Date().getTime()}_${username}.${ext}`;
        this.$set(this.new_msg.file, "serverType", ext);
        this.$set(this.new_msg.file, "serverPath", filename);
        reader.addEventListener("loadend", () => {
          this.$socket.client.emit("saveBuffer", {
            dir: "messenger-chats",
            data: reader.result,
            name: filename
          });
          // this.$set(this.new_msg, "file", null);
        });
        reader.readAsArrayBuffer(e);
      }
    },
    addReplyOn(msg) {
      this.$set(this.new_msg, "replyOn", {});
      let intVal = setInterval(() => {
        this.$nextTick(() => {
          this.$set(this.new_msg, "replyOn", msg);
        });
        clearInterval(intVal);
      }, 100);
    },
    removeReplyOn() {
      this.$set(this.new_msg, "replyOn", {});
    },
    pushTyping() {
      let { text: msg, file } = this.new_msg,
        socketId = this.user2.socketId;
      this.$socket.client.emit("pushTyping", {
        socketId,
        msg,
        file
      });
    },
    getUser2Media() {
      let socketId = this.user2.socketId;
      this.$socket.client.emit("getUser2AvailableMedia", {
        socketId
      });
    },
    async getMsgs() {
      let user1 = this.user1.userId,
        user2 = this.user2.userId,
        offset = this.offset,
        msgsCount = this.msgsCount,
        currentMsgsCount = this.msgs.length,
        gotFirstMsgs = this.gotFirstMsgs,
        limit = this.limit;
      if ((gotFirstMsgs && msgsCount > currentMsgsCount) || !gotFirstMsgs) {
        // Get messages
        this.api("tables/messenger/getChat", {
          user1,
          user2,
          offset,
          limit
        })
          .then(new_msgs => {
            this.$set(this, "offset", offset + new_msgs.data.rows.length);
            this.$set(this, "msgsCount", new_msgs.data.count);
            let currentReverse = this.msgs.reverse();
            let reverseMsgs = [
              ...currentReverse,
              ...new_msgs.data.rows
            ].reverse();
            this.$set(this, "msgs", reverseMsgs);
            this.$set(this, "gotFirstMsgs", true);
            this.$set(this, "msgsLoading", false);
            this.scrollDown(offset !== 0);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        // all messages already loaded
        this.$set(this, "gotLastMsgs", true);
      }
    },
    async init() {
      let user1 = this.$store.state.currentUser;
      user1.socketId = this.$store.state.sockets.myId;
      this.$set(this, "user1", user1);
      this.$set(this, "msgs", []);
      this.$set(this, "gotFirstMsgs", false);
      this.$set(this, "gotLastMsgs", false);
      this.$set(this, "msgsCount", 0);
      this.$set(this, "offset", 0);
      this.$set(this.new_msg, "text", "");
      this.$set(this.new_msg, "replyOn", {});
      this.$set(this, "isUser2Typing", "");
      if (this.selected_chat) {
        this.$set(this, "loading", true);
        this.$set(this, "msgsLoading", true);
        let user2 = {};
        user2.userId = this.selected_chat;
        user2.socketId = this.$store.state.sockets._connected[
          this.selected_chat
        ];
        if (user2.socketId) {
          // User is connected [available], Get available media
          this.getUser2Media();
        } else {
          // User is not connected [not available]
          user2.audio = false;
          user2.video = false;
          user2.mediaDevices = [];
        }
        let fetchUser2 = await this.api("tables/users/by_id", {
          userId: user2.userId
        });
        user2.info = fetchUser2.data;
        this.$set(this, "user2", user2);
        this.$set(this, "loading", false);
        // Get latest messages
        this.getMsgs();
      } else {
        this.$set(this, "loading", false);
      }
    },
    async pushMsg(e, isFile = false) {
      // if (e.keyCode && e.keyCode == "13" && e.shiftKey) {
      //   return false;
      // }
      let { text: msg, replyOn, file } = { ...this.new_msg },
        user1 = this.user1.userId,
        { userId: user2, socketId } = this.user2,
        sending = this.sendingMsg;
      if ((msg.trim().length == 0 || sending) && !isFile) {
        // this.showError("مينفعش تبعت رسالة فاضية");
        // i commented the error for a better ux.
      } else {
        this.$set(this, "sendingMsg", true);
        let date = await this.api("server/get-time");
        this.api("tables/messenger/pushMsg", {
          user1,
          user2,
          msg: isFile ? file.name : msg,
          path: isFile ? file.serverPath : "",
          fileSize: isFile ? file.size : 0,
          type: isFile ? file.serverType : "",
          date: date.data,
          replyOnId: replyOn && replyOn.id ? replyOn.id : null
        })
          .then(x => {
            this.$set(this.msgs, this.msgs.length, x.data);
            this.$socket.client.emit("pushMsg", {
              socketId,
              msg: x.data
            });
            this.$set(this, "sendingMsg", false);
            this.$set(this.new_msg, "text", "");
            if (isFile) {
              this.$set(this.new_msg, "file", null);
            }
            this.$set(this.new_msg, "replyOn", {});
            this.scrollDown();
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    scrollDown(hasLittle = false) {
      let intVal = setInterval(() => {
        this.$nextTick(() => {
          let container = this.$refs["messenger-content-msgs"];
          container.scrollTop = hasLittle ? 400 : container.scrollHeight;
        });
        clearInterval(intVal);
      }, 100);
    },
    msgsContainerScrolled(e) {
      let scrollTop = e.target.scrollTop,
        msgsCount = this.msgsCount,
        currentMsgsCount = this.msgs.length,
        gotFirstMsgs = this.gotFirstMsgs;
      if (
        scrollTop == 0 &&
        this.user2.userId == this.selected_chat &&
        ((gotFirstMsgs && msgsCount > currentMsgsCount) || !gotFirstMsgs)
      ) {
        this.getMsgs();
      }
    },
    callUser(media, shareScreen = false) {
      // Caller
      // this.endCall(true);
      let medias = ["audio", "video"],
        constraints = {
          audio: medias.includes(media),
          video: media == "video",
          shareScreen
        },
        { user1, user2 } = this,
        roomId = `${Date.now()}___${user1.socketId}___${user2.socketId}`;
      this.$set(this.$store.state.vue_webrtc, "roomId", roomId);
      this.$set(this.$store.state.vue_webrtc, "enableAudio", constraints.audio);
      this.$set(this.$store.state.vue_webrtc, "enableVideo", constraints.video);
      this.$set(this.$store.state.vue_webrtc, "shareScreen", shareScreen);
      this.$socket.client.emit("vue_webrtc_request", {
        roomId,
        sender: user1,
        reciever: user2,
        constraints
      });
      this.$set(
        this.$store.state.vue_webrtc._callers,
        "caller",
        user1.socketId
      );
      this.$set(
        this.$store.state.vue_webrtc._callers,
        "callee",
        user2.socketId
      );
      this.$set(this.$store.state.vue_webrtc.callers, "user1", user1);
      this.$set(this.$store.state.vue_webrtc.callers, "user2", user2);
      this.$set(this.$store.state.vue_webrtc.callers, "model", true);
      this.$set(
        this.$store.state.vue_webrtc.callers,
        "constraints",
        constraints
      );
      this.$set(this.$store.state.vue_webrtc.callers, "media", media);
    },
    runFun(fun, params = []) {
      return this[fun](...params);
    }
  },
  data: () => ({
    loading: false,
    msgsLoading: false,
    deleteDialog: {
      model: false,
      loading: false,
      item: {}
    },
    imgTypes: ["png", "jpeg", "jpg", "gif"],
    vidTypes: ["mp4", "mp3", "wav", "webm", "avi"],
    user1: {},
    user2: {},
    msgs: [],
    sendingMsg: false,
    gotFirstMsgs: false,
    gotLastMsgs: false,
    msgsCount: 0,
    offset: 0,
    limit: 15,
    new_msg: {
      text: "",
      replyOn: {},
      file: null
    },
    isUser2Typing: "",
    isRequestRecieved: {
      user: {},
      audio: false,
      video: false,
      model: false
    },
    chatBtns: [
      {
        icon: "mdi-phone",
        text: "مكالمة صوتية",
        disabled: "audio",
        action: "callUser",
        params: ["audio"],
        authAdmin: false
      },
      {
        icon: "mdi-video",
        text: "مكالمة فيديو",
        disabled: "video",
        action: "callUser",
        params: ["video"],
        authAdmin: false
      },
      // {
      //   icon: "mdi-monitor-screenshot",
      //   text: "فتح شاشتي له",
      //   disabled: "socketId",
      //   action: "callUser",
      //   params: ["video", true],
      //   authAdmin: false
      // },
      {
        icon: "mdi-monitor-dashboard",
        text: "فتح شاشته لي",
        disabled: "socketId",
        authAdmin: true
      },
      {
        icon: "mdi-microsoft-xbox-controller",
        text: "التحكم بجهازه",
        disabled: "socketId",
        authAdmin: true
      }
    ]
  }),
  computed: {
    isUser2Active() {
      return this.$store.state.sockets._connected[this.selected_chat];
    }
  }
};
</script>
