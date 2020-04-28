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

    <el-dialog :title="isEdit ? '编辑菜单' : '新增菜单'" :visible.sync="dialogMenuEditorAddFormVisible" :close-on-click-modal="false">
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
import { getMenus, addMenu } from '@/api/menus';
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
      this.dialogMenuEditorAddFormVisible = true;
    },
    handleCancel() {

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

    },
    handleEditBtn(index, row) {

    },
    handleDeleteBtn(index, row) {

    }
  }
}
</script>

<style>

</style>