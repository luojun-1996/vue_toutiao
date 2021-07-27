<template>
  <div class="article_list" ref="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ArticleItem
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/api/article";
import ArticleItem from "@/components/article_item";
import { debounce } from "lodash";

export default {
  name: "articleList",
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      articles: [],
      loading: false,
      finished: false,
      timestamp: null,
      isRefreshLoading: false,
      refreshSuccessText: "",
      scrollTop: 0, // 列表滚动到顶部的距离
    };
  },
  mounted() {
    const articleLIst = this.$refs["article-list"];
    articleLIst.onscroll = debounce(() => {
      this.scrollTop = articleLIst.scrollTop;
    }, 50);
  },
  activated() {
    this.$refs["article-list"].scrollTop = this.scrollTop;
  },
  methods: {
    async onLoad() {
      // 异步更新数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(),
        with_top: 1,
      });

      const { results } = data.data;
      this.articles.push(...results);

      this.loading = false;

      if (results.length) {
        this.timestamp = data.data.pre_timestamp;
      } else {
        this.finished = true;
      }
    },

    async onRefresh() {
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1,
      });

      const { results } = data.data;
      this.articles.push(...results);

      this.isRefreshLoading = false;

      this.refreshSuccessText = `更新了${results.length}条数据`;
    },
  },
  components: {
    ArticleItem,
  },
};
</script>

<style scoped lang="less">
.article_list {
  position: fixed;
  top: 90px;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow-y: auto;
}
</style>