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
    contact: 'Contact Number',
    company: 'Company',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    namePla: 'Username / Email / Mobile Phone',
    pwdPla: 'Password',
    pwdConfPla: 'Confirm Password',
    compPla: 'Company',
    mailAddr: 'Email Address',
    telPla: 'Mobile Phone Number',
    registerHint: 'Tip: it is recommended to fill in at least one piece of real information for email address and mobile phone number, so as to retrieve the password after forgetting it.',
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
    loginFail: 'Failed to log in, please check your account and password, enter the wrong password more than five consecutive times, the account will be locked',
    loginFailDisallow: 'Failed to log in, forbidden to login',
    usernameRule: 'Any of two combinations of 6-30 characters, numbers, and underscores. The first digit must be a letter',
    passwordRule: 'The password must be composed of 6-18 characters, numbers and special symbols',
    phoneNumberRule: 'The mobile phone number is not in accordance with the rules',
    mailAddressRule: 'The email address is not in accordance with the rules',
    userLock: 'You have entered the wrong password five times in a row, the account has been locked, please try again in 5 minutes',
    hasLogin: 'has log in.'
  },
  nav: {
    logoutTip: 'Are you sure to log out?'
  },
  usermgmt: {
    userName: 'Username',
    role: 'Role',
    accessPlatform: 'Platform',
    status: 'Status',
    telephone: 'Mobile Phone Number',
    mailAddress: 'Email Address',
    registerTime: 'Register Time',

    registerTimeRange: 'Register Time Range',
    beginTime: 'Begin Time',
    endTime: 'End Time',

    setting: {
      dlgTitle: 'User Setting',
      role: 'Role:',
      platform: 'Platform:'
    },

    operate: {
      disallow: 'disallow',
      allow: 'allow',
      setting: 'setting'
    },

    statusValue: {
      disallowed: 'Disallowed',
      allowed: 'Allowed'
    },
    roleValue: {
      admin: 'Administrator',
      tenant: 'Tenant',
      guest: 'Guest'
    },
    tip: {
      confirmDisallowUser: 'Are you sure to disallow this user?',
      confirmAallowUser: 'Are you sure to allow this user?',
      platformMustBeSelected: 'Please select platform.',
      configUserFailed: 'Config User Failed!'
    }
  },
  common: {
    cancel: 'Cancel',
    submit: 'Submit',
    confirm: 'Confirm',
    operation: 'Operation',
    reset: 'Reset',
    search: 'Search',
    query: 'Query',
    all: 'All',
    warning: 'Promt',
    unknown: 'Unknown'
  },
  verify: {
    usernameTip: 'User name can not be empty',
    passwordTip: 'Password can not be empty',
    confirmpasswordTip: 'Confirm password can not be empty',
    telephoneTip: 'Mobile phone number can not be empty',
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
    nameAlSinged: 'The username number has been already registered',
    telAlSigned: 'The mobile phone number has been already registered',
    mailAlSigned: 'The email address has been already registered',
    getVerifyCodeSuc: 'Successfully obtained verification code',
    passDiferent: 'The two passwords are different!'
  },
  ...enLocale
}

export default en
