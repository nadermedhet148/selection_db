<template>
  <div>
    <!-- <v-row v-if="false">
      <v-col>
        <v-data-table
          :loading="noncoms.loading"
          :items="noncoms.items"
          :headers="noncoms.headers"
          fixed-header
          hide-default-header
        >
          <template v-slot:header="table">
            <table-header-filters
              :items="noncoms.items"
              :table="table"
              :filters.sync="noncoms.tableFilters"
            ></table-header-filters>
          </template>
          <template v-slot:footer="table">
            <table-footer-filters
              :filters.sync="noncoms.tableFilters"
              :table="table"
            ></table-footer-filters>
          </template>
        </v-data-table>
      </v-col>
    </v-row> -->

    <!-- <v-row v-if="$store.getters.isFullApp">
      <template v-for="(s, key, i) in sections">
        <v-col
          :key="i"
          cols="6"
          v-if="s.section == $store.state.currentUser.section || isAdmin()"
        >
          <v-layout
            align-center
            align-content-center
            justify-center
            fill-height
          >
            <v-card
              :to="`/home_counters/${s.section}`"
              :loading="s.loading"
              width="350"
              height="300"
              class="text-center mb-1"
            >
              <v-layout
                align-center
                align-content-center
                justify-center
                fill-height
              >
                <div>
                  <v-card-text>
                    <v-avatar
                      :color="
                        $vuetify.theme.dark ? 'grey darken-3' : 'blue lighten-5'
                      "
                      size="220"
                    >
                      <div>
                        <div class="mb-2 mt-4">
                          <span class="text-h5 primary--text">
                            {{ s.counter }}
                          </span>
                        </div>
                        <div>
                          <v-card-title
                            class="d-block break-word"
                            v-text="s.title"
                          ></v-card-title>
                          <v-card-subtitle
                            class="pt-1"
                            v-text="s.desc"
                          ></v-card-subtitle>
                        </div>
                      </div>
                    </v-avatar>
                  </v-card-text>
                </div>
              </v-layout>
            </v-card>
          </v-layout>
        </v-col>
      </template>
    </v-row> -->
    <!-- <v-row v-else>
      
    </v-row> -->
  </div>
</template>

