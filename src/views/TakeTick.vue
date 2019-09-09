<template>
  <div class="tick">
    <mt-header title="影院">
      <mt-button icon="back" @click="goback" slot="left"></mt-button>
    </mt-header>
    <div class="tick_content">
      <!-- 影院信息 -->
      <div class="tick_cinema_info">
        <div class="tick_cinema_infocontent">
          <div class="tick_cinema_infoname">
            {{ this.tmp_cinema.cinemaName }}
          </div>
          <div class="tick_cinema_infoaddress">
            {{ this.tmp_cinema.address }}
          </div>
        </div>

        <div class="tick_cinema_infomap" @click="gotoMap">
          <div class="mapicon fa fa-map-marker"></div>
          <div class="maptip">地图</div>
        </div>
      </div>
      <div class="tip">
        一名成人限带一名1.3米以下的儿童免费观影，儿童不提供座位；3D影片免费提供眼镜
      </div>
      <!-- 轮播图 -->
      <div class="tick_swiper">
        <!-- 轮播图的虚拟背景 -->
        <div class="swiper_bg" v-if="movieList.length > 0">
          <img
            :src="movieList[currentIndex].pic_url"
            alt=""
            width="100%"
            height="100%"
          />
        </div>
        <!-- 轮播图 -->
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div
              class="swiper-slide"
              v-for="(item, index) in movieList"
              :key="index"
            >
              <img :src="item.pic_url" alt="" width="100%" height="100%" />
            </div>
          </div>
        </div>
        <div class="currentMovieTitle">{{ currentMovieTitle }}</div>
      </div>
      <!-- 放映厅 -->
      <div class="hall">
        <div class="hall-title">{{ currentTime }}</div>
        <div class="hall-list" v-if="movieList.length > 0">
          <template v-for="(item, index) in movieList[currentIndex].broadcast">
            <div class="hall-item" :key="index">
              <div class="hall-time">{{ item.time }}</div>
              <div class="hall-num">{{ item.hall }}</div>
              <div class="hall-price">￥{{ item.price }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from "swiper";
import "swiper/dist/css/swiper.css";
import { mapGetters } from "vuex";
import Http from "../http";
import moment from "moment";
import store from "store";

export default {
  data: function() {
    return {
      imglist: [],
      movieList: [],
      currentIndex: 0,
      currentMovieTitle: "",
      currentTime: "",
      tmp_cinema: {}
    };
  },
  computed: {
    ...mapGetters("cinema", ["Cinema"])
    // swiperStyle: function() {
    //   if (this.movieList.length == 0) return;
    //   let currUrl = this.movieList[this.currentIndex].pic_url;
    //   return {
    //     // filter: "blur(5px)",
    //     backgroundImage: `url(${currUrl})`
    //   };
    // }
  },
  methods: {
    //   调用地图
    gotoMap() {
      console.log(this.Cinema);
      this.$router.push({ name: "map" });
    },
    //   返回按钮
    goback() {
      this.$router.go(-1);
    },
    // 请求数据
    cinemasmovie: function() {
      Http.cinemasmovie(result => {
        this.movieList = result.data.result.lists;
        this.currentMovieTitle = this.movieList[this.currentIndex].movieName;
      });
    },
    calcDate() {
      let week = moment().format("e");
      let week_zh = "";

      switch (week) {
        case "0":
          week_zh = "周日";
          break;
        case "1":
          week_zh = "周一";
          break;
        case "2":
          week_zh = "周二";
          break;
        case "3":
          week_zh = "周三";
          break;
        case "4":
          week_zh = "周四";
          break;
        case "5":
          week_zh = "周五";
          break;
        case "6":
          week_zh = "周六";
          break;
        default:
          break;
      }
      this.currentTime = week_zh + " " + moment().format("MM-DD");
    },
    swiper() {
      var that = this;
      new Swiper(".swiper-container", {
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        effect: "coverflow",
        centeredSlides: true,
        slidesPerView: 4,
        initialSlide: 0,
        coverflowEffect: {
          rotate: 0,
          stretch: -20,
          depth: 120,
          slideShadows: true
        },
        on: {
          slideChange: function() {
            that.currentIndex = this.activeIndex;
            //   console.log(that.currentIndex);
            that.currentMovieTitle = that.movieList[this.activeIndex].movieName;
          }
        }
      });
    }
  },
  mounted: function() {
    this.tmp_cinema = store.get("wanda_cinema");
    //   显示当前的日期
    this.calcDate();
    // 请求数据
    this.cinemasmovie();
    // 加载swiper轮播
    this.swiper();
  }
};
</script>
<style lang="less">
.tick {
  //   height: 120px;
  .tick_content {
    position: absolute;
    top: 40px;
    width: 100%;
    height: calc(100% - 40px);
    overflow-y: scroll;
    .tick_cinema_info {
      height: 80px;
      display: flex;
      .tick_cinema_infocontent {
        flex: 1 1 auto;
        padding: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .tick_cinema_infoname {
          font-size: 1.1rem;
        }
        .tick_cinema_infoaddress {
          font-size: 0.8rem;
          color: lightgray;
        }
      }
      .tick_cinema_infomap {
        flex: 0 0 50px;
        display: flex !important;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: grey;
        .mapicon {
          font-size: 1.5rem;
        }
        .maptip {
          font-size: 0.8rem;
        }
      }
    }
    .tip {
      height: 40px;
      font-size: 0.8rem;
      background-color: lightgoldenrodyellow;
      padding: 5px 10px;
      color: gray;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .tick_swiper {
      height: 160px;
      position: relative;
      .currentMovieTitle {
        position: absolute;
        bottom: 0px;
        text-align: center;
        width: 100%;
      }
      .swiper_bg {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 130px;
        img {
          filter: blur(5px);
        }
      }
      .swiper-container {
        position: absolute;
        top: 0px;
        left: 0px;
        padding-top: 10px;
        width: 100%;
        height: 120px;
      }
      .swiper-slide {
        height: 100%;
      }
    }
    .hall {
      .hall-title {
        height: 30px;
        line-height: 30px;
        font-size: 0.8rem;
        color: grey;
        margin-top: 15px;
        padding-left: 20px;
        background-color: lightgrey;
      }
      .hall-item {
        padding-left: 15px;
        padding-right: 15px;
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #ddd;
      }
    }
  }
}
</style>
