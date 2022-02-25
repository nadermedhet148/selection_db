<template>
  <div>
    <apex-chart
      v-if="series && options"
      :series="series"
      :options="options"
      width="100%"
      :height="`${height}px`"
    >
    </apex-chart>
  </div>
</template>

<script>
export default {
  name: "apex-line-chart",
  props: {
    height: {
      Type: String,
      default: "400"
    },
    series: {
      type: Array,
      default: () => []
    },
    categories: {
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
        "#1BF2A3",
        "#F29422",
        "#643DF2",
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
      default: "عملية"
    }
  },
  data: () => ({
    staticId: `id-${new Date().getTime()}-${Math.random()}`
  }),
  computed: {
    options() {
      let that = this;
      return {
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
            enabled: true
          },
          toolbar: {
            show: true
          },
          stacked: true
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            shadeIntensity: 0.3
            // shade: "dark",
            // gradientToColors: ["#f97794"],
            // shadeIntensity: 1,
            // type: "vertical",
            // opacityFrom: 1,
            // opacityTo: 1,
            // stops: [0, 100, 100, 100],
          }
        },
        colors: this.colors,
        stroke: {
          curve: "smooth"
        },
        xaxis: {
          type: "datetime",
          categories: this.categories // Array of dates
        },
        yaxis: {
          title: {}
        },
        dataLabels: {
          enabled: true
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val + ` ${that.suffix}`;
            }
          }
        },
        legend: {
          show: true
        }
      };
    }
  }
};
</script>
