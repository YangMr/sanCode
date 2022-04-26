import Http from "../utils/request"

class IndexModel extends Http{
  getBanner(){
    return this.request({url : "/banner?", method : "GET", header : {devicetype: "H5"}})
  }

  getProduct(data){
    return this.request({url : "/api/getProduct", method: "GET" , data, name : "api2"})
  }
}



export default IndexModel