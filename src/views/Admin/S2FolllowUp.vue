<template>
  <div>
    <template v-for="(type, i) in conscripteTypes">
      <v-card class="mb-6" :key="i">
        <v-card-title>
          {{ type.title }}
          <v-spacer></v-spacer>
          <printer-menu
            :disabled="
              results &&
              results.filter(
                f => f.conscripteType == type.name && f.chipType == type.model
              ).length > 0
                ? false
                : true
            "
            :data="{
              cons: results
                ? results.filter(
                    f =>
                      f.conscripteType == type.name && f.chipType == type.model
                  )
                : [],
              excelKey: 'cons',
              excelHeaders:
                chipTypes && chipTypes[type.model]
                  ? [...chipTypes[type.model].db, ...otherKeys]
                  : []
            }"
            :fab="false"
          ></printer-menu>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-btn-toggle
            active-class="primary white--text"
            mandatory
            v-model="type.model"
            column
            center-active
            style="display: inline-block"
          >
            <template v-for="(val, key, ii) in chipTypes">
              <v-btn class="my-1" :value="key" :key="ii">
                {{ val.title }}
                <!-- 2020-09-15 22:39:10.997 -->
                <v-chip
                  :color="
                    type.model == key
                      ? 'white black--text'
                      : results &&
                        results.filter(
                          f =>
                            f.conscripteType == type.name && f.chipType == key
                        ) &&
                        results.filter(
                          f =>
                            f.conscripteType == type.name && f.chipType == key
                        ).length > 0
                      ? results.filter(
                          f =>
                            f.conscripteType == type.name &&
                            f.chipType == key &&
                            !f.endDate
                        ).length > 0
                        ? 'error'
                        : 'success'
                      : ''
                  "
                  class="ms-2"
                  v-text="
                    results &&
                    results.filter(
                      f => f.conscripteType == type.name && f.chipType == key
                    )
                      ? results.filter(
                          f =>
                            f.conscripteType == type.name && f.chipType == key
                        ).length
                      : '0'
                  "
                >
                </v-chip>
              </v-btn>
            </template>
          </v-btn-toggle>
        </v-card-text>
        <v-divider></v-divider>
        <!-- <v-text-field
          dense
          prepend-inner-icon="mdi-magnify"
          filled
          v-model.lazy="type.search"
        >
        </v-text-field> -->
        <v-data-table
          :headers="
            chipTypes && chipTypes[type.model]
              ? [...chipTypes[type.model].db, ...otherKeys]
              : []
          "
          :items="
            results
              ? results.filter(
                  f => f.conscripteType == type.name && f.chipType == type.model
                )
              : []
          "
          v-model="type.selected"
          item-key="id"
          :search.sync="type.search"
          multi-sort
          hide-default-header
        >
          <template v-slot:header="table">
            <table-header-filters
              :conditionKey="'conscripteType'"
              :conditionValue="type.name"
              :items="
                results
                  ? results.filter(
                      f =>
                        f.conscripteType == type.name &&
                        f.chipType == type.model
                    )
                  : []
              "
              :table="table"
              :filters.sync="type.filters"
            ></table-header-filters>
          </template>
          <template v-slot:footer="table">
            <table-footer-filters
              :conditionKey="'conscripteType'"
              :conditionValue="type.name"
              :filters.sync="type.filters"
              :table="table"
            ></table-footer-filters>
          </template>
          <template v-slot:item.militaryId="{ item }">
            <v-chip
              color="transparent"
              :to="`/soldiers_plus/${item.militaryId}`"
              @click.right="copyText(item.militaryId)"
            >
              {{ item.militaryId }}
            </v-chip>
          </template>
          <template v-slot:item.fullName="{ item }">
            <v-chip color="transparent" @click.right="copyText(item.fullName)">
              {{ item.fullName }}
            </v-chip>
          </template>
          <template v-slot:item.startDate="{ item }">
            <v-tooltip top color="black">
              <template v-slot:activator="{ on }">
                <v-chip v-on="on" outlined>
                  {{ item.startDate | moment("from", "now") }}
                </v-chip>
              </template>
              {{ item.startDate }}
            </v-tooltip>
          </template>
          <template v-slot:item.endDate="{ item }">
            <v-tooltip v-if="item.endDate" top color="black">
              <template v-slot:activator="{ on }">
                <v-chip color="success" v-on="on">
                  {{ item.endDate | moment("from", "now") }}
                </v-chip>
              </template>
              {{ item.endDate }}
            </v-tooltip>
            <v-chip v-else color="error">
              لا
            </v-chip>
          </template>
        </v-data-table>
      </v-card>
    </template>
  </div>
