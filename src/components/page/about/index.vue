<template lang="html">
  <div class="page-about">
    <VueMarkdown class="markdown-body" :source="md" />
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import md from 'raw-loader!../../../../README.md'

export default {
  components: {VueMarkdown},
  data() {
    return {
      md,
    }
  },
}
</script>

<style lang="less" scoped>
.page-about {
  padding-top: 60px;
}

.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 45px;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}
</style>
