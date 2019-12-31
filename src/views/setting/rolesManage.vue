<template>
  <div class="main">
    <el-button type="primary" class="mb-10" @click="addRole">新增角色</el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="name"
        align="center"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="desc"
        align="center"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="createdAt"
        align="center"
        label="日期">
      </el-table-column>
      <el-table-column
        align="center"
        label="所属部门">
        <template slot-scope="scope">
          <span v-if="scope.row.department">{{ scope.row.department.name }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-permission="['admin']"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            v-permission="['admin']"
            :disabled="scope.row.name.includes('admin')"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="isEdit ? '编辑角色' : '新增角色'" :visible.sync="dialogRoleEditorAddFormVisible" :close-on-click-modal="false">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px" class="demo-roleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="roleForm.desc" />
        </el-form-item>
      </el-form>
      <div class="ml-50">
        <h3>编辑菜单权限</h3>
        <el-tree
          :data="menusData"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          ref="tree"
          :default-checked-keys="defaultCheckKeys"
          @check-change="handleNodeClick">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="handleUpdateorAddRole('roleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenus, getMenusByRoleId } from '@/api/menus';
import { getRoles, updateRole, createRole, destroyRole } from '@/api/rolesManage';
export default {
  name: 'rolesManage',
  data() {
    return {
      tableData: [],
      roleForm: {
        name: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        desc: [
          { required: true, message: '请输入描述', trigger: 'blur' },
        ],
      },
      dialogRoleEditorAddFormVisible: false,
      isEdit: false,
      menusData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultCheckKeys: []
    }
  },
  created() {
    this.getRoles();
  },
  methods: {
    async getRoles() {
      const result = await getRoles();
      this.tableData = result.data.data;
    },
    handleEdit(index, row) {
      const role = Object.assign({}, row);
      this.roleForm = role;
      this.dialogRoleEditorAddFormVisible = this.isEdit = true;
      this.getCheckMenusByRoleId(row.id); // 得到当前激活的菜单
    },
    handleNodeClick(data) {
      console.log(data);
    },
    getMenus() { // 得到所有菜单
      getMenus().then(res => {
        console.log('res', res);
        this.menusData = res.data.data;
      })
    },
    getCheckMenusByRoleId(id) {
      getMenusByRoleId(id).then(res => {
        this.defaultCheckKeys = res.data.data;
        this.getMenus();
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        destroyRole(row.id).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getRoles()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleUpdateorAddRole(formName) {
      if (this.isEdit) {
        this.handleUpdateRole(formName);
      } else {
        this.handleAddRole(formName);
      }
    },
    handleUpdateRole(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const checkMenus = this.$refs.tree.getCheckedKeys();
          const data = {
            id: this.roleForm.id,
            name: this.roleForm.name,
            desc: this.roleForm.desc,
            checkMenus
          }
          updateRole(data).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message);
              this.dialogRoleEditorAddFormVisible = false;
              this.getRoles();
            } else {
              this.$message.error(res.data.message)
            }
          });
        }
      });
    },
    handleAddRole(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createRole(this.roleForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message);
              this.dialogRoleEditorAddFormVisible = false;
              this.getRoles();
            } else {
              this.$message.error(res.data.message)
            }
          });
        }
      });
    },
    handleCancel() {
      this.dialogRoleEditorAddFormVisible = false;
    },
    addRole() {
      this.isEdit = false;
      Object.assign(this.roleForm, this.$options.data().roleForm) // 数据恢复魏data中的初始值
      this.dialogRoleEditorAddFormVisible = true;
    }
  }
}
</script>

<style lang="scss">
.ml-50 {
  margin-left: 50px;
}
</style>