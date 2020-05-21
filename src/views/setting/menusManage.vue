<template>
  <div class="main">
    <el-button type="primary" class="mb-10" @click="showAddMenu">新增菜单</el-button>
    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" border row-key="id">
      <el-table-column prop="label" label="名称" sortable></el-table-column>
      <el-table-column prop="name" label="编码" sortable></el-table-column>
      <el-table-column prop="component" label="组件"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column label="是否是菜单">
        <template slot-scope="scope">
          {{scope.row.isMenu === 1 ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column label="是否隐藏">
        <template slot-scope="scope">
          {{scope.row.hidden === 1 ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="scope">
          {{scope.row.index}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEditBtn(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDeleteBtn(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="isEdit ? '编辑菜单' : '新增菜单'" :visible.sync="dialogMenuEditorAddFormVisible" @close="handleCancel()" :close-on-click-modal="false">
      <el-form ref="menuForm" :model="menuForm" :rules="rules" label-width="100px" class="demo-menuForm">
        <el-form-item label="名称" prop="title">
          <el-input v-model="menuForm.title" placeholder="例如：用户管理"/>
        </el-form-item>
        <el-form-item label="编号" prop="name">
          <el-input v-model="menuForm.name" placeholder="例如：setUsers"/>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="menuForm.path" placeholder="例如：setUsers"/>
        </el-form-item>
        <el-form-item label="组件" prop="component">
          <el-input v-model="menuForm.component" placeholder="例如：setUsers"/>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="例如：user"/>
        </el-form-item>
        <el-form-item label="是否是菜单" prop="isMenu">
          <el-radio-group v-model="menuForm.isMenu">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden">
          <el-radio-group v-model="menuForm.hidden">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="index">
          <el-input-number v-model="menuForm.index" />
        </el-form-item>
        <el-form-item label="父菜单" prop="parentId">
          <el-cascader
            style="width:100%;"
            v-model="menuForm.parentId"
            :options="tableData"
            :props="{
              value: 'id',
              label: 'label'
            }"
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="handleUpdateorAddMenu('menuForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenus, addMenu, getMenuById, updateMenu, deleteMenu } from '@/api/menus';
export default {
  name: 'menusManage', // 菜单管理界面
  data() {
    return {
      tableData: [],
      isEdit: false,
      dialogMenuEditorAddFormVisible: false,
      menuForm: {
        title: '',
        name: '',
        path: '',
        component: '',
        icon: '',
        isMenu: 1,
        hidden: 0,
        index: 1,
        parentId: [0]
      },
      rules: {
        title: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入编码', trigger: 'blur' },
        ],
        path: [
          { required: true, message: '请输入路径', trigger: 'blur' },
        ],
        component: [
          { required: true, message: '请输入组件', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getMenus();
  },
  methods: {
    getMenus() {
      getMenus().then(res => {
        this.tableData = res.data.data;
      })
    },
    // 新增菜单
    showAddMenu() {
      Object.assign(this.menuForm, this.$options.data().menuForm) // 数据恢复魏data中的初始值
      this.dialogMenuEditorAddFormVisible = true;
    },
    handleCancel() {
      this.dialogMenuEditorAddFormVisible = false;
      this.isEdit && this.deleteDisabled(this.tableData);
    },
    handleUpdateorAddMenu(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.handleEdit();
          } else {
            this.handleAdd();
          }
        }
      });
    },
    handleAdd() {
      let data = { ...this.menuForm };
      const lastIndex = data.parentId.length - 1;
      data.parentId = data.parentId[lastIndex];
      addMenu(data).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message);
          this.dialogMenuEditorAddFormVisible = false;
          this.getMenus();
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    handleEdit() {
      let data = { ...this.menuForm };
      const lastIndex = data.parentId.length - 1;
      data.parentId = data.parentId[lastIndex];
      updateMenu(data).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message);
          this.dialogMenuEditorAddFormVisible = false;
          this.getMenus();
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    handleEditBtn(index, row) {
      const params = {
        id: row.id
      };
      getMenuById(params).then(res => {
        this.isEdit = this.dialogMenuEditorAddFormVisible = true;
        let menu = res.data.data;
        menu.parentId = this.getTreeDeepArr(
          menu.parentId,
          this.tableData
        );
        this.menuForm = menu;
        this.disabledSelf(row.id, this.tableData);
      })
    },
    // 编辑的时候，上级菜单不能选择自己
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
    handleDeleteBtn(index, row) {
      this.$confirm(`是否删除${row.label}菜单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu({id: row.id}).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message);
            this.getMenus();
          } else {
            this.$message.error('删除失败');
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mb-10 {
  margin-bottom: 15px;
}
</style>