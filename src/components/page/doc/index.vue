<template lang="html">
  <div class="page-doc">
    <VueMarkdown class="markdown-body" :source="source" v-if="source" />
    <div v-else>
      <h1>markdown source not founded</h1>
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

import about from 'raw-loader!../../../../README.md'
import changelog from 'raw-loader!../../../../CHANGELOG.md'

const sourceRegistry = {
  about,
  changelog,
}

export default {
  components: {VueMarkdown},
  data() {
    return {}
  },

  computed: {
    source() {
      const name = this.$route.params.name
      return sourceRegistry[name]
    },
  },
}
</script>

<style lang="less" scoped>
.page-doc {
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
