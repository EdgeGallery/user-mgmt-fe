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
  <div class="navgation">
    <div
      class="logo lt"
      @click="jumpTo('/')"
    >
      <img
        src="../assets/images/logo.png"
        alt=""
      >
    </div>
    <div class="nav-tabs rt">
      <div class="language rt">
        <span @click="changeLang">{{ language }}</span>
      </div>
      <div class="user rt">
        <span
          @click="jumpTo('/mecm/register')"
        >{{ $t('login.register') }}</span>
      </div>
      <div class="user rt">
        <span
          @click="jumpTo('/')"
        >{{ $t('login.login') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navgation',
  components: {},
  data () {
    return {
      language: 'English'
    }
  },
  mounted () {
    let language = localStorage.getItem('language')
    language
      ? localStorage.setItem('language', language)
      : localStorage.setItem('language', 'cn')
    language = localStorage.getItem('language')
    this.language = language === 'en' ? '简体中文' : 'English'
  },
  methods: {
    jumpTo (path) {
      if (path === '/') {
        this.$router.push(JSON.parse(sessionStorage.getItem('obj')).login_url)
      } else {
        this.$router.push(path)
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
    }
  }
}
</script>

<style lang='less' scoped>
.navgation{
  background: #282B33;
  height: 65px;
  top: 0px;
  width: 100%;
  position: fixed;
  z-index: 2;
  .logo{
    height:65px;
    width:430px;
    line-height: 65px;
    margin-left:17px;
    img{
      width:150px;
      position: relative;
      top: 0px;
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
  .language {
    display: inline-block;
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
      display: inline-block;
      width:100%;
      height:24px;
      margin-right: 20px;
      position: relative;
      top:8px;
      cursor:pointer;
      color:#f5f5f5;
    }
  }
}
</style>
