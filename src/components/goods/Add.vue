<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区 -->
      <el-alert title="添加商品信息" type="info" :closable="false" show-icon></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab拦 -->

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
        label-width="100px"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabCliced"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_wegiht">
              <el-input v-model="addForm.goods_wegiht" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cate">
              <el-cascader
                v-model="addForm.goods_cate"
                :options="catelist"
                :props="cateProps"
                @change="parentCateChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item -->
            <el-form-item
              :label="item.attr_name"
              v-for="(item) in manyTableData"
              :key="item.attr_id"
            ></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import ApiPath from "@/api/ApiPath";
export default {
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_wegiht: 0,
        goods_number: 0,
        goods_cate: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_wegiht: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cate: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      //商品分类
      catelist: [],
      selectKeys: [],
      // 级联选择框的配置
      cateProps: {
        value: "cate_id",
        label: "cate_name",
        children: "children",
        expandTrigger: "hover"
      },
      //商品参数
      manyTableData: []
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("goods/cate", {
        params: this.queryInfo
      });
      if (!res.success) {
        this.$message.error("获取商品分类出错");
      }

      this.catelist = res.data.cate;
    },
    //选择项发生变化
    parentCateChange() {
      console.log(this.addForm.goods_cate);
      if (this.addForm.goods_cate.length !== 3) {
        this.addForm.goods_cate = [];
        return;
      }
    },
    beforeTabLeave(activeName, oldName) {
      if (oldName === "0" && this.addForm.goods_cate.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    tabCliced() {
      console.log(this.activeIndex);
      if (this.activeIndex === "1") {
        //访问动态参数面班
        this.getCateParams();
      }
    },
    //获取选中参数的
    async getCateParams() {
      //根据所选分类的id 和当前面板获取分类数据
      const { data: res } = await this.$http.post(ApiPath.goods.paramsPath, {
        id: this.cateId,
        sel: "many"
      });

      if (!res.success) {
        this.$message.error("获取分类参数失败");
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];

        //控制文本框的显示
        item.inputVisible = false;
        //文本框中输入的值
        item.inputValue = "";
      });
      console.log(res.data);
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      }
      console.log(this.manyTableData);
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cate.length == 3) {
        return this.addForm.goods_cate[2];
      } else {
        return null;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 15px;
}
.el-form-item__label {
  position: absolute;
  vertical-align: left;
  text-align: left;
}
</style>