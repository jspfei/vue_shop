<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加 -->

      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" width="180px">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="eidtDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidtDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%">
      <div class="cateClass">
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleslist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //校验邮箱
    var checkEmail = (rule, val, cb) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(val)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };

    //验证手机号
    var checkMobile = (rule, val, cb) => {
      //验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(val)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      //获取用户列表的参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 4,
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addFormRef: {},
      //添加表单规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3到10字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码的长度在6到15字符之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //控制修改用户对话
      eidtDialogVisible: false,
      //查询用户信息
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //设置分配角色
      setRoleDialogVisible: false,
      //需要分配角色用户信息
      userInfo: {},
      //角色列表
      roleslist: [],
      //选中的角色Id
      selectedRoleId: ""
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.post("users", {
        params: this.queryInfo
      });
      if (!res.success) return this.$message.error("获取用户列表出错");
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    //监听pagesize 改变
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    //监听页面值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //监听
    async userStateChange(user) {
      var params = {
        userid: user.id,
        state: user.mg_state
      };
      const { data: res } = await this.$http.post("users/updatestate", params);

      if (!res.success) {
        user.mg_state = !user.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success(res.msg);
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        //提交添加用户
        const { data: res } = await this.$http.post(
          "users/adduser",
          this.addForm
        );

        if (!res.success) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.addDialogVisible = false;

        this.userlist = res.data.users;
        this.total = res.data.total;
      });
    },
    //显示用户修改对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.post("users/getuser", { id: id });

      if (!res.success) {
        this.$message.error("查询用户失败");
      }
      this.editForm = res.data.users[0];
      console.log(JSON.stringify(this.editForm));

      this.eidtDialogVisible = true;
    },
    //修改用户信息
    editUserInfo() {
      //进行form预校验
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        //提交修改用户
        var data = {
          id: this.editForm.id,
          email: this.editForm.email,
          mobile: this.editForm.mobile
        };

        const { data: res } = await this.$http.post("users/edit", data);

        if (!res.success) {
          this.$message.error("修改用户信息失败");
        }

        this.$message.success("修改用户信息成功");

        this.eidtDialogVisible = false;

        this.userlist = res.data.users;
        this.total = res.data.total;
      });
    },
    //删除用户根据id
    async removeUserById(id) {
      //询问用户
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult != "confirm") {
        return this.$message.info("已经取消删除");
      }

      const { data: res } = await this.$http.post("users/delete", { id: id });
      if (!res.success) {
        this.$message.error("删除用户失败");
      }

      this.$message.success("删除用户成功");

      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    //显示分配角色对话框
    async showRoleDialog(userInfo) {
      this.userInfo = userInfo;

      const { data: res } = await this.$http.get("rights/roles");
      if (!res.success) {
        this.$message.error("获取角色列表失败");
      }

      this.roleslist = res.data;

      this.setRoleDialogVisible = true;
    },
    //保存角色信息
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        this.$message.error("请选择角色");
      }
      var data = {
        userid: this.userInfo.id,
        roleid: this.selectedRoleId
      };
      const { data: res } = await this.$http.post("users/role", data);
      if (!res.success) {
        this.$message.error("更新用户角色失败");
      }
      this.$message.success("更新用户角色成功");

      //重新刷新用户信息
      this.getUserList();

      this.setRoleDialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.cateClass {
  vertical-align: left;
}
</style>