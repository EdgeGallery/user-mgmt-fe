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
const Mock = require('mockjs')

const login = function () {
  return ''
}

const logout = function () {
  return ''
}

const getLoginInfo = function () {
  return {
    'username': 'admin',
    'mailAddress': '13800000001@edgegallery.org',
    'telephone': '13800000001',
    'createTime': '2021-01-29 12:02:41.539379',
    'userId': '39937079-99fe-4cd8-881f-04ca8c4fe09d',
    'permissions': [
      {
        'platform': 'APPSTORE',
        'role': 'ADMIN'
      },
      {
        'platform': 'DEVELOPER',
        'role': 'ADMIN'
      },
      {
        'platform': 'MECM',
        'role': 'ADMIN'
      },
      {
        'platform': 'ATP',
        'role': 'ADMIN'
      },
      {
        'platform': 'LAB',
        'role': 'ADMIN'
      }
    ],
    'allowed': true
  }
}

const getVerifyCode = function () {
  return [
    {
    }
  ]
}

const modifyPassword = function () {
  return [
    {
    }
  ]
}

const registerUser = function () {
  return [
    {
    }
  ]
}

const checkUniqueness = function () {
  return [
    {
    }
  ]
}

const getUserList = function () {
  return {
    'totalCount': 20,
    'userList': [
      {
        'username': 'admin',
        'mailAddress': '13800000001@edgegallery.org',
        'telephone': '13800000001',
        'createTime': '2021-01-29 12:02:41.539379',
        'userId': '39937079-99fe-4cd8-881f-04ca8c4fe09d',
        'permissions': [
          {
            'platform': 'APPSTORE',
            'role': 'ADMIN'
          },
          {
            'platform': 'DEVELOPER',
            'role': 'ADMIN'
          },
          {
            'platform': 'MECM',
            'role': 'ADMIN'
          },
          {
            'platform': 'ATP',
            'role': 'ADMIN'
          },
          {
            'platform': 'LAB',
            'role': 'ADMIN'
          }
        ],
        'allowed': true
      },
      {
        'username': 'guest',
        'mailAddress': '13800000000@edgegallery.org',
        'telephone': '13800000000',
        'createTime': '2021-01-29 12:02:41.539379',
        'userId': 'de3565b1-a7c2-42b9-b281-3f032af29ff7',
        'permissions': [
          {
            'platform': 'APPSTORE',
            'role': 'GUEST'
          },
          {
            'platform': 'DEVELOPER',
            'role': 'GUEST'
          },
          {
            'platform': 'MECM',
            'role': 'GUEST'
          },
          {
            'platform': 'ATP',
            'role': 'GUEST'
          },
          {
            'platform': 'LAB',
            'role': 'GUEST'
          }
        ],
        'allowed': true
      },
      {
        'username': 'zhangby004',
        'mailAddress': '13800000001@edgegallery1111.org',
        'telephone': null,
        'createTime': '2021-01-29 14:41:07.026138',
        'userId': 'd3880ea6-de44-4fff-9c55-c6fb00b99fa5',
        'permissions': [
          {
            'platform': 'APPSTORE',
            'role': 'TENANT'
          },
          {
            'platform': 'DEVELOPER',
            'role': 'TENANT'
          },
          {
            'platform': 'MECM',
            'role': 'TENANT'
          },
          {
            'platform': 'ATP',
            'role': 'TENANT'
          },
          {
            'platform': 'LAB',
            'role': 'TENANT'
          }
        ],
        'allowed': true
      }
    ]
  }
}

const doNothing = function () {
  return {}
}

Mock.mock('/mock/login', login)

Mock.mock('/mock/auth/login-info', getLoginInfo)
Mock.mock('/mock/auth/logout', logout)
Mock.mock('/mock/identity/sms', getVerifyCode)
Mock.mock('/mock/users/password', modifyPassword)
Mock.mock('/mock/users/register', registerUser)
Mock.mock('/mock/users/action/uniqueness', checkUniqueness)
Mock.mock('/mock/users/list', getUserList)

Mock.mock('/mock/donothing', doNothing)
