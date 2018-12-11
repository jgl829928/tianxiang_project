<template>
  <div class="container">
    <div class="header" id="header">
      <span>{{user.title}}</span>
      <div class="menu">
        <el-menu :default-openeds="menuList" class="el-menu-demo" :default-active="$route.path" mode="horizontal"
          background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
          <span v-for="(one, index) in menuList" :key="index" v-if="one.name!=404">
            <el-menu-item :index="one.path" :key="index" v-if="!one.children||one.children.length==0">
              <span slot="title">{{one.meta.name}}</span>
            </el-menu-item>
            <el-submenu :index="one.path" v-else :key="index">
              <template slot="title">
                <span>{{one.meta.name}}</span>
              </template>
              <template v-if="one.children && one.children.length>0">
                <el-menu-item v-for="(two,index) in one.children" :index="two.path" :key="index">{{ two.meta.name }}</el-menu-item>
              </template>
            </el-submenu>
          </span>
        </el-menu>
      </div>
      <div class="logout">
        <span class="name">Welcome:{{user.userName}}</span>
        <el-button type="info" @click="logout">logout</el-button>
      </div>
    </div>
    <div class="content" id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import api from "@/utils/api";
  export default {
    name: "Home",
    computed: {
      menuList() {
        return this.$store.state.menuList;
      }
    },
    data() {
      return {
        user: {
          title: "",
          userName: ""
        }
      };
    },
    created() {
      this.user = this.$store.state.user;
    },
    methods: {
      // 退出登录
      logout() {
        let that = this;
        this.$confirm("确定要退出吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.$http.get(api.logout).then(res => {
              sessionStorage.clear();
              that.$router.push("/");
            });
          })
          .catch(() => { });
      }
    }
  };
</script>
<style scoped lang='less'>
  @import url("./index.less");
</style>
<style lang="less">
  @import url("./ele_index.less");
</style>