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
  <div
    class="home"
    :style="{backgroundImage: 'url(' + bgImg + ')' }"
  >
    <Navbar />
    <div class="home-container">
      <router-view
        id="container"
        class="clearfix"
        @clearBgImg="clearBgImg"
        @restoreBgImg="restoreBgImg"
      />
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Nav.vue'
export default {
  name: 'Home',
  components: {
    Navbar
  },
  data () {
    return {
      needChangeFlag: true,
      bgImg: require('../assets/images/background.png'),
      bgImgData: [
        require('../assets/images/background.png')
      ]
    }
  },
  methods: {
    changeBgImg () {
      if (!this.needChangeFlag) {
        return
      }
      let dataItem = this.bgImgData[Math.floor(Math.random() * this.bgImgData.length)]
      this.bgImg = dataItem
    },
    clearBgImg () {
      this.needChangeFlag = false
      this.bgImg = undefined
    },
    restoreBgImg () {
      this.needChangeFlag = true
      this.changeBgImg()
    }
  },
  mounted () {
    this.changeBgImg()
  }
}
</script>
<style lang='less' scoped>
.home{
  height:100%;
  background: no-repeat center;
  background-size:cover;
  overflow-y: auto;
}
.home-container{
  position: relative;
  height: 100%;
}
#container{
  padding:0 10% 30px;
  position: relative;
}
@media screen and (max-width: 1380px) {
  #container{
    padding: 0 30px 30px;
  }
}
@media screen and (max-width: 640px) {
  #container{
    padding: 0 0 30px;
  }
}
</style>
