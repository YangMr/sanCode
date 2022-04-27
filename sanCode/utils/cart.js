import IndexModel from "../model/index"
const indexModel = new IndexModel()

// 1. 开启扫码相机,获取商品条形码
class QrCode {
  openScanCode() {
    return new Promise((resolve,reject)=>{
      wx.scanCode({
        onlyFromCamera: false,
        success: (res) => {
        //  this.result = res.result
          resolve(res.result)
        },
        fail : (error)=>{
          reject(error)
        }
      })
    })
  }
}


// 3. 获取商品信息
class GetInfo extends QrCode{
  constructor(){
    super()
  }
  async getProduct(){
    const result = await this.openScanCode()
    const data = {qcode : result}
    const response = await indexModel.getProduct(data)
    return response.result
  }
}



// 4. 将商品添加到本地
class Cart extends GetInfo{
  async addCart() {
    const data =await this.getProduct()
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
      wx.setStorageSync('carts',data)
    }
  }

  // removeCart() {
    
  // }

  hasData(data,carts){
    return carts.some((item)=>item._id === data._id)
  }
}

// class ComputePrice {
//   // 增加
//   increment() {

//   }

//   // 减少
//   decrement() {

//   }

//   // 计算总价
//   totalPrice() {

//   }
// }



export {QrCode, GetInfo ,Cart }























// openScanCode(){
  //   return new Promise((resolve,reject)=>{
  //     wx.scanCode({
  //       onlyFromCamera: false,
  //       success : (res)=>{
  //         const result = res.result
  //         resolve(result)
  //       },
  //       fail : (error)=>{
  //         reject(error)
  //       }
  //     })
  //   })
  // }