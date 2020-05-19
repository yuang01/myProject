<template>
  <div class="app-container">
    <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formInline.title" placeholder="标题" clearable />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="formInline.author" placeholder="作者" clearable />
      </el-form-item>
      <el-form-item label="创建时间" prop="createdDate">
        <el-date-picker
          v-model="formInline.createdDate"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="resetForm('formInline')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="日期">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="重要性">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>

      <!-- <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column> -->

      <el-table-column min-width="300px" label="标题">
        <template slot-scope="{row}">
          <router-link :to="{path: '/article/editArticle', query: { id: row.id, status: '编辑' }}" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="toEdit(scope.row.id)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="toDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, deleteArticle } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      formInline: {
        title: '',
        author: '',
        createdDate: []
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    toDelete(id) {
      this.$confirm('是否删除该文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(id).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    toEdit(id) {
      this.$router.push(
        { path: '/article/editArticle', query: { id, status: '编辑' } }
      )
    },
    getList() {
      this.listLoading = true
      const { page, limit } = this.listQuery
      const { title, author, createdDate } = this.formInline
      const params = {
        page,
        limit,
        title,
        author,
        createdDate: JSON.stringify(createdDate)
      }
      fetchList(params).then(response => {
        this.list = response.data.data.rows
        this.total = response.data.data.count
        this.listLoading = false
      })
    },
    onSubmit() {
      this.getList();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.onSubmit()
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
