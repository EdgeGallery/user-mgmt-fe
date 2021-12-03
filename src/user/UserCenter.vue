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
  <div class="usercenter">
    <div
      class="userCenterBox"
    >
      <div
        class="user_pic"
      >
        <img
          src="../assets/images/user.png"
          alt=""
        >
      </div>
      <div
        class="user_welcome"
      >
        <p>{{ $t('usercenter.welcomePrefix') }}{{ currUserInfo.username }}</p>
      </div>
      <div
        class="user_modifypass"
      >
        <el-button
          type="primary"
          @click="startModifyPass"
          v-if="!modifyPassFlag && !isExternalUser"
        >
          {{ $t('usercenter.modifyPwd') }}
        </el-button>
      </div>
      <div
        class="info-area"
        v-if="!modifyPassFlag"
      >
        <el-form
          :model="basicInfoEditData"
          :rules="basicInfoRules"
          ref="basicInfoEditForm"
        >
          <p class="info-title">
            <strong>{{ $t('usercenter.basicInfo') }}</strong>
          </p>
          <el-row>
            <el-col :span="8">
              <span>{{ $t('usercenter.accountName') }}</span>
            </el-col>
            <el-col :span="16">
              <span>{{ currUserInfo.username }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <span>{{ $t('usercenter.registerTime') }}</span>
            </el-col>
            <el-col :span="16">
              <span>{{ currUserInfo.createTime }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <span>{{ $t('usercenter.emailAddr') }}</span>
            </el-col>
            <el-col :span="12">
              <span v-if="!editMailAddrFlag">{{ showNoConfigOnEmpty(currUserInfo.mailAddress) }}</span>
              <el-form-item
                prop="mailAddress"
                v-if="editMailAddrFlag"
              >
                <el-input
                  v-model="basicInfoEditData.mailAddress"
                  clearable
                  size="medium"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button
                type="primary"
                circle
                icon="el-icon-edit"
                size="mini"
                @click="startEditMailAddr"
                v-if="!editMailAddrFlag && !isExternalUser"
              />
              <el-button
                type="success"
                circle
                icon="el-icon-check"
                size="mini"
                @click="submitModifyMail"
                v-if="editMailAddrFlag"
              />
              <el-button
                type="info"
                circle
                icon="el-icon-error"
                size="mini"
                @click="editMailAddrFlag=false"
                v-if="editMailAddrFlag"
              />
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div
        class="info-area"
        v-if="!modifyPassFlag"
      >
        <p class="info-title">
          <strong>{{ $t('usercenter.permissionInfo') }}</strong>
        </p>
        <el-row>
          <el-col :span="8">
            <span>{{ $t('usercenter.role') }}</span>
          </el-col>
          <el-col :span="16">
            <span>{{ convertRole() }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>{{ $t('usercenter.platform') }}</span>
          </el-col>
          <el-col :span="16">
            <span>{{ convertPlatform() }}</span>
          </el-col>
        </el-row>
      </div>
      <div
        class="modify-pass"
        v-if="modifyPassFlag"
      >
        <p class="info-title">
          <strong>{{ $t('usercenter.modifyPwd') }}</strong>
        </p>
        <ModifyPwdComp
          :modify-scene="0"
          @processModifyPassSucceed="processModifyPassSucceed"
          @processCancelModifyPass="processCancelModifyPass"
        />
      </div>
      <div
        style="margin-top:200px;"
      />
    </div>
  </div>
</template>
<script>
import { api } from '../tools/api.js'
import ModifyPwdComp from './modifypwd/ModifyPwdComp.vue'
export default {
  name: 'UserCenter',
  components: {
    ModifyPwdComp
  },
  data () {
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
    var validateMailAddress = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('verify.mailAddressBlankTip')))
      } else {
        callback()
      }
    }
    var validateMailAddressRule = (rule, value, callback) => {
      let pattern = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (value.match(pattern) === null) {
        callback(new Error(this.$t('login.mailAddressRule')))
      } else {
        callback()
      }
    }
    return {
      roleOptionList: [],
      currUserInfo: {},
      editMailAddrFlag: false,
      editTelephoneFlag: false,
      basicInfoEditData: {
        mailAddress: '',
        telephone: ''
      },
      basicInfoRules: {
        mailAddress: [
          { validator: validateMailAddress, trigger: 'blur' },
          { validator: validateMailAddressRule }
        ],
        telephone: [
          { validator: validatetelephone, trigger: 'blur' },
          { validator: validateTelRule }
        ]
      },

      modifyPassFlag: false,
      isExternalUser: false
    }
  },
  watch: {
    '$i18n.locale': function () {
      this.initRoleOptionList()
    }
  },
  mounted () {
    api.loginInfo().then(res => {
      this.currUserInfo = res.data
      if (!this.currUserInfo.username || this.currUserInfo.username === 'guest') {
        this.$router.push('/')
      }
      this.initRoleOptionList()
      this.isExternalUser = this.judgeExternalUser()
    }).catch(() => {
      this.$router.push('/')
    })
  },
  methods: {
    initRoleOptionList () {
      this.roleOptionList = [
        { value: 'ADMIN', label: this.$t('usermgmt.roleValue.admin') },
        { value: 'TENANT', label: this.$t('usermgmt.roleValue.tenant') },
        { value: 'GUEST', label: this.$t('usermgmt.roleValue.guest') }
      ]
    },
    startEditMailAddr () {
      this.editMailAddrFlag = true
      this.basicInfoEditData.mailAddress = ''
    },
    startEditTele () {
      this.editTelephoneFlag = true
      this.basicInfoEditData.telephone = ''
    },
    submitModifyMail () {
      this.$refs['basicInfoEditForm'].validateField('mailAddress', (errMsg) => {
        if (errMsg === '') {
          let headers = {
            'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
          }
          let _reqData = this.prepareBasicInfoEditReq()
          _reqData.mailAddress = this.basicInfoEditData.mailAddress
          api.modifyUser(this.currUserInfo.userId, _reqData, headers).then(response => {
            this.editMailAddrFlag = false
            this.currUserInfo.mailAddress = response.data.mailAddress
          }).catch(error => {
            this.handleSubmitError(error)
          })
        } else {
          return false
        }
      })
    },
    submitModifyTelephone () {
      this.$refs['basicInfoEditForm'].validateField('telephone', (errMsg) => {
        if (errMsg === '') {
          let headers = {
            'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
          }
          let _reqData = this.prepareBasicInfoEditReq()
          _reqData.telephone = this.basicInfoEditData.telephone
          api.modifyUser(this.currUserInfo.userId, _reqData, headers).then(response => {
            this.editTelephoneFlag = false
            this.currUserInfo.telephone = response.data.telephone
          }).catch(error => {
            this.handleSubmitError(error)
          })
        } else {
          return false
        }
      })
    },
    handleSubmitError (error) {
      if (error && error.response) {
        if (error.response.status === 400) {
          error.message = 'Bad request'
          if (error.response.data.code) {
            error.message = this.$t('errorCode.' + error.response.data.code)
          }
        }
        this.$message.error(error.message)
      }
    },
    prepareBasicInfoEditReq () {
      let _reqData = {}
      _reqData.username = this.currUserInfo.username
      _reqData.mailAddress = this.currUserInfo.mailAddress
      _reqData.telephone = this.currUserInfo.telephone
      return _reqData
    },
    startModifyPass () {
      this.modifyPassFlag = true
      this.editMailAddrFlag = false
      this.editTelephoneFlag = false
    },
    processModifyPassSucceed () {
      let _timer = setTimeout(() => {
        this.modifyPassFlag = false
        clearTimeout(_timer)
      }, 1000)
    },
    processCancelModifyPass () {
      this.modifyPassFlag = false
    },
    showNoConfigOnEmpty (value) {
      if (value === undefined || value === null || value === '') {
        return this.$t('common.noconfig')
      }
      return value
    },
    convertRole () {
      if (this.currUserInfo && this.currUserInfo.permissions && this.currUserInfo.permissions.length) {
        let roleOption = this.roleOptionList.find(item => item.value === this.currUserInfo.permissions[0].role)
        if (roleOption) {
          return roleOption.label
        }
      }
      return this.$t('common.unknown')
    },
    convertPlatform () {
      if (this.currUserInfo && this.currUserInfo.permissions && this.currUserInfo.permissions.length) {
        return this.currUserInfo.permissions.map((item) => item.platform).join(' | ')
      }
      return this.$t('common.unknown')
    },
    judgeExternalUser () {
      let _uiCtrlInfo = sessionStorage.getItem('uiCtrlInfo')
      if (_uiCtrlInfo) {
        return JSON.parse(_uiCtrlInfo).enable_external_iam && this.currUserInfo.username !== 'admin'
      }

      return false
    }
  }
}
</script>
<style lang="less">
.usercenter {
  height: 100%;
  .userCenterBox {

    .user_pic{
      float: left;
      width:200px;
      z-index: 99;
      img{
        width: 120px;
        margin: 20px 0 0 20px;
        cursor: pointer;
      }
    }

    .user_welcome{
      float:left;
      height: 120px;
      line-height: 120px;
      color:#FFFFFF;
      font-size:20px;
      width:600px;
    }

    .user_modifypass{
      height: 120px;
      line-height: 120px;
      color:#688ef3;
      font-size:16px;
    }

    float: right;
    width: 100%;
    height: auto;
    text-align: left;
    margin: 100px 0 0 0;
    padding: 25px 15px 5px;
    background: rgba(255,255,255,0.5);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16),
      0 2px 10px 0 rgba(0, 0, 0, 0.12) !important;
    border-radius: 5px;
    .info-area {
      padding: 0 200px;
      .el-row {
        width: 40%;
        margin-bottom:30px;
        text-align: left;
        font-size: 14px;
      }
    }
    .modify-pass {
      padding: 0 100px;
      text-align: center;
    }
    .info-title {
      height: 100px;
      line-height: 100px;
      color: #252b3a;
    }
  }
  @media screen and (max-width: 1380px) {
    .userCenterBox{
      margin: 140px 10px 0 0;
    }
  }
  @media screen and (max-width: 1024px) {
    .userCenterBox{
      margin: 200px 10px 0 0;
    }
  }
  @media screen and (max-width: 640px) {
    .userCenterBox{
      width: 340px;
      margin: 140px 10px 0 0;
    }
  }
}
</style>
