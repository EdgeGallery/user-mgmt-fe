<!--
  -  Copyright 2020-2021 Huawei Technologies Co., Ltd.
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
    <div
      class="loginBox"
    >
      <div
        class="login-area"
        v-if="!hasLogin"
      >
        <p class="login-top">
          {{ $t('login.loginWithUser') }}
        </p>
        <el-form
          :model="userData"
          :rules="rules"
          ref="userData"
        >
          <el-form-item
            prop="username"
          >
            <el-input
              id="uname"
              v-model="userData.username"
              type="text"
              :placeholder="$t('login.namePla')"
              clearable
              ref="userNameInput"
            />
          </el-form-item>
          <el-form-item
            prop="password"
          >
            <el-input
              id="upass"
              v-model="userData.password"
              type="password"
              :placeholder="$t('login.pwdPla')"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
      <Verify
        v-if="!hasLogin"
        @validateVerifyCodeSuccess="validateVerifyCodeSuccess"
      />
      <div
        class="login-area"
        v-if="hasLogin"
      >
        <p
          style="height: 120px;line-height: 120px;"
        >
          {{ username }}{{ $t('login.hasLogin') }}
        </p>
      </div>
      <div
        class="login-btn"
        v-if="!hasLogin"
      >
        <el-button
          id="loginBtn"
          type="primary"
          size="medium"
          :loading="loginBtnLoading"
          @click="submitForm('userData')"
        >
          {{ $t('login.login') }}
        </el-button>
      </div>
      <div
        class="login-btn"
        style="margin-top:130px;"
        v-if="hasLogin"
      >
        <el-button
          id="logoutBtn"
          type="primary"
          size="medium"
          :loading="logoutBtnLoading"
          @click="logout()"
        >
          {{ $t('login.logout') }}
        </el-button>
      </div>
      <div class="login-tips rt">
        <el-button
          type="text"
          v-if="!hasLogin && !this.enableExternalIam"
          @click="jumpTo('/mecm/register')"
        >
          {{ $t('login.freeSign') }}
        </el-button>
        <el-divider
          direction="vertical"
          v-if="!hasLogin && !this.enableExternalIam && (this.enableSms || this.enableMail)"
        />
        <el-button
          type="text"
          v-if="!hasLogin && !this.enableExternalIam && (this.enableSms || this.enableMail)"
          @click="jumpTo('/mecm/getPwd')"
        >
          {{ $t('login.forgotPwd') }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { api } from '../tools/api.js'
import { ERRCODE_VERIFYCODE_WRONG } from '../tools/util.js'
import Verify from '../components/Verify.vue'
export default {
  name: 'Login',
  components: {
    Verify
  },
  data () {
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('verify.usernameTip')))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('verify.passwordTip')))
      } else {
        callback()
      }
    }
    return {
      userData: {
        username: '',
        password: ''
      },
      verificationCode: '',
      rules: {
        username: [
          { validator: validateName }
        ],
        password: [
          { validator: validatePass }
        ]
      },
      username: '',
      hasLogin: false,
      loginStatusChanged: false,
      loginBtnLoading: false,
      logoutBtnLoading: false,

      returnUrl: '',
      enableSms: false,
      enableMail: false,
      enableExternalIam: false,
      getLoginInfoInterval: null
    }
  },
  watch: {
    '$i18n.locale': function () {
      this.$refs['userData'].fields.forEach(item => {
        if (item.validateState === 'error') {
          this.$refs['userData'].validateField(item.labelFor)
        }
      })
    }
  },
  created () {
    this.keyupSubmit()
  },
  destroyed () {
    this.clearKeyEvent()
  },
  mounted () {
    api.loginInfo().then(res => {
      this.username = res.data.username
      if (this.username) {
        this.hasLogin = true
      }

      this.startGetLoginInfoInterval()
    }).catch(() => {
      this.startGetLoginInfoInterval()
    })
    if (window.location.href.indexOf('return_to=') > -1) {
      this.returnUrl = this.getQueryString('return_to')
      this.enableSms = this.getQueryString('enable_sms').indexOf('true') > -1
      this.enableMail = this.getQueryString('enable_mail').indexOf('true') > -1
      this.enableExternalIam = this.getQueryString('enable_external_iam').indexOf('true') > -1
      let _uiCtrlInfo = {
        return_url: this.returnUrl,
        enable_sms: this.enableSms,
        enable_mail: this.enableMail,
        enable_external_iam: this.enableExternalIam,
        login_url: window.location.href.split('#')[1]
      }
      sessionStorage.setItem('uiCtrlInfo', JSON.stringify(_uiCtrlInfo))
    }
    let userInfo = JSON.parse(sessionStorage.getItem('userinfo'))
    if (userInfo) {
      this.userData.username = userInfo.username
    }
  },
  beforeDestroy () {
    this.clearInterval()
  },
  methods: {
    startGetLoginInfoInterval () {
      this.getLoginInfoInterval = setInterval(() => {
        this.loginStatusChanged = false
        api.loginInfo().then(res => {
          let _userName = res.data.username
          let _hasLogin = false
          if (_userName) {
            _hasLogin = true
          }

          if (_userName !== this.username || _hasLogin !== this.hasLogin) {
            this.loginStatusChanged = true
          }

          this.username = _userName
          this.hasLogin = _hasLogin

          this.autoJumpToApp()
          this.refreshPage()
        }).catch(() => {
          if (this.hasLogin) {
            this.loginStatusChanged = true
          }
          this.username = ''
          this.hasLogin = false
          if (this.loginStatusChanged) {
            location.reload()
          }
        })
      }, 3000)
    },
    autoJumpToApp () {
      if (!this.loginStatusChanged) {
        return
      }
      if (!this.hasLogin || this.username === 'guest') {
        return
      }
      let _returnUrl = this.getReturnUrl()
      if (_returnUrl) {
        window.location.href = decodeURIComponent(_returnUrl)
      }
    },
    refreshPage () {
      if (!this.loginStatusChanged) {
        return
      }
      if (!this.hasLogin || this.username !== 'admin') {
        return
      }
      let _returnUrl = this.getReturnUrl()
      if (!_returnUrl) {
        location.reload()
      }
    },
    clearInterval () {
      clearTimeout(this.getLoginInfoInterval)
      this.getLoginInfoInterval = null
    },
    getQueryString (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let r = window.location.href.split('?')[1].substr(0).match(reg)
      if (r != null) {
        return decodeURIComponent(r[2])
      }
      return null
    },
    getReturnUrl () {
      let _uiCtrlInfo = sessionStorage.getItem('uiCtrlInfo')
      if (_uiCtrlInfo) {
        return JSON.parse(_uiCtrlInfo).return_url
      }

      return ''
    },
    submitForm (formName) {
      this.$refs[formName].validate()
      this.$root.$emit('validateVerifyForm')
    },
    validateVerifyCodeSuccess (verifyCode) {
      this.$refs['userData'].validate((valid) => {
        if (!valid) {
          return false
        }

        this.verificationCode = verifyCode
        this.submitLogin()
      })
    },
    submitLogin () {
      this.loginBtnLoading = true
      let formData = new FormData()
      Object.keys(this.userData).forEach(item => {
        formData.append(item, this.userData[item])
      })
      let headers = {
        'Content-Type': 'multipart/form-data',
        'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
      }
      api.login(formData, this.verificationCode, headers).then(res => {
        this.loginSuccess(res)
      }).catch(error => {
        this.loginBtnLoading = false
        this.loginFailed(error)
      })
    },
    resetLogin () {
      this.$refs['userData'].resetFields()
      this.$root.$emit('resetVerifyForm')
    },
    loginSuccess (response) {
      if (response && response.headers && response.headers.pwmodiscene) {
        localStorage.setItem('pwmodiscene-' + this.$cookies.get('XSRF-TOKEN'), response.headers.pwmodiscene)
      }
      let _returnUrl = this.getReturnUrl()
      if (_returnUrl) {
        window.location.href = decodeURIComponent(_returnUrl)
      } else {
        location.reload()
      }
    },
    loginFailed (error) {
      if (error && error.response) {
        let _ignoreErrorHint = false
        let _errorMsg = error.message

        switch (error.response.status) {
          case 400: {
            _errorMsg = 'Bad request'
            if (error.response.data && error.response.data.code && error.response.data.code === ERRCODE_VERIFYCODE_WRONG) {
              _ignoreErrorHint = true
            }
            break
          }
          case 401: {
            _errorMsg = this.$t('login.loginFail')
            break
          }
          case 423: {
            _errorMsg = this.$t('login.userLock')
            break
          }
          default: {
            _errorMsg = error.message
          }
        }

        if (!_ignoreErrorHint) {
          this.$message.error(_errorMsg)
        }
      }

      this.$refs['userNameInput'].focus()
      let _resetLoginTimer = setTimeout(() => {
        clearTimeout(_resetLoginTimer)
        _resetLoginTimer = null
        this.resetLogin()
      }, 1000)
    },
    logout () {
      api.logout().then(res => {
        this.logoutBtnLoading = true
        location.reload()
      })
    },
    keyupSubmit () {
      document.onkeydown = this.processkeyEvent
    },
    clearKeyEvent () {
      document.onkeydown = null
    },
    processkeyEvent (event) {
      let _key = event.keyCode
      if (_key === 13) {
        this.submitForm('userData')
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
  .loginBox {
    float: right;
    width: 440px;
    height: auto;
    text-align: center;
    margin: 240px 10% 0 0;
    padding: 25px 15px 5px;
    background: rgba(255,255,255,0.5);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16),
      0 2px 10px 0 rgba(0, 0, 0, 0.12) !important;
    border-radius: 15px;
    .login-top {
      text-align: center;
      display: inline-block;
      width: 100%;
      line-height: 18px;
      font-size: 18px;
      font-family: PingFangSC-Medium,sans-serif;
      color: #252b3a;
      margin-bottom: 25px;
    }
    .login-area {
      padding: 0 25px;
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
  @media screen and (max-width: 1380px) {
    .loginBox{
      margin: 140px 10px 0 0;
    }
  }
  @media screen and (max-width: 1024px) {
    .loginBox{
      margin: 200px 10px 0 0;
    }
  }
  @media screen and (max-width: 640px) {
    .loginBox{
      width: 340px;
      margin: 140px 10px 0 0;
    }
  }
  .login-btn {
    padding: 0 25px;
    button {
      width: 100%;
      font-size: 18px;
    }
    .verify-box em{
      top: 0;
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
    .language_span{
      cursor: pointer;
      margin-left: 10px;
    }
  }
}
</style>
