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
  <div class="protocol">
    <div class="left">
      <h4>{{ $t('login.legalProvisions') }}</h4>
      <ul>
        <p class="title">
          <em class="el-icon-arrow-down" />{{ $t('login.siteAgreement') }}
        </p>
        <li
          :class="{'selected':privacyName==='useragreement'}"
          @click="jumpTo('useragreement')"
        >
          <span class="line" />{{ $t('login.userAgreement') }}
        </li>
        <li
          :class="{'selected':privacyName==='userprivacy'}"
          @click="jumpTo('userprivacy')"
        >
          <span class="line" />{{ $t('login.privacyStatement') }}
        </li>
      </ul>
    </div>
    <div id="mavon-editor">
      <mavon-editor
        v-model="markdownSource"
        :toolbars-flag="false"
        :editable="false"
        :subfield="false"
        default-open="preview"
        :box-shadow="false"
        preview-background="#ffffff"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'UserPrivacy',
  data () {
    return {
      markdownSource: '',
      privacyName: sessionStorage.getItem('privacyName')
    }
  },
  methods: {
    getMarkDown (privacyName) {
      let url = ''
      if (privacyName === 'useragreement') {
        url = './user-agreement.md'
      } else if (privacyName === 'userprivacy') {
        url = './user-privacy.md'
      }
      axios(url).then(res => {
        this.markdownSource = res.data
      })
    },
    jumpTo (name) {
      this.privacyName = name
      this.getMarkDown(name)
    }
  },
  created () {
  },
  mounted () {
    this.getMarkDown(this.privacyName)
    function apiHeight () {
      const oApi = document.getElementById('mavon-editor')
      const deviceHeight = document.documentElement.clientHeight
      oApi.style.height = Number(deviceHeight) - 65 + 'px'
    }
    apiHeight()
    window.onresize = function () {
      apiHeight()
    }
  }
}
</script>

<style lang="less">
.protocol{
  display: flex;
  font-size: 14px;
  .left{
    width: 300px;
    background: #f7f7f7;
    h4{
      padding-left: 30px;
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #ddd;
      font-size: 24px;
    }
    ul{
      padding: 20px 0 0 30px;
      .title{
        margin-bottom: 10px;
        em{
          margin-right: 5px;
        }
      }
      li{
        height: 35px;
        line-height: 35px;
        cursor: pointer;
        .line{
          display: inline-block;
          width: 8px;
          height: 1px;
          background: #aaa;
          vertical-align: middle;
          margin: -3px 0 0 20px;
        }
      }
      li.selected{
        color: #10bbb7;
        .line{
          background: #10bbb7;
        }
      }
    }
  }
  #mavon-editor{
    flex-grow: 1;
  }
}
</style>
