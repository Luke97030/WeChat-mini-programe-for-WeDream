// import request module
import {request} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';

// 功能实现
// 1. 点击轮播图 预览大图。 通过1. 给轮播图绑定点击事件 2. 调用小程序的api的previewImage
// 2. 加入购物车功能实现
//    2.1 绑定点击事件
//    2.2 获取缓存中的购物车数据  数组类型
//    2.3 先判断当前的商品是否已经存在购物车中
//    2.4 如何已经存在商品数量++ 然后重新把购物车数组放回缓冲中
//    2.5 所加商品不在购物车中 给购物车数组添加一个新的元素 然后重新把购物车数组放回缓冲中
//    2.6 弹出提示

Page({

  /**
   * 页面的初始数据
   */
  data: {
     // declare a course Object
     courseObj: {},
     cat_id: "",
     // course date 
     date: "",
     // course start time 
     stime: "",
     // course end time
     etime: ""
  },
  // 定义global对象CourseInfo 储存preview Images
  CourseInfo: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //const cat_id = options;
      //console.log(cat_id); 

      // we need this back 
      const course_id =  options.cat_id;
      this.setData({
        date: options.date,
        stime: options.stime,
        etime: options.etime,
      
      })
      //const course_id =  options;
      this.getCourseDetail(course_id);
  },

  async getCourseDetail(course_id)
  {
      //console.log(course_id);
      const result=await request({url: 'http://localhost:3000/courseDetail?cat_id=' + course_id});
      //console.log(courseObj.data);
      // 给全局变量赋值
      this.CourseInfo = result.data[0];
      //console.log(courseObj.data[0].course_index);
      this.setData({
        courseObj: {
          course_id: this.CourseInfo.cat_id,
          course_name: this.CourseInfo.course_name, 
          course_price: this.CourseInfo.course_price, 
          pics: this.CourseInfo.pics,
          course_introduce: this.CourseInfo.course_introduce,
          date: this.data.date,
          stime: this.data.stime,
          etime: this.data.etime,

        }

        // 
        //courseObj: courseObj.data

      })
  },
  // Swiper item event handler. 点击轮播图放大预览
  handleSwiperItemTap(e)
  {
     //console.log(e);
      // 得到preview图片的url
      // const previewUrl=this.CourseInfo[0].pics.map(v=>v.pics_mid);
      const previewUrl=this.data.courseObj.pics.map(v=>v.pics_mid);
      // 得到点击图片的url
      const currentUrl = e.currentTarget.dataset.url;
      wx.previewImage({
        // current: '', // 当前显示图片的http链接
        // urls: [] // 需要预览的图片http链接列表
        current: currentUrl,
        urls: previewUrl,
      })
  },
  // event handler 点击加入购物车
  handleCartAdd()
  {
      let canAdd = true;
      // 1. 获取缓存中的购物车数组    
      //    ||[] 转换成数组格式确定cart变量是数组模式
      let cart = wx.getStorageSync('cart') || [];
      // 2， 判断商品对象是否已存在
      let index = cart.findIndex(v=> v.cat_id===this.CourseInfo.cat_id)
      // 课程不存在与购物车中
      if(index===-1)
      { 
          for(let i = 0; i < cart.length; ++i)
          {

              if(this.data.courseObj.date === cart[i].date && this.data.courseObj.stime === cart[i].stime && this.data.courseObj.etime === cart[i].etime)
              {
                  wx.showToast({
                    title: '您已经预约过了此时间段， 请返回重新选择时间段',
                    icon: 'none',
                    // Mask为true用户点击加入购物车后要等1.5s以后才能继续添加
                    mask: true,
            
                  })
                  canAdd = false;
                  return;
              }
              else {
                continue;
              }
          }
          this.CourseInfo.date = this.data.courseObj.date;
          this.CourseInfo.stime = this.data.courseObj.stime;
          this.CourseInfo.etime = this.data.courseObj.etime;
          let minutes =  this.diff(this.CourseInfo.stime,  this.CourseInfo.etime);
          // calculate the num of the course by minutes/30, e.g: 60/30=2 means 2 courses so the price will be 2 * 20 = 40
          this.CourseInfo.num = minutes/30;
          this.CourseInfo.checked = true;
          cart.push(this.CourseInfo);
          //console.log(cart);
          // 显示已添加至购物车提示信息
          wx.showToast({
            title: '加入购物车',
            icon: 'success',
            // Mask为true用户点击加入购物车后要等1.5s以后才能继续添加
            mask: true,

          })
      }
      // 课程存在于购物车中 但是因为一个老师的可用时间段可以有很多(10:30-11:30 12:00-13:00) in a same day 或者时间段很长(09:30-15:30)
      else{

          for(let i = 0; i < cart.length; ++i)
          {

              if(this.data.courseObj.date === cart[i].date && this.data.courseObj.stime === cart[i].stime && this.data.courseObj.etime === cart[i].etime)
              {
                  wx.showToast({
                    title: '您已经预约过了此时间段， 请返回重新选择时间段',
                    icon: 'none',
                    // Mask为true用户点击加入购物车后要等1.5s以后才能继续添加
                    mask: true,
            
                  })
                  canAdd = false;
                  break;
              }
              else {
                continue;
              }
          }

          if (canAdd === true)
          {     
                this.CourseInfo.date = this.data.courseObj.date;
                this.CourseInfo.stime = this.data.courseObj.stime;
                this.CourseInfo.etime = this.data.courseObj.etime;
                let minutes =  this.diff(this.CourseInfo.stime,  this.CourseInfo.etime);
                // if the course_id are same, means we choose same teacher twice but at different time, so the this.CourseInfo.num will be added to the previous this.CourseInfo.num 
                // calculate the num of the course by minutes/30, e.g: 60/30=2 means 2 courses so the price will be 2 * 20 = 40
                // do not need to add to a cart becasue they are same course, just need to update the num of that course  
                this.CourseInfo.num = minutes/30;
                this.CourseInfo.checked = true;
                cart.push(this.CourseInfo);
                // 显示已添加至购物车提示信息
                wx.showToast({
                  title: '加入购物车',
                  icon: 'success',
                  // Mask为true用户点击加入购物车后要等1.5s以后才能继续添加
                  mask: true,

              })
          }

                    
          // if (this.data.courseObj.course_id === cart[index].cat_id && this.data.courseObj.date === cart[index].date && this.data.courseObj.stime === cart[index].stime && this.data.courseObj.etime === cart[index].etime)
          // {
          //       wx.showToast({
          //         title: '您已经预约过了此时间段， 请返回重新选择时间段',
          //         icon: 'none',
          //         // Mask为true用户点击加入购物车后要等1.5s以后才能继续添加
          //         mask: true,
          
          //       })
          // } 
          // // another situation when the course_id are same but the time for these two courses are different  
          // else if (this.data.courseObj.course_id == cart[index].cat_id && (this.data.courseObj.date == cart[index].date && this.data.courseObj.stime != cart[index].stime && this.data.courseObj.etime != cart[index].etime) || (this.data.courseObj.date != cart[index].date))
          // {
          //         this.CourseInfo.date = this.data.courseObj.date;
          //         this.CourseInfo.stime = this.data.courseObj.stime;
          //         this.CourseInfo.etime = this.data.courseObj.etime;
          //         let minutes =  this.diff(this.CourseInfo.stime,  this.CourseInfo.etime);
          //         // if the course_id are same, means we choose same teacher twich but at different time, so the this.CourseInfo.num will be added to the previous this.CourseInfo.num 
          //         // calculate the num of the course by minutes/30, e.g: 60/30=2 means 2 courses so the price will be 2 * 20 = 40
          //         // do not need to add to a cart becasue they are same course, just need to update the num of that course  
          //         this.CourseInfo.num = minutes/30;
          //         this.CourseInfo.checked = true;
          //         cart.push(this.CourseInfo);
          //         // 显示已添加至购物车提示信息
          //       wx.showToast({
          //           title: '加入购物车',
          //           icon: 'success',
          //           // Mask为true用户点击加入购物车后要等1.5s以后才能继续添加
          //           mask: true,

          //       })
          // }
          // // else if (this.data.courseObj.course_id != cart[index].cat_id && this.data.courseObj.stime === cart[index].stime && this.data.courseObj.etime === cart[index].etime)
          // else if (this.data.courseObj.course_id != cart[index].cat_id && (this.data.courseObj.date == cart[index].date && this.data.courseObj.stime != cart[index].stime && this.data.courseObj.etime != cart[index].etime) || (this.data.courseObj.date != cart[index].date))
          // {
          //     this.CourseInfo.date = this.data.courseObj.date;
          //     this.CourseInfo.stime = this.data.courseObj.stime;
          //     this.CourseInfo.etime = this.data.courseObj.etime;
          //     let minutes =  this.diff(this.CourseInfo.stime,  this.CourseInfo.etime);
          //     // calculate the num of the course by minutes/30, e.g: 60/30=2 means 2 courses so the price will be 2 * 20 = 40
          //     this.CourseInfo.num=minutes/30;
          //     this.CourseInfo.checked=true;
          //     cart.push(this.CourseInfo);
          //     // 显示已添加至购物车提示信息
          //    wx.showToast({
          //       title: '加入购物车',
          //       icon: 'success',
          //       // Mask为true用户点击加入购物车后要等1.5s以后才能继续添加
          //       mask: true,

          //    })
          // }  
          // else
          // {
          //     wx.showToast({
          //       title: '您已经预约过了此时间段， 请返回重新选择时间段',
          //       icon: 'none',
          //       // Mask为true用户点击加入购物车后要等1.5s以后才能继续添加
          //       mask: true,
        
          //     })
          // }
        
      }
      // 重新添加购物车会缓存中
      wx.setStorageSync('cart', cart);

  },
  diff : function(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    
    //return (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
    return hours * 60 + minutes;
  },
  // 点击支付
  handleAuthCheck(){
    // 1. 判断缓存中又没有token
    const token = wx.getStorageSync('token');
    // 2 判断   如果没有token到auth界面请求token
    if(!token)
    {
        wx.navigateTo({
          url: '../auth/auth',
        });
    }
    //console.log("已经存在token");
  }
})