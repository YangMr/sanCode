# 扫码购小程序

[toc]

## 一、创建项目并进行版本控制

1. 创建本地仓库
2. 创建远程仓库
3. 在本地仓库创建项目
4. 将创建的项目添加到暂存区
5. 将暂存区的项目添加到本地仓库
6. 将本地仓库和远程仓库建立连接
7. 将本地仓库的代码推送远程仓库

## 二、创建项目目录结构

| 目录       | 描述                                        |
| ---------- | ------------------------------------------- |
| assets     | 存放静态资源.比如: 图片、样式文件、字体文件 |
| config     | 存在配置文件                                |
| model      | 存放模型文件, 比如 api封装                  |
| pages      | 存放页面                                    |
| components | 存放组件                                    |
| utils      | 存放工具类方法文件                          |
| app.js     | 小程序全局入口文件                          |
| app.json   | 小程序全局配置文件                          |



## 三、封装http请求以及封装API

1. 创建config.js文件, 配置请求的公共接口地址

   ```javascript
   const config = {
     baseURL : 'https://admin.hxwendeng.com/api/app'
   }
   export {config}
   ```

2. 在utils文件夹内创建request.js文件,封装wx.requestfang方法

   ```javascript
   import {config} from "../config/config"
   
   const tips = {
     1 : "发生未知错误", 
     10005 : "未输入用户名和密码",
     10006 : "用户未登录",
     10007 : "token不能为空"
   }
   
   
   class Http{
     request({url, method = "GET", data = {}}){
       return new Promise((resolve,reject)=>{
         this._request({url, resolve, reject, method, data})
       })
     }
   
     _request({url,resolve, reject, method = "GET", data = {}}){
       wx.request({
         url: config.baseURL + url,
         method,
         data,
         success : (response)=>{
   
           const code = response.statusCode.toString()
   
           if(code.startsWith("2")){
             resolve(response.data)
           }
   
           reject()
         
           const error_code = response.data.error_code
           this._show_error(error_code)
         },
         fail(error){
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
   ```

3. 在model文件夹内创建index.js文件,封装api接口

   ```javascript
   import Http from "../utils/request"
   
   class IndexModel extends Http{
     getNav(){
       return this.request({url : "/nav", method : "GET"})
     }
     
     getBanner(){
       return this.request({url : "/banner", method : "GET"})
     }
   
     getCourse(){
       return this.request({url : "/recommend/appIndex", method : "GET"})
     }
   }
   
   
   
   export default IndexModel
   ```

4. 在页面调用api接口, 以下为调用示例

   ```javascript
   // index.js
   import IndexModel from "../../model/index"
   const indexModel = new IndexModel()
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
       this.handleGetNav()
       this.handleGetBanner()
       this.handleGetCourse()
     },
   
   
     async handleGetNav(){
       const res = await indexModel.getNav()
       console.log(res)
     },
   
     async handleGetBanner(){
       const res = await indexModel.getBanner()
       console.log(res)
     },
   
     async handleGetCourse(){
       const res = await indexModel.getCourse()
       console.log(res)
     }
   })
   
   ```

## 四、封装一些公共方法



## 五、创建TabBar以及TabBar对应的页面



## 六、扫码购物页面开发

### 6.1 实现页面布局

### 6.2 点击扫码调用扫码相机

### 6.3 扫码成功之后获取到商品条形码

### 6.4 调用商品信息接口,查询到商品信息

### 6.5 将商品信息保存到本地

### 6.6 跳转到购物车页面



## 七、购物车页面开发



## 八、订单页面开发



## 九、支付成功页面开发



## 十、个人中心页面



## 十一、账户余额页面开发



## 十二、余额明细页面开发



## 十三、项目总结