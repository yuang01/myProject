<template>
  <div class="main">
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
      <el-table-column label="图标">
        <template slot-scope="scope">
          {{scope.row.meta.icon}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEditBtn(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDeleteBtn(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getMenus } from '@/api/menus';
export default {
  name: 'menusManage', // 菜单管理界面
  data() {
    return {
      tableData: []
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
    handleEditBtn(index, row) {

    },
    handleDeleteBtn(index, row) {

    }
  }
}
</script>

<style>

</style>