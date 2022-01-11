<template>
  <div>
    <v-card>
      <v-card-title>
        الوحدات
        <v-spacer></v-spacer>
        <v-btn icon @click="getUnits()">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
        <v-btn icon @click="editSomething(false, 'create', 'unit')">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <!-- <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model.lazy="result.units.search"
        filled
        dense
      ></v-text-field> -->
      <v-data-table
        :headers="result.units.headers"
        :items="result.units.items"
        v-model="result.units.selected"
        fixed-header
        :loading="result.units.loading"
        :search.sync="result.units.search"
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="result.units.items"
            :table="table"
            :filters.sync="tableFilters.units"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFilters.units"
            :table="table"
          ></table-footer-filters>
        </template>
        <template v-slot:item.isOld="{ item }">
          <div>
            <v-chip :color="item.isOld ? 'error' : ''">
              {{ item.isOld ? "قديمة" : "حديثة" }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.edit_me="{ item }">
          <div>
            <v-chip color="transparent">
              <v-btn
                icon
                color="primary"
                @click="editSomething(false, 'update', 'unit', item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                v-if="isAdmin()"
                color="error"
                @click="
                  (del.type = 'unit'),
                    (del.id = item.unitId),
                    (del.model = true)
                "
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </v-chip>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-card class="mt-6">
      <v-card-title>
        المناطق
        <v-spacer></v-spacer>
        <v-btn icon @click="getZones()">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
        <v-btn icon @click="editSomething(false, 'create', 'zone')">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <!-- <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model.lazy="result.zones.search"
        filled
        dense
      ></v-text-field> -->
      <v-data-table
        :headers="result.zones.headers"
        :items="result.zones.items"
        v-model="result.zones.selected"
        fixed-header
        :loading="result.zones.loading"
        :search.sync="result.zones.search"
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="result.zones.items"
            :table="table"
            :filters.sync="tableFilters.zones"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFilters.zones"
            :table="table"
          ></table-footer-filters>
        </template>
        <template v-slot:item.units_length="{ item }">
          <div>
            <v-chip color="transparent">
              {{ item.units.length }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.edit_me="{ item }">
          <div>
            <v-chip color="transparent">
              <v-btn
                icon
                color="primary"
                @click="editSomething(false, 'update', 'zone', item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                color="error"
                v-if="isAdmin()"
                @click="
                  (del.type = 'zone'),
                    (del.id = item.zoneId),
                    (del.model = true)
                "
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </v-chip>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <!-- Confirm Delete Dialog -->
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      persistent
      max-width="550"
      v-model="del.model"
    >
      <v-card :loading="del.loading" :disabled="del.loading">
        <v-card-title class="white--text error">
          حذف {{ del.type == "unit" ? "وحدة" : "منطقة" }}
          <v-spacer></v-spacer>
          <v-btn icon dark @click="del.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div>
            هل تريد بالتأكيد حذف
            {{ del.type == "unit" ? "الوحدة" : "المنطقة" }}؟
          </div>
          <div>
            <span class="error--text">
              لاحظ من فضلك :
            </span>
            في حال حذف وحدة أو منطقة سيحدث الآتي:
            <ul style="list-style-type: none">
              <li>
                - تحويل جميع الجنود وضباط الصف المرتبطين بهذه الوحدة أو المنطقة
                الى مستجدين.
              </li>
              <li>
                - تحويل جميع الوحدات المرتبطة بالمنطقة الى مركز تدريب.
              </li>
              <li>
                - تحويل جميع المتابعات (منظومة المتابعة) المرتبطة بالوحدة أو
                المنطقة الى مركز تدريب
              </li>
            </ul>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            outlined
            @click="del.model = false"
            v-text="'عودة'"
            large
            class="px-6"
          ></v-btn>
          <v-btn
            color="error"
            @click="deleteSomething()"
            v-text="'حذف'"
            large
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      persistent
      max-width="750"
      v-model="edit.model"
    >
      <v-card :loading="edit.loading" :disabled="edit.loading">
        <v-card-title class="white--text primary">
          {{ edit.actionType == "create" ? "إضافة" : "تعديل" }}
          {{ edit.type == "unit" ? "وحدة" : "منطقة" }}
          <v-spacer></v-spacer>
          <v-btn dark icon @click="edit.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <v-row v-if="inputs && inputs[edit.type]">
            <template v-for="(item, i) in inputs[edit.type]">
              <v-col :key="i" cols="6">
                <v-text-field
                  v-if="!item.type || item.type == 'text'"
                  :label="item.label"
                  hide-details
                  @keypress.enter="editSomething(true)"
                  filled
                  v-model="edit[edit.type][item.model]"
                ></v-text-field>
                <v-autocomplete
                  v-else-if="item.type == 'select'"
                  :label="item.label"
                  hide-details
                  filled
                  v-model="edit[edit.type][item.model]"
                  :items="
                    selects && selects[item.model] && selects[item.model].data
                      ? selects[item.model].data
                      : []
                  "
                  :item-text="
                    selects && selects[item.model] && selects[item.model].text
                      ? selects[item.model].text
                      : []
                  "
                  :item-value="
                    selects && selects[item.model] && selects[item.model].value
                      ? selects[item.model].value
                      : []
                  "
                  clearable
                ></v-autocomplete>
                <v-btn-toggle
                  mandatory
                  v-else-if="item.type == 'checkbox'"
                  v-model="edit[edit.type][item.model]"
                  style="width: 100%"
                >
                  <template v-for="(v, i) in ['falsey', 'truely']">
                    <v-btn
                      height="58"
                      x-large
                      width="50%"
                      :active-class="
                        `${i == 1 ? 'error' : 'primary'} white--text`
                      "
                      :key="i"
                      v-text="item[v]"
                      :value="i == 1 ? true : false"
                    ></v-btn>
                  </template>
                </v-btn-toggle>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="edit.model = false"
            v-text="'عودة'"
            large
            class="px-6"
          ></v-btn>
          <v-btn
            color="primary"
            @click="editSomething(true)"
            v-text="
              edit.actionType == 'create' ? 'إضافة جديد' : 'حفظ التعديلات'
            "
            large
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "edit-units",
  mounted() {
    this.getUnits();
    this.getZones();
  },
  data: () => ({
    componentName: "edit_units",
    tableFilters: {
      zones: {},
      units: {}
    },
    inputs: {
      unit: [
        {
          label: "اسم الوحدة",
          model: "unitText",
          type: "text"
        },
        {
          label: "نوع الوحدة",
          model: "unitType",
          type: "select"
        },
        {
          label: "الإسم عند الطباعة",
          model: "aliasText",
          type: "text"
        },
        {
          label: "رقم التعبئة",
          model: "ta3Be2A",
          type: "text"
        },
        {
          label: "هل الوحدة قديمة؟",
          model: "isOld",
          type: "checkbox",
          falsey: "حديثة",
          truely: "قديمة"
        },
        {
          label: "الجيش / المنقطة",
          model: "zoneId",
          type: "select"
        }
      ],
      zone: [
        {
          label: "اسم الجيش / المنقطة",
          model: "zoneText",
          type: "text"
        },
        {
          label: "الإسم عند الطباعة",
          model: "zonePrintText",
          type: "text"
        }
      ]
    },
    selects: {
      zoneId: {
        data: [],
        text: "zoneText",
        value: "zoneId"
      },
      unitType: {
        data: [
          {
            text: "كتيبة"
          },
          {
            text: "جيش"
          },
          {
            text: "قطاع"
          },
          {
            text: "كلية"
          },
          {
            text: "مخابرات"
          },
          {
            text: "وحدة"
          }
        ],
        text: "text",
        value: "text"
      }
    },
    del: {
      loading: false,
      model: false,
      id: null,
      type: ""
    },
    edit: {
      loading: false,
      model: false,
      type: "",
      actionType: "",
      unit: {
        unitId: null,
        unitText: null,
        unitType: null,
        aliasText: null,
        ta3Be2A: null,
        isOld: null,
        zoneId: null
      },
      zone: {
        zoneId: null,
        zoneText: null,
        zonePrintText: null
      }
    },
    result: {
      units: {
        loading: false,
        search: "",
        items: [],
        selected: [],
        headers: [
          {
            text: "الوحدة",
            value: "unitText"
          },
          {
            text: "نوعها",
            value: "unitType"
          },
          {
            text: "الإسم عند الطباعة",
            value: "aliasText"
          },
          {
            text: "رقم التعبئة",
            value: "ta3Be2A"
          },
          {
            text: "قديمة أم حديثة",
            value: "isOld"
          },
          {
            text: "المنطقة",
            value: "zone.zoneText"
          },
          {
            text: "",
            value: "edit_me",
            sortable: false
          }
        ]
      },
      zones: {
        loading: false,
        search: "",
        items: [],
        selected: [],
        headers: [
          {
            text: "المنطقة",
            value: "zoneText"
          },
          {
            text: "الإسم عند الطباعة",
            value: "zonePrintText"
          },
          {
            text: "عدد وحداتها",
            value: "units_length",
            noFilter: true
          },
          {
            text: "",
            value: "edit_me",
            sortable: false
          }
        ]
      }
    }
  }),
  methods: {
    async editSomething(runDB = false, actionType = "", type = "", item = {}) {
      if (runDB) {
        this.$set(this.edit, "loading", true);
        let { type, actionType, zone, unit } = this.edit,
          where = type == "unit" ? unit : zone,
          primaryId = type == "unit" ? unit.unitId : zone.zoneId,
          lastId =
            actionType == "create"
              ? await this.api("global/get_one", {
                  table: `${type}s`,
                  order: [[`${type}Id`, "DESC"]]
                })
              : null;
        console.log(lastId);
        if (type == "unit") {
          delete where.unitId;
        } else {
          delete where.zoneId;
        }
        if (where.ta3Be2A == null) {
          where.ta3Be2A = 0;
        }
        let edited = await this.api(`global/${actionType}_one`, {
          table: `${type}s`,
          where:
            actionType == "update"
              ? {
                  [`${type}Id`]: primaryId
                }
              : {
                  ...where,
                  order: 1,
                  [`${type}Id`]: Number(lastId.data[`${type}Id`]) + 1
                },
          update: where
        });
        if (edited && edited.ok && edited.data) {
          this.$set(this.edit, "loading", false);
          this.$set(this.edit, "model", false);
          Object.keys(this.edit.zone).forEach(key => {
            this.edit.zone[key] = null;
          });
          Object.keys(this.edit.unit).forEach(key => {
            this.edit.unit[key] = null;
          });
          this.showSuccess("تم حفظ البيانات.");
          this.getUnits();
          this.getZones();
        } else {
          this.showError("حدث خطأ أثناء تعديل البيانات.");
        }
      } else {
        if (type && type.length > 0 && actionType && actionType.length > 0) {
          this.$set(this.edit, "type", type);
          this.$set(this.edit, "actionType", actionType);
          Object.keys(this.edit.zone).forEach(key => {
            this.edit.zone[key] = null;
          });
          Object.keys(this.edit.unit).forEach(key => {
            this.edit.unit[key] = null;
          });
          Object.keys(item).forEach(key => {
            let val = item[key];
            this.$set(this.edit[type], key, val);
          });
          this.$set(this.edit, "model", true);
        }
      }
    },
    async deleteSomething() {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delConscriptes = await this.api("global/update_one", {
          table: "conscriptes",
          where: {
            [`${type}Id`]: id
          },
          update: {
            [`${type}Id`]: 0
          }
        }),
        delUnits =
          type == "zone"
            ? await this.api("global/update_one", {
                table: "units",
                where: {
                  zoneId: id
                },
                update: {
                  zoneId: 0
                }
              })
            : null,
        delCors =
          type == "unit"
            ? await this.api("global/update_one", {
                table: "correspondences",
                where: {
                  unitId: id
                },
                update: {
                  unitId: 0
                }
              })
            : null,
        delItem = await this.api("global/delete_all", {
          table: `${type}s`,
          where: {
            [`${type}Id`]: id
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess("تم حذف المطلوب");
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", "");
        this.getUnits();
        this.getZones();
      } else {
        this.showError("تعذر حذف المطلوب.");
      }
      this.$set(this.del, "loading", false);
    },
    async getUnits() {
      this.$set(this.result.units, "loading", true);
      let items = await this.api("global/get_all", {
        table: "units",
        include: [
          {
            model: "zones"
          }
        ]
      });
      if (items && items.ok && items.data) {
        let units = items.data.sort((a, b) => a.isOld - b.isOld);
        this.$set(this.result.units, "items", units);
      } else {
        this.showError("حدث خطأ أثناء استدعاء الوحدات من قاعدة البيانات.");
      }
      this.$set(this.result.units, "loading", false);
    },
    async getZones() {
      this.$set(this.result.zones, "loading", true);
      let items = await this.api("global/get_all", {
        table: "zones",
        include: [
          {
            model: "units"
          }
        ]
      });
      if (items && items.ok && items.data) {
        let zones = items.data.sort((a, b) => a.isOld - b.isOld);
        this.$set(this.result.zones, "items", zones);
        this.$set(this.selects.zoneId, "data", zones);
      } else {
        this.showError(
          "حدث خطأ أثناء استدعاء المناطق / الجيوش من قاعدة البيانات."
        );
      }
      this.$set(this.result.zones, "loading", false);
    }
  }
};
</script>
