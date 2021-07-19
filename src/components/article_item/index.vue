<template>
  <!-- <div class="article_item">文章列表项</div> -->

  <van-cell class="article_item">
    <div slot="title" class="title van-multi-ellipsis--l3">
      {{ article.title }}
    </div>

    <div slot="label">
      <div class="cover_wrap" v-if="article.cover.type === 3">
        <div
          class="cover_wrap_item"
          v-for="(img, index) in article.cover.images"
          :key="index"
        >
          <van-image class="cover_image" fit="cover" :src="img" />
        </div>
      </div>

      <div class="label_wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>

    <van-image
      class="right_cover"
      v-if="article.cover.type === 1"
      fit="cover"
      :src="article.cover.images[0]"
    />
  </van-cell>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="less">
.article_item {
  .title {
    font-size: 16px;
    color: #3a3a3a;
  }
  /deep/ .van-cell__value {
    flex: unset;
    width: 116px;
    height: 73px;
    margin-left: 12px;
  }
  .right_cover {
    width: 116px;
    height: 73px;
  }
  .cover_wrap {
    padding: 15px 0;
    display: flex;
    .cover_wrap_item {
      flex: 1;
      height: 73px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover_image {
        width: 100%;
        height: 73px;
      }
    }
  }

  .label_wrap {
    font-size: 11px;
    color: #b4b4b4;
  }
  .label_wrap span {
    margin-right: 12px;
  }
}
</style>
