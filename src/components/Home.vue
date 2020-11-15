<template>
  <el-container class="home-container">
    <el-header>
      <div class="logbox">
        <img src="../assets/img/1.jpg" alt="1" /><span>主页</span>
      </div>
      <el-button type="primary" @click="logOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px"></el-aside>
      <el-main></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  img {
    width: 40px;
    height: 40px;
    padding: 10px;
  }
  .logbox span {
    position: absolute;
    padding: 20px;
    color: black;
    font-family: "Gill Sans", sans-serif;
  }
  display: flex;
  background-color: gray;
  justify-content: space-between;
}
.el-aside {
  background-color: gainsboro;
}
.el-main {
  background-color: white;
}
.el-button {
  width: 60px;
  height: 40px;
  margin-top: 10px;
}
</style>