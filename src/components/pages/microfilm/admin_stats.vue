<template>
  <div class="pb-6">
    <v-card>
      <v-card-title>
        مجلدات الميكروفيلم
      </v-card-title>
      <v-divider></v-divider>
      <v-text-field
        filled
        prepend-inner-icon="mdi-magnify"
        hint="بإمكانك البحث عن رقم عسكري معين عن طريق كتابته هنا, والضغط على مفتاح Enter"
        persistent-hint
        v-model="search.militaryId"
        @keypress.enter="findConscripte()"
        :disabled="search.loading"
      ></v-text-field>
      <v-tabs v-model="tab">
        <v-tab class="ls-0 text-body-1">
          نتائج البحث
        </v-tab>
        <v-tab class="ls-0 text-body-1">
          المجلدات
        </v-tab>
      </v-tabs>
      <v-divider></v-divider>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <!-- Search results -->
          <div v-if="search.militaryId && search.begin">
            <div
              class="text-center py-6"
              v-if="search.loading && search.items.length == 0"
            >
              <!-- Loading state -->
              <div class="mb-4">
                <v-progress-circular size="150" indeterminate color="primary">
                  <v-card-title>
                    {{
                      search.timeout > 0 && search.timeout !== 15
                        ? search.timeout
                        : ""
                    }}
                  </v-card-title>
                </v-progress-circular>
              </div>
              <div class="text--secondary">
                <div class="mb-2">
                  جارِ البحث عن الرقم العسكري
                </div>
                <div>
                  <code
                    style="font-size: 17px"
                    v-text="search.militaryId"
                  ></code>
                </div>
              </div>
            </div>
            <div v-else>
              <!-- Finished loading -->
              <div v-if="search.items.length > 0">
                <!-- Found results -->
                <v-card-text class="py-6">
                  <v-row>
                    <template v-for="(item, i) in search.items">
                      <v-col :key="i" cols="12" xl="3" lg="4">
                        <v-card>
                          <v-card-title>
                            المجلد {{ i + 1 }}
                            <v-spacer></v-spacer>
                            <v-btn
                              color="primary"
                              icon
                              @click="openExternal(item.path)"
                            >
                              <v-icon>mdi-link mdi-rotate-135</v-icon>
                            </v-btn>
                          </v-card-title>
                          <v-divider></v-divider>
                          <v-card-text class="text-center pt-6">
                            <template v-for="(img, ii) in item.imgs">
                              <v-card
                                width="80"
                                height="80"
                                class="mx-1 mb-2"
                                style="display: inline-block; position: relative;"
                                :key="ii"
                                @click="openExternal(`${item.path}/${img}`)"
                              >
                                <v-layout
                                  fill-height
                                  align-center
                                  align-content-center
                                  justify-center
                                >
                                  <v-card-title>
                                    {{ ii + 1 }}
                                  </v-card-title>
                                </v-layout>
                              </v-card>
                            </template>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </template>
                  </v-row>
                </v-card-text>
                <div class="mt-4" v-if="search.loading">
                  <v-progress-linear indeterminate></v-progress-linear>
                </div>
              </div>
              <div class="text-center py-6" v-else>
                <!-- No results found -->
                <div class="mb-4">
                  <v-icon size="150">mdi-emoticon-sad-outline</v-icon>
                </div>
                <div class="text--secondary">
                  <div class="mb-2">
                    لا توجد صور للرقم العسكري
                  </div>
                  <div>
                    <code
                      style="font-size: 17px"
                      v-text="search.militaryId"
                    ></code>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center py-6" v-else>
            <!-- Didn't search yet -->
            <div class="mb-4">
              <v-icon size="150">mdi-magnify</v-icon>
            </div>
            <div class="text--secondary">
              <div class="mb-2">
                من فضلك قم بكتابة رقم عسكري
              </div>
              <div>
                واضغط <code style="font-size: 17px">Enter</code> للبحث عنه
              </div>
            </div>
          </div>
        </v-tab-item>
        <v-tab-item>
          <v-card-text>
            <v-treeview
              transition
              hoverable
              :open.sync="open"
              :active.sync="active"
              :load-children="getItems"
              activatable
              open-on-click
              :items="items"
            ></v-treeview>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "microfilm-admin-stats",
  mounted() {
    this.getItems();
  },
  data: () => ({
    tab: 0,
    search: {
      militaryId: "",
      items: [],
      begin: false,
      loading: false,
      timeout: 15
    },
    items: [],
    open: [],
    active: []
  }),
  sockets: {
    gotMicrofilm(x) {
      if (x.error) {
        this.showError(
          `حدث خطأ أثناء احضار البيانات من السيرفر, من فضلك تحقق إن كان السيرفر يعمل.
          وتحقق إن كان الجهاز الذي تستخدمه مسموح له بالدخول الى السيرفر`
        );
      } else {
        console.log(x.item);
        this.$set(this.search.items, this.search.items.length, x.item);
      }
    },
    finishMicrofilm() {
      this.$set(this.search, "loading", false);
    },
    waitFinishMicrofilm() {
      let intVal = setInterval(() => {
        this.search.timeout--;
        if (this.search.timeout == 0) {
          this.$set(this.search, "loading", false);
          clearInterval(intVal);
        }
      }, 1000);
    }
  },
  methods: {
    async getItems(obj = {}) {
      let items = await this.api("server/get-microfilm", {
        path: obj.path ? obj.path : "",
        counter: obj.id ? Number(obj.id) * Math.random() * 0.123456789 : 0
      });
      if (items && items.ok && items.data) {
        if (obj.name) {
          obj.children = items.data;
        } else {
          this.$set(this, "items", items.data);
        }
      } else {
        this.showError(
          `حدث خطأ أثناء احضار البيانات من السيرفر, من فضلك تحقق إن كان السيرفر يعمل.
          وتحقق إن كان الجهاز الذي تستخدمه مسموح له بالدخول الى السيرفر`
        );
      }
    },
    findConscripte() {
      this.$set(this.search, "items", []);
      this.$set(this.search, "loading", true);
      this.$set(this.search, "begin", true);
      this.$set(this.search, "timeout", 15);
      let { militaryId } = this.search;
      this.$socket.client.emit("getMicrofilm", {
        militaryId
      });
    }
    // async findConscripte() {
    //   this.$set(this.search, "loading", true);
    //   this.$set(this.search, "begin", true);
    //   let { militaryId } = this.search;
    //   let items = await this.api("server/get-microfilms", {
    //     militaryId
    //   });
    //   console.log(items);
    //   if (items && items.ok && items.data) {
    //     this.$set(this.search, "items", items.data);
    //   } else {
    //     this.showError(
    //       `حدث خطأ أثناء احضار البيانات من السيرفر, من فضلك تحقق إن كان السيرفر يعمل.
    //       وتحقق إن كان الجهاز الذي تستخدمه مسموح له بالدخول الى السيرفر`
    //     );
    //   }
    //   this.$set(this.search, "loading", false);
    // }
  }
};
</script>
