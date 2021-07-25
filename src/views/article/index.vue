<template>
  <div class="article-container">
    <!-- NavBar导航栏部分start -->
    <van-nav-bar title="文章详情" left-arrow @click-left="$router.back()" />
    <!-- NavBar导航栏部分end -->

    <h1 class="title">文章标题</h1>

    <van-cell center class="user-info">
      <div slot="title" class="name">天涯小型客</div>
      <van-image
        class="avatar"
        slot="icon"
        round
        fit="cover"
        src="https://img01.yzcdn.cn/vant/cat.jpeg"
      />
      <div slot="label" class="pubdate">14小时前</div>
      <van-button class="follow-btn" type="info" icon="plus" round size="small"
        >关注</van-button
      >
    </van-cell>
    <!-- 正文 start -->
    <div class="markdown-body">
      <p>hello</p>
      <p>world</p>
    </div>
    <!-- 正文 end -->
  </div>
</template>

<script>
import "./github-markdown.css";
import { getArticleById } from "@/api/article";

export default {
  name: "articleIndex",
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true,
    },
  },
  data() {
    return {};
  },
  created() {
    this.loadAtricle();
  },
  methods: {
    async loadAtricle() {
      const { data } = await getArticleById(this.articleId);
      console.log(data);
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;
  background-color: #fff;
  margin: 0;
}

.user-info {
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .name {
    font-size: 12px;
    color: #333333;
  }
  .pubdate {
    font-size: 12px;
    color: #b4b4b4;
  }
  .follow-btn {
    width: 85px;
    height: 29px;
  }
}

.markdown-body {
  padding: 14px;
  background-color: #fff;
}
</style>
