<template lang="html">
  <header class="header">
    <div class="name">
      <router-link :to="{name: 'home'}">北京-医保定点医院-可视化</router-link>
    </div>

    <div class="space"></div>

    <div class="links">
      <div class="item">
        <a href="https://github.com/magicdawn/bj-hospital-vis" target="_blank">GitHub</a>
      </div>

      <div class="item">
        <router-link :to="{name: 'about'}">About</router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.header {
  z-index: 2000;
  position: fixed;
  top: 0;
  width: 100vw;
  height: 60px;
  border-radius: 5px;

  background-color: fade(#aaa, 60%);
  color: #fff;

  display: flex;
  align-items: center;
}

.name {
  margin-left: 20px;
  font-size: 27px;
}

.space {
  flex: 1;
}

.links {
  margin-right: 20px;
  display: flex;
  align-items: center;

  .item {
    margin-left: 10px;
    &:first-child {
      margin-left: 0;
    }

    cursor: pointer;
    padding-left: 10px;
    padding-right: 10px;
    height: 60px;
    line-height: 60px;

    &:hover {
      background-color: #333;
      a {
        color: #fff;
      }
    }
  }
}
</style>
