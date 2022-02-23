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
    <el-row
      class="layoutRow"
    >
      <el-col
        class="layoutLeftCol"
        :span="12"
      >
        <div
          class="leftArea"
        >
          <div
            class="logoArea"
            :style="{backgroundImage: 'url(' + logoImg + ')' }"
          />
          <div
            class="illustration"
            :style="{backgroundImage: 'url(' + illustrationImg + ')' }"
          />
        </div>
      </el-col>
      <el-col
        class="layoutRightCol"
        :span="12"
      >
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
                >
                  <i slot="prefix">
                    <img
                      class="input_img"
                      src="../assets/images/icon_user.png"
                      alt
                    >
                  </i>
                </el-input>
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
                >
                  <i slot="prefix">
                    <img
                      class="input_img"
                      src="../assets/images/icon_pw.png"
                      alt
                    >
                  </i>
                </el-input>
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
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { api } from '../tools/api.js'
import { ERRCODE_VERIFYCODE_WRONG, getQueryString } from '../tools/util.js'
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
      logoImg: require('../assets/images/logo_new.png'),
      illustrationImg: require('../assets/images/illustration.png'),
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
      this.returnUrl = getQueryString('return_to')
      this.enableSms = getQueryString('enable_sms').indexOf('true') > -1
      this.enableMail = getQueryString('enable_mail').indexOf('true') > -1
      this.enableExternalIam = getQueryString('enable_external_iam').indexOf('true') > -1
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
  padding: 0;
  .layoutRow {
    margin: 120px 0px 120px 60px;
    .layoutLeftCol {
      .leftArea {
        float: right;
        width: 641px;
        height: 740px;
        background: rgba(255,255,255,1.0);
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16),
          0 2px 10px 0 rgba(0, 0, 0, 0.12) !important;
        border-radius: 17px 0 0 17px;
        .logoArea {
          position: relative;
          top: 37px;
          left: 54px;
          width: 191px;
          height: 85px;
        }
        .illustration {
          position: relative;
          top: 35px;
          left: 62px;
          width: 499px;
          height: 467px;
        }
      }
    }
    .layoutRightCol {
      .loginBox {
        float: left;
        width: 641px;
        height: 740px;
        padding: 147px 109px 0px 98px;
        background: rgba(53,31,132,0.8);
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16),
          0 2px 10px 0 rgba(0, 0, 0, 0.12) !important;
        border-radius: 0 17px 17px 0;
        .login-area {
          padding: 0;
          .login-top {
            display: inline-block;
            width: 100%;
            line-height: 40px;
            font-size: 40px;
            font-family: PingFangSC-Medium,sans-serif;
            color: #FFFFFF;
            margin-bottom: 50px;
          }
          .input_img {
            position: relative;
            top: 5px;
          }
        }
        .login-btn {
          padding: 10px 0 0 0;
          button {
            width: 100%;
            font-size: 30px;
            font-family: PingFangSC-Medium,sans-serif;
            color: #241658;
            background-image: linear-gradient(to right, #5EABE2, #50BCB5);
            height: 60px;
            border-radius: 30px;
            box-shadow:0px 0px 40px rgba(94,171,226,0.7);
          }
          .verify-box em{
            top: 0;
          }
        }
        .login-tips {
          margin-top: 15px;
          padding: 0 25px;
          span {
            font-size: 18px;
            color: #50BCB5;
            line-height: 18px;
          }
          .el-divider {
            background-color: rgba(255,255,255,0.2);
          }
        }
      }
    }
  }
  .el-input__inner {
    width: 100%;
    background: rgba(163,148,211,0.2);
    border:1px solid rgba(255,255,255,0.2);
    height: 60px;
    border-radius: 30px;
    font-size: 20px;
    color: #BDB7DE;
    padding: 0 0 0 80px;
    &:focus {
      background: rgba(25,11,70,0.6);
      border:1px solid #50BCB5;
    }
  }
}
</style>
