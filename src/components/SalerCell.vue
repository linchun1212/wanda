<template>
  <div class="SalerCell">
    <!-- 卖品图片 -->
    <div class="SalerCover">
      <img :src="salerinfo.img" alt="" />
    </div>
    <!-- 卖品简介 -->
    <div class="SalerInfo">
      <div class="SalerTitle">{{ salerinfo.title }}</div>
      <div class="SalerDes">{{ salerinfo.des }}</div>
      <div class="SalerPrice">￥{{ salerinfo.price }}</div>
    </div>
    <!-- 卖品价格 -->
    <div class="SalerComment">
      <template v-if="salerinfo.count > 0">
        <!-- 减 -->
        <div class="salerSub fa fa-minus-circle" @click="minus"></div>
        <!-- 数量 -->
        <div class="salerCount">{{ salerinfo.count }}</div>
      </template>
      <!-- 加 -->
      <div class="salerAdd fa fa-plus-circle" @click="add"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["salerinfo"],
  methods: {
    minus() {
      this.$emit("minus");
    },
    add() {
      this.$emit("add");
    }
  }
};
</script>
<style lang="less">
.SalerCell {
  position: relative;
  display: flex;
  overflow: hidden;
  justify-content: space-between;
  height: 120px;
  padding-top: 5px;
  box-sizing: border-box;
  border-bottom: 1px solid #ddd;
  .SalerCover {
    width: 70px;
    padding-top: 5px;
    padding-bottom: 5px;
    img {
      width: 100%;
      height: 100px;
    }
  }
  .SalerInfo {
    flex: 1 1 auto;
    padding-left: 8px;
    padding-right: 8px;
    position: relative;
    .SalerTitle {
      position: absolute;
      top: 10px;
      font-weight: 400;
      font-size: 1.1em;
    }
    .SalerDes {
      position: absolute;
      top: 45px;
      color: gray;
      font-size: 0.8rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 90%;
    }
    .SalerPrice {
      position: absolute;
      top: 72px;
      font-size: 1.1rem;
      color: goldenrod;
    }
  }
  .SalerComment {
    width: 80px;
    position: absolute;
    bottom: 15px;
    right: 10px;
    display: flex;

    justify-content: space-between;
    align-items: center;
    .salerSub,
    .salerAdd {
      font-size: 1.5rem;
      color: goldenrod;
    }
    .salerAdd {
      //   position: absolute;
    }
    .salerCount {
      font-size: 1.2rem;
    }
  }
}
</style>
