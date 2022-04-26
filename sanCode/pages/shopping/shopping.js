// pages/shopping/shopping.js
import IndexModel from "../../model/index"
const indexModel = new IndexModel()
Page({
  handleSacnCode(){
    wx.scanCode({
      onlyFromCamera: false,
      success : async (res)=>{
        const data = {qcode : res.result}
        const response = await indexModel.getProduct(data)
        this.addCart(response.result)
        wx.navigateTo({
          url: '/pages/cart/cart',
        })
      }
    })
  },

  addCart(data){
    const carts = wx.getStorageSync('carts') || ""
    if(carts){
      const cartStatus = this.hasData(data[0],carts)
      if(cartStatus){
        carts.forEach(item=>{
          if(item._id === data[0]._id){
            item.num += 1
          }
        })
        wx.setStorageSync('carts', carts)
      }else{
        data[0].num = 1
        carts.push(data[0])
        wx.setStorageSync('carts', carts)
      }
    }else{
      data[0].num = 1
      wx.setStorageSync('carts', data)
    }
  },

  hasData(data,carts){
    // 检测给本地存储的商品数据 是否在 本地已存在 
    // 已存在 num + 1
    // 不存在 num = 1, 然后存在本地
    return carts.some((item)=>item._id === data._id)
  },

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