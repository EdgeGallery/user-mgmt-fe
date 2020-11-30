/* eslint-disable no-useless-escape */
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
  <div class="register">
    <div class="loginBox">
      <p class="login-top">
        {{ $t('login.welcome') }}
      </p>
      <el-form
        :model="userData"
        :rules="rules"
        ref="userData"
        class="demo-ruleForm"
      >
        <div class="login-area">
          <el-form-item prop="username">
            <el-input
              id="uname"
              v-model="userData.username"
              auto-complete="new-accounts"
              type="text"
              clearable
              :placeholder="$t('login.userName')"
              @blur.native.capture="verifyName()"
              :class="{'errMsg':errorMsg}"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              id="upass"
              v-model="userData.password"
              auto-complete="new-password"
              type="password"
              clearable
              :placeholder="$t('login.pwdPla')"
            />
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input
              id="verifypass"
              v-model="userData.checkPass"
              type="password"
              clearable
              :placeholder="$t('login.pwdConfPla')"
            />
          </el-form-item>
          <el-form-item prop="telephone">
            <el-input
              id="contact"
              v-model="userData.telephone"
              type="text"
              clearable
              :placeholder="$t('login.telPla')"
              @blur.native.capture="verifyName()"
            />
          </el-form-item>
          <el-form-item
            v-if="enableSms"
          >
            <el-row
              style="
            margin-top:18px;"
            >
              <el-col :span="14">
                <el-input
                  v-model="userData.verificationCode"
                  type="text"
                  :placeholder="$t('login.capPla')"
                  style="margin:0;"
                />
              </el-col>
              <el-col :span="10">
                <el-button
                  style="float:right;"
                  type="primary"
                  size="middle"
                  @click="getCaptcha"
                  :disabled="ifBtnAble"
                >
                  <span v-if="!showTime">{{ $t('login.getCap') }}</span><span v-if="showTime">&nbsp;&nbsp;{{ time }}s</span>
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-input
              id="company"
              v-model="userData.company"
              type="text"
              clearable
              :placeholder="$t('login.compPla')"
            />
          </el-form-item>
          <el-form-item class="gender">
            <p
              id="gender"
            >
              <el-radio
                v-model="userData.gender"
                label="1"
              >
                {{ $t('login.male') }}
              </el-radio>
              <el-radio
                v-model="userData.gender"
                label="2"
              >
                {{ $t('login.female') }}
              </el-radio>
            </p>
          </el-form-item>
        </div>
        <div>
          <p class="legal-register">
            <el-checkbox
              v-model="legalRegister"
              @change="selectLegal"
            />
            {{ $t('login.iAgree') }}
            <el-link
              type="primary"
              @click="jumpBlank('useragreement')"
            >
              {{ $t('login.userAgreement') }}
            </el-link>
            {{ $t('login.and') }}
            <el-link
              type="primary"
              @click="jumpBlank('userprivacy')"
            >
              {{ $t('login.privacyStatement') }}
            </el-link>
          </p>
          <div class="regBtn">
            <el-button
              id="submitBtn"
              type="primary"
              size="medium"
              :loading="regBtnLoading"
              :disabled="!legalRegister"
              @click="submitForm('userData')"
            >
              {{ $t('login.legalRegister') }}
            </el-button>
            <el-button
              id="cancelBtn"
              type="primary"
              size="medium"
              @click="closeSucessPop()"
            >
              {{ $t('common.cancel') }}
            </el-button>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { api } from '../tools/api.js'
