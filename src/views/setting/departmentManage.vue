<template>
  <div class="main">
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
    </el-table>
  </div>
</template>

<script>
import { getDepartments } from '@/api/department'
export default {
  name: 'departmentManage', // 部门管理界面
  data() {
    return {
      tableData: [],
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>