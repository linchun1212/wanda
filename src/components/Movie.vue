<template>
  <div class="movie">
    <header>
      <mt-header title="万达电影"> </mt-header>
      <template v-if="movieList.length > 0">
        <mt-cell :title="cinemaName" @click.native="gotoCinemas" is-link>
          <span slot="icon" class="fa fa-map-marker"></span>
        </mt-cell>
      </template>
    </header>
    <div class="movie_content">
      <div class="banner">
        <!-- 这里是轮播图 -->
        <mt-swipe :auto="4000" :continuous="true">
          <template v-for="(item, index) in swiperList">
            <mt-swipe-item :key="index">
              <img :src="item" alt="" width="100%" height="100%" />
            </mt-swipe-item>
          </template>
        </mt-swipe>
      </div>
      <div class="movie_list">
        <!-- 测试数据 -->
        <template v-for="(val, idx) in movieList">
          <movie-cell
            :movieinfo="val"
            :key="idx"
            @gotoMovieDetail="gotoMovieDetail"
          ></movie-cell>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import MovieCell from "./MovieCell";
import { mapGetters } from "vuex";
import Http from "../http";
import { Indicator } from "mint-ui";
import store from "store";

export default {
  name: "movie",
  data: function() {
    return {
      cinemaName: "",
      swiperList: [],
      movieList: []
    };
  },
  computed: {
    ...mapGetters("cinema", ["Cinema"])
  },
  beforeRouteEnter(to, from, next) {
    // 如果当前store中有城市或影院数据，则直接进入home
    next(vm => {
      if (store.get("wanda_cinema")) {
        next();
      } else {
        vm.$router.replace({ name: "city" });
      }
    });
  },
  methods: {
    // 跳转电影详情
    gotoMovieDetail(movieId) {
      // console.log(movieId);
      this.$router.push({ name: "moviedetail", params: { movieId } });
    },
    // 跳转影院列表
    gotoCinemas: function() {
      let cityId = "123";
      this.$router.push({ name: "cinemas", params: { cityId } });
    },
    swiper: function() {
      Http.swiper(result => {
        this.swiperList = result.data.data;
      });
    },
    cinemasmovie: function() {
      Http.cinemasmovie(result => {
        this.movieList = result.data.result.lists;
      });
    }
  },
  components: {
    MovieCell
  },
  mounted: function() {
    // this.cinemaName = this.Cinema.cinemaName;
    this.cinemaName = store.get("wanda_cinema").cinemaName;
    // this.swiper();
    // this.cinemasmovie();
    Indicator.open("加载中");
    Http.all(params => {
      Indicator.close();
      // console.log(params);
      this.swiperList = params[0].data.data;
      this.movieList = params[1].data.result.lists;
    });
  }
};
</script>
<style lang="less">
.movie {
  header {
    position: fixed;
    width: 100%;
  }
  .mint-cell {
    height: 45px;
    position: absolute;
    top: 40px;
    width: 100%;
    border-bottom: none !important;
    .mint-cell-wrapper {
      border-bottom: none !important;
    }
  }
  .movie_content {
    position: absolute;
    top: 85px;
    height: calc(100% - 134px);
    width: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .banner {
      height: 90px;
      // background-color: red;
    }
    .movie_list {
      padding-left: 10px;
    }
  }
}
</style>