export default {
  name: 'Register',
  components: {

  },
  data () {
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('verify.usernameTip')))
      } else {
        callback()
      }
    }
    var validateNameRule = (rule, value, callback) => {
      let pattern = /^[a-zA-Z][a-zA-Z0-9_]{5,29}$/
      if (value.match(pattern) === null) {
        callback(new Error(this.$t('login.usernameRule')))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('verify.passwordTip')))
      } else {
        if (this.userData.checkPass !== '') {
          this.$refs.userData.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePassRule = (rule, value, callback) => {
      let pattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{6,18}$/
      if (value.match(pattern) === null) {
        callback(new Error(this.$t('login.passwordRule')))
      } else {
        callback()
      }
    }
    var validatepassconfirm = (rule, value, callback) => {
      if (value !== this.userData.password) {
        callback(new Error(this.$t('tip.passDiferent')))
      } else {
        callback()
      }
    }
    var validatetelephone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('verify.telephoneTip')))
      } else {
        callback()
      }
    }
    var validateTelRule = (rule, value, callback) => {
      let pattern = /^1[34578]\d{9}$/
      if (value.match(pattern) === null) {
        callback(new Error(this.$t('login.phoneNumberRule')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      ifBtnAble: false,
      time: 60,
      showTime: false,
      interval: null,
      userData: {
        username: '',
        password: '',
        checkPass: '',
        telephone: '',
        verificationCode: '',
        company: '',
        gender: ''
      },
      nameTip: true,
      telTip: true,
      enableSms: false,
      rules: {
        username: [
          { validator: validateName, trigger: 'blur' },
          { validator: validateNameRule }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' },
          { validator: validatePassRule }
        ],
        telephone: [
          { validator: validatetelephone, trigger: 'blur' },
          { validator: validateTelRule }
        ],
        checkPass: [
          { validator: validatepassconfirm, trigger: 'blur' }
        ]
      },
      regBtnLoading: false,
      legalRegister: false
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
  mounted () {
    let obj = JSON.parse(sessionStorage.getItem('obj'))
    this.enableSms = obj.enable_sms
  },
  created () {
    this.keyupSubmit()
  },
  beforeDestroy () {
    clearTimeout(this.interval)
    this.interval = null
  },
  methods: {
    jumpBlank (name) {
      sessionStorage.setItem('privacyName', name)
      let routeData = this.$router.resolve({
        name: 'userprivacy'
      })
      window.open(routeData.href, '_blank')
    },
    jumpTo (path) {
      this.$router.push(path)
    },
    to () {
      this.jumpTo('/')
    },
    verifyName () {
      let param = {
        username: this.userData.username,
        telephone: this.userData.telephone
      }
      let headers = {
        'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
      }
      api.uniqueness(param, headers).then(res => {
        if (res.data) {
          if (res.data.username || res.data.telephone) {
            if (res.data.username) {
              this.$message.error(this.$t('tip.nameAlSinged'))
              this.nameTip = false
            }
            if (res.data.telephone) {
              this.$message.error(this.$t('tip.telAlSigned'))
              this.telTip = false
            }
          }
        }
      })
    },
    intervalStart () {
      this.interval = setInterval(() => {
        this.time--
        sessionStorage.setItem('time', this.time)
        if (this.time === 0) {
          clearTimeout(this.interval)
          this.interval = null
          this.ifBtnAble = false
          this.showTime = false
          this.time = 60
          sessionStorage.removeItem('time')
        }
      }, 1000)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.legalRegister) {
          if (this.nameTip && this.telTip) {
            this.regBtnLoading = true
            delete this.userData.checkPass
            if (!this.enableSms) {
              delete this.userData.verificationCode
            }
            let headers = {
              'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
            }
            api.register(this.userData, headers).then(res => {
              this.$message.success(this.$t('tip.regUserSuc'))
              this.regBtnLoading = false
              this.to()
            }, error => {
              if (error) {
                this.$message.error(this.$t('tip.failedReg'))
              }
              this.regBtnLoading = false
            })
          } else {
            if (this.nameTip) {
              this.$message.error(this.$t('tip.telAlSigned'))
            } else {
              this.$message.error(this.$t('tip.nameAlSinged'))
            }
          }
        } else {
          return false
        }
      })
    },
    closeSucessPop () {
      this.$router.push('/')
    },
    keyupSubmit () {
      document.onkeydown = e => {
        let _key = window.event.keyCode
        if (_key === 13) {
          this.submitForm()
        }
      }
    },
    getCaptcha () {
      if (this.telTip && this.userData.telephone) {
        this.ifBtnAble = true
        this.showTime = true
        this.intervalStart()
        let param = { telephone: this.userData.telephone }
        let headers = {
          'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
        }
        api.getCaptcha(param, headers).then(res => {
          this.$message.success(this.$t('tip.getVerifyCodeSuc'))
        }, error => {
          if (error) {
            this.$message.error(this.$t('tip.failedReg') + error.response.data.detail)
          }
          this.regBtnLoading = false
        })
      }
    },
    selectLegal (val) {
      this.legalRegister = val
    }
  }
}
</script>
<style lang="less">
.register{
  min-width: 320px;
  height:100%;
  .loginBox{
    float: right;
    width: 80%;
    max-width: 410px;
    text-align: center;
    margin: 5% 10% 0 0;
    padding:0 15px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)!important;
    .login-top{
      text-align: center;
      display: inline-block;
      width: 100%;
      line-height: 18px;
      font-size: 18px;
      font-family: PingFangSC-Medium,sans-serif;
      color: #252B3A;
      margin:25px 0;
    }
    .login-area{
      padding: 0 25px;
      .el-form-item{
        margin-bottom: 25px;
        .el-form-item__error{
          text-align: left;
          padding-top: 2px;
        }
      }
      .el-form-item.is-error{
        .el-input__clear{
          color: #F56C6C;
        }
      }
      p{
        line-height: 25px;
        text-align: left;
        margin-top:5px;
        margin-bottom: 0px;
      }
    }
    .regBtn{
      padding-bottom: 25px;
    }
    .login-certify{
      padding: 0 25px;
      margin:25px 0;
      span{
        display:inline-block;
        width:100%;
        height:100%;
        line-height: 38px;
        border:1px solid #ddd;
        border-radius: 5px;
        font-size:18px;
        font-weight:bold;
      }
    }
    .legal-register{
      font-size: 12px;
      margin: 5px 0 15px;
      .el-checkbox{
        margin-right: 5px;
      }
      .el-link{
        font-weight: normal;
        font-size: 12px;
        margin-top: -3px;
      }
    }
  }
  .gender{
    height: 25px;
    line-height: 25px;
    margin: -10px 0 10px 0;
    .el-form-item__content{
      line-height: 25px;
      p{
        margin-top: 0;
      }
    }
  }
}
</style>
