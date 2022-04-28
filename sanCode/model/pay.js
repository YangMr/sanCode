import Http from "../utils/request"

class PayModel extends Http{
  login(data = {}){
    return this.request({url : "/weixinpay/login", method : "GET", data,name : "api2"})
  }

  order(data = {}){
    return this.request({url : "/weixinpay/doOrder", method : "POST", data, name : "api2"})
  }
}

export default PayModel