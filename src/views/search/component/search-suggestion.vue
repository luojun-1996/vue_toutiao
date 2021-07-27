<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(str, index) in suggestions"
      :key="index"
      @click="$emit('search', str)"
    >
      <div slot="title" v-html="highlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from "@/api/search.js";
import { debounce } from "lodash";

export default {
  name: "searchSuggestion",
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      suggestions: [],
    };
  },
  watch: {
    // 属性名，要监视的数据的名称
    searchText: {
      handler: debounce(async function () {
        const { data } = await getSearchSuggestions(this.searchText);
        this.suggestions = data.data.options;
      }, 200),
      immediate: true,
    },
  },
  methods: {
    highlight(str) {
      return str.replace(
        new RegExp(this.searchText, "gi"),
        `<span style="color: red">${this.searchText}</span>`
      );
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
</style>
