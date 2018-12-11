<template>
    <div class="line_charts" :style="{width: '450px', height: '300px'}">
    </div>
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
          color: "#afd4c3",
          max: 100,
          subTitle: ""
        },
        {
          name: "DISK",
          color: "#dda594",
          max: 100,
          subTitle: ""
        },
        {
          name: "PING",
          color: "#d6adb5",
          max: 1000,
          subTitle: "单位:ms"
        },
        {
          name: "RAM",
          color: "#8fcae8",
          max: 100,
          subTitle: ""
        }
      ]
    };
  },
  computed: {
    // 计算属性的 getter
    itemLine: function() {
      let data = {};
      for (let item of this.itemData) {
        if (item.name === this.lineData.name) {
          data = item;
        }
      }
      return data;
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
          data: this.lineData.timeData
        },
        yAxis: {
          type: "value",
          max: this.itemLine.max,
          nameTextStyle: {
            width: 160
          }
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