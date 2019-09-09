<template>
  <div class="movieCell" @click="gotoMovieDetail">
    <!-- 封面图片 -->
    <div class="movieCover">
      <img :src="movieinfo.pic_url" alt="" />
    </div>
    <!-- 标题简介 -->
    <div class="movieInfo">
      <div class="movieTitle">{{ movieinfo.movieName }}</div>
      <div class="movieDes">不止比赛，更是意识形态的战争</div>
      <div class="movieDes1">6月13日 后天上映</div>
    </div>
    <!-- 购票评分 -->
    <div class="movieComment">
      <!-- 评分 -->
      <div class="movieStar">8.1分</div>
      <!-- 购票 -->
      <div class="moveTick">购票</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["movieinfo"],
  methods: {
    gotoMovieDetail() {
      this.$emit("gotoMovieDetail", this.movieinfo.movieId);
    }
  }
};
</script>
<style lang="less">
.movieCell {
  display: flex;
  justify-content: space-between;
  height: 120px;
  padding-right: 8px;
  border-bottom: 1px solid #c3c3c3;
  .movieCover {
    width: 70px;
    padding-top: 5px;
    padding-bottom: 5px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .movieInfo {
    flex: 1 1 auto;
    padding-left: 8px;
    padding-right: 8px;
    position: relative;
    .movieTitle {
      position: absolute;
      top: 10px;
      font-weight: bolder;
      font-size: 1.1em;
    }
    .movieDes {
      position: absolute;
      top: 45px;
      color: gray;
      font-size: 0.8rem;
    }
    .movieDes1 {
      position: absolute;
      top: 72px;
      font-size: 0.8rem;
      color: gray;
    }
  }
  .movieComment {
    width: 60px;
    position: relative;
    .movieStar {
      position: absolute;
      top: 15px;
      text-align: right;
      width: 100%;
      color: goldenrod;
    }
    .moveTick {
      height: 30px;
      line-height: 30px;
      background-color: goldenrod;
      border-radius: 30px;
      text-align: center;
      color: white;
      position: absolute;
      bottom: 25px;
      width: 60px;
    }
  }
}
</style>
