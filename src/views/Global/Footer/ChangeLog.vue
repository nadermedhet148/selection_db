<template>
  <div>
    <v-card class="mb-6">
      <v-card-title> حول المنظومة </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div>
          تم الإنشاء و التطوير بواسطة معمل الانتقاء والتوجيه  حرس الحدود ح ح عام 2022 تحت اشراف المقدم
          احمد حسن شبانة
        </div>
        <div>فريق العمل:</div>
        <ul>
          <li>المقدم/ احمد حسن شبانة</li>
        </ul>
        <div class="mt-1"></div>
      </v-card-text>
    </v-card>
    <v-alert type="info" prominent>
      <div class="ps-2">
        <div>
          حالياً بإمكانك تحميل نسخة جديدة من المنظومة عن طريق الضغط على
          <v-btn @click="updateApp()" light class="ms-2">
            تحديث المنظومة
          </v-btn>
        </div>
        <div>
          ثم ستظهر لك رسالة, اضغط على
          <v-chip class="ms-2" color="white" light label>Run</v-chip>
        </div>
      </div>
    </v-alert>
  </div>
</template>

<script>
let { ipcRenderer } = window.require("electron");
export default {
  name: "change_log",
  data: () => ({}),
  methods: {
    updateApp() {
      this.openExternal(this.$store.state.app_path);
      ipcRenderer.send("force-close");
    }
  }
};
</script>
