<template>
  <div class="moviedetail">
    <mt-header :title="detailData.title">
      <mt-button icon="back" @click="goback" slot="left"></mt-button>
    </mt-header>
    <div class="moviedetail_content">
      <!-- 头部区域 -->
      <div class="moviedetail_header">
        <div class="moviedetail_header_bg">
          <img :src="detailData.poster" alt="" />
          <div class="moviedetail_header_title">{{ detailData.title }}</div>
          <div class="moviedetail_header_titleAlias">
            {{ detailData.also_known_as }}
          </div>
        </div>
        <div class="moviedetail_header_intro">
          <div class="runtime">{{ detailData.runtime }}</div>
          <div class="genres">{{ detailData.genres }}</div>
          <div class="year">{{ detailData.year }}</div>
          <div class="locations">
            <span class="film_locations">{{ detailData.film_locations }}</span>
            <span>:</span>
            <span class="writers">{{ detailData.writers }}</span>
          </div>
        </div>
        <div class="moviedetail_header_cover">
          <img :src="detailData.poster" alt="" />
        </div>
      </div>
      <!-- 简介 -->
      <div class="moviedetail_des" @click="toggleUpDown">
        <div class="moviedetail_des_content">
          {{ detailData.plot_simple }}
        </div>
        <div class="moviedetail_des_arrow ">
          <span
            class="fa"
            :class="{ 'fa-angle-up': isDown, 'fa-angle-down': !isDown }"
          ></span>
        </div>
      </div>
      <!-- 演员和导演列表 -->
      <div class="moviedetail_list">
        <div class="moviedetail_list_actors">
          <div class="moviedetail_list_title">
            <span class="directors">导演</span>
            <span class="actors">演员</span>
          </div>

          <div class="moviedetail_list_actorsScroll">
            <template v-for="(item, index) in this.actors">
              <div class="actor" :key="index">
                <div class="avatar">
                  <img :src="item.avatar" alt="" />
                </div>
                <div class="nameByZH">{{ item.name_zh }}</div>
                <div class="nameByEN">{{ item.name_en }}</div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- 购票 -->
    <div class="takeTick" @click="takeTick">购票</div>
  </div>
</template>
<script>
import Http from "../http";
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
export default {
  data: function() {
    return {
      detailData: {},
      isDown: false, //默认是收齐状态
      actors: []
    };
  },
  methods: {
    //   购票
    takeTick() {
      // console.log("购票");
      this.$router.push({ name: "taketick" });
    },
    //   简介的折叠
    toggleUpDown() {
      let des_content = document.getElementsByClassName(
        "moviedetail_des_content"
      )[0];
      if (this.isDown) {
        des_content.style.height = "42px";
      } else {
        des_content.style.height = "auto";
      }

      this.isDown = !this.isDown;
    },
    // 处理演员列表数据
    dealActor() {
      this.actors.push({
        name_zh: this.detailData.directors,
        name_en: "GQJ",
        avatar: this.detailData.poster
      });
      let name_mix = this.detailData.actors.split(",");
      name_mix.forEach(val => {
        let names_arr = val.split(" ");
        let obj = { name_zh: "", name_en: "", avatar: this.detailData.poster };
        for (let i = 0; i < names_arr.length; i++) {
          if (i == 0) {
            obj.name_zh = names_arr[0];
          } else {
            // console.log(names_arr[i]);
            obj.name_en += names_arr[i] + " ";
          }
        }
        // obj.name_en.trimRight();
        this.actors.push(obj);
      });
      //   console.log(actors);
      let actors = document.getElementsByClassName(
        "moviedetail_list_actorsScroll"
      )[0];
      actors.style.width = 110 * this.actors.length + "px";
    },
    //   返回按钮
    goback() {
      this.$router.go(-1);
    }
  },
  mounted: function() {
    // console.log(this.$route.params);
    Indicator.open("加载中");
    Http.movieDetail(result => {
      Indicator.close();
      if (result.code && result.code == 202) {
        Toast("网络异常，稍后重试");
        return;
      }
      this.detailData = result.data.result;
      this.dealActor();
    });
  }
};
</script>
<style lang="less">
.moviedetail {
  background-color: #eee;
  .moviedetail_content {
    position: absolute;
    top: 40px;
    width: 100%;
    height: calc(100% - 80px);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .moviedetail_header {
      position: relative;
      height: 180px;
      padding-bottom: 10px;
      //   border-bottom: 1px solid #ddd;
      background-color: white;
      .moviedetail_header_bg {
        height: 80px;
        img {
          width: 100%;
          height: 100%;
          filter: blur(5px);
        }
        .moviedetail_header_title,
        .moviedetail_header_titleAlias {
          position: absolute;
          color: white;
          left: 43%;
        }
        .moviedetail_header_title {
          top: 30px;
          font-size: 1.2rem;
        }
        .moviedetail_header_titleAlias {
          top: 60px;
          font-size: 0.8rem;
        }
      }
      .moviedetail_header_intro {
        position: absolute;
        left: 43%;
        width: 57%;
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        font-size: 0.9rem;
        .locations {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: grey;
          width: 95%;
        }
      }
      .moviedetail_header_cover {
        position: absolute;
        height: 160px;
        width: 37%;
        top: 20px;
        left: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .moviedetail_des {
      margin-top: 10px;
      background-color: white;
      .moviedetail_des_content {
        color: grey;
        padding: 10px;
        padding-bottom: 0px;
        height: 42px;
        overflow: hidden;
        transition: all 0.5s;
      }
      .moviedetail_des_arrow {
        text-align: center;
        font-size: 1.5rem;
        color: grey;
      }
    }
    .moviedetail_list {
      margin-top: 10px;
      background-color: white;
      height: 150px;
      .moviedetail_list_title {
        height: 40px;
        line-height: 40px;
        position: relative;
        .directors {
          position: absolute;
          left: 55px;
          transform: translateX(-50%);
        }
        .actors {
          position: absolute;
          left: 165px;
          transform: translateX(-50%);
        }
      }
      .moviedetail_list_actors {
        overflow-x: scroll;
        -webkit-overflow-scrolling: touch;
        .moviedetail_list_actorsScroll {
          .actor {
            width: 90px;
            padding-left: 10px;
            padding-right: 10px;
            float: left;
            .avatar {
              height: 70px;
              width: 70px;
              margin: 0 auto;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .nameByZH,
            .nameByEN {
              text-align: center;
              font-size: 0.7rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .nameByEN {
              color: lightgrey;
            }
          }
        }
        .moviedetail_list_actorsScroll::after {
          content: "";
          display: block;
          clear: both;
        }
      }
      .moviedetail_list_actors::-webkit-scrollbar {
        display: none;
      }
    }
  }
  .takeTick {
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: goldenrod;
    color: white;
  }
}
</style>
