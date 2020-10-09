// import request module
import {request} from '../../request/index.js';

//Page Object
Page({
  data: {
    // swiper list
    swiperList: [],
    // category list 
    categoryList: [],
    // body list 
    bodyList: []
    
  },

  onLoad: function(options) {
    // request swiper image data
    // wx.request({
    //   url: 'http://localhost:3000/swiperImages', //仅为示例，并非真实的接口地址
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: (res) => {
    //     //console.log(res)
    //     this.setData({
    //       swiperList: res.data
    //     })
    //   }
    // })

    // // send a request to http://localhost:3000/swiperImages
    // // .then getting result back and store into result object
    // request({url: 'http://localhost:3000/indexswiperimage'})
    // .then
    // (
    //   result=>{
    //      this.setData({
    //         swiperList: result.data
    //      })
    //  })


     // 1st layer: the swiper for the new request send later just need to adding more .then after
     this.getSwiperList();
    //  // 2nd layer: the navigator aread
    //  this.getCategoryList();
     // 3rd layer: content layer
     this.getBodyList();
  },
  // create a function to get index swiper images and calling it in onLoad function
  getSwiperList() {
    request({url: 'http://localhost:3000/indexswiperimage'})
    .then
    (

      result=>{
         // console.log(result.data),
         this.setData({
            swiperList: result.data
         })
     })
  },
  // getCategoryList() {
  //   request({url: 'http://localhost:3000/indexnavigator'})
  //   .then
  //   (
  //     result=>{
  //        this.setData({
  //         categoryList: result.data
  //        })
  //    })

  // },
  getBodyList() {

    request({url: 'http://localhost:3000/indexbody'})
    .then
    (
      result=>{
         this.setData({
          bodyList: result.data
         })
     })

  }

});
  