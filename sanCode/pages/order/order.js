// pages/order/order.js
import PayModel from "../../model/pay"
const payModel = new PayModel()
import md5 from "../../utils/md5"
Page({

  handlePay(){
    this.handleOrder()
  },

  async handleOrder(){
    const userinfo = wx.getStorageSync('userinfo')
    // uid openid salt
    const sign = this.sign({
      uid : userinfo._id,
      openid : userinfo.openid,
      salt : userinfo.salt
    })

    const data = {
      openid : userinfo.openid,
      uid : userinfo._id,
      sign : sign,
      total_price : this.data.custormPrice,
      total_num : this.data.totalNum,
      derate_price : this.data.balancePrice,
      real_price : this.data.totalPrice,
      order : JSON.stringify(this.data.carts)
    }

    const response = await payModel.order(data)
    this.handlePayMement(response.result)
    // 加入刚才接口调用成功了, 后台会返回支付需要的参数, 这个时候需要发起支付
  },

  handlePayMement(data){
    data = JSON.parse(data)
    console.log(data)
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType : "MD5",
      paySign: data.paySign,
      success : response=>{
        console.log("response=>",response)
        if(response.errMsg === 'requestPayment:ok'){

          wx.removeStorageSync('carts')

          wx.navigateTo({
            url: '/pages/success/success',
          })
        }
      },
      fail : error=>{
        console.log(error)
      }
    })
  },

  handleSwitchStatus(event){
    this.setData({
      switchStatus : event.detail.value
    })

    this.getTotalPrice()
  },  

  handleToggle(){
    let status = this.data.status ? false : true
    console.log(status)
    // true 1  false  所有
    let cartList = status ? this.data.newCarts : this.data.carts 

    this.setData({
      status,
      cartList
    })
  },



  getTotalPrice(){
    let totalPrice = 0
    let custormPrice = 0
    let totalNum = 0
    this.data.carts.forEach(item=>{
      custormPrice += (item.num * item.price)
      totalNum += item.num
    })
    totalPrice = custormPrice

    if(this.data.switchStatus){
      totalPrice -= this.data.balancePrice
    }

    if(totalPrice <= 0){
      totalPrice = 0
    }
    this.setData({
      totalPrice,
      custormPrice,
      totalNum
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    cartList : [],
    carts : [],
    status : true,
    show : "展开",
    hide : "收起",
    balancePrice : 100,
    switchStatus : true,
    totalPrice : 0,
    custormPrice : 0,
    totalNum : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initCartList()
    this.getTotalPrice()
  },

  initCartList(){
    const carts = wx.getStorageSync('carts')
    const newCarts = JSON.parse(JSON.stringify(carts))
    newCarts.length = 1
    this.setData({
      cartList : newCarts,
      carts,
      newCarts 
    }) 
  },

  sign(json){

    const arr = [] // uid openid salt

    for(let key in json){
      arr.push(key)
    }

    arr.sort()

    let str = ""

    for(let i=0;i<arr.length;i++){
      str += arr[i] + json[arr[i]]
    }

    return md5(str)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})