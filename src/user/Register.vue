/* eslint-disable no-useless-escape */
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
  <div class="register">
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
        <div class="loginBox">
          <div class="login-area">
            <p class="login-top">
              {{ $t('login.welcome') }}
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
                  auto-complete="new-accounts"
                  type="text"
                  clearable
                  :placeholder="$t('login.userName')"
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
                  auto-complete="new-password"
                  show-password
                  clearable
                  :placeholder="$t('login.pwdPla')"
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
              <el-form-item
                prop="checkPass"
              >
                <el-input
                  id="verifypass"
                  v-model="userData.checkPass"
                  show-password
                  clearable
                  :placeholder="$t('login.pwdConfPla')"
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
              <el-form-item
                prop="mailAddress"
              >
                <el-input
                  id="contact_mail"
                  v-model="userData.mailAddress"
                  type="text"
                  clearable
                  :placeholder="$t('login.mailAddr')"
                >
                  <i slot="prefix">
                    <img
                      class="input_img"
                      src="../assets/images/icon_mail.png"
                      alt
                    >
                  </i>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <Verify
            @validateVerifyCodeSuccess="validateVerifyCodeSuccess"
          />
          <div>
            <div class="regBtn">
              <el-button
                id="submitBtn"
                type="primary"
                size="medium"
                :loading="regBtnLoading"
                @click="submitForm('userData')"
              >
                {{ $t('login.register') }}
              </el-button>
            </div>
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
            <p class="cancel-register">
              {{ $t('login.hasAccountHint') }}
              <el-link
                type="primary"
                @click="handleCancel()"
              >
                {{ $t('login.goLogin') }}
              </el-link>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { api } from '../tools/api.js'
import Verify from '../components/Verify.vue'
export default {
  name: 'Register',
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
      logoImg: require('../assets/images/logo_new.png'),
      illustrationImg: require('../assets/images/illustration.png'),
      userData: {
        username: '',
        password: '',
        checkPass: '',
        mailAddress: ''
      },
      verificationCode: '',
      rules: {
        username: [
          { validator: validateName },
          { validator: validateNameRule },
          { validator: validateNameUnique, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass },
          { validator: validatePassRule }
        ],
        mailAddress: [
          { validator: validateMailAddress },
          { validator: validateMailUnique, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatepassconfirm }
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
        this.submitRegister()
      })
    },
    submitRegister () {
      if (!this.legalRegister) {
        this.$message.warning(this.$t('tip.approveLegal'))
        return
      }
      this.regBtnLoading = true
      delete this.userData.checkPass
      let headers = {
        'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
      }
      api.register(this.userData, this.verificationCode, headers).then(res => {
        this.$message.success(this.$t('tip.regUserSuc'))
        this.regBtnLoading = false
        this.to()
      }, error => {
        if (error) {
          this.$message.error(this.$t('tip.failedReg'))
        }
        this.regBtnLoading = false
      })
    },
    handleCancel () {
      this.$router.push('/')
    },
    selectLegal (val) {
      this.legalRegister = val
    }
  }
}
</script>
<style lang="less">
.register{
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
      .loginBox{
        float: left;
        width: 641px;
        height: 740px;
        padding: 50px 109px 0px 98px;
        background: rgba(53,31,132,0.8);
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16),
          0 2px 10px 0 rgba(0, 0, 0, 0.12) !important;
        border-radius: 0 17px 17px 0;
        .login-area{
          padding: 0;
          .login-top{
            display: inline-block;
            width: 100%;
            line-height: 36px;
            font-size: 36px;
            font-family: PingFangSC-Medium,sans-serif;
            color: #FFFFFF;
            margin-bottom: 30px;
          }
          .input_img {
            position: relative;
            top: 5px;
          }
        }
        .regBtn{
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
        }
        .legal-register{
          font-size: 16px;
          color: #BDBDBD;
          margin: 20px 0;
          padding: 0;
          text-align: left;
          .el-checkbox{
            margin-right: 10px;
          }
          .el-link{
            font-size: 16px;
            color: #50BCB5;
            margin-top: -5px;
          }
          .el-link--inner {
            word-wrap: break-word;
          }
        }
        .cancel-register{
          font-size: 18px;
          color: #BDBDBD;
          margin-top: 5px;
          margin-right: -75px;
          padding: 0;
          text-align: right;
          .el-link{
            font-size: 18px;
            color: #50BCB5;
            margin-top: -5px;
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
