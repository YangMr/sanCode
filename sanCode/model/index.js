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