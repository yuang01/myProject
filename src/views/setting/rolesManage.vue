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
    </el-table>
  </div>
</template>

<script>
import { getRoutes } from '@/api/rolesManage';
export default {
  name: 'rolesManage',
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getRoutes();
  },
  methods: {
    async getRoutes() {
      const result = await getRoutes();
      this.tableData = result.data.data;
      console.log('result', result);
    }
  }
}
</script>

<style>

</style>