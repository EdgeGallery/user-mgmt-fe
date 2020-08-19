<!--
  -  Copyright 2020 Huawei Technologies Co., Ltd.
  -
  -  Licensed under the Apache License, Version 2.0 (the "License");
  -  you may not use this file except in compliance with the License.
  -  You may obtain a copy of the License at
  -
  -      http://www.apache.org/licenses/LICENSE-2.0
  -
  -  Unless required by applicable law or agreed to in writing, software
  -  distributed under the License is distributed on an "AS IS" BASIS,
  -  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  -  See the License for the specific language governing permissions and
  -  limitations under the License.
  -->

<template>
  <div class="login">
    <div class="loginBox">
      <div class="login-area">
        <p class="login-top">
          {{ $t('login.loginWithUser') }}
        </p>
        <el-input
          id="uname"
          v-model="userData.username"
          type="text"
          :placeholder="$t('login.namePla')"
        />
        <el-input
          id="upass"
          v-model="userData.password"
          type="password"
          :placeholder="$t('login.pwdPla')"
        />
      </div>
      <div class="login-btn">
        <verify
          :success-fun="success"
          :error-fun="error"
          :verify-status="verifyStatus"
        />
      </div>
      <div class="login-btn">
        <el-button
          id="loginBtn"
          type="primary"
          size="medium"
          :loading="loginBtnLoading"
          @click="submitForm()"
        >
          {{ $t('login.login') }}
        </el-button>
      </div>
      <div class="login-tips rt">
        <el-button
          type="text"
          @click="jumpTo('/mecm/register')"
        >
          {{ $t('login.freeSign') }}
        </el-button>
        <el-divider
          direction="vertical"
          v-if="this.enableSms"
        />
        <el-button
          type="text"
          v-if="this.enableSms"
          @click="jumpTo('/mecm/getPwd')"
        >
          {{ $t('login.forgotPwd') }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import Verify from '../components/Verify'
import { api } from '../tools/api.js'
export default {
  name: '',
  components: {
    Verify
  },
  data () {
    return {
      userData: {
        username: '',
        password: ''
      },
      loginBtnLoading: false,
      verifyStatus: false,
      returnUrl: '',
      enableSms: ''
    }
  },
  created () {
    this.keyupSubmit()
  },
  mounted () {
    if (window.location.href.indexOf('return_to=') > -1) {
      this.returnUrl = this.getQueryString('return_to')
      this.enableSms = this.getQueryString('enable_sms')
      if (this.enableSms.indexOf('true') > -1) {
        this.enableSms = true
      } else {
        this.enableSms = false
      }
      let obj = {
        return_url: this.returnUrl,
        enable_sms: this.enableSms,
        login_url: window.location.href.split('#')[1]
      }
      sessionStorage.setItem('obj', JSON.stringify(obj))
    }
  },
  methods: {
    success () {
      this.verifyStatus = true
    },
    error () {
      this.verifyStatus = false
    },
    getQueryString (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let r = window.location.href.split('?')[1].substr(0).match(reg)
      if (r != null) {
        return decodeURIComponent(r[2])
      }
      return null
    },
    submitForm () {
      if (this.verifyStatus) {
        this.loginBtnLoading = true
        let formData = new FormData()
        formData.set('username', this.userData.username)
        formData.set('password', this.userData.password)
        let headers = {
          'Content-Type': 'multipart/form-data',
          'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
        }
        api.login(formData, headers).then(res => {
          window.location.href = decodeURIComponent(JSON.parse(sessionStorage.getItem('obj')).return_url)
        }).catch(error => {
          this.verifyStatus = false
          this.loginBtnLoading = false
          if (error && error.response) {
            switch (error.response.status) {
              case 400:
                error.message = 'Bad request'
                break
              case 401:
                error.message = this.$t('login.loginFail')
                break
            }
            this.$message.error(error.message)
          }
        })
      } else {
        this.$message.error(this.$t('tip.wrongCaptcha'))
      }
    },
    keyupSubmit () {
      document.onkeydown = e => {
        let _key = window.event.keyCode
        if (_key === 13) {
          this.submitForm()
        }
      }
    },
    jumpTo (path) {
      this.$router.push(path)
    }
  }
}
</script>
<style lang="less">
.login {
  height: 100%;
  background: url("./../assets/images/login.png") no-repeat center;
  background-size: cover;
  .loginBox {
    float: right;
    width: 350px;
    height: auto;
    text-align: center;
    margin: 10% 12% 0 0;
    padding: 25px 15px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16),
      0 2px 10px 0 rgba(0, 0, 0, 0.12) !important;
    .login-top {
      text-align: center;
      display: inline-block;
      width: 100%;
      line-height: 18px;
      font-size: 18px;
      font-family: PingFangSC-Medium;
      color: #252b3a;
      margin-bottom: 25px;
    }
    .login-area {
      padding: 0 25px;
      .el-input {
        margin: 15px 0;
      }
    }
    .login-certify {
      padding: 0 25px;
      margin: 25px 0;
      span {
        display: inline-block;
        width: 100%;
        height: 100%;
        line-height: 38px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
  .login-btn {
    padding: 0 25px;
    button {
      width: 100%;
      font-size: 18px;
    }
  }
  .login-tips {
    margin-top: 15px;
    padding: 0 25px;
    span {
      font-size: 12px;
      color: #252b3a;
      line-height: 18px;
    }
  }
}
.el-dialog__body {
  height: 123px;
}
</style>
