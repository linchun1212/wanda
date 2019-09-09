import axios from "axios";
/*
  axios基于promise
  axios比jquery要轻量
  请求拦截
  并发
  放弃请求
  get请求参数params
  post请求参数data
*/
const HTTP_BASE = "http://www.bestqingshan.top/movie/";
const HTTP_CITYS = HTTP_BASE + "citys.php"; //城市列表
const HTTP_CINEMAS = HTTP_BASE + "cinemas.php"; //城市对应的影院列表
const HTTP_SWIPER = HTTP_BASE + "getSwiper.php";
const HTTP_CINEMAS_MOVIE = HTTP_BASE + "cinemasmovies.php";
const HTTP_SALER_PRODUCT = HTTP_BASE + "product.php";
const HTTP_MOVIE_DETAIl = HTTP_BASE + "movieInfo.php";

var CancelToken = axios.CancelToken;
var source = CancelToken.source();

export default class Http {
  static common(url, req_param) {
    let data = {};
    for (let key in req_param) {
      data[key] = req_param[key];
    }

    let config = {
      cancelToken: source.token
    };
    // if (type == "GET") {
    //   config.params = data;
    // } else {
    //   config.data = data;
    // }
    // 请求拦截器
    this.req_interceptors();
    // 响应拦截器
    this.res_interceptors();

    // let axios_promise = null;
    // if(type == 'GET'){
    //   axios_promise = axios.get(url, config)
    // }
    // else{
    //   axios_promise = axios.post(url, config)
    // }
    // return axios_promise.catch(function(thrown) {
    //   if (axios.isCancel(thrown)) {
    //     return { code: 201, msg: thrown.message };
    //   } else {
    //     // 处理错误
    //     return { code: 202, msg: "未知异常" };
    //   }
    // });
    return axios.get(url, config).catch(function(thrown) {
      if (axios.isCancel(thrown)) {
        return { code: 201, msg: thrown.message };
      } else {
        // 处理错误
        return { code: 202, msg: "未知异常" };
      }
    });
  }
  // 请求拦截器
  static req_interceptors() {
    // 添加请求拦截器
    axios.interceptors.request.use(
      function(config) {
        // 在发送请求之前做些什么
        // 设置取消请求的token
        var CancelToken = axios.CancelToken;
        var source = CancelToken.source();
        config.cancelToken = source.token;

        // 模拟没有登陆的情况
        // let isLogin = true;
        // if (!isLogin) source.cancel("当前账号还没有登陆");
        return config;
      },
      function(error) {
        // 对请求错误做些什么
        return Promise.reject(error);
      }
    );
  }
  // 响应拦截器
  static res_interceptors() {
    // 添加响应拦截器
    axios.interceptors.response.use(
      function(response) {
        // 对响应数据做点什么
        // return response.data;
        return response;
      },
      function(error) {
        // 对响应错误做点什么
        return Promise.reject(error);
      }
    );
  }
  // 请求城市列表
  static async citys(callback) {
    let result = await this.common(HTTP_CITYS);
    callback(result);
  }
  // 请求城市对应的影院列表
  static async cinemas(callback) {
    let result = await this.common(HTTP_CINEMAS);
    callback(result);
  }
  // 请求轮播图
  static async swiper(callback) {
    let result = await this.common(HTTP_SWIPER);
    callback(result);
  }
  // 请求首页内容
  static async cinemasmovie(callback) {
    let result = await this.common(HTTP_CINEMAS_MOVIE);
    callback(result);
  }
  // 请求卖品内容
  static async product(callback) {
    let result = await this.common(HTTP_SALER_PRODUCT);
    callback(result);
  }
  // 请求电影详情
  static async movieDetail(callback) {
    let result = await this.common(HTTP_MOVIE_DETAIl);
    callback(result);
  }
  static async all(callback) {
    axios.all([this.common(HTTP_SWIPER), this.common(HTTP_CINEMAS_MOVIE)]).then(
      axios.spread(function(...params) {
        callback(params);
      })
    );
  }
}
// Http.proxy = "http://www.bestqingshan.top/demo/Juhe.php";
// Http.baseURL = "http://apicloud.mob.com/v1/cook/";
// https://apis.map.qq.com/ws/geocoder/v1?key=HQLBZ-OCK3J-3GCFO-KUKAY-IKGJQ-S3BGN&location=39.98174,116.30631
