import {config} from "../config/config"

const tips = {
  1 : "发生未知错误", 
  10005 : "未输入用户名和密码",
  10006 : "用户未登录",
  10007 : "token不能为空"
}


class Http{
  request({url, method = "GET", data = {}, name = "api1" , header = {}}){
    return new Promise((resolve,reject)=>{
      this._request({url, resolve, reject, method, data, header, name})
    })
  }

  _request({url,resolve, reject,method = "GET", data = {},header ={}, name = "api1"}){

    wx.showLoading()

    wx.request({
      url: config[name].baseURL + url,
      method,
      data,
      header,
      success : (response)=>{

        const code = response.statusCode.toString()

        if(code.startsWith("2")){
          wx.hideLoading()
          resolve(response.data)
          return
        }

        reject()
        wx.hideLoading()
        const error_code = response.data.error_code
        this._show_error(error_code)
      },
      fail(error){
        wx.hideLoading()
        reject(error)
        this._show_error(1)
      }
    })
  }

  _show_error(error_code){
    if(!error_code){
      error_code = 1
    }

    const tip = tips[error_code]
    
    wx.showToast({
      title: tip ? tip : tips[1],
      icon : "none",
      duration : 2000
    })
  }
}


export default Http