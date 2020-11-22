<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-table :data="roleList" border stripe>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row
                v-for="(item1, i1) in scope.row.children"
                :key="item1.id"
                :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
              >
                <el-col :span="5">
                  <el-tag closable @close="removeRight(scope.row, item1.id)">
                    {{ item1.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row v-for="item2 in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        closable
                        @close="removeRight(scope.row, item2.id)"
                        >{{ item2.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        closable
                        @close="removeRight(scope.row, item3.id)"
                        type="warning"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column
            label="角色名称"
            prop="roleName"
            align="center"
          ></el-table-column>
          <el-table-column
            label="角色描述"
            prop="roleDesc"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="showEditDialog(scope.row)"
                >编辑</el-button
              >
              <el-button size="mini" type="info" @click='removeById(scope.row.id)'>删除</el-button>
              <el-button size="mini" type="danger" @click="showRightDialog(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="setDialogVisible"
      width="50%"
      @close="setDefaultKeys"
    >
      <el-tree
        :props="treeProps"
        :data="rightsList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRight">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setEditRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editDialogVisible: false,
      roleList: [],
      setDialogVisible: false,
      rightsList: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      defKeys: [],
      roleID: "",
      editForm: {},
      editFormRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.roleList = res.data;
    },
    async removeRight(role, rightId) {
      const result = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (result !== "confirm") return;
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        this.$message.error("删除权限失败");
      }
      role.children = res.data;
    },
    async showRightDialog(role) {
      this.roleID = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      this.rightsList = res.data;
      this.getLeafKeys(role, this.defKeys);
      this.setDialogVisible = true;
    },
    async showEditDialog(role) {
      const {data:res}=await this.$http.get('roles/'+role.id)
      this.editForm=res.data
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((element) => {
        this.getLeafKeys(element, arr);
      });
    },
    setDefaultKeys() {
      this.defKeys = [];
    },
    async setRight() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleID}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRoleList();
      this.setDialogVisible = false;
    },
    setEditRole() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新角色名称失败");
        }
        this.editDialogVisible = false;
        this.getRoleList();
      })
    },
    async removeById(id){
      const result = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (result !== "confirm") return;
      const {data:res}=await this.$http.delete('roles/'+id)
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色失败");
      }
      this.getRoleList()
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
</style>