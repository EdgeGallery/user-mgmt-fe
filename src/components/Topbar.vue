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
  <div class="main-sidebar">
    <el-menu
      :default-active="indexName"
      :unique-opened="true"
      router
      @select="handleSelect"
      text-color="#ffffff"
      background-color="#282B33"
      active-text-color="#688EF3"
      mode="horizontal"
    >
      <!-- 一级菜单 -->
      <template v-for="item in jsonData">
        <el-submenu
          v-if="item.children && item.children.length"
          :index="item.path"
          :key="item.id"
        >
          <template slot="title">
            <em :class="item.icon" /><span class="first-menu">{{ item.name }}</span>
          </template>

          <!-- 二级菜单 -->
          <template v-for="itemChild in item.children">
            <el-submenu
              v-if="itemChild.children && itemChild.children.length"
              :index="itemChild.path"
              :key="itemChild.id"
            >
              <template slot="title">
                <em :class="itemChild.icon" /><span class="second-menu">{{ itemChild.name }}</span>
              </template>

              <!-- 三级菜单 -->
              <el-menu-item
                v-for="itemChild_Child in itemChild.children"
                :index="itemChild_Child.path"
                :key="itemChild_Child.id"
              >
                <em :class="itemChild_Child.icon" />
                <span slot="title">{{ itemChild_Child.name }}</span>
              </el-menu-item>
            </el-submenu>

            <el-menu-item
              v-else
              :index="itemChild.path"
              :key="itemChild.id"
            >
              <em :class="itemChild.icon" />
              <span
                slot="title"
                class="second-menu"
                v-html="itemChild.href=='1'? itemChild.html:itemChild.name"
              >{{ itemChild.name }}</span>
            </el-menu-item>
          </template>
        </el-submenu>

        <el-menu-item
          v-else
          :index="item.path"
          :key="item.id"
        >
          <em :class="item.icon" />
          <span
            slot="title"
            class="first-menu"
          >{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>

export default {
  name: 'MainSidebar',
  props: {
    jsonData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      indexName: ''
    }
  },
  methods: {
    handleSelect (path) {
      this.indexName = path
      this.$root.$emit('refreshDnd')
      this.$root.$emit('refreshProvision')
    }

  },
  watch: {
    $route (to, from) {
      this.indexName = to.path
      // 解决MECDeveloper下DevTools导航子菜单首次点击没有选中状态问题
      if (this.indexName === '/mecm/mep/detail') {
        this.indexName = '/mecm/mep/list'
      } else if (this.indexName === '/mecm/apac/detail') {
        this.indexName = '/mecm/apac/list'
      } else if (this.indexName === '/mecm/apac/list/?type=mep') {
        this.indexName = '/mecm/apac/list'
      }
    }
  },
  beforeMount () {
    if (sessionStorage.getItem('user')) {
      this.user = JSON.parse(sessionStorage.getItem('user'))
    }
  },
  mounted () {
    this.indexName = this.$route.fullPath
  }
}

</script>
<style lang='less'>
.main-sidebar{
  position: relative;
  top:6px;
  z-index: 0;
  float: left;
  .el-menu.el-menu--horizontal{
    height: 50px;
    border-bottom: none;
    border:none!important;
  .el-menu-item{
    height: 50px;
    line-height: 50px;
    background-color: #3e279B !important;
  }
  .el-menu-item.is-active{
    color: #FFFFFF !important;
  }
}
.el-menu--horizontal>.el-submenu .el-submenu__title{
  height: 50px !important;
  line-height: 50px !important;
}
.el-menu{
  display: flex;
  .first-menu{
    font-size: 18px;
    color: #FFFFFF !important;
    font-weight: none;
  }
  .second-menu{
    font-size: 15px;
  }
  .third-menu{
    font-size: 12px;
  }
}
}

</style>
