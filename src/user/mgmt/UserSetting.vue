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
  <div>
    <el-dialog
      :title="$t('usermgmt.setting.dlgTitle')"
      :visible.sync="showDlg"
      @closed="cancel"
      width="25%"
    >
      <div style="margin-top:20px">
        <el-form
          label-width="120px"
          :model="currForm"
          ref="currForm"
        >
          <el-form-item
            :label="$t('usermgmt.setting.role')"
            prop="role"
          >
            <el-radio-group v-model="currForm.role">
              <el-radio
                v-for="(item,index) in roleOptionList"
                :key="index"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label="$t('usermgmt.setting.platform')"
          >
            <el-checkbox-group
              v-model="currForm.platformList"
            >
              <el-checkbox
                v-for="(item,index) in platformOptionList"
                :key="index"
                :label="item"
              />
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-top:20px;text-align:right">
        <el-button
          id="btn_cancel"
          @click="cancel()"
        >
          {{ $t('common.cancel') }}
        </el-button>
        <el-button
          id="btn_confirm"
          type="primary"
          @click="confirm('currForm')"
        >
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { api } from '../../tools/api.js'
export default {
  props: {
    showDlg: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    userData: {
      type: Object,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      roleOptionList: [
        { value: 'ADMIN', label: this.$t('usermgmt.roleValue.admin') },
        { value: 'TENANT', label: this.$t('usermgmt.roleValue.tenant') }
      ],
      platformOptionList: [
        'APPSTORE',
        'DEVELOPER',
        'MECM',
        'ATP',
        'LAB'
      ],
      currForm: {
        'role': 'ADMIN',
        'platformList': []
      }
    }
  },
  watch: {
    showDlg (val) {
      if (val) {
        this.init()
      }
    }
  },
  methods: {
    init () {
      if (this.userData.permissions && this.userData.permissions.length) {
        this.currForm.role = this.userData.permissions[0].role
        if (!this.roleOptionList.find(item => item.value === this.currForm.role)) {
          this.currForm.role = 'ADMIN'
        }
        this.currForm.platformList = this.userData.permissions.map(item => item.platform)
      }
    },
    cancel () {
      this.showDlg = false
      this.$emit('cancelUserSettingDlg')
    },
    confirm () {
      if (!this.currForm.platformList || !this.currForm.platformList.length) {
        this.$message.warning(this.$t('usermgmt.tip.platformMustBeSelected'))
        return
      }
      let headers = {
        'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
      }
      let _setReq = {}
      _setReq.permissions = this.currForm.platformList.map(item => { return { 'role': this.currForm.role, 'platform': item } })
      api.configUser(this.userData.userId, _setReq, headers).then(response => {
        this.$emit('processUserSettingSuccess')
      }).catch(() => {
        this.$message.error(this.$t('usermgmt.tip.configUserFailed'))
      })
    }
  }
}
</script>
<style lang='less' scoped>
.el-form-item{
  margin:0 !important;
}
</style>
