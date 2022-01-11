<template>
  <div id="app">
    <v-app>
      <div>
        <v-alert
          type="info"
          color="error"
          :outlined="$vuetify.theme.dark"
          class="mb-8"
          prominent
        >
          <div>
            استخدام هذه العمليات في غير وقتها الصحيح قد يسبب خسارة بعض البيانات
            من قاعدة البيانات أو خسارة قاعدة البيانات كلها
          </div>
          <div>
            يرجى قراءة التعليمات في الكود وقراءة الكود جيداً لهذه العمليات لتعرف
            بالضبط ما تفعله حتى تستطيع الإستفادة منها
          </div>
        </v-alert>
        <v-row>
          <template v-for="n in n_cols">
            <v-col
              :key="n"
              :xl="12 / n_cols"
              :lg="12 / n_cols"
              :md="12 / n_cols"
              :sm="12 / n_cols"
            >
              <template v-for="(component, key, i) in components">
                <div
                  class="mb-8"
                  v-if="i + 1 == n + Math.floor(i / n_cols) * n_cols"
                  :key="i"
                >
                  <component :is="component"></component>
                </div>
              </template>
            </v-col>
          </template>
        </v-row>
      </div>
      <div class="text-center">
        <v-dialog
          v-model="dialog"
          persistent
          width="500"
          style="background: rgba(0,0,0,0.5)"
        >
          <v-card>
            <v-card-title class="red text-algin-center"
              >رسالة تحذيرية</v-card-title
            >

            <v-card-text style="padding:20px"
              >تحتوي هذه الصفحة على عمليات قد تؤدي إلي إتلاف قاعدة
              البيانات</v-card-text
            >

            <v-text-field
              label="كلمة السر"
              v-model="password"
              type="password"
              :rules="passwordRules"
              style="padding:8px; margin-bottom:5px;"
              color="red"
            ></v-text-field>
            <p
              id="uncorrectPassword"
              style="color: #F44336; margin-right: 10px; padding-bottom:5px;"
            ></p>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="gray" text @click="checkPasswordValidation()">
                دخول
              </v-btn>
              <v-btn
                style="margin-left:auto;"
                color="red"
                text
                @click="goThere('/'), deleteRouteByName(componentName)"
                >عودة للصفحة الرئيسية</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <v-row>
        <template v-for="n in n_cols">
          <v-col
            :key="n"
            :xl="12 / n_cols"
            :lg="12 / n_cols"
            :md="12 / n_cols"
            :sm="12 / n_cols"
          >
            <template v-for="(component, key, i) in components">
              <div
                class="mb-8"
                v-if="i + 1 == n + Math.floor(i / n_cols) * n_cols"
                :key="i"
              >
                <component :is="component"></component>
              </div>
            </template>
          </v-col>
        </template>
      </v-row>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "nozom_operations",
  data: () => ({
    dialog: true,
    componentName: "nozom_operations",
    components: {
      FixDegrees: () =>
        import("@/components/sections/nozom/operations/FixDegrees.vue"),
      TestSmba: () =>
        import("@/components/sections/nozom/operations/TestSmba.vue"),
      AdminMsg: () =>
        import("@/components/sections/nozom/operations/AdminMsg.vue"),
      FixIgnorants: () =>
        import("@/components/sections/nozom/operations/FixIgnorants.vue")
      /*
      TransferCardsDatabase: () =>
        import(
          "@/components/sections/nozom/operations/TransferCardsDatabase.vue"
        )*/
    },
    n_cols: 2,
    valid: true,
    password: "",
    passwordRules: [v => !!v || "يجب إدخال كلمة السر"]
  }),
  methods: {
    checkPasswordValidation: function() {
      if (this.password === "1122022") {
        this.dialog = false;
      } else {
        document.getElementById("uncorrectPassword").innerText =
          "كلمة السر غير صحيحة";
      }
    }
  }
};
</script>
