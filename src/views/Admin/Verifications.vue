<template>
  <div>
    <v-card>
      <v-card-title>
        خيارات البحث
        <v-spacer></v-spacer>
        <v-btn
          :disabled="
            Object.values(search).filter(
              v =>
                (Array.isArray(v) && v.length > 0) ||
                (!Array.isArray(v) && v && v !== true) ||
                (!Array.isArray(v) && v === 0)
            ).length == 0
          "
          color="primary"
          class="px-4"
          @click="searchModifications()"
          large
        >
          <v-icon class="me-3">mdi-magnify</v-icon>
          بحث
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <template v-for="(option, i) in options">
            <v-col :key="i" cols="12" md="6" lg="4" xl="3">
              <v-text-field
                v-if="option.type == 'text'"
                :label="option.label"
                :hint="option.hint"
                v-model="search[option.model]"
                filled
                :hide-details="option.hint ? false : true"
                :persistent-hint="option.hint ? true : false"
                :loading="option.loading"
                clearable
                @keypress.enter="
                  Object.values(search).filter(
                    v =>
                      (Array.isArray(v) && v.length > 0) ||
                      (!Array.isArray(v) && v && v !== true) ||
                      (!Array.isArray(v) && v === 0)
                  ).length == 0
                    ? () => {}
                    : searchModifications()
                "
              ></v-text-field>
              <v-autocomplete
                v-if="option.type == 'select'"
                :label="option.label"
                :hint="option.hint"
                v-model="search[option.model]"
                :items="selects[option.model].data"
                :item-value="selects[option.model].value"
                :item-text="selects[option.model].text"
                filled
                :error-messages="selects[option.model].error"
                :hide-details="option.hint ? false : true"
                :persistent-hint="option.hint ? true : false"
                :loading="selects[option.model].loading || option.loading"
                clearable
              ></v-autocomplete>
              <v-text-field
                v-else-if="option.type == 'date'"
                v-model="search[option.model]"
                :hint="option.hint"
                :persistent-hint="option.hint ? true : false"
                :hide-details="option.hint ? false : true"
                :label="option.label"
                type="date"
                :error-messages="option.error"
                filled
                :clearable="!option.disabled"
              >
              </v-text-field>
              <!-- <v-dialog
                v-else-if="option.type == 'date'"
                :ref="`${option.model}`"
                v-model="dialogs[`${option.model}`]"
                :return-value.sync="search[option.model]"
                width="300px"
                :disabled="option.readonly"
                persistent
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="search[option.model]"
                    :prepend-inner-icon="option.icon"
                    :hint="option.hint"
                    :persistent-hint="option.hint ? true : false"
                    :hide-details="option.hint ? false : true"
                    :label="option.label"
                    readonly
                    :error-messages="option.error"
                    filled
                    v-on="on"
                    :clearable="!option.disabled"
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  :ref="`${option.model}_picker`"
                  v-model="search[option.model]"
                  scrollable
                  color="primary"
                  :range="option.range"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    outlined
                    class="px-6 text-capitalize"
                    @click="dialogs[`${option.model}`] = false"
                    >إلغاء</v-btn
                  >
                  <v-btn
                    color="primary"
                    class="px-6 text-capitalize"
                    @click="
                      $refs[`${option.model}`][0].save(search[option.model])
                    "
                    >حفظ</v-btn
                  >
                </v-date-picker>
              </v-dialog> -->
            </v-col>
          </template>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mt-6">
      <v-card-title>
        النتائج
        <v-spacer></v-spacer>
      </v-card-title>
      <v-divider></v-divider>
      <!-- <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model.lazy="result.search"
        filled
        dense
      ></v-text-field> -->
      <v-data-table
        :headers="result.headers"
        :items="result.items"
        :loading="result.loading"
        v-model="result.selected"
        item-key="id"
        :search.sync="result.search"
        fixed-header
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="result.items"
            :table="table"
            :filters.sync="tableFilters"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFilters"
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
          <v-chip
            color="transparent"
            :to="`/soldiers_plus/${item.militaryId}`"
            @click.right="copyText(item.fullName)"
          >
            {{ item.fullName }}
          </v-chip>
        </template>
        <template v-slot:item.isVerified="{ item }">
          <v-btn
            :color="item.isVerified ? 'primary' : 'default'"
            @click="changeisVerified(item.id, !item.isVerified)"
            v-text="'تمت'"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "admin-verifications",
  mounted() {
    this.fillKeys();
    this.fillHeaders();
    this.init();
    this.initFormTypes();
  },
  data: () => ({
    tableFilters: {},
    search: {},
    dialogs: {},
    options: [
      {
        type: "text",
        model: "militaryId",
        label: "الرقم العسكري",
        hint: "",
        icon: ""
      },
      {
        type: "text",
        model: "fullName",
        label: "الإسم",
        hint: "",
        icon: ""
      },
      {
        type: "select",
        model: "unit",
        label: "الوحدة",
        hint: "",
        icon: ""
      },
      {
        type: "select",
        model: "changeType",
        label: "نوع التعديل",
        hint: "",
        icon: ""
      },
      {
        type: "select",
        model: "form",
        label: "البيان",
        hint: "",
        icon: ""
      },
      {
        type: "select",
        model: "modifiedBy",
        label: "المسجل",
        hint: "",
        icon: ""
      },
      {
        type: "date",
        model: "dateFrom",
        label: "التاريخ ( من )",
        hint: "",
        icon: ""
      },
      {
        type: "date",
        model: "dateTo",
        label: "التاريخ ( الى )",
        hint: "",
        icon: ""
      }
    ],
    result: {
      items: [],
      selected: [],
      search: "",
      headers: []
    },
    selects: {
      unit: {
        table: "units",
        value: "unitText",
        text: "unitText"
      },
      modifiedBy: {
        table: "users",
        value: "username",
        text: "realName"
      },
      changeType: {
        value: "text",
        text: "text",
        data: [
          {
            value: 8,
            text: "حذف"
          },
          {
            value: 4,
            text: "إضافة"
          },
          {
            value: 16,
            text: "تعديل"
          }
        ]
      },
      form: {
        value: "text",
        text: "text",
        data: []
      }
    }
  }),
  methods: {
    changeisVerified(id, isVerified) {
      this.api("global/update_one", {
        table: "modifications",
        where: {
          id
        },
        update: {
          isVerified
        }
      })
        .then(x => {
          console.log(x);
          this.result.items.find(r => r.id == id).isVerified = isVerified;
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء تعديل المراجعة.");
        });
    },
    fillHeaders() {
      let headers = {
          date: "تاريخ التعديل",
          militaryId: "الرقم العسكري",
          fullName: "الإسم",
          unit: "الوحدة",
          state: "حالة الفرد",
          changeType: "نوع التعديل",
          form: "البيان",
          modifiedBy: "المسجل",
          isVerified: "تمت المراجعة"
        },
        arr = [];
      Object.keys(headers).forEach(header => {
        let text = headers[header],
          obj = {
            text,
            value: header,
            sortable: true
          };
        arr.push(obj);
      });
      this.$set(this.result, "headers", arr);
    },
    searchModifications() {
      this.$set(this.result, "loading", true);
      let where = {};
      console.log(this.search);
      Object.keys(this.search).forEach(key => {
        let v = this.search[key];
        if (
          ((Array.isArray(v) && v.length > 0) ||
            (!Array.isArray(v) && v && v !== true) ||
            (!Array.isArray(v) && v === 0)) &&
          !["dateFrom", "dateTo"].includes(key)
        ) {
          if (["militaryId", "fullName", "form"].includes(key)) {
            where[key] = {
              $like: `${v}%`
            };
          } else {
            where[key] = v;
          }
        }
      });
      let dateFrom = this.search.dateFrom,
        dateTo = this.search.dateTo,
        date =
          dateFrom || dateTo
            ? {
                $between: [
                  dateFrom && dateFrom.length > 0
                    ? new Date(dateFrom)
                    : new Date(),
                  dateTo && dateTo.length > 0 ? new Date(dateTo) : new Date()
                ]
              }
            : null;
      if (date) {
        where.date = date;
      }
      // console.log(where);
      this.api("global/get_all", {
        table: "modifications",
        where
      })
        .then(x => {
          this.$set(this.result, "items", this.fixDates(x.data, ["date"]));
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء تحميل بيانات المراجعة والتصديق.");
          console.log(error);
        })
        .finally(() => {
          this.$set(this.result, "loading", false);
        });
    },
    fillKeys() {
      let options = this.options;
      options.forEach(option => {
        if (option.multiple) {
          this.$set(this.search, option.model, []);
        }
      });
    },
    init() {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table } = this.selects[key];
        if (table) {
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", {
            table
          })
            .then(x => {
              this.$set(this.selects[key], "data", x.data);
            })
            .catch(error => {
              console.log(error);
              this.$set(
                this.selects[key],
                "error",
                "حدث خطأ أثناء استدعاء الداتا من قاعدة البيانات"
              );
            })
            .finally(() => {
              this.$set(this.selects[key], "loading", false);
            });
        }
      });
    },
    initFormTypes() {
      let types = [
          "الصفحة الشخصية للمنتهى خدمتهم", // /ended_duty_main_data - Enhaa/EndedDutyMainData
          "استلام الكارت 2س بقسم الهروب",
          "تسجيل عقوبة",
          "بيانات الهروب",
          "الحالات الاصابية والمرضية",
          "محو الاميه",
          "تحرك النموذج (25س)",
          "تسجيل العقوبات ومدد الفقد",
          "البيانات الاساسية",
          "شاشة تسجيل الشهداء",
          "خطابات انهاء الخدمة",
          "شاشة إنشاء كشوف الميكروفيلم",
          "مراجعة طبعة السجلات",
          "تجهيز بيانات دفعة النقل على الاحتياط",
          "مراجعة الطبعة مع الوحدات",
          "تحرك النموذج (1س) الاصل",
          "S25ReceptionSearch",
          "",
          "",
          "نقل مجمع الكارت (  2 س )",
          "اشارات انهاء الخدمة",
          "طباعة خطاب الواجب المدرب عليه",
          "تحقيقات ومحاكم",
          "حوادث ودوريات",
          "سجل الشطب والملاحظات"
        ],
        objs = [];
      types.forEach((type, i) => {
        if (type && type.length > 0) {
          let obj = {
            text: type
          };
          objs.push(obj);
        }
      });
      this.$set(this.selects.form, "data", objs);
    }
  }
};
</script>
