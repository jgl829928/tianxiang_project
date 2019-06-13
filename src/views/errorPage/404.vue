<template>
    <div class="page-container">
        <img src="../../assets/images/404.png" alt="">
        <p class="alert_info_1">噢···看来你是迷路了！</p>
        <p class="alert_info_2">通过点击选项寻找回家的路</p>
        <div>
            <el-button @click="return_index">返回首页</el-button>
            <el-button @click="return_last" type="plain">上一页</el-button>
        </div>
    </div>
</template>
<script>
export default {
    methods:{
        return_index(){
            this.$router.push("/")
        },
        return_last(){
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="less" scoped>
.page-container {
  text-align: center;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80%;
  margin: auto;
  .alert_info_1 {
    font-size: 32px;
    color: #6e6d72;
    letter-spacing: 1.92px;
  }
  .alert_info_2 {
      margin-top:20px;
    font-size: 17.99px;
    color: #a8a9ad;
    letter-spacing: 1.08px;
    margin-bottom:30px;
  }

  img {
    display: inline-block;
    width: 80%;
    // margin-left: 5%;
    margin-top: 30px;
  }
  button{
      width:240px;
      height:44px;
      margin-right:50px;
      
  }
  button:nth-child(1){
      background:#FFAD18;
      color:#fff;
  }
  button:nth-child(2){
      border:1px solid #FFAD18;
      background:none;
      color:#FFAD18;
  }
   button:nth-child(2):hover{
       background:none;
   }
}
</style>

