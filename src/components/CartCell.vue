<template>
  <div class="cartcell">
    <div class="cartcell-title">{{ cartinfo.title }}</div>
    <div class="cartcell-price">￥{{ cartinfo.price }}</div>
    <div class="cartcell-calc">
      <div class="cartcell-minus fa fa-minus-circle" @click="minus"></div>
      <div class="cartcell-count">{{ cartinfo.count }}</div>
      <div class="cartcell-add fa fa-plus-circle" @click="add"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["cartinfo"],
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
.cartcell {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  .cartcell-title {
    flex: 0 0 50%;
    padding-left: 10px;
  }
  .cartcell-price {
    flex: 3 0 auto;
    font-size: 1.2rem;
  }
  .cartcell-calc {
    padding-right: 10px;
    flex: 2 0 auto;
    display: flex;
    justify-content: space-between;

    .cartcell-minus,
    .cartcell-add {
      color: goldenrod;
      font-size: 1.5rem;
    }
    .cartcell-count {
      font-size: 1.2rem;
    }
  }
}
</style>