<script>
export default {
  name: "home",
  components: {},
  mounted() {
    this.$nextTick(() => {
      let intVal = setInterval(() => {
        this.getCounters();
        clearInterval(intVal);
      }, 1000);
    });
    // this.getNoncoms();
  },
  data: () => ({
    noncoms: {
      degrees: {
        2: 1, // جندي
        13: 2, // طالب
        3: 3, // عريف
        8: 4, // رقيب
        17: 5, // رقيب أول
        21: 6, // مساعد
        23: 7, // مساعد أول
        11: 8, // ملازم
        12: 9, // ملازم أول
        6: 10, // نقيب
        5: 11, // رائد
        1: 12 // مقدم
      },
      loading: false,
      items: [],
      tableFilters: {},
      headers: [
        {
          text: "الرقم العسكري",
          value: "militaryId"
        },
        {
          text: "الدرجة",
          value: "webDegreeText"
        },
        {
          text: "الإسم",
          value: "fullName"
        },
        {
          text: "الوحدة",
          value: "unitText"
        },
        {
          text: "تاريخ التطوع",
          value: "conscriptionDate"
        }
      ]
    },
    sections: {
      // tasgeel: {
      //   title: "قسم التسجيل",
      //   // desc: "مواقف قسم التسجيل",
      //   counter: 0,
      //   loading: false,
      //   section: 1
      // },
      fugitive: {
        title: "قسم الهروب",
        // desc: "الهروب أكثر من عام بدون استلام",
        counter: 0,
        loading: false,
        section: 4
      },
      enhaa: {
        title: "قسم الإنهاء",
        // desc: "مواقف قسم الإنهاء",
        counter: 0,
        loading: false,
        section: 3
      },
      e7tyat: {
        title: "قسم الإحتياط",
        // desc: "مواقف التسريح المعلقة",
        counter: 0,
        loading: false,
        section: 2
      }
    }
  }),
  methods: {
    getNoncoms() {
      this.api("global/get_all", {
        table: "conscriptes",
        attrs: [
          "militaryId",
          "fullName",
          "conscriptionDate",
          "webConscriptionDate"
        ],
        where: {
          webAt: {
            $gte: "2021-01-15"
          },
          typeId: 2
        },
        include: [
          {
            model: "degrees"
          },
          {
            model: "units"
          },
          {
            model: "webPromotions",
            include: [
              {
                model: "webDegrees"
              }
            ]
          }
        ]
      })
        .then(x => {
          let _items = x.data.slice(0, 100),
            items = _items.filter(f => f.militaryId.substring(6, 8) == "52");
          items.forEach((item, i) => {
            item.unitText = item.unit ? item.unit.unitText : "";
            item.conscriptionDate = item.webConscriptionDate
              ? item.webConscriptionDate
              : item.conscriptionDate;
            item.conscriptionDate = this.fixDate(item.conscriptionDate);
            let promos = item.webPromotions;
            if (promos.length > 0) {
              let newPromos = [];
              promos.forEach(promo => {
                if (promo.webDegree) {
                  let pid = this.noncoms.degrees[promo.webDegree.id];
                  if (pid) {
                    promo.webDegree.id = pid;
                    newPromos.push(promo.webDegree);
                  }
                }
              });
              if (newPromos.length > 0) {
                newPromos.sort((a, b) => a.id - b.id);
                let lastPromo = newPromos[newPromos.length - 1];
                item.webDegreeText = lastPromo.displayedText;
              } else {
                item.webDegreeText = item.degree
                  ? item.degree.degreeType
                  : "incorrect";
              }
            } else {
              item.webDegreeText = item.degree ? item.degree.degreeType : "";
            }
          });
          this.$set(this.noncoms, "items", items);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$set(this.noncoms, "loading", false);
        });
    },
    async getCounters() {
      console.log("Getting Counters...");
      this.$set(this.sections.fugitive, "loading", true);
      // this.$set(this.sections.tasgeel, "loading", true);
      this.$set(this.sections.enhaa, "loading", true);
      this.$set(this.sections.e7tyat, "loading", true);
      let now = new Date(),
        pastYear = new Date(new Date(now).setFullYear(now.getFullYear() - 1)),
        past13Years = new Date(
          new Date(now).setFullYear(now.getFullYear() - 13)
        ),
        past1Month = new Date(new Date(now).setMonth(now.getMonth() - 1)),
        past3Months = new Date(new Date(now).setMonth(now.getMonth() - 3)),
        next1Month = new Date(new Date(now).setMonth(now.getMonth() + 1)),
        next6Months = new Date(new Date(now).setMonth(now.getMonth() + 6)),
        fugitiveCounter = await this.api("global/count", {
          table: "fugitives",
          where: {
            returnDate: {
              $is: null
            },
            s1ReceptionDate: {
              $is: null
            },
            s1ExecutionCommiteeDate: {
              $is: null
            },
            isNonCommissioned: false,
            absenceDate: {
              $between: [past13Years, pastYear]
            }
          }
        });
      console.log("Fugitive:");
      console.log(fugitiveCounter.data);
      this.$set(this.sections.fugitive, "counter", fugitiveCounter.data);
      this.$set(this.sections.fugitive, "loading", false);
      let enhaaCounter = await this.api("global/get_all", {
        table: "conscriptes",
        where: {
          stateIdCurrent: {
            $gte: 1
          },
          $and: {
            $or: [
              // {
              //   "$medicalCommittees.comitDecisionId$": 2
              // },
              {
                /**
                 * كان عندنا جدول اسمه DutyStates
                 * خانة اسمها "لم يدرج" يعني سبب إنهاء الشخص دا مش موجود في المنظومة
                 * فـ مسحنا الخانة دي وحطينا isLamYodraj
                 * عشان نقدر نخلي مكتب الإنهاء يشتغل على الناس دي ويشوف ايه سبب إنهائهم
                 * بمجرد ما يخلص الناس اللي واخدة الـ property دي
                 * هنمسحها من الداتابيز
                 */
                isLamYodraj: true,
                stateId: null
              },
              {
                stateIdCurrent: 1,
                typeId: 1,
                "$courts.CourtConfermation$": {
                  $or: {
                    $not: 2,
                    $is: null
                  }
                },
                $and: [
                  {
                    $or: [
                      {
                        "$courts.ContDuty$": false
                      },
                      {
                        "$courts.ContDuty$": {
                          $is: null
                        }
                      }
                    ]
                  },
                  {
                    $or: [
                      {
                        "$courts.P_Year$": {
                          $gte: 1
                        }
                      },
                      {
                        "$courts.P_Year$": 1,
                        $and: [
                          {
                            $or: [
                              {
                                "$courts.P_Month$": {
                                  $gt: 0
                                }
                              },
                              {
                                "$courts.P_Day$": {
                                  $gte: 0
                                }
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                stateIdCurrent: 1,
                stateId: 129
              },
              // or
              // من اول هنا الجدول التاني
              {
                stateIdCurrent: 1,
                typeId: 2,
                "$courts.CourtConfermation$": {
                  $or: {
                    $not: 2,
                    $is: null
                  }
                },
                // الجزد دا بتاع الجدول التاني جوه
                // الهو :يقوم بعرض من هو بالخدمة من  لديه محكمة أكثر من 6 أشهر
                $and: [
                  {
                    $or: [
                      {
                        "$courts.ContDuty$": false
                      },
                      {
                        "$courts.ContDuty$": {
                          $is: null
                        }
                      }
                    ]
                  },

                  {
                    $or: [
                      {
                        "$courts.P_Month$": {
                          $gte: 6
                        }
                      },
                      {
                        "$courts.P_Month$": {
                          $lte: 6
                        },
                        "$courts.P_Year$": {
                          $gte: 1
                        },
                        "$courts.P_Day$": {
                          $gte: 0
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        },
        include: [
          {
            model: "medicalCommittees",
            required: false
          },
          {
            model: "courts",
            required: false
          }
        ]
      });
      console.log("Enhaa:");
      let count = 0;
      enhaaCounter.data.forEach(element => {
        console.log("====================================");
        console.log(element);
        count = count + 1;
        console.log("====================================");
      });
      // func count in sequlize count 1 more
      // than the real len so i created my own count till figure out why .
      this.$set(this.sections.enhaa, "counter", count);
      this.$set(this.sections.enhaa, "loading", false);
      // // Done
      // let tasgeelCounter = await this.api("global/homepage/tasgeel");
      // console.log("Tasgeel:");
      // console.log(tasgeelCounter.data);
      // this.$set(this.sections.tasgeel, "counter", tasgeelCounter.data);
      // this.$set(this.sections.tasgeel, "loading", false);
      let e7tyatCounter = await this.api("global/count", {
        table: "conscriptes",
        where: {
          typeId: 1,

          $or: [
            {
              // تم نقله على الإحتياط ولديه إصابة أو محكمة متابعة
              demobilizationDate: {
                $lte: now
                // $and: {
                //   $gte: new Date("2020-01-01"),
                // }
              },
              stateId: 105,
              $and: {
                $or: [
                  {
                    "$injuries.InjuryId$": {
                      $not: null
                    },
                    "$injuries.HealingReportId$": {
                      $is: null
                    }
                  },
                  {
                    "$courts.NotFollowingEhtyat$": false,
                    "$courts.Judgment$": {
                      $is: null
                    }
                  }
                ]
              }
            },
            {
              // له إصابة متابعة أو مجلس طبي متابع, ولا يزال بالخدمة ومتبقي على تسريحه أقل من 6 أشهر
              demobilizationDate: {
                // قبل تسريحه بـ 6 شهور
                $between: [now, next6Months]
                // $and: {
                //   $gte: new Date("2020-01-01"),
                // }
              },
              $and: [
                {
                  $or: [
                    {
                      stateId: 101
                    },
                    {
                      stateIdCurrent: 1
                    }
                  ]
                },
                {
                  $or: [
                    {
                      // ليس له تقرير شفاء نهائي
                      "$injuries.InjuryId$": {
                        $not: null
                      },
                      "$injuries.HealingReportId$": {
                        $or: {
                          $is: null,
                          $eq: 2
                        }
                      }
                    },
                    {
                      ignorantId: 1,
                      qualificationId: 0
                    }
                  ]
                }
              ]
            }
          ]

          // Old-new conditions
          // typeId: 1,
          // demobilizationDate: {
          //   $gte: new Date("2020-01-01")
          // },
          // $and: {
          //   $or: [
          //     {
          //       demobilizationDate: {
          //         $lte: now
          //       },
          //       stateId: 105,
          //       $and: {
          //         $or: [
          //           {
          //             "$injuries.InjuryId$": {
          //               $not: null
          //             },
          //             "$injuries.HealingReportId$": {
          //               $is: null
          //             }
          //           },
          //           {
          //             "$courts.NotFollowingEhtyat$": false,
          //             "$courts.Judgment$": {
          //               $is: null
          //             }
          //           }
          //         ]
          //       }
          //     },
          //     {
          //       "$injuries.InjuryId$": {
          //         $not: null
          //       },
          //       "$injuries.HealingReportId$": {
          //         $or: {
          //           $is: null,
          //           $eq: 2
          //         }
          //       }, // ليس له تقرير شفاء نهائي
          //       demobilizationDate: {
          //         // قبل تسريحه بـ 6 شهور
          //         $between: [now, next6Months]
          //       },
          //       $and: {
          //         $or: [
          //           {
          //             stateId: 101
          //           },
          //           {
          //             stateIdCurrent: 1
          //           }
          //         ]
          //       }
          //     },
          //     {
          //       qualificationId: 0,
          //       ignorantId: 1,
          //       conscriptionDate: {
          //         // بعد تجنيده بـ 3 شهور
          //         $gte: past3Months
          //       },
          //       $and: {
          //         $or: [
          //           {
          //             stateId: 101
          //           },
          //           {
          //             stateIdCurrent: 1
          //           }
          //         ]
          //       }
          //     },
          //     {
          //       degreeId: {
          //         $in: [2, 3]
          //       },
          //       demobilizationDate: {
          //         $lte: now
          //       },
          //       $and: {
          //         $or: [
          //           {
          //             stateId: 101
          //           },
          //           {
          //             stateIdCurrent: 1
          //           }
          //         ]
          //       }
          //     }
          //     // Old conditions
          //     // {
          //     //   typeId: 1,
          //     //   stateIdCurrent: 1,
          //     //   demobilizationDate: {
          //     //     $lt: new Date()
          //     //   },
          //     //   $or: [
          //     //     {
          //     //       "$courts.NotFollowingEhtyat$": false
          //     //     },
          //     //     {
          //     //       "$courts.CourtId$": null
          //     //     }
          //     //   ]
          //     // },
          //     // {
          //     //   stateIdCurrent: 1,
          //     //   demobilizationDate: {
          //     //     $and: {
          //     //       $gt: new Date(),
          //     //       $lte: next1Month
          //     //     }
          //     //   },
          //     //   $or: [
          //     //     {
          //     //       "$courts.NotFollowingEhtyat$": false
          //     //     },
          //     //     {
          //     //       "$courts.CourtId$": null
          //     //     }
          //     //   ],
          //     //   typeId: 1,
          //     //   $or: [
          //     //     {
          //     //       "$courts.CourtId$": null
          //     //     },
          //     //     {
          //     //       "$courts.P_Year$": {
          //     //         $gt: 1
          //     //       }
          //     //     },
          //     //     {
          //     //       "$courts.P_Year$": 1,
          //     //       $or: {
          //     //         "$courts.P_Month$": {
          //     //           $gt: 0
          //     //         },
          //     //         "$courts.P_Day$": {
          //     //           $gt: 0
          //     //         }
          //     //       }
          //     //     }
          //     //   ]
          //     // }
          //   ]
          // }
        },
        include: [
          {
            model: "courts",
            required: false
          },
          {
            model: "injuries",
            required: false
          },
          {
            model: "ignorants",
            required: false
          }
        ]
      });
      console.log("E7tyat:");
      console.log(e7tyatCounter.data);
      this.$set(this.sections.e7tyat, "counter", e7tyatCounter.data);
      this.$set(this.sections.e7tyat, "loading", false);
    }
  },
  sockets: {}
};
</script>
