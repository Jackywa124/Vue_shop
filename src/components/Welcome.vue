<template>
  <div class="block">
    <el-carousel trigger="click">
      <el-carousel-item v-for="item in picture" :key="item.id">
        <img :src="item.idView" alt="item.id" />
      </el-carousel-item>
    </el-carousel>
    <span>WelCome,Have A Good Day</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      picture: [
        { id: 0, idView: require("../assets/img/1.jpg") },
        { id: 1, idView: require("../assets/img/2.jpg") },
        { id: 2, idView: require("../assets/img/3.jpg") },
        { id: 3, idView: require("../assets/img/4.jpg") },
        { id: 4, idView: require("../assets/img/5.jpg") },
      ]
    }
  }
}
</script>


<style lang="less" scoped>
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.block {
  width: 40%;
  height: 450px;
  margin: 0 auto;
}
img {
  width: 100%;
  height: 100%;
}
span {
  display: block;
  margin: 70px auto;
  width: 100%;
  height: 40px;
  font-family: cursive;
  font-weight: 100;
  font-size: 30px;
}
</style>