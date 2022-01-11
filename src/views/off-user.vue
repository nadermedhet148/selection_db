<template>
  <div>
    <v-layout
      style="min-height: 80vh"
      fill-height
      align-center
      align-content-center
      justify-center
    >
      <v-flex style="max-width: 450px">
        <v-card raised>
          <div class="primary white--text">
            <v-card-subtitle class="white--text mb-0 pb-0">
              تسجيل الدخول
            </v-card-subtitle>
            <v-card-title class="mt-0 pt-0">
              فرع سجلات حرس الحدود
            </v-card-title>
          </div>
          <v-divider></v-divider>
          <v-card-text class="pt-6">
            <v-text-field
              class="mb-3"
              outlined
              label="اسم المستخدم"
              hint="يجب إدخال اسم المستخدم"
              persistent-hint
              v-model="user.username"
              prepend-inner-icon="mdi-face"
              dir="auto"
            ></v-text-field>
            <v-text-field
              outlined
              label="كلمة المرور"
              hint="كلمة المرور لا تقل عن 4 أحرف أو أرقام"
              persistent-hint
              v-model="user.password"
              prepend-inner-icon="mdi-lock"
              dir="auto"
            ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pt-3 px-4">
            <v-btn color="primary" depressed large>
              دخول
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "off-user",
  data: () => ({
    user: {
      username: "",
      password: ""
    }
  })
};
</script>
