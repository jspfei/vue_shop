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
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item  in onlyTableData"
              :key="item.attr_id"
            >
              <el-input :value="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本输入 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="preDialogVisible" width="50%">
      <img :src="preImgUrl" class="preImg" alt />
    </el-dialog>
  </div>
</template>
<script>
import ApiPath from "@/api/ApiPath";
import _ from "lodash";
export default {
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_wegiht: 0,
        goods_number: 0,
        goods_cate: [],
        goods_introduce: ""
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
      manyTableData: [],
      //静态属性
      onlyTableData: [],
      preImgUrl: "",
      preDialogVisible: false
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
        this.getCateParams("many");
      } else if (this.activeIndex === "2") {
        this.getCateParams("only");
      }
    },
    //获取选中参数的
    async getCateParams(sel) {
      //根据所选分类的id 和当前面板获取分类数据
      const { data: res } = await this.$http.post(ApiPath.goods.paramsPath, {
        id: this.cateId,
        sel: sel
      });

      if (!res.success) {
        this.$message.error("获取分类参数失败");
      }
      if (sel == "many") {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];

          //控制文本框的显示
          item.inputVisible = false;
          //文本框中输入的值
          item.inputValue = "";
        });
      }
      console.log(res.data);
      if (sel == "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }

      console.log(this.onlyTableData);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
      this.preImgUrl = file.url;
      this.preDialogVisible = true;
    },
    handleSuccess(response) {
      console.log(response);
    },
    add() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          this.$message.error("填写必要项目");
          return;
        }

        //添加业务
        const form = _.cloneDeep(this.addForm);
        form.goods_cate = form.goods_cate.join(",");

        console.log(form);
      });
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

.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.el-upload {
  margin-top: 15px;
}
.preImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>