<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-col>
        <el-button
          style="margin-bottom: 20px"
          type="primary"
          @click="showAddCateDialog"
          >添加分类</el-button
        ></el-col
      >
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-circle-check"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-circle-close" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag type="success" size="mini" v-if="scope.row.cat_level === 0"
            >一级</el-tag
          >
          <el-tag
            type="warning"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="info" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="operate" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="showEditDialog(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="showDeleteDialog(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedCateList"
            :props="cascaderProps"
            :options="parentCateList"
            clearable
            change-on-select
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddCate">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form ref="editCateRef" :model="editCate" label-width="100px">
        <el-form-item label="修改分类">
          <el-input v-model="editCate.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setEditCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editDialogVisible: false,
      addDialogVisible: false,
      cateList: [],
      editCate: {},
      parentCateList: [],
      selectedCateList: [],
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名", trigger: "blur" },
        ],
      },
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          align: "center",
          headerAlign: "center",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
          align: "center",
          headerAlign: "center",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
          align: "center",
          headerAlign: "center",
        },
        {
          label: "操作",
          type: "template",
          template: "operate",
          align: "center",
          headerAlign: "center",
        },
      ],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    showAddCateDialog() {
      this.getParentCateList();
      this.addDialogVisible = true;
    },
    async showDeleteDialog(deleteId) {
      const result = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (result !== "confirm") return;
      const { data: res } = await this.$http.delete("categories/" + deleteId);
      console.log(deleteId);
      if (res.meta.status !== 200) {
        return this.$message.error("删除分类失败");
      }
      this.getCateList();
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级角色失败");
      }
      this.parentCateList = res.data;
    },
    async showEditDialog(cate) {
      const { data: res } = await this.$http.get("categories/" + cate.cat_id);
      this.editCate = res.data;
      this.editDialogVisible = true;
    },
    parentCateChange() {
      if (this.selectedCateList.length > 0) {
        this.addCateForm.cat_pid = this.selectedCateList[
          this.selectedCateList.length - 1
        ];
        this.addCateForm.cat_level = this.selectedCateList.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    async setEditCate() {
      const { data: res } = await this.$http.put(
        "categories/" + this.editCate.cat_id,
        { cat_name: this.editCate.cat_name }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("更新角色名称失败");
      }
      this.editDialogVisible = false;
      this.getCateList();
    },
    AddCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.getCateList();
        this.addDialogVisible = false;
      });
    },
    addDialogClose() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedCateList = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    editDialogClosed() {
      this.$refs.editCateRef.resetFields();
    },
  },
};
</script>


<style lang="less" scoped>
</style>