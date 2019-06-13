<template>
  <div class="common_content map_content">
    <select-server :reqdata="reqdata" @getserver="search" :name="name" @typeList="getType" :disabled="isDisable"></select-server>
    <div class="map" id="map">
      <el-form class="c-type-form" label-width="100px" :inline="true" label-position="right">
        <el-row>
          <el-col :span="12" :xs="24">
            <el-form-item label="Type" min-width="120">
              <el-select v-model="type" clearable placeholder="Type" @change="typechange">
                <el-option v-for="(item,index) in typeList" :label="item.CName" :value="item.CType" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="Num" min-width="120">
              <span>{{pointsNum}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="mapitem" id="mapitem" v-loading="loading"></div>
    </div>
  </div>
</template>

<script>
  import api from "@/utils/api";
  import { URL } from "@/utils/api";
  import { base64 ,_debounce} from "@/utils/auth";
  import echarts from "echarts";
  import selectServer from "@/components/selectServer";
  export default {
    name: "Worldmap",
    components: { selectServer },
    data() {
      return {
        imgStr: "",
        reqdata: {
          selectId: ""
        },
        isDisable:false,
        name: "worldmap",
        serverlist: [],
        serverId: "",
        typeList: [],
        type: "",
        allpoints: [],
        points: [],
        pointsNum: 0,
        loading: false,
      };
    },
    computed: {
      pointsList: function () {
        let data = this.points;
        for (let item of data) {
          item.value[1] = 880 - item.value[1];
        }
        return data;
      }
    },
    mounted() {
      this.imgBase64();
    },
    methods: {
      imgBase64() {
        let a = Promise.resolve(base64());
        a.then(res => {
          this.imgStr = res;
        }).then(() => {
          this.inialLine();
        });
      },
      // typelist
      getType(data) {
        this.typeList = data;
      },
      //  搜索
      search:_debounce(function(id) {
        this.serverId = id;
        if (!this.serverId) {
          this.$message.error("请选择服务器ID");
          return false;
        }
        this.type = "";
         this.isDisable=true;
        this.loading = true;
        this.getpointData();
      },500),
      // 获取数据有121个请求
      async getpointData(i) {
        let mapRequest = [];
        for (let i = 0; i < 121; i++) {
          mapRequest.push(
            this.$http.post(`${api.mapBolck}?server=${this.serverId}&block=${i}`)
          );
        }
        let data = await Promise.all(mapRequest);
        this.dealdata(data);
      },

      // 获取到数据后进行处理
      dealdata(data) {
        this.isDisable=false;
        let mapPoints = [];
        for (let item of data) {
          if (!item.Data.block || item.Data.block == "null") continue;
          item.Data.block = JSON.parse(item.Data.block);
          for (let point of item.Data.block) {
            let pointItem = {
              name: point.RID,
              cType: point.CType,
              cName: this.getName(point.CType).CName,
              level: point.Level,
              value: [point.X, point.Y]
            };
            mapPoints.push(pointItem);
          }
        }
        this.allpoints = JSON.parse(JSON.stringify(mapPoints));
        this.renderMap(mapPoints);
      },

      typechange() {
        let points = [];
        if (!this.type) {
          points = this.allpoints;
        } else {
          points = this.allpoints.filter(item => {
            return this.type == item.cType;
          });
        }
        this.renderMap(points);
      },

      renderMap(data) {
        this.points = JSON.parse(JSON.stringify(data));
        this.pointsNum = this.points.length;
        this.inialLine();
      },

      // 获取该类型对应的名称
      getName(type) {
        let typeinfo = {};
        for (let item of this.typeList) {
          if (type == item.CType) {
            typeinfo = item;
            break;
          }
        }
        return typeinfo;
      },

      // 生成echart实例
      inialLine() {
        var img = new Image(); //新建对象
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var myChart = echarts.init(document.querySelector(".map .mapitem"));

        canvas.width = myChart.getWidth();
        canvas.height = myChart.getHeight();

        var fullImage = new Image();
        img.onload = function () {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          fullImage.src = canvas.toDataURL();
          setTimeout(function () {
            myChart.resize();
          }, 100);
        };
        img.src = this.imgStr;
        var geoMapName = "geoMap" + Math.round(Math.random() * 1e10);
        var features = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                name: geoMapName
              },
              geometry: {
                type: "MultiPolygon",
                coordinates: [[[[880, 880], [0, 880], [0, 0], [880, 0]]]]
              }
            }
          ]
        };
        echarts.registerMap(geoMapName, features);
        myChart.setOption({
          tooltip: {
            trigger: "item",
            confine: true,
            show: true,
            formatter: function (params) {
              let tip = `rid:${params.data.name}</br>X:${
                params.value[0]
                }</br>Y:${880 - params.value[1]}<br/>level:${
                params.data.level
                }<br>type:${params.data.cName}`;
              return tip;
            }
          },
          geo: {
            map: geoMapName,
            aspectScale: 1, // 宽高比
            layoutCenter: ["50%", "50%"], // 位置
            layoutSize: 880, // 大小
            silent: true,
            roam: true,
            scaleLimit: {
              min: 1
            },
            itemStyle: {
              borderWidth: 0,
              color: {
                // type: "pattern",
                image: fullImage, // 支持为 HTMLImageElement, HTMLCanvasElement，不支持路径字符串
                repeat: "no-repeat" // 是否平铺, 可以是 'repeat-x', 'repeat-y', 'no-repeat'
              }
            }
          },
          series: [
            {
              type: "scatter",
              coordinateSystem: "geo",
              symbol: "rect",
              itemStyle: {
                normal: {
                  opacity: 0.4,
                  color: "#fff"
                }
              },
              symbolSize: 10,
              data: this.pointsList,
              large: true
            }
          ]
        });
        this.loading = false;
      }
    }
  };
</script>
<style lang="less" scoped>
  .map_content {
    text-align: center;

    .map {
      .c-type-form {
        width: 880px;
        margin: 20px auto 0;
        font-size: 12px;
      }

      .mapitem {
        width: 880px;
        height: 880px;
        margin: 0px auto;
        border: 1px solid #dadada;
        text-align: left;
      }
    }
  }
</style>
<style lang="less">
  .map_content {
    .map {
      .c-type-form {
        .el-form-item {
          margin-bottom: 5px;
        }

        .el-input__inner {
          height: 34px;
        }

        .el-form-item__label {
          font-size: 12px;
        }
      }
    }
  }
</style>