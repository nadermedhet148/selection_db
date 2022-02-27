<template>
  <div>
    <apex-chart
      v-if="series && options"
      :series="series"
      :options="options"
      width="100%"
      :height="`${height}px`"
      type="bar"
    >
    </apex-chart>
  </div>
</template>

<script>
export default {
  name: "apex-bar-chart",
  props: {
    height: {
      Type: String,
      default: "400"
    },
    series: {
      type: Array,
      default: () => []
    },
    labels: {
      type: Array,
      default: () => []
    },
    categories: {
      type: Array,
      default: () => []
    },
    colors: {
      type: Array,
      default: () => [
        "#1BF2A3",
        "#F29422",
        "#03318C",
        "#D955B5",
        "#F25252",
        "#4CAF50",
        "#D955B5",
        "#F764b2"
      ]
    },
    id: {
      type: String,
      default: ""
    },
    suffix: {
      type: String,
      default: "جندي"
    },
    events: {
      type: Object || null,
      default: null
    }
  },
  data: () => ({
    staticId: `id-${new Date().getTime()}-${Math.random()}`
  }),
  computed: {
    options() {
      let that = this,
        obj = {
          chart: {
            type: "bar",
            height: 350
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: false
            }
          },
          legend: {
            show: true,
            customLegendItems: this.categories
          },
          dataLabels: {
            enabled: true
          },
          xaxis: {
            categories: this.categories
          }
        };
      if (this.events && Object.keys(this.events).length > 0) {
        obj.chart.events = this.events;
      }
      return obj;
    }
  }
};
</script>
