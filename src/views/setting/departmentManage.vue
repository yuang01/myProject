<template>
  <div class="main">
    <select-tree
      v-if="tableData.length > 0"
      :props="props"
      :options="tableData"
      :value="valueId"
      :clearable="isClearable"
      :accordion="isAccordion"
      @getValue="getValue($event)"
      height="200"
    ></select-tree>
    {{valueId}}
    <el-button type="primary" class="mb-10" @click="addDepartment()">新增部门</el-button>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      border
      row-key="id">
      <el-table-column
        prop="name"
        label="名称"
        sortable>
      </el-table-column>
      <el-table-column
        prop="desc"
        label="描述"
        sortable>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="创建时间">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEditBtn(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDeleteBtn(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑部门" :visible.sync="dialogEditoorAddFormVisible">
      <el-form ref="departmentForm" :model="departmentForm" :rules="rules" label-width="100px" class="demo-departmentForm">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="departmentForm.name" />
        </el-form-item>
        <el-form-item label="部门描述" prop="desc">
          <el-input v-model="departmentForm.desc" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="handleUpdateorAddUser('departmentForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments, update } from '@/api/department'
export default {
  name: 'departmentManage', // 部门管理界面
  data() {
    return {
      tableData: [],
      dialogEditoorAddFormVisible: false,
      isEdit: false,
      departmentForm: {
        id: 0,
        name: '',
        desc: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 3, message: '长度在 3 个字符以上', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入部门描述', trigger: 'blur' }
        ]
      },
    }
  },
  created() {
    this.getDepartments();
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments();
      this.tableData = result.data.data;
      console.log('res', result.data.data);
    },
    // 编辑
    handleEditBtn(index, row) {
      this.isEdit = this.dialogEditoorAddFormVisible = true;
      const department = Object.assign({}, row);
      this.departmentForm = department;
    },
    // 新增
    handleAddBtn() {

    },
    handleUpdateorAddUser(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.handleEdit();
          } else {
            this.handleAdd();
          }
        }
      })
    },
    handleEdit() {
      update(this.departmentForm).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message);
          this.dialogEditoorAddFormVisible = false;
          this.getDepartments();
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    handleAdd() {

    },
    // 删除
    handleDeleteBtn() {

    },
    // 取消
    handleCancel() {
      this.dialogEditoorAddFormVisible = false;
    }
  },
}
</script>

<style lang="scss" scoped>

</style>