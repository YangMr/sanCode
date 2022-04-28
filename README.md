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

![image-20220426085322153](README.assets/image-20220426085322153.png)

**tabBar**

```json
{
    "pages": [
        "pages/shopping/shopping",
        "pages/product/product",
        "pages/personal/personal"
    ],
    "window": {
        "backgroundTextStyle": "light",
        "navigationBarBackgroundColor": "#fff",
        "navigationBarTitleText": "Weixin",
        "navigationBarTextStyle": "black"
    },
    "tabBar": {
        "selectedColor": "#f60",
        "backgroundColor": "#fff",
        "list": [
            {
                "pagePath": "pages/shopping/shopping",
                "text": "扫码购物",
                "iconPath": "/assets/images/index02.png",
                "selectedIconPath": "/assets/images/index01.png"
            },
            {
                "pagePath": "pages/product/product",
                "text": "每日优选",
                "iconPath": "/assets/images/product02.png",
                "selectedIconPath": "/assets/images/product01.png"
            },
            {
                "pagePath": "pages/personal/personal",
                "text": "个人中心",
                "iconPath": "/assets/images/user02.png",
                "selectedIconPath": "/assets/images/user01.png"
            }
        ]
    },
    "style": "v2",
    "sitemapLocation": "sitemap.json"
}
```



## 六、扫码购物页面开发

### 6.1 实现页面布局

![image-20220426100411088](README.assets/image-20220426100411088.png)

`Shopping.wxml`

```html
<view class="shopping">
  <t-swiper swiperList="{{swiperList}}"></t-swiper>
  <view class="scancode">
    <view class="button">
      <image src="../../assets/images/qrcode.png"></image>
      <text>请扫描商品条形码</text>
    </view>  
  </view>
</view>

```

`Shopping.wxss`

```css
/* pages/shopping/shopping.wxss */
.shopping{
  height : 100%;
  display: flex;
  flex-direction: column;
}
.scancode{
  flex : 1;
  display: flex;
  justify-content: center;
  padding-top:100rpx;
  box-sizing: border-box;
}
.button{
  width: 280rpx;
  height: 280rpx;
  border-radius: 50%;
  background-color: #FEB81C;
  border : 10px solid #FFE8B6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.button image{
  width: 168rpx;
  height: 143rpx;
}
.button text{
  display: block;
  width: 163rpx;
  color : #fff;
  text-align: center;
  margin-top: 5rpx;
}
```

`Shopping.js`

```javascript
// pages/shopping/shopping.js
import IndexModel from "../../model/index"
const indexModel = new IndexModel()
Page({

  async getBanner(){
    const response = await indexModel.getBanner()
    console.log(response)
    this.setData({
      swiperList : response.data
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    swiperList : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getBanner()
  }
})
```

`Shopping.json`

```json
{
  "usingComponents": {
    "t-swiper" : "/components/swiper/swiper"
  }
}
```

`swiper.wxml`

```html
<view class="swipper">
    <swiper indicator-dots autoplay circular>
      <swiper-item wx:for="{{swiperList}}" wx:key="index">
        <image  src="{{item.banner_img}}"></image>
      </swiper-item>
    </swiper>
  </view>
```

`swiper.wxss`

```css
/* components/swiper/swiper.wxss */
.swipper, swiper, image{
  width: 100%;
  height : 320rpx;
}
```



### 6.2 点击扫码调用扫码相机

**实现思路:**

1. 给按钮绑定点击事件
2. 调用扫码相机
3. 扫描商品
4. 获取条形码

### 6.3 扫码成功之后获取到商品条形码

### 6.4 调用商品信息接口,查询到商品信息

### 6.5 将商品信息保存到本地

### 6.6 跳转到购物车页面



## 七、购物车页面开发

### 7.1 实现购物车静态页面布局

### 7.2 获取本地存储的商品数据

### 7.3 渲染获取到商品数据

### 7.4 购物车价格计算(加、减、总价)

### 7.5 商品的删除

### 7.6 商品的继续添加功能

### 7.6 去结算功能

## 八、订单页面开发





### 8.8 支付功能

1. 打开小程序先进行登录
2. 获取登录之后的用户信息 --- openid
3. 将用户信息保存到本地
4. 在订单页点击支付按钮,触发一个方法
5. 在这个方法里面 调用统一下单接口
6. 接口调用成功之后,后台会返回支付所要的参数
7. 获取到支付所需要的参数之后
8. 通过wx.requestPayment发起支付
9. 支付成功的处理
10. 支付失败的处理



微信小程序支付:
        1. 当小程序启动的时候,调用wx.login获取小程序的code码
        2. 获取到小程序的code码之后,调用获取openid接口,获取到openid
        3. 将获取到的openid以及其他信息保存到本地
        4. 当点击确认支付按钮时调用统一下单接口,将对应的参数发送给后台,其中有一个签名非常重要,使用的md5进行的加密
        5. 当统一下单接口调用成功之后,后台会给我们返回支付所需要的相关信息
        6. 获取到支付相关的信息之后,调用封装的微信支付方法,拉起支付,把对应支付信息传进去就能够完成支付功能

        注意:加密以这块我们根据后台的要求,只加密了openid uid 以及salt等属性以及属性值,用的是md5
