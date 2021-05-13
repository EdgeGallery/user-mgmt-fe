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
  <div class="verify-area">
    <el-row>
      <el-col :span="17">
        <el-form
          :model="verifyData"
          :rules="rules"
          ref="verifyData"
        >
          <el-form-item
            prop="verificationCode"
          >
            <el-input
              id="vcode"
              v-model="verifyData.verificationCode"
              type="text"
              maxlength="4"
              :suffix-icon="verificationCodeCheckIcon"
              :placeholder="$t('login.capInImg')"
              clearable
            />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="7">
        <el-image
          v-if="showImgVerifyCode"
          style="top: 1px;width: 100px; height: 39px;cursor:pointer"
          :src="verifyCodeUrl"
          :fit="fit"
          @click.native="refreshImg()"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { api } from '../tools/api.js'
export default {
  name: '',
  components: {
  },
  inject: ['reload'],
  data () {
    var validateVerificationCode = (rule, value, callback) => {
      if (value === '') {
        this.verificationCodeCheckIcon = ''
        callback(new Error(this.$t('verify.verifyCodeTip')))
      } else {
        callback()
      }
    }
    var validateVerificationCodeRule = (rule, value, callback) => {
      let pattern = /^\d{4}$/
      if (value.match(pattern) === null) {
        this.verificationCodeCheckIcon = ''
        callback(new Error(this.$t('verify.imgVerifycodeRule')))
      } else {
        callback()
      }
    }
    var validateVerificationCodeIfRight = (rule, value, callback) => {
      this.checkVerificationCodeIfRight(value, callback)
    }
    return {
      verifyData: {
        verificationCode: ''
      },
      rules: {
        verificationCode: [
          { validator: validateVerificationCode },
          { validator: validateVerificationCodeRule },
          { validator: validateVerificationCodeIfRight }
        ]
      },
      showImgVerifyCode: true,
      resetImgVerifyTimeHandler: null,
      verifyCodeUrlPrefix: '',
      verifyCodeUrl: '',
      verificationCodeCheckIcon: ''
    }
  },
  watch: {
    '$i18n.locale': function () {
      this.$refs['verifyData'].fields.forEach(item => {
        if (item.validateState === 'error') {
          this.$refs['verifyData'].validateField(item.labelFor)
        }
      })
    }
  },
  beforeMount () {
    this.$root.$on('validateVerifyForm', () => {
      this.validateVerifyForm()
    })
    this.$root.$on('resetVerifyForm', () => {
      this.resetVerifyForm()
    })
  },
  mounted () {
    this.verifyCodeUrlPrefix = window.location.href.split(':')[0] + '://' + window.location.host +
      '/v1/identity/verifycode-image?sequence='
    this.verifyCodeUrl = this.verifyCodeUrlPrefix + Math.random()
  },
  methods: {
    validateVerifyForm () {
      this.$refs['verifyData'].validate((valid) => {
        if (!valid) {
          return false
        }

        this.$emit('validateVerifyCodeSuccess', this.verifyData.verificationCode)
      })
    },
    resetVerifyForm () {
      this.verifyData.verificationCode = ''
      this.$refs['verifyData'].resetFields()
      this.resetImgVerify()
    },
    checkVerificationCodeIfRight (value, callback) {
      this.verificationCodeCheckIcon = ''
      api.checkVerificationCode(value).then(res => {
        if (res.data && res.data.checkResult) {
          this.verificationCodeCheckIcon = 'el-icon-check'
          callback()
        } else {
          callback(new Error(this.$t('verify.imgVerifycodeWrong')))
          this.resetImgVerify()
        }
      })
    },
    resetImgVerify () {
      this.showImgVerifyCode = false
      this.clearResetImgVerifyTimeHandler()
      this.resetImgVerifyTimeHandler = setTimeout(() => {
        this.verifyCodeUrl = this.verifyCodeUrlPrefix + Math.random()
        this.showImgVerifyCode = true
      }, 0)
    },
    clearResetImgVerifyTimeHandler () {
      if (this.resetImgVerifyTimeHandler) {
        clearTimeout(this.resetImgVerifyTimeHandler)
        this.resetImgVerifyTimeHandler = null
      }
    },
    refreshImg () {
      this.resetImgVerify()
    }
  }
}
</script>
<style lang="less">
.verify-area{
  padding: 0 25px;
}
</style>
