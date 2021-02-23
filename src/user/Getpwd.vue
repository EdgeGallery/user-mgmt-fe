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
        <div class="login-area">
          <el-form-item prop="telephone">
            <el-input
              id="contact"
              v-model="userData.telephone"
              type="text"
              clearable
              :placeholder="$t('login.telPla')"
            />
          </el-form-item>
          <el-form-item prop="verificationCode">
            <el-row>
              <el-col
                :span="16"
                :xs="12"
              >
                <el-input
                  v-model="userData.verificationCode"
                  type="text"
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
              type="password"
              clearable
              :placeholder="$t('login.pwdPla')"
            />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              id="verifypass"
              v-model="confirmPassword"
              type="password"
              clearable
              :placeholder="$t('login.pwdConfPla')"
            />
          </el-form-item>
        </div>
        <div style="margin-top:20px;">
          <el-button
            id="submitBtn"
            type="primary"
            size="medium"
            :loading="regBtnLoading"
            @click="submitForm('userData')"
          >
            {{ $t('common.submit') }}
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
    var validatetelephone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('verify.telephoneTip')))
      } else {
        if (this.userData.checkPass !== '') {
          this.$refs.userData.validateField('checkPass')
        }
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
    var validatepassconfirm = (rule, value, callback) => {
      if (value !== this.userData.newPassword) {
        callback(new Error(this.$t('tip.passDiferent')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      confirmPassword: '',
      userData: {
        newPassword: '',
        telephone: '',
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
          { validator: validatetelephone, trigger: 'blur' },
          { validator: validateTelRule }
        ],
        verificationCode: [
          { validator: validateverifycode, trigger: 'blur' },
          { validator: validateVerifyRule }
        ],
        confirmPassword: [
          { validator: validatepassconfirm, trigger: 'blur' }
        ]
      },
      regBtnLoading: false
    }
  },
  created () {
    this.keyupSubmit()
  },
  beforeDestroy () {
    clearTimeout(this.interval)
    this.interval = null
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
    jumpTo (path) {
      this.$router.push(path)
    },
    to () {
      this.$router.push(JSON.parse(sessionStorage.getItem('obj')).login_url)
    },
    intervalStart () {
      this.interval = setInterval(() => {
        this.time--
        sessionStorage.setItem('getPwdTime', this.time)
        if (this.time === 0) {
          clearTimeout(this.interval)
          this.interval = null
          this.ifBtnAble = false
          this.showTime = false
          this.time = 60
          sessionStorage.setItem('getPwdTime', 0)
        }
      }, 1000)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.userData.newPassword === this.confirmPassword) {
            this.regBtnLoading = true
            let headers = {
              'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
            }
            api.getPwd(this.userData, headers).then(res => {
              this.$message.success(this.$t('login.modifyPwd'))
              this.regBtnLoading = false
              this.to()
            }, error => {
              if (error) {
                this.$message.error(this.$t('tip.failedReset'))
              }
              this.regBtnLoading = false
            })
          } else {
            this.$message.error('The two password are different')
          }
        } else {
          return false
        }
      })
    },
    closeSucessPop () {
      this.$router.go(-1)
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
      let param = { telephone: this.userData.telephone }
      let headers = {
        'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
      }
      api.getCaptcha(param, headers).then(res => {
        this.ifBtnAble = true
        this.showTime = true
        this.intervalStart()
        this.$message.success(this.$t('tip.getVerifyCodeSuc'))
      }, error => {
        if (error) {
          this.$message.error(this.$t('tip.failedToGetCaptcha') + error.response.data.detail)
        }
        this.regBtnLoading = false
      })
    }
  }
}
</script>
<style lang="less">
.getpwd{
  height:100%;
  background: url('./../assets/images/login.png') no-repeat center;
  background-size:cover;
  .loginBox{
    float: right;
    width: 80%;
    max-width: 410px;
    height: auto;
    text-align: center;
    margin: 5% 10% 0 0;
    padding:15px;
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
          color: #F56C6C;
        }
      }
      p{
        line-height: 25px;
        text-align: left;
        margin-top:15px;
        margin-bottom: 0px;
      }
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
  }
}
</style>
