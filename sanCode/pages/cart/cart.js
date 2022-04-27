// pages/cart/cart.js
import {Cart} from "../../utils/cart"
const cart = new Cart()
Page({

  handleDecrement(event){
    const index = event.currentTarget.dataset.index
    const cartList = this.data.cartList
    cartList[index].num -=1
    if(cartList[index].num <= 0){
      cartList.splice(index,1)
    }
    this.setData({
      cartList
    })
    wx.setStorageSync('carts', cartList)
    this.getTotalPrice()

  },
  handleIncrement(event){
    const index = event.currentTarget.dataset.index
    const cartList = this.data.cartList
    cartList[index].num +=1
    this.setData({
      cartList
    })
    wx.setStorageSync('carts', cartList)
    this.getTotalPrice()
  },

  getTotalPrice(){
    const cartList = this.data.cartList
    let totalPrice = 0
    cartList.forEach(item=>{ 
      totalPrice +=item.num * (item.price)
    })
    this.setData({
      totalPrice : totalPrice.toFixed(2)
    })
  },

  async handleSacnCode(){
    await cart.addCart()
    this.initCartList()
  },

  /**
   * 页面的初始数据
   */
  data: {
    cartList : [],
    productCount : 0,
    totalPrice : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initCartList()
  },


  initCartList(){
    const cartList = wx.getStorageSync('carts')
    this.setData({
      cartList
    })
    this.getProductCount()
    this.getTotalPrice()
  },

  getProductCount(){
    const cartList = wx.getStorageSync('carts')
    let count = 0
    cartList.forEach(item=>{
      count += item.num
    })
    this.setData({
      productCount : count
    })
  },

  handleToOrder(){
    wx.navigateTo({
      url: '/pages/order/order',
    })
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