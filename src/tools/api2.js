/*
 *  Copyright 2021 Huawei Technologies Co., Ltd.
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

import axios from 'axios'
require('../mock.js')

let api = {
  login (params, verificationCode, headers) {
    return axios.get('/mock/login')
  },
  loginInfo () {
    return axios.get('/mock/auth/login-info')
  },
  logout () {
    return axios.get('/mock/auth/logout')
  },
  getCaptcha (retrieveType, verificationCode, params, headers) {
    return axios.get('/mock/identity/sms')
  },
  getPwd (params, headers) {
    return axios.get('/mock/users/password')
  },
  register (params, verificationCode, headers) {
    return axios.get('/mock/users/register')
  },
  uniqueness (params, headers) {
    return axios.get('/mock/users/action/uniqueness')
  },
  getUserList (params, headers) {
    return axios.get('/mock/users/list')
  },
  updateUserStatus (userId, disallowFlag, headers) {
    return axios.get('/mock/donothing')
  },
  configUser (userId, params, headers) {
    return axios.get('/mock/donothing')
  },
  modifyUser (userId, params, headers) {
    return axios.get('/mock/donothing')
  }
}

export {
  api
}
