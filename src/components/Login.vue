<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/img/1.jpg" alt="1" />
      </div>
      <el-form
        label-width="70px"
        class="form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-s-grid"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" class="btn1" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入登录名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid, errstr) => {
        if (!valid) return;
        const {data:res} = await this.$http.post("login", this.loginForm);
        if(res.meta.status!==200){
            this.$message.error('登陆失败')
        }else{
            this.$message.success('登陆成功')
            window.sessionStorage.setItem('token',res.data.token)
            this.$router.push('/home')
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-image: url("../assets/img/2.jpg");
  background-size: cover;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 4px;
  position: absolute;
  left: 30%;
  top: 30%;
  transform: translate(-65%, -30%);
  .form {
    width: 340px;
    position: absolute;
    top: 40px;
    right: 10px;
    .btns {
      display: flex;
      justify-content: space-around;
      .btn1 {
        margin-left: -25px;
        margin-right: 100px;
      }
    }
  }
  .avatar_box {
    height: 100px;
    width: 100px;
    border-radius: 10px;
    margin: 10px;
    margin-top: 40px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }
}
</style>