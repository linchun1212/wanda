<template>
  <div class="saler">
    <header>
      <mt-header title="万达电影"> </mt-header>
      <mt-cell :title="cinemaName" @click.native="gotoCinemas" is-link>
        <span slot="icon" class="fa fa-map-marker"></span>
      </mt-cell>
    </header>
    <div class="saler_content">
      <div class="saler_list">
        <!-- 窗帘 -->
        <div class="curtains"></div>
        <div class="saler_item">
          <div class="saler_item_left">
            <ul>
              <template v-for="(item, index) in titles">
                <li
                  class="saler_item_leftTitle"
                  :key="item.id"
                  @click="changeItem(item.id)"
                  :class="{ active: index == currentIndex }"
                >
                  {{ item.title }}
                </li>
              </template>
            </ul>
          </div>
          <div class="saler_item_right">
            <div class="saler_item_title">
              {{ currentTitle }}
            </div>
            <div class="saler_item_contentlist">
              <template v-for="item in data">
                <saler-cell
                  :salerinfo="item"
                  :key="item.id"
                  @minus="minus(item.id)"
                  @add="add(item.id)"
                ></saler-cell>
              </template>
            </div>
          </div>
        </div>
        <template v-if="isShowCart">
          <div class="shopping-cart">
            <div class="shopping-cart-mask"></div>
            <div class="shopping-cart-list">
              <div class="shopping-cart-title">
                <span style="float:left;color:grey;">已选卖品</span>
                <span
                  @click="clearCart"
                  style="float:right;;color:grey;font-size:0.8rem;"
                  >清空购物车</span
                >
              </div>
              <div class="shopping-cart-content">
                <template v-for="item in filterCart(salerList)">
                  <cart-cell
                    :cartinfo="item"
                    :key="item.id"
                    @minus="minus(item.id)"
                    @add="add(item.id)"
                  ></cart-cell>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="saler_checkout">
        <div class="saler_checkout_info">
          <span
            class="saler_checkout_cart fa fa-shopping-cart"
            @click="toggleCartlist"
          >
          </span>
          <template v-if="totalCount > 0">
            <mt-badge class="badge" size="small">{{ totalCount }}</mt-badge>
          </template>
          <span class="saler_checkout_totalprice">￥{{ totalprice }}</span>
        </div>
        <div class="saler_checkout_btn">
          结算
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Http from "../http";
import { Indicator } from "mint-ui";
import SalerCell from "./SalerCell";
import CartCell from "./CartCell";
import store from "store";

