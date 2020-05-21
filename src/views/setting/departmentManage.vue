<template>
  <div class="main">
    <el-button type="primary" class="mb-10" @click="handleAddBtn()">新增部门</el-button>
    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" border row-key="id">
      <el-table-column prop="name" label="名称" sortable></el-table-column>
      <el-table-column prop="desc" label="描述" sortable></el-table-column>
      <el-table-column prop="createdAt" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEditBtn(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDeleteBtn(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑部门" :visible.sync="dialogEditoorAddFormVisible" @close="handleCancel()" :close-on-click-modal="false">
      <el-form
        ref="departmentForm"
        :model="departmentForm"
        :rules="rules"
        label-width="100px"
        class="demo-departmentForm"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="departmentForm.name" />
        </el-form-item>
        <el-form-item label="部门描述" prop="desc">
          <el-input v-model="departmentForm.desc" />
        </el-form-item>
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            v-model="departmentForm.parentId"
            :options="tableData"
            :props="{
              value: 'id',
              label: 'name'
            }"
            change-on-select
          ></el-cascader>
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
import { getDepartments, update, create } from "@/api/department";
export default {
  name: "departmentManage", // 部门管理界面
  data() {
    return {
      isEdit: false,
      welcomeReport: {
        reportName: "",
        reportId: 1
      },
      tableData: [],
      dialogEditoorAddFormVisible: false,
      isEdit: false,
      departmentForm: {
        id: 0,
        name: "",
        desc: "",
        parentId: [0]
      },
      rules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入部门描述", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments();
      this.tableData = result.data.data;
    },
    // 编辑
    handleEditBtn(index, row) {
      this.isEdit = this.dialogEditoorAddFormVisible = true;
      const department = Object.assign({}, row);
      this.departmentForm = department;
      this.departmentForm.parentId = this.getTreeDeepArr(
        department.parentId,
        this.tableData
      );
      this.disabledSelf(department.id, this.tableData);
    },
    // 编辑的时候，上级部门不能选择自己
    disabledSelf(id, treeData) {
      function childrenEach(childrenData) {
        for (var j = 0; j < childrenData.length; j++) {
          if (id === childrenData[j].id) {
            childrenData[j].disabled = true;
            return;
          } else if (childrenData[j].children) {
            childrenEach(childrenData[j].children);
          }
        }
      }
      childrenEach(treeData);
    },
    // 还原data，将禁用去掉
    deleteDisabled(treeData) {
      function childrenEach(childrenData) {
        for (var j = 0; j < childrenData.length; j++) {
          if (childrenData[j].disabled) {
            delete childrenData[j].disabled;
            return; // 因为只有一有disabled，所以找到一个就可以退出函数了
          } else if (childrenData[j].children) {
            childrenEach(childrenData[j].children);
          }
        }
      }
      childrenEach(treeData);
    },
    getTreeDeepArr(key, treeData) {
      let arr = []; // 在递归时操作的数组
      let returnArr = []; // 存放结果的数组
      let depth = 0; // 定义全局层级
      // 定义递归函数
      function childrenEach(childrenData, depthN) {
        for (var j = 0; j < childrenData.length; j++) {
          depth = depthN; // 将执行的层级赋值 到 全局层级

          arr[depthN] = childrenData[j].id;

          if (childrenData[j].id == key) {
            // returnArr = arr; // 原写法不行, 因此赋值存在指针关系
            returnArr = arr.slice(0, depthN + 1); //将目前匹配的数组，截断并保存到结果数组，
            break;
          } else {
            if (childrenData[j].children) {
              depth++;
              childrenEach(childrenData[j].children, depth);
            }
          }
        }
        return returnArr;
      }
      return childrenEach(treeData, depth);
    },
    // 新增
    handleAddBtn() {
      Object.assign(this.departmentForm, this.$options.data().departmentForm) // 数据恢复魏data中的初始值
      this.dialogEditoorAddFormVisible = true;
    },
    handleUpdateorAddUser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.handleEdit();
          } else {
            this.handleAdd();
          }
        }
      });
    },
    handleEdit() {
      const lastIndex = this.departmentForm.parentId.length - 1;
      this.departmentForm.parentId = this.departmentForm.parentId[lastIndex];
      update(this.departmentForm).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message);
          this.dialogEditoorAddFormVisible = false;
          this.getDepartments();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    handleAdd() {
      const lastIndex = this.departmentForm.parentId.length - 1;
      this.departmentForm.parentId = this.departmentForm.parentId[lastIndex];
      create(this.departmentForm).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message);
          this.dialogEditoorAddFormVisible = false;
          this.getDepartments();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 删除
    handleDeleteBtn() {},
    // 取消
    handleCancel() {
      this.dialogEditoorAddFormVisible = false;
      this.isEdit && this.deleteDisabled(this.tableData);
    }
  }
};
</script>

<style lang="scss" scoped>
.mb-10 {
  margin-bottom: 15px;
}
</style>
