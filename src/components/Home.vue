<template>
  <el-container class="home-container">
    <el-header>
      <div class="logbox">
        <img src="../assets/img/6.jpg" alt="1" /><span>主页</span>
      </div>
      <el-button type="primary" @click="logOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle" @click="toggleList">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse='isCollapse'
          :collapse-transition='false'
          :router="true"
        >
          <el-submenu
            v-for="item in menulist"
            :key="item.id"
            :index="item.id + ''"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="subitem in item.children"
              :key="subitem.id"
              :index="'/'+subitem.path"
              >
              <template slot="title">
                <i class="el-icon-reading"></i>
                <span>{{subitem.authName}}</span>
              </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconsObj:{
        '125':'el-icon-headset',
        '103':'el-icon-attract',
        '101':'el-icon-mobile',
        '102':'el-icon-scissors',
        '145':'el-icon-umbrella'
      },
      isCollapse:false
    }
  },
  created() {
    this.getMenuList();
  },
  methods: {
    toggleList(){
      this.isCollapse=!this.isCollapse
    },
    logOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
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
    padding-top: 10px;
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
  padding: 10px;
}
.toggle{
  background-color: coral;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>