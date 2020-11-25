<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column
          align="center"
          label="商品名称"
          prop="goods_name"
          width="350px"
        ></el-table-column>
        <el-table-column
          align="center"
          label="商品价格(元)"
          prop="goods_price"
          width="120px"
        ></el-table-column>
        <el-table-column
          align="center"
          label="商品重量"
          prop="goods_weight"
          width="120px"
        ></el-table-column>
        <el-table-column align="center" label="创建时间" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="showEditDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="removeGood(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
        >
      </el-pagination>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form ref="editGoodRef" :model="editGood" label-width="100px">
        <el-form-item label="修改名称">
          <el-input v-model="editGood.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="修改价格">
          <el-input v-model="editGood.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="修改重量">
          <el-input v-model="editGood.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setEditGood">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      editDialogVisible: false,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodsList: [],
      total: 0,
      editGood: {},
    };
  },
  created() {
    this.getGoodList();
  },
  methods: {
    async getGoodList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodList();
    },
    async removeGood(Id) {
      const result = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (result !== "confirm") return;
      const { data: res } = await this.$http.delete("goods/" + Id);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.getGoodList();
    },
    goAddPage() {
      this.$router.push("/goods/add");
    },
    async showEditDialog(good) {
      const { data: res } = await this.$http.get("goods/" + good.goods_id);
      this.editGood = res.data;
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editGoodRef.resetFields();
    },
    async setEditGood() {
      const { data:res } = await this.$http.put(
        "goods/" + this.editGood.goods_id,
        {
          goods_name: this.editGood.goods_name,
          goods_price: this.editGood.goods_price,
          goods_number: this.editGood.goods_number,
          goods_weight: this.editGood.goods_weight,
          goods_cat:this.editGood.goods_cat
        }
      )
      console.log(res.meta.status)
      if(res.meta.status!==200) return this.$message.error('修改商品失败')
      this.getGoodList()
      this.editDialogVisible=false
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}
</style>