<template>
  <div>
    <intrance v-if="!params.id"></intrance>
    <cards v-else-if="params.id == 'cards'"></cards>
    <fugitivesReport v-else-if="params.id == 'fugitives'"></fugitivesReport>
  </div>
</template>
<script>
export default {
  name: "admin_holder",
  mounted() {},
  components: {
    intrance: () => import("@/components/sections/admin/holder/intrance.vue"),
    cards: () => import("@/components/sections/admin/holder/cards.vue"),
    fugitivesReport: () =>
      import("@/components/sections/admin/holder/fugitives.vue")
  },
  data: () => ({
    componentName: "admin_holder"
  }),
  methods: {},
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      console.log(params);
      return params;
    }
  }
};
</script>