export default {
  data: function() {
    return {
      cinemaName: "",
      salerList: [], //总数据源
      titles: [], //左边栏的数据源
      data: [], //salerCell的数据源
      currentTitle: "", //右边栏的标题，左侧选中的title内容会作为右边栏的标题
      currentIndex: 0, //左边栏点击的索引，默认为0,表示第一个
      totalprice: 0, //总价
      totalCount: 0, //总数量
      isShowCart: false //默认不显示购物车
    };
  },

  components: {
    SalerCell,
    CartCell
  },
  computed: {
    ...mapGetters("cinema", ["Cinema"])
  },
  methods: {
    // 清空购物车
    clearCart() {
      this.salerList.forEach(val => {
        val.data.forEach(function(item) {
          item.count = 0;
        });
      });
      this.salerCalcPrice();
    },
    // 过滤总数据源，将count为0的数据排除
    filterCart: function(val) {
      let cartlist = [];
      val.forEach(res => {
        res.data.forEach(function(item) {
          if (item.count > 0) {
            cartlist.push(item);
          }
        });
      });
      return cartlist;
    },
    // 显示隐藏购物车
    toggleCartlist() {
      // 如果总价为0表示没有买东西，也就是说购物车count都为0
      if (this.totalprice == 0) return;
      this.isShowCart = !this.isShowCart;
    },
    // 减法
    minus(itemId) {
      this.salerOperate(itemId, -1);
      this.salerCalcPrice();
    },
    // 加法
    add(itemId) {
      this.salerOperate(itemId, 1);
      this.salerCalcPrice();
    },
    salerOperate(itemId, count) {
      this.salerList.forEach(val => {
        val.data.forEach(function(item) {
          if (item.id == itemId) {
            item.count += count;
          }
        });
      });
    },
    // 计算总价和总数量
    salerCalcPrice() {
      let sum = 0;
      let count = 0;
      this.salerList.forEach(val => {
        val.data.forEach(item => {
          count += item.count;
          sum += item.count * item.price;
        });
      });
      this.totalprice = sum;
      this.totalCount = count;
      if (this.totalprice == 0) {
        this.isShowCart = false;
      }
    },
    // 点击左边的标题获取标题对应的数据
    changeItem(itemId) {
      this.salerList.forEach((val, index) => {
        if (val.id == itemId) {
          // 当前选中的title的索引
          this.currentIndex = index;
          this.currentTitle = val.title;
          this.data = val.data;
        }
      });
    },
    gotoCinemas: function() {
      let cityId = "123";
      this.$router.push({ name: "cinemas", params: { cityId } });
    },
    salerProduct() {
      Indicator.open("加载中");
      Http.product(result => {
        Indicator.close();
        // 获取总数据
        this.salerList = result.data.result;
        this.salerList.forEach((val, index) => {
          let id = val.id;
          let title = val.title;
          // 获取左边列表数据
          this.titles.push({ id, title });
          if (index == 0) {
            this.currentTitle = val.title;
            this.data = val.data;
          }
        });
      });
    }
  },
  mounted: function() {
    // this.cinemaName = this.Cinema.cinemaName;
    this.cinemaName = store.get("wanda_cinema").cinemaName;
    this.salerProduct();
  }
};
</script>
<style lang="less">
.saler {
  height: 100%;
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
  .saler_content {
    position: absolute;
    top: 85px;
    height: calc(100% - 134px);
    width: 100%;
    // overflow-y: scroll;

    .saler_list {
      height: calc(100% - 50px);
      position: relative;
      .curtains {
        width: 100%;
        height: 25px;
        background-image: url("../assets/image/border.png");
      }
      .saler_item {
        height: calc(100% - 25px);
        display: flex;
        .saler_item_left {
          flex: 2 0 auto;
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
          background-color: lightgoldenrodyellow;
          .saler_item_leftTitle {
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-bottom: 1px solid #ddd;
            color: grey;
            font-size: 0.8rem;
          }
          .active {
            background-color: white;
          }
        }
        .saler_item_right {
          flex: 6 1 auto;
          // overflow-x: hidden;
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
          .saler_item_title {
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-bottom: 1px solid #ddd;
          }
        }
      }
      .shopping-cart {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        .shopping-cart-mask {
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.4);
        }
        .shopping-cart-list {
          position: absolute;
          width: 100%;
          height: 100%;
          bottom: 0px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          .shopping-cart-title {
            height: 40px;
            line-height: 40px;
            background-color: aliceblue;

            padding-left: 10px;
            padding-right: 10px;
          }
          .shopping-cart-content {
            background-color: white;
            max-height: calc(100% - 100px);
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
          }
        }
      }
    }
    .saler_checkout {
      height: 50px;
      border-top: 1px solid #ddd;
      display: flex;
      .saler_checkout_info {
        flex: 3 0 auto;
        position: relative;
        .badge {
          position: absolute;
          left: 50px;
          top: -10px;
          z-index: 9;
        }
        .saler_checkout_cart {
          display: inline-block;
          text-align: center;
          line-height: 50px;
          position: absolute;
          top: -10px;
          left: 15px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 1.5rem;
          color: white;
          background-color: gray;
        }
        .saler_checkout_totalprice {
          display: inline-block;
          height: 50px;
          line-height: 50px;
          position: absolute;
          left: 80px;
          font-size: 1.5rem;
          color: goldenrod;
        }
      }
      .saler_checkout_btn {
        flex: 2 0 auto;
        text-align: center;
        line-height: 50px;
        background-color: goldenrod;
        color: white;
        font-size: 1.2rem;
        // font-weight: bolder;
      }
    }
  }
}
</style>
