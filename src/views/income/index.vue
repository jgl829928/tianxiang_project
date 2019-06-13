<template>
  <div class="common_content opt_content">
    <el-tabs type="border-card" class="opt_tab"  v-model="show_data">
      <el-tab-pane label="在线数据" name="1"></el-tab-pane>
      <el-tab-pane label="营收报表" name="2"></el-tab-pane>
    </el-tabs>
    <Online v-if="show_data=='1'"></Online>
    <Income v-else></Income>
  </div>
</template>
<script>
import Income from "./income.vue";
import Online from "./online.vue";
export default {
  name: "Operation",
  components: { Income, Online },
  data() {
    return {
      show_data:"1",
    };
  },
  methods: {
  }
};
</script>
<style lang="less" scoped>
.opt_content {
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
  min-height: 850px;
  /deep/ .el-tabs--border-card {
    border: none;
    box-shadow: none;
  }
  .operation_content {
        padding: 0 20px 40px 20px;
       /deep/ .el-form--inline .el-form-item {
            width: 100%;
        }

       /deep/ .el-form--inline .el-form-item__content {
            width: calc(~"100% - 110px");
        }
    }
}
</style>


