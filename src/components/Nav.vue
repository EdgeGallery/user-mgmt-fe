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
  <div>
    <div
      class="nav_top_right"
    >
      <div class="nav-tabs rt">
        <div class="language rt">
          <span @click="changeLang">{{ language }}</span>
        </div>
        <div class="user rt">
          <span
            v-if="hasLogin"
          >{{ userName }}</span>
          <span
            v-if="hasLogin"
          >|</span>
          <span
            v-if="hasLogin"
            @click="beforeLogout()"
          >{{ $t('login.logout') }}</span>
        </div>
      </div>
    </div>
    <div
      class="navgation"
      v-show="isShowNav"
    >
      <div
        class="logo lt"
      >
        <img
          src="../assets/images/logo.png"
          alt=""
          @click="jumpTo('/')"
        >
      </div>
      <div>
        <Topbar :json-data="jsonData" />
      </div>
    </div>
  </div>
</template>

<script>
import NavDataCn from '../data/NavDataCn.js'
import NavData from '../data/NavData.js'
import Topbar from '../components/Topbar.vue'
import { api, PROXY_PREFIX_CURRENTSERVER } from '../tools/api.js'
import { DEFAULT_USER_ADMIN, DEFAULT_USER_GUEST, isForceModifyPwScene, getQueryString } from '../tools/util.js'

export default {
  name: 'Navgation',
  components: {
    Topbar
  },
  data () {
    return {
      jsonData: [],
      language: 'English',
      hasLogin: false,
      userName: '',
      isSuperAdmin: false,
      isShowNav: false
    }
  },
  mounted () {
    let language = this.initLang()
    language
      ? localStorage.setItem('language', language)
      : localStorage.setItem('language', 'cn')
    language = localStorage.getItem('language')
    this.language = language === 'en' ? '简体中文' : 'English'
    this.$i18n.locale = language

    api.loginInfo().then(res => {
      this.userName = res.data.username
      if (this.userName) {
        this.hasLogin = true
        this.isSuperAdmin = this.userName === DEFAULT_USER_ADMIN
      }

      if (this.jumpToForceModifyPw()) {
        return
      }

      if (this.isSuperAdmin) {
        this.jsonData = this.language === 'English' ? NavDataCn : NavData
        if (this.$route.path === '/') {
          this.jumpTo('/usermgmt/list')
        }
      }

      this.setShowNavFlag(this.$route.path)
    })
  },
  methods: {
    initLang () {
      let _lang = getQueryString('lang')
      if (_lang) {
        _lang = _lang.substring(0, 2)
      }
      return _lang || localStorage.getItem('language')
    },
    jumpToForceModifyPw () {
      if (this.hasLogin && this.userName !== DEFAULT_USER_GUEST) {
        let _pwModiScene = localStorage.getItem('pwmodiscene-' + this.$cookies.get('XSRF-TOKEN'))
        if (isForceModifyPwScene(_pwModiScene)) {
          this.jumpTo('/usermgmt/forcemodifypwd')
          return true
        }
      }

      return false
    },
    jumpTo (path) {
      this.$router.push(path)
    },
    os () {
      let UserAgent = navigator.userAgent.toLowerCase()
      return {
        isWindows: /windows/.test(UserAgent),
        isMac: /mac/.test(UserAgent)
      }
    },
    changeLang () {
      let language
      if (this.language === 'English') {
        this.language = '简体中文'
        language = 'en'
      } else {
        this.language = 'English'
        language = 'cn'
      }
      if (this.isSuperAdmin) {
        this.jsonData = this.language === 'English' ? NavDataCn : NavData
      }
      this.$i18n.locale = language
      localStorage.setItem('language', language)
      this.$store.commit('changelanguage', language)
      this.$root.$emit('languageChange')
      let appDom = document.getElementById('app')
      if (language === 'en') {
        appDom.style.fontFamily = 'Huaweisans, Arial, Microsoft YaHei, FZLTXHJW, Microsoft JhengHei, sans-serif'
      } else {
        if (this.os.isMac) {
          appDom.style.fontFamily = 'PingFang, FZLTXHJW, Hiragino Sans GB, Microsoft YaHei, FZLTXHJW, Microsoft JhengHei, sans-serif'
        } else {
          appDom.style.fontFamily = 'Microsoft YaHei, FZLTXHJW, Microsoft JhengHei, sans-serif'
        }
      }
    },
    beforeLogout () {
      this.$confirm(this.$t('nav.logoutTip'), this.$t('common.warning'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.logout()
      })
    },
    logout () {
      api.logout().then(res => {
        let urlPrefix = window.location.href.indexOf('https') > -1 ? 'https://' : 'http://'
        window.location.href = urlPrefix + window.location.host + PROXY_PREFIX_CURRENTSERVER + '/index.html'
      })
    },
    setShowNavFlag (currPath) {
      if (this.isSuperAdmin &&
        currPath !== '/usermgmt/center' &&
        currPath !== '/usermgmt/forcemodifypwd') {
        this.isShowNav = true
      } else {
        this.isShowNav = false
      }
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.jumpToForceModifyPw()
        this.setShowNavFlag(route.fullPath)
      },
      immediate: true
    }
  }
}
</script>

<style lang='less' scoped>
.nav_top_right{
  position: fixed;
  z-index: 99;
  top: 0px;
  right:0px;
  height: 65px;
  .language {
    display: none;
    line-height: 65px;
    font-size: 14px;
    color: #6c92fa;
    span {
      width:60px!important;
      top:3px!important;
    }
    span:hover {
      text-decoration: underline;
    }
  }
  .user {
    display: inline-block;
    line-height: 65px;
    font-size: 14px;
    color: #6c92fa;
    span {
      width:100%;
      top:3px!important;
    }
    span:hover {
      text-decoration: underline;
    }
  }
  .nav-tabs{
    height:100%;
    font-size:20px;
    line-height: 50px;
    margin-right: 10px;
    span{
      height:24px;
      margin-right: 10px;
      position: relative;
      top:8px;
      cursor:pointer;
      color:#f5f5f5;
    }
  }
}
.navgation{
  background: #3e279B;
  height: 65px;
  top: 0px;
  width: 100%;
  position: fixed;
  z-index: 2;
  .logo{
    height:65px;
    width: 80%;
    max-width:430px;
    line-height: 57px;
    margin-left:10px;
    img{
      width:130px;
      position: relative;
      top: 15px;
      left: 175px;
      cursor: pointer;
    }
    span{
      position: relative;
      top:1px;
      font-size: 18px;
      color:#ffffff;
      left:20px;
      cursor:pointer;
    }
    span.blue{
      color:#409EFF;
    }
  }
  @media screen and (max-width: 640px) {
      .logo{
        width: 35%;
        img{
          width: 110px;
          margin-top: 8px;
        }
      }
    }
}
</style>
