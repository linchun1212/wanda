<template>
  <div>
    <mt-header title="选择城市">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="citys">
      <div class="currentCity">
        <p>
          <span>当前城市</span>
          <span>{{ currCity }}</span>
        </p>
      </div>
      <div class="city_list">
        <template v-for="(val, key) in list">
          <div v-if="val.length > 0" :key="key">
            <div class="city_pre">{{ key }}</div>
            <div class="city_names">
              <div class="city_name" v-for="item in val" :key="item.id">
                <div @click="gotoCinemas(item)">
                  {{ item.city_name }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Http from "../http";
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
import { mapActions } from "vuex";
import store from "store";
var qq = window.qq;

export default {
  name: "city",
  data: function() {
    return {
      currCity: "",
      list: {}
    };
  },
  beforeRouteEnter(to, from, next) {
    // 如果当前store中有城市或影院数据，则直接进入home
    next(vm => {
      if (from.name == "cinemas") {
        next();
      } else {
        if (store.get("wanda_cinema")) {
          vm.$router.replace({ name: "movie" });
        } else {
          next();
        }
      }
    });
  },
  methods: {
    ...mapActions("city", ["actCity"]),
    gotoCinemas: function(cityInfo) {
      console.log(cityInfo);
      this.currCity = cityInfo.city_name;
      store.set("wanda_city", cityInfo);
      // console.log(cityId);
      this.actCity(cityInfo); //将当前选中的城市信息存储到store中
      this.$router.push({ name: "cinemas", params: { cityId: cityInfo.id } });
    },
    // 反向地理解析
    reversGeocoder: function(lat, lng) {
      this.axios
        .get("https://www.bestqingshan.top/demo/Juhe.php", {
          params: {
            url: "https://apis.map.qq.com/ws/geocoder/v1",
            param: {
              key: "HQLBZ-OCK3J-3GCFO-KUKAY-IKGJQ-S3BGN",
              location: `${lat},${lng}` //39.98174,116.30631
            }
          }
        })
        .then(res => {
          var obj = JSON.parse(res.data.data);
          let city = obj.result.address_component.city;
          this.currCity = city.substring(0, city.length - 1);
        })
        .catch(err => {
          console.error(err);
        });
    },
    // qq地图定位
    getMyLocation() {
      var geolocation = new qq.maps.Geolocation(
        "HQLBZ-OCK3J-3GCFO-KUKAY-IKGJQ-S3BGN",
        "wd"
      );
      // 手机端定位
      // geolocation.getLocation(this.showPosition, this.showErr);
      // PC端定位
      geolocation.getIpLocation(this.showPosition, this.showErr);
    },
    showPosition(position) {
      console.log(position);
      // 存储当前定位的地理位置
      store.set("wanda_position", position);
      // this.latitude = position.lat;
      // this.longitude = position.lng;
      // this.reversGeocoder(position.lat, position.lng);
      // 用户如果没有主动去选择城市则定位显示当前城市
      if (this.currCity == "") {
        this.currCity = position.city.substring(0, position.city.length - 1);
      }
    },
    showErr() {
      console.log("定位失败");
      this.getMyLocation(); //定位失败再请求定位，测试使用
    }
  },
  mounted: function() {
    // this.reversGeocoder(39.98174, 116.30631); //反向地理解析
    this.getMyLocation(); //启动定位
    var obj = {};
    for (let i = 0; i < 26; i++) {
      var char = String.fromCharCode(65 + i); //ASCII码转字符
      obj[char] = [];
    }

    Indicator.open("加载中...");
    Http.citys(result => {
      Indicator.close();
      /*
        {A:[{}],B:[{},{},{}],C:[{},{}...]}
        city_name: "广安"
        city_pinyin: "Guangan"
        city_pre: "G"
        city_short: "ga"
        count: "9"
        id: "981"
      */

      result.data.citys.forEach(function(val) {
        let pre = val.city_pre.toUpperCase();
        obj[pre].push(val);
      });
      this.list = obj;
      // console.log(this.list);
    });
  }
};
</script>
<style lang="less">
.citys {
  position: absolute;
  top: 40px;
  width: 100%;
  height: calc(100% - 40px);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

  .currentCity {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    padding-right: 10px;
    span:nth-of-type(1) {
      color: #c3c3c3;
    }
    span:nth-of-type(2) {
      margin-left: 10px;
    }
  }
  .city_list {
    height: calc(100% - 40px);
    .city_pre {
      padding-left: 10px;
      height: 30px;
      line-height: 30px;
      background-color: lightgray;
    }
    .city_names {
      padding-left: 10px;
      padding-right: 10px;
      display: flex;
      // justify-content: space-between;
      flex-wrap: wrap;
      .city_name {
        padding-top: 10px;
        padding-bottom: 10px;
        min-width: 25%;
      }
    }
  }
}
</style>
