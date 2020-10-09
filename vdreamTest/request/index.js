
// 变量当有多个请求同时发送至server, 必须等全部的请求的到response才能关闭加载图标
let aJaxTime = 0; 

export const request=(params)=>{

  // 接收到一个请求aJaxTime + 1
  aJaxTime++;
  // 当从server上请求数据显示加载中图标
  wx.showLoading({
    title: '加载中',
    mask: true
  });


  return new Promise((resolve, reject)=>{
    wx.request({
        ...params,
        success: (result)=>{
          resolve(result);
        },
        fail: (err)=>{
          reject(err);
        },
        complete: ()=>{
          aJaxTime--;
          if(aJaxTime === 0)
          {
              // 关闭加载图标
              wx.hideLoading();
          }
 
        }
    })
  })
}