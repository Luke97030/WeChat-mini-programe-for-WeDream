// pages/appointment/appointment.js
// import request module
import {request} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
import {login} from '../../utils/asyncWx.js'

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime:[
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
      "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
      "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
      "21:00", "21:30", "22:00"
    ],
    endTime: ["请先选择起始时间"],
    selstartTime:"请选择",
    selendTime:"请选择",
    date : [],
    activedateid : 0,
    modalContent: "",
    modalHidden: true,

    // Obj to save user's  info 
    userInfo: {
        studentName: "",
        phoneNum: 0,
        grade: "",
        level: "",
    },
    // user selectedDate
    selectedDate: "",
    // bool variable to show if the teacher is available for teaching or not 
    is_available: true   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const teacherId = options.id;
    const that = this;
    wx.request({

      url: 'http://localhost:3000/appointment',
      data: {
        id: teacherId
      },
      success: function (res) {
        // console.log("This is appointment info");
        // console.log(res);
        const teacher = res.data;
        that.setData({
          teacher: teacher
        })
      }
    });

    var date = [];
    for(var i = 0;i<7;i++){
      var onedate = {};
      onedate.id = i;
      onedate.datestr = that.fun_date(i);
      date.push(onedate);
    }
    var datetime = new Date();
    const hours = datetime.getHours();
    const minutes = datetime.getMinutes();
    const curtime = (hours < 10 ? ('0' + hours) : hours) + ":" + (minutes < 10 ? ('0' + minutes) : minutes);
    var startTime = that.data.startTime;
    startTime = this.getTimeArray(startTime, curtime);
    that.setData({
      date:date,
      startTime: startTime
    })
  },
  bindPickerstartTimeChange: function (event) {
    var selIterm = this.data.startTime[event.detail.value];
    if (selIterm === "今天无有效时间") {
      return;
    }
    var endTime = this.data.startTime;
    endTime = this.getTimeArray(endTime, selIterm);
    this.setData({
      selstartTime: selIterm,
      endTime: endTime
    })
    // this.initCityData(2, selIterm)
  },
  bindPickerendTimeChange: function (event) {
    var selIterm = this.data.endTime[event.detail.value];
    if (selIterm === "请先选择起始时间" || selIterm === "今天无有效时间"){
      return;
    }
    this.setData({
      selendTime: selIterm,
    })
  },
  tabClick: function (e) {
    var d = new Date();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    const curtime = (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
    var startTime = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
      "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
      "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
      "21:00", "21:30", "22:00"
    ];
    if (this.data.date[e.currentTarget.id].datestr.indexOf(curtime) >= 0){
      var datetime = new Date();
      const hours = datetime.getHours();
      const minutes = datetime.getMinutes();
      const curtime = (hours < 10 ? ('0' + hours) : hours) + ":" + (minutes < 10 ? ('0' + minutes) : minutes);
      startTime = this.getTimeArray(startTime, curtime);
    }
    this.setData({
      selstartTime: "请选择",
      selendTime: "请选择",
      startTime: startTime,
      endTime: ["请先选择起始时间"],
      activedateid: e.currentTarget.id
    });
  },
  fun_date: function(a){
    var date1 = new Date();
    var date2 = new Date(date1);
    date2.setDate(date1.getDate()+a);
    var mon = date2.getMonth() + 1;
    var day = date2.getDate();
    var time = (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
    if(a === 0){
      time += '(今)';
    }
    else if (a === 1) {
      time += '(明)';
    }
    return time;
  },
  getTimeArray:function(arr,obj){
    var index = -1;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] > obj) {
        index = i;
        break;
      }
    }
    if (index != -1) {
      arr = arr.slice(index);
    }
    else {
      arr = ["今天无有效时间",];
    }
    return arr;
  },
  async appointtap(){
    if (this.data.selendTime === "请选择" || this.data.selstartTime === "请选择"){
      wx.showToast({
        title: '请先选择时间',
        image: '../../images/warning.png'
      });
      return;
    }
    const curselDay = this.data.date[this.data.activedateid].datestr;
    // this.setData({
    //   modalContent: '请确认您预定的老师信息\r\n教练: ' + this.data.teacher[this.data.activedateid].teacher_name + '\r\n预约日期: ' + curselDay +'\r\n预约时间: ' + this.data.selstartTime + '--' + this.data.selendTime + '\r\n请检查无误后点击确认',
    //   modalHidden: false
    // });
      // remore (今) and (明) from selectedDate
      var slicedDate = "";
      if(curselDay.includes("(今)") || curselDay.includes("(明)"))
      {
          //curselDay.replace("(今)", " ");
          slicedDate = curselDay.slice(0,5);
      }
      
      // set Data to the global variable 
      this.setData({
        selectedDate: slicedDate
      })
      var startTime = this.data.selstartTime.replace(":", "");
      var endtTime = this.data.selendTime.replace(":", "");
      // console.log(slicedDate);
      // console.log(startTime);
      // console.log(endtTime);

      // collecting the info you want to POST into appointment json     
                
      const studentName = this.data.userInfo.studentName;
      const phoneNum = this.data.userInfo.phoneNum;
      const grade = this.data.userInfo.grade;
      const level = this.data.userInfo.level;
      const postData = { studentName, phoneNum, grade, level, slicedDate, startTime, endtTime };

      const res = await request({url: "http://localhost:3000/appointment", data: postData, method: "post" });


      //// findingTeacher: find the teacher based on grade, level, date and start, end time 
      //this.findingTeacher(this.data.userInfo, this.data.selectedDate, this.data.selstartTime, this.data.selendTime);

      // navigator to courseList based on the grade and level user entered 
      wx.navigateTo({
        url: '../course_list/course_list?grade=' + JSON.stringify(this.data.userInfo.grade) + '&level='+ JSON.stringify(this.data.userInfo.level) + '&date='+ this.data.selectedDate + '&stime='+ this.data.selstartTime + '&etime='+ this.data.selendTime
      })
  },
  //  //升级预约列表数据 using es7
  //  async findingTeacher(e, selectedDate, selstartTime, selendTime)
  // {
  //       //console.log(e.grade);
  //       wx.request({
  //         // url: 'http://localhost:3000/appointment?grade=e.grade&level=e.level',
  //         url: 'http://localhost:3000/courseList',
  //         method:'GET',
  //         dataType:'STRING',
  //         data: this.data.userInfo,
  //         header: {'content-type': 'application/json'},
  //         success: res => {
              
  //             //console.log('this is get request result');
  //             var tempjson = JSON.parse(res.data);
  //             var cat_id = 0
  //             var availableDate = [];
  //             var availableTime = [];
  //             // console.log('*****************************************');
  //             // console.log(tempjson);   
  //             for(var i = 0; i < tempjson[0].courses.length; i++) 
  //             {
  //                 if(tempjson[0].courses[i].course_grade === e.grade)
  //                 {
  //                    availableDate = tempjson[0].courses[i].available_date;
  //                    availableTime = tempjson[0].courses[i].available_time;
  //                    cat_id = tempjson[0].courses[i].cat_id;
  //                    // filter by grade finished, lets check the date first and then time 
  //                    for(var ii = 0; ii < availableDate.length; ii++) 
  //                    {
  //                           // suitable date found
  //                           if (selectedDate===availableDate[ii])
  //                           {
  //                               // there are multiply availabe time gap in a same day 
  //                               for(var iii = 0; iii < availableTime.length; iii++)
  //                               {
  //                                        // if there is just one time gap abailable in the date 
  //                                       if (availableTime[iii].includes(' '))
  //                                       {
  //                                               // array to store multiply time gaps
  //                                               let tempArr = availableTime[iii].toString().split(' ');
  //                                               for(var index = 0; index < tempArr.length; index++)
  //                                               {
  //                                                      // check the time, reformat the time first 
  //                                                      var finalStartTime = tempArr[index].slice(0,5);
  //                                                      var finalEndTime = tempArr[index].slice(6,11);

  //                                                      if (selstartTime >= finalStartTime && selendTime <= finalEndTime)
  //                                                      {
  //                                                            this.setData({
  //                                                                is_available: true
  //                                                            })
  //                                                            break;
  //                                                      }
  //                                                      else{
  //                                                            this.setData({
  //                                                              is_available: false
  //                                                          })
  //                                                      }
  //                                               }
  //                                       }
  //                                       else
  //                                       {
  //                                                 // check the time, reformat the time first 
  //                                                 var finalStartTime = availableTime[ii].slice(0,5);
  //                                                 var finalEndTime = availableTime[ii].slice(6,11);

  //                                                 // if the start time is same as the start time in courseList and the finish time is smaller than the end time in courseList 
  //                                                 // the teacher is available, show his/her info to the user 
  //                                                 if (selstartTime >= finalStartTime && selendTime <= finalEndTime)
  //                                                 {
  //                                                       this.setData({
  //                                                           is_available: true
  //                                                       })
  //                                                 }
  //                                                 else{
  //                                                       this.setData({
  //                                                         is_available: false
  //                                                     })
  //                                                 }
  //                                       }
    
  //                               } 
  //                               // const res = request({url: "http://localhost:3000/courseList?cat_id=111", data: this.data.is_available, method: "put" });
  //                               // console.log(res);                                         
  //                           }
  //                   }
  //                 }  
  //             }

  //         },
  //         fail: function(res)
  //         {
  //           //console.log("Error is: " + res);
  //         }
  //     })
  
  // },
  modalHide: function () {
    this.setData({
      modalContent: '',
      modalHidden: true
    });
    wx.showModal({
      title: '提示',
      content: '预约成功! 您的腾讯会议ID为: ' + this.data.teacher[this.data.activedateid].conference_id + ' 请按时登录参加课程',
    })
  },
  modalHideCancle: function () {
    this.setData({
      modalContent: '',
      modalHidden: true
    });
  },
  // 读取孩子姓名
  bindKeyInputName: function (e) {
    this.data.userInfo.studentName = e.detail.value;
  },
  // 读取家长手机号
  bindKeyInputPhone: function (e) {
      this.data.userInfo.phoneNum = e.detail.value;
  },
  handleGradeChange(e)
  {

    if(e.detail.value == "1")
    {
      this.data.userInfo.grade = '一年级';
    }
    else if(e.detail.value == "2")
    {
      this.data.userInfo.grade = '二年级';
    }
    else if(e.detail.value == "3")
    {
      this.data.userInfo.grade = '三年级';
    }
    else if(e.detail.value == "4")
    {
      this.data.userInfo.grade = '四年级';
    }
    else if(e.detail.value == "5")
    {
      this.data.userInfo.grade = '五年级';
    }
    else if(e.detail.value == "6")
    {
      this.data.userInfo.grade = '六年级';
    }
  },
  // level radip button event handler
  handleLevelChange(e)
  {
    this.data.userInfo.level = e.detail.value;
    //console.log(this.data.userInfo);
  }
})
