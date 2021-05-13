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

export const codeChars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
export const codeColor1 = ['#fffff0', '#f0ffff', '#f0fff0', '#fff0f0']
export const codeColor2 = ['#FF0033', '#006699', '#993366', '#FF9900', '#66CC66', '#FF33CC']

// anomymize mail address
export const anomymizeMail = (mailAddr) => {
  if (mailAddr) {
    let _atSignPos = mailAddr.indexOf('@')
    return _atSignPos <= 1
      ? mailAddr : mailAddr.substring(0, 1) + '****' + mailAddr.substring(_atSignPos)
  }
  return ''
}

// anomymize telehone number
export const anomymizeTelphone = (telephone) => {
  if (telephone) {
    return telephone.length === 11
      ? telephone.substring(0, 3) + '****' + telephone.substring(7) : telephone
  }

  return ''
}
