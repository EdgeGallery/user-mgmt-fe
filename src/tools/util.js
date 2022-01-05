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

export const DEFAULT_USER_ADMIN = 'admin'
export const DEFAULT_USER_GUEST = 'guest'

export const PW_MODIFY_SCENE_NORMAL = '0'
export const PW_MODIFY_SCENE_FIRSTLOGIN = '1'
export const PW_MODIFY_SCENE_EXPIRED = '2'

export const ERRCODE_VERIFYCODE_WRONG = 70011

// is force modify pw
export const isForceModifyPwScene = (pwModiScene) => {
  return pwModiScene === PW_MODIFY_SCENE_FIRSTLOGIN || pwModiScene === PW_MODIFY_SCENE_EXPIRED
}

// anonymize mail address
export const anonymizeMail = (mailAddr) => {
  if (mailAddr) {
    let _atSignPos = mailAddr.indexOf('@')
    return _atSignPos <= 1
      ? mailAddr : mailAddr.substring(0, 1) + '****' + mailAddr.substring(_atSignPos)
  }
  return ''
}

// anonymize telehone number
export const anonymizeTelphone = (telephone) => {
  if (telephone) {
    return telephone.length === 11
      ? telephone.substring(0, 3) + '****' + telephone.substring(7) : telephone
  }

  return ''
}

// get query parameter from location href
export const getQueryString = (paraName) => {
  let _splitResultArr = window.location.href.split('?')
  if (_splitResultArr.length < 2) {
    return null
  }
  let reg = new RegExp('(^|&)' + paraName + '=([^&]*)(&|$)', 'i')
  let result = _splitResultArr[1].match(reg)
  return result != null ? decodeURIComponent(result[2]) : null
}
