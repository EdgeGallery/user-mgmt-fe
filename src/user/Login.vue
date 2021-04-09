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
        <drag-verify
          :width="width"
          :height="height"
          :text="text"
          :success-text="successText"
          :background="background"
          :progress-bar-bg="progressBarBg"
          :completed-bg="completedBg"
          :handler-bg="handlerBg"
          :handler-icon="handlerIcon"
          :text-size="textSize"
          :success-icon="successIcon"
          :circle="false"
          ref="Verify"
          @passcallback="verifySuccess"
        />
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
          v-if="!hasLogin"
          @click="jumpTo('/mecm/register')"
        >
          {{ $t('login.freeSign') }}
        </el-button>
        <el-divider
          direction="vertical"
          v-if="!hasLogin && (this.enableSms || this.enableMail)"
        />
        <el-button
          type="text"
          v-if="!hasLogin && (this.enableSms || this.enableMail)"
          @click="jumpTo('/mecm/getPwd')"
        >
          {{ $t('login.forgotPwd') }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import 'font-awesome/css/font-awesome.min.css'
import dragVerify from 'vue-drag-verify'
import { api } from '../tools/api.js'
export default {
  name: '',
  components: {
    dragVerify
  },
  inject: ['reload'],
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
      verifyStatus: false,
      returnUrl: '',
      enableSms: '',
      enableMail: '',
      handlerIcon: 'fa fa-angle-double-right',
      successIcon: 'fa fa-check',
      background: '#FFCCCC',
      progressBarBg: '#66a542',
      completedBg: '#66cc66',
      handlerBg: '#f3f3f3',
      text: this.$t('login.verify'),
      successText: this.$t('login.finishVerify'),
      width: 360,
      height: 40,
      textSize: '16px',
      interval: null,
      getLoginInfoInterval: null
    }
  },
  watch: {
    '$i18n.locale': function () {
      this.text = this.$t('login.verify')
      this.successText = this.$t('login.finishVerify')
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
      let obj = {
        return_url: this.returnUrl,
        enable_sms: this.enableSms,
        enable_mail: this.enableMail,
        login_url: window.location.href.split('#')[1]
      }
      sessionStorage.setItem('obj', JSON.stringify(obj))
    }
    this.interval = setInterval(() => {
      this.setDivWidth()
    }, 100)
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
    setDivWidth () {
      let screenWidth = document.body.clientWidth
      if (screenWidth >= 641) {
        this.width = 360
      } else {
        this.width = 260
      }
    },
    clearInterval () {
      clearTimeout(this.interval)
      this.interval = null

      clearTimeout(this.getLoginInfoInterval)
      this.getLoginInfoInterval = null
    },
    verifySuccess () {
      if (this.$refs.Verify.isPassing) {
        this.verifyStatus = true
      } else {
        this.verifyStatus = false
      }
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
      if (window.location.href.indexOf('return_to=') > -1) {
        let _returnUrl = this.getQueryString('return_to')
        if (_returnUrl) {
          return _returnUrl
        }
      }
      return ''
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        if (!this.verifyStatus) {
          this.$message.error(this.$t('tip.wrongCaptcha'))
          return false
        }
        this.loginBtnLoading = true
        let formData = new FormData()
        Object.keys(this.userData).forEach(item => {
          formData.append(item, this.userData[item])
        })
        let headers = {
          'Content-Type': 'multipart/form-data',
          'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
        }
        api.login(formData, headers).then(res => {
          this.loginSuccess()
        }).catch(error => {
          this.loginBtnLoading = false
          if (error && error.response) {
            switch (error.response.status) {
              case 400:
                error.message = 'Bad request'
                break
              case 401:
                error.message = this.$t('login.loginFail')
                break
              case 423:
                error.message = this.$t('login.userLock')
                break
            }
            this.$message.error(error.message)
          }
          setTimeout(() => {
            this.reload()
          }, 500)
        })
      })
    },
    loginSuccess () {
      let _returnUrl = this.getReturnUrl()
      if (_returnUrl) {
        window.location.href = decodeURIComponent(_returnUrl)
      } else {
        this.reload()
      }
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
    .drag_verify{
      margin-bottom: 15px;
      .dv_handler{
        box-sizing: content-box;
      }
    }
    .drag_verify .dv_handler i{
      font-size: 16px;
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
