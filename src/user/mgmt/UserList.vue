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
  <div class="userlist">
    <Breadcrumb
      class="breadcrumb"
      :first="$t('nav.platform')"
      :second="$t('nav.usermgmt')"
      :path="{ path: '/usermgmt/list' }"
    />
    <div
      class="cls_userlist"
      id="div_userlist"
    >
      <el-tabs
        v-model="roleType"
        type="card"
        @tab-click="handleChangeRoleTab"
      >
        <el-tab-pane
          :label="$t('common.all')"
          name="ALL"
        />
        <el-tab-pane
          :label="$t('usermgmt.roleValue.admin')"
          name="ADMIN"
        />
        <el-tab-pane
          :label="$t('usermgmt.roleValue.tenant')"
          name="TENANT"
        />
      </el-tabs>
      <Search
        @getSearchData="getSearchData"
      />
      <div class="tableDiv">
        <el-row class="table">
          <el-table
            :data="userListData"
            @sort-change="doSort"
            :default-sort="{prop: 'createTime', order: 'ascending'}"
            v-loading="dataLoading"
            border
            stripe
            size="small"
            style="width: 100%;"
          >
            <el-table-column
              prop="username"
              align="center"
              sortable="custom"
              :label="$t('usermgmt.userName')"
              show-overflow-tooltip
            />
            <el-table-column
              width="120"
              align="center"
              :label="$t('usermgmt.role')"
              :formatter="convertRole"
              show-overflow-tooltip
            />
            <el-table-column
              width="320"
              align="center"
              :label="$t('usermgmt.accessPlatform')"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-tag
                  size="mini"
                  v-for="(item,index) in scope.row.permissions"
                  :key="index"
                >
                  {{ item.platform }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              width="100"
              align="center"
              :label="$t('usermgmt.status')"
              :formatter="convertStatus"
              show-overflow-tooltip
            />
            <el-table-column
              prop="mailAddress"
              align="center"
              :label="$t('usermgmt.mailAddress')"
              :formatter="showNoConfigOnEmpty"
              show-overflow-tooltip
            />
            <el-table-column
              prop="telephone"
              width="150"
              align="center"
              :label="$t('usermgmt.telephone')"
              :formatter="showNoConfigOnEmpty"
              show-overflow-tooltip
            />
            <el-table-column
              prop="createTime"
              width="225"
              align="center"
              sortable="custom"
              :label="$t('usermgmt.registerTime')"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('common.operation')"
              align="center"
              width="200"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-button
                  id="disallowBtn"
                  @click.native.prevent="handleUpdateUserStatus(scope.row, true)"
                  type="text"
                  size="small"
                  v-if="!judgeSystemUser(scope.row) && scope.row.allowed !== undefined && scope.row.allowed"
                >
                  {{ $t('usermgmt.operate.disallow') }}
                </el-button>
                <el-button
                  id="allowBtn"
                  @click.native.prevent="handleUpdateUserStatus(scope.row, false)"
                  type="text"
                  size="small"
                  v-if="!judgeSystemUser(scope.row) && (scope.row.allowed === undefined || !scope.row.allowed)"
                >
                  {{ $t('usermgmt.operate.allow') }}
                </el-button>
                <el-button
                  id="settingBtn"
                  @click.native.prevent="handleSetUser(scope.row)"
                  type="text"
                  size="small"
                  v-if="!judgeSystemUser(scope.row)"
                  :disabled="scope.row.allowed === undefined || !scope.row.allowed"
                >
                  {{ $t('usermgmt.operate.setting') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <div class="pageBar">
          <el-pagination
            background
            class="rt"
            @size-change="handlePageSizeChange"
            @current-change="handleCurrentPageChange"
            :current-page="pageCtrl.currentPage"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="pageCtrl.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageCtrl.totalNum"
            v-if="pageCtrl.totalNum!=0"
          />
        </div>
      </div>
    </div>
    <UserSetting
      :user-data="showUserData"
      :show-dlg="showUserSettingDlg"
      @cancelUserSettingDlg="cancelUserSettingDlg"
      @processUserSettingSuccess="processUserSettingSuccess"
    />
  </div>
</template>
<script>
import Breadcrumb from '../../components/BreadCrumb.vue'
import Search from './UserSearch.vue'
import UserSetting from './UserSetting.vue'
import { api } from '../../tools/api.js'

export default {
  name: '',
  components: {
    Breadcrumb, Search, UserSetting
  },
  inject: ['reload'],
  data () {
    return {
      dataLoading: false,
      searchCondition: {
        username: '',
        mailAddress: '',
        telephone: '',
        status: -1,
        createTimeBegin: '',
        createTimeEnd: ''
      },
      pageCtrl: {
        totalNum: 0,
        pageSize: 10,
        currentPage: 1
      },
      sortCtrl: {
        sortBy: 'createTime',
        sortOrder: 'ASC'
      },
      userListData: [],

      roleType: 'ALL',
      roleOptionList: [
        { value: 'ADMIN', label: this.$t('usermgmt.roleValue.admin') },
        { value: 'TENANT', label: this.$t('usermgmt.roleValue.tenant') },
        { value: 'GUEST', label: this.$t('usermgmt.roleValue.guest') }
      ],

      showUserSettingDlg: false,
      showUserData: {}
    }
  },
  watch: {
  },
  mounted () {
    this.getUserList()
  },
  methods: {
    handlePageSizeChange (val) {
      this.pageCtrl.currentPage = 1
      this.pageCtrl.pageSize = val
      this.getUserList()
    },
    handleCurrentPageChange (val) {
      this.pageCtrl.currentPage = val
      this.getUserList()
    },
    getSearchData (searchFormData) {
      this.pageCtrl.currentPage = 1
      this.searchCondition.username = searchFormData.username
      this.searchCondition.mailAddress = searchFormData.mailAddress
      this.searchCondition.telephone = searchFormData.telephone
      this.searchCondition.status = searchFormData.status
      this.searchCondition.createTimeBegin = ''
      this.searchCondition.createTimeEnd = ''
      if (searchFormData.registerTimeRange && searchFormData.registerTimeRange.length === 2) {
        this.searchCondition.createTimeBegin = searchFormData.registerTimeRange[0]
        this.searchCondition.createTimeEnd = searchFormData.registerTimeRange[1]
      }
      this.getUserList()
    },
    handleChangeRoleTab (tab, event) {
      this.pageCtrl.currentPage = 1
      this.getUserList()
    },
    doSort (sortRule) {
      if (sortRule.order) {
        let _ascendingFlag = sortRule.order === 'ascending'
        this.sortCtrl.sortBy = sortRule.prop
        this.sortCtrl.sortOrder = _ascendingFlag ? 'ASC' : 'DESC'
      } else {
        this.sortCtrl.sortBy = 'createTime'
        this.sortCtrl.sortOrder = 'ASC'
      }
      this.pageCtrl.currentPage = 1
      this.getUserList()
    },
    getUserList () {
      this.dataLoading = true
      let headers = {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
      }
      api.getUserList(this.buildQueryReq(), headers).then(response => {
        this.userListData = response.data.userList
        this.pageCtrl.totalNum = response.data.totalCount

        this.dataLoading = false
      }).catch((error) => {
        this.dataLoading = false
        if (error.response.status === 404 && error.response.data.details[0] === 'Record not found') {
          this.paginationData = []
        } else {
          this.$message.error(this.$t('tip.failedToGetList'))
        }
      })
    },
    buildQueryReq () {
      let _queryReq = this.searchCondition
      _queryReq.role = this.roleType

      let _queryCtrl = {
        'offset': (this.pageCtrl.currentPage - 1) * this.pageCtrl.pageSize,
        'limit': this.pageCtrl.pageSize,
        'sortBy': this.sortCtrl.sortBy,
        'sortOrder': this.sortCtrl.sortOrder
      }
      _queryReq.queryCtrl = _queryCtrl

      return _queryReq
    },
    convertRole (row) {
      if (row.permissions && row.permissions.length) {
        let roleOption = this.roleOptionList.find(item => item.value === row.permissions[0].role)
        if (roleOption) {
          return roleOption.label
        }
      }

      return this.$t('common.unknown')
    },
    convertStatus (row) {
      if (row.allowed === undefined) {
        return this.$t('common.unknown')
      }
      if (row.allowed) {
        return this.$t('usermgmt.statusValue.allowed')
      } else {
        return this.$t('usermgmt.statusValue.disallowed')
      }
    },
    showNoConfigOnEmpty (row, column, cellValue) {
      if (cellValue === undefined || cellValue === null || cellValue === '') {
        return this.$t('common.noconfig')
      }
      return cellValue
    },
    judgeSystemUser (row) {
      return row.username === 'admin' || row.username === 'guest'
    },
    handleUpdateUserStatus (row, disallowFlag) {
      this.$confirm(disallowFlag ? this.$t('usermgmt.tip.confirmDisallowUser') : this.$t('usermgmt.tip.confirmAllowUser'), this.$t('common.warning'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.updateUserStatus(row.userId, disallowFlag)
      })
    },
    updateUserStatus (userId, disallowFlag) {
      let headers = {
        'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')
      }
      api.updateUserStatus(userId, disallowFlag, headers).then(response => {
        this.$message.success(disallowFlag ? this.$t('usermgmt.tip.disallowUserSuccess') : this.$t('usermgmt.tip.allowUserSuccess'))
        this.getUserList()
      }).catch(() => {
        this.$message.error(disallowFlag ? this.$t('usermgmt.tip.disallowUserFailed') : this.$t('usermgmt.tip.allowUserFailed'))
      })
    },
    handleSetUser (row) {
      this.showUserData = row
      this.showUserSettingDlg = true
    },
    cancelUserSettingDlg () {
      this.showUserSettingDlg = false
    },
    processUserSettingSuccess () {
      this.showUserSettingDlg = false
      this.getUserList()
    }
  }
}
</script>
<style lang="less">
.userlist{
  top: 65px;
  height: calc(100% - 65px);
  width: 100%;
  box-sizing: border-box;
  background: #fff;
}
.cls_userlist{
  padding: 0 20px;
  height: calc(100% - 125px);
  min-height: 300px;
  background: #fff;
  padding-top:20px;
  .table {
    margin-top: 10px;
  }
  .tableDiv {
    margin-top: 10px;
  }
  .btn-p{
    height:40px;
    padding:5px 0px;
  }
  .mt20 {
    margin-top: 20px;
  }
}
.el-col{
  padding-left:0 !important;
}
.smallSpaceFormItem{
  margin-bottom:5px;
}
.applyDialog{
  .el-form-item{
    margin:0 !important;
  }
}
</style>
