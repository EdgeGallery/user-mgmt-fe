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
        status-icon
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
              :placeholder="$t('login.userName')"
              @blur.native.capture="verifyName()"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              id="upass"
              v-model="userData.password"
              auto-complete="new-password"
              type="password"
              :placeholder="$t('login.pwdPla')"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              id="verifypass"
              v-model="confirmPassword"
              type="password"
              :placeholder="$t('login.pwdConfPla')"
            />
          </el-form-item>
          <el-form-item prop="telephone">
            <el-input
              id="contact"
              v-model="userData.telephone"
              type="text"
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
              :placeholder="$t('login.compPla')"
            />
          </el-form-item>
          <el-form-item>
            <p
              style="padding:5px 0;"
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
              href="#"
              target="_blank"
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
        callback(new Error('Username cannot be empty'))
      } else {
        if (this.userData.checkPass !== '') {
          this.$refs.userData.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Password cannot be empty'))
      } else {
        if (this.userData.checkPass !== '') {
          this.$refs.userData.validateField('checkPass')
        }
        callback()
      }
    }
    var validatetelephone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Contact Number cannot be empty'))
      } else {
        if (this.userData.checkPass !== '') {
          this.$refs.userData.validateField('checkPass')
        }
        callback()
      }
    }
    return {
      visible: false,
      confirmPassword: '',
      ifBtnAble: false,
      time: 60,
      showTime: false,
      interval: '',
      userData: {
        username: '',
        password: '',
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
          { pattern: /^[a-zA-Z][a-zA-Z0-9_]{5,29}$/, message: this.$t('login.usernameRule') }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' },
          { pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{6,18}$/, message: this.$t('login.passwordRule') }
        ],
        telephone: [
          { validator: validatetelephone, trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: this.$t('login.phoneNumberRule') }
        ]
      },
      regBtnLoading: false,
      legalRegister: false
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
      let routeData = this.$router.resolve({
        name: name
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
      this.$router.push(JSON.parse(sessionStorage.getItem('obj')).login_url)
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
  height:100%;
  background: url('./../assets/images/login.png') no-repeat center;
  background-size:cover;
  .loginBox{
    float: right;
    width: 410px;
    height: auto;
    text-align: center;
    margin: 5% 10% 0 0;
    padding:25px 15px;
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
      p{
        line-height: 25px;
        text-align: left;
        margin-top:5px;
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
  .el-input{
    height:30px;
    margin:15px 0;
  }
  .el-form-item{
    margin-bottom: 0px;
  }
}
</style>
