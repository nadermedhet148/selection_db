<template>
  <!-- 
    الصفحة دي بتعرض بالتفصيل العدادات الموجودة في الصفحة الرئيسية لكل قسم
   -->
  <div>
    <fugitive-counter v-if="params.section == '4'"></fugitive-counter>
    <enhaa-counter v-if="params.section == '3'"></enhaa-counter>
    <tasgeel-counter v-if="params.section == '1'"></tasgeel-counter>
    <ehtyat-counter v-if="params.section == '2'"></ehtyat-counter>
  </div>
</template>

<script>
export default {
  name: "HomeCounters",
  components: {
    FugitiveCounter: () =>
      import("@/components/global/home-counters/Fugitive.vue"),
    EnhaaCounter: () => import("@/components/global/home-counters/Enhaa.vue"),
    TasgeelCounter: () =>
      import("@/components/global/home-counters/Tasgeel.vue"),
    EhtyatCounter: () => import("@/components/global/home-counters/Ehtyat.vue")
  },
  data: () => ({
    componentName: "home_counters"
  }),
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
