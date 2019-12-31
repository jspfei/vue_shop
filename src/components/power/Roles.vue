<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleslist" style="width: 100%" border stripe>
        <!-- 展开 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbuttom',i1 == 0 ?'bdtop':'','vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for 循环 嵌套二级循环 -->
                <el-row
                  :class="[i2 == 0 ? '':'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col type="success" :span="6">
                    <el-tag closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3,i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="400px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形组件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleslist: [],
      //控制分配权限对话框显示
      setRightDialogVisible: false,
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      //默认选中的Key数组

      defKeys: [],
      //当前即将分配角色的id
      roleId: ""
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("rights/roles");
      if (!res.success) {
        this.$message.error("获取角色列表失败");
      }
      this.$message.success("获取角色列表成功");

      this.roleslist = res.data;
    },
    //根据id上次权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
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

      console.log("确认删除");
      var data = {
        roleid: role.id,
        rightid: rightId
      };
      const { data: res } = await this.$http.post("rights/delete", data);

      if (!res.success) {
        this.$message.error("删除权限失败");
      }

      this.$message.success("删除权限成功");

      role.children = res.result.children;
    },
    //展示分配权限
    async showSetRightDialog(role) {
      this.roleId = role.id;
      this.role = role;
      //获取所有权限的接口
      const { data: res } = await this.$http.get("rights/tree");

      if (!res.success) {
        this.$message.error("获取权限列表失败");
      }

      // 获取权限树数据保持
      this.rightslist = res.data;

      //递归获取三级节点id
      this.getLeafKeys(role, this.defKeys);

      this.setRightDialogVisible = true;
    },
    //通过递归形式，获取所有当前角色下三级节点id，并保持到defKeys中
    getLeafKeys(node, array) {
      //如果当前节点没有children属性，则为三级节点
      if (!node.children) {
        return array.push(node.id);
      }

      node.children.forEach(item => this.getLeafKeys(item, array));
    },
    //监听权限对话框的关闭
    setRightDialogClosed() {
      this.defKeys = [];
    },
    //点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];

      // const ids = keys.join(",");
      var data = {
        roleid: this.roleId,
        ids: keys
      };
      //获取所有权限的接口
      const { data: res } = await this.$http.post("roles/rights", data);

      if (!res.success) {
        this.$message.error("更改角色权限失败");
      }

      this.roleslist = res.data;

      this.setRightDialogVisible = false;
    }
  }
};
</script>
<style lang="less" scoped>
.el-tag {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}

.bdbuttom {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>