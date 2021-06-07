<!--
  -  Copyright 2021 Huawei Technologies Co., Ltd.
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
  <div class="modifypw-comp">
    <el-form
      :model="modifyPassData"
      :rules="modifyPassRules"
      label-width="200px"
      ref="modifyPassForm"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item
            prop="oldPassword"
            :label="$t('pwdmodify.oldPw')"
          >
            <el-input
              v-model="modifyPassData.oldPassword"
              clearable
              show-password
              size="medium"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            prop="newPassword"
            :label="$t('pwdmodify.newPw')"
          >
            <el-input
              v-model="modifyPassData.newPassword"
              clearable
              show-password
              size="medium"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            prop="confirmPassword"
            :label="$t('pwdmodify.confirmNewPw')"
          >
            <el-input
              v-model="modifyPassData.confirmPassword"
              clearable
              show-password
              size="medium"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="text-align:right">
        <el-col :span="20">
          <el-button
            type="primary"
            @click="submitModifyPass"
          >
            {{ $t('common.confirm') }}
          </el-button>
          <el-button
            type="info"
            @click="cancel"
          >
            {{ $t('common.cancel') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { api } from '../../tools/api.js'
import { isForceModifyPwScene, PW_MODIFY_SCENE_FIRSTLOGIN } from '../../tools/util.js'
export default {
  name: 'ModifyPwdComp',
  props: {
    modifyScene: {
      type: String,
      default: function () {
        return 0
      }
    }
  },
  data () {
    var validatePassRule = (rule, value, callback) => {
      let pattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{6,18}$/
      if (value.match(pattern) === null) {
        callback(new Error(this.$t('login.passwordRule')))
      } else {
        callback()
      }
    }
    var validatePassSame = (rule, value, callback) => {
      if (value === this.modifyPassData.oldPassword) {
        callback(new Error(this.$t('pwdmodify.passNotChanged')))
      } else {
        callback()
      }
    }
    var validatepassconfirm = (rule, value, callback) => {
      if (this.modifyPassData.confirmPassword !== this.modifyPassData.newPassword) {
        callback(new Error(this.$t('tip.passDiferent')))
      } else {
        callback()
      }
    }
    return {
      modifyPassData: {
        type: 1,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      modifyPassRules: {
        oldPassword: [
          { required: true, message: this.$t('verify.passwordTip') }
        ],
        newPassword: [
          { required: true, message: this.$t('verify.passwordTip') },
          { validator: validatePassRule },
          { validator: validatePassSame }
        ],
        confirmPassword: [
          { required: true, message: this.$t('verify.passwordTip') },
          { validator: validatepassconfirm, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitModifyPass () {
      this.$refs['modifyPassForm'].validate((valid) => {
        if (!valid) {
          return
        }
        let headers = {
          'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
        }
        api.getPwd(this.modifyPassData, headers).then(res => {
          this.$message.success(this.$t('pwdmodify.modifyPwdSucceed'))
          this.processModifySucceed()
        }).catch(() => {
          this.$message.error(this.$t('pwdmodify.modifyPwdFailed'))
          let _timer = setTimeout(() => {
            this.$refs['modifyPassForm'].resetFields()
            clearTimeout(_timer)
          }, 1000)
        })
      })
    },
    processModifySucceed () {
      if (isForceModifyPwScene(this.modifyScene)) {
        localStorage.removeItem('pwmodiscene-' + this.$cookies.get('XSRF-TOKEN'))
        let _timer = setTimeout(() => {
          this.logout()
          clearTimeout(_timer)
        }, 1000)
      }
    },
    cancel () {
      if (isForceModifyPwScene(this.modifyScene)) {
        let _tipInfo = this.modifyScene === PW_MODIFY_SCENE_FIRSTLOGIN ? this.$t('pwdmodify.cancelOnFirstLoginTip')
          : this.$t('pwdmodify.cancelOnPwExpiredTip')
        this.$confirm(_tipInfo, this.$t('common.warning'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          localStorage.removeItem('pwmodiscene-' + this.$cookies.get('XSRF-TOKEN'))
          this.logout()
        })
      }
    },
    logout () {
      api.logout().then(res => {
        let urlPrefix = window.location.href.indexOf('https') > -1 ? 'https://' : 'http://'
        window.location.href = urlPrefix + window.location.host + '/index.html'
      })
    }
  }
}
</script>
<style lang="less">
.modifypw-comp {
  margin: 0 25% 0 25%;
  padding-top: 20px;
  padding-bottom: 20px;
  .el-row {
    width: 80%;
    margin-bottom:10px;
    font-size: 14px;
  }
  .el-form-item__label{
    color: #000000;
  }
}
</style>
