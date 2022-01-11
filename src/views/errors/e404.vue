<template>
  <div>
    <v-card class="text-center" tile flat height="80vh">
      <v-layout fill-height align-center align-content-center justify-center>
        <div>
          <div class="mb-4">
            <v-icon size="100">mdi-guy-fawkes-mask</v-icon>
          </div>
          <div class="mb-2">
            الصفحة التي تحاول الدخول إليها تم حذفها
          </div>
          <div class="mb-4">
            أو غير مصرح لك الدخول إليها
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
  name: "error-404",
  data: () => ({
    url: ""
  }),
  mounted() {
    this.url = this.$route.fullPath;
  }
};
</script>
