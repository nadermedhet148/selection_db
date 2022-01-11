<template>
  <div
    @keydown.exact="recordCheats"
    @keydown.ctrl.tab.exact="slideRouteForward()"
    @keydown.ctrl.shift.tab.exact="slideRouteBackward()"
    @keydown.ctrl.w.exact="deleteCurrentRoute()"
    tabindex="0"
    class="no-focus"
    ref="root_div"
  >
    <v-app>
      <template v-if="currentUser">
        <app-sidenav ref="app_sidenav"></app-sidenav>
        <app-topnav></app-topnav>
        <v-container
          :class="
            !noContainerList.includes(currentRouteName) ? '' : 'pa-0 ma-0'
          "
          :style="
            !noContainerList.includes(currentRouteName)
              ? 'max-width: 98% !important'
              : 'width: 100% !important; max-width: 100% !important; min-width: 100% !important;'
          "
        >
          <v-main
            :class="!noContainerList.includes(currentRouteName) ? 'mt-4' : ''"
          >
            <!-- <router-view></router-view> -->
            <v-tabs-items
              :class="
                !noContainerList.includes(currentRouteName)
                  ? 'transparent'
                  : 'pa-0 transparent'
              "
              v-model="$store.state.current_route"
            >
              <template v-for="(r, i) in $store.state.routes">
                <v-tab-item v-if="r" :key="i" class="transparent">
                  <div v-if="!r.isHidden">
                    <keep-alive>
                      <component :is="r.meta.component"></component>
                    </keep-alive>
                  </div>
                </v-tab-item>
              </template>
            </v-tabs-items>
          </v-main>
        </v-container>
        <!-- <v-main v-else>
        <router-view></router-view>
      </v-main> -->
        <!-- <v-speed-dial fixed bottom left>
          <template v-slot:activator>
            <v-btn fab x-large dark color="indigo" @click="get2sFromWeb()">
              <v-icon>mdi-phone-return</v-icon>
            </v-btn>
          </template>
        </v-speed-dial> -->
        <v-speed-dial
          v-if="
            $store.state.vue_webrtc.callers.user1.userId &&
              $store.state.vue_webrtc.callers.user2.userId &&
              $store.state.vue_webrtc.callers.model == false
          "
          fixed
          bottom
          right
          style="z-index: 13"
        >
          <template v-slot:activator>
            <v-btn
              fab
              x-large
              color="error"
              @click="$store.state.vue_webrtc.callers.model = true"
            >
              <v-icon>mdi-phone-return</v-icon>
            </v-btn>
          </template>
        </v-speed-dial>
      </template>
      <template v-else>
        <v-main>
          <off-user></off-user>
        </v-main>
      </template>
      <global-error-dialog></global-error-dialog>
      <global-success-dialog></global-success-dialog>
      <global-info-dialog></global-info-dialog>
      <global-snackbar></global-snackbar>
      <web-rtc-call></web-rtc-call>
      <app-lightbox></app-lightbox>
      <db-procedures></db-procedures>
    </v-app>
    <!-- reminder  -->
    <v-alert
      prominent
      type="error"
      :class="{ sticky: true, alert: true, fade: isHidden }"
      @click="
        isHidden = !isHidden;
        hideAlert();
      "
      color="red"
      dir="rtl"
      v-if="
        currentUser &&
          ((currentUser.section == 1 &&
            currentRouteName != 'advanced_search_enhaa' &&
            finalResult > 0) ||
            mota5eratNums > 0)
      "
    >
      <v-card>
        <v-card-text>
          <v-col>
            <v-row
              align="center"
              v-if="
                currentUser.section == 1 &&
                  currentRouteName != 'advanced_search_enhaa' &&
                  finalResult > 0
              "
            >
              <v-col class="grow">
                يوجد متاخرات
                <v-chip class="ms-3">{{ finalResult }}</v-chip>
              </v-col>

              <v-col class="shrink">
                <v-btn @click="gotomota5rat">الذهاب الى المتاخرات </v-btn>
              </v-col>
            </v-row>
            <v-row
              align="center"
              v-if="
                currentRouteName != 'followup' &&
                  (currentUser.section == 1 ||
                    currentUser.section == 2 ||
                    currentUser.section == 3 ||
                    currentUser.section == 4)
              "
            >
              <v-col class="grow">
                متابعات مرفوضة
                <v-chip class="ms-3">{{ mota5eratNums }}</v-chip>
              </v-col>

              <v-col class="shrink">
                <v-btn @click="goToMota5ratOfMotab3a"
                  >الذهاب الى المتابعة
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-card-text>
      </v-card>
    </v-alert>
    <!--
    <v-alert
      v-if="
        currentUser &&
          currentUser.section == 1 &&
          currentRouteName != 'advanced_search_enhaa' &&
          finalResult > 0
      "
      prominent
      type="error"
      :class="{ sticky: true, alert: true, fade: isHidden }"
      @click="hideAlert()"
      color="red"
      dir="rtl"
    >
      <v-row align="center">
        <v-col class="grow">
          يوجد متاخرات
          <v-chip class="ms-3">{{ finalResult }}</v-chip>
        </v-col>

        <v-col class="shrink">
          <v-btn @click="gotomota5rat">الذهاب الى المتاخرات </v-btn>
        </v-col>
      </v-row>
    </v-alert>
    <v-alert
      v-if="
        currentUser && 
        currentRouteName != 'Followup' &&
        (currentUser.section == 1 ||
          currentUser.section == 2 ||
          currentUser.section == 3 ||
          currentUser.section == 4)
      "
      prominent
      type="error"
      :class="{ sticky: true, alert: true, fade: isHidden }"
      @click="hideAlert()"
      color="red"
      dir="rtl"
    >
      <v-row align="center">
        <v-col class="grow">
          يوجد متاخرات
          <v-chip class="ms-3">{{ mota5eratNums }}</v-chip>
        </v-col>
      
        <v-col class="shrink">
          <v-btn @click="goToMota5ratOfMotab3a">الذهاب الى المتابعة </v-btn>
        </v-col>
      </v-row>
    </v-alert>
    -->
    <!-- reminder  -->
  </div>
