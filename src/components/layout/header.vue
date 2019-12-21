<template lang="html">
  <header class="header">
    <div class="name">
      北京-医保定点医院-可视化
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
</style>
