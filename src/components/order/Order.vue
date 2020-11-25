<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          align="center"
          label="订单编号"
          prop="order_number"
        ></el-table-column>
        <el-table-column
          align="center"
          label="订单价格"
          prop="order_price"
        ></el-table-column>
        <el-table-column align="center" label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="是否发货"
          prop="is_send"
        ></el-table-column>
        <el-table-column align="center" label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
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
            <el-button size="mini" type="success" @click="showProgressBox"
              ><i class="el-icon-location-information"></i>
            </el-button>
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
      <el-form ref="editOrderRef" :model="editOrder" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="editOrder.address1"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editOrder.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setEditOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="progressDialogVisible" width="50%">
        <h1>接口用不了，回头添加</h1>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata.js";

export default {
  data() {
    return {
      progressDialogVisible: false,
      editDialogVisible: false,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      orderList: [],
      editOrder: {
        address1: [],
        address2: "",
      },
      cityData,
      progressInfo: [],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取订单列表失败");
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    showEditDialog(order) {
      this.editDialogVisible = true;
    },
    setEditOrder() {
      //未完成
      this.editDialogVisible = false;
    },
    editDialogClosed() {
      this.$refs.editOrderRef.resetFields();
    },
    async showProgressBox() {
     
      this.progressDialogVisible = true;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}
</style>