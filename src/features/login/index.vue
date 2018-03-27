<template>
  <div class='login-wrap'>
    <login-background></login-background>
    <div class='ms-title'>Monitoring System</div>
    <div class='ms-login'>
      <el-form :model='form' :rules='rules' ref='form' label-width='0px'>
        <el-form-item prop='username'>
          <el-input size='large' v-model='form.username' :disabled='isLogin' placeholder='用户名'></el-input>
        </el-form-item>
        <el-form-item prop='password'>
          <el-input size='large' type='password' placeholder='密码' :disabled='isLogin' v-model='form.password' @keyup.enter.native='login'></el-input>
        </el-form-item>
        <div class='login-btn'>
          <el-button type='primary' size='large' @click="submitForm('form')" :loading='isLogin'>{{isLogin ? '登录...' : '登录'}}</el-button>
        </div>
        <div class="sign-up">
          <router-link :to="{name: 'register'}" tag="span">注册</router-link>
        </div>
      </el-form>
    </div>
    <footer>Copyright(C) 2015-2017 </footer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import loginBackground from './background'

export default {
  components: {
    'login-background': loginBackground
  },
  computed: {
    ...mapGetters(['User'])
  },
  data() {
    return {
      isLogin: false,
      form: {
        username: '18900532225',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapActions(['login']),
    _login() {
      this.isLogin = true
      return (async () => {
        try {
          // await this.login(this.form)
          this.isLogin = false
          this.$router.push({ name: 'map' })
        } catch (err) {
          this.isLogin = false
        }
      })()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
          this._login()
        } else {
          return false
        }
      })
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

.login-wrap {
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

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 160px;
  margin: -130px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
}

.sign-up {
  text-align: right;
  margin-right: 10px;
}

.sign-up span {
  cursor: pointer;
}
</style>
