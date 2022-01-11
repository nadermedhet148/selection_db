<template>
  <div class="container">
    <v-card cols="12" color="transparent">
      <v-card-title>
        اضافة دفتر
        <v-chip class="transparent">
          <v-btn v-if="isAdmin()" color="primary" icon @click="resetForm()">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </v-card-title>
    </v-card>

    <v-divider></v-divider>
    <v-row>
      <v-col cols="8">
        <v-card
          class="mt-10 mr-4 mb-10"
          elevation="12"
          max-width="1050"
          color="transparent"
          outlined
          shaped
        >
          <v-card-text>
            <v-form v-model="form.valid" ref="form">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="كود"
                    outlined
                    v-model="form.models.code"
                    :rules="form.rules.code"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="اسم"
                    outlined
                    v-model="form.models.name"
                    :rules="form.rules.name"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="رقم الدفتر"
                    outlined
                    v-model="form.models.dafterIndex"
                    :rules="form.rules.dafterIndex"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="رقم الفيلم"
                    outlined
                    v-model="form.models.filmNumber"
                    :rules="form.rules.filmNumber"
                  ></v-text-field>
                </v-col>
                <v-col cols="8">
                  <v-autocomplete
                    :loading="form.nameLoder"
                    label="المسجل"
                    v-model="form.models.assignedTo"
                    :items="consNames"
                    item-value="userId"
                    item-text="realName"
                  ></v-autocomplete>
                  {{ form.models.userId }}
                  {{ form.models.assignedTo }}
                </v-col>
                <v-col cols="4">
                  <v-autocomplete
                    :loading="mohafzat.loder"
                    label="المحافظة"
                    v-model="form.models.mohafzaId"
                    :items="mohafzat.data"
                    item-value="id"
                    item-text="displayedText"
                    clearable
                  ></v-autocomplete>
                </v-col>
                <v-col cols="6" class="center-content">
                  <v-btn
                    class="ma-2 cnt"
                    large
                    width="80%"
                    @click="addDafter()"
                    :color="form.type == formTypes.edite ? 'error' : ''"
                    >{{ form.type }}</v-btn
                  >
                </v-col>
                <v-col cols="5">
                  <v-btn
                    class="ma-2 cnt"
                    large
                    width="100%"
                    :disabled="!form.valid"
                    @click="form.valid ? openFolder() : null"
                    :color="form.type == formTypes.edite ? 'error' : 'success'"
                    >فتح/انشاء ملف</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-row>
          <v-divider class="divider" vertical></v-divider>
          <v-col style="padding-top:90px">
            <v-row>
              <v-col cols="4" class="center-content">
                عدد الدفاتر
              </v-col>
              <v-col cols="4" class="center-content">
                الدفاتر المسكنة
              </v-col>
              <v-col cols="4" class="center-content">الغير المسكنة</v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="center-content">
                {{ dafaterCount }}
              </v-col>
              <v-col cols="4" class="center-content">
                {{ assigneedDafaterCount }}
              </v-col>
              <v-col cols="4" class="center-content">
                {{ unAsiignedCount }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="center-content">
                المسجلين
              </v-col>
              <v-col cols="4" class="center-content">
                اجمالي الصور
              </v-col>
              <v-col cols="4" class="center-content">
                اجمالي المواطنين
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="center-content">
                {{ dfaterWriters }}
              </v-col>
              <v-col cols="4" class="center-content">
                {{ imagesCount }}
              </v-col>
              <v-col cols="4" class="center-content">
                {{ citizensCount }}
              </v-col>
            </v-row>

            <v-row style="padding-top: 40px">
              <v-col cols="6" class="center-content">
                بداية المشروع:
              </v-col>
              <v-col cols="6" class="center-content">
                2021-05-22
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="center-content">
                الي:
              </v-col>
              <v-col cols="6" class="center-content">
                {{ date }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :items="dataTable.data"
          :headers="dataTable.headers"
          :search.sync="search"
          :loading="dataTable.loder"
          fixed-header
          item-key="id"
          hide-default-header
          multi-sort
        >
          <template v-slot:header="table">
            <table-header-filters
              :items="dataTable.data"
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

          <template v-slot:item.actions="{ item }">
            <v-chip class="transparent">
              <v-btn
                v-if="isAdmin()"
                color="primary"
                icon
                @click="initEditeDafter(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-chip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: "DafaterManage",
  data: () => ({
    date: "00 - 00 - 0000",
    componentName: "dafater_management",
    mohafzat: {
      loder: true,
      data: []
    },
    consNames: [],
    citizensCount: 0,
    imagesCount: 0,
    formTypes: {
      add: "اضافه",
      edite: "تعديل"
    },
    form: {
      type: "اضافه",
      valid: false,
      nameLoder: true,
      models: {
        id: null,
        code: null,
        name: null,
        dafterIndex: null,
        filmNumber: 40,
        assignedTo: null,
        mohafzaId: null
      },
      rules: {
        code: [v => !!v || "يجب ادخال الكود"],
        name: [v => !!v || "يجب ادخال الاسم"],
        dafterIndex: [
          v => !!v || "يجب ادخال رقم الدفتر",
          v => !isNaN(v) || "مسموح بادخال ارقام فقط"
        ],
        filmNumber: [
          v => !!v || "يجب ادخال رقم الفيلم",
          v => !isNaN(v) || "مسموح بادخال ارقام فقط"
        ]
      }
    },
    dataTable: {
      loder: true,
      headers: [
        {
          text: "كود",
          value: "code"
        },
        {
          text: "اسم الدفتر",
          value: "name"
        },
        {
          text: "رقم الفيلم",
          value: "filmNumber"
        },
        {
          text: "رقم الدفتر",
          value: "dafterIndex"
        },
        {
          text: "المسجل",
          value: "user.realName"
        },
        {
          text: "",
          value: "actions"
        }
      ],
      data: []
    },
    search: "",
    tableFilters: {},
    result: {
      selected: [],
      search: ""
    }
  }),
  mounted() {
    this.getNames();
    this.getDafater();
    this.numberOfCitizens();
    this.getImagesHasRelCount();
    this.getDate();
    this.getMoafzat();
  },
  methods: {
    openFolder() {
      if (this.form.type == this.formTypes.edite && this.form.valid) {
        let test = this.api("dafater/create-folder", {
          filmNumber: this.form.models.filmNumber,
          dafterIndex: this.form.models.dafterIndex
        })
          .then(x => {
            console.log("xxxx ", x);
          })
          .catch(x => {
            console.log("catch !!1", x);
          });
        console.log(test);
      }
    },
    getDate() {
      let d = new Date();
      d = d.toISOString().split("T")[0];
      this.$set(this, "date", d);
    },
    getNames() {
      let Names = this.api("global/get_all", {
        table: "users",
        where: {
          degree: {
            $or: [
              {
                $eq: "جندي"
              },
              {
                $eq: "عريف مجند"
              }
            ]
          }
        },
        include: [
          {
            model: "dafater"
          }
        ]
      })
        .then(x => {
          this.$set(this, "consNames", x.data);
          console.log("users", x.data);
        })
        .catch(err => {
          this.showError("حدث خطا اثناء تحميل بعض البيانات");
        })
        .finally(() => {
          this.$set(this.form, "nameLoder", false);
        });
    },
    getMoafzat() {
      let mohafzat = this.api("global/get_all", {
        table: "webMobilizationAreas",
        where: {}
      })
        .then(x => {
          this.$set(this.mohafzat, "data", x.data);
        })
        .catch(x => {
          console.log("err", x);
        })
        .finally(this.$set(this.mohafzat, "loder", false));
    },
    getDafater() {
      let dafater = this.api("global/get_all", {
        table: "dafater",
        include: [
          {
            model: "users",
            required: false,
            where: {
              degree: {
                $or: [
                  {
                    $eq: "جندي"
                  },
                  {
                    $eq: "عريف مجند"
                  }
                ]
              }
            }
          }
        ]
      })
        .then(x => {
          this.$set(this.dataTable, "data", x.data);

          console.log("dafater", x.data);
        })
        .catch(err => {
          this.showError("حدث خطا اثناء تحميل بعض البيانات");
        })
        .finally(() => {
          this.$set(this.dataTable, "loder", false);
        });
    },
    numberOfCitizens() {
      let citizen = this.api("global/count", {
        table: "dafaterRel",
        where: {}
      })
        .then(x => {
          console.log("global/get_all ", x.data);
          this.$set(this, "citizensCount", x.data);
        })
        .catch(err => {
          this.showError("حدث خطا اثناء تحميل بعض البيانات");
        })
        .finally(() => {});
    },
    getImagesHasRelCount() {
      let images = this.api("global/get_all", {
        table: "dafaterImages",
        include: [
          {
            model: "dafaterRel",
            required: true
          }
        ]
      })
        .then(x => {
          this.$set(this, "imagesCount", x.data.length);
        })
        .catch(err => {
          this.showError("حدث خطا اثناء تحميل بيانات الصور");
        })
        .finally(() => {});
    },
    resetData() {
      for (const i in this.form.models) {
        this.$set(this.form.models, i, "");
      }
    },
    validate() {
      this.$refs.form.validate();
    },
    resetForm() {
      this.resetData();
      this.$refs.form.resetValidation();
      this.$set(this.form, "type", this.formTypes.add);
    },
    goTo(refName) {
      let element = this.$refs[refName];
      let top = element.offsetTop;
      window.scrollTo(0, top);
    },
    initEditeDafter(dafter) {
      this.resetData();
      this.$set(this.form, "type", this.formTypes.edite);
      for (let i in dafter) {
        if (i in this.form.models) {
          this.$set(this.form.models, i, dafter[i]);
        }
      }
      this.goTo("form");
    },
    async addDafter() {
      this.validate();
      try {
        if (this.form.valid) {
          let dafter = {};

          if (this.form.type == this.formTypes.add) {
            dafter = await this.api("sections/dafater/create-one", {
              table: "dafater",
              where: this.form.models
            });
          } else if (this.form.type == this.formTypes.edite) {
            dafter = await this.api("global/update_one", {
              table: "dafater",
              where: { id: this.form.models.id },
              update: this.form.models
            });
          }

          if (dafter.ok && dafter.data == -1) {
            this.showError(
              "هذا الدفتر موجود بالفعل تحقق من رقم الدفتر او كود الدفتر ."
            );
          } else if (dafter.ok) {
            let index = this.dataTable.data.findIndex(
              item => item.id == this.form.models.id
            );

            this.form.models.user = this.consNames.filter(
              user => user.userId === this.form.models.assignedTo
            )[0];

            if (this.form.type == this.formTypes.add) {
              this.$set(this.dataTable.data, this.dataTable.data.length, {
                ...this.form.models
              });
              this.showSuccess("تم اضافه دفتر بنجاح");
            } else if (this.form.type == this.formTypes.edite) {
              this.$set(this.dataTable.data, index, { ...this.form.models });
              this.showSuccess("تم تعديل الدفتر بنجاح");
            }
          }
        }
      } catch (err) {
        console.log(err);
        this.showError("خطأ اثثناء تنفيذ العمليه.");
      }
    }
  },
  computed: {
    rootDir() {
      return this.$store.state.dafaterRootDir;
    },
    dafaterCount() {
      return this.dataTable.data.length;
    },
    assigneedDafaterCount() {
      return this.dataTable.data.filter(dafter => dafter.assignedTo).length;
    },
    unAsiignedCount() {
      return this.dafaterCount - this.assigneedDafaterCount;
    },
    dfaterWriters() {
      return this.consNames.filter(user => user.dafaters.length > 0).length;
    }
  }
};
</script>
<style scoped>
.container {
  /* margin-top: 100px; */
  width: 100%;
  height: 100%;
  /* background-color: #e3f2fd; */
}
.divider {
  margin-right: 70px;
  height: 280px;
  margin-top: 82px;

  background: rgba(0, 0, 0, 0.12);
}
.center-content {
  text-align: center;
}
</style>
