<template>
  <div class="search-container">
    <!-- 搜素栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 搜索结果 -->
    <SearchResult v-if="isResultShow" :search-text="searchText" />

    <!-- 联想建议  -->
    <SearchSuggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />

    <!-- 历史记录  -->
    <SearchHistory
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
      @update-histories="searchHistories = $event"
    />
  </div>
</template>

<script>
import SearchSuggestion from "./component/search-suggestion.vue";
import SearchHistory from "./component/search-history.vue";
import SearchResult from "./component/search-result.vue";
import { setItem, getItem } from "../../utils/storage";
import { getSearchHistories } from "../../api/search";
import { mapState } from "vuex";

export default {
  name: "searchIndex",
  props: {},
  data() {
    return {
      // 输入内容
      searchText: "",
      // 控制搜说结果的显示状态
      isResultShow: false,
      // 搜索历史记录
      searchHistories: [],
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {
    searchHistories() {
      setItem("search-histories", this.searchHistories);
    },
  },
  created() {
    this.loadSearchHistories();
  },
  methods: {
    onSearch(searchText) {
      this.searchText = searchText;

      const index = this.searchHistories.indexOf(searchText);
      if (index !== -1) {
        // 重复项删除
        this.searchHistories.splice(index, 1);
      }
      // 记录最新的搜索历史纪录
      this.searchHistories.unshift(searchText);

      // 如果用户已登录，则把搜索历史记录存储到线上
      // 如果用户未登录，则把搜索历史存储到本地
      // setItem("search-histories", this.searchHistories);

      // 展示搜索结果
      this.isResultShow = true;
    },
    async loadSearchHistories() {
      let searchHistories = getItem("search-histories") || [];

      if (this.user) {
        const { data } = await getSearchHistories();
        searchHistories = [
          ...new Set([...searchHistories, ...data.data.keywords]),
        ];
      }
      this.searchHistories = searchHistories;
    },
  },
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult,
  },
};
</script>

<style scoped lang="less"></style>
