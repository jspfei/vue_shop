<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoodPage()">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" width="140px" prop="goods_pice"></el-table-column>
        <el-table-column label="商品重量" width="100px" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" width="180px" prop="goods_time">
          <template slot-scope="scope">{{scope.row.goods_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="230px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import ApiPath from "@/api/ApiPath";
export default {
  data() {
    return {
      //查询商品info
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      //商品列表数据
      goodsList: [],
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.post(
        ApiPath.goods.goodsPath,
        this.queryInfo
      );
      if (!res.success) {
        this.$message.error("获取商品列表失败");
      }

      this.goodsList = res.data;
      this.total = res.total;
      console.log(this.goodsList);
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getGoodsList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getGoodsList();
    },
    //删除商品
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除改商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除");
      }

      const { data: res } = await this.$http.post(
        ApiPath.goods.deleteGoodsPath,
        {
          id: id
        }
      );
      if (!res.success) {
        this.$message.error("删除商品失败");
      }
      this.$message.success("删除商品成功");
      this.getGoodsList();
    },
    addGoodPage() {
      this.$router.push("/goods/add");
    }
  }
};
</script>
<style lang="less" scoped>
</style>