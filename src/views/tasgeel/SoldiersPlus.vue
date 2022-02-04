<template>
  <div>
    <intrance v-if="!params.id"></intrance>
    <advanced-search
      v-else-if="params.id == 'advanced_search'"
    ></advanced-search>
    <soldier-profile
      v-else
      @set-no-current-id="setNoCurrentId()"
      :soldier_id="params.id"
    ></soldier-profile>
  </div>
</template>

<script>
export default {
  name: "soldiers_plus",
  mounted() {
    // if (!this.current_id) {
    //   this.$set(this, "current_id", this.params.id);
    // }
  },
  components: {
    SoldierProfile: () =>
      import("@/components/sections/tasgeel/soldier_plus/soldier_profile.vue"),
    Intrance: () =>
      import("@/components/sections/tasgeel/soldier_plus/intrance.vue"),
    AdvancedSearch: () =>
      import("@/components/sections/tasgeel/soldier_plus/advanced_search.vue")
  },
  data: () => ({
    // current_id: "",
    componentName: "soldiers_plus"
  }),
  methods: {
    setNoCurrentId() {
      // this.$set(this, "current_id", "");
    }
  },
  watch: {
    // "params.id"(v) {
    //   if (v) {
    //     this.$set(this, "current_id", v);
    //   }
    // }
  },
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
