<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="!scope.row.cate_deleted" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cate_level ===0 ">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cate_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="130px"
      >
        <el-form-item label="分类名称：" prop="cate_name">
          <el-input v-model="addCateForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ApiPath from "@/api/ApiPath";
export default {
  data() {
    return {
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //商品分类数据
      catelist: [],
      //
      total: 0,
      //为table指定配置列
      columns: [
        {
          label: "分类名称",
          prop: "cate_name"
        },
        {
          label: "是否有效",
          //表示，将当前列渲染成模板列
          type: "template",
          //表示，当前这一列使用的模板
          template: "isok"
        },
        {
          label: "排序",
          //表示，将当前列渲染成模板列
          type: "template",
          //表示，当前这一列使用的模板
          template: "order"
        },
        {
          label: "操作",
          //表示，将当前列渲染成模板列
          type: "template",
          //表示，当前这一列使用的模板
          template: "opt"
        }
      ],
      //控制显示添加分类对话框
      addCateDialogVisible: false,
      //添加分类的表单对象
      addCateForm: {
        //将要添加的分类名称
        cate_name: "",
        //添加分类父Id
        cate_id: 0,
        //添加分类的等级
        cate_level: 0
      },
      //添加分类表达规则
      addCateFormRules: {
        cate_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      //父级分类列表
      parentCateList: [],
      cascaderProps: {
        value: "cate_id",
        label: "cate_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true
      },
      //选中父子组件绑定数组
      selectKeys: []
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
      this.total = res.data.total;
    },
    //监听pagesize改变事件
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getCateList();
    },
    //监听pagenum改变
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getCateList();
    },
    //显示分类对话框
    showAddCateDialog() {
      this.getParentCateList();
      //展示对话框
      this.addCateDialogVisible = true;
    },
    //保存分类信息
    async saveCateInfo() {
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) return;
        //发生添加分类接口；
      });

      const { data: res } = await this.$http.post(
        ApiPath.goods.addCatePath,
        this.addCateForm
      );

      if (!res.success) {
        this.$message.error("添加分类失败");
      }
      this.$message.success("添加分类成功");
      this.getCateList();
      this.addCateDialogVisible = false;
    },
    //获取父级分类
    async getParentCateList() {
      const { data: res } = await this.$http.get(ApiPath.goods.parentCatePath, {
        params: { type: 2 }
      });

      if (!res.success) {
        this.$message.error("获取父级分类失败");
      }

      this.parentCateList = res.data;
    },
    //选择项发生变化
    parentCateChange() {
      console.log(this.selectKeys);

      if (this.selectKeys.length > 0) {
        //父级分类id变化
        this.addCateForm.cate_id = this.selectKeys[this.selectKeys.length - 1];
        //分类等级赋值
        this.addCateForm.cate_level = this.selectKeys.length;
        return;
      } else {
        this.addCateForm.cate_id = 0;
        this.addCateForm.cate_level = 0;
      }
    },
    //监听关闭添加对话框,重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();

      this.selectKeys = [];
      this.addCateForm.cate_level = 0;
      this.addCateForm.cate_id = 0;
      this.addCateForm.cate_name = "";
    }
  }
};
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>