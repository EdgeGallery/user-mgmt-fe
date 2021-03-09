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
      >
        <div class="login-area">
          <el-form-item
            prop="username"
          >
            <el-input
              id="uname"
              v-model="userData.username"
              auto-complete="new-accounts"
              type="text"
              clearable
              :placeholder="$t('login.userName')"
            />
          </el-form-item>
          <el-form-item
            prop="password"
          >
            <el-input
              id="upass"
              v-model="userData.password"
              auto-complete="new-password"
              show-password
              clearable
              :placeholder="$t('login.pwdPla')"
            />
          </el-form-item>
          <el-form-item
            prop="checkPass"
          >
            <el-input
              id="verifypass"
              v-model="userData.checkPass"
              show-password
              clearable
              :placeholder="$t('login.pwdConfPla')"
            />
          </el-form-item>
          <el-form-item
            prop="mailAddress"
          >
            <el-input
              id="contact_mail"
              v-model="userData.mailAddress"
              type="text"
              clearable
              :placeholder="$t('login.mailAddr')"
            />
          </el-form-item>
          <el-form-item
            prop="telephone"
          >
            <el-input
              id="contact"
              v-model="userData.telephone"
              type="text"
              clearable
              :placeholder="$t('login.telPla')"
            />
          </el-form-item>
        </div>
        <div>
          <p class="register-hint">
            {{ $t('login.registerHint') }}
          </p>
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
          <p class="language_p">
            <Language />
          </p>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import Language from '../components/Language.vue'
import { api } from '../tools/api.js'
export default {
  name: 'Register',
  components: {
    Language
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
    var validateNameUnique = (rule, value, callback) => {
      this.verifyUnique(1, callback)
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
      if (value === '') {
        callback(new Error(this.$t('verify.confirmpasswordTip')))
        return
      }
      if (value !== this.userData.password) {
        callback(new Error(this.$t('tip.passDiferent')))
        return
      }
      callback()
    }
    var validateTelRule = (rule, value, callback) => {
      if (value !== '') {
        let pattern = /^1[34578]\d{9}$/
        if (value.match(pattern) === null) {
          callback(new Error(this.$t('login.phoneNumberRule')))
          return
        }
      }
      callback()
    }
    var validateTelUnique = (rule, value, callback) => {
      this.verifyUnique(2, callback)
    }
    var validateMailAddress = (rule, value, callback) => {
      if (value !== '') {
        let pattern = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (value.match(pattern) === null) {
          callback(new Error(this.$t('login.mailAddressRule')))
          return
        }
      }
      callback()
    }
    var validateMailUnique = (rule, value, callback) => {
      this.verifyUnique(3, callback)
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
        mailAddress: ''
      },
      rules: {
        username: [
          { validator: validateName, trigger: 'blur' },
          { validator: validateNameRule },
          { validator: validateNameUnique, trigger: 'blur' },
          { required: true }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' },
          { validator: validatePassRule },
          { required: true }
        ],
        telephone: [
          { validator: validateTelRule },
          { validator: validateTelUnique, trigger: 'blur' }
        ],
        mailAddress: [
          { validator: validateMailAddress },
          { validator: validateMailUnique, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatepassconfirm, trigger: 'blur' },
          { required: true }
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
    verifyUnique (type, callback) {
      let param = {
        username: type === 1 ? this.userData.username : '',
        telephone: type === 2 ? this.userData.telephone : '',
        mailAddress: type === 3 ? this.userData.mailAddress : ''
      }
      let headers = {
        'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
      }
      api.uniqueness(param, headers).then(res => {
        if (res.data) {
          if (type === 1 && res.data.username) {
            callback(new Error(this.$t('tip.nameAlSinged')))
          } else if (type === 2 && res.data.telephone) {
            callback(new Error(this.$t('tip.telAlSigned')))
          } else if (type === 3 && res.data.mailAddress) {
            callback(new Error(this.$t('tip.mailAlSigned')))
          } else {
            callback()
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
          this.regBtnLoading = true
          delete this.userData.checkPass
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
    margin: 180px 10% 0 0;
    padding:0 15px;
    background: rgba(255,255,255,0.5);
    border-radius: 15px;
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
          color: #cb4a4a;
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
      padding-bottom: 5px;
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
      padding: 0 25px;
      text-align: left;
      .el-checkbox{
        margin-right: 5px;
      }
      .el-link{
        font-weight: normal;
        font-size: 12px;
        margin-top: -3px;
      }
    }
    .register-hint{
      font-size: 12px;
      color: #b87e12;
      margin: 5px 0 15px;
      padding: 0 25px;
      text-align: left;
    }
    .language_p{
      text-align: right;
      padding: 0 25px 15px;
    }
    .language_span{
      cursor: pointer;
      margin-left: 5px;
      font-size: 12px;
    }
  }
  @media screen and (max-width: 1380px) {
    .loginBox{
      margin: 60px 10px 0 0;
    }
  }
  @media screen and (max-width: 800px) {
    .loginBox{
      margin: 120px 10px 0 0;
    }
  }
  @media screen and (max-width: 640px) {
    .loginBox{
      margin: 160px 10px 0 0;
    }
  }
}
</style>
