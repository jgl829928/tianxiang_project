<template>
  <div class="line_charts" :style="{width: '100%', height:'100%', margin:'auto'}"></div>
</template>
<script>
import echarts from "echarts";
export default {
  name: "LineChart",
  props: ["lineData"],
  data() {
    return {
      itemData: [
        {
          name: "CPU",
          color: "#afd4c3"
        },
        {
          name: "DISK",
          color: "#dda594"
        },
        {
          name: "PING",
          color: "#d6adb5"
        },
        {
          name: "RAM",
          color: "#8fcae8"
        },
        {
          name: "ARPU",
          color: "#afd4c3"
        },
        {
          name: "DAU",
          color: "#afd4c3"
        },
        {
          name: "DNU",
          color: "#afd4c3"
        }
      ]
    };
  },
  computed: {
    // 计算属性的 getter
    itemLine: function() {
      let data = {};
      for (let item of this.itemData) {
        if (item.name !== this.lineData.name) continue;
        if (item.name == "PING") {
          item.max = 1000;
          item.subTitle = "单位:ms";
        } else {
          item.max = 100;
          item.subTitle = "";
        }
        if (item.name == "ARPU") {
          item.max = null;
        }
        data = item;
      }
      return data;
    },
    axisLabel: function() {
      let rotate = {};
      if (this.lineData.rotate) {
        rotate = {
          interval: 100,
          rotate: -25
        };
      }
      return rotate;
    }
  },
  // 对父组件传入的数据进行监听，渲染图表
  watch: {
    lineData: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.inialLine();
        }
      },
      deep: true
    }
  },
  methods: {
    // 生成echart实例
    inialLine() {
      var line_chart = echarts.init(this.$el);
      line_chart.setOption({
        color: this.itemLine.color,
        title: {
          text: this.lineData.name + " " + "Line",
          subtext: this.itemLine.subTitle
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        xAxis: {
          boundaryGap: false,
          type: "category",
          data: this.lineData.timeData,
          axisLabel: this.axisLabel
        },
        yAxis: {
          type: "value",
          max: this.itemLine.max
        },
        series: [
          {
            data: this.lineData.numData,
            type: "line",
            areaStyle: {},
            itemStyle: {
              borderWidth: 2
            }
          }
        ]
      });
    }
  }
};
</script>

<style lang="less" scoped>
.line_charts {
  margin: auto;
}
</style>