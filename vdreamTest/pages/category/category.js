// import request module
import {request} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';

// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // 左侧的菜单数组
      categorySummaryList: [],
      // 右侧的菜单数组
      categoryDetailList: [],
      // 被点击的左侧菜单数组
      currentCategoryIndex: 0,
      // reset scroll value so you click another category and the right area will reset to top
      resetScrollValue:0
  },
  gateReturn: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 1. request category data
      // 1.1 判断本地存储中有没有数据
      // 获取本地存储数据
      const categoryLoc=wx.getStorageSync('categoryLoc');
      // 1.2 如没有旧数据 直接发送新的请求
      if(!categoryLoc)
      {
        this.getCategory();
      }
      else{
        // 发现旧数据 查看有没有过期 
        // 第一次请求时间与第二次相差10s 数据过期 重新请求
        // console.log(Date.now());
        // console.log(Categorys.time);
        // console.log(Date.now() - Categorys.time);
        if(Date.now() - categoryLoc.time > 1000 * 3000)
        {
            // 旧数据过期重新请求数据
            this.getCategory();
        }
        else {
            console.log("可以用旧数据");
            this.gateReturn=categoryLoc.data;
            // config the categorySummary menu
            var categorySummaryList = this.gateReturn.map(item=>item.cat_name);
            // config the categoryDetail data
            // console.log(this.gateReturn[0]);
            var categoryDetailList = this.gateReturn[0].children;
     
            this.setData({
              categorySummaryList: categorySummaryList,
              categoryDetailList: categoryDetailList
            })

        }
      }
      // 1.3 有旧数据同时旧数据没过去 直接调用旧数据即可
     // this.getCategory();


  },
  // 获取分类数据
  async getCategory()
  {
    // request({url: 'http://localhost:3000/categoryData'})
    // .then(res =>{
    //     // getting data from server and assign it to GateReturn
    //     this.gateReturn = res.data;

    //     // 把返回数据存入到微信的本地存储中
    //     //  wx.setStorageSync("key", value"")
    //     wx.setStorageSync('categoryLoc', {time: Date.now(), data: this.gateReturn});

    //     // config the categorySummary menu
    //     var categorySummaryList = this.gateReturn.map(item=>item.cat_name);
    //     // config the categoryDetail data
    //     // console.log(this.gateReturn[0]);
    //     var categoryDetailList = this.gateReturn[0].children;
     
    //     this.setData({
    //       categorySummaryList: categorySummaryList,
    //       categoryDetailList: categoryDetailList
    //     })
    // })

        // 1. 使用es7的async和await发送异步请求
        // using localhost fake json server 
        //const res = await request({url: "http://localhost:3000/category"});
        //// getting data from server and assign it to GateReturn
        // this.gateReturn = res.data;

        // using github pages server
        const res = await request({url: "https://luke97030.github.io/category.json"});
        // getting data from server and assign it to GateReturn
        this.gateReturn = res.data.category;

        // 把返回数据存入到微信的本地存储中
        //  wx.setStorageSync("key", value"")
        wx.setStorageSync('categoryLoc', {time: Date.now(), data: this.gateReturn});

        // config the categorySummary menu
        var categorySummaryList = this.gateReturn.map(item=>item.cat_name);
        // config the categoryDetail data
        // console.log(this.gateReturn[0]);
        var categoryDetailList = this.gateReturn[0].children;
     
        this.setData({
          categorySummaryList: categorySummaryList,
          categoryDetailList: categoryDetailList
        })
    
  },
  handleCategorySummaryChange(e)
  {

      // 1. 获取被点击标题的索引e.currentTarget.dataset.index
      // 2. 给currentCategoryIndex赋值
      const index = e.currentTarget.dataset.index

      // get relative category items based on which category be chose 
      var categoryDetailList = this.gateReturn[index].children;

      this.setData({
        currentCategoryIndex: index,
        categoryDetailList: categoryDetailList,
        resetScrollValue: 0
      })
  }
})