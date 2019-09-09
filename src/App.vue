<template>
  <div id="app">
    <keep-alive exclude="cinema,home">
      <router-view class="container"></router-view>
    </keep-alive>
  </div>
</template>

<style lang="less">
.container {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
