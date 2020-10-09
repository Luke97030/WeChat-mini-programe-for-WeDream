
// pages/auth/auth.js

// import request module
import {request} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime'; 
import {login} from '../../utils/asyncWx.js'

// 3. 当点击支付按钮后先判断缓存中有没有token 
// 3.1 没有token跳转到授权页面 获取token
// 3.2 有token。/。。

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  async handleGetUserInfo(e){

    try{
      console.log(e);
      // 1. 获取用户信息
      const encrypedData = e.detail.encryptedData;
      const iv = e.detail.iv;
      const rawData = e.detail.rawData;
      const signature = e.detail.signature;
  
      // 2. 获取小程序登录成功后的ocde
      // 调用分装
      const {code} = await login();
      //console.log(code);
      const loginData = { encrypedData, iv, rawData, signature };
      // 3. 发送请求 获取用户的token
      const res = await request({url: "http://localhost:3000/login", data: loginData, method: "post" });
      // 需要时企业账号才能得到token
      //const token = res.token;
      // console.log(res.token); 
      // 4. 把token存储在缓存中 同时跳转回上一个页面
      //  wx.setStorageSync('key', data)
      wx.setStorageSync('token', token);
      // delta: 1 means back 1 page 
      //        2 means back 2 pages 
      wx.navigateBack({ delta: 1 });
    
    }catch(error)
    { 
        console.log(error);
    }
  }
})