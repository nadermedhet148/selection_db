<template>
  <div>
    {{ currentFrom }}
  </div>
</template>

<script>
export default {
  name: "dynamic-from-now",
  props: ["time"],
  mounted() {
    this.updateFromNow();
    this.interval = setInterval(this.updateFromNow, 50000); // 5 Minutes
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  data: () => ({
    currentFrom: "",
    interval: ""
  }),
  methods: {
    updateFromNow() {
      return (this.currentFrom = this.$moment(this.time).fromNow());
    }
  }
};
</script>
