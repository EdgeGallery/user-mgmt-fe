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
  <div class="search">
    <el-row>
      <el-col :span="24" />
    </el-row>
    <el-form
      :model="formData"
      ref="formData"
      label-position="right"
    >
      <el-row>
        <el-col :span="4">
          <el-form-item
            :label="$t('usermgmt.userName')"
            prop="username"
            label-width="80px"
          >
            <el-input
              id="elinput_username"
              maxlength="20"
              size="small"
              style="width:95%"
              v-model="formData.username"
              :placeholder="$t('usermgmt.userName')"
              @keyup.enter.native="search"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            :label="$t('usermgmt.mailAddress')"
            prop="mailAddress"
            label-width="100px"
          >
            <el-input
              id="elinput_mailAddress"
              maxlength="20"
              size="small"
              style="width:95%"
              v-model="formData.mailAddress"
              :placeholder="$t('usermgmt.mailAddress')"
              @keyup.enter.native="search"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            :label="$t('usermgmt.telephone')"
            prop="telephone"
            label-width="100px"
          >
            <el-input
              id="elinput_telephone"
              maxlength="20"
              size="small"
              style="width:95%"
              v-model="formData.telephone"
              :placeholder="$t('usermgmt.telephone')"
              @keyup.enter.native="search"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item
            :label="$t('usermgmt.status')"
            prop="status"
            label-width="60px"
          >
            <el-select
              id="elselect_status"
              v-model="formData.status"
              :placeholder="$t('common.status')"
              size="small"
              style="width:95%"
              @change="search"
            >
              <el-option
                v-for="item in statusOptionList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            :label="$t('usermgmt.registerTimeRange')"
            prop="registerTimeRange"
            label-width="150px"
          >
            <el-date-picker
              id="eldatepicker_registertimerange"
              v-model="formData.registerTimeRange"
              type="daterange"
              size="small"
              style="width:95%"
              value-format="yyyy-MM-dd"
              :start-placeholder="$t('usermgmt.beginTime')"
              :end-placeholder="$t('usermgmt.endTime')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <div
            class="flex"
            style="justify-content: center; align-items: center;"
          >
            <el-button
              id="resetBtn"
              @click="resetForm('formData')"
            >
              {{ $t('common.reset') }}
            </el-button>
            <el-button
              id="searchBtn"
              type="primary"
              @click="search"
            >
              {{ $t('common.search') }}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      statusOptionList: [],
      formData: {
        username: '',
        mailAddress: '',
        telephone: '',
        status: -1,
        registerTimeRange: []
      }
    }
  },
  watch: {
    '$i18n.locale': function () {
      this.initStatusOptionList()
    }
  },
  mounted () {
    this.initStatusOptionList()
  },
  methods: {
    search () {
      this.$emit('getSearchData', this.formData)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.$emit('getSearchData', this.formData)
    },
    initStatusOptionList () {
      this.statusOptionList = [
        { value: -1, label: this.$t('common.all') },
        { value: 1, label: this.$t('usermgmt.statusValue.allowed') },
        { value: 0, label: this.$t('usermgmt.statusValue.disallowed') }
      ]
    }
  }
}
</script>
<style lang='less' scoped>
.search{
  .el-select{
    width:80%;
  }
  .el-input{
    width:80%;
  }
}
</style>
