// import request module
import {request} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';

// 实现功能
// 1。 上滑触底加载下一页
// 2。 下滑刷新， 在页面的json 文件中开启一个配置项 找打触发下拉刷新事件在里面添加逻辑

Page({

  /**
   * 页面的初始数据
   */
  data: {
      tabs: [
        {
           id: 0,
           value: "综合",
           isActive: true
        },
        {
           id: 1,
           value: "销量",
           isActive: false
        },
        {
           id: 2,
           value: "价格",
           isActive: false
        },
      ],
      courseList: [],
      date: "",
      stime: "",
      etime: ""
  },
  // 从client传到server接口的参数
  // 参数名      必填    类型          说明
  // query       否     string        关键字
  // cid         否     string        分类id
  // pagenum     否     number        页码
  // pagesize    否     number        页容量
  // create an class wich attributes
  SendToServer: { 
    query: "",
    cid: "",     
    pagenum: 1,       // 从server请求一个   
    pagesize: 5      // 限定server返回的页容积。 每页4个商品 

  }, 
  // 全局参数总页数
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options == {cid: "5"}
    let grade = JSON.parse(options.grade);
    let level = JSON.parse(options.level);
    this.setData({
      date: options.date,
      stime: options.stime,
      etime: options.etime
    })
    // let stime = options.stime;
    // let etime = options.etime;
    this.SendToServer.cid = options.cid;
    this.getCourseList(grade, level, this.data.date, this.data.stime, this.data.etime);
  },

  //获取商品列表数据 using es7
  async getCourseList(grade, level, date, stime, etime)
  {
    // 1. 使用es7的async和await发送异步请求
    //                          链接                                    传递给server的参数
    // console.log(grade);
    // console.log(level);

    // localhost fake json server
    // const res = await request({url: "http://localhost:3000/courseList", data: this.SendToServer});
    //var tempCoursesArr = res.data[0].courses;


    // github pages
    const res = await request({url: "https://luke97030.github.io/courseList.json", data: this.SendToServer});
    var tempCoursesArr = res.data.courseList[0].courses;

    var filtedCoursesArr = []
    tempCoursesArr.forEach((v,i) => {
        if(v.course_grade===grade&&v.course_level===level)
        {
          // compare the available date with user entered date 
          for(var i = 0; i < v.available_date.length; i++) 
          {  
                var availableDate = v.available_date[i];
                var availableTime = v.available_time[i];
                // if the subitable date has been found
                if(availableDate===date)
                {
                    // it means there are multiply available time in a same day
                    if (availableTime.includes(' '))
                    {
                      // array to store multiply time gaps
                      let tempArr = availableTime.toString().split(' ');
                      for(var index = 0; index < tempArr.length; index++)
                      {
                             // check the time, reformat the time first 
                             var finalStartTime = tempArr[index].slice(0,5);
                             var finalEndTime = tempArr[index].slice(6,11);
                             if (stime >= finalStartTime && etime <= finalEndTime)
                             {
                                  filtedCoursesArr.push(v);
                             }
                      }
                    }
                    else
                    {
                            // check the time, reformat the time first 
                            var finalStartTime = availableTime.slice(0,5);
                            var finalEndTime = availableTime.slice(6,11);

                            // if the start time is same as the start time in courseList and the finish time is smaller than the end time in courseList 
                            // the teacher is available, show his/her info to the user 
                            if (stime >= finalStartTime && etime <= finalEndTime)
                            {
                              filtedCoursesArr.push(v);
                            }
                    }    
                }
          }
        }
    })

    //console.log(res);
    // 获取总条数 为了计算总共有多少页
    const total = res.data.total; 
    // 计算总页数
    this.totalPages = Math.ceil(total/this.SendToServer.pagesize);
    //console.log(filtedCoursesArr);
    this.setData({
      // 拼接的数据
      // 旧的数据 + 新的数组
      //courseList: [...this.data.courseList, ...res.data.courses]
      courseList: filtedCoursesArr
    })

     // 通过下拉刷新请求数据 请求回来后手动关闭下拉刷新效果
    wx.stopPullDownRefresh();
    
  },
  // 从子组件传递过来的点击事件
  handleTabsItemChange(e)
  {
      // 1. 获取被点击的标题的索引
      const index = e.detail;
      // 2. 修改源数字的备份数据
      var temp = this.data.tabs;

      temp.forEach((v,i) => {
        i===index ? v.isActive=true : v.isActive=false 
      })

      // 3. 复制到本地data Array中
      this.setData({
        tabs: temp
      })
  },
  // 生命周期事件 滚动条触底事件
  onReachBottom(){
      //console.log("页面触底");
      // 1。 当触底判断有没有下一页数据
      if(this.SendToServer.pagenum >= this.totalPages)
      {
        //console.log("没有下一页数据了");
        wx.showToast({
          title: '没有下一页了',
          // icon: 'none',
          image: '../../images/warning.png',
          duration: 1500, 
        });
          
        
      }
      else{
        // console.log("有下一页数据");
        // 如有下一页数据 当前页码值++ 重新发送请求 数据请求回来对data中的数据进行拼接
        this.SendToServer.pagenum++;
        this.getCourseList();
      }
  }, 
  onPullDownRefresh() {

        // 当事件触发重置页码 重置数组 重新发送请求
        //  console.log("刷新");

        // 1. 重置数组
        this.setData({
          courseList: []
        })

        // 2. 重置数组
        this.SendToServer.pagenum = 1;

        // 3. 重新发送请求
        this.getCourseList();

       
  }
})