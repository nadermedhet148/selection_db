<template>
  <div>
    <div v-if="params.daftar">
      <div>
        <v-card :loading="loading">
          <v-card-title>
            <span> الدفتر : {{ params.daftar }} </span>
            <v-spacer></v-spacer>
            <v-btn
              outlined
              x-large
              color="primary"
              v-text="'حفظ التعديلات'"
              class="px-6"
              @click="saveChanges()"
            ></v-btn>
            <v-spacer></v-spacer>
            <span>
              العدد :
              {{
                daftar.items.filter(
                  f => f && f.militaryId && f.militaryId.length > 0
                ).length
              }}
            </span>
          </v-card-title>
        </v-card>
        <v-card class="mt-8">
          <v-card-text>
            <div class="mb-3">
              <v-layout>
                <template v-for="(col, i) in columns">
                  <v-flex lg2 :key="i">
                    <div>
                      {{ col.text }}
                    </div>
                  </v-flex>
                </template>
              </v-layout>
            </div>
            <div v-if="revision.isRevision">
              <v-virtual-scroll
                :items="daftar.items"
                item-height="32"
                :height="`${32 * daftar.itemsToShow}`"
              >
                <template v-slot="{ item }">
                  <div>
                    <v-layout>
                      <template v-for="(col, i) in columns">
                        <v-flex
                          style="border: 0.5px solid #eee; overflow: hidden;"
                          lg2
                          :key="i"
                        >
                          <v-tooltip
                            v-if="
                              item[col.model] &&
                                typeof item[col.model] == 'string' &&
                                item[col.model].length > 18
                            "
                            bottom
                          >
                            <template v-slot:activator="{ on }">
                              <span v-on="on">
                                {{ item[col.model].substr(0, 18) }}
                              </span>
                            </template>
                            <span>
                              {{ item[col.model] }}
                            </span>
                          </v-tooltip>
                          <span v-else>
                            {{ item[col.model] }}
                          </span>
                        </v-flex>
                      </template>
                    </v-layout>
                  </div>
                </template>
              </v-virtual-scroll>
            </div>
            <div v-else>
              <v-virtual-scroll
                :items="daftar.items"
                item-height="42"
                :height="`${42 * daftar.itemsToShow}`"
              >
                <template v-slot="{ item }">
                  <div>
                    <v-layout>
                      <template v-for="(col, i) in columns">
                        <v-flex :key="i">
                          <v-text-field
                            v-if="
                              !col.type ||
                                col.type == 'text' ||
                                col.type == 'date'
                            "
                            flat
                            outlined
                            style="border-radius: 0"
                            solo-inverted
                            dense
                            color="secondary"
                            :type="col.type == 'date' ? 'date' : 'text'"
                            hide-details
                            v-model="item[col.model]"
                          ></v-text-field>
                          <v-autocomplete
                            v-else-if="col.type == 'select'"
                            solo-inverted
                            dense
                            color="secondary"
                            style="border-radius: 0"
                            flat
                            outlined
                            hide-details
                            v-model="item[col.model]"
                            :items="
                              selects &&
                              selects[col.model] &&
                              selects[col.model].data
                                ? selects[col.model].data
                                : []
                            "
                            :item-text="
                              selects &&
                              selects[col.model] &&
                              selects[col.model].text
                                ? selects[col.model].text
                                : []
                            "
                            :item-value="
                              selects &&
                              selects[col.model] &&
                              selects[col.model].value
                                ? selects[col.model].value
                                : []
                            "
                          ></v-autocomplete>
                          <div
                            style="width: 40px; line-height: 42px"
                            class="align-self-center"
                            v-else-if="col.type == 'counter'"
                          >
                            {{ item[col.model] }}
                          </div>
                        </v-flex>
                      </template>
                    </v-layout>
                  </div>
                </template>
              </v-virtual-scroll>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <div v-else>
      <v-dialog
        v-if="isCurrentRoute(componentName) && !params.daftar"
        v-model="model"
        scrollable
        max-width="500"
        persistent
      >
        <v-card :loading="loading" :disabled="loading">
          <v-card-title>
            اختر الدفتر المطلوب
            <v-spacer></v-spacer>
            <v-btn icon @click="goThere('/'), deleteRouteByName(componentName)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-2">
            <v-autocomplete
              filled
              persistent-hint
              label="رقم الدفتر"
              hint="رقم الدفتر المراد فتحه"
              v-model="daftar.existDaftar"
              :items="daftar.items"
            ></v-autocomplete>
          </v-card-text>
          <v-card-title>
            أو قم بفتح دفتر جديد
          </v-card-title>
          <v-card-text class="pt-2">
            <v-text-field
              filled
              label="رقم الدفتر"
              persistent-hint
              hint="قم بتضمين رقم الدفتر و المعرف الخاص به إذا كان له معرف, مثلاً (أ - ب - ج) وفي حالة كتابة رقم دفتر جديد سيتم فتحه, حتى لو تم اختيار دفتر قديم من الأعلى"
              v-model="daftar.newDaftar"
              @keyup.enter="daftar.newDaftar ? findDaftar() : () => {}"
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="px-4">
            <v-spacer></v-spacer>
            <v-btn
              outlined
              color="primary"
              v-text="'رجوع'"
              class="px-6"
              large
              @click="goBack()"
            ></v-btn>
            <v-btn
              color="primary"
              v-text="'بدأ الإستخدام'"
              class="px-6"
              large
              :disabled="!daftar.newDaftar && !daftar.existDaftar"
              @click="findDaftar()"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-snackbar v-model="saveModel" :timeout="9000000">
      <div class="text-center">
        جاِ حفظ التعديلات
      </div>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "e7tyat_docs",
  mounted() {
    this.init();
    this.loadDaftars();
    if (this.params.daftar) {
      this.loadSelectedDaftar();
    }
  },
  data: () => ({
    revision: {
      isRevision: false
    },
    saveModel: false,
    componentName: "e7tyat_docs",
    model: true,
    loading: false,
    daftar: {
      items: [],
      originalItems: [],
      itemsToShow: 12,
      existDaftar: "",
      newDaftar: ""
    },
    columns: [
      {
        text: "م",
        model: "docs_counter",
        type: "counter"
      },
      {
        text: "الرقم العسكري",
        model: "militaryId",
        type: "text"
      },
      {
        text: "الدرجة",
        model: "degreeId",
        type: "select"
      },
      // {
      //   text: "الإسم",
      //   model: "fullName",
      //   type: "text"
      // },
      // {
      //   text: "تاريخ الميلاد",
      //   model: "birthDate",
      //   type: "date"
      // },
      // {
      //   text: "المؤهل",
      //   model: "qualificationId",
      //   type: "select"
      // },
      {
        text: "المحافظة",
        model: "governorateId",
        type: "select"
      },
      {
        text: "المركز",
        model: "markazId",
        type: "select"
      },
      {
        text: "العنوان",
        model: "address",
        type: "text"
      },
      {
        text: "الرقم الثلاثي",
        model: "tripartiteNumber",
        type: "text"
      },
      // {
      //   text: "تاريخ الإنهاء",
      //   model: "demobilizationDate",
      //   type: "date"
      // },
      // {
      //   text: "تاريخ الإلحاق",
      //   model: "conscriptionDate",
      //   type: "date"
      // },
      {
        text: "الوحدة",
        model: "unitId",
        type: "select"
      }
    ],
    selects: {
      degreeId: {
        table: "degrees",
        value: "degreeId",
        text: "degreeType"
      },
      qualificationId: {
        table: "qualifications",
        text: "name",
        value: "qualificationId"
      },
      governorateId: {
        table: "governorates",
        text: "displayedText",
        value: "id"
      },
      markazId: {
        table: "markazs",
        text: "displayedText",
        value: "id"
      },
      unitId: {
        table: "units",
        value: "unitId",
        text: "unitText"
      }
    }
  }),
  methods: {
    async findDaftar() {
      this.$set(this, "loading", true);
      let { existDaftar, newDaftar } = this.daftar,
        userId = this.$store.state.currentUser.userId,
        daftarToUse = newDaftar ? newDaftar : existDaftar;
      let conscriptes = await this.api("global/get_all", {
          table: "conscriptes",
          where: {
            daftarBy: userId, // user
            daftarNumber: daftarToUse
            // unitId: "3",
            // stateIdCurrent: "1"
          },
          attrs: [
            "militaryId",
            "degreeId",
            "fullName",
            "birthDate",
            "qualificationId",
            "governorateId",
            "markazId",
            "address",
            "tripartiteNumber",
            "demobilizationDate",
            "conscriptionDate",
            "unitId",
            "daftarAt"
          ]
        }),
        fixedConscriptes = this.fixDates(conscriptes.data, [
          "birthDate",
          "conscriptionDate",
          "demobilizationDate"
        ]);
      let emptyConscripte = {
          militaryId: "",
          degreeId: "",
          fullName: "",
          birthDate: "",
          qualificationId: "",
          governorateId: "",
          markazId: "",
          address: "",
          tripartiteNumber: "",
          demobilizationDate: "",
          conscriptionDate: "",
          unitId: "",
          daftarAt: ""
        },
        spareConscriptes = [];
      if (500 > fixedConscriptes.length) {
        for (let i = 0; i < 500 - fixedConscriptes.length; i++) {
          spareConscriptes.push({ ...emptyConscripte });
        }
      }
      let allCons = [...fixedConscriptes, ...spareConscriptes];
      allCons.forEach((c, i) => {
        c.docs_counter = i + 1;
      });
      this.$set(this.daftar, "items", allCons);
      this.$set(this.daftar, "originalItems", fixedConscriptes);
      this.$set(this, "loading", false);
      this.goThere(`/e7tyat_docs/${daftarToUse}`);
    },
    loadSelectedDaftar() {
      let daftar = this.params.daftar;
      this.$set(this.daftar, "existDaftar", daftar);
      this.findDaftar();
    },
    loadDaftars() {
      //
    },
    async saveChanges() {
      this.$set(this, "saveModel", true);
      let { items, originalItems } = this.daftar,
        daftarToUse = this.params.daftar,
        userId = this.$store.state.currentUser.userId,
        promises = [];
      items.forEach(item => {
        let isChanged = false;
        Object.keys(item).forEach((key, i) => {
          if (
            item.militaryId &&
            (!originalItems[i] || item[key] !== originalItems[i][key])
          ) {
            isChanged = true;
          }
        });
        if (isChanged) {
          let fixedItem = this.originalDates(
            [{ ...item }],
            ["birthDate", "conscriptionDate", "demobilizationDate"]
          )[0];
          console.log(fixedItem);
          let id = fixedItem.militaryId;
          delete fixedItem.militaryId;
          promises.push(
            this.api("global/update_one", {
              table: "conscriptes",
              where: {
                militaryId: id
              },
              update: {
                ...fixedItem,
                daftarBy: userId,
                daftarNumber: daftarToUse
              }
            })
          );
        }
      });
      await Promise.all(promises);
      this.$set(this, "saveModel", false);
    },
    init() {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, text, value } = this.selects[key];
        if (table) {
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", {
            table,
            attrs: [text, value]
          })
            .then(x => {
              this.$set(this.selects[key], "data", x.data);
            })
            .catch(error => {
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
