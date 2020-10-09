import { showToast, showModal } from "../../utils/asyncWx.js"

/*
      1. 当页面加载的时候， 从缓存中获取购物车数据 渲染到页面中   
         这些数据的checked必须为true
*/

Page({

  /**
   * 页面的初始数据
   */
  data: {
     cart: [],
     totalNum: 0,
     totalPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
        // 获取缓存中的购物车数据
        const tempcart = wx.getStorageSync('cart') || [];
        // 只显示checked的课程
        let checkedCart = tempcart.filter(v => v.checked);


        // 逻辑
        let totalPrice = 0;
        let totalNum = 0;
        // 价格 数量 
        checkedCart.forEach(v => {
              totalPrice += v.course_price * v.num;
              totalNum += v.num;
          });

        this.setData({
            cart: checkedCart,
            totalPrice: totalPrice,
            totalNum: totalNum
            //totalNum: cart.length
          })
  }
})