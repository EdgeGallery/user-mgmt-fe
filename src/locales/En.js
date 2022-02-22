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

import enLocale from 'element-ui/lib/locale/lang/en'
const en = {
  login: {
    userName: 'Username',
    password: 'Password',
    login: 'Log In',
    register: 'Register',
    logout: 'Log Out',
    hasAccountHint: 'Already has account?',
    goLogin: 'click to login',
    legalRegister: 'Agree to the agreement and register',
    iAgree: 'I have read and agree to the',
    userAgreement: 'EdgeGallery Customer Agreement',
    and: 'and',
    privacyStatement: 'Privacy Statement',
    legalProvisions: 'Legal Clauses',
    siteAgreement: 'Website Agreement',
    contact: 'Contact Number',
    company: 'Company',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    namePla: 'Username / Email',
    pwdPla: 'Password',
    pwdConfPla: 'Confirm Password',
    compPla: 'Company',
    mailAddr: 'Email Address',
    telPla: 'Mobile Phone Number',
    registerHint: 'Tip: it is recommended to fill in at least one piece of real information for email address and mobile phone number, so as to retrieve the password after forgetting it.',
    getCap: 'Get captcha',
    capInImg: 'Captcha Code',
    capPla: 'Digit Captcha Code',
    sendCaptchaTo: 'Send captcha to:',
    newPwd: 'New password',
    confirmNewPwd: 'Confirm your new password',
    forgotPwd: 'Forgot password？',
    loginWithUser: 'Account Login',
    welcome: 'Account Registration',
    freeSign: 'Free Registration',
    getPwd: 'Get Password',
    getPwdByMail: 'By Mail',
    getPwdBySms: 'By Mobile Phone',
    verify: 'Drag slider to verify',
    finishVerify: 'Verifiy succeeded',
    changeOne: 'Chang one',
    loginFail: 'Failed to log in, please check your account and password, enter the wrong password more than five consecutive times, the account will be locked',
    usernameRule: 'Any of two combinations of 6-30 characters, numbers, and underscores. The first digit must be a letter',
    passwordRule: 'The password must be composed of 6-18 characters, numbers and special symbols',
    phoneNumberRule: 'The mobile phone number is not in accordance with the rules',
    mailAddressRule: 'The email address is not in accordance with the rules',
    userLock: 'You have entered the wrong password five times in a row, the account has been locked, please try again in 5 minutes',
    hasLogin: ' has logged in.'
  },
  nav: {
    platform: 'Edge Gallery',
    usermgmt: 'User Management',
    logoutTip: 'Are you sure to log out?'
  },
  usermgmt: {
    userName: 'Username',
    role: 'Role',
    accessPlatform: 'Platform',
    status: 'Status',
    telephone: 'Mobile Phone',
    mailAddress: 'Email',
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
      disallowUserSuccess: 'Disallow user succeed!',
      disallowUserFailed: 'Disallow user failed!',
      confirmAllowUser: 'Are you sure to allow this user?',
      allowUserSuccess: 'Allow user succeed!',
      allowUserFailed: 'Allow user failed!',
      platformMustBeSelected: 'Please select platform.',
      configUserFailed: 'Config user failed!'
    }
  },
  usercenter: {
    welcomePrefix: 'Hello, ',
    basicInfo: 'Basic Information',
    accountName: 'Account Name:',
    registerTime: 'Registration Time:',
    emailAddr: 'Email Address:',
    mobilePhone: 'Mobile Number:',
    permissionInfo: 'Permission Information',
    role: 'Role:',
    platform: 'Platform:',
    modifyPwd: 'Modify Password'
  },
  pwdmodify: {
    oldPw: 'Old Password:',
    newPw: 'New Password:',
    confirmNewPw: 'Confirm Password:',
    passNotChanged: 'New password is same as old password',
    modifyPwdSucceed: 'Successfully modify your password!',
    modifyPwdFailed: 'Failed to modify your password, please try again later.',
    firstLoginTip: 'Modify Password (First time login)',
    expiredTip: 'Modify Password (Password has expired)',
    cancelOnFirstLoginTip: 'After the first login, you must change the default password. If you cancel, you will exit the current account. Continue?',
    cancelOnPwExpiredTip: 'Your password has expired. You must set a new password. If you cancel, you will exit the current account. Continue?'
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
    next: 'Next',
    prev: 'Previous',
    warning: 'Promt',
    unknown: 'Unknown',
    noconfig: 'No configured'
  },
  verify: {
    usernameTip: 'User name can not be empty',
    passwordTip: 'Password can not be empty',
    confirmpasswordTip: 'Confirm password can not be empty',
    telephoneTip: 'Mobile phone number can not be empty',
    mailAddressBlankTip: 'Email Address can not be empty',
    verifyCodeTip: 'Verification code con not be empty',
    verifycodeRule: 'Please enter a six-digit verification code',
    imgVerifycodeRule: 'Please enter a four-digit verification code',
    imgVerifycodeWrong: 'verification code error or expired'
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
    failedToGetCaptcha: 'Failed to get captcha!',
    nameAlSinged: 'The username number has been already registered',
    telAlSigned: 'The mobile phone number has been already registered',
    mailAlSigned: 'The email address has been already registered',
    telNotExist: 'The mobile phone number does not exist',
    mailNotExist: 'The email address does not exist',
    getVerifyCodeSuc: 'Successfully obtained verification code!',
    resetPassSuc: 'Successfully reset your password!',
    passDiferent: 'The two passwords are different!',
    approveLegal: 'Please read and agree to our customer agreement and privacy statement!'
  },
  errorCode: {
    70000: 'No login user.',
    70001: 'No permission.',
    70002: 'Illegal parameter.',
    70003: 'Database Exception.',
    70004: 'The user does not exist.',
    70005: 'The mobile phone does not exist.',
    70006: 'The email address does not exist.',
    70007: 'The user name has been registered.',
    70008: 'The mobile phone number has been registered.',
    70009: 'The email address has been registered.',
    70010: 'The password is incorrect.',
    70011: 'The verification code is wrong or expired.',
    70012: 'Sms server connect failed.',
    70013: 'Send verification code by sms failed.',
    70014: 'Send verification code by mail failed.',
    70015: 'User register failed.',
    70016: 'Modify password failed.',
    70017: 'Login failed.',
    79999: 'Unkown Error.'
  },
  ...enLocale
}

export default en
