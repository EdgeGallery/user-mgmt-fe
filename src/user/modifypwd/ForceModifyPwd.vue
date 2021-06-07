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
  <div class="modifypwd">
    <div class="modifypwdBox">
      <p class="info-title">
        <strong>{{ infoTitle }}</strong>
      </p>
      <ModifyPwdComp
        :modify-scene="scene"
      />
      <div
        style="margin-top:200px;"
      />
    </div>
  </div>
</template>
<script>
import { api } from '../../tools/api.js'
import { isForceModifyPwScene, PW_MODIFY_SCENE_FIRSTLOGIN } from '../../tools/util.js'
import ModifyPwdComp from './ModifyPwdComp.vue'
export default {
  name: 'ForceModifyPwd',
  components: {
    ModifyPwdComp
  },
  data () {
    return {
      scene: PW_MODIFY_SCENE_FIRSTLOGIN,
      infoTitle: ''
    }
  },
  watch: {
    '$i18n.locale': function () {
      this.infoTitle = this.scene === PW_MODIFY_SCENE_FIRSTLOGIN ? this.$t('pwdmodify.firstLoginTip') : this.$t('pwdmodify.expiredTip')
    }
  },
  mounted () {
    api.loginInfo().then(res => {
      if (!res.data.username || res.data.username === 'guest') {
        this.$router.push('/')
      }
      this.init()
    }).catch(() => {
      this.$router.push('/')
    })
  },
  methods: {
    init () {
      this.scene = localStorage.getItem('pwmodiscene-' + this.$cookies.get('XSRF-TOKEN'))
      if (!isForceModifyPwScene(this.scene)) {
        this.scene = PW_MODIFY_SCENE_FIRSTLOGIN
      }
      this.infoTitle = this.scene === PW_MODIFY_SCENE_FIRSTLOGIN ? this.$t('pwdmodify.firstLoginTip') : this.$t('pwdmodify.expiredTip')
    }
  }
}
</script>
<style lang="less">
.modifypwd {
  .modifypwdBox {
    margin: 150px 0 0 0;
    text-align: center;
    background: rgba(255,255,255,0.5);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16),
      0 2px 10px 0 rgba(0, 0, 0, 0.12) !important;
    border-radius: 15px;
    .info-title {
      height: 100px;
      line-height: 100px;
      color: #252b3a;
    }
  }
  @media screen and (max-width: 1380px) {
    .modifypwdBox{
      margin: 140px 10px 0 0;
    }
  }
  @media screen and (max-width: 1024px) {
    .modifypwdBox{
      margin: 200px 10px 0 0;
    }
  }
  @media screen and (max-width: 640px) {
    .modifypwdBox{
      width: 340px;
      margin: 140px 10px 0 0;
    }
  }
}
</style>
