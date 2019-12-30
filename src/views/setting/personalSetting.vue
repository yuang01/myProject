<template>
  <div class="main">
    <div class="setUser">
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
        <el-form-item label="用户简介" prop="introduction">
          <el-input v-model="userForm.introduction" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('userForm')">保存</el-button>
          <el-button @click="resetForm('userForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { updateUser } from '@/api/user'
import { Base64 } from 'js-base64';
export default {
  name: 'PersonalSetting', // 个人设置页面
  data() {
    return {
      action: process.env.VUE_APP_BASE_API + '/uploadfile',
      userForm: {
        name: '',
        password: '',
        introduction: '',
        avatar: '',
        sex: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, message: '长度在 3 个字符以上', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, message: '长度在 3 个字符以上', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '请上传用户头像', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择用户性别', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCurUser()
  },
  methods: {
    // 获取用户
    async getCurUser() { // 得到用户信息
      const user = await this.$store.dispatch('user/getInfo')
      this.userForm = user
    },
    // 回显头像
    handleAvatarSuccess(res, file) {
      // this.userForm.avatar = URL.createObjectURL(file.raw); // blob对象
      this.userForm.avatar = file.response.data
      console.log('aa', this.userForm.avatar)
    },
    // 头像上传之前的处理
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 提交表单（更新用户）
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateUser(this.userForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
              this.getCurUser() // 更新用户，或者直接执行下面的登出操作
              // this.logout(); // 让用户重新登录
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
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 登出
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 20px;
  width: 100%;
  height: 100%;
  .setUser {
    width: 50%;
    margin: 0 auto;
  }
}
</style>