</template>

<script>
export default {
  name: "MainLayout",
  components: {
    OffUser: () => import("@/views/off-user-fullscreen.vue"),
    AppTopnav: () => import("@/components/global/app-topnav.vue"),
    AppSidenav: () => import("@/components/global/app-sidenav.vue"),
    GlobalErrorDialog: () => import("@/components/items/error-dialog"),
    GlobalSuccessDialog: () => import("@/components/items/success-dialog"),
    GlobalInfoDialog: () => import("@/components/items/info-dialog"),
    GlobalSnackbar: () => import("@/components/items/snackbar"),
    AppLightbox: () => import("@/components/items/app-lightbox"),
    WebRtcCall: () => import("@/components/global/webrtc/call"),
    DbProcedures: () => import("@/components/global/db-procedures")
  },
  beforeDestroy() {
    clearInterval(this.intVal);
  },
  beforeMount() {
    clearInterval(this.intVal);
  },
  async mounted() {
    // this.initZoomFactor();
    this.searchEnhaa(true);
    this.get2sFromWeb();
    this.initMediaDevices();
    this.getSockets();
    this.fetchAllUsers();
    clearInterval(this.intVal);
    this.$set(
      this,
      "intVal",
      setInterval(() => {
        this.get2sFromWeb();
      }, 1800000)
    ); // نص ساعة
    // await this.api("server/fix-locale-format");
  },
  async updated() {
    this.getNotApprovedDecisions();
  },
  data: () => ({
    isHidden: false,
    alert: true,
    mota5eratNums: 0,
    search: {
      main: [
        {
          title: "البيانات الأساسية",
          id: "0",
          childs: [
            {
              type: "text",
              text: "الرقم العسكري",
              value: "militaryId",
              likeData: true
            },
            {
              type: "text",
              text: "الإسم",
              value: "fullName",
              likeData: true
            },
            {
              type: "date",
              text: "تاريخ التجنيد",
              value: "conscriptionDate",
              model_dialog: false,
              range: true
            },
            {
              type: "select",
              text: "الدرجة",
              value: "degreeId",
              item_text: "degreeType",
              item_value: "degreeId",
              hideInput: true
            },
            {
              type: "select",
              text: "السلاح",
              value: "forceId",
              item_text: "name",
              item_value: "forceId"
            },
            {
              type: "select",
              text: "الوحدة",
              value: "unitId",
              item_text: "unitText",
              item_value: "unitId"
            },
            {
              type: "select",
              text: "المنطقة",
              value: "zoneId",
              item_text: "zoneText",
              item_value: "zonetId"
            },
            {
              type: "select",
              text: "نوع الخدمة",
              value: "typeId",
              item_text: "dutyTypeText",
              item_value: "dutyTypeId"
            },
            // {
            //   type: "select",
            //   text: "الحالة الإجتماعية",
            //   value: "martialStateId",
            //   item_text: "state",
            //   item_value: "martialStateId"
            // },
            // {
            //   type: "text",
            //   text: "العنوان المدني",
            //   value: "address"
            // },
            // {
            //   type: "select",
            //   text: "حالة الفرد",
            //   value: "stateIdCurrent",
            //   item_text: "text",
            //   item_value: "stateId"
            // },
            {
              type: "select",
              text: "سبب الإنهاء",
              value: "stateId",
              item_text: "text",
              item_value: "stateId",
              multiple: true
            },
            {
              type: "date",
              text: "تاريخ التسريح",
              value: "demobilizationDate",
              model_dialog: false,
              range: true
            },
            {
              type: "date",
              text: "تاريخ الإنهاء",
              value: "endingDutyDate",
              model_dialog: false,
              range: true
            }
          ]
        }
      ],
      enhaa: [
        // {
        //   title: "متابع عام",
        //   id: "18",
        //   childs: [
        //     {
        //       type: "checkbox",
        //       text: "متابع؟",
        //       value: "finished"
        //     }
        //   ]
        // },
        // {
        //   title: "أخرى",
        //   id: "5",
        //   childs: [
        //     {
        //       type: "checkbox",
        //       text: "متابع؟",
        //       value: "finished"
        //     }
        //     // {
        //     //   type: "checkbox",
        //     //   text: "تاريخ الترقية",
        //     //   hint: "في حالة تأخير الإنهاء للترقية",
        //     //   value: "termDateByPromotion"
        //     // }
        //   ]
        // },
        {
          title: "النموذج 20 س",
          id: "1",
          childs: [
            {
              type: "checkbox",
              text: "تاريخ الإصدار",
              value: "s20IssueDate"
            },
            {
              type: "checkbox",
              text: "تاريخ إخطار الوحدة",
              value: "s20SendToUnitDate"
            },
            {
              type: "checkbox",
              text: "تاريخ تسليم 20 س إخلاء طرف الى إدارة السجلات",
              value: "ekhlaToEdaraDate",
              onlyFor: "2" // صف ضباط
            },
            {
              type: "checkbox",
              text: "تاريخ استلام إخلاء الطرف",
              value: "ekhlaFromEdaraDate",
              onlyFor: "2" // صف ضباط
            }
            // {
            //   type: "checkbox",
            //   text: "تم استلام التصديق",
            //   value: "recieveConfirmation"
            // },
            // {
            //   type: "checkbox",
            //   text: "تم اخطار الوحدة بالتصديق",
            //   value: "unitInform"
            // }
          ]
        },
        {
          title: "النموذج 21 س / 26 س",
          id: "2",
          childs: [
            {
              type: "checkbox",
              text: "تاريخ الإستلام (أ. السجلات)",
              value: "termFormIssueDate"
            },
            {
              type: "checkbox",
              text: "تاريخ التسليم الى الوحدة",
              value: "termFormSendDate"
            },
            {
              type: "checkbox",
              text: "تاريخ تسليم 26 س للفرد",
              value: "s26SendDate"
            }
          ]
        },
        // {
        //   title: "الإعفاء المؤقت",
        //   id: "3",
        //   childs: [
        //     {
        //       type: "checkbox",
        //       text: "تاريخ ورود 5 جند",
        //       value: "gond5Exemption"
        //     }
        //   ]
        // },
        // {
        //   title: "اللجنة الطبية",
        //   id: "4",
        //   childs: [
        //     {
        //       type: "checkbox",
        //       text: "تاريخ صدور اللجنة",
        //       value: "medicalCommitteeIssueDate"
        //     }
        //   ]
        // },
        // {
        //   title: "الكلية الحربية",
        //   id: "6",
        //   childs: [
        //     {
        //       type: "date",
        //       text: "تاريخ استلام التصديق",
        //       value: "facultyConfirmationDate"
        //     },
        //     {
        //       type: "date",
        //       text: "تاريخ ورود 5 جند",
        //       value: "gond5Faculty"
        //     }
        //   ]
        // },
        {
          title: "تسليم الموقف المالي ( تأمينات ومعاشات )",
          id: "7",
          childs: [
            {
              type: "checkbox",
              text: "تاريخ الإعتماد ( التأمين )",
              value: "insuranceConfirmationDate"
            },
            {
              type: "checkbox",
              text: "تاريخ تسليم ( إ. التأمين )",
              value: "insuranceDepSendDate"
            },
            {
              type: "checkbox",
              text: "تاريخ صندوق التأمين",
              value: "insurancePrivetBoxSendDate"
            },
            {
              type: "checkbox",
              text: "تاريخ الصندوق التكميلي",
              value: "insuranceSupplySendDate"
            }
          ]
        },
        {
          title: "قرار السببية",
          id: "8",
          childs: [
            {
              type: "checkbox",
              text: "تاريخ التسليم",
              value: "decReasonabilitySendDate"
            },
            {
              type: "checkbox",
              text: "تاريخ الإستلام",
              value: "decReasonabilityReceiveDate"
            }
          ]
        },
        {
          title: "شهادة الوفاة",
          id: "9",
          childs: [
            // {
            //   type: "date",
            //   text: "تاريخ الوفاة",
            //   value: "deathDate"
            // },
            {
              type: "date",
              text: "تاريخ إصدار شهادة الوفاة",
              value: "deathFormIssueDate",
              range: true
            }
          ]
        },
        {
          title: "دراسة سوء السلوك",
          id: "10",
          childs: [
            {
              type: "checkbox",
              text: "تاريخ آخر رد للوحدة",
              value: "lastCourt.lastUnitReply",
              hint: "تتم قراءته من آخر محكمة للفرد"
            },
            // {
            //   type: "date",
            //   text: "تاريخ آخر تأشيرة نيابة",
            //   value: "lastProsecutionDate"
            // },
            {
              type: "checkbox",
              text: "تاريخ آخر إشارة فرع",
              value: "lastCourt.lastBranchReply",
              hint: "تتم قراءته من آخر محكمة للفرد"
            },
            {
              type: "checkbox",
              text: "تاريخ إصدار ( 161 س )",
              value: "lastCourt.s161Date",
              hint: "تتم قراءته من آخر محكمة للفرد"
            }
          ]
        },
        {
          title: "لجنة التعويضات",
          id: "11",
          childs: [
            {
              type: "checkbox",
              text: "تاريخ التسليم الى هـ. تن",
              value: "compensationSendDate"
            },
            {
              type: "checkbox",
              text: "تاريخ الإستلام من هـ. تن",
              value: "compensationReceiveDate"
            }
          ]
        },
        {
          title: "استكمال الإجراءات",
          id: "12",
          childs: [
            {
              type: "select",
              text: "البطاقة العلاجية",
              value: "medicalCard",
              selects: "cards_select",
              item_text: "text",
              item_value: "value"
            },
            {
              type: "select",
              text: "تحقيق الشخصية",
              value: "militaryCard",
              selects: "cards_select",
              item_text: "text",
              item_value: "value"
            },
            {
              type: "select",
              text: "رخصة القيادة",
              value: "drivingLicence",
              selects: "cards_select",
              item_text: "text",
              item_value: "value"
            }
          ]
        },
        {
          title: "بيان الشهيد",
          id: "13",
          childs: [
            {
              type: "checkbox",
              text: "تاريخ الإستلام من الوحدة",
              value: "martyrFormReceiveDate"
            },
            {
              type: "checkbox",
              text: "تاريخ التسليم الى ( أ. السجلات )",
              value: "martyrFormSendDate"
            },
            {
              type: "checkbox",
              text: "تاريخ الإستلام من الإدارة",
              value: "martyrFormReceiveDate2"
            }
          ]
        },
        {
          title: "النموذج 170 س",
          id: "14",
          childs: [
            {
              type: "checkbox",
              text: "تاريخ الإستلام من الوحدة",
              value: "s170ReceiveDate"
            },
            {
              type: "checkbox",
              text: "تاريخ التسليم الى ( أ. السجلات )",
              value: "s170SendDate"
            }
          ]
        },
        {
          title: "مستحقات مالية",
          id: "15",
          childs: [
            {
              type: "checkbox",
              text: "خطاب 6 أشهر",
              value: "message6Monthes"
            },
            {
              type: "checkbox",
              text: "خطاب 4 أشهر",
              value: "message4Monthes"
            }
          ]
        },
        {
          title: "الترقي الإستثنائي",
          id: "16",
          childs: [
            {
              type: "checkbox",
              text: "تاريخ التصديق من الهيئة",
              value: "promotionConfirmationDate"
            },
            {
              type: "checkbox",
              text: "تاريخ إخطار ( ش. ضباط )",
              value: "promotionRecieveDate"
            },
            {
              type: "checkbox",
              text: "تاريخ إخطار ( أ. السجلات )",
              value: "promotionInformDate"
            }
          ]
        }
      ]
    },
    values: {
      main: {},
      enhaa: {}
    },
    section: {
      modeerNezam: 0,
      tasgeel: 1,
      ehtyat: 2,
      enhaa: 3,
      horob: 4,
      haseb: 5,
      gate: 6
    },
    results: [],
    finalResult: 0,
    results_loading: false,
    // render the "noContainerList" with no v-container element
    noContainerList: ["messenger", "advanced_search_enhaa"],
    intVal: null,
    cheat: ""
  }),
  watch: {
    // fullPath(v) {
    //   this.initZoomFactor();
    // }
    async cheat(v) {
      /**
       * قواعد عمل شيفرة
       * لازم تبدأ بحرف الـ M
       * لازم ميكونش فيها غير حرف M واحد
       * لازم تكون كل الحروف small case
       * لازم طول الـ keyCodes مع بعض يكون أطول من 24 حرف
       */
      switch (v) {
        case "774884726982704867756982":
          // m0therf0cker
          // الشفرة دي بتخليك مدير النظام
          // ! هنوقفها - ومينفعش حد يشغلها تاني غير بموافقة من المقدم شخصياً
          // this.$set(this.$store.state.currentUser, "section", 12);
          // if (this.$refs.app_sidenav) {
          //   this.$refs.app_sidenav.fetchSidenavItems();
          // }
          // this.showSuccess(
          //   "لقد أدخلت شيفرة الترقي الى مدير النظام, لديك الآن صلاحيات مدير النظام بشكل مؤقت الى أن تقوم بتسجيل الخروج أو إغلاق المنظومة."
          // );
          break;
        case "77488472698267487883487669":
          // m0ther c0ns0le
          // الشفرة دي بتفتح الكونسول
          await this.api("server/open-console", {
            noAsync: true
          });
          break;
        case "774884726982826976486568":
          // m0therrel0ad
          // Reload page
          this.showInfo("سيتم إعادة تحميل الصفحة");
          let intval = setInterval(() => {
            window.location.reload();
            clearInterval(intval);
          }, 1000);
          break;
      }
    }
  },
  computed: {
    currentRouteName() {
      let r = this.$store.state.routes[this.$store.state.current_route];
      return r && r.name ? r.name : "";
    },
    // currentResult() {
    //   return this.results.items
    //     ? this.results.map(r => r.items.length).reduce((sum, x) => sum + x)
    //     : 1;
    // },
    currentUser: {
      get() {
        console.log(
          "this.$store.state.currentUser ",
          this.$store.state.currentUser
        );
        return this.$store.state.currentUser;
      },
      set(v) {
        return v;
      }
    },
    fullPath() {
      return this.$route.fullPath;
    }
  },
  methods: {
    getNotApprovedDecisions() {
      this.api("global/get_all", {
        table: "correspondences",
        where: { isApproved: false }
      })
        .then(res => {
          let filteredData = null;
          let currentUser = this.$store.state.currentUser;
          if (currentUser.section == 1) {
            filteredData = res.data.filter(el => el.branch == "التسجيل");
          } else if (currentUser.section == 2) {
            filteredData = res.data.filter(el => el.branch == "الاحتياط");
          } else if (currentUser.section == 3) {
            filteredData = res.data.filter(el => el.branch == "إنهاء الخدمة");
          } else if (currentUser.section == 4) {
            filteredData = res.data.filter(
              el => el.branch == "الهروب" || el.branch == "خدمة المواطنين"
            );
          } else {
            this.mota5eratNums = 0;
          }
          this.$set(this, "mota5eratNums", filteredData.length);
        })
        .catch(error => console.log("getNotApprovedDecisions", error));
    },
    hideAlert() {
      setTimeout(() => {
        this.isHidden = false;
      }, 3600000);
    },
    searchEnhaa(late_stuff = false) {
      this.$set(this, "results_loading", true);
      let { search, values, checkboxes } = this;
      // console.log(late_stuff);
      console.log("search ", search);
      console.log("values ", values);
      console.log("late_stuff ", late_stuff);
      this.api("sections/enhaa/advanced_search", {
        search,
        values,
        // dutyStates: this.selects.stateId.data,
        late_stuff
      })
        .then(x => {
          let date_keys = [],
            other_date_keys = [
              "gond5Exemption",
              "gond5Faculty",
              "message4Monthes",
              "message6Monthes",
              "conscripte.courts.lastUnitReply",
              "conscripte.courts.lastBranchReply",
              "conscripte.courts.s161Date",
              "conscripte.courts.courtDate"
            ];
          x.data.forEach(el => {
            let hdrs = el.headers
              .map(k => (k.value.includes("Date") ? k.value : "NOT_A_DATE"))
              .filter(k => k !== "NOT_A_DATE");
            date_keys = [...date_keys, ...hdrs];
          });
          let unique_date_keys = [...new Set(date_keys)];
          console.log(x.data.slice(3, 4));
          this.$set(
            this,
            "results",
            this.fixDatesChilds(
              x.data,
              [...unique_date_keys, ...other_date_keys],
              true
            )
          );
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.finalResult = this.results
            .map(r => r.items.length)
            .reduce((sum, x) => sum + x);
          console.log("final r : ", this.results);
          this.$set(this, "results_loading", false);
        });
    },
    gotomota5rat() {
      this.$router.push({
        path: "search_enhaa/late_stuff"
      });
    },
    goToMota5ratOfMotab3a() {
      this.$router.push({
        path: "/followup"
      });
    },
    recordCheats(e) {
      let cheat = this.cheat,
        code = e.keyCode;
      // console.log(e.keyCode);
      if (cheat.length > 24 || code == "77") {
        this.$set(this, "cheat", "");
      }
      this.$set(this, "cheat", this.cheat + code);
    },
    // initZoomFactor() {
    //   let isLarge = this.$vuetify.breakpoint.lg;
    //   if (isLarge) {
    //     this.setZoomFactor(0.9);
    //   } else {
    //     this.setZoomFactor(1);
    //   }
    // },
    fetchAllUsers() {
      this.api("tables/users/all_users")
        .then(record => {
          let users = record.data;
          this.$set(this.$store.state, "users", users);
        })
        .catch(error => {
          console.log(error);
        });
    },
    async initMediaDevices() {
      let cons = await navigator.mediaDevices.enumerateDevices(),
        audioinputs = this.arr_obj_unique(
          cons.filter(c => c.kind == "audioinput"),
          "groupId" // groupId
        ),
        // audiooutputs = this.arr_obj_unique(
        //   cons.filter(c => c.kind == "audiooutput"),
        //   "groupId" // groupId
        // ),
        videoinputs = this.arr_obj_unique(
          cons.filter(c => c.kind == "videoinput"),
          "groupId" // groupId
        );
      this.$set(
        this.$store.state.vue_webrtc.mediaDevices,
        "audioinput",
        audioinputs.length > 0 ? audioinputs[0].deviceId : ""
      );
      // this.$set(
      //   this.$store.state.vue_webrtc.mediaDevices,
      //   "audiooutput",
      //   audiooutputs.length > 0 ? audiooutputs[0].deviceId : ""
      // );
      this.$set(
        this.$store.state.vue_webrtc.mediaDevices,
        "videoinput",
        videoinputs.length > 0 ? videoinputs[0].deviceId : ""
      );
      this.$set(this.$store.state.vue_webrtc.mediaDevices, "all", cons);
      this.$set(
        this.$store.state.vue_webrtc.mediaDevices,
        "audioinputs",
        audioinputs
      );
      // this.$set(
      //   this.$store.state.vue_webrtc.mediaDevices,
      //   "audiooutputs",
      //   audiooutputs
      // );
      this.$set(
        this.$store.state.vue_webrtc.mediaDevices,
        "videoinputs",
        videoinputs
      );
    },
    // Get s2 From Web Function
    get2sFromWeb() {
      console.log("Getting s2 From Web");
      if (this.$store.state.scraping) {
        console.log("An other scraping is running, S2 will wait for it.");
        return;
      }
      this.getToken();
    },

    // from register 2s page
    async loadRegister2s() {
      //let cards = await this.loadCards();
      // it will load them in children property for each card
      //await this.loadCardsData(cards);
      //let cardsWithProblems = this.checkProblems(cards); // passing by reference
      // reject cardsWithProblems
      // this.rejectCards(cardsWithProblems);
      // this.addingCardsToDB(cards);
      // this.addingDat3aToDB(cardsData);
      // console.log(cards);
      // console.log(cardsWithProblems);
    },
    async loadCards() {
      console.log("load cards from register 2s");
      let cards = [];
      let response = await fetch("http://1.33.1.150/segelat/Archef/Edit/1");
      if (response.status == 200) {
        let text = await response.text(),
          html = document.createElement("html"),
          dates = ["cardDate"],
          db = [
            "card",
            "lead",
            "unit",
            "cardNumber",
            "cardDate",
            "conscripteType"
          ];
        html.innerHTML = text;
        html.hidden = true;
        let table =
          html.getElementsByTagName("table") &&
          html.getElementsByTagName("table").length > 0
            ? html.getElementsByTagName("table")[0]
            : null;
        if (table) {
          let _trs = table.getElementsByTagName("tr"),
            trs = [..._trs];
          if (trs.length > 1) {
            trs.shift();
            trs.forEach((tr, i) => {
              let obj = {};
              let tds = tr.getElementsByTagName("td");
              db.forEach((key, ii) => {
                if (dates.includes(key)) {
                  let date =
                    tds[ii].innerHTML.trim() &&
                    tds[ii].innerHTML.trim().length > 0
                      ? tds[ii].innerHTML.trim()
                      : null;
                  if (date) {
                    date = date.split("/");
                    date = new Date(
                      date[2].split(" ")[0] + "/" + date[1] + "/" + date[0]
                    );
                  }
                  obj[key] = date;
                } else {
                  obj[key] = tds[ii].innerHTML.trim();
                }
              });
              cards.push(obj);
            });
          }
        }
      }
      return cards;
    },
    async loadCardsData(cards) {
      let that = this,
        tasks = cards.map((card, i) => {
          let url =
            "http://1.33.1.150/segelat/segelkhedma/Details/" + card.card;
          return fetch(url).then(async response => {
            if (response.status == 200) {
              // if it's not defined
              if (!cards[i].children) {
                cards[i].children = [];
              }

              cards[i].children.okobat = await that.getOkobat(response);
            }
          });
        });

      await Promise.all(tasks);
      return cards;
    },
    async getOkobat(response) {
      let okobat = [],
        text = await response.text(),
        html = document.createElement("html"),
        dates = ["itemDate", "crimeFrom", "crimeTo"],
        db = [
          "militaryId",
          "degree",
          "fullName",
          "itemDate",
          "itemNumber",
          "statement",
          "punishType",
          "punishPeriod",
          "type",
          "crimeFrom",
          "crimeTo",
          "crimeDesc"
        ];
      html.innerHTML = text;
      let okobatDiv = html.querySelector("#okobat");
      html.hidden = true;
      let table =
        okobatDiv &&
        okobatDiv.getElementsByTagName("table") &&
        okobatDiv.getElementsByTagName("table").length
          ? okobatDiv.getElementsByTagName("table")[0]
          : null;

      if (table) {
        let _trs = table.getElementsByTagName("tr"),
          trs = [..._trs];
        if (trs.length > 1) {
          trs.shift();
          trs.forEach((tr, i) => {
            let obj = {},
              tds = tr.getElementsByTagName("td");
            db.forEach((key, ii) => {
              if (dates.includes(key)) {
                let date =
                  tds[ii].innerHTML.trim() && tds[ii].innerHTML.trim().length
                    ? tds[ii].innerHTML.trim()
                    : null;
                if (date) {
                  date = date.split("/");
                  date = new Date(
                    date[2].split(" ")[0] + "/" + date[1] + "/" + date[0]
                  );
                }
                obj[key] = date;
              } else {
                obj[key] = tds[ii].innerHTML.trim();
              }
            });

            okobat.push(obj);
          });
        }
      }
      return okobat;
    },
    // async loadCardsData(cards) {
    //   let that = this,
    //     data = {
    //       okobat: {}
    //     },
    //     tasks = cards.map(card => {
    //       let url =
    //         "http://1.33.1.150/segelat/segelkhedma/Details/" + card.card;
    //       if (card.card == "672306" || true) {
    //         url = "http://localhost:8801/segelkhedma4.html";
    //       }
    //       return fetch(url).then(async response => {
    //         if (response.status == 200) {
    //           data.okobat[card.card] = await that.getOkobat(
    //             response,
    //             card.card
    //           );
    //         }
    //       });
    //     });
    //   await Promise.all(tasks);

    //   console.log(data);
    //   return data;
    // },
    // async getOkobat(response, cardIdOnline) {
    //   let okobat = [],
    //     text = await response.text(),
    //     html = document.createElement("html"),
    //     dates = ["itemDate", "crimeFrom", "crimeTo"],
    //     db = [
    //       "militaryId",
    //       "degree",
    //       "fullName",
    //       "itemDate",
    //       "itemNumber",
    //       "statement",
    //       "punishType",
    //       "punishPeriod",
    //       "type",
    //       "crimeFrom",
    //       "crimeTo",
    //       "crimeDesc"
    //     ];
    //   html.innerHTML = text;
    //   let okobatDiv = html.querySelector("#okobat");
    //   html.hidden = true;
    //   let table =
    //     okobatDiv.getElementsByTagName("table") &&
    //     okobatDiv.getElementsByTagName("table").length > 0
    //       ? okobatDiv.getElementsByTagName("table")[0]
    //       : null;
    //   if (table) {
    //     let _trs = table.getElementsByTagName("tr"),
    //       trs = [..._trs];
    //     if (trs.length > 1) {
    //       trs.shift();
    //       trs.forEach((tr, i) => {
    //         let obj = {};
    //         let tds = tr.getElementsByTagName("td");
    //         db.forEach((key, ii) => {
    //           if (dates.includes(key)) {
    //             let date =
    //               tds[ii].innerHTML.trim() &&
    //               tds[ii].innerHTML.trim().length > 0
    //                 ? tds[ii].innerHTML.trim()
    //                 : null;
    //             if (date) {
    //               date = date.split("/");
    //               date = new Date(
    //                 date[2].split(" ")[0] + "/" + date[1] + "/" + date[0]
    //               );
    //             }
    //             obj[key] = date;
    //           } else {
    //             obj[key] = tds[ii].innerHTML.trim();
    //           }
    //         });

    //         obj.cardIdOnline = cardIdOnline;
    //         okobat.push(obj);
    //         console.log(obj);
    //       });
    //     }
    //   }
    //   return okobat;
    // },

    // check if it should be rejected
    checkProblems(cards, cardsData) {
      let cardsWithProblems = [];
      cards.forEach(card => {
        // rule No.1 : cardNumber should be equal to the month that it was written in
        if (card.cardNumber != card.cardDate.getMonth() + 1) {
          this.pushProblem(
            "رقم الوثيقة لا يساوي التاريخ",
            card,
            cardsWithProblems
          );
        }

        let okobat = card.children.okobat;
        okobat.forEach(okoba => {
          let punishFrom = okoba.itemDate,
            // يوم || شهر || سنة
            type = okoba.type,
            period = okoba.punishPeriod,
            militaryId = okoba.militaryId,
            crimeFrom = okoba.crimeFrom,
            crimeTo = okoba.crimeTo,
            crimeDesc = okoba.crimeDesc,
            isHorob =
              crimeDesc.includes("غياب") || crimeDesc.includes("هروب")
                ? true
                : false;

          // rule  No.2 okobat must have punishFrom Date
          if (punishFrom == null) {
            this.pushProblem(
              "لم يتم العثور على تاريخ بند اوامر الوحدة لعقوبة الجندي: " +
                militaryId,
              card,
              cardsWithProblems
            );
          }

          // rule No.3 : okobat (horob || 8yab) must have crimeFrom and crimeTo not null
          if (isHorob && (crimeFrom == null || crimeTo == null)) {
            this.pushProblem(
              "لم يتم العثور على تاريخ (من أو إلى) في عقوبة الجندي: " +
                militaryId,
              card,
              cardsWithProblems
            );
          }

          // rule No.4 : okobat (horob || 8yab) starting punish should be after ending the crime atleast one day
          if (isHorob && punishFrom <= crimeTo) {
            this.pushProblem(
              "تاريخ بداية العقوبة قبل نهاية الجريمة في عقوبة الجندي: " +
                militaryId,
              card,
              cardsWithProblems
            );
          }
        });
      });
      return cardsWithProblems;
    },

    getCardByNumber(cardIdOnline, cards) {
      return cards.find(card => card.card == cardIdOnline);
    },
    // passing by reference
    pushProblem(problem, card, cardsWithProblem) {
      let problems = card.problems ? JSON.parse(card.problems) : [];
      problems.push(problem);
      card.problems = JSON.stringify(problems);
      cardsWithProblem.push(card);
    },
    addingCardsToDB(cards) {
      cards.forEach(async card => {
        let exists = await this.api("global/get_one", {
          table: "webS2Cards",
          where: card
        });
        if (exists && exists.data?.id) {
          return;
        }
        await this.api("global/create_one", {
          table: "webS2Cards",
          where: card
        });
      });
    },
    async addingDataToDB(cardsData) {
      // Okobat, ... etc
      let keys = Object.keys(cardsData);
      keys.forEach(key => {
        let cardsIdsOnline = Object.keys(cardsData[key]);
        cardsIdsOnline.forEach(cardIdOnline => {
          let records = cardsData[key][cardIdOnline];
          console.log(records);
          records.forEach(async record => {
            // firstLetter is capital
            let tableName = "webS2" + key[0].toUpperCase() + key.slice(0);
            let exists = await this.api("global/get_one", {
              table: tableName,
              where: record
            });

            if (exists && exists.data?.id) {
              return;
            }
            await this.api("global/create_one", {
              table: tableName,
              where: record
            });
          });
        });
      });
    },
    rejectCards(cards) {
      cards.forEach(async card => {
        let response = await fetch(
          "http://1.33.1.150/segelat/Archef/Ignore?ser=" + card.card
        );
        // todo check by regetting cards and make sure it no longer exists
        if (response.status == 200 && response.redirected) {
          card.isRejected = true;
        }
      });
    },

    load2s() {
      console.log("loading 2s");
      let conscripteTypes = [
          {
            name: "مجند",
            id: "2"
          },
          {
            name: "راتب عالي",
            id: "1"
          }
        ],
        that = this;

      // For printer 2s pages
      conscripteTypes.forEach(ctype => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = async function() {
          if (this.readyState == 4 && this.status == 200) {
            let html = document.createElement("html"),
              dates = [
                "startDate",
                "endDate",
                "absenceDate",
                "fugitiveNoticeDate",
                "returnDate",
                "returnNoticeDate",
                "firstLicenceDate",
                "secondLicenceDate",
                "lastComsionDate",
                "fromDate",
                "toDate",
                "cardDate"
              ],
              myDivs = {
                okobat: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "cardNumber",
                    "cardDate",
                    "unit"
                  ],
                  vals: []
                },
                tarakyAzl: {
                  db: [
                    "militaryId",
                    "fullName",
                    "force",
                    "unit",
                    "degree",
                    "promotionType"
                  ],
                  vals: []
                },
                travelReturn: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "fromDate",
                    "toDate",
                    "country",
                    "confirmer",
                    "reason"
                  ],
                  vals: []
                },
                tahel: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "fromDate",
                    "toDate",
                    "qualificationDegree"
                  ],
                  vals: []
                },
                moaml: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "orderNumber",
                    "orderDate",
                    "newType"
                  ],
                  vals: []
                },
                reduction: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "reductionPeriod",
                    "orderDate",
                    "specialism"
                  ],
                  vals: []
                },
                horob: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "absenceDate",
                    "fugitiveNoticeDate",
                    "notes"
                  ],
                  vals: []
                },
                awda: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "returnDate",
                    "returnNoticeDate",
                    "notes"
                  ],
                  vals: []
                },
                lic: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "firstLicenceNumber",
                    "firstLicenceDate",
                    "secondLicenceNumber",
                    "secondLicenceDate",
                    "lastComsionDate"
                  ],
                  vals: []
                },
                omia: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "qualification",
                    "seatNumber",
                    "qualificationDegree",
                    "governorate",
                    "markaz"
                  ],
                  vals: []
                },
                omiaTacer: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "fromDate",
                    "toDate",
                    "notes",
                    "ignorantDegree"
                  ],
                  vals: []
                }
              };
            html.innerHTML = this.responseText;
            html.hidden = true;
            let divs = html.getElementsByTagName("div");
            divs.forEach(div => {
              if (Object.keys(myDivs).includes(div.id)) {
                let table =
                  div.getElementsByTagName("table") &&
                  div.getElementsByTagName("table").length > 0
                    ? div.getElementsByTagName("table")[0]
                    : null;
                if (table) {
                  let _trs = table.getElementsByTagName("tr"),
                    trs = [..._trs];
                  // console.log(`${div.id} : ${trs.length > 1}`);
                  if (trs.length > 1) {
                    trs.shift();
                    trs.forEach((tr, i) => {
                      let obj = {};
                      let tds = tr.getElementsByTagName("td");
                      myDivs[div.id].db.forEach((key, ii) => {
                        if (dates.includes(key)) {
                          let date =
                            tds[ii].innerHTML.trim() &&
                            tds[ii].innerHTML.trim().length > 0
                              ? tds[ii].innerHTML.trim()
                              : null;
                          // convert DDMMYYYY to YYYYMMDD
                          if (date) {
                            date = date.split("/");
                            date = new Date(
                              date[2].split(" ")[0] +
                                "/" +
                                date[1] +
                                "/" +
                                date[0]
                            );
                          }

                          obj[key] = date;
                        } else {
                          if (div.id == "tarakyAzl") {
                            obj[key] = tds[ii].children[0].value.trim();
                          } else {
                            obj[key] = tds[ii].innerHTML.trim();
                          }
                        }
                      });
                      obj.chipType = div.id;
                      obj.conscripteType = ctype.name;
                      myDivs[div.id].vals.push(obj);
                    });
                  }
                }
              }
            });
            let allChips = Object.values(myDivs).map(m => m.vals),
              chipsIds = [],
              allChipsCounter = 0;
            allChips.forEach(cp => {
              allChipsCounter += cp.length;
            });
            // console.log(allChipsCounter);
            // console.log(allChips);
            allChips.forEach(cp => {
              cp.forEach(async (cpi, i) => {
                let exists = await that.api("global/get_one", {
                  table: "webChipsFollowups",
                  where: cpi
                });
                if (exists && exists.ok && exists.data && exists.data.id) {
                  chipsIds.push(exists.data.id);
                } else {
                  let conscripteExists = await that.api("global/get_one", {
                    table: "conscriptes",
                    where: {
                      militaryId: cpi.militaryId
                    }
                  });
                  if (
                    conscripteExists &&
                    conscripteExists.ok &&
                    conscripteExists.data &&
                    conscripteExists.data.militaryId
                  ) {
                    let newChip = await that.api("global/create_one", {
                      table: "webChipsFollowups",
                      where: { ...cpi, startDate: new Date() },
                      returner: "id"
                    });
                    if (newChip && newChip.ok && newChip.data) {
                      chipsIds.push(newChip.data);
                    }
                  } else {
                    await that.api("global/create_one", {
                      table: "conscriptes",
                      where: {
                        militaryId: cpi.militaryId,
                        fullName: cpi.fullName,
                        typeId: ctype.id == "2" ? 1 : 2
                      }
                    });
                    let newChip = await that.api("global/create_one", {
                      table: "webChipsFollowups",
                      where: {
                        ...cpi,
                        startDate: new Date(),
                        isCreatedByBot: true
                      },
                      returner: "id"
                    });
                    if (newChip && newChip.ok && newChip.data) {
                      chipsIds.push(newChip.data);
                    }
                  }
                }
                if (chipsIds.length == allChipsCounter) {
                  let updateChips = await that.api("global/update_one", {
                    table: "webChipsFollowups",
                    where: {
                      id: {
                        $notIn: chipsIds
                      },
                      endDate: {
                        $is: null
                      },
                      conscripteType: ctype.name
                    },
                    update: {
                      endDate: new Date()
                    }
                  });
                }
              });
            });
            if (allChipsCounter == 0 && allChips.length > 0) {
              // If internet is connected
              let updateAllChips = await that.api("global/update_one", {
                table: "webChipsFollowups",
                where: {
                  // id: {
                  //   $notIn: chipsIds
                  // },
                  endDate: {
                    $is: null
                  },
                  conscripteType: ctype.name
                },
                update: {
                  endDate: new Date()
                }
              });
            }
          }
        };
        xhttp.onerror = function(error) {
          // console.log("Error");
          // console.log(error);
        };
        xhttp.ontimeout = function(error) {
          // console.log("Timeout");
          // console.log(error);
        };
        xhttp.open(
          "get",
          `http://1.33.1.150/segelat/printPage/Details?type=${ctype.id}`,
          true
        );
        xhttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        xhttp.send();
      });

      // for Register s2 page
      this.loadRegister2s();
    },
    getToken() {
      let xhttp = new XMLHttpRequest(),
        that = this,
        token = "";
      xhttp.onreadystatechange = function() {
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
            console.log("logging in");
            that.login(token);
          }
        }
      };
      xhttp.onerror = function(error) {
        // console.log("Error");
        // console.log(error);
      };
      xhttp.ontimeout = function(error) {
        // console.log("Timeout");
        // console.log(error);
      };
      xhttp.open("get", "http://1.33.1.150/segelat/Home/login/", true);
      xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp.send();
    },
    login(token = "") {
      let xhttp = new XMLHttpRequest(),
        that = this;
      let { unitText, username, password } = {
        unitText: "السجلات العسكرية",
        username: "10000053",
        password: "army53"
      };
      if (username && username.length > 0 && password && password.length > 0) {
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            if (this.responseText.includes("المستخدم الحالي")) {
              console.log("logged In");
              that.load2s();
            }
          }
        };
        xhttp.onerror = function(error) {
          // console.log("Error");
          // console.log(error);
        };
        xhttp.ontimeout = function(error) {
          // console.log("Timeout");
          // console.log(error);
        };
        xhttp.open("post", "http://1.33.1.150/segelat/Home/Login", true);
        xhttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        xhttp.send(
          `UserName=${username}&Password=${password}&__RequestVerificationToken=${token}`
        );
      }
    }
  },
  sockets: {
    askForConnected() {
      this.getSockets();
    },
    newGateTaskNotification(task) {
      console.log(task);
      this.showInfo("هناك طلبات جديدة من البوابة");
      this.pushNotification({
        title: "طلب بوابة جديد",
        body:
          "هناك طلبات جديدة من البوابة, اضغط على الإشعار لفتح صفحة البوابة في المنظومة.",
        onclick: () => {
          this.$router.push("/gate_archive");
        }
      });
    },
    getMyId(data) {
      this.$set(this.$store.state.sockets, "myId", data);
    },
    updateConnected(data) {
      let _connected = {},
        webrtc__connected = {},
        { activeSockets, webrtcActiveSockets, activeDevicesSockets } = data;
      // activeSockets
      Object.keys(activeSockets).forEach(key => {
        let v = activeSockets[key];
        _connected[v] = key;
      });
      this.$set(this.$store.state.sockets, "connected", activeSockets);
      this.$set(this.$store.state.sockets, "_connected", _connected);
      // webrtcActiveSockets
      Object.keys(webrtcActiveSockets).forEach(key => {
        let v = webrtcActiveSockets[key];
        webrtc__connected[v] = key;
      });
      this.$set(
        this.$store.state.rtc_sockets,
        "connected",
        webrtcActiveSockets
      );
      this.$set(this.$store.state.rtc_sockets, "_connected", webrtc__connected);
      this.$set(this.$store.state.rtc_sockets, "devices", activeDevicesSockets);
    },
    async recievedRequestForUserMedia(x) {
      let socketId = x.socketId,
        devices = await navigator.mediaDevices.enumerateDevices(),
        audio =
          devices.filter(c => c.kind == "audioinput").length > 0 ? true : false,
        video =
          devices.filter(c => c.kind == "videoinput").length > 0 ? true : false;
      this.$socket.client.emit("pushMyUserMedia", {
        socketId,
        media: {
          audio,
          video,
          devices
        }
      });
    },
    vue_webrtc_request(x) {
      if (this.$store.state.vue_webrtc.callers.inCall) {
        this.$socket.client.emit("calleeBusy", {
          to: x.sender.socketId
        });
      } else {
        this.$set(
          this.$store.state.vue_webrtc._callers,
          "caller",
          x.sender.socketId
        );
        this.$set(
          this.$store.state.vue_webrtc._callers,
          "callee",
          x.reciever.socketId
        );
        this.$set(this.$store.state.vue_webrtc.callers, "user1", x.reciever);
        let user2 = {
          socketId: x.sender.socketId,
          userId: x.sender.userId,
          info: x.sender
        };
        this.$set(this.$store.state.vue_webrtc.callers, "user2", user2);
        this.$set(this.$store.state.vue_webrtc.callers, "model", true);
        this.$set(
          this.$store.state.vue_webrtc.callers,
          "constraints",
          x.constraints
        );
        this.$set(
          this.$store.state.vue_webrtc.callers,
          "media",
          x.constraints.video ? "video" : "audio"
        );
        this.$set(
          this.$store.state.vue_webrtc,
          "enableAudio",
          x.constraints.audio
        );
        this.$set(
          this.$store.state.vue_webrtc,
          "enableVideo",
          x.constraints.video
        );
        this.$set(
          this.$store.state.vue_webrtc,
          "otherShareScreen",
          x.constraints.shareScreen
        );
        this.$set(this.$store.state.vue_webrtc, "roomId_request", x.roomId);
      }
    },
    // Admin Sockets
    admin_openUserScreen_rejected(reason) {
      this.showError(reason);
    }
    //
  }
};
</script>

<style scoped>
.sticky {
  position: fixed;
  bottom: 0;
  background-color: red !important;
}
.sticky.alert {
  opacity: 0.5;
  transition: 0.3s;
  transform: translateX(0);
  cursor: pointer;
}
.sticky.alert:hover {
  opacity: 1;
}
.sticky.fade {
  transform: translateX(-430px);
}
</style>
