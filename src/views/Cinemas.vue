<template>
  <div>
    <mt-header title="选择影院">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="cinemas">
      <div class="currCity" @click="gotoCity">
        <span>{{ currCity }}</span>
        <span class="fa fa-angle-down"></span>
      </div>
      <template v-for="item in cinemaList">
        <mt-cell
          :title="item.cinemaName"
          :label="item.address"
          :key="item.id"
          @click.native="gotoHome(item)"
        ></mt-cell>
      </template>
    </div>
  </div>
</template>
<script>
import Http from "../http";
import { Indicator } from "mint-ui";
import { mapGetters, mapActions } from "vuex";
import store from "store";

export default {
  name: "cinema",
  data: function() {
    return {
      currCity: "",
      cinemaList: []
    };
  },
  computed: {
    ...mapGetters("city", ["City"])
  },
  methods: {
    ...mapActions("cinema", ["actCinema"]),
    gotoHome: function(cinemaInfo) {
      store.set("wanda_cinema", cinemaInfo);
      this.actCinema(cinemaInfo); //将当前选中的电影院信息存储到store中
      // 从影院列表去首页，首页根据当前的影院id来加载对应的数据
      this.$router.push({ name: "movie", params: { cinemaId: cinemaInfo.id } });
    },
    gotoCity: function() {
      this.$router.push({ name: "city" });
    }
  },
  mounted: function() {
    // 从store中获取当前城市的信息
    this.currCity = store.get("wanda_city").city_name;
    // this.currCity = this.City.city_name;
    // console.log(this.$route.params);
    Indicator.open("加载中");
    Http.cinemas(result => {
      Indicator.close();
      this.cinemaList = result.data.data;
    });
  }
};
</script>
<style lang="less">
.cinemas {
  position: absolute;
  top: 40px;
  width: 100%;
  height: calc(100% - 40px);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.currCity {
  height: 40px;
  line-height: 40px;
  background-color: #ccc;
  padding-left: 10px;
}
.mint-cell {
  height: 70px;
  //   line-height: 80px;
  display: flex;
  align-content: center;
}
.mint-cell-wrapper {
  height: 100%;
}
.mint-cell-title {
  width: 100%;
}
.mint-cell-label {
  margin-top: 10px !important;
  width: 90% !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
</style>
