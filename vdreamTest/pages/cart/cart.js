// pages/cart/cart.js
/*
    onShow事件
    1. 获取缓存中的购物车数组
    2. 把购物车数据 填充到data中

    全选按钮的功能实现
    1. 根据购物车中的商品数据 所有的商品cheked=true(所有的商品都没选中) 全选checked=true 
       如果一个或多个商品没有被选中全选全选checked=false
       
       
    点击预约按钮实现功能 
    1。 判断用户有没有选购商品
    2。 如没选购商品 显示错误提示。 如有商品跳转到支付页面
*/

import { showToast, showModal } from "../../utils/asyncWx.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
     cart: [],
     allChecked: false,
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
        // 重新计算价格 数量 是否全选 数据
        this.setCart(tempcart);
  },
  handleItemSelectChange(e) {
    const id = e.currentTarget.dataset.id;
    const starttime = e.currentTarget.dataset.stime;
    const endtime = e.currentTarget.dataset.etime;
    let cart = this.data.cart; 

    let index = cart.findIndex(v => v.cat_id === id && starttime === v.stime && endtime === v.etime);
    // if the checkbox for each item be clicked, change the checked to opposite boolean value 
    cart[index].checked = !cart[index].checked;
    // 重新设置数据
    this.setData({ cart });
    // 重新计算价格 数量 是否全选 数据
    this.setCart(cart);
  },
  handleSelectAllChange() {
    let { cart, allChecked } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },
  async handleCourseDelete(e)
  {
      const id = e.currentTarget.dataset.id;
      const starttime = e.currentTarget.dataset.stime;
      const endtime = e.currentTarget.dataset.etime;
      let cart = this.data.cart; 
  
      let index = cart.findIndex(v => v.cat_id === id && starttime === v.stime && endtime === v.etime);
  
      // 弹窗提示
      // 当商品数量为1时再减少则提示是否删除
      const result = await showModal({content: '您是否要从购物车中移除此课程?'});
      if(result.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
      else {
        console.log('用户点击取消')
      }
  },
  // setCart function 
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    // 价格 数量 是否全选
    try{
      cart.forEach(v => {
        if(v.checked) {
          totalPrice += v.course_price * v.num;
          totalNum += v.num;
        }else{
          allChecked = false;
        }
      });
      // 判断数组是否为空
      allChecked = (cart.length !== 0 ? allChecked : false);
      this.setData({
        cart: cart,
        allChecked: allChecked,
        totalPrice: totalPrice,
        totalNum: totalNum
        //totalNum: cart.length
      })
      wx.setStorageSync('cart', cart);
    }
    catch(err)
    {
        console.log(err.message);
    }
    
  },
  // 点击预约时间
  async handlePay()
  {
      // 购物车为空 显示提示信息
      if (this.data.totalNum === 0)
      {
          await showToast({title: "您还没有选购课程"});
          return;
      }
      
      //  如果购物车不为空跳转到支付页面
      wx.navigateTo({
        url: '../payment/payment',
      })
  },
  handleSwiperItemTap(e)
  {
   //console.log(e);
    // 得到preview图片的url
    // const previewUrl=this.CourseInfo[0].pics.map(v=>v.pics_mid);
    console.log(this.data)

    const previewUrl=this.data.cart.map(v=>v.course_big_logo);
    // 得到点击图片的utl
    const currentUrl = e.currentTarget.dataset.url;
    var arr = []
    for (var i in previewUrl)
    {
       if (previewUrl[i] == currentUrl)
       {
          arr.push(currentUrl);
          break;
       }
    }
    wx.previewImage({
      // current: '', // 当前显示图片的http链接
      // urls: [] // 需要预览的图片http链接列表
      current: currentUrl,
      urls: arr,
    })
  }
})
