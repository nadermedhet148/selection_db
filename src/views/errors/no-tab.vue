<template>
  <div>
    <v-card class="text-center" tile flat height="80vh">
      <v-layout fill-height align-center align-content-center justify-center>
        <div>
          <div class="mb-4">
            <v-icon size="100">mdi-target</v-icon>
          </div>
          <div class="mb-2">
            لا توجد صفحة محددة
          </div>
          <div class="mb-4">
            من فضلك حدد صفحة للدخول إليها
          </div>
        </div>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "no-tab",
  data: () => ({})
};
</script>
