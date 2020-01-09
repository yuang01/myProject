<template>
  <div class="main">
    <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="formInline.name" placeholder="用户名" clearable />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="formInline.sex" placeholder="性别" clearable>
          <el-option label="男" :value="0" />
          <el-option label="女" :value="1" />
        </el-select>
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
    <el-button type="primary" class="mb-10" @click="addUser">新增用户</el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        align="center"
        label="用户名"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}<span style="color:red;margin-left:5px;">{{ scope.row.name === name ? '(我自己)' : '' }}</span></span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="头像"
      >
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="" width="40px">
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="性别"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.sex === 0 ? '男' : '女' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="介绍"
        width="250"
      >
        <template slot-scope="scope">
          <span class="nowrap" :title="scope.row.introduction">{{ scope.row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建日期"
        width="180"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 5px">{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="角色"
      >
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in scope.row.roles" :key="index" size="medium" style="margin-right: 5px;">{{ item.desc }}</el-tag>
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
    <el-pagination
      class="mt-10"
      background
      layout="prev, pager, next"
      :current-page.sync="pagination.page"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      @current-change="changePage"
    />
    <!-- 编辑弹框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogUserEditoorAddFormVisible">
      <el-form ref="userForm" :model="userForm" :rules="rules" label-width="100px" class="demo-userForm">
        <el-form-item label="用户头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userForm.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属角色">
        <el-select v-model="userForm.roles" multiple placeholder="请选择所属角色">
          <el-option v-for="(item, index) in roleList" :key="index" :label="item.desc" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="用户简介" prop="introduction">
          <el-input v-model="userForm.introduction" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="handleUpdateorAddUser('userForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { allUser, destroy, updateUser, createUser } from '@/api/user'
import { getRoles } from '@/api/rolesManage'
export default {
  name: 'SetUsers',
  data() {
    return {
      action: process.env.VUE_APP_BASE_API + '/uploadfile',
      tableData: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      formInline: {
        name: '',
        sex: '',
        createdDate: []
      },
      userForm: {
        name: '',
        password: '',
        introduction: '',
        avatar: '',
        sex: '',
        roles: []
      },
      roleList: [],
      rules: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, message: '长度在 3 个字符以上', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, message: '长度在 3 个字符以上', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择用户性别', trigger: 'blur' }
        ]
      },
      dialogUserEditoorAddFormVisible: false,
      isEdit: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getAllUser();
    this.getRoles();
  },
  methods: {
    getRoles() {
      getRoles().then(res => {
        if (res.data.code === 200) {
          this.roleList = res.data.data;
        }
      })
    },
    handleCancel() {
      this.dialogUserEditoorAddFormVisible = false
    },
    addUser() {
      this.isEdit = false
      Object.assign(this.userForm, this.$options.data().userForm) // 数据恢复魏data中的初始值
      this.dialogUserEditoorAddFormVisible = true
    },
    handleEdit(index, row) {
      const user = Object.assign({}, row)
      const { id, name, password, introduction, avatar, sex } = user;
      const roles = user.roles.map(el => Number(el.id));
      this.userForm = { id, name, password, introduction, avatar, sex, roles };
      this.dialogUserEditoorAddFormVisible = this.isEdit = true
    },
    // 回显头像
    handleAvatarSuccess(res, file) {
      this.userForm.avatar = file.response.data
    },
    // 头像上传之前的处理
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    handleDelete(index, row) {
      this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        destroy(row.id).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getAllUser()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async getAllUser() {
      const { page, pageSize } = this.pagination
      const { sex, name, createdDate } = this.formInline
      const params = {
        page,
        pageSize,
        sex,
        name,
        createdDate: JSON.stringify(createdDate)
      }
      const result = await allUser(params)
      this.tableData = result.data.data.rows
      this.pagination.total = result.data.data.count
    },
    changePage(val) {
      this.getAllUser()
    },
    onSubmit() {
      this.pagination.page = 1
      this.getAllUser()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.onSubmit()
    },
    handleUpdateorAddUser() {
      if (this.isEdit) {
        this.handleUpdateUser('userForm')
      } else {
        this.handleAddUser('userForm')
      }
    },
    // 新增用户
    handleAddUser(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createUser(this.userForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
              this.dialogUserEditoorAddFormVisible = false
              this.onSubmit()
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改用户
    handleUpdateUser(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateUser(this.userForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
              this.dialogUserEditoorAddFormVisible = false
              this.onSubmit()
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.nowrap {
  width: 100%;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.mt-10 {
  margin-top: 10px;
}
.mb-10 {
  margin-bottom: 10px;
}
</style>
