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
  <div class="getpwd">
    <div class="loginBox">
      <p class="login-top">
        {{ $t('login.getPwd') }}
      </p>
      <el-form
        :model="userData"
        :rules="rules"
        ref="userData"
      >
        <div
          class="login-area"
          v-show="currStep==1"
        >
          <el-form-item v-if="enableSms && enableMail">
            <el-radio-group
              v-model="retrieveType"
              @change="handleChangeType"
            >
              <el-radio
                label="ByMail"
                v-if="enableMail"
              >
                {{ $t('login.getPwdByMail') }}
              </el-radio>
              <el-radio
                label="BySms"
                v-if="enableSms"
              >
                {{ $t('login.getPwdBySms') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            prop="telephone"
            v-if="enableSms && retrieveType === 'BySms'"
          >
            <el-input
              id="input_telephone"
              v-model="userData.telephone"
              type="text"
              clearable
              :placeholder="$t('login.telPla')"
            />
          </el-form-item>
          <el-form-item
            prop="mailAddress"
            v-if="enableMail && retrieveType === 'ByMail'"
          >
            <el-input
              id="input_mail"
              v-model="userData.mailAddress"
              type="text"
              clearable
              :placeholder="$t('login.mailAddr')"
            />
          </el-form-item>
        </div>
        <Verify
          v-show="currStep==1"
          @validateVerifyCodeSuccess="validateVerifyCodeSuccess"
        />
        <div
          class="login-area"
          v-show="currStep==2"
        >
          <p class="get-captcha-hint">
            {{ $t('login.sendCaptchaTo') }}{{ anomymizedReceiver }}
          </p>
          <el-form-item prop="verificationCode">
            <el-row>
              <el-col
                :span="16"
                :xs="12"
              >
                <el-input
                  v-model="userData.verificationCode"
                  type="text"
                  maxlength="6"
                  :placeholder="$t('login.capPla')"
                  style="margin-top:0;"
                />
              </el-col>
              <el-col
                :span="8"
                :xs="12"
              >
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
          <el-form-item prop="newPassword">
            <el-input
              id="upass"
              v-model="userData.newPassword"
              auto-complete="new-password"
              show-password
              clearable
              :placeholder="$t('login.pwdPla')"
            />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              id="verifypass"
              v-model="confirmPassword"
              show-password
              clearable
              :placeholder="$t('login.pwdConfPla')"
            />
          </el-form-item>
        </div>
        <div style="margin-top:20px;">
          <el-button
            v-if="currStep==1"
            id="nextBtn"
            type="primary"
            size="medium"
            @click="goNext()"
          >
            {{ $t('common.next') }}
          </el-button>
          <el-button
            v-if="currStep==2"
            id="prevBtn"
            type="primary"
            size="medium"
            @click="goPrev()"
          >
            {{ $t('common.prev') }}
          </el-button>
          <el-button
            v-if="currStep==2"
            id="submitBtn"
            type="primary"
            size="medium"
            :loading="confirmBtnLoading"
            @click="submitForm('userData')"
          >
            {{ $t('common.submit') }}
          </el-button>
          <el-button
            id="cancelBtn"
            type="primary"
            size="medium"
            @click="handleCancel()"
          >
            {{ $t('common.cancel') }}
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { api } from '../tools/api.js'
import { anomymizeMail, anomymizeTelphone } from '../tools/util'
import Verify from '../components/Verify.vue'
export default {
  name: 'Getpwd',
  components: {
    Verify
  },
  data () {
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
    var validateTelephone = (rule, value, callback) => {
      if (this.isRetrieveBySms() && value === '') {
        callback(new Error(this.$t('verify.telephoneTip')))
      } else {
        callback()
      }
    }
    var validateTelRule = (rule, value, callback) => {
      let pattern = /^1[34578]\d{9}$/
      if (this.isRetrieveBySms() && value.match(pattern) === null) {
        callback(new Error(this.$t('login.phoneNumberRule')))
      } else {
        callback()
      }
    }
    var validateTelephoneExist = (rule, value, callback) => {
      if (this.isRetrieveBySms()) {
        this.checkIfExist(callback)
      } else {
        callback()
      }
    }
    var validateMailAddress = (rule, value, callback) => {
      if (this.isRetrieveByMail() && value === '') {
        callback(new Error(this.$t('verify.mailAddressBlankTip')))
      } else {
        callback()
      }
    }
    var validateMailAddressRule = (rule, value, callback) => {
      let pattern = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (this.isRetrieveByMail() && value.match(pattern) === null) {
        callback(new Error(this.$t('login.mailAddressRule')))
      } else {
        callback()
      }
    }
    var validateMailAddressExist = (rule, value, callback) => {
      if (this.isRetrieveByMail()) {
        this.checkIfExist(callback)
      } else {
        callback()
      }
    }
    var validateverifycode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('verify.verifyCodeTip')))
      } else {
        if (this.userData.checkPass !== '') {
          this.$refs.userData.validateField('checkPass')
        }
        callback()
      }
    }
    var validateVerifyRule = (rule, value, callback) => {
      let pattern = /^\d{6}$/
      if (value.match(pattern) === null) {
        callback(new Error(this.$t('verify.verifycodeRule')))
      } else {
        callback()
      }
    }
    var validateConfirmPass = (rule, value, callback) => {
      if (this.confirmPassword !== this.userData.newPassword) {
        callback(new Error(this.$t('tip.passDiferent')))
      } else {
        callback()
      }
    }
    return {
      currStep: 1,
      obj: {},
      enableSms: false,
      enableMail: false,
      retrieveType: '',
      imgVerificationCode: '',
      confirmPassword: '',
      userData: {
        type: 2,
        newPassword: '',
        telephone: '',
        mailAddress: '',
        verificationCode: ''
      },
      ifBtnAble: false,
      time: 60,
      showTime: false,
      interval: null,
      rules: {
        newPassword: [
          { validator: validatePass, trigger: 'blur' },
          { validator: validatePassRule }
        ],
        telephone: [
          { validator: validateTelephone, trigger: 'blur' },
          { validator: validateTelRule },
          { validator: validateTelephoneExist, trigger: 'blur' }
        ],
        mailAddress: [
          { validator: validateMailAddress, trigger: 'blur' },
          { validator: validateMailAddressRule },
          { validator: validateMailAddressExist, trigger: 'blur' }
        ],
        verificationCode: [
          { validator: validateverifycode, trigger: 'blur' },
          { validator: validateVerifyRule }
        ],
        confirmPassword: [
          { validator: validateConfirmPass, trigger: 'blur' }
        ]
      },
      anomymizedReceiver: '',
      confirmBtnLoading: false
    }
  },
  mounted () {
    this.obj = JSON.parse(sessionStorage.getItem('obj'))
    this.enableSms = this.obj.enable_sms
    this.enableMail = this.obj.enable_mail
    this.retrieveType = this.enableMail ? 'ByMail' : 'BySms'
  },
  beforeDestroy () {
    this.clearInterval()
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
  methods: {
    goNext () {
      let _validField = this.isRetrieveByMail() ? 'mailAddress' : 'telephone'
      this.$refs['userData'].validateField(_validField)

      this.$root.$emit('validateVerifyForm')
    },
    validateVerifyCodeSuccess (verifyCode) {
      let _validField = this.isRetrieveByMail() ? 'mailAddress' : 'telephone'
      this.$refs['userData'].validateField(_validField, (errMsg) => {
        if (errMsg) {
          return false
        }

        this.currStep = 2
        this.imgVerificationCode = verifyCode
        this.anomymizedReceiver = this.anomymizeReceiver()
      })
    },
    checkIfExist (callback) {
      let param = {
        username: '',
        mailAddress: this.isRetrieveByMail() ? this.userData.mailAddress : '',
        telephone: this.isRetrieveBySms() ? this.userData.telephone : ''
      }
      let headers = {
        'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
      }
      api.uniqueness(param, headers).then(res => {
        if (res.data) {
          if (this.isRetrieveBySms() && !res.data.telephone) {
            callback(new Error(this.$t('tip.telNotExist')))
          } else if (this.isRetrieveByMail() && !res.data.mailAddress) {
            callback(new Error(this.$t('tip.mailNotExist')))
          } else {
            callback()
          }
        }
      })
    },
    goPrev () {
      let _mailAddr = this.userData.mailAddress
      let _telephone = this.userData.telephone

      this.resetFormData()
      this.$refs['userData'].resetFields()
      this.$root.$emit('resetVerifyForm')

      this.userData.mailAddress = _mailAddr
      this.userData.telephone = _telephone

      this.resetCaptchaTimer()

      this.currStep = 1
    },
    delayGoPrev () {
      let _goPrevTimer = setTimeout(() => {
        this.goPrev()
        clearTimeout(_goPrevTimer)
        _goPrevTimer = null
      }, 1000)
    },
    intervalStart () {
      this.interval = setInterval(() => {
        this.time--
        if (this.time === 0) {
          this.resetCaptchaTimer()
        }
      }, 1000)
    },
    clearInterval () {
      clearTimeout(this.interval)
      this.interval = null
    },
    resetCaptchaTimer () {
      this.clearInterval()
      this.ifBtnAble = false
      this.showTime = false
      this.time = 60
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.userData.newPassword === this.confirmPassword) {
            this.confirmBtnLoading = true
            let headers = {
              'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
            }
            api.getPwd(this.userData, headers).then(res => {
              this.$message.success(this.$t('tip.resetPassSuc'))
              this.confirmBtnLoading = false
              this.closeOnSuccessReset()
            }, error => {
              if (error) {
                this.$message.error(this.$t('tip.failedReset'))
              }
              this.confirmBtnLoading = false
              this.delayGoPrev()
            })
          } else {
            this.$message.error('The two password are different')
          }
        } else {
          return false
        }
      })
    },
    handleCancel () {
      this.$router.go(-1)
    },
    closeOnSuccessReset () {
      api.logout().then(() => {
        api.logout().then(() => {
          this.$router.push(this.obj.login_url)
        })
      })
    },
    getCaptcha () {
      let param = this.isRetrieveByMail() ? { mailAddress: this.userData.mailAddress }
        : { telephone: this.userData.telephone }
      let headers = {
        'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
      }
      api.getCaptcha(this.retrieveType, this.imgVerificationCode, param, headers).then(res => {
        this.ifBtnAble = true
        this.showTime = true
        this.intervalStart()
      }, error => {
        this.handleGetCaptchaError(error)
        this.delayGoPrev()
      })
    },
    handleGetCaptchaError (error) {
      if (error && error.response && error.response.data) {
        if (error.response.data.code) {
          this.$message.error(this.$t('errorCode.' + error.response.data.code))
        } else if (error.response.data.message) {
          this.$message.error(this.$t('tip.failedToGetCaptcha') + error.response.data.message)
        } else {
          this.$message.error(this.$t('tip.failedToGetCaptcha'))
        }
      } else {
        this.$message.error(this.$t('tip.failedToGetCaptcha'))
      }
    },
    handleChangeType () {
      this.resetFormData()
      this.$refs['userData'].resetFields()
      this.$root.$emit('resetVerifyForm')
    },
    resetFormData () {
      this.userData.newPassword = ''
      this.userData.telephone = ''
      this.userData.mailAddress = ''
      this.userData.verificationCode = ''

      this.confirmPassword = ''
      this.imgVerificationCode = ''
    },
    anomymizeReceiver () {
      if (this.isRetrieveByMail()) {
        return anomymizeMail(this.userData.mailAddress)
      } else {
        return anomymizeTelphone(this.userData.telephone)
      }
    },
    isRetrieveByMail () {
      return this.retrieveType === 'ByMail'
    },
    isRetrieveBySms () {
      return this.retrieveType === 'BySms'
    }
  }
}
</script>
<style lang="less">
.getpwd{
  height:100%;
  background-size:cover;
  .loginBox{
    float: right;
    width: 440px;
    height: auto;
    text-align: center;
    margin: 240px 10% 0 0;
    padding:15px;
    background: rgba(255,255,255,0.5);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)!important;
    border-radius: 15px;
    .login-top{
      text-align: center;
      display: inline-block;
      width: 100%;
      line-height: 18px;
      font-size: 18px;
      font-family: PingFangSC-Medium,sans-serif;
      color: #252B3A;
      margin-bottom:25px;
    }
    .login-area{
      padding: 0 25px;
      .el-form-item{
        margin-bottom: 25px;
        .el-form-item__error{
          text-align: left;
        }
      }
      .el-form-item.is-error{
        .el-input__clear{
          color: #cb4a4a;
        }
      }
      p{
        line-height: 25px;
        text-align: left;
        margin-top:15px;
        margin-bottom: 0px;
      }
    }
    .get-captcha-hint{
      display: inline-block;
      width: 100%;
      line-height: 18px;
      font-size: 12px;
      font-family: PingFangSC-Medium,sans-serif;
      color: #252B3A;
      margin-bottom:25px;
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
      width: 310px;
      margin: 140px 10px 0 0;
    }
  }
}
</style>
