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
    confirmPass: '密码确认',
    contact: '联系方式',
    company: '工作单位',
    gender: '性别',
    male: '男',
    female: '女',
    namePla: '用户名/手机号',
    pwdPla: '密码',
    pwdConfPla: '密码确认',
    compPla: '公司任职信息',
    telPla: '电话号码',
    getCap: '获取验证码',
    capPla: '验证码',
    newPwd: '新密码',
    confirmNewPwd: '确认新密码',
    forgotPwd: '忘记密码？',
    modifyPwd: '修改密码',
    loginWithUser: '账户登录',
    welcome: '欢迎注册EdgeGallery',
    freeSign: '免费注册',
    getPwd: '找回密码',
    verify: '拖动完成验证',
    finishVerify: '验证成功',
    changeOne: '换一张',
    loginFail: '登陆失败，请检查用户名和密码，连续输入错误密码五次以上，账户将会被锁定',
    usernameRule: '6-30位字母,数字,下划线任意两种组合，首位必须为字母',
    passwordRule: '密码必须由6-18位字母、数字、特殊符号三种组成',
    phoneNumberRule: '电话号码不满足要求',
    userLock: '您已经连续输入错误密码五次，账户已被锁定，请在5分钟后重试'
  },
  common: {
    cancel: '取消',
    submit: '提交',
    confirm: '确认'
  },
  verify: {
    usernameTip: '用户名不能为空',
    passwordTip: '密码不能为空',
    telephoneTip: '电话号码不能为空',
    verifyCodeTip: '验证码不能为空',
    verifycodeRule: '请输入六位数字的验证码'
  },
  tip: {
    failedReg: '注册用户失败，请重试',
    failedReset: '重置密码失败，请重试',
    wrongCaptcha: '验证失败，请先完成验证！',
    failedAuth: '认证失败，请检查你用户名和密码！',
    regUserSuc: '你已成功注册该用户！',
    sessionOut: '你的登录信息过期，请重新登录',
    sessionExp: 'Session过期',
    failedToGetCaptcha: '获取手机验证码失败',
    nameAlSinged: '用户名已被注册，请重新输入或前往登陆',
    telAlSigned: '电话号码已被注册，请重新输入或前往登陆',
    getVerifyCodeSuc: '获取验证码成功！',
    passDiferent: '两次密码输入不一致'
  },
  ...zhLocale
}

export default cn