杨岭
7月12日 16:00
微信小程序的支付功能:
    
    支付的准备工作:
    
      注册小程序的账号 (不能是个人号,个人号无法认证,并且无法开通微信支付)
    
      进行小程序的认证 (300/年)
    
      开通微信支付  (填写支付所需要的相关信息)


    前端业务:
      1. 在小程序启动的时候,调用wx.login方法获取凭证(凭证也就是code码)
      2. 调用获取openid接口,通过传递code码获取后台给返回的openid以及相关信息
      3. 将openid和相关信息保存到本地
      4. 当点击确认支付按钮的时候,调用统一下单接口
        4.1 获取保存到本地的openid以及相关信息
        4.2 获取购物车的数据,并且将获取到的购物车的数据,转化为字符串(使用JSON.stringify()方法)
        4.3 实现签名
          4.3.1 和后端确定加密的方式(md5)以及所要加密的字段 
          4.3.2 创建一个sign方法,在这个方法里面接收我们要加密的字段
            - 在sign方法里面,创建一个数组
            - 使用for in语句遍历加密的字段
            - 将遍历的字段添加数组里面
            - 对数组使用sort方式进行排序
            - 初始化str变量,用来保存加密的字段属性和字段值的拼接
            - 在使用for语句遍历保存加密字段属性的数组
            - 引入md5模块
            - 使用md5进行加密
            - 将加密之后的内容return 返回sign这个方法
        4.4 将统一下单接口所需要参数一一进行传递
      5. 当统一下单接口调用成功之后,能够获取到支付所需要的相关信息
      6. 调用小程序内置的支付api,将支付api所需要的参数进行传递,如果正确的话,则拉起支付
      7. 进行支付
      8.支付成功之后,清除购物车的数据,并且跳转到支付成功的页面    
    
      代码: 
        代码一共分为2部分:
          获取code码以及openid的相关信息:
    
          -------------------------------------------------------------------------------
            //1. 调用wx.login方法,获取code码
            wx.login({
              success : async (res)=>{
                //2. 获取code码
                const code = res.code;
                //3. 调用获取openid的接口
                const result = await payApi.getOpenId(code);
                //4. 判断 如果成功 则标openid及其他相关的信息保存到畚斗, 失败 则进行一个错误提示
                if(result.data.success){
                  const userinfo = result.data.userinfo;
                  wx.setStorageSync('userinfo', userinfo)
                }else{
                  wx.showToast({
                    title: '获取openId失败',
                  })
                }
              },
              fail : ()=>{
                wx.showToast({
                  title: '调用wx.login方法失败',
                })
              }
            })
          }
        ---------------------------------------------------------------------------------


​         
        点击确认支付按钮要执行的代码:
           /*支付方法*/
            async doPay() {
              //显示加载中
              wx.showLoading();
    
              //获取商品的所用数据
              const carts = wx.getStorageSync('carts');
              // console.log(carts)
    
              //获取本地存储的openid的相关信息
              const userinfo = wx.getStorageSync('userinfo');
              // console.log(userinfo)
    
              //调用签名方法
              const signData = sign({
                openid: userinfo.openid,
                salt: userinfo.salt,
                uid: userinfo._id
              });



              //调用统一下单接口
              const result = await payApi.unifiedOrder({
                openid: userinfo.openid,
                uid: userinfo._id,
                sign: signData,
                total_price: this.data.allPrice,
                total_num: this.data.allNum,
                derate_price: 0,
                real_price: this.data.allPrice,
                order: JSON.stringify(carts)
              })
    
              //做一个错误的处理
              if (result.data.success) {
                console.log(result.data.result)
                const data = JSON.parse(result.data.result);
                this.wxPay(data)
                wx.hideLoading();
              } else {
                wx.hideLoading();
                wx.showToast({
                  title: '统一下单失败',
                })
              }
    
            },
    
            /*拉起支付的方法*/
            wxPay(data) {
              console.log(data)
              wx.requestPayment({
                timeStamp: data.timeStamp,
                nonceStr: data.nonceStr,
                package: data.package,
                signType: 'MD5',
                paySign: data.paySign,
                success(res) {
                  console.log(res)
                },
                fail(res) {}
              })
            }


​           
        签名加密的代码:
        function sign(userinfo){
          const arr = [];
          for(var i in userinfo){
            arr.push(i)
          };
          arr.sort();
          
          let str = "";
          for(var i=0;i<arr.length;i++){
            str += arr[i] + userinfo[arr[i]];
          }
        
          console.log(md5(str));
          return md5(str);
        
        }


    后端业务: 
    
      后端去写的,如果咱们公司需要写的话,我这边也可以解决,虽然没有写过,但是这个问题我能给解决
    
      (闲鱼 或者 淘宝) ,在上面找人接单,专门给你解决问题, 收费(不建议)

*/

## 九、支付成功页面开发



## 十、个人中心页面



## 十一、账户余额页面开发



## 十二、余额明细页面开发



## 十三、项目总结