/*
 *  Copyright 2020-2021 Huawei Technologies Co., Ltd.
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
  login (params, verificationCode, headers) {
    return axios({
      method: 'POST',
      url: '/login?verifyCode=' + verificationCode,
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
  checkVerificationCode (verificationCode) {
    return axios({
      method: 'GET',
      url: '/v1/identity/verifycode-image/precheck?verifyCode=' + verificationCode
    })
  },
  getCaptcha (retrieveType, verificationCode, params, headers) {
    let _url = retrieveType === 'ByMail' ? '/v1/identity/mail' : '/v1/identity/sms'
    _url += '?verifyCode=' + verificationCode
    return POST(_url, params, headers)
  },
  getPwd (params, headers) {
    return PUT('/v1/users/password', params, headers)
  },
  register (params, verificationCode, headers) {
    return POST('/v1/users?verifyCode=' + verificationCode, params, headers)
  },
  uniqueness (params, headers) {
    return POST('/v1/users/action/uniqueness', params, headers)
  },
  getUserList (params, headers) {
    return POST('/v1/users/list', params, headers)
  },
  updateUserStatus (userId, disallowFlag, headers) {
    let urlSuffix = disallowFlag ? 'disallow' : 'allow'
    return PUT('/v1/users/status/' + userId + '/' + urlSuffix, {}, headers)
  },
  configUser (userId, params, headers) {
    return PUT('/v1/users/settings/' + userId, params, headers)
  },
  modifyUser (userId, params, headers) {
    return PUT('/v1/users/' + userId, params, headers)
  }
}

export {
  api
}
