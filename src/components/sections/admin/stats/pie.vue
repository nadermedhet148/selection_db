<template>
  <div>
    <apex-chart
      v-if="series && options"
      :series="series"
      :options="options"
      width="100%"
      :height="`${height}px`"
      type="pie"
    >
    </apex-chart>
  </div>
</template>

<script>
export default {
  name: "apex-pie-chart",
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
    colors: {
      type: Array,
      default: () => [
        "#1976D2",
        "#ffa146",
        "#ed6d6e",
        "#cd32df",
        "#7ad734",
        "#5c5c5c"
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
          plotOptions: {
            pie: {
              customScale: 1,
              offsetX: 0,
              offsetY: 0,
              expandOnClick: true,
              dataLabels: {
                offset: 0,
                minAngleToShowLabel: 10
              }
            }
          },
          labels: this.labels,
          chart: {
            id: this.id ? this.id : this.staticId,
            zoom: {
              enabled: false
            },
            toolbar: {
              show: false
            },
            stacked: true
          },
          fill: {
            type: "gradient",
            gradient: {
              shade: "light",
              shadeIntensity: 0.3
            }
          },
          colors: this.colors,
          dataLabels: {
            enabled: true
          },
          tooltip: {
            y: {
              formatter: function(val) {
                // return val + ` ${that.suffix}`;
                return "";
              }
            }
          },
          legend: {
            show: true
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