</template>

<script>
export default {
  name: "s2-follow-up",
  mounted() {
    this.updateTables();
  },
  data: () => ({
    componentName: "s2followup",
    loading: false,
    results: [],
    model: true,
    otherKeys: [
      {
        text: "منذ متى؟",
        value: "startDate",
        sortable: true
      },
      {
        text: "انتهى؟",
        value: "endDate",
        sortable: true
      }
    ],
    conscripteTypes: [
      {
        title: "المجندين",
        name: "مجند",
        id: "2",
        model: "",
        search: "",
        selected: [],
        filters: {}
      },
      {
        title: "الراتب العالي",
        name: "راتب عالي",
        id: "1",
        model: "",
        search: "",
        selected: [],
        filters: {}
      }
    ],
    chipTypes: {
      okobat: {
        title: "عقوبات",
        db: [
          {
            text: "الرقم العسكري",
            value: "militaryId",
            sortable: true
          },
          {
            text: "الدرجة",
            value: "degree",
            sortable: true
          },
          {
            text: "الإسم",
            value: "fullName",
            sortable: true
          },
          {
            text: "الوحدة",
            value: "unit",
            sortable: true
          },
          {
            text: "رقم الوثيقة",
            value: "cardNumber",
            sortable: true
          },
          {
            text: "تاريخ الوثيقة",
            value: "cardDate",
            sortable: true
          }
        ],
        vals: []
      },
      tarakyAzl: {
        title: "ترقي / عزل",
        db: [
          {
            text: "الرقم العسكري",
            value: "militaryId",
            sortable: true
          },
          {
            text: "الدرجة",
            value: "degree",
            sortable: true
          },
          {
            text: "الإسم",
            value: "fullName",
            sortable: true
          },
          {
            text: "الوحدة",
            value: "unit",
            sortable: true
          },
          {
            text: "السلاح",
            value: "force",
            sortable: true
          },
          {
            text: "ترقي / عزل",
            value: "promotionType",
            sortable: true
          }
        ],
        vals: []
      },
      travelReturn: {
        title: "السفر والمأموريات",
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
        title: "التأهيل",
        db: [
          {
            text: "الرقم العسكري",
            value: "militaryId",
            sortable: true
          },
          {
            text: "الدرجة",
            value: "degree",
            sortable: true
          },
          {
            text: "الإسم",
            value: "fullName",
            sortable: true
          },
          {
            text: "من تاريخ",
            value: "fromDate",
            sortable: true
          },
          {
            text: "الى تاريخ",
            value: "toDate",
            sortable: true
          },
          {
            text: "التقدير",
            value: "qualificationDegree",
            sortable: true
          }
        ],
        vals: []
      },
      moaml: {
        title: "تعديل المعاملة التجنيدية",
        db: [
          {
            text: "الرقم العسكري",
            value: "militaryId",
            sortable: true
          },
          {
            text: "الدرجة",
            value: "degree",
            sortable: true
          },
          {
            text: "الإسم",
            value: "fullName",
            sortable: true
          },
          {
            text: "رقم القرار",
            value: "orderNumber",
            sortable: true
          },
          {
            text: "تاريخ القرار",
            value: "orderDate",
            sortable: true
          },
          {
            text: "المعاملة الجديدة",
            value: "newType",
            sortable: true
          }
        ],
        vals: []
      },
      reduction: {
        title: "مدة التخفيض",
        db: [
          {
            text: "الرقم العسكري",
            value: "militaryId",
            sortable: true
          },
          {
            text: "الدرجة",
            value: "degree",
            sortable: true
          },
          {
            text: "الإسم",
            value: "fullName",
            sortable: true
          },
          {
            text: "مدة التخفيض",
            value: "reductionPeriod",
            sortable: true
          },
          {
            text: "تاريخ التخفيض",
            value: "orderDate",
            sortable: true
          },
          {
            text: "التخصص",
            value: "specialism",
            sortable: true
          }
        ],
        vals: []
      },
      horob: {
        title: "الهروب",
        db: [
          {
            text: "الرقم العسكري",
            value: "militaryId",
            sortable: true
          },
          {
            text: "الدرجة",
            value: "degree",
            sortable: true
          },
          {
            text: "الإسم",
            value: "fullName",
            sortable: true
          },
          {
            text: "تاريخ الغياب",
            value: "absenceDate",
            sortable: true
          },
          {
            text: "تاريخ وصول اخطار الهروب",
            value: "fugitiveNoticeDate",
            sortable: true
          },
          {
            text: "ملاحظات",
            value: "notes",
            sortable: true
          }
        ],
        vals: []
      },
      awda: {
        title: "العودة",
        db: [
          {
            text: "الرقم العسكري",
            value: "militaryId",
            sortable: true
          },
          {
            text: "الدرجة",
            value: "degree",
            sortable: true
          },
          {
            text: "الإسم",
            value: "fullName",
            sortable: true
          },
          {
            text: "تاريخ العودة",
            value: "returnDate",
            sortable: true
          },
          {
            text: "تاريخ اخطار العودة	",
            value: "returnNoticeDate",
            sortable: true
          },
          {
            text: "ملاحظات",
            value: "notes",
            sortable: true
          }
        ],
        vals: []
      },
      lic: {
        title: "رخص قيادة",
        db: [
          {
            text: "الرقم العسكري",
            value: "militaryId",
            sortable: true
          },
          {
            text: "الدرجة",
            value: "degree",
            sortable: true
          },
          {
            text: "الإسم",
            value: "fullName",
            sortable: true
          },
          {
            text: "رقم الرخصة الأولى",
            value: "firstLicenceNumber",
            sortable: true
          },
          {
            text: "تاريخ الرخصة الأولى",
            value: "firstLicenceDate",
            sortable: true
          },
          {
            text: "رقم الرخصة الثانية",
            value: "secondLicenceNumber",
            sortable: true
          },
          {
            text: "تاريخ الرخصة الثانية",
            value: "secondLicenceDate",
            sortable: true
          },
          {
            text: "تاريخ آخر كومسيون طبي",
            value: "lastComsionDate",
            sortable: true
          }
        ],
        vals: []
      },
      omia: {
        title: "بيانات المؤهل",
        db: [
          {
            text: "الرقم العسكري",
            value: "militaryId",
            sortable: true
          },
          {
            text: "الدرجة",
            value: "degree",
            sortable: true
          },
          {
            text: "الإسم",
            value: "fullName",
            sortable: true
          },
          {
            text: "المؤهل",
            value: "qualification",
            sortable: true
          },
          {
            text: "رقم الجلوس",
            value: "seatNumber",
            sortable: true
          },
          {
            text: "التقدير",
            value: "qualificationDegree",
            sortable: true
          },
          {
            text: "المحافظة",
            value: "governorate",
            sortable: true
          },
          {
            text: "المركز",
            value: "markaz",
            sortable: true
          }
        ],
        vals: []
      },
      omiaTacer: {
        title: "دورات محو الأمية",
        db: [
          {
            text: "الرقم العسكري",
            value: "militaryId",
            sortable: true
          },
          {
            text: "الدرجة",
            value: "degree",
            sortable: true
          },
          {
            text: "الإسم",
            value: "fullName",
            sortable: true
          },
          {
            text: "من تاريخ",
            value: "fromDate",
            sortable: true
          },
          {
            text: "الى تاريخ",
            value: "toDate",
            sortable: true
          },
          {
            text: "التقدير",
            value: "ignorantDegree",
            sortable: true
          },
          {
            text: "الملاجظات",
            value: "notes",
            sortable: true
          }
        ],
        vals: []
      }
    }
  }),
  methods: {
    updateTables() {
      this.$set(this, "loading", true);
      this.api("global/get_all", {
        table: "webChipsFollowups",
        where: {
          $or: [
            {
              isDone: false
            },
            {
              isDone: {
                $is: null
              }
            }
          ]
        }
      })
        .then(x => {
          let dates = [
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
            items = this.fixDates(x.data, dates);
          items.sort((a, b) => {
            let dateA = new Date(a.endDate ? a.endDate : "01-01-2250");
            let dateB = new Date(b.endDate ? b.endDate : "01-01-1900");
            return dateB - dateA;
          });
          this.$set(this, "results", items);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$set(this, "loading", false);
        });
    }
  },
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  }
};
</script>
