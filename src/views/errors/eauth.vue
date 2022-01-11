<template>
  <div>
    <v-card class="text-center" tile flat height="80vh">
      <v-layout fill-height align-center align-content-center justify-center>
        <div>
          <div class="mb-4">
            <v-icon size="100">mdi-guy-fawkes-mask</v-icon>
          </div>
          <div class="mb-2">
            عفواً, ليس لديك الصلاحية لدخول هذه الصفحة
          </div>
          <div class="mb-4">
            من فضلك خاطب قسم النظم
          </div>
          <div>
            <v-chip small>
              {{ url }}
            </v-chip>
          </div>
        </div>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "error-auth",
  data: () => ({
    url: ""
  }),
  mounted() {
    this.url = this.$route.fullPath;
  }
};
</script>
