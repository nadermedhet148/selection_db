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
          إيجاد هارب
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                @click="goThere('/'), deleteRouteByName(componentName)"
                icon
                v-on="on"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>عودة</span>
          </v-tooltip>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-5">
          <v-text-field
            filled
            v-model="conscripte_id"
            label="الرقم العسكري"
            hint="من فضلك أدخل الرقم العسكري للهارب"
            persistent-hint
            @keyup.enter="!conscripte_id ? () => {} : findFugi()"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-btn
            color="primary"
            large
            text
            @click="goThere('/'), deleteRouteByName(componentName)"
            v-text="'إغلاق للرئيسية'"
            class="px-6"
          ></v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            large
            outlined
            @click="goBack()"
            v-text="'رجوع'"
            class="px-6"
          ></v-btn>
          <v-btn
            color="primary"
            large
            @click="findFugi()"
            v-text="'عرض'"
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
      v-model="exists_with_no_fugi_model"
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
                @click="exists_with_no_fugi_model = false"
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
          الرقم العسكري صحيح, لكن ليس له أي هروب. هل تريد تسجيل هروب جديد؟
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            @click="exists_with_no_fugi_model = false"
            color="error"
            large
            outlined
            class="px-6"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            @click="$emit('add-new-fugi', conscripte_id)"
            color="error"
            large
            class="px-6"
            v-text="'إضافة هروب'"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "fugitives-intrance",
  data: () => ({
    componentName: "fugitives",
    model: true,
    exists_with_no_fugi_model: false,
    conscripte_id: "",
    loading: false,
    main_data: {},
    fugi_data: [],
    isNonCommissioned: false
  }),
  props: {
    add_new_loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    findFugi() {
      let conscripte_id = this.conscripte_id;
      this.$set(this, "isNonCommissioned", false);
      this.$set(this, "loading", true);
      this.$set(this, "main_data", {});
      this.$set(this, "fugi_data", []);
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
            this.api("global/get_all", {
              table: "fugitives",
              where: {
                militaryId: conscripte_id
              },
              attrs: ["id"]
            })
              .then(xx => {
                console.log(xx.data);
                if (xx.data.length == 0) {
                  // this.showError(
                  //   "الرقم العسكري صحيح, لكن ليس له أي هروب مسجل."
                  // );
                  this.$set(this, "exists_with_no_fugi_model", true);
                  this.$set(this, "conscripte_id", conscripte_id);
                } else {
                  // this.$set(this, "fugi_data", xx.data);
                  // this.$nextTick(() => {
                  this.$emit("show-fugi", conscripte_id);
                  // });
                }
              })
              .catch(err => {
                console.log(err);
                // this.showError("الرقم العسكري صحيح, لكن ليس له أي هروب مسجل.");
                this.$set(this, "exists_with_no_fugi_model", true);
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
    }
  }
};
</script>
