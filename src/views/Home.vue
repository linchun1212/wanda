<template>
  <div>
    <keep-alive exclude="movie">
      <router-view></router-view>
    </keep-alive>
    <!-- 底部选项卡 -->
    <mt-tabbar v-model="selected">
      <mt-tab-item id="movie" @click="switch">
        <span slot="icon" class="fa fa-bank"></span>
        电影
      </mt-tab-item>
      <mt-tab-item id="saler" @click="switch">
        <span slot="icon" class="fa fa-gift"></span>
        卖品
      </mt-tab-item>
      <mt-tab-item id="person" @click="switch">
        <span slot="icon" class="fa fa-smile-o"></span>
        我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>
<script>
export default {
  name: "home",
  data: function() {
    return {
      selected: "movie"
    };
  },
  methods: {},
  watch: {
    selected: function(newVal) {
      this.$router.replace({ name: newVal });
    }
  }
};
</script>
<style lang="less">
.mint-tabbar {
  height: 49px;
  .mint-tab-item {
    padding: 4px;
    .mint-tab-item-icon {
      margin-bottom: 3px;
    }
  }
}
</style>
