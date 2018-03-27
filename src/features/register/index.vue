<template>
  <div class='register-wrap'>
    <div class='ms-title'>注册</div>
    <div class='ms-register'>
      <el-form :model='ruleForm' :rules='rules' ref='ruleForm' label-width='80px'>
        <el-form-item label="用户名" prop='username'>
          <el-input size='large' v-model='ruleForm.username' :disabled='isRegistering' placeholder='用户名'></el-input>
        </el-form-item>
        <el-form-item label="密码" prop='pass' required>
          <el-input size='large' type='password' placeholder='密码' :disabled='isRegistering' v-model='ruleForm.pass'></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop='checkPass' required>
          <el-input size='large' type='password' placeholder='重复密码' :disabled='isRegistering' v-model='ruleForm.checkPass'></el-input>
        </el-form-item>
        <div class='register-btn'>
          <el-button type='primary' size='large' @click='signUp' :loading='isRegistering'>{{isRegistering ? '注册中...' : '注册'}}</el-button>
        </div>
        <div class="to-login">
          <router-link :to="{name: 'login'}" tag="span">已有账号，直接登录</router-link>
        </div>
      </el-form>
    </div>
    <footer>Copyright(C) 2015-2017 </footer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {},
  computed: {
    ...mapGetters(['User'])
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isRegistering: false,
      ruleForm: {
        username: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在2到20个字符', trigger: 'blur' }
        ],
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapActions({
      submit: 'login/submit'
    }),
    signUp() {
      this.isRegistering = true
      return (async () => {
        try {
          await this.submit(this.ruleForm)
          this.isRegistering = false
          this.$router.push({ name: 'login' })
        } catch (err) {
          this.isRegistering = false
        }
      })()
    }
  }
}
</script>
<style scoped>
footer {
  width: 100%;
  height: 50px;
  line-height: 50px;
  position: fixed;
  bottom: 0px;
  right: 0px;
  font-size: 14px;
  color: #aebdc9;
}

.register-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}

.ms-title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -180px;
  text-align: center;
  font-size: 30px;
}

.ms-register {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 160px;
  margin: -130px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
}

.register-btn {
  text-align: center;
}

.register-btn button {
  width: 100%;
  height: 36px;
}

.to-login {
  text-align: right;
  margin-right: 10px;
}

.to-login span {
  cursor: pointer;
}
</style>
