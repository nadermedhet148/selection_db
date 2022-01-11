<template>
  <div>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      persistent
      max-width="450"
      scrollable
      v-model="model"
    >
      <v-card :loading="loading" :disabled="loading">
        <v-card-title>
          البيانات الأساسية
          <v-spacer></v-spacer>
          <v-btn @click="goThere('/'), deleteRouteByName(componentName)" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-5">
          <v-text-field
            filled
            v-model="conscripte_id"
            label="الرقم العسكري"
            hint="من فضلك أدخل الرقم العسكري للمنتهي خدمته"
            persistent-hint
            @keypress.enter="
              !conscripte_id
                ? () => {}
                : goToEndDuty(conscripte_id) /*findEndedDuty()*/
            "
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="px-4">
          <!-- <v-btn
            color="primary"
            large
            text
            @click="goThere('/'), deleteRouteByName(componentName)"
            v-text="'إغلاق للرئيسية'"
            class="px-6"
          ></v-btn> -->
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            large
            outlined
            @click="goThere('/'), deleteRouteByName(componentName)"
            v-text="'إغلاق'"
            class="px-6"
          ></v-btn>
          <v-btn
            color="primary"
            large
            @click="goToEndDuty(conscripte_id)"
            v-text="'بحث'"
            class="px-6"
            :disabled="!conscripte_id"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      persistent
      scrollable
      v-model="exists_with_no_ended_duty_model"
      max-width="450"
    >
      <v-card
        :loading="add_new_loading ? 'white' : false"
        :disabled="add_new_loading"
      >
        <v-card-title class="error white--text">
          إضافة جديد؟
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                @click="exists_with_no_ended_duty_model = false"
                dark
                icon
                v-on="on"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>إغلاق</span>
          </v-tooltip>
        </v-card-title>
        <v-card-text class="pt-4">
          الرقم العسكري صحيح, لكن غير مسجل له أي بيانات منتهي بأسباب من قبل. هل
          تود تسجيل جديد؟
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            @click="goThere('/'), deleteRouteByName(componentName)"
            color="error"
            large
            outlined
            class="px-6"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            @click="addNewEndedDuty()"
            color="error"
            large
            class="px-6"
            v-text="'إضافة منتهي بأسباب'"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "ended-duty-intrance",
  props: ["params"],
  data: () => ({
    componentName: "ended_duty_main_data",
    model: true,
    exists_with_no_ended_duty_model: false,
    conscripte_id: "",
    loading: false,
    main_data: {},
    ended_duty_data: [],
    add_new_loading: false,
    isNonCommissioned: false
  }),
  mounted() {
    if (this.params?.id) {
      this.conscripte_id = this.params.id;
      this.findEndedDuty();
    }
  },
  computed: {
    // conscripte_id(){
    //   return this.params?.id;
    // }
  },
  methods: {
    findEndedDuty() {
      let conscripte_id = this.conscripte_id;
      this.$set(this, "isNonCommissioned", false);
      this.$set(this, "loading", true);
      this.$set(this, "main_data", {});
      this.$set(this, "ended_duty_data", []);
      this.api("global/get_one", {
        table: "conscriptes",
        where: {
          militaryId: conscripte_id
        },
        attrs: ["militaryId", "degreeId"]
      })
        .then(x => {
          console.log(x.data);
          // this.$set(this, "main_data", x.data);
          if (x.data == null) {
            this.showError("الرقم العسكري غير صحيح.");
            this.$set(this, "loading", false);
          } else {
            if (x.data.degreeId > 13) {
              this.$set(this, "isNonCommissioned", true);
            }
            this.api("global/get_one", {
              table: "dutyTerminations",
              where: {
                militaryId: conscripte_id
              },
              attrs: ["militaryId"]
            })
              .then(xx => {
                console.log(xx.data);
                if (!xx.data) {
                  this.$set(this, "exists_with_no_ended_duty_model", true);
                  this.$set(this, "conscripte_id", conscripte_id);
                } else {
                  this.showMainData();
                  // this.$set(this, "ended_duty_data", xx.data);
                  // this.$nextTick(() => {
                  //this.showEndedDuty(conscripte_id);
                  // });
                }
              })
              .catch(err => {
                console.log(err);
                this.$set(this, "exists_with_no_ended_duty_model", true);
                this.$set(this, "conscripte_id", conscripte_id);
              })
              .finally(() => {
                this.$set(this, "loading", false);
              });
          }
        })
        .catch(error => {
          console.log(error);
          this.$set(this, "loading", false);
          if (error.data == null) {
            this.showError("الرقم العسكري غير صحيح.");
          } else {
            this.showError("حدث خطأ أثناء البحث عن الرقم العسكري.");
          }
        });
    },
    addNewEndedDuty() {
      this.$set(this, "add_new_loading", true);
      this.api("global/create_one", {
        table: "dutyTerminations",
        where: {
          militaryId: this.conscripte_id,
          finished: false
        }
      })
        .then(x => {
          console.log(x);
          this.showMainData();
          //this.showEndedDuty(this.conscripte_id);
        })
        .catch(err => {
          console.log(err);
          this.showError("حدث خطأ أثناء إنشاء منتهي بأسباب.");
        })
        .finally(() => {
          this.$set(this, "add_new_loading", false);
        });
    },
    showMainData() {
      this.$emit("showMainData");
      this.model = false;
      this.exists_with_no_ended_duty_model = false;
    },
    goToEndDuty(conscripte_id = "") {
      if (conscripte_id) {
        this.goThere(`/ended_duty_main_data/${conscripte_id}`);
      }
    }
  },
  watch: {
    params: {
      deep: true,
      handler(v) {
        if (this.params.id) {
          this.model = true;
          this.conscripte_id = this.params.id;
          this.findEndedDuty();
        } else {
          this.model = true;
          this.conscripte_id = "";
        }
      }
    }
  }
};
</script>
