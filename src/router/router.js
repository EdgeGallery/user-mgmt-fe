/*
 *  Copyright 2020 Huawei Technologies Co., Ltd.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/',
          name: 'login',
          component: () => import('../user/Login.vue')
        },
        {
          path: 'mecm/register',
          name: 'register',
          component: () => import('../user/Register.vue')
        },
        {
          path: 'mecm/getPwd',
          name: 'getpwd',
          component: () => import('../user/Getpwd.vue')
        },
        {
          path: 'mecm/userPrivacy',
          name: 'userprivacy',
          component: () => import('../user/UserPrivacy.vue')
        },
        {
          path: 'usermgmt/list',
          name: 'userList',
          component: () => import('../user/mgmt/UserList.vue')
        },
        {
          path: 'usermgmt/center',
          name: 'userCenter',
          component: () => import('../user/UserCenter.vue')
        }
      ]
    }
  ]
})
