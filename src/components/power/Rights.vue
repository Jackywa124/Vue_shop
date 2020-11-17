<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-table :data="rightsList" border stripe>
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column label="权限名称" prop="authName" align="center"></el-table-column>
            <el-table-column label="路径" prop="path" align="center"></el-table-column>
            <el-table-column label="权限等级" prop="level" align="center">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.level==='0'" type="success">一级</el-tag>
                  <el-tag v-else-if="scope.row.level==='1'" type="info">二级</el-tag>
                  <el-tag v-else type="warning">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>


<script>
export default {
  data() {
    return {
      rightsList: [],
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list")
      if(res.meta.status!==200) return this.$message.error('获取权限失败')
      this.rightsList=res.data
    }
  }
};
</script>