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
  <div
    class="home"
    :style="{backgroundImage: 'url(' + bgImg + ')' }"
  >
    <Navbar />
    <div class="home-container">
      <router-view id="container" />
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
      bgImg: require('../assets/images/login2.jpg'),
      bgImgData: [
        require('../assets/images/login2.jpg'),
        require('../assets/images/login4.jpg'),
        require('../assets/images/login6.jpg'),
        require('../assets/images/login7.jpg')
      ]
    }
  },
  methods: {
    changeBgImg () {
      let dataItem = this.bgImgData[Math.floor(Math.random() * this.bgImgData.length)]
      this.bgImg = dataItem
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
}
.home-container{
  height: calc(100% - 65px);
  position: relative;
  top: 65px;
  overflow-y: auto;
}
#container{
  padding:0 50px;
}
@media screen and (max-width: 640px) {
  #container{
    padding: 0;
  }
}
</style>
