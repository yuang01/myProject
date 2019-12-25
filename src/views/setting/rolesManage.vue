<template>
  <div class="main">
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
          <span v-if="scope.row.department">{{ scope.row.department.desc }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="handleUpdateorAddRole('roleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, updateRole } from '@/api/rolesManage';
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
    },
    handleDelete(index, row) {

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
          updateRole(this.roleForm).then(res => {
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

    },
    handleCancel() {
      this.dialogRoleEditorAddFormVisible = false;
    }
  }
}
</script>

<style>

</style>