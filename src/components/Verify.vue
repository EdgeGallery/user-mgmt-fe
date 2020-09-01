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
  <div class="verifyCom">
    <div
      class="verify-box"
      :class="sliderStatus?'success':''"
    >
      <em
        @mousedown="moveSlider"
        :class="sliderStatus?successIcon:startIcon"
        ref="btn"
      />
      <span v-show="sliderStatus">{{ $t('login.finishVerify') }}</span>
      <span v-show="!sliderStatus">{{ $t('login.verify') }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 成功之后的函数
    successFun: {
      type: Function,
      default: function () {}
    },
    // 成功图标
    successIcon: {
      type: String,
      default: 'el-icon-success'
    },
    // 开始的图标
    startIcon: {
      type: String,
      default: 'el-icon-d-arrow-right'
    },
    // 失败之后的函数
    errorFun: {
      type: Function,
      default: function () {}
    },
    verifyStatus: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      disX: 0,
      sliderStatus: false
    }
  },
  watch: {
    verifyStatus (val) {
      if (!val) {
        this.$refs.btn.style.transition = '.5s all'
        this.$refs.btn.style.transform = 'translateX(0)'
        this.sliderStatus = false
        // 执行fail的函数
        this.errorFun && this.errorFun()
      }
    }
  },
  methods: {
    // 滑块移动
    moveSlider (e) {
      let ele = e.target
      let startX = e.clientX
      let eleWidth = ele.offsetWidth
      let parentWidth = ele.parentElement.offsetWidth
      let MaxX = parentWidth - eleWidth
      if (this.sliderStatus) { // 不运行
        return false
      }
      document.onmousemove = (event) => {
        let endX = event.clientX
        this.disX = endX - startX
        if (this.disX <= 0) {
          this.disX = 0
        }
        if (this.disX >= MaxX - eleWidth) { // 减去滑块的宽度,体验效果更好
          this.disX = MaxX
        }
        ele.style.transition = '.1s all'
        ele.style.transform = 'translateX(' + this.disX + 'px)'
        event.preventDefault()
      }
      document.onmouseup = () => {
        if (this.disX !== MaxX) {
          ele.style.transition = '.5s all'
          ele.style.transform = 'translateX(0)'
          // 执行fail的函数
          this.errorFun && this.errorFun()
        } else {
          this.sliderStatus = true
          // 执行成功的函数
          this.successFun && this.successFun()
        }
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
</script>
<style lang='less' scoped>
  .verify-box{
    background-color: #FFCCCC;
    position: relative;
    transition: 1s all;
    user-select: none;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px; /*no*/
    line-height: 40px;;
    border-radius: 4px;
    margin-bottom: 15px;
    em{
      position: absolute;
      left: 0;
      width: 60px;
      height: 38px;
      line-height:38px;
      color: #919191;
      background-color: #fff;
      border: 1px solid #bbb;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
    }
  }
  .success{
    background-color: #7AC23C;
    color: #fff;
    i{
      color: #7AC23C;
    }
  }
</style>
