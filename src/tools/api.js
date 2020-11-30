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

import axios from 'axios'

function POST (url, params, headers) {
  return axios.post(url, params, {
    headers: headers
  })
}

function PUT (url, params, headers) {
  return axios.put(url, params, {
    headers: headers
  })
}

let api = {
  login (params, headers) {
    return axios({
      method: 'POST',
      url: '/login',
      withCredentials: true,
      headers: headers,
      data: params
    })
  },
  loginInfo () {
    return axios({
      method: 'GET',
      url: '/auth/login-info'
    })
  },
  logout () {
    return axios({
      method: 'GET',
      url: '/auth/logout'
    })
  },
  getCaptcha (params, headers) {
    return POST('/v1/identity/sms', params, headers)
  },
  getPwd (params, headers) {
    return PUT('/v1/users/password', params, headers)
  },
  register (params, headers) {
    return POST('/v1/users', params, headers)
  },
  uniqueness (params, headers) {
    return POST('/v1/users/action/uniqueness', params, headers)
  }
}

export {
  api
}
