<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 头部警告区 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col class="cat_col">
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectKeys"
            :options="catelist"
            :props="cateProps"
            @change="parentCateChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab标签 -->
      <el-tabs
        class="tab_opt"
        v-model="activeName"
        :disabled="isBtnDisabled"
        @tab-click="handleTabClick"
      >
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button type="primary" size="mini" @click="addDialogVisible=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环tag -->
                <el-tag
                  closable
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleClose(scope.row,index)"
                >{{item}}</el-tag>
                <!-- 输入 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- button -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>

            <!-- 索引列 -->

            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="showDeleteDialog(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性按钮 -->
          <el-button type="primary" size="mini" @click="addDialogVisible=true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环tag -->
                <el-tag
                  closable
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleClose(scope.row,index)"
                >{{item}}</el-tag>
                <!-- 输入 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- button -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>

            <!-- 索引列 -->

            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="showDeleteDialog(scope.row)"
                  size="mini"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      @close="addDialogClosed"
      width="50%"
    >
      <!-- 添加参数表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed"
      width="50%"
    >
      <!-- 添加参数表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="deleteDialogVisible"
      @close="deleteDialogClosed"
      width="50%"
    >
      <!-- 添加参数表单 -->
      <el-form :model="deleteForm" :rules="deleteFormRules" ref="deleteFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="deleteForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ApiPath from "@/api/ApiPath";
export default {
  data() {
    return {
      catelist: [],
      // 级联选择框的配置
      cateProps: {
        value: "cate_id",
        label: "cate_name",
        children: "children",
        expandTrigger: "hover"
      },
      //级联选择框选中的id
      selectKeys: [],
      //被激活的标签名称
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      // 控制添加对话框
      addDialogVisible: false,
      //添加表单数据对象
      addForm: {},
      //添加表单的验证对象
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      //控制修改对话框
      editDialogVisible: false,
      //修改表单数据
      editForm: {},
      //修改表单的验证对象
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      //控制删除对话框
      deleteDialogVisible: false,
      //删除表单数据
      deleteForm: {},
      //删除表单的验证对象
      deleteFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      //控制按钮和input切换
      inputVisible: false,
      //输入文本框内容
      inputValue: ""
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
      console.log(this.selectKeys);
      this.getCateParams();
    },
    //Tab页签点击处理
    handleTabClick() {
      console.log(this.activeName);
      this.getCateParams();
    },
    //获取选中参数的
    async getCateParams() {
      //根据所选分类的id 和当前面板获取分类数据
      const { data: res } = await this.$http.post(ApiPath.goods.paramsPath, {
        id: this.cateId,
        sel: this.activeName
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
      } else {
        this.onlyTableData = res.data;
      }
    },
    //监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //添加表单
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          ApiPath.goods.attributesPath,
          {
            cate_id: this.cateId,
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
            attr_vals: ""
          }
        );

        if (!res.success) {
          this.$message.error("添加参数失败");
        }

        this.getCateParams();

        this.addDialogVisible = false;
      });
    },

    //监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改表单
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          ApiPath.goods.updatePath,
          this.editForm
        );

        if (!res.success) {
          this.$message.error("修改参数失败");
        }

        this.getCateParams();

        this.editDialogVisible = false;
      });
    },

    //显示修改对话框
    showEditDialog(params) {
      this.editForm = params;
      console.log(params);
      this.editDialogVisible = true;
    },

    //监听删除对话框的关闭事件
    deleteDialogClosed() {
      this.$refs.deleteFormRef.resetFields();
    },
    //删除表单
    deleteParams() {
      this.$refs.deleteFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          ApiPath.goods.deletePath,
          this.deleteForm
        );

        if (!res.success) {
          this.$message.error("删除参数失败");
        }

        this.getCateParams();

        this.deleteDialogVisible = false;
      });
    },
    //显示删除对话框
    showDeleteDialog(params) {
      this.deleteForm = params;
      console.log(params);
      this.deleteDialogVisible = true;
    },
    //文本框失去焦点或者 Enter
    handleInputConfirm(role) {
      if (role.inputValue.trim().length === 0) {
        role.inputValue = "";
        role.inputVisible = false;
        return;
      }
      //如果输入的内容不为空,进行添加操作

      role.attr_vals.push(role.inputValue.trim());
      role.inputValue = "";
      role.inputVisible = false;

      //需要发起请求，保存添加
      this.saveAttribute(role);
    },
    //保存可选项
    async saveAttribute(role) {
      var data = {
        attr_id: role.attr_id,
        cate_id: role.cate_id,
        attr_name: role.attr_name,
        attr_sel: role.attr_sel,
        attr_writhe: role.attr_writhe,
        attr_vals: role.attr_vals.join(" ")
      };

      const { data: res } = await this.$http.post(
        ApiPath.goods.updatePath,
        data
      );

      if (!res.success) {
        this.$message.error("修改参数失败");
      }
      this.$message.success("修改参数项成功");
    },
    //删除对应的参数可以选
    handleClose(role, index) {
      role.attr_vals.splice(index, 1);
      //保存删除后操作
      this.saveAttribute(role);
    },
    //展示输入框
    showInput(role) {
      role.inputVisible = true;
      //让文本框自动获得焦点
      // /nextTick 当页面上元素重新被渲染之后，在执行以下方法
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  },
  computed: {
    //如何按钮需要被禁用返回true，否则返回false
    isBtnDisabled() {
      if (this.activeName.length != 3) {
        return true;
      } else {
        return false;
      }
    },
    //当前选中的三级分类id
    cateId() {
      if (this.selectKeys.length == 3) {
        return this.selectKeys[this.selectKeys.length - 1];
      } else {
        return null;
      }
    },
    // 动态计算标题文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
  text-align: left;
  .topCol {
    text-align: left;
  }
}
.tab_opt {
  margin-top: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>