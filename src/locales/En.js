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

import enLocale from 'element-ui/lib/locale/lang/en'
const en = {
  login: {
    userName: 'Username',
    password: 'Password',
    login: 'Log In',
    logout: 'Log Out',
    register: 'Register',
    legalRegister: 'Agree to the agreement and register',
    iAgree: 'I have read and agree to the',
    userAgreement: '《EdgeGallery Customer Agreement》',
    and: 'and',
    privacyStatement: '《Privacy Statement》',
    legalProvisions: 'Legal Clauses',
    siteAgreement: 'Website Agreement',
    confirmPass: 'Confirm Password',
    contact: 'Contact Number',
    company: 'Company',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    namePla: 'Username/Telephone',
    pwdPla: 'Password',
    pwdConfPla: 'Confirm Password',
    compPla: 'Company',
    telPla: 'Telephone Number',
    getCap: 'Get captcha',
    capPla: 'Captcha',
    newPwd: 'New password',
    confirmNewPwd: 'Confirm your new password',
    forgotPwd: 'Forgot password？',
    modifyPwd: 'Modify Password',
    loginWithUser: 'Account Login',
    welcome: 'EdgeGallery Account Registration',
    freeSign: 'Free Registration',
    getPwd: 'Get Password',
    verify: 'Drag slider to verify',
    finishVerify: 'Verifiy succeeded',
    changeOne: 'Chang one',
    loginFail: 'Failed to log in, Please check your username and password',
    usernameRule: '6-20 letters/numbers/underscores, begin with letters',
    passwordRule: 'Must consist of 6-18 letters/numbers/symbols',
    phoneNumberRule: 'The phone number is not in accordance with the rules'
  },
  common: {
    cancel: 'Cancel',
    submit: 'Submit',
    confirm: 'Confirm'
  },
  verify: {
    usernameTip: 'User name can not be empty',
    passwordTip: 'Password can not be empty',
    telephoneTip: 'Telephone number can not be empty',
    verifyCodeTip: 'Verification code con not be empty',
    verifycodeRule: 'Please enter a six-digit verification code'
  },
  tip: {
    networkError: 'Error, please check your internet!',
    failedReg: 'Failed to register user, please try again. ',
    failedReset: 'Failed to reset password, please try again. ',
    wrongCaptcha: 'Verification failed, please complete verification first!',
    failedAuth: 'Authentication Failure, please recheck the User Name or Password.',
    regUserSuc: 'User is registered successfully!',
    sessionOut: 'Your session is expired.',
    sessionExp: 'Session Expired',
    failedToGetCaptcha: 'Failed to get captcha',
    nameAlSinged: 'The username number has been already registered, please change another one',
    telAlSigned: 'The telephone number has been already registered, please change another one',
    getVerifyCodeSuc: 'Successfully obtained verification code'
  },
  ...enLocale
}

export default en
