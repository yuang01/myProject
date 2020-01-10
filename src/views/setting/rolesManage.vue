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
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
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
        <el-form-item label="所属部门" prop="departmentId">
          <el-cascader
            style="width:100%;"
            v-model="roleForm.departmentId"
            :options="departmentsData"
            :props="{
              value: 'id',
              label: 'name'
            }"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :data="menusData"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            ref="tree"
            :default-checked-keys="defaultCheckKeys"
            @check-change="handleNodeClick">
          </el-tree>
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
import { getMenus, getMenusByRoleId } from '@/api/menus';
import { getRoles, updateRole, createRole, destroyRole } from '@/api/rolesManage';
import { getDepartments } from "@/api/department";
export default {
  name: 'rolesManage',
  data() {
    return {
      tableData: [],
      departmentsData:[],
      roleForm: {
        name: '',
        desc: '',
        departmentId: [0],
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
    this.getDepartments();
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments();
      this.departmentsData = result.data.data;
    },
    async getRoles() {
      const result = await getRoles();
      this.tableData = result.data.data;
    },
    handleEdit(index, row) {
      const role = Object.assign({}, row);
      this.roleForm = role;
      this.roleForm.departmentId = this.getTreeDeepArr(
        role.departmentId,
        this.departmentsData
      );
      this.dialogRoleEditorAddFormVisible = this.isEdit = true;
      this.getCheckMenusByRoleId(row.id); // 得到当前激活的菜单
    },
    // 向上得到父节点, 传入最小的子节点，和数组
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
    handleNodeClick(data) {
      console.log(data);
    },
    getMenus() { // 得到所有菜单
      getMenus().then(res => {
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
          const departmentId = this.roleForm.departmentId[this.roleForm.departmentId.length - 1];
          const data = {
            id: this.roleForm.id,
            name: this.roleForm.name,
            desc: this.roleForm.desc,
            checkMenus,
            departmentId
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
          const checkMenus = this.$refs.tree.getCheckedKeys();
          const departmentId = this.roleForm.departmentId[this.roleForm.departmentId.length - 1];
          const data = {
            id: this.roleForm.id,
            name: this.roleForm.name,
            desc: this.roleForm.desc,
            checkMenus,
            departmentId
          }
          createRole(data).then(res => {
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
      this.getMenus();
      Object.assign(this.roleForm, this.$options.data().roleForm) // 数据恢复魏data中的初始值
      this.defaultCheckKeys = [];
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