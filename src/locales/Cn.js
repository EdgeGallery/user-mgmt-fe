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

import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
const cn = {
  login: {
    userName: '用户名',
    password: '密码',
    login: '登录',
    register: '注册',
    logout: '注销',
    legalRegister: '同意协议并注册',
    iAgree: '我已阅读并同意',
    userAgreement: '《EdgeGallery用户协议》',
    and: '和',
    privacyStatement: '《隐私政策声明》',
    legalProvisions: '法律条文',
    siteAgreement: '网站协议',
    contact: '联系方式',
    company: '工作单位',
    gender: '性别',
    male: '男',
    female: '女',
    namePla: '用户名 / 邮箱 / 手机',
    pwdPla: '密码',
    pwdConfPla: '确认密码',
    compPla: '公司任职信息',
    mailAddr: '邮箱地址',
    telPla: '手机号码',
    registerHint: '提示：建议邮箱地址和手机号码二者至少提供一项真实信息，方便忘记密码后找回。',
    getCap: '获取验证码',
    capPla: '验证码',
    newPwd: '新密码',
    confirmNewPwd: '确认新密码',
    forgotPwd: '忘记密码？',
    loginWithUser: '帐号登录',
    welcome: '欢迎注册EdgeGallery',
    freeSign: '免费注册',
    getPwd: '找回密码',
    getPwdByMail: '通过邮箱找回',
    getPwdBySms: '通过手机号码找回',
    verify: '拖动完成验证',
    finishVerify: '验证成功',
    changeOne: '换一张',
    loginFail: '登录失败，请检查帐号名和密码，连续输入错误密码五次以上，帐号将会被锁定',
    usernameRule: '6-30位字母,数字,下划线任意两种组合，首位必须为字母',
    passwordRule: '密码必须由6-18位字母、数字、特殊符号三种组成',
    phoneNumberRule: '手机号码不满足要求',
    mailAddressRule: '邮箱地址不满足要求',
    userLock: '您已经连续输入错误密码五次，账户已被锁定，请在5分钟后重试',
    hasLogin: '已登录'
  },
  nav: {
    platform: 'Edge Gallery平台',
    usermgmt: '用户管理',
    logoutTip: '确认要离开吗？'
  },
  usermgmt: {
    userName: '用户名',
    role: '角色',
    accessPlatform: '可访问平台',
    status: '状态',
    telephone: '手机号码',
    mailAddress: '邮箱地址',
    registerTime: '注册时间',

    registerTimeRange: '注册时间范围',
    beginTime: '起始时间',
    endTime: '结束时间',

    setting: {
      dlgTitle: '用户设置',
      role: '所属角色：',
      platform: '可访问平台：'
    },

    operate: {
      disallow: '停用',
      allow: '启用',
      setting: '设置'
    },

    statusValue: {
      disallowed: '已停用',
      allowed: '已启用'
    },
    roleValue: {
      admin: '管理员',
      tenant: '租户',
      guest: '访客'
    },
    tip: {
      confirmDisallowUser: '确认要停用该用户吗？',
      disallowUserSuccess: '用户停用成功！',
      disallowUserFailed: '用户停用失败！',
      confirmAllowUser: '确认要启用该用户吗？',
      allowUserSuccess: '用户启用成功！',
      allowUserFailed: '用户启用失败！',
      platformMustBeSelected: '请选择可以访问的平台。',
      configUserFailed: '设置用户失败！'
    }
  },
  usercenter: {
    welcomePrefix: '您好，',
    basicInfo: '基本信息',
    accountName: '帐号名：',
    registerTime: '注册时间：',
    emailAddr: '邮箱地址：',
    mobilePhone: '手机号码：',
    modifyPwd: '修改密码',
    oldPw: '旧密码：',
    newPw: '新密码：',
    confirmNewPw: '确认新密码：',
    passNotChanged: '输入的新密码与旧密码一致',
    modifyPwdSucceed: '密码修改成功！',
    modifyPwdFailed: '密码修改失败！'
  },
  common: {
    cancel: '取消',
    submit: '提交',
    confirm: '确认',
    operation: '操作',
    reset: '重置',
    search: '搜索',
    query: '查询',
    all: '全部',
    warning: '提示',
    unknown: '未知',
    noconfig: '未设置'
  },
  verify: {
    usernameTip: '用户名不能为空',
    passwordTip: '密码不能为空',
    confirmpasswordTip: '确认密码不能为空',
    telephoneTip: '手机号码不能为空',
    mailAddressBlankTip: '邮箱地址不能为空',
    verifyCodeTip: '验证码不能为空',
    verifycodeRule: '请输入六位数字的验证码'
  },
  tip: {
    failedReg: '注册用户失败，请重试',
    failedReset: '重置密码失败，请重试',
    wrongCaptcha: '验证失败，请先完成验证！',
    failedAuth: '认证失败，请检查你用户名和密码！',
    regUserSuc: '您已成功注册用户！',
    sessionOut: '你的登录信息过期，请重新登录',
    sessionExp: 'Session过期',
    failedToGetCaptcha: '获取验证码失败！',
    nameAlSinged: '用户名已经被注册',
    telAlSigned: '手机号码已经被注册',
    mailAlSigned: '邮箱地址已经被注册',
    telNotExist: '手机号码不存在',
    mailNotExist: '邮箱地址不存在',
    getVerifyCodeSuc: '获取验证码成功！',
    resetPassSuc: '您的密码重置成功！',
    passDiferent: '两次密码输入不一致'
  },
  ...zhLocale
}

export default cn
